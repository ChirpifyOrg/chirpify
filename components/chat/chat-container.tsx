'use client';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogTitle,
} from '@radix-ui/react-alert-dialog';
import { AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';
import { MessageSquare, Trophy, Maximize2, Minimize2 } from 'lucide-react';
import { Dialog } from '@radix-ui/react-dialog';
import { ChatContent } from './chat-content';
import { ChallengeTask } from './challenge-task';
import { MessageFeedback } from './message-feedback';
import { AIResponse } from '@/components/chat/ai-response';
import { ChatInput } from './chat-input';
import { mockChallengeData } from '@/lib/fe/mock/challenge-data';
import Image from 'next/image';
import { cn } from '@/lib/fe/utils/cn';
import { useTrialMode } from '@/hooks/useTrialMode';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useContainerDimensions } from '@/hooks/useContainerDimensions';
import { useChat } from '@/hooks/useChat';
import { getUserLanguage } from '@/lib/fe/utils/language';
import { useFeedBack } from '@/hooks/useFeedBack';
import { AIChatSimpleFormatHistory } from '@/types/chat';

interface ChatContainerProps {
   persona: string;
   mode: 'full' | 'trial';
   roomId: string;
   isStreaming?: boolean;
   lastMessage?: AIChatSimpleFormatHistory;
}

export function ChatContainer({ persona, mode, roomId, isStreaming, lastMessage }: ChatContainerProps) {
   isStreaming = isStreaming ?? true;

   if (!roomId) {
      return <>Error !</>;
   }
   const [showLastMessage, setShowLastMessage] = useState<boolean>(!!lastMessage); // lastMessage가 있을 경우 true로 설정

   useEffect(() => {
      if (lastMessage) {
         setShowLastMessage(true); // lastMessage가 있을 때 상태 업데이트
      }
   }, [lastMessage]);

   const containerRef = useRef<HTMLDivElement>(null);

   // testdata
   const [challengeTasks] = useState(mockChallengeData);

   const [isExpanded, setIsExpanded] = useState(false);

   const [isChallengeTaskOpen, setIsChallengeTaskOpen] = useState<boolean>(false);
   // 메시지 카운트 관련
   const { isTrialEnded, incrementMessageCount } = useTrialMode({ mode });

   const [trialEndedPopupShow, setTrailEndedPopup] = useState<boolean>(false);

   // 전체 화면 관련
   const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
   // 컨테이너 크기 관련
   const { containerHeight, containerWidth } = useContainerDimensions(containerRef);
   const { aiStreamedMessage, aiFullResponse, handleSendMessage, isLoading: isChatLoading } = useChat();

   const [isChatContentOpen, setChatContentIsOpen] = useState<boolean>(false);
   const setChatContentOpen = () => setChatContentIsOpen(true);

   // 피드백 관련
   const { onShowFeedback, selectedFeedback } = useFeedBack(roomId);
   const [isFeedBackOpen, setFeedBackIsOpen] = useState<boolean>(false);
   const setFeedBackOpen = () => setFeedBackIsOpen(true);
   const setFeedBackClose = () => {
      setChatContentOpen();
      setFeedBackIsOpen(false);
   };
   useEffect(() => {
      if (selectedFeedback) setFeedBackOpen();
   }, [selectedFeedback]);

   // 도전과제 패널 스타일
   const getChallengePanelStyle = () => ({
      width: containerWidth < 768 ? '90%' : '70%',
      position: 'absolute' as const,
      left: '50%',
      top: containerWidth < 768 ? '60px' : '20px',
      transform: isChallengeTaskOpen ? 'translateX(-50%)' : 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out',
      zIndex: 2000,
   });
   // 채팅 및 feedback 컨텐츠 스타일
   const getChatContentStyle = (containerHeight: number, containerWidth: number) => {
      if (typeof window === 'undefined') {
         return { maxHeight: '100%' };
      }

      const maxHeight = Math.min(
         containerHeight * 0.8,
         containerWidth < 768 ? window.innerHeight * 0.6 : window.innerHeight * 0.8,
      );
      const containerCurrentWidth = containerRef.current?.getBoundingClientRect().width || 0;
      const maxWidth = isExpanded ? `${containerCurrentWidth * 0.9}px` : containerWidth < 768 ? '90vw' : '400px';
      return {
         position: 'absolute' as const,
         top: '60px',
         right: '0',
         transform: 'none',
         maxHeight: `${maxHeight}px`,
         width: maxWidth,
         transition: 'width 0.3s ease-in-out',
         zIndex: 1000,
      };
   };

   // 메시지 전송 핸들러
   const onSendMessage = async (message: string) => {
      if (!isTrialEnded) {
         try {
            await handleSendMessage({ roomId, message, nativeLanguage: getUserLanguage() }, isStreaming ?? true);
            incrementMessageCount();
         } catch (error) {
            if (typeof error === 'object' && error !== null && 'status' in error && (error as any).status === 429) {
               setTrailEndedPopup(true); // 429 Too Many Requests 처리
            } else {
               console.error(error);
            }
         }
      } else {
         setTrailEndedPopup(true);
      }
   };

   return (
      <div
         ref={containerRef}
         className={cn(
            'relative transition-all duration-300 ease-in-out overflow-hidden',
            isFullscreen && 'fixed inset-0 z-50 bg-black',
         )}
         style={{
            width: '100%',
            height: 'auto',
            minHeight: '320px',
            margin: '0 auto',
         }}>
         <div
            className={cn(
               'relative w-full',
               isFullscreen ? 'h-[100dvh]' : 'h-[380px] md:h-[400px] lg:h-[480px] xl:h-[560px]',
            )}>
            <Image
               src={`/images/${persona}_${aiFullResponse?.emotion.toLocaleLowerCase() ?? 'calm'}.webp`}
               alt={persona}
               fill
               className={cn('transition-all duration-300', isFullscreen ? 'object-cover' : '')}
               priority
            />
            <Button
               variant="ghost"
               size="icon"
               className="absolute top-4 left-4 h-8 w-8 text-white/60 hover:text-white bg-black/40 hover:bg-black/60"
               onClick={toggleFullscreen}>
               {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
         </div>

         <div className="absolute top-4 right-4 flex gap-2" style={{ zIndex: 100 }}>
            {
               // TODO : 도전과제 구현 후 표시할것
               !challengeTasks && (
                  <Button
                     variant="outline"
                     size="icon"
                     className="rounded-full bg-white/80 hover:bg-white/90 relative h-8 w-8"
                     onClick={() => setIsChallengeTaskOpen(prev => !prev)}>
                     <Trophy className="h-5 w-5" />
                     {/* {challengeTasks.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                           {challengeTasks.length}
                        </span>
                     )} */}
                  </Button>
               )
            }
            <Dialog modal={false} open={!!isChatContentOpen} onOpenChange={open => !open}>
               <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 hover:bg-white/90 h-8 w-8 relative z-[110]"
                  onClick={() => {
                     setChatContentIsOpen(!isChatContentOpen);
                  }}>
                  <MessageSquare className="h-5 w-5" />
               </Button>

               <ChatContent
                  roomId={roomId}
                  isOpen={isChatContentOpen}
                  style={{
                     ...getChatContentStyle(containerHeight, containerWidth),
                     display: isChatContentOpen ? 'block' : 'none', // 💡 보이기만 제어
                  }}
                  isExpanded={isExpanded}
                  onExpand={() => setIsExpanded(!isExpanded)}
                  onShowFeedback={onShowFeedback}
               />
            </Dialog>
            <Dialog modal={false} open={!!isFeedBackOpen} onOpenChange={open => !open}>
               {selectedFeedback && (
                  <MessageFeedback
                     style={getChatContentStyle(containerHeight, containerWidth)}
                     feedbackAndScore={selectedFeedback}
                     onClose={setFeedBackClose}
                  />
               )}
            </Dialog>
         </div>

         <ChallengeTask isOpen={isChallengeTaskOpen} style={getChallengePanelStyle()} challenge={mockChallengeData} />

         <AIResponse
            message={
               isStreaming
                  ? aiStreamedMessage
                     ? aiStreamedMessage
                     : showLastMessage
                       ? lastMessage?.message
                       : ''
                  : aiFullResponse?.message
            }
            persona={persona}
            emotion={aiFullResponse?.emotion}
         />

         <ChatInput onSend={onSendMessage} disabled={isChatLoading} />

         {trialEndedPopupShow && (
            <>
               <div className="absolute inset-0 bg-black/50"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <AlertDialog open={isTrialEnded}>
                     <AlertDialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <AlertDialogHeader>
                           <AlertDialogTitle className="text-xl font-semibold">We grow together.</AlertDialogTitle>
                           <AlertDialogDescription className="mt-2 text-gray-600">
                              We hope you enjoyed your trial! Sign up now to unlock even more amazing content.
                           </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 flex justify-end space-x-2">
                           <AlertDialogAction
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                              onClick={() => (window.location.href = '/sign-up')}>
                              Sign up
                           </AlertDialogAction>
                        </AlertDialogFooter>
                     </AlertDialogContent>
                  </AlertDialog>
               </div>
            </>
         )}
      </div>
   );
}
