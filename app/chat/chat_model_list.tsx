'use client';
import { ChatModel } from '@/be/domain/chat/ChatModel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { API_ENDPOINTS } from '@/lib/fe/api-endpoints';
import Image from 'next/image';

import { fetchWithTypedBody } from '../hooks/useFetchData';
import { useRouter } from 'next/navigation';
import { ChatRoom } from '@/be/domain/chat/ChatRoom';

// Update the props type to accept an array of ChatModel
type ChatModelListProps = {
   data: ChatModel[]; // Change to an array of ChatModel
   //    cardStyle?: CSSProperties;
};
export const ChatModelList = ({ data }: ChatModelListProps) => {
   const router = useRouter();
   const handleClick = async (modelId: string) => {
      try {
         const response = await fetchWithTypedBody<{ modelId: string }, ChatRoom>(API_ENDPOINTS.getOrCreateChatRoom(), {
            method: 'POST',
            body: { modelId },
         });
         router.push(`/chat/${response.id}`);
      } catch (error) {
         console.error('Error fetching data:', error);
      }
   };

   return (
      <>
         {data?.map(({ persona, id, description }) => {
            return (
               <div key={id} onClick={() => handleClick(id)} className="w-full cursor-pointer">
                  <Card>
                     <CardHeader>
                        <CardTitle>
                           <div className="w-full relative aspect-[3/2]">
                              <Image
                                 src={`/images/${persona}_joy.webp`}
                                 alt={persona ?? 'persona'}
                                 fill
                                 sizes="100vw"
                                 className="object-contain transition-all duration-300"
                                 priority
                              />
                           </div>
                           {persona}
                        </CardTitle>
                        <CardDescription>{description}</CardDescription>
                     </CardHeader>
                     <CardContent></CardContent>
                  </Card>
               </div>
            );
         })}
      </>
   );
};
