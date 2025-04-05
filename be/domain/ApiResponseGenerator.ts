export interface ApiResponseGenerator<T, U, V = string> {
   generateResponse(request: T): Promise<U>;
   generateResponseStream(request: T): Promise<AsyncIterable<V>>;
}
