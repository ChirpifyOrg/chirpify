export class ChatMetadata {
   id: string;
   totalFeedback?: string;
   nativeTotalFeedback?: string;
   nativeLanguage?: string;
   difficultyLevel?: string;
   emotion?: string;
   totalScore?: number;
   messageId?: string;
   createdAt: Date;

   constructor(props: {
      id?: string;
      totalFeedback?: string;
      nativeTotalFeedback?: string;
      nativeLanguage?: string;
      difficultyLevel?: string;
      emotion?: string;
      totalScore?: number;
      messageId?: string;
      createdAt?: Date;
   }) {
      this.id = props.id || crypto.randomUUID();
      this.totalFeedback = props.totalFeedback;
      this.nativeTotalFeedback = props.nativeTotalFeedback;
      this.nativeLanguage = props.nativeLanguage;
      this.difficultyLevel = props.difficultyLevel;
      this.emotion = props.emotion;
      this.totalScore = props.totalScore;
      this.messageId = props.messageId;
      this.createdAt = props.createdAt || new Date();
   }
}
