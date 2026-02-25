import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_GRAPHQL_END_POINT } from '@core/api-token';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {
  private httpClient = inject(HttpClient);
  private graphqlUrl = inject<string | null>(API_GRAPHQL_END_POINT, { optional: true });


  /**
   * Exécuter une requête GraphQL (query)
   */
  query<T>(query: string, variables: any = {}): Observable<T> {
    return this.httpClient.post<T>(
      this.graphqlUrl!,
      { query, variables },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }

  /**
   * Exécuter une mutation GraphQL
   */
  mutation<T>(mutation: string, variables: any = {}): Observable<T> {
    return this.httpClient.post<T>(
      this.graphqlUrl!,
      { mutation, variables },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
}
