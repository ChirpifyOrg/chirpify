import { ChatRoom } from './ChatRoom';

export class ChatModel {
   id: string;
   persona?: string;
   description?: string;
   prompt?: string;
   isActive?: boolean;
   createdAt: Date;
   defaultParam?: any; // JSON 타입
   chatRooms: ChatRoom[];

   constructor(props: {
      id?: string;
      persona?: string;
      description?: string;
      prompt?: string;
      isActive?: boolean;
      createdAt?: Date;
      defaultParam?: any;
      chatRooms?: ChatRoom[];
   }) {
      this.id = props.id || crypto.randomUUID();
      this.persona = props.persona;
      this.description = props.description;
      this.prompt = props.prompt;
      this.isActive = props.isActive;
      this.createdAt = props.createdAt || new Date();
      this.defaultParam = props.defaultParam;
      this.chatRooms = props.chatRooms || [];
   }
}
