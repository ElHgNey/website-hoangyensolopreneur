'use client';

import { useState } from 'react';
import ChatBubble from './ChatBubble';
import ChatWindow from './ChatWindow';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const GREETING =
  'Xin chào! Tôi là trợ lý AI của chuyên gia Hoàng Yến — chuyên gia AI & Tự động hóa. Tôi có thể giúp bạn tìm hiểu về các giải pháp AI cho doanh nghiệp, chương trình đào tạo, hoặc kết nối với Hoàng Yến để tư vấn chi tiết. Bạn muốn hỏi gì?';

const QUICK_REPLIES = [
  'Giải pháp AI cho doanh nghiệp',
  'Đào tạo giải pháp AI C-level',
  'Liên hệ tư vấn',
];

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const openChat = () => {
    if (!hasOpened) {
      setMessages([{ role: 'assistant', content: GREETING }]);
      setHasOpened(true);
    }
    setIsOpen(true);
  };

  const closeChat = () => setIsOpen(false);
  const toggleChat = () => (isOpen ? closeChat() : openChat());

  const sendMessage = async (text: string) => {
    const sanitized = stripHtml(text).slice(0, 500).trim();
    if (!sanitized || isLoading) return;

    const userMsg: Message = { role: 'user', content: sanitized };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Cap to last 20 messages sent to API
      const apiMessages = updatedMessages.slice(-20);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content:
              errorText === 'Configuration error'
                ? 'Xin lỗi, hệ thống đang gặp lỗi cấu hình. Vui lòng liên hệ quản trị viên.'
                : 'Xin lỗi, dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
          },
        ]);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          // stream: true keeps multi-byte characters intact when a Vietnamese
          // diacritic is split across two network chunks.
          const text = decoder.decode(value, { stream: true });
          assistantContent += text;
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = {
              role: 'assistant',
              content: assistantContent,
            };
            return newMessages;
          });
        }
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Xin lỗi, đã xảy ra lỗi kết nối. Vui lòng thử lại sau.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          quickReplies={!hasOpened || messages.length <= 1 ? QUICK_REPLIES : []}
          onSend={sendMessage}
          onClose={closeChat}
        />
      )}
      <ChatBubble onClick={toggleChat} hasOpened={hasOpened} isOpen={isOpen} />
    </>
  );
}
