import {TranslateLearnRepository} from "@/be/domain/translate-learn";


export class TranslateLearnUsecase {
  constructor(private readonly translateLearnRepository: TranslateLearnRepository) {
  }
  async getUserId(userId : string, from?:number, to?:number) {
    return this.translateLearnRepository.findByUserId(userId,from,to);
  }

}