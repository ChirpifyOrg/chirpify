import { AIChatAPIResponse } from '@/types/chat';

export const mockAIChatResponseData: AIChatAPIResponse = {
   message: 'Haha, no worries! Feel free to ask any questions or share more about yourself.',
   evaluation: {
      comprehension: 3,
      grammar_accuracy: 2,
      sentence_naturalness: 2,
      vocabulary_naturalness: 3,
   },
   total_score: 2.5,
   feedback: {
      grammar_accuracy: [
         {
            issue: 'tense_errors',
            description:
               "올바른 시제를 사용하세요. 예를 들어, 과거의 일을 말할 때는 'I am going' 대신 'I was going'을 사용하세요.",
         },
      ],
      sentence_naturalness: [
         {
            issue: 'unnecessary_repetition',
            description:
               "불필요한 단어 반복을 피하세요. 예를 들어, 'She was really very tired' 대신 'She was very tired'라고 말하는 것이 더 자연스럽습니다.",
         },
      ],
      vocabulary_naturalness: [
         {
            issue: 'inappropriate_word_choice',
            description:
               "문맥에 맞는 단어를 선택하세요. 예를 들어, 'hungry' 대신 'eager'를 사용하면 더 적절할 수 있습니다.",
         },
      ],
      comprehension: [
         {
            issue: 'context_understanding',
            description:
               '답변하기 전에 문맥을 충분히 이해하세요. 예를 들어, 대화가 과거의 사건에 대한 것이라면, 이를 과거 시제로 표현해야 합니다.',
         },
      ],
   },
   total_feedback: {
      'en-US':
         'Your message shows good understanding and vocabulary, but there are some grammar and sentence structure issues to work on. Keep practicing!',
      'ko-kr':
         '당신의 메시지는 이해력과 어휘력이 좋은 편이지만, 문법과 문장 구조에 일부 문제가 있습니다. 계속 연습해보세요!',
   },
   difficulty_level: 'Medium',
   emotion: 'Anger',
};
