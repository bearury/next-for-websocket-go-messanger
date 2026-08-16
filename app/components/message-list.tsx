"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/app/lib/types";

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
        Нет сообщений. Напишите первое!
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex max-w-[80%] flex-col rounded-2xl px-4 py-2 text-sm ${
            message.isOwn
              ? "self-end rounded-br-none bg-foreground text-background"
              : "self-start rounded-bl-none bg-zinc-100 dark:bg-zinc-800"
          }`}
        >
          <span className="text-xs opacity-70">{message.from}</span>
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          <span className="mt-1 self-end text-[10px] opacity-60">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
