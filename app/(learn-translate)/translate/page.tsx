"use client";
import { useState } from "react";
import { MessageList } from "@/components/message-list";
import { AIAnalysis } from "@/components/ai-analysis";
import { MessageInput } from "@/components/message-input";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "AI", text: "나는 목이 마르다" },
    { id: 2, sender: "User", text: "I'm Thirsty." },
    { id: 3, sender: "AI", text: "나는 바빠. 왜냐하면 일이 많아서야." },
    { id: 4, sender: "User", text: "I'm busy because I have worked hard." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, sender: "User", text: input.trim() }]);
      setInput("");
    }
  };

  return (
    <div className="flex-wrap w-full flex p-2 mx-auto">
      <div className="sm:w-4/4 md:w-3/4 flex w-full gap-4 box-border">
        <MessageList messages={messages} />
      </div>
      <div className="sm:w-4/4 md:w-1/4 flex gap-4 box-border">
        <AIAnalysis />
      </div>
      <div className="flex w-full gap-4 box-border">
      <MessageInput input={input} setInput={setInput} handleSend={handleSend} />
      </div>
    </div>
  );
}
