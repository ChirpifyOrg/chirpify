export class ChatEvaluation {
    id: string;
    type?: string;
    score?: number;
    messageId?: string;
    createdAt: Date;
    feedbackItems: ChatFeedbackItem[];
  
    constructor(props: {
      id?: string;
      type?: string;
      score?: number;
      messageId?: string;
      createdAt?: Date;
      feedbackItems?: ChatFeedbackItem[];
    }) {
      this.id = props.id || crypto.randomUUID();
      this.type = props.type;
      this.score = props.score;
      this.messageId = props.messageId;
      this.createdAt = props.createdAt || new Date();
      this.feedbackItems = props.feedbackItems || [];
    }
  }
  
  export class ChatFeedbackItem {
    id: string;
    evaluationId?: string;
    issue?: string;
    description?: string;
    createdAt: Date;
  
    constructor(props: {
      id?: string;
      evaluationId?: string;
      issue?: string;
      description?: string;
      createdAt?: Date;
    }) {
      this.id = props.id || crypto.randomUUID();
      this.evaluationId = props.evaluationId;
      this.issue = props.issue;
      this.description = props.description;
      this.createdAt = props.createdAt || new Date();
    }
  }
  