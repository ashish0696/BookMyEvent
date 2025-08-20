import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        return throwError(() => ({
          statuscode: err.status || 500,
          data: [],
          message: err.message || 'Error',
          feildErrors: err.response?.message ? [err.response.message] : [],
          error: true
        }));
      })
    );
  }
}
