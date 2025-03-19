import { useRef, useState } from 'react';
import { Button } from './ui/button';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogTitle,
} from '@radix-ui/react-alert-dialog';
import { AlertDialogFooter, AlertDialogHeader } from './ui/alert-dialog';
import { MessageSquare, Trophy, Maximize2, Minimize2 } from 'lucide-react';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { ChatContent } from './chat-content';
import { ChallengeTask } from './challenge-task';
import { MessageFeedback } from './message-feedback';
import { AIResponse } from './ai-response';
import { ChatInput } from './chat-input';
import { mockChallengeData } from '../lib/fe/mock/challenge-data';
import Image from 'next/image';
import { cn } from '../lib/fe/utils/cn';
import { useTrialMode } from '../app/hooks/useTrialMode';
import { useFullscreen } from '../app/hooks/useFullscreen';
import { useContainerDimensions } from '../app/hooks/useContainerDimensions';
import { useChat } from '../app/hooks/useChat';
import { mockChatHistoryData } from '../lib/fe/mock/chat-history-data';

interface ChatContainerProps {
   persona: string;
   mode: 'full' | 'trial';
}

function ChatContainerContent({ persona, mode }: ChatContainerProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   // testdata
   const [challengeTasks] = useState(mockChallengeData);
   console.log(mockChallengeData);

   const [isChallengeTaskOpen, setIsChallengeTaskOpen] = useState<boolean>(false);

   const { messageCount, isTrialEnded, incrementMessageCount, maxTrialCount } = useTrialMode({ mode });
   const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);
   const { containerHeight, containerWidth } = useContainerDimensions(containerRef);
   const {
      messages,
      selectedFeedback,
      isExpanded,
      setSelectedFeedback,
      setIsExpanded,
      handleSendMessage,
      lastAIResponse,
   } = useChat(mockChatHistoryData);

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
   // 채팅 컨텐츠 스타일
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
   const onSendMessage = (content: string) => {
      handleSendMessage(content);
      incrementMessageCount();
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
         <div className={cn('relative w-full', isFullscreen ? 'h-[100dvh]' : 'h-[380px] md:h-[400px] lg:h-[480px]')}>
            <Image
               src={`/images/${persona}.png`}
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
            <Button
               variant="outline"
               size="icon"
               className="rounded-full bg-white/80 hover:bg-white/90 relative h-8 w-8"
               onClick={() => setIsChallengeTaskOpen(prev => !prev)}>
               <Trophy className="h-5 w-5" />
               {challengeTasks.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                     {challengeTasks.length}
                  </span>
               )}
            </Button>
            <Dialog>
               <DialogTrigger asChild>
                  <Button
                     variant="outline"
                     size="icon"
                     className="rounded-full bg-white/80 hover:bg-white/90 h-8 w-8 relative z-[110]">
                     <MessageSquare className="h-5 w-5" />
                  </Button>
               </DialogTrigger>
               <ChatContent
                  style={getChatContentStyle(containerHeight, containerWidth)}
                  isExpanded={isExpanded}
                  onExpand={() => setIsExpanded(!isExpanded)}
                  onShowFeedback={response => {
                     setSelectedFeedback(response);
                  }}
               />
            </Dialog>
            <Dialog open={!!selectedFeedback} onOpenChange={open => !open && setSelectedFeedback(null)}>
               <MessageFeedback response={selectedFeedback || undefined} />
            </Dialog>
         </div>

         <ChallengeTask
            isOpen={isChallengeTaskOpen}
            style={getChallengePanelStyle()}
            challenge={mockChallengeData[0]}
         />

         <AIResponse response={lastAIResponse as string} persona={persona} />

         <ChatInput
            onSend={onSendMessage}
            disabled={isTrialEnded || (mode === 'trial' && messageCount >= maxTrialCount)}
         />

         {isTrialEnded && (
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

export function ChatContainer(props: ChatContainerProps) {
   return <ChatContainerContent {...props} />;
}
