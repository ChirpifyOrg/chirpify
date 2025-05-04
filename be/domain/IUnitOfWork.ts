/**
 * CRTP(Curiously Recurring Template Pattern)를 사용한 Unit of Work 패턴의 제네릭 인터페이스입니다.
 *
 * @template U - 실제 UnitOfWork 구현체 타입을 의미하며, 자기 자신을 타입으로 넘깁니다.
 *
 * CRTP를 사용함으로써 부모 인터페이스에서도 자식 클래스의 타입을 명확히 알 수 있어,
 * 내부 메서드에서 타입 안정성과 일관성을 유지할 수 있습니다.
 *
 * `executeInTransaction` 메서드는 콜백의 인자로 현재 UoW 인스턴스를 제공합니다.
 * 해당 인자를 반드시 사용할 필요는 없지만,
 * 명시적으로 `uow`를 전달함으로써 트랜잭션 내 컨텍스트를 더 직관적으로 사용할 수 있어
 * 코드 가독성과 유지보수성이 향상됩니다.
 */
export interface IUnitOfWork<U extends IUnitOfWork<U>> {
   executeInTransaction<T>(callback: (uow: U) => Promise<T>): Promise<T>;
   beginTransaction(): Promise<void>;
   commit(): Promise<void>;
   rollback(): Promise<void>;
}
