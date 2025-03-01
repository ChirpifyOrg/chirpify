import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { memo, useState } from "react";
import { ChatMessage, AIResponse, Feedback } from "../types/chat";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/fe/utils/cn";
import { mockChatHistoryData } from "../lib/fe/mock/chat-history-data";

// 테스트용 임시 데이터
const mockMessages: ChatMessage[] = mockChatHistoryData;

// 피드백 컴포넌트
const FeedbackItem = memo(({ feedback }: { feedback: Feedback }) => {
  if (feedback.count === 0) return null;
  
  return (
    <div className="mt-2 text-xs text-white/80">
      <div className="font-semibold">{feedback.issue}</div>
      {feedback.details.map((detail, index) => (
        <div key={index} className="ml-2 mt-1">
          • {detail.description}
        </div>
      ))}
    </div>
  );
});
FeedbackItem.displayName = 'FeedbackItem';

// 평가 점수 컴포넌트
const EvaluationScore = memo(({ score }: { score: number }) => {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/10">
      <span className="text-xs text-white/80">점수:</span>
      <span className="text-sm font-semibold text-white">{score.toFixed(1)}</span>
    </div>
  );
});
EvaluationScore.displayName = 'EvaluationScore';

// 개별 메시지 컴포넌트
const MessageItem = memo(({ message, onShowFeedback }: { message: ChatMessage; onShowFeedback: (response: AIResponse) => void }) => {
  const isAIResponse = message.sender === 'assistant' && typeof message.content === 'object';
  const aiResponse = isAIResponse ? (message.content as AIResponse) : null;
  const content = isAIResponse && aiResponse ? aiResponse.answer : String(message.content);

  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`rounded-2xl px-4 py-2 max-w-[80%] ${
        message.sender === 'user' ? 'bg-white/20 text-white' : 'bg-white/10 text-white'
      }`}>
        <div className="text-sm">{content}</div>
        {isAIResponse && aiResponse && (
          <div className="mt-2 flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-6 px-2 text-xs text-white/60 hover:text-white hover:bg-white/10"
              onClick={() => onShowFeedback(aiResponse)}
            >
              <ChevronDown className="h-3 w-3 mr-1" />
              Show Feedback
            </Button>
          </div>
        )}
        <div className="text-xs mt-1 text-white/60">
          {format(new Date(message.timestamp), 'a h:mm', { locale: ko })}
        </div>
      </div>
    </div>
  );
});
MessageItem.displayName = 'MessageItem';

// 메시지 목록 컴포넌트
const MessageList = memo(({ messages, onShowFeedback }: { messages: ChatMessage[]; onShowFeedback: (response: AIResponse) => void }) => {
  if (messages.length === 0) {
    return (
      <div className="text-center text-white/60 py-8">
        아직 대화 내용이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} onShowFeedback={onShowFeedback} />
      ))}
    </div>
  );
});
MessageList.displayName = 'MessageList';

interface ChatContentProps {
  messages?: ChatMessage[];
  onShowFeedback: (response: AIResponse) => void;
}

export const ChatContent = memo(({ messages, onShowFeedback }: ChatContentProps) => {
  messages = mockMessages;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <DialogContent 
      className={cn(
        "absolute top-[60px] right-4 transition-all duration-300 ease-in-out",
        "bg-black/85 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg",
        isExpanded ? "w-[800px]" : "w-[400px]",
        "max-h-[600px]"
      )}
    >
      <DialogHeader className="px-4 py-3 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-base text-white">Chat History</DialogTitle>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-white/60 hover:text-white ml-2 flex items-center"
            >
              {isExpanded ? "(Collapse)" : "(Expand)"}
            </button>
          </div>
        </div>
      </DialogHeader>
      <ScrollArea className={cn(
        "transition-all duration-300 ease-in-out",
        "h-[520px]"
      )}>
        <div className="p-4">
          <MessageList messages={messages} onShowFeedback={onShowFeedback} />
        </div>
      </ScrollArea>
    </DialogContent>
  );
}); 