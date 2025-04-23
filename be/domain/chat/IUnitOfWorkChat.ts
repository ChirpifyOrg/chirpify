import { IUnitOfWork } from '../IUnitOfWork';
import { ChatModelRepository } from './ChatModelRepository';
import { ChatRepository } from './ChatRepository';
import { ChatRoomRepository } from './ChatRoomRepository';

export interface IUnitOfWorkChat extends IUnitOfWork {
   chatRepository: ChatRepository;
   chatRoomRepository: ChatRoomRepository;
   chatModelRepository: ChatModelRepository;
}
