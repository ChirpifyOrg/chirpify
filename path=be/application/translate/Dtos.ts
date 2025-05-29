interface Dto {
   toString(): string;
}

export class FeedbackDetailDTO implements Dto {
   constructor() {
      // 생성자 내용
   }
   toString(): string {
      // 반환할 값 추가
      return '';
   }
}

export class GetLastTranslateFeedbackDTO implements Dto {
   constructor(
      private readonly id: string,
      private readonly userId: string,
      private readonly sentence: string,
      private readonly feedback: FeedbackDetailDTO,
   ) {}
   toString(): string {
      // 반환할 값 추가
      return '';
   }
}
