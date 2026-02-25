import { HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export enum STATUS {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
};

const errorMessages = {
  403: 'FORBIDDEN',
  500: 'INTERNAL_SERVER_ERROR',
  401: 'UNAUTHORIZED',
};

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const router = inject(Router);
  const toast = inject(ToastrService);
  const errorPages = [STATUS.FORBIDDEN, STATUS.NOT_FOUND, STATUS.INTERNAL_SERVER_ERROR];

  const getMessage = (error: HttpErrorResponse) => {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.error?.msg) {
      return error.error.msg;
    }
    return errorMessages[error.status as keyof typeof errorMessages] || 'UNKNOWN_ERROR';
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (errorPages.includes(error.status)) {
        router.navigateByUrl(`/${error.status}`, {
          skipLocationChange: true,
        });
      } else {
        toast.error(getMessage(error));
        if (error.status === STATUS.UNAUTHORIZED) {
          router.navigateByUrl('/auth/login');
        }
      }

      return throwError(() => error);
    })
  );
}
