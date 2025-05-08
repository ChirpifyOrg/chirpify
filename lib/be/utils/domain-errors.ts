import { AppError } from './errors';

export class DomainError extends AppError {
   constructor(message: string, code = 'DOMAIN_ERROR') {
      super(message, code);
   }
}
