import { GetLastTranslateFeedbackDTO } from './Dtos';
import { IUnitOfWorkTranslate } from '@/be/domain/translate/IUnitOfTranslate';

interface UseCaseProps {
   userId: string;
   limit?: number;
}

export class GetLastTranslateFeedbackUseCase {
   constructor(private readonly uow: IUnitOfWorkTranslate) {}
   async execute({ userId, limit }: UseCaseProps) {
      limit = limit ?? 10;
      const result = await this.uow.translateFeedbackRepository.getFindAllByUserIdBetweenSeq({ userId, limit });
      return result;
      // GetLastTranslateFeedbackDTO.fromEntity(result);
   }
}
