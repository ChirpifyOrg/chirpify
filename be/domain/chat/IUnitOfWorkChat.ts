import { IUnitOfWork } from '../IUnitOfWork';
import { ChatModelRepository } from './ChatModelRepository';
import { ChatRepository } from './ChatRepository';
import { ChatRoomRepository } from './ChatRoomRepository';

export interface IUnitOfWorkChat extends IUnitOfWork<IUnitOfWorkChat> {
   chatRepository: ChatRepository;
   chatRoomRepository: ChatRoomRepository;
   chatModelRepository: ChatModelRepository;
}
