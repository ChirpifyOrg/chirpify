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
import { useShallow } from 'zustand/shallow';

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
         return <div className="text-center text-white/60 py-8">No Messages..</div>;
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
   const DEFAULT_CHAT_HISTORY_LIMIT = 20;
   // 스토어에서 필요한 함수들 가져오기
   const { setMessages, prependMessage } = useSimpleChatStore(
      useShallow(state => ({
         setMessages: state.setMessages,
         appendMessage: state.appendMessage,
         prependMessage: state.prependMessage,
      })),
   );

   // useShallow를 사용하여 얕은 비교 수행
   const messages = useSimpleChatStore(useShallow(state => state.messages[roomId] ?? []));
   const startIndex = useSimpleChatStore(useShallow(state => state.startIndex[roomId]));

   const [isInit, setInit] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState(false);
   const [hasMoreMessages, setHasMoreMessages] = useState(true); // 더 불러올 메시지가 있는지 추적

   const contentHeight = style?.maxHeight ? parseInt(style.maxHeight as string) : 320;
   const scrollAreaHeight = Math.max(contentHeight - 60, 100);

   const scrollContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (isOpen === true) {
         console.log('reopen');
         setInit(false);
         setHasMoreMessages(false);
      }
   }, [isOpen]);
   // 초기 메시지 로드
   useEffect(() => {
      if (roomId && !isInit) {
         loadInitialMessages();
         setInit(true);
      }
      if (scrollContainerRef.current) {
         scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
   }, [roomId, isInit]);

   // 초기 메시지 로드 함수
   const loadInitialMessages = async () => {
      setIsLoading(true);
      try {
         // API에서 최신 메시지 가져오기
         const response = await fetchWithTypedBody<unknown, AIChatSimpleFormatHistory[]>(
            API_ENDPOINTS.getChatSimpleFormatHistory({
               roomId,
               limit: DEFAULT_CHAT_HISTORY_LIMIT,
            }),
         );
         if (messages.length > 0) {
            const existingIds = new Set(messages.map(msg => msg.id));
            const newMessages = response.filter(msg => !existingIds.has(msg.id));
            if (newMessages.length === 0) {
               // 모든 메시지가 중복됨
               setHasMoreMessages(false);
               return false;
            }
            // 중복되지 않는 메시지만 추가
            setMessages({ roomId, messages: [...newMessages, ...messages] });
         } else if (response.length > 0) {
            // 스토어의 setMessages 함수 사용
            setMessages({
               roomId,
               messages: response,
            });
         } else {
            setHasMoreMessages(false);
         }
      } catch (error) {
         console.error('Failed to load initial messages:', error);
      } finally {
         setIsLoading(false);
      }
   };

   const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop } = e.currentTarget;

      // 상단에 가까워지면 이전 메시지 로드 (더 오래된 메시지)
      if (scrollTop < 100 && !isLoading && hasMoreMessages) {
         await loadMoreMessages();
         const container = e.currentTarget;
         const prevScrollHeight = container.scrollHeight;
         requestAnimationFrame(() => {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - prevScrollHeight + scrollTop;
         });
      }
   };

   // 이전 메시지 더 로드하기
   const loadMoreMessages = async () => {
      if (isLoading || !hasMoreMessages || !startIndex) return;

      setIsLoading(true);
      try {
         // startIndex(가장 오래된 메시지의 타임스탬프)를 기준으로 그 이전 메시지 로드
         const response = await fetchWithTypedBody<unknown, AIChatSimpleFormatHistory[]>(
            API_ENDPOINTS.getChatSimpleFormatHistory({
               roomId,
               limit: DEFAULT_CHAT_HISTORY_LIMIT,
               startIndex,
            }),
         );

         if (response.length > 0) {
            // prependMessage 함수 사용하여 더 오래된 메시지를 앞에 추가
            prependMessage({
               roomId,
               messages: response,
            });
            if (scrollContainerRef.current) {
               scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
            }
         } else {
            setHasMoreMessages(false);
         }
      } catch (error) {
         console.error('Failed to load more messages:', error);
      } finally {
         setIsLoading(false);
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
               {!isLoading && !hasMoreMessages && messages.length > 0 && (
                  <div className="text-center py-2 text-white/60">All Messages Loaded..</div>
               )}
               {isLoading && <div className="text-center py-2 text-white/60">Loading more messages...</div>}
               <MessageList messages={messages ?? []} onShowFeedback={onShowFeedback} />
            </div>
         </ScrollAreaOnScroll>
      </DialogContent>
   );
}
