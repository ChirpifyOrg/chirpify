import { DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { ScrollAreaOnScroll } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { memo, useState, useEffect, useRef } from 'react';
import { AIChatSimpleFormatHistory } from '@/types/chat';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/fe/utils/cn';
import { onShowFeedBackFn } from '@/app/hooks/useFeedBack';
import { useSimpleChatStore } from '@/app/state/chatStore';
import { API_ENDPOINTS } from '@/lib/fe/api-endpoints';
import { fetchWithTypedBody } from '@/app/hooks/useFetchData';

type MessageItemProps = {
   message: AIChatSimpleFormatHistory;
   onShowFeedback: onShowFeedBackFn;
   beforeMessage: string;
};
// 개별 메시지 컴포넌트
const MessageItem = memo(({ message, onShowFeedback, beforeMessage }: MessageItemProps) => {
   return (
      <div className={`flex ${message.role === 'User' ? 'justify-end' : 'justify-start'}`}>
         <div
            className={`rounded-2xl px-4 py-2 max-w-[80%] ${
               message.role === 'User' ? 'bg-white/20 text-white' : 'bg-white/10 text-white'
            }`}>
            <div className="text-sm">{message.message}</div>
            {message.role === 'User' ? (
               <></>
            ) : (
               <div className="mt-2 flex items-center gap-2">
                  <Button
                     variant="ghost"
                     size="sm"
                     className="h-6 px-2 text-xs text-white/60 hover:text-white hover:bg-white/10"
                     onClick={() => onShowFeedback({ messageId: message.id, clientSendMessage: beforeMessage })}>
                     <ChevronDown className="h-3 w-3 mr-1" />
                     Show Feedback
                  </Button>
               </div>
            )}
            <div className="text-xs mt-1 text-white/60">
               {format(new Date(message.createdAt), 'a h:mm', { locale: ko })}
            </div>
         </div>
      </div>
   );
});
MessageItem.displayName = 'MessageItem';

// 메시지 목록 컴포넌트
const MessageList = memo(
   ({ messages, onShowFeedback }: { messages: AIChatSimpleFormatHistory[]; onShowFeedback: onShowFeedBackFn }) => {
      if (messages.length === 0) {
         return <div className="text-center text-white/60 py-8">아직 대화 내용이 없습니다.</div>;
      }
      return (
         <div className="flex flex-col gap-3">
            {messages.map((message, index) => {
               return (
                  <MessageItem
                     key={message.id}
                     onShowFeedback={onShowFeedback}
                     message={message}
                     beforeMessage={messages[index - 1]?.message ?? ''}
                  />
               );
            })}
         </div>
      );
   },
);
MessageList.displayName = 'MessageList';

interface ChatContentProps {
   style?: React.CSSProperties;
   onShowFeedback: onShowFeedBackFn;
   isExpanded?: boolean;
   onExpand?: () => void;
   roomId: string;
   isOpen: boolean;
}
export function ChatContent({ isOpen, style, onShowFeedback, isExpanded, onExpand, roomId }: ChatContentProps) {
   const { prependMessage } = useSimpleChatStore.getState();
   const messages = useSimpleChatStore(state => state.messages[roomId] ?? []);
   const startIndex = useSimpleChatStore(state => state.startIndex[roomId] ?? undefined);
   const endIndex = useSimpleChatStore(state => state.endIndex[roomId] ?? undefined);

   const [isInit, setInit] = useState<boolean>(false);

   const [isLoading, setIsLoading] = useState(false);
   const contentHeight = style?.maxHeight ? parseInt(style.maxHeight as string) : 320;
   const scrollAreaHeight = Math.max(contentHeight - 60, 100);

   const scrollContainerRef = useRef<HTMLDivElement>(null);
   const scrollBottom = useRef<HTMLDivElement>(null);

   const loadMoreMessages = async () => {
      if (isLoading) return;

      setIsLoading(true);

      try {
         const DEFAULT_CHAT_HISTORY_LIMIT = 20;
         const response = await fetchWithTypedBody(
            API_ENDPOINTS.getChatSimpleFormatHistory({
               roomId,
               endIndex,
               limit: DEFAULT_CHAT_HISTORY_LIMIT,
               startIndex,
            }),
         );
         console.log(response);
         // 실제에선 startIndex 또는 현재 메시지 중 가장 오래된 ID 기준으로 fetch
         const newMessages = [
            {
               id: `${Date.now() + Math.random()}`,
               roomId: '2',
               message: `${Date.now() + Math.random()}`,
               role: 'User',
               createdAt: new Date(Date.now() - 1000 * 60).toISOString(),
            },
            {
               id: `${Date.now() + 1 + Math.random()}`,
               roomId: '2',
               message: `${Date.now() + Math.random()}`,
               role: 'Assistant',
               createdAt: new Date(Date.now() - 1000 * 60).toISOString(),
            },
         ] as AIChatSimpleFormatHistory[];

         prependMessage({ roomId, messages: [...newMessages] });
      } catch (error) {
         console.error('Error loading messages:', error);
      } finally {
         setIsLoading(false);
      }
   };

   // 2단계: 메시지 렌더 이후 스크롤 바닥 이동 및 초기화
   useEffect(() => {
      requestAnimationFrame(() => {
         setTimeout(() => {
            if (scrollContainerRef.current) {
               scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;

               loadMoreMessages(); // 초기 메시지 이후 추가 로딩
               setInit(true);
               // 100ms 딜레이로 안정성 보장
            }
         }, 100);
      });
   }, [isOpen]);

   const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = event.currentTarget;
      if (!isInit || isLoading) return; // 초기화가 안됬거나 로딩중이면

      if (scrollTop < 50) {
         loadMoreMessages();
         // 다음 렌더 후 스크롤 위치 보정
      }
   };
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
         <ScrollAreaOnScroll
            scrollRef={scrollContainerRef}
            style={{ height: scrollAreaHeight }}
            onScrollCb={handleScroll}
            className="w-full">
            <div className="p-4">
               <MessageList messages={messages ?? []} onShowFeedback={onShowFeedback} />
               {isLoading && <div className="text-center py-2 text-white/60">Loading more messages...</div>}
            </div>
            <div ref={scrollBottom}></div>
         </ScrollAreaOnScroll>
      </DialogContent>
   );
}
