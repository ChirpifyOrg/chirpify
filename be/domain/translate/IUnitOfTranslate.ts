import { IUnitOfWork } from '../IUnitOfWork';
import { TranslateFeedbackRepository } from './TranslateFeedbackRepository';
import { TranslateGenerateSentenceRepository } from './TranslateGenerateSentenceRepository';
import { TranslateModelReopsitory } from './TranslateModelReopsitory';

export interface IUnitOfWorkTranslate extends IUnitOfWork<IUnitOfWorkTranslate> {
   translateFeedbackRepository: TranslateFeedbackRepository;
   translateGenerateSentenceRepository: TranslateGenerateSentenceRepository;
   translateModelReopsitory: TranslateModelReopsitory;
}
