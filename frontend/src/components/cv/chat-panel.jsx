"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, MoreVertical } from "lucide-react";

export default function ChatPanel({ messages, onSendMessage, jobTitle, isTyping }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center">
            <Bot size={20} className="text-teal" />
          </div>
          <div>
            <h2 className="font-semibold text-navy">Pilot Assistant</h2>
            <p className="text-xs text-muted-foreground">
              Interviewing for: <span className="text-teal font-medium">{jobTitle || "Your Position"}</span>
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
          <MoreVertical size={18} className="text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`animate-fade-in-up flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center mr-3 mt-1 shrink-0">
                <Bot size={16} className="text-navy" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-navy text-white rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md border border-border"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center ml-3 mt-1 shrink-0">
                <User size={16} className="text-white" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="w-8 h-8 rounded-lg bg-navy/10 flex items-center justify-center mr-3 mt-1 shrink-0">
              <Bot size={16} className="text-navy" />
            </div>
            <div className="bg-muted border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="typing-dot w-2 h-2 bg-navy-muted rounded-full" />
                <span className="typing-dot w-2 h-2 bg-navy-muted rounded-full" />
                <span className="typing-dot w-2 h-2 bg-navy-muted rounded-full" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border bg-white">
        <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-2 border border-border focus-within:border-teal transition-colors">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response..."
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-lg bg-navy hover:bg-navy-light disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
