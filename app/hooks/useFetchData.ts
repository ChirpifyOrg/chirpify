import { useState, useEffect } from 'react';

async function fetchWithTypedBody<Req, Res>(url: string, options?: RequestInit & { body?: Req }): Promise<Res> {
   const response = await fetch(url, {
      ...options,
      body: options?.body ? JSON.stringify(options.body) : undefined,
      headers: {
         'Content-Type': 'application/json',
         ...(options?.headers || {}),
      },
   });

   if (!response.ok) {
      throw new Error('Network response was not ok');
   }

   return await response.json();
}

export function useFetchData<Res>(url: string, options?: RequestInit) {
   const [data, setData] = useState<Res | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         try {
            const result = await fetchWithTypedBody<unknown, Res>(url, options);
            setData(result);
            setError(null);
         } catch (err: unknown) {
            if (err instanceof Error) {
               setError(err.message);
            } else {
               setError('An unknown error occurred');
            }
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, [url]);

   return { data, loading, error };
}
