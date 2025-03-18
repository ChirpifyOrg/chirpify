export class TranslateLearn{
  constructor(
      public userId : string, // 유저당 하나의 영작 기능을 가짐
      public messageType: boolean,
      public message : string,
      public feedback?: string
  ) {
  }
}



// define translate-learn repository interface

export interface TranslateLearnRepository{
  findByUserId(userId : string, from?: number, to?:number): Promise<TranslateLearn[]>;
}