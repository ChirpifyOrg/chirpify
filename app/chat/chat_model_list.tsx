'use client';

import { ChatModel } from '@/be/domain/chat/ChatModel';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

// Update the props type to accept an array of ChatModel
type ChatModelListProps = {
   data: ChatModel[]; // Change to an array of ChatModel
   //    cardStyle?: CSSProperties;
};
export const ChatModelList = ({ data }: ChatModelListProps) => {
   return (
      <>
         {data?.map(({ persona, desc, image }) => (
            <Card
            //  style={cardStyle ?? {}}
            >
               <CardHeader>
                  <CardTitle>{persona}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
               </CardHeader>
               <CardContent>
                  <Image
                     src={`/images/${persona}_calm.webp`}
                     alt={persona ?? 'persona'}
                     fill
                     className="transition-all duration-300 object-cover"
                     priority
                  />
                  <p>{image}</p>
               </CardContent>
               <CardFooter>
                  <p>Card Footer</p>
               </CardFooter>
            </Card>
         ))}
      </>
   );
};
