'use client';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className="max-w-[85%] px-4 py-2.5 text-sm leading-relaxed shadow-sm"
        style={
          isUser
            ? {
                backgroundColor: '#006C4A',
                color: '#ffffff',
                borderRadius: '12px 12px 4px 12px',
              }
            : {
                backgroundColor: '#ffffff',
                color: '#191c1e',
                border: '1px solid #C6C6CB',
                borderRadius: '4px 12px 12px 12px',
              }
        }
      >
        <p className="whitespace-pre-wrap font-grotesk">{content}</p>
      </div>
    </div>
  );
}
