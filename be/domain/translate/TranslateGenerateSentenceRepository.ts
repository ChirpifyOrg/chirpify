import { TranslateGenerateSentence } from './TranslateGenerateSentence';

export interface TranslateGenerateSentenceRepository {
   registerSentence(sentence: TranslateGenerateSentence): Promise<bigint>;
}
