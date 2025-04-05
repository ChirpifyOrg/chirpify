import { useState, useEffect } from 'react';

export function useFetchData(url: string) {
   const [data, setData] = useState<any>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true); // 로딩 상태 시작
         try {
            const response = await fetch(url);
            if (!response.ok) {
               throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result);
            setError(null); // 에러 초기화
         } catch (err: unknown) {
            if (err instanceof Error) {
               setError(err.message);
            } else {
               setError('An unknown error occurred');
            }
         } finally {
            setLoading(false); // 로딩 상태 종료
         }
      };

      fetchData();
   }, [url]); // url이 변경될 때만 호출

   return { data, loading, error };
}
