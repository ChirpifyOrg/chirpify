import { useState, useEffect } from 'react';

interface UseTrialModeProps {
   mode: 'full' | 'trial';
   maxTrialCount?: number;
}
// 트라이얼 모드 훅
/*
   mode: 'full' | 'trial'
   maxTrialCount: 트라이얼 모드에서 최대 메시지 수
*/
export function useTrialMode({
   mode,
   maxTrialCount = Number(process.env.NEXT_PUBLIC_MAX_TRIAL_COUNT) || 5,
}: UseTrialModeProps) {
   const STORAGE_KEY = 'trial_message_count';
   const [messageCount, setMessageCount] = useState<number>(0);
   const [isTrialEnded, setIsTrialEnded] = useState<boolean>(false);

   useEffect(() => {
      if (typeof window !== 'undefined' && window.localStorage) {
         try {
            const storedCount = Number(localStorage.getItem(STORAGE_KEY)) || 0;
            setMessageCount(storedCount);
            if (mode === 'trial') {
               setIsTrialEnded(storedCount >= maxTrialCount);
            }
         } catch (error) {
            console.error('Error accessing localStorage:', error);
         }
      }
   }, [mode, messageCount, maxTrialCount]);

   const incrementMessageCount = () => {
      if (mode === 'trial' && typeof window !== 'undefined' && window.localStorage) {
         setMessageCount(prev => {
            const newCount = prev + 1;
            try {
               localStorage.setItem(STORAGE_KEY, String(newCount));
            } catch (error) {
               console.error('Error updating localStorage:', error);
            }
            return newCount;
         });
      }
   };

   return {
      messageCount,
      isTrialEnded,
      incrementMessageCount,
      maxTrialCount,
      setIsTrialEnded,
   };
}
