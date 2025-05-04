import { AIChatSimpleFormatHistory } from '@/types/chat';

export const mockChatHistoryData: AIChatSimpleFormatHistory[] = [
   // Example 1
   {
      id: '1',
      roomId: '2',
      message: 'I am so tired?',
      role: 'User',
      createdAt: new Date(Date.now() - 1000 * 60).toISOString(),
   },
   {
      id: '2',
      roomId: '2',
      message:
         'I understand! You might want to say, "I\'m so tired." The question mark is not needed here. What made you tired?',
      role: 'Assistant',
      createdAt: new Date().toISOString(),
   },

   // Example 2
   {
      id: '3',
      roomId: '2',
      message: 'Where is the bathroom?',
      role: 'User',
      createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
   },
   {
      id: '4',
      roomId: '2',
      message:
         "That's a perfect question! Your grammar and word choice are excellent. The bathroom is often down the hall to the right in many buildings.",
      role: 'Assistant',
      createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
   },
   {
      id: '5',
      roomId: '2',
      message: 'I have been go to the store yesterday.',
      role: 'User',
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
   },
   {
      id: '6',
      roomId: '2',
      message:
         'I think you wanted to say, "I went to the store yesterday." When talking about a completed action in the past, use the simple past tense, not present perfect with \'have been\'.',
      role: 'Assistant',
      createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
   },
   {
      id: '7',
      roomId: '2',
      message: 'Can I get the recipe for making kimchi?',
      role: 'User',
      createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
   },
   {
      id: '8',
      roomId: '2',
      message:
         "Great question! Your sentence structure is perfect. Yes, I'd be happy to provide a kimchi recipe if I could. This is a very natural way to ask for information.",
      role: 'Assistant',
      createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
   },
   {
      id: '9',
      roomId: '2',
      message: "The weather is very good today, isn't it?",
      role: 'User',
      createdAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
   },
   {
      id: '10',
      roomId: '2',
      message:
         "Yes, it is! Your question is perfect - you've used a tag question correctly, which many English learners find challenging. This shows advanced skill in conversation.",
      role: 'Assistant',
      createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
   },
   {
      id: '11',
      roomId: '2',
      message: "I'm sorry for disturb you.",
      role: 'User',
      createdAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
   },
   {
      id: '12',
      roomId: '2',
      message:
         "You're close! A better way to say this would be: \"I'm sorry for disturbing you.\" When using 'for' in this structure, the verb needs to be in the -ing form.",
      role: 'Assistant',
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
   },
];
