import { NotFoundError } from '@/lib/be/utils/errors';
import { ChatModelParameter } from './ChatModelParameter';
import { ChatRoom } from './ChatRoom';

export class ChatModel {
   id: string;
   persona?: string;
   description?: string;
   chatRooms: ChatRoom[];
   chatModelParameter: ChatModelParameter[];
   createdAt: Date;
   constructor(props: {
      id?: string;
      persona?: string;
      description?: string;
      chatRooms?: ChatRoom[];
      chatModelParameter: ChatModelParameter[];
      createdAt?: Date;
   }) {
      this.id = props.id || crypto.randomUUID();
      this.persona = props.persona;
      this.description = props.description;
      this.createdAt = props.createdAt || new Date();
      this.chatRooms = props.chatRooms || [];
      this.chatModelParameter = props.chatModelParameter || [];
      if (this.chatModelParameter.length === 0) {
         throw new NotFoundError('ChatModelParameter는 최소 1개 이상이어야 합니다.');
      }
   }
}
