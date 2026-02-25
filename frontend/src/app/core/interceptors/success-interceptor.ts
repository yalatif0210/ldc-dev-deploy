import { HttpStatusCode, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';

const successMessages = {
  200: 'FINISHED WITH SUCCESS',
  201: 'FINISHED WITH SUCCESS',
};

export function successInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const router = inject(Router);
  const toast = inject(ToastrService);

  const getMessage = (status: HttpStatusCode) => {
    return successMessages[status as keyof typeof successMessages];
  };

  if (req.url.includes('api/')) {
    return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        // ✅ Ceci est une réponse réussie
        toast.success(getMessage(event.status));
      }
    })
  );
  }

  return next(req);
}
