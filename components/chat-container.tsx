import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "./ui/alert-dialog";
import { MessageSquare, Trophy, Maximize2, Minimize2 } from "lucide-react";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { ChatContent } from "./chat-content";
import { ChallengeTask } from "./challenge-task";
import { MessageFeedback } from "./message-feedback";
import {
  WebSocketProvider,
  useWebSocketContext,
} from "../contexts/WebSocketContext";
import { AIResponse } from "./ai-response";
import { ChatInput } from "./chat-input";
import { mockChallengeData } from "../lib/fe/mock/challenge-data";
import {
  AIResponse as AIResponseType,
  AIFeedbackResponse,
} from "../types/chat";
import Image from "next/image";
import { cn } from "../lib/fe/utils/cn";

interface ChatContainerProps {
  persona: string;
  mode: "full" | "trial";
}

function ChatContainerContent({ persona, mode }: ChatContainerProps) {
  const STORAGE_KEY = "trial_message_count";
  const maxTrialCount = Number(process.env.NEXT_PUBLIC_MAX_TRIAL_COUNT) || 5;
  const [messageCount, setMessageCount] = useState<number>(
    Number(localStorage.getItem(STORAGE_KEY)) || 0
  );
  const { challengeTasks, sendMessage, messages } = useWebSocketContext();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight, setViewportHeight] = useState<number>(0);

  const [isTrialEnded, setIsTrialEnded] = useState<boolean>(() => {
    if (mode === "trial") {
      const storedCount = Number(localStorage.getItem(STORAGE_KEY)) || 0;
      return storedCount >= maxTrialCount;
    }
    return false;
  });

  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [selectedFeedback, setSelectedFeedback] =
    useState<AIFeedbackResponse | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  useEffect(() => {
    if (mode === "trial" && messageCount >= maxTrialCount) {
      setIsTrialEnded(true);
    }
  }, [messageCount, mode, maxTrialCount]);

  useEffect(() => {
    const updateWidth = () => {
      setContainerWidth(window.innerWidth);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const updateViewportHeight = () => {
      const height = window.visualViewport?.height || window.innerHeight;
      const additionalHeight = window.visualViewport?.height 
        ? window.innerHeight - window.visualViewport.height + 500 
        : 0;
      setViewportHeight(height + additionalHeight);
    };

    window.visualViewport?.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('scroll', updateViewportHeight);
    updateViewportHeight();

    return () => {
      window.visualViewport?.removeEventListener('resize', updateViewportHeight);
      window.visualViewport?.removeEventListener('scroll', updateViewportHeight);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSendMessage = (content: string) => {
    sendMessage(content);
    if (mode === "trial") {
      setMessageCount((prev) => {
        const newCount = prev + 1;
        localStorage.setItem(STORAGE_KEY, String(newCount));
        return newCount;
      });
    }
  };

  const lastAIResponse =
    (messages.filter((m) => m.sender === "assistant").slice(-1)[0]
      ?.content as AIResponseType) || "";
  
  const getPanelStyle = () => {
    return {
      width: '70%',
      position: 'absolute' as const,
      left: '50%',
      top: containerWidth < 768 ? '60px' : '20px',
      transform: 'translateX(-50%)',
      transition: 'transform 0.3s ease-in-out, top 0.3s ease-in-out',
      zIndex: 30
    };
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative transition-all duration-300 ease-in-out overflow-hidden",
        isFullscreen && "fixed inset-0 z-50 bg-black"
      )}
      style={{
        width: "100%",
        height: "auto",
        minHeight: "320px",
        margin: "0 auto"
      }}
    >
      <div className={cn(
        "relative w-full",
        isFullscreen ? "h-[100dvh]" : "h-[320px] md:h-[400px] lg:h-[480px]"
      )}>
        <Image 
          src={`/images/${persona}.png`} 
          alt={persona} 
          fill
          className={cn(
            "transition-all duration-300",
            isFullscreen ? "object-cover" : ""
          )}
          priority
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 h-8 w-8 text-white/60 hover:text-white bg-black/40 hover:bg-black/60"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5" />
          ) : (
            <Maximize2 className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* 우측 상단 버튼 그룹 */}
      <div className="absolute top-4 right-4 flex gap-2 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 hover:bg-white/90 relative"
          onClick={() => setIsAchievementsOpen((prev) => !prev)}
        >
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
              className="rounded-full bg-white/80 hover:bg-white/90"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <ChatContent
            messages={messages}
            onShowFeedback={(response) => {
              const userMessage = messages.find(
                (m) =>
                  m.sender === "user" &&
                  new Date(m.timestamp).getTime() <
                    new Date((response as any).timestamp).getTime()
              )?.content as string;

              const { ...rest } = response;
              setSelectedFeedback({
                ...rest,
                userMessage: userMessage || "",
              });
            }}
          />
        </Dialog>
        <Dialog
          open={!!selectedFeedback}
          onOpenChange={(open) => !open && setSelectedFeedback(null)}
        >
          <MessageFeedback response={selectedFeedback || undefined} />
        </Dialog>
      </div>

      {/* 도전과제 패널 */}
      <ChallengeTask
        isOpen={isAchievementsOpen}
        style={getPanelStyle()}
        challenge={mockChallengeData[0]}
      />

      {/* AI 응답 영역 */}
      <AIResponse response={lastAIResponse.answer} persona={persona} />

      {/* 채팅 입력 영역 */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={
          isTrialEnded || (mode === "trial" && messageCount >= maxTrialCount)
        }
      />

      {isTrialEnded && (
        <>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertDialog open={isTrialEnded}>
              <AlertDialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-semibold">
                    We grow together.
                  </AlertDialogTitle>
                  <AlertDialogDescription className="mt-2 text-gray-600">
                    We hope you enjoyed your trial! Sign up now to unlock even
                    more amazing content.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 flex justify-end space-x-2">
                  <AlertDialogAction
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => (window.location.href = "/sign-up")}
                  >
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
  return (
    <WebSocketProvider mode={props.mode}>
      <ChatContainerContent {...props} />
    </WebSocketProvider>
  );
}
