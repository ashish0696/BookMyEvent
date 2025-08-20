import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map, catchError, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        statuscode: 200,
        data: Array.isArray(data) ? data : [data],
        message: 'Success',
        feildErrors: [],
        error: false
      })),
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
