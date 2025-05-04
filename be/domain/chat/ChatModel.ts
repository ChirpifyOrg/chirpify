
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
      // if (this.chatModelParameter.length === 0) {
      //    throw new NotFoundError('ChatModelParameter는 최소 1개 이상이어야 합니다.');
      // }
   }

   addParameter(parameter: {
      defaultParam?: any;
      prompt?: string;
      isActive?: boolean;
      isStreaming?: boolean;
   }): void {
      const newParameter = new ChatModelParameter({
         defaultParam: parameter.defaultParam,
         prompt: parameter.prompt,
         isActive: parameter.isActive ?? true,
         isStreaming: parameter.isStreaming ?? false,
      });
      this.chatModelParameter.push(newParameter);
   }

   getParametersByStreaming(isStreaming: boolean): ChatModelParameter[] {
      return this.chatModelParameter.filter(
         param => param.isStreaming === isStreaming && param.isActive
      );
   }
}
