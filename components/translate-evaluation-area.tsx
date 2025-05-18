import { AITranslateReponse } from '@/types/translate';

import React from 'react';

type TranslateEvaluationAreaProps = {
   evaluation: AITranslateReponse | null; // evaluation prop의 타입 정의
};

const TranslateEvaluationArea = ({ evaluation }: TranslateEvaluationAreaProps) => {
   if (!evaluation) return <div className="flex-1 p-3 max-h-[65dvh]"></div>;
   // evaluation이 없으면 null 반환
   const { feedback, sentence } = evaluation; // evaluation에서 필요한 데이터 추출
   const { correct, errors, meaning_feedback, grammar_feedback, story_feedback, score, total_score } = feedback;
   return (
      <div className="flex-1 p-3 max-h-[65dvh] scrollbar-hide overflow-y-auto border-t border-gray-700 pt-1">
         <div className="space-y-4 p-3 ">
            <div className="p-4">
               <div className="mb-4">
                  <div className="text-sm text-white/60 mb-1">Your message:</div>
                  <div className="text-sm text-white bg-white/10 p-3 rounded-lg">
                     {sentence || '메시지가 없습니다.'} {/* sentence가 없을 경우 기본 메시지 표시 */}
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-3">
                     <div className="mb-5">
                        <div className="text-sm text-white/60 mb-1">정확성</div>
                        <div className="text-white">{correct ? '정확함' : '부정확함'}</div>
                     </div>
                     <div className="mb-5">
                        <div className="text-sm text-white/60 mb-1">오류</div>

                        <div className="text-white">{errors.length > 0 ? errors.join(', ') : '없음'}</div>
                     </div>
                     <div className="mb-5">
                        <div className="text-sm text-white/60 mb-1">의미 피드백</div>
                        <div className="text-white">{meaning_feedback}</div>
                     </div>
                     <div className="mb-5">
                        <div className="text-sm text-white/60 mb-1">문법 피드백</div>
                        <div className="text-white">{grammar_feedback}</div>
                     </div>
                     <div className="mb-5">
                        <div className="text-sm text-white/60 mb-1">스토리 피드백</div>
                        <div className="text-white">{story_feedback}</div>
                     </div>
                     <div className="mb-5">
                        <div className="text-sm text-white/60 mb-1">점수</div>
                        <ul className="text-white">
                           <li>이해도: {score.comprehension}</li>
                           <li>문법: {score.grammar}</li>
                           <li>유창성: {score.fluency}</li>
                           <li>어휘: {score.vocabulary}</li>
                        </ul>
                     </div>
                  </div>
               </div>
               <div className="mb-4 mt-7">
                  <div className="text-xs text-white/60 mb-1">총 점수:</div>
                  <span className="text-sm">
                     <strong>{total_score}</strong> {/* 총 점수 표시 */}
                  </span>
               </div>
            </div>
         </div>
      </div>
   );
};

export default TranslateEvaluationArea;
