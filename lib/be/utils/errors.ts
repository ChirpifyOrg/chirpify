export class AppError extends Error {
   public readonly code: string;
   constructor(message: string, code: string = 'APP_ERROR') {
      super(message);
      this.name = this.constructor.name;
      this.code = code;
   }
}

export class ValidationError extends AppError {
   constructor(message = 'Validation failed') {
      super(message, 'VALIDATION_ERROR');
   }
}

export class TooManyRequestsError extends AppError {
   constructor(message = 'Too many requests') {
      super(message, 'TOO_MANY_REQUESTS');
   }
}

export class UnauthorizedError extends AppError {
   constructor(message = 'Unauthorized') {
      super(message, 'UNAUTHORIZED');
   }
}

export class ForbiddenError extends AppError {
   constructor(message = 'Forbidden') {
      super(message, 'FORBIDDEN');
   }
}

export class NotFoundError extends AppError {
   constructor(message = 'Not found') {
      super(message, 'NOT_FOUND');
   }
}

export class ConflictError extends AppError {
   constructor(message = 'Conflict occurred') {
      super(message, 'CONFLICT');
   }
}
