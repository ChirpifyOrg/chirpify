import { DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { memo, useState, useEffect } from 'react';
import { AIChatSimpleFormatHistory } from '@/types/chat';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/fe/utils/cn';
import { mockChatHistoryData } from '@/lib/fe/mock/chat-history-data';

// 개별 메시지 컴포넌트
const MessageItem = memo(({ message }: { message: AIChatSimpleFormatHistory }) => {
   return (
      <div className={`flex ${message.role === 'User' ? 'justify-end' : 'justify-start'}`}>
         <div
            className={`rounded-2xl px-4 py-2 max-w-[80%] ${
               message.role === 'User' ? 'bg-white/20 text-white' : 'bg-white/10 text-white'
            }`}>
            <div className="text-sm">{message.message}</div>
            {/* {isAIResponse && aiResponse && ( */}
            <div className="mt-2 flex items-center gap-2">
               <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-white/60 hover:text-white hover:bg-white/10"
                  // onClick={() => onShowFeedback(aiResponse)}
               >
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show Feedback
               </Button>
            </div>
            {/* )} */}
            <div className="text-xs mt-1 text-white/60">
               {format(new Date(message.createdAt), 'a h:mm', { locale: ko })}
            </div>
         </div>
      </div>
   );
});
MessageItem.displayName = 'MessageItem';

// 메시지 목록 컴포넌트
const MessageList = memo(({ messages }: { messages: AIChatSimpleFormatHistory[] }) => {
   if (messages.length === 0) {
      return <div className="text-center text-white/60 py-8">아직 대화 내용이 없습니다.</div>;
   }

   return (
      <div className="flex flex-col gap-3">
         {messages.map(message => (
            <MessageItem key={message.id} message={message} />
         ))}
      </div>
   );
});
MessageList.displayName = 'MessageList';

interface ChatContentProps {
   style?: React.CSSProperties;
   messageKey?: string;
   isExpanded?: boolean;
   onExpand?: () => void;
}

export function ChatContent({ style, messageKey, onShowFeedback, isExpanded, onExpand }: ChatContentProps) {
   const [messages] = useState<AIChatSimpleFormatHistory[]>(mockChatHistoryData);
   const contentHeight = style?.maxHeight ? parseInt(style.maxHeight as string) : 320;
   const scrollAreaHeight = Math.max(contentHeight - 60, 100);

   useEffect(() => {
      if (messageKey) {
         // TODO: messageKey에 따라 다른 메시지 세트를 로드하는 로직
         // setMessages(loadMessages(messageKey));
      }
   }, [messageKey]);

   return (
      <DialogContent
         className={cn(
            'transition-all duration-300 ease-in-out',
            'bg-black/85 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg',
         )}
         style={style}>
         <DialogHeader className="px-4 py-3 border-b border-white/20">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <DialogTitle className="text-base text-white">Chat History</DialogTitle>
                  <button onClick={onExpand} className="text-xs text-white/60 hover:text-white ml-2 flex items-center">
                     {isExpanded ? '(Collapse)' : '(Expand)'}
                  </button>
               </div>
            </div>
         </DialogHeader>
         <ScrollArea style={{ height: scrollAreaHeight }}>
            <div className="p-4">
               <MessageList messages={messages} />
            </div>
         </ScrollArea>
      </DialogContent>
   );
}
