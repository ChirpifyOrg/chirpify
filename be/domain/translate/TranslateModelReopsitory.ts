import { TranslateModelUseType } from '@/types/translate';
import { TranslateModel } from './TranslateModel';

export interface TranslateModelReopsitory {
   findByUseTypeActive(useType: TranslateModelUseType): Promise<TranslateModel | null>;
}
