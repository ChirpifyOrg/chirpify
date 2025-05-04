export class ChatModelParameter {
   id: string;
   prompt?: string;
   defaultParam?: any; // JSON 타입
   isActive?: boolean;
   isStreaming?: boolean;
   createdAt: Date;

   constructor(props: {
      id?: string;
      prompt?: string;
      defaultParam?: any;
      isActive?: boolean;
      isStreaming?: boolean;
      createdAt?: Date;
   }) {
      this.id = props.id || crypto.randomUUID();
      this.prompt = props.prompt;
      this.defaultParam = props.defaultParam;
      this.isActive = props.isActive;
      this.isStreaming = props.isStreaming;
      this.createdAt = props.createdAt || new Date();
   }
}
