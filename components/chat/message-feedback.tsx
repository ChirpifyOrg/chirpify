'use client';
import { memo } from 'react';
import { AIChatFeedBackAndScore, EvaluationCategory, Feedback } from '@/types/chat';
import { DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUserLanguage } from '@/lib/fe/utils/language';

// 피드백 컴포넌트
const FeedbackItem = memo(({ feedback }: { feedback: Feedback[] }) => {
   return (
      <div className="mt-2 text-sm text-white/80">
         {feedback.map((detail, index) => (
            <div key={index} className="ml-2 mt-1">
               • {detail.issue.replace(/\_/g, ' ')} : {detail.description}
            </div>
         ))}
      </div>
   );
});
FeedbackItem.displayName = 'FeedbackItem';

// 평가 점수 컴포넌트
const EvaluationScore = memo(({ score, prefixText }: { score: number; prefixText?: string }) => {
   // 점수에 따라 색상 변경
   const getScoreColor = (score: number) => {
      if (score >= 4) return 'bg-green-500/20 text-green-300';
      if (score >= 3) return 'bg-blue-500/20 text-blue-300';
      if (score >= 2) return 'bg-yellow-500/20 text-yellow-300';
      return 'bg-red-500/20 text-red-300';
   };
   return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getScoreColor(score)}`}>
         <span className="text-xs text-white/80">{prefixText ?? 'Score :'}</span>
         <span className="text-sm font-semibold text-white">{score?.toFixed(1)}</span>
      </div>
   );
});
EvaluationScore.displayName = 'EvaluationScore';
export type MessageFeedBackProps = {
   onClose: () => void;
   style: React.CSSProperties;
   feedbackAndScore: AIChatFeedBackAndScore;
};
export const MessageFeedback = memo(({ style, feedbackAndScore, onClose }: MessageFeedBackProps) => {
   const contentHeight = style?.maxHeight ? parseInt(style.maxHeight as string) : 320;
   const scrollAreaHeight = Math.max(contentHeight - 60, 100);

   if (!feedbackAndScore) return null;
   const {
      //  difficulty_level,
      evaluation,
      userMessage,
      feedback,
      total_feedback,
      total_score,
   } = feedbackAndScore;
   let feedbackKeys;
   if (feedback) {
      feedbackKeys = Object.keys(feedback);
   }

   const getFeedbackMessage = (feedback: { en: string; [key: string]: string }) => {
      const userLang = getUserLanguage().toLocaleLowerCase();
      if (feedback?.hasOwnProperty(userLang)) return feedback[userLang];
      else {
         console.error('feedback Message가 없습니다.', userLang, feedback);
         return feedback['en'];
      }
   };

   return (
      <DialogContent
         style={style}
         className="pointer-events-auto absolute top-[60px] z-[4000] right-4 w-[800px] bg-black/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg max-h-[600px]">
         <DialogHeader className="px-4 py-3 border-b border-white/80">
            <div className="flex items-center justify-between">
               <DialogTitle className="text-base text-white flex items-center gap-2">
                  <img src="/images/icon.png" alt="icon" className="w-[35px] inline-block" />
                  Chirpi's feedBack!
                  {/* {difficulty_level && `(${difficulty_level})`} */}
               </DialogTitle>
               <button
                  onClick={() => {
                     onClose();
                  }}
                  className="text-xs text-white/60 hover:text-white">
                  Close
               </button>
            </div>
         </DialogHeader>
         <ScrollArea style={{ height: scrollAreaHeight }}>
            <div className="p-4">
               <div className="mb-4">
                  <div className="text-xs text-white/60 mb-1">Your message:</div>
                  <div className="text-sm text-white bg-white/10 p-3 rounded-lg">
                     {userMessage ?? '메시지가 없습니다.'}
                  </div>
               </div>

               <div className="space-y-4">
                  {/* <div className="text-md mb-8 text-white/80"></div> */}
                  <div className="space-y-3">
                     {feedbackKeys?.map(feedbackKey => {
                        const feedbackArray = feedback[feedbackKey as EvaluationCategory];
                        const score = evaluation[feedbackKey as EvaluationCategory];
                        if (!feedbackArray || !score) return null;
                        return (
                           <div key={feedbackKey} className="mb-5">
                              <div className="font-semibold text-sm text-white">
                                 {feedbackKey.replace(/\_/g, ' ')}
                                 <EvaluationScore score={score} />
                              </div>
                              <FeedbackItem feedback={feedbackArray} />
                           </div>
                        );
                     })}
                  </div>
               </div>
               <div className="mb-4 mt-7">
                  <div className="text-xs text-white/60 mb-1">Total Score:</div>
                  <span className="text-sm">
                     <EvaluationScore score={total_score} />
                  </span>
               </div>
               <div className="mb-4">
                  <div className="text-xs text-white/60 mb-1">Total FeedBack:</div>
                  <div className="text-sm text-white bg-white/10 p-3 rounded-lg">
                     {getFeedbackMessage(total_feedback)}
                  </div>
               </div>
            </div>
         </ScrollArea>
      </DialogContent>
   );
});
