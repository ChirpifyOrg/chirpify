export class ChatModelParameter {
   id: string;
   prompt?: string;
   defaultParam?: any; // JSON 타입
   isActive?: boolean;
   isStremaing?: boolean;
   createdAt: Date;

   constructor(props: {
      id?: string;
      prompt?: string;
      defaultParam?: any;
      isActive?: boolean;
      isStremaing?: boolean;
      createdAt?: Date;
   }) {
      this.id = props.id || crypto.randomUUID();
      this.prompt = props.prompt;
      this.defaultParam = props.defaultParam;
      this.isActive = props.isActive;
      this.isStremaing = props.isStremaing;
      this.createdAt = props.createdAt || new Date();
   }
}
