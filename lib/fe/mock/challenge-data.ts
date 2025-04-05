import { ChallengeTaskList } from '@/types/chat';

export const mockChallengeData: ChallengeTaskList = [
   {
      id: '1',
      description: '안녕하세요 라고 인사를 건네보세요',
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
   },
   {
      id: '2',
      description: ' 라고 인사를 건네보세요',
      completed: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
   },
];
