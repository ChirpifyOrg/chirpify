import { FeedBackUseCase } from './FeedBackUseCase';
import { AIReponseGeneratorFactory } from '../AIResponseGeneratorFactory';
import { NotFoundError } from '@/lib/be/utils/errors';
import type { IUnitOfWorkTranslate } from '@/be/domain/translate/IUnitOfTranslate';
import { defaultAITranslateFeedbackResponse } from '@/types/translate';

jest.mock('../AIResponseGeneratorFactory');

describe('FeedBackUseCase', () => {
   let feedbackUseCase: FeedBackUseCase;

   const mockUow: Partial<IUnitOfWorkTranslate> = {
      translateModelReopsitory: {
         findByUseTypeActive: jest.fn(),
      },
      translateFeedbackRepository: {
         save: jest.fn(),
         getFindAllByUserIdBetweenSeq: jest.fn(),
      },
   };

   beforeEach(() => {
      feedbackUseCase = new FeedBackUseCase(mockUow as IUnitOfWorkTranslate);
   });

   it('모델이 존재하지 않을 경우 NotFoundError를 발생시켜야 한다.', async () => {
      (mockUow.translateModelReopsitory!.findByUseTypeActive as jest.Mock).mockResolvedValue(null);

      await expect(
         feedbackUseCase.execute({
            answer: '테스트 답변',
            language: 'ko',
            level: 1,
            question: '테스트 질문',
            selectedOptions: [],
            userId: 'user123',
            sentenceId: BigInt(10), // Add this line
         }),
      ).rejects.toThrow(NotFoundError);
   });
   it('프롬프트가 존재하지 않을경우 NotFoundError를 발생시켜야 한다.', async () => {
      const testData = {
         aiModelType: { getValue: jest.fn().mockReturnValue('GPT') },
         defaultParam: { messages: [{}, { content: '${{question}} ${{answer}}' }] },
      };

      (mockUow.translateModelReopsitory?.findByUseTypeActive as jest.Mock).mockResolvedValue(testData);
      const mockResponse = {
         choices: [{ message: { content: JSON.stringify({ result: 'success' }) } }],
      };

      (AIReponseGeneratorFactory.create as jest.Mock).mockReturnValue({
         generateResponse: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = feedbackUseCase.execute({
         answer: '테스트 답변',
         language: 'ko',
         level: 1,
         question: '테스트 질문',
         selectedOptions: [],
         userId: 'user123',
         sentenceId: BigInt(10), // Add this line
      });
      expect(result).rejects.toThrow(NotFoundError);
   });
   it('유효한 데이터로 응답을 성공적으로 생성해야 한다.', async () => {
      const mockModel = {
         aiModelType: { getValue: jest.fn().mockReturnValue('GPT') },
         prompt: 'test',
         defaultParam: { messages: [{}, { content: '${{question}} ${{answer}}' }] },
      };

      (mockUow.translateModelReopsitory!.findByUseTypeActive as jest.Mock).mockResolvedValue(mockModel);

      (mockUow.translateFeedbackRepository!.save as jest.Mock).mockResolvedValue(null);

      const mockResponse = {
         choices: [{ message: { content: JSON.stringify(defaultAITranslateFeedbackResponse) } }],
      };

      (AIReponseGeneratorFactory.create as jest.Mock).mockReturnValue({
         generateResponse: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await feedbackUseCase.execute({
         answer: '테스트 답변',
         language: 'ko',
         level: 1,
         question: '테스트 질문',
         selectedOptions: [],
         userId: 'user123',
         sentenceId: BigInt(10), // Add this line
      });

      expect(result).toEqual(defaultAITranslateFeedbackResponse);
   });
});
