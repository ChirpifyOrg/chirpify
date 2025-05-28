import { IUnitOfWorkTranslate } from '@/be/domain/translate/IUnitOfTranslate';
import { ClientTranslateRequest } from '@/types/translate';

export abstract class TranslateAIModelUseCase<T> {
   constructor(protected readonly uow: IUnitOfWorkTranslate) {}
   abstract execute(data: ClientTranslateRequest): Promise<T>;
}
