import { PrismaClient } from '@prisma/client';

import { ChatRepositoryImpl } from './ChatRepository';
import { ChatRoomRepositoryImpl } from './ChatRoomRepository';
import { ChatModelRepositoryImpl } from './ChatModelRepository';
import { Prisma } from '@/lib/generated/prisma';
import { PrismaUnitOfWork } from '../PrismaUnitOfWork';
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
export class UnitOfWorkChat extends PrismaUnitOfWork {
   constructor(
      protected readonly client: PrismaClient | Prisma.TransactionClient,
      public readonly chatRepository: ChatRepositoryImpl,
      public readonly chatRoomRepository: ChatRoomRepositoryImpl,
      public readonly chatModelRepository: ChatModelRepositoryImpl,
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
