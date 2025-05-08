import { ChatMessage } from './ChatMessage';
import { ChatModel } from './ChatModel';

export class ChatRoom {
   id: string;
   name?: string;
   userId?: string;
   modelId?: string;
   createdAt: Date;
   deletedAt?: Date;
   messages: ChatMessage[];
   model?: ChatModel;

   constructor(props: {
      id?: string;
      name?: string;
      userId?: string;
      modelId?: string;
      createdAt?: Date;
      deletedAt?: Date;
      messages?: ChatMessage[];
      readonly model?: ChatModel;
   }) {
      this.id = props.id || crypto.randomUUID();
      this.name = props.name;
      this.userId = props.userId;
      this.modelId = props.modelId;
      this.createdAt = props.createdAt || new Date();
      this.deletedAt = props.deletedAt;
      this.messages = props.messages || [];
      this.model = props.model;
   }

   // 메시지 추가 메소드
   addMessage(message: ChatMessage) {
      this.messages.push(message);
   }

   // 마지막 메시지 가져오기
   getLastMessage(): ChatMessage | undefined {
      return this.messages[this.messages.length - 1];
   }

   // 메시지 정렬 (최신순)
   sortMessagesByDate() {
      this.messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
   }
   // 소유권 확인
   isUserOwnerOfRoom(userId: string) {
      return this.userId === userId;
   }
}
