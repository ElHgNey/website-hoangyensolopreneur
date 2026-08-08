import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { join } from 'path';

// ── Read knowledge base once at module init ──────────────────────────
let knowledgeBase: string;
try {
  knowledgeBase = readFileSync(
    join(process.cwd(), 'src', 'app', 'chatbot_data.txt'),
    'utf-8',
  );
} catch {
  knowledgeBase = '';
  console.error('[chatbot] Could not read chatbot_data.txt');
}

// ── System prompt ────────────────────────────────────────────────────
const SYSTEM_PROMPT = `${knowledgeBase}

---
Bạn là trợ lý AI của chuyên gia Hoàng Yến — chuyên gia AI & Tự động hóa.

Quy tắc:
1. Tông giọng: chuyên gia, lịch sự, thân thiện. Xưng "tôi", gọi người dùng "bạn".
2. Song ngữ: phát hiện ngôn ngữ của câu hỏi (Tiếng Việt hoặc Tiếng Anh) và trả lời bằng cùng ngôn ngữ đó.
3. Chỉ trả lời dựa trên knowledge base phía trên. Nếu câu hỏi nằm ngoài phạm vi, hãy lịch sự cho biết và hướng dẫn liên hệ trực tiếp Hoàng Yến Solopreneur để được tư vấn chi tiết.
4. Trả lời ngắn gọn, rõ ràng, đi vào trọng tâm.`;

export const maxDuration = 30;

export async function POST(req: Request) {
  // ── Validate API key ───────────────────────────────────────────────
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response('Configuration error', { status: 500 });
  }

  // Never answer without the knowledge base — a missing file would otherwise
  // degrade the bot into a generic assistant without any visible failure.
  if (!knowledgeBase.trim()) {
    console.error('[chatbot] Knowledge base is empty — refusing to answer');
    return new Response('Configuration error', { status: 500 });
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  });

  try {
    const { messages } = await req.json();

    // Sanitize: strip HTML, enforce 500-char limit, cap to 20 messages
    const sanitized = (messages as { role: string; content: string }[])
      .slice(-20)
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content.replace(/<[^>]*>/g, '').slice(0, 500),
      }));

    const response = await openai.chat.completions.create({
      model: 'gemini-3.5-flash-lite',
      stream: true,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...sanitized,
      ],
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
        } catch (err) {
          console.error('[chatbot] Stream error:', err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('[chatbot] API error:', error);
    return new Response('Service temporarily unavailable', { status: 500 });
  }
}
