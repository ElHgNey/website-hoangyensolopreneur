'use client';

/* eslint-disable @next/next/no-img-element */

import { useRef, useEffect, useState, useCallback } from 'react';
import ChatMessage from './ChatMessage';
import type { Message } from './ChatBot';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  quickReplies: string[];
  onSend: (text: string) => void;
  onClose: () => void;
}

export default function ChatWindow({
  messages,
  isLoading,
  quickReplies,
  onSend,
  onClose,
}: ChatWindowProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea up to 4 lines
  const adjustTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = 20;
    const maxHeight = lineHeight * 4;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, []);

  useEffect(() => {
    adjustTextarea();
  }, [input, adjustTextarea]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <div
      className="chatbot-window-override fixed z-[9999] flex flex-col overflow-hidden font-grotesk"
      style={{
        /* Desktop */
        bottom: 96,
        right: 24,
        width: 400,
        height: 550,
        borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        backgroundColor: '#F8FAFC',
        animation: 'chatWindowIn 0.25s ease-out',
      }}
    >
      {/* --- Responsive overrides via inline media query --- */}
      <style>{`
        @keyframes chatWindowIn {
          from { opacity: 0; transform: scale(0.9) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @media (max-width: 767px) {
          .chatbot-window-override {
            width: 100vw !important;
            height: 85vh !important;
            bottom: 0 !important;
            right: 0 !important;
            border-radius: 16px 16px 0 0 !important;
          }
        }
      `}</style>

      {/* ===== Header ===== */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ backgroundColor: '#0D1117' }}
      >
        <img
          src="/chatbot-avatar.jpg"
          alt="Hoàng Yến AI"
          className="h-8 w-8 rounded-full object-cover border border-white/30"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Hoàng Yến AI</p>
          <p className="text-xs text-white/60">Online</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Đóng chat"
          className="text-white/60 transition-colors hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ===== Messages ===== */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        style={{ backgroundColor: '#F8FAFC' }}
      >
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} content={m.content} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div
              className="flex items-center gap-1.5 px-4 py-3 shadow-sm"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #C6C6CB',
                borderRadius: '4px 12px 12px 12px',
              }}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-[#45474B] animate-bounce [animation-delay:-0.3s]" />
              <span className="inline-block h-2 w-2 rounded-full bg-[#45474B] animate-bounce [animation-delay:-0.15s]" />
              <span className="inline-block h-2 w-2 rounded-full bg-[#45474B] animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ===== Quick Replies ===== */}
      {quickReplies.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {quickReplies.map(qr => (
            <button
              key={qr}
              onClick={() => onSend(qr)}
              disabled={isLoading}
              className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
              style={{
                borderColor: '#006C4A',
                color: '#006C4A',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={e => {
                (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(0,108,74,0.1)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* ===== Input ===== */}
      <div className="border-t px-3 py-3" style={{ borderColor: '#C6C6CB' }}>
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
            placeholder="Hỏi tôi bất kỳ điều gì..."
            className="flex-1 resize-none rounded-xl border bg-white px-4 py-2.5 text-sm leading-5 placeholder:text-[#45474B]/50 focus:outline-none focus:ring-2 focus:ring-[#006C4A]/30 font-grotesk"
            style={{
              borderColor: '#C6C6CB',
              color: '#191c1e',
            }}
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Gửi tin nhắn"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-opacity disabled:opacity-40"
            style={{ backgroundColor: '#006C4A' }}
          >
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
