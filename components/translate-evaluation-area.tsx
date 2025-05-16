import { AITranslateReponse, defaultAIChatResponse } from '@/types/translate';
import { Dialog, DialogContent } from '@radix-ui/react-dialog';
import React from 'react';
import { DialogHeader } from './ui/dialog';
import Image from 'next/image';

type TranslateEvaluationAreaProps = {
   evaluation: AITranslateReponse | null; // evaluation prop의 타입 정의
};

const TranslateEvaluationArea = ({ evaluation }: TranslateEvaluationAreaProps) => {
   evaluation = defaultAIChatResponse;
   if (!evaluation) return null; // evaluation이 없으면 null 반환

   const { feedback, level, sentence } = evaluation; // evaluation에서 필요한 데이터 추출

   return (
      <div className="flex-1 p-3 overflow-y-auto border-t border-gray-700 pt-1">
         <div className="space-y-4 p-3 max-h-[calc(100vh-300px)] overflow-y-auto">
            <Dialog>
               <DialogContent className="pointer-events-auto bg-black/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
                  <DialogHeader className="px-4 py-3 border-b border-white/80">
                     <div className="flex items-center justify-between">
                        <h2 className="text-base text-white flex items-center gap-2">
                           <Image src="/images/icon.png" alt="icon" width={35} height={35} className="inline-block" />
                           Chirpi's Feedback!
                        </h2>
                     </div>
                  </DialogHeader>
                  <div className="p-4">
                     <div className="mb-4">
                        <div className="text-xs text-white/60 mb-1">Your message:</div>
                        <div className="text-sm text-white bg-white/10 p-3 rounded-lg">
                           {sentence || '메시지가 없습니다.'} {/* sentence가 없을 경우 기본 메시지 표시 */}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="space-y-3">
                           {Object.keys(feedback).map(key => {
                              const feedbackItem = feedback[key as keyof typeof feedback]; // 키를 명시적으로 지정
                              return (
                                 <div key={key} className="mb-5">
                                    <div className="font-semibold text-sm text-white">
                                       {key.replace(/_/g, ' ')} {/* 피드백 키를 읽기 쉽게 변환 */}
                                    </div>
                                    <div className="text-white">{feedbackItem}</div> {/* 피드백 내용 표시 */}
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                     <div className="mb-4 mt-7">
                        <div className="text-xs text-white/60 mb-1">Total Score:</div>
                        <span className="text-sm">
                           <strong>{feedback.total_score}</strong> {/* 총 점수 표시 */}
                        </span>
                     </div>
                  </div>
               </DialogContent>
            </Dialog>
         </div>
      </div>
   );
};

export default TranslateEvaluationArea;
