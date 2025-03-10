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
  return (
    <div className="flex flex-col gap-3 overflow-auto p-2 bg-white/10 w-full
      min-h-[400px] sm:min-h-[500px] md:min-h-[600px] mx-auto">
      {messages.map((msg) => (
          <Card
                    key={msg.id}
                    className={`p-4 rounded-2xl w-full max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] 
                      ${msg.sender === "AI" ? "self-start bg-white/10" : "self-end bg-[rgb(120,120,120)] text-white"}`}
                  >
          {msg.text}
        </Card>
      ))}
    </div>
  );
}
