# AI Chatbot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate a floating AI chatbot into the Hoàng Yến landing page, powered by Gemini API (OpenAI-compatible), with streaming responses and bilingual support.

**Architecture:** Next.js 16 API route (`/api/chat`) receives conversation history, prepends system prompt from `chatbot_data.txt`, calls Gemini API, and streams tokens back via `ReadableStream`. Client-side `ChatBot` component renders a floating bubble + popup chat window with real-time streaming display.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind 4, Gemini API (OpenAI-compatible endpoint), Web Streams API. No external chat/AI libraries.

**Spec:** `docs/superpowers/specs/2026-08-08-ai-chatbot-design.md`

**Note on testing:** This project has no test infrastructure (no jest/vitest). Tasks focus on implementation + manual browser verification. The dev server is started via `npm run dev` (port 3000).

---

## File map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/app/api/chat/route.ts` | API route: receive messages, call Gemini, stream response |
| Create | `src/components/ChatBot/ChatBot.tsx` | Main container: state management, toggle, dynamic import wrapper |
| Create | `src/components/ChatBot/ChatBubble.tsx` | Floating button with logo, pulse animation |
| Create | `src/components/ChatBot/ChatWindow.tsx` | Chat popup: header, messages, quick replies, input |
| Create | `src/components/ChatBot/ChatMessage.tsx` | Single message bubble (bot/user), streaming cursor |
| Create | `src/app/chatbot_data.txt` | Knowledge base content for system prompt |
| Create | `.env.example` | Template for GEMINI_API_KEY |
| Copy   | `public/chatbot-avatar.jpg` | Logo from user's local file |
| Modify | `.env.local` | Add GEMINI_API_KEY line |
| Modify | `src/app/layout.tsx` | Import + render ChatBot |
| Modify | `src/app/globals.css` | Add chatbot animations |

---

### Task 1: Setup — env, data file, logo

**Files:**
- Create: `.env.example`
- Create: `src/app/chatbot_data.txt`
- Copy: `public/chatbot-avatar.jpg` from `C:\Users\michelle\Downloads\Telegram Desktop\hoangyenlogo.jpg`
- Modify: `.env.local` — append `GEMINI_API_KEY=`

- [ ] **Step 1: Create `.env.example`**

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini (OpenAI-compatible)
GEMINI_API_KEY=your_gemini_api_key_here
```

- [ ] **Step 2: Add `GEMINI_API_KEY` to `.env.local`**

Append to the existing `.env.local` (which already has Supabase keys):

```
GEMINI_API_KEY=
```

Leave value blank — user fills in their key.

- [ ] **Step 3: Create `src/app/chatbot_data.txt`**

```
Tên chuyên gia: Hoàng Yến
Định vị thương hiệu: Chuyên gia AI & Tự động hóa
Giải pháp cung cấp: Triển khai & Xây dựng hệ thống AI cho doanh nghiệp, Đào tạo xây dựng hệ thống trợ lý AI cá nhân (lãnh đạo cấp cao C-level)
Khóa học nổi bật: Khóa K89 - Thực chiến Agentic AI & Tự động hóa (Thời gian học: 12 buổi, hình thức Online Zoom).
Liên hệ tư vấn: Hoàng Yến Solopreneur
```

- [ ] **Step 4: Copy logo to `public/chatbot-avatar.jpg`**

```bash
cp "C:\Users\michelle\Downloads\Telegram Desktop\hoangyenlogo.jpg" "D:\AgentWorkspace\website-hoangyensoloprenuer\public\chatbot-avatar.jpg"
```

- [ ] **Step 5: Verify files exist**

```bash
ls -la .env.example src/app/chatbot_data.txt public/chatbot-avatar.jpg
```

- [ ] **Step 6: Commit**

```bash
git add .env.example src/app/chatbot_data.txt public/chatbot-avatar.jpg
git commit -m "chore: add chatbot data file, env template, and avatar"
```

Do NOT commit `.env.local`.

---

### Task 2: API route — `/api/chat`

**Files:**
- Create: `src/app/api/chat/route.ts`

**Context:** Next.js 16 route handlers use standard Web `Request`/`Response`. Streaming uses `ReadableStream`. The Gemini API at `https://generativelanguage.googleapis.com/v1beta/openai` accepts OpenAI-compatible `POST /chat/completions` with `stream: true`. The response is SSE format (`data: {...}\n\n`).

- [ ] **Step 1: Create `src/app/api/chat/route.ts`**

```typescript
import { promises as fs } from "fs";
import path from "path";

const GEMINI_BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai";
const MODEL = "gemini-3.5-flash-lite";
const MAX_MESSAGES = 20;
const MAX_INPUT_LENGTH = 500;

let cachedSystemPrompt: string | null = null;

async function getSystemPrompt(): Promise<string> {
  if (cachedSystemPrompt) return cachedSystemPrompt;

  const dataPath = path.join(process.cwd(), "src", "app", "chatbot_data.txt");
  const knowledge = await fs.readFile(dataPath, "utf-8");

  cachedSystemPrompt = `Bạn là trợ lý AI của chuyên gia Hoàng Yến — Chuyên gia AI & Tự động hóa.

Quy tắc:
- Tông giọng: chuyên gia, lịch sự, thân thiện nhưng chuyên nghiệp.
- Ngôn ngữ: Tự động nhận diện ngôn ngữ câu hỏi (Việt hoặc Anh) và trả lời bằng cùng ngôn ngữ đó.
- Chỉ trả lời dựa trên thông tin được cung cấp bên dưới. Nếu không biết, hãy hướng dẫn liên hệ trực tiếp Hoàng Yến Solopreneur để được tư vấn chi tiết.
- Trả lời ngắn gọn, súc tích, tập trung vào giá trị.
- Không bịa đặt thông tin không có trong knowledge base.

Thông tin chuyên gia:
${knowledge}`;

  return cachedSystemPrompt;
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Configuration error" },
      { status: 500 }
    );
  }

  let body: { messages?: Array<{ role: string; content: string }> };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const userMessages = body.messages;
  if (!Array.isArray(userMessages) || userMessages.length === 0) {
    return Response.json({ error: "Messages required" }, { status: 400 });
  }

  const lastMessage = userMessages[userMessages.length - 1];
  if (
    typeof lastMessage.content !== "string" ||
    lastMessage.content.length > MAX_INPUT_LENGTH
  ) {
    return Response.json(
      { error: "Message too long (max 500 characters)" },
      { status: 400 }
    );
  }

  const systemPrompt = await getSystemPrompt();

  const messages = [
    { role: "system", content: systemPrompt },
    ...userMessages.slice(-MAX_MESSAGES).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: stripHtml(String(m.content)).slice(0, MAX_INPUT_LENGTH),
    })),
  ];

  const geminiResponse = await fetch(
    `${GEMINI_BASE_URL}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: true,
        max_tokens: 1024,
      }),
    }
  );

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text().catch(() => "Unknown error");
    console.error("Gemini API error:", geminiResponse.status, errorText);
    return Response.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }

  const geminiBody = geminiResponse.body;
  if (!geminiBody) {
    return Response.json(
      { error: "No response stream" },
      { status: 500 }
    );
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const reader = geminiBody.getReader();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
            break;
          }

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            const data = trimmed.slice(6);
            if (data === "[DONE]") {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ content })}\n\n`
                  )
                );
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      } catch (error) {
        console.error("Stream error:", error);
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

- [ ] **Step 2: Verify the route compiles**

Start dev server and test with curl:

```bash
cd D:\AgentWorkspace\website-hoangyensoloprenuer && npm run dev
```

Then in another terminal (only works after user adds API key):

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Xin chào"}]}'
```

Expected: streaming SSE response with `data: {"content":"..."}` chunks, or `{"error":"Configuration error"}` if no API key yet.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/chat/route.ts
git commit -m "feat: add /api/chat route with Gemini streaming"
```

---

### Task 3: ChatMessage component

**Files:**
- Create: `src/components/ChatBot/ChatMessage.tsx`

- [ ] **Step 1: Create `src/components/ChatBot/ChatMessage.tsx`**

```tsx
"use client";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({
  role,
  content,
  isStreaming,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-3 text-[15px] leading-relaxed ${
          isUser
            ? "rounded-[12px_12px_4px_12px] bg-emerald text-white"
            : "rounded-[12px_12px_12px_4px] border border-subtle/30 bg-paper text-on-surface"
        }`}
      >
        <p className="whitespace-pre-wrap break-words font-serif">
          {content}
          {isStreaming && (
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-text-bottom" />
          )}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ChatBot/ChatMessage.tsx
git commit -m "feat: add ChatMessage component"
```

---

### Task 4: ChatWindow component

**Files:**
- Create: `src/components/ChatBot/ChatWindow.tsx`

**Context:** This is the main chat popup. It renders the header (with avatar + name + close button), scrollable message list, quick reply buttons (shown only before user's first message), and the text input area. It handles the fetch-and-stream logic when user sends a message.

- [ ] **Step 1: Create `src/components/ChatBot/ChatWindow.tsx`**

```tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "./ChatMessage";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING =
  "Xin chào! Tôi là trợ lý AI của chuyên gia Hoàng Yến — Chuyên gia AI & Tự động hóa. Tôi có thể giúp bạn tìm hiểu về các giải pháp AI cho doanh nghiệp, chương trình đào tạo, hoặc kết nối với Hoàng Yến để tư vấn chi tiết. Bạn muốn hỏi gì?";

const QUICK_REPLIES = [
  "Giải pháp AI cho doanh nghiệp",
  "Đào tạo giải pháp AI C-level",
  "Liên hệ tư vấn",
];

interface ChatWindowProps {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasUserMessage = messages.some((m) => m.role === "user");

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMessage: Message = { role: "user", content: trimmed };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);
      setStreamingContent("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || "Đã xảy ra lỗi. Vui lòng thử lại."
          );
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No stream");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;

            const data = trimmedLine.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulated += parsed.content;
                setStreamingContent(accumulated);
              }
            } catch {
              // skip
            }
          }
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: accumulated },
        ]);
        setStreamingContent("");
      } catch (error) {
        const errMsg =
          error instanceof Error
            ? error.message
            : "Đã xảy ra lỗi. Vui lòng thử lại.";
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: errMsg },
        ]);
        setStreamingContent("");
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 96) + "px";
  };

  return (
    <div className="fixed bottom-24 right-6 z-[9998] flex h-[550px] w-[400px] flex-col overflow-hidden rounded-2xl border border-subtle/20 bg-slate-bg shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-[768px]:bottom-0 max-[768px]:right-0 max-[768px]:h-[85vh] max-[768px]:w-full max-[768px]:rounded-b-none">
      {/* Header */}
      <div className="flex items-center gap-3 bg-onyx px-4 py-3">
        <img
          src="/chatbot-avatar.jpg"
          alt="Hoàng Yến"
          className="h-8 w-8 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-grotesk text-sm font-semibold text-white">
            Hoàng Yến AI
          </p>
          <p className="text-xs text-white/60">Online</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Đóng chat"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}

        {streamingContent && (
          <ChatMessage
            role="assistant"
            content={streamingContent}
            isStreaming
          />
        )}

        {isLoading && !streamingContent && (
          <div className="mb-3 flex justify-start">
            <div className="rounded-[12px_12px_12px_4px] border border-subtle/30 bg-paper px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted/50 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted/50 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted/50 [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* Quick replies */}
        {!hasUserMessage && !isLoading && (
          <div className="mt-2 flex flex-wrap gap-2">
            {QUICK_REPLIES.map((text) => (
              <button
                key={text}
                onClick={() => sendMessage(text)}
                className="rounded-full border border-emerald/30 px-3 py-1.5 font-grotesk text-xs font-medium text-emerald transition-all hover:bg-emerald/10"
              >
                {text}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-subtle/20 bg-paper px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi tôi bất kỳ điều gì..."
            rows={1}
            maxLength={500}
            className="flex-1 resize-none bg-transparent font-serif text-sm text-on-surface outline-none placeholder:text-muted/50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald text-white transition-all hover:bg-emerald/90 disabled:opacity-30 disabled:hover:bg-emerald"
            aria-label="Gửi tin nhắn"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 12V4M4 8l4-4 4 4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ChatBot/ChatWindow.tsx
git commit -m "feat: add ChatWindow component with streaming"
```

---

### Task 5: ChatBubble component

**Files:**
- Create: `src/components/ChatBot/ChatBubble.tsx`

- [ ] **Step 1: Create `src/components/ChatBot/ChatBubble.tsx`**

```tsx
"use client";

interface ChatBubbleProps {
  onClick: () => void;
  hasBeenOpened: boolean;
}

export default function ChatBubble({
  onClick,
  hasBeenOpened,
}: ChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 ${
        !hasBeenOpened ? "animate-chatbot-pulse" : ""
      }`}
      aria-label="Mở chat với Hoàng Yến AI"
    >
      <img
        src="/chatbot-avatar.jpg"
        alt="Chat"
        className="h-full w-full rounded-full object-cover"
      />
    </button>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ChatBot/ChatBubble.tsx
git commit -m "feat: add ChatBubble floating button"
```

---

### Task 6: ChatBot container + integrate into layout

**Files:**
- Create: `src/components/ChatBot/ChatBot.tsx`
- Modify: `src/app/layout.tsx` — add dynamic import of ChatBot
- Modify: `src/app/globals.css` — add chatbot animations

- [ ] **Step 1: Create `src/components/ChatBot/ChatBot.tsx`**

```tsx
"use client";

import { useState } from "react";
import ChatBubble from "./ChatBubble";
import ChatWindow from "./ChatWindow";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);

  const toggle = () => {
    setIsOpen((prev) => !prev);
    if (!hasBeenOpened) setHasBeenOpened(true);
  };

  return (
    <>
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      {!isOpen && (
        <ChatBubble onClick={toggle} hasBeenOpened={hasBeenOpened} />
      )}
    </>
  );
}
```

- [ ] **Step 2: Add chatbot animations to `src/app/globals.css`**

Append to the end of `globals.css`:

```css
@keyframes chatbot-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 108, 74, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(0, 108, 74, 0); }
}

.animate-chatbot-pulse {
  animation: chatbot-pulse 2s ease-in-out infinite;
}
```

- [ ] **Step 3: Modify `src/app/layout.tsx` — import ChatBot with dynamic import**

Add import at top (after existing imports):

```tsx
import dynamic from "next/dynamic";

const ChatBot = dynamic(() => import("@/components/ChatBot/ChatBot"), {
  ssr: false,
});
```

Add `<ChatBot />` inside `<body>`, after `{children}`:

The body content should become:

```tsx
<body className="font-serif antialiased">
  <HashScrollHandler />
  {children}
  <ChatBot />
</body>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ChatBot/ChatBot.tsx src/app/globals.css src/app/layout.tsx
git commit -m "feat: integrate ChatBot into layout with animations"
```

---

### Task 7: Browser verification

- [ ] **Step 1: Start dev server**

```bash
cd D:\AgentWorkspace\website-hoangyensoloprenuer && npm run dev
```

- [ ] **Step 2: Open browser and verify**

Navigate to `http://localhost:3000`. Check:

1. Floating bubble appears bottom-right with logo
2. Pulse animation plays on the bubble
3. Click bubble → chat window opens with greeting message
4. Quick reply buttons visible: "Giải pháp AI cho doanh nghiệp", "Đào tạo giải pháp AI C-level", "Liên hệ tư vấn"
5. Close button works
6. Input field accepts text, Enter sends
7. Navigate to `/blog` — chatbot still visible

- [ ] **Step 3: Test with API key**

After user adds API key to `.env.local`, restart dev server and test:

1. Type a message → should stream response token by token
2. Click a quick reply → should send and get response
3. Try Vietnamese and English messages → should respond in same language
4. Try message > 500 chars → should get error
5. Mobile responsive: resize to < 768px → chat window should go full-width

- [ ] **Step 4: Fix any issues found during verification**

---

### Task 8: Deploy

- [ ] **Step 1: Add GEMINI_API_KEY to Vercel environment variables**

User must add `GEMINI_API_KEY` in Vercel project settings → Environment Variables before deploying.

- [ ] **Step 2: Deploy to production**

```bash
cd D:\AgentWorkspace\website-hoangyensoloprenuer
vercel deploy --prod --yes --token="$(cat .vercel/.token)"
```

- [ ] **Step 3: Verify on production URL**

Open `https://website-hoangyensolopreneur.vercel.app` and test chatbot end-to-end.
