import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private httpClient = inject(HttpClient);
  private httpHeaders;
  private restUrl = ``;

  constructor() {
    this.httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  }

  setRestEndpoint(url: string) {
    this.restUrl = url;
  }

  /**
   * Exécuter une requête Rest (POST)
   */
  query<T>(creds: any): Observable<T> {
    return this.httpClient
      .post<T>(this.restUrl, creds, {
        headers: this.httpHeaders,
        responseType: 'json' as const,
      })
      .pipe(
        catchError(error => {
          return of(error);
        })
      );
  }
}
