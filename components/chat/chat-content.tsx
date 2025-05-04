import { DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { ScrollAreaOnScroll } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { memo, useState, useEffect, useRef, useCallback } from 'react';
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
   const { setMessages } = useSimpleChatStore.getState();

   // useShallow를 사용하여 얕은 비교 수행
   const messages = useSimpleChatStore(useShallow(state => state.messages[roomId] ?? []));
   const startIndex = useSimpleChatStore(useShallow(state => state.startIndex[roomId]));
   const endIndex = useSimpleChatStore(useShallow(state => state.endIndex[roomId]));

   const [isInit, setInit] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState(false);
   const [hasMoreMessages, setHasMoreMessages] = useState(true); // 더 불러올 메시지가 있는지 추적
   const [lastRequestId, setLastRequestId] = useState<string | null>(null); // 마지막 요청 ID 추적

   const contentHeight = style?.maxHeight ? parseInt(style.maxHeight as string) : 320;
   const scrollAreaHeight = Math.max(contentHeight - 60, 100);

   const scrollContainerRef = useRef<HTMLDivElement>(null);
   const scrollBottom = useRef<HTMLDivElement>(null);

   // 스크롤 이벤트 쓰로틀링을 위한 타이머
   const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

   // 요청 ID 생성 함수
   const generateRequestId = useCallback(() => {
      return `${roomId}-${startIndex}-${endIndex}-${Date.now()}`;
   }, [roomId, startIndex, endIndex]);

   // loadMoreMessages를 useCallback으로 메모이제이션
   const loadMoreMessages = useCallback(async () => {
      if (isLoading || !hasMoreMessages) return false;

      // 요청에 고유 ID 할당
      const requestId = generateRequestId();

      // 중복 요청 방지
      if (requestId === lastRequestId) {
         return false;
      }

      setLastRequestId(requestId);
      setIsLoading(true);

      try {
         const DEFAULT_CHAT_HISTORY_LIMIT = 20;
         const response = await fetchWithTypedBody<unknown, AIChatSimpleFormatHistory[]>(
            API_ENDPOINTS.getChatSimpleFormatHistory({
               roomId,
               endIndex,
               limit: DEFAULT_CHAT_HISTORY_LIMIT,
               startIndex,
            }),
         );

         // 데이터가 없거나 빈 배열이면 더 이상 메시지가 없음을 표시
         if (!response || response.length === 0) {
            setHasMoreMessages(false);
            return false;
         }

         // 새로운 메시지가 기존 메시지와 중복되는지 확인
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
         } else {
            // 첫 로드인 경우
            setMessages({ roomId, messages: [...response] });
         }

         return true;
      } catch (error) {
         console.error('Error loading messages:', error);
         return false;
      } finally {
         setIsLoading(false);
      }
   }, [
      isLoading,
      hasMoreMessages,
      roomId,
      endIndex,
      startIndex,
      setMessages,
      messages,
      generateRequestId,
      lastRequestId,
   ]);

   // 컴포넌트가 처음 마운트될 때만 초기화
   useEffect(() => {
      if (!isOpen || isInit) return;

      const initChat = async () => {
         if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;

            const hasLoaded = await loadMoreMessages();
            setInit(true);

            // 초기 로드 후 스크롤을 맨 아래로
            if (hasLoaded && scrollContainerRef.current) {
               scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
            }
         }
      };

      // 컴포넌트가 렌더링된 후 실행
      requestAnimationFrame(() => {
         setTimeout(initChat, 100);
      });
   }, [isOpen, isInit, loadMoreMessages]);

   // 스크롤 핸들러 (쓰로틀링 적용)
   const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
      // 초기화되지 않았거나 로딩 중이면 무시
      if (!isInit || isLoading || !hasMoreMessages) return;

      const { scrollTop } = event.currentTarget;

      // 스크롤이 상단에 가까울 때만 추가 데이터 로드
      if (scrollTop < 50) {
         // 이전 타이머가 있으면 취소
         if (scrollTimerRef.current) {
            clearTimeout(scrollTimerRef.current);
         }

         // 300ms 쓰로틀링 적용
         scrollTimerRef.current = setTimeout(() => {
            const container = event.currentTarget;
            const prevScrollHeight = container.scrollHeight;

            // 추가 데이터 로드
            loadMoreMessages().then(hasNewMessages => {
               if (hasNewMessages) {
                  // 스크롤 위치 유지
                  requestAnimationFrame(() => {
                     const newScrollHeight = container.scrollHeight;
                     container.scrollTop = newScrollHeight - prevScrollHeight + scrollTop;
                  });
               }
            });

            scrollTimerRef.current = null;
         }, 300);
      }
   };

   // 컴포넌트 언마운트 시 타이머 정리
   useEffect(() => {
      return () => {
         if (scrollTimerRef.current) {
            clearTimeout(scrollTimerRef.current);
         }
      };
   }, []);

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
               {!hasMoreMessages && messages.length > 0 && (
                  <div className="text-center py-2 text-white/60">모든 메시지를 불러왔습니다</div>
               )}
               {isLoading && <div className="text-center py-2 text-white/60">Loading more messages...</div>}
               <MessageList messages={messages ?? []} onShowFeedback={onShowFeedback} />
            </div>
            <div ref={scrollBottom}></div>
         </ScrollAreaOnScroll>
      </DialogContent>
   );
}
