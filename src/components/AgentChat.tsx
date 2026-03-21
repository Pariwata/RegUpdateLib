import React, { useState, useRef, useEffect } from 'react';
import { useAgentChat } from '../hooks/useAgentChat';

function formatMarkdown(text: string): string {
  // Bold
  let html = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h4>$1</h4>');
  // List items
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
  // Newlines to <br> (but not inside tags)
  html = html.replace(/\n/g, '<br/>');
  // Clean up extra <br/> around block elements
  html = html.replace(/<br\/><ul>/g, '<ul>');
  html = html.replace(/<\/ul><br\/>/g, '</ul>');
  html = html.replace(/<br\/><h4>/g, '<h4>');
  html = html.replace(/<\/h4><br\/>/g, '</h4>');
  return html;
}

export function AgentChat() {
  const { messages, isLoading, sendMessage, clearChat } = useAgentChat();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage(trimmed);
    setInput('');
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        className="agent-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
        title="AI Assistant"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="agent-panel">
          <div className="agent-header">
            <div className="agent-header-info">
              <div className="agent-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a4 4 0 0 1 4 4v2H8V6a4 4 0 0 1 4-4z" />
                  <rect x="3" y="8" width="18" height="12" rx="2" />
                  <circle cx="9" cy="14" r="1.5" fill="currentColor" />
                  <circle cx="15" cy="14" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <div>
                <div className="agent-name">Regulatory AI Agent</div>
                <div className="agent-status-text">Online</div>
              </div>
            </div>
            <button className="agent-clear" onClick={clearChat} title="Clear chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </button>
          </div>

          <div className="agent-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`agent-msg agent-msg-${msg.role}`}>
                <div
                  className={`agent-bubble agent-bubble-${msg.role}`}
                  dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }}
                />
                <div className="agent-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="agent-msg agent-msg-assistant">
                <div className="agent-bubble agent-bubble-assistant agent-typing">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="agent-input-form" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              className="agent-input"
              type="text"
              placeholder="Ask about regulations..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              className="agent-send"
              type="submit"
              disabled={!input.trim() || isLoading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
