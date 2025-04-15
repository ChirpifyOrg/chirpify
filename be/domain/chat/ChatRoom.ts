export class ChatRoom {
    id: string;
    name?: string;
    userId?: string;
    createdAt: Date;
    messages: ChatMessage[];
  
    constructor(props: {
      id?: string;
      name?: string;
      userId?: string;
      createdAt?: Date;
      messages?: ChatMessage[];
    }) {
      this.id = props.id || crypto.randomUUID();
      this.name = props.name;
      this.userId = props.userId;
      this.createdAt = props.createdAt || new Date();
      this.messages = props.messages || [];
    }
  }