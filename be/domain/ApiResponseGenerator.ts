export interface ApiResponseGenerator<T, U, V = unknown> {
   generateResponse(request: T): Promise<U>;
   generateResponseStream(request: T): Promise<AsyncIterable<V>>;
}
