import { PrismaClient } from '@prisma/client';

import { ChatRepositoryImpl } from './ChatRepository';
import { ChatRoomRepositoryImpl } from './ChatRoomRepository';
import { ChatModelRepositoryImpl } from './ChatModelRepository';
import { PrismaUnitOfWork } from '../PrismaUnitOfWork';

import { IUnitOfWorkChat } from '@/be/domain/chat/IUnitOfWorkChat';
import { ChatRepository } from '@/be/domain/chat/ChatRepository';
import { ChatRoomRepository } from '@/be/domain/chat/ChatRoomRepository';
import { ChatModelRepository } from '@/be/domain/chat/ChatModelRepository';
/**
 * @class PrismaUnitOfWorkChat
 * @extends PrismaUnitOfWork
 *
 * @description
 *
 *
 * @param {PrismaClient | Prisma.TransactionClient} client - Prisma 클라이언트 또는 트랜잭션 클라이언트
 * @param {ChatRepositoryImpl} chatRepository - 채팅 메시지 관련 저장소 구현체
 * @param {ChatRoomRepositoryImpl} chatRoomRepository - 채팅방 관련 저장소 구현체
 * @param {ChatModelRepositoryImpl} chatModelRepository - AI 모델 관련 저장소 구현체
 */
// IUnitOfChat UoW 도메인 인터페이스를 구현함으로써 proxy를 통한 runtime 동적 속성 가로채기가 필요없어짐.
export class UnitOfWorkChat extends PrismaUnitOfWork implements IUnitOfWorkChat {
   constructor(
      protected readonly client: PrismaClient,
      public readonly chatRepository: ChatRepository,
      public readonly chatRoomRepository: ChatRoomRepository,
      public readonly chatModelRepository: ChatModelRepository,
   ) {
      super(client);
   }

   static create(prisma: PrismaClient): UnitOfWorkChat {
      return new UnitOfWorkChat(
         prisma,
         new ChatRepositoryImpl(prisma),
         new ChatRoomRepositoryImpl(prisma),
         new ChatModelRepositoryImpl(prisma),
      );
   }
}
