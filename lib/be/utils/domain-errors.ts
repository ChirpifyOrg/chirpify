export class AppError extends Error {
   public readonly code: string;
   constructor(message: string, code: string = 'APP_ERROR') {
      super(message);
      this.name = this.constructor.name;
      this.code = code;
   }
}
