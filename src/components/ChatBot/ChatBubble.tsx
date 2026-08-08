'use client';

/* eslint-disable @next/next/no-img-element */

interface ChatBubbleProps {
  onClick: () => void;
  hasOpened: boolean;
  isOpen: boolean;
}

export default function ChatBubble({ onClick, hasOpened, isOpen }: ChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Đóng chat' : 'Mở chat'}
      className="group fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 focus:outline-none"
      style={{
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      }}
    >
      {isOpen ? (
        /* Close icon when chat is open */
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: '#0D1117' }}
        >
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      ) : (
        /* Avatar when chat is closed */
        <span className="relative">
          <img
            src="/chatbot-avatar.jpg"
            alt="Hoàng Yến AI"
            className="h-14 w-14 rounded-full object-cover border-2 border-white"
          />
          {/* Pulse ring — only when chat has never been opened */}
          {!hasOpened && (
            <span className="absolute inset-0 rounded-full animate-ping border-2 border-[#006C4A] opacity-50" />
          )}
        </span>
      )}
    </button>
  );
}
