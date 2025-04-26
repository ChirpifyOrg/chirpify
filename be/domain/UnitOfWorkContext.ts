// 여러 domain에서 공유해서 사용 가능하게 any로 지정
export const uowContext = new AsyncLocalStorage<any>();

export function getCurrentUow<T>(): T {
   const store = uowContext.getStore();
   if (!store) throw new Error('No Active UoW in context');
   return store;
}
