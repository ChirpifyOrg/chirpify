import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface Message {
  id: number;
  sender: string;
  text: string;
}

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]); // messages가 변경될 때마다 실행

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col flex-1 min-w-0 gap-3 overflow-y-scroll
        h-[30vh] max-h-[80vh] lg:h-[80vh] sm:h-[30vh] p-1 sm:p-3 bg-[rgb(30,30,30)] w-full mx-auto">
      {messages.map((msg) => (
          <Card
            key={msg.id}
            className={`p-3 rounded-2xl w-full max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] 
              ${msg.sender === "AI" ? "self-start bg-white/10" : "self-end bg-[rgb(120,120,120)] text-white"}`}
          >
            <p className="break-words overflow-hidden whitespace-pre-wrap">
              {msg.text}
            </p>
          </Card>

      ))}
    </div>
  );
}
