import { AppError } from '@/lib/be/utils/errors';

type HttpErrorResponse = {
   status: number;
   body: {
      error: string;
      message: string;
      code: string;
   };
};

export function toHttpError(error: unknown): HttpErrorResponse {
   const defaultMessage = 'Unexpected server error';

   if (!(error instanceof AppError)) {
      return {
         status: 500,
         body: {
            error: 'InternalServerError',
            message: defaultMessage,
            code: 'INTERNAL_SERVER_ERROR',
         },
      };
   }

   const map: Record<string, number> = {
      VALIDATION_ERROR: 400,
      TOO_MANY_REQUESTS: 429,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      CONFLICT: 409,
   };

   const status = map[error.code] || 500;

   return {
      status,
      body: {
         error: error.name,
         message: error.message,
         code: error.code,
      },
   };
}
