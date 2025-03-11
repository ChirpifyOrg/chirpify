import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
}

export function MessageInput({ input, setInput, handleSend }: MessageInputProps) {
  return (
    <div className="flex items-center gap-2 w-full bg-[rgb(30,30,30)] backdrop-blur-sm p-2 ">
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
        placeholder="메시지를 입력하세요..."
        className="flex-1 bg-white/10 text-white placeholder:text-white/60 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
      />
      <Button onClick={handleSend} className="bg-black text-white rounded-full p-3">
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
