import { AITranslateReponse } from '@/types/translate';
import React from 'react';

type TranlateEvaluationAreaProps = {
   evaliation: AITranslateReponse;
};

const TranslateEvaluationArea: React.FC = ({ evaliation }: TranlateEvaluationAreaProps) => {
   const contentHeight = style?.maxHeight ? parseInt(style.maxHeight as string) : 320;
   const scrollAreaHeight = Math.max(contentHeight - 60, 100);

   if (!evaliation) return null;
   const { feedback, level, sentence } = evaliation;
   let feedbackKeys;
   if (feedback) {
      feedbackKeys = Object.keys(feedback);
   }

   const getFeedbackMessage = (feedback: { 'en-US': string; [key: string]: string }) => {
      const userLang = getUserLanguage().toLocaleLowerCase();
      if (feedback?.hasOwnProperty(userLang)) return feedback[userLang];
      else {
         console.error('feedback Message가 없습니다.', userLang, feedback);
         return feedback['en-US'];
      }
   };

   return (
      <div className="flex-1 p-3 overflow-y-auto border-t border-gray-700 pt-1">
         <div className="space-y-4 p-3 max-h-[calc(100vh-300px)] overflow-y-auto">
            <DialogContent
               style={style}
               className="pointer-events-auto absolute top-[60px] z-[4000] right-4 w-[800px] bg-black/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg max-h-[600px]">
               <DialogHeader className="px-4 py-3 border-b border-white/80">
                  <div className="flex items-center justify-between">
                     <DialogTitle className="text-base text-white flex items-center gap-2">
                        <Image src="/images/icon.png" alt="icon" width={35} height={35} className="inline-block" />
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
         </div>
      </div>
   );
};

export default TranslateEvaluationArea;
