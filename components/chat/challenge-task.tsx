import { Trophy } from 'lucide-react';
import { cn } from '@/lib/fe/utils/cn';
import { ChallengeTaskList } from '@/types/chat';

interface ChallengeTaskProps {
   isOpen?: boolean;
   challenge?: ChallengeTaskList;
   style?: React.CSSProperties;
}

export function ChallengeTask({ isOpen, challenge, style }: ChallengeTaskProps) {
   if (!challenge) return null;

   return (
      <div
         className={cn('absolute transition-all duration-300 ease-in-out', isOpen ? 'opacity-100' : 'opacity-0')}
         style={style}>
         <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-3">
            <div className="flex items-center gap-2 mb-2">
               <Trophy className="h-4 w-4 text-yellow-400" />
               <h2 className="text-sm font-medium text-white">Challenge task</h2>
            </div>
            {challenge.map((item, num) => (
               <p key={item.id} className="text-sm text-white/80 pl-6">
                  Task {num + 1} : {item.description}
               </p>
            ))}
         </div>
      </div>
   );
}
