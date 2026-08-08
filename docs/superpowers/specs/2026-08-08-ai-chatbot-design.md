# AI Chatbot Integration — Design Spec

## Overview

Tích hợp AI chatbot floating bubble vào landing page Hoàng Yến Solopreneur. Chatbot sử dụng Gemini API (OpenAI-compatible) với knowledge base tĩnh, hỗ trợ song ngữ Việt/Anh, tông chuyên gia lịch sự.

## Architecture

```
User (Browser)
  │
  ├── ChatBot component (client-side)
  │     ├── ChatBubble — floating button, logo Hoàng Yến
  │     ├── ChatWindow — popup container
  │     ├── ChatMessage — render tin nhắn + streaming
  │     └── State: messages[], isOpen, isLoading
  │
  └── POST /api/chat
        ├── Reads chatbot_data.txt as system prompt
        ├── Calls Gemini API (OpenAI-compatible)
        │     Base URL: https://generativelanguage.googleapis.com/v1beta/openai
        │     Model: gemini-3.5-flash-lite
        └── Streams response back via ReadableStream
```

## Files to create

| File | Purpose |
|------|---------|
| `src/components/ChatBot/ChatBot.tsx` | Main container, state management, đặt trong layout.tsx |
| `src/components/ChatBot/ChatBubble.tsx` | Floating button góc phải dưới, logo Hoàng Yến |
| `src/components/ChatBot/ChatWindow.tsx` | Popup: header + message list + input + quick replies |
| `src/components/ChatBot/ChatMessage.tsx` | Render từng tin nhắn, hỗ trợ streaming text |
| `src/app/api/chat/route.ts` | API route handler, gọi Gemini, stream response |
| `src/app/chatbot_data.txt` | Knowledge base content |
| `.env.example` | Template: `GEMINI_API_KEY=your_key_here` |

## Files to modify

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Import + render `<ChatBot />` trong body |

## Design tokens (match existing)

- **Onyx** `#0D1117` — chat header bg, bubble fallback
- **Emerald** `#006C4A` — user message bg, accent
- **Paper** `#ffffff` — bot message bg
- **Subtle** `#C6C6CB` — borders
- **Slate BG** `#F8FAFC` — chat window bg
- **Muted** `#45474B` — secondary text
- **Font UI**: Hanken Grotesk (var `--font-hanken-grotesk`)
- **Font body**: Source Serif 4 (var `--font-source-serif-4`)

## ChatBubble

- Position: `fixed`, bottom-right (bottom: 24px, right: 24px)
- Size: 56px circle
- Content: logo Hoàng Yến (`/chatbot-avatar.jpg` trong public/)
- Hover: scale(1.05) + subtle shadow
- Pulse animation nhẹ khi chưa mở lần nào (attract attention)
- Click: toggle ChatWindow
- Z-index: 9999

## ChatWindow

- Position: fixed, bottom: 96px, right: 24px
- Size: 400px width x 550px height (desktop)
- Mobile (<768px): width 100vw, height 85vh, bottom 0, right 0
- Border-radius: 16px (desktop), 16px 16px 0 0 (mobile)
- Shadow: `0 20px 60px rgba(0,0,0,0.15)`
- Animation: scale + fade-in từ bubble position

### Header
- Background: onyx `#0D1117`
- Avatar nhỏ (32px) + tên "Hoàng Yến AI" + status "Online"
- Nút close (X) bên phải

### Message list
- Scroll area, auto-scroll xuống bottom khi có tin mới
- Bot messages: bg white, border subtle, border-radius 12px (trừ top-left 4px)
- User messages: bg emerald, text white, border-radius 12px (trừ top-right 4px)
- Typing indicator: 3 dots animation khi đang stream

### Quick replies
- Hiển thị khi mở lần đầu, dưới greeting message
- 3 buttons: "Giải pháp AI cho doanh nghiệp", "Đào tạo giải pháp AI C-level", "Liên hệ tư vấn"
- Style: border emerald, text emerald, bg transparent, hover bg emerald/10
- Click: gửi text đó như user message

### Input area
- Textarea 1 dòng, auto-expand đến max 4 dòng
- Placeholder: "Hỏi tôi bất kỳ điều gì..."
- Send button: icon arrow-up, bg emerald, chỉ active khi có text
- Enter gửi, Shift+Enter xuống dòng

## API Route (`/api/chat`)

### Request
```json
{
  "messages": [
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ]
}
```

### Logic
1. Read `chatbot_data.txt` nội dung làm system prompt
2. Prepend system message với instructions:
   - Persona: trợ lý AI của chuyên gia Hoàng Yến
   - Tông: chuyên gia, lịch sự, thân thiện
   - Song ngữ: detect ngôn ngữ câu hỏi, trả lời cùng ngôn ngữ
   - Giới hạn: chỉ trả lời dựa trên knowledge base, nếu không biết thì hướng dẫn liên hệ trực tiếp
3. Call Gemini API via OpenAI-compatible endpoint
4. Stream response via ReadableStream (text/event-stream)

### Response
Server-Sent Events stream, mỗi chunk là JSON:
```
data: {"content": "token text"}
data: [DONE]
```

### Error handling
- Missing API key: 500 + message "Configuration error"
- API error: 500 + message "Service temporarily unavailable"
- Rate limit: giữ nguyên error từ upstream

## chatbot_data.txt

```
Tên chuyên gia: Hoàng Yến
Định vị thương hiệu: Chuyên gia AI & Tự động hóa
Giải pháp cung cấp: Triển khai & Xây dựng hệ thống AI cho doanh nghiệp, Đào tạo xây dựng hệ thống trợ lý AI cá nhân (lãnh đạo cấp cao C-level)
Khóa học nổi bật: Khóa K89 - Thực chiến Agentic AI & Tự động hóa (Thời gian học: 12 buổi, hình thức Online Zoom).
Liên hệ tư vấn: Hoàng Yến Solopreneur
```

## .env.example

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Greeting message

Khi mở chatbot lần đầu, bot tự gửi:
> "Xin chào! Tôi là trợ lý AI của chuyên gia Hoàng Yến — chuyên gia AI & Tự động hóa. Tôi có thể giúp bạn tìm hiểu về các giải pháp AI cho doanh nghiệp, chương trình đào tạo, hoặc kết nối với Hoàng Yến để tư vấn chi tiết. Bạn muốn hỏi gì?"

## Responsive behavior

| Breakpoint | Behavior |
|------------|----------|
| >= 768px | Popup 400x550px, bottom-right corner |
| < 768px | Full-width, 85vh height, slide-up from bottom |

## Performance

- ChatBot component: dynamic import với `next/dynamic`, ssr: false
- chatbot_data.txt: đọc 1 lần khi API route init (cache in-memory)
- No external chat libraries — vanilla React + fetch streaming

## Security

- API key chỉ ở server-side (.env.local), không bao giờ expose client
- Input sanitization: strip HTML tags từ user input
- Max message length: 500 characters
- Max conversation history gửi API: 20 messages gần nhất (tránh token overflow)

## Out of scope

- Persistent chat history (localStorage/database)
- File upload
- Voice input
- Analytics/tracking
- Admin dashboard
