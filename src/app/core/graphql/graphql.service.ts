import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injector, Service, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { AuthService } from '../auth/auth.service';

/** Estructura de un error GraphQL devuelto por el servidor. */
interface GraphQLError {
  message: string;
  path?: (string | number)[];
  extensions?: Record<string, unknown>;
}

/** Respuesta estándar de un endpoint GraphQL. */
interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

/** Error tipado con message legible para la UI. */
export class GraphqlRequestError extends Error {
  readonly classification?: string;
  readonly code?: string;

  constructor(message: string, classification?: string, code?: string) {
    super(message);
    this.name = 'GraphqlRequestError';
    this.classification = classification;
    this.code = code;
  }
}

/**
 * Cliente GraphQL de bajo nivel: POST a `/graphql` del backend Ultron.
 * Si hay sesión de cliente web, adjunta `Authorization: Bearer`.
 */
@Service()
export class GraphqlService {
  private readonly http = inject(HttpClient);
  /** Lazy: AuthService también usa GraphqlService. */
  private readonly injector = inject(Injector);

  private get endpoint(): string {
    return API_CONFIG.graphqlEndpoint;
  }

  query<T>(query: string, variables?: Record<string, unknown>): Observable<T> {
    return this.execute<T>(query, variables);
  }

  mutate<T>(mutation: string, variables?: Record<string, unknown>): Observable<T> {
    return this.execute<T>(mutation, variables);
  }

  private execute<T>(document: string, variables?: Record<string, unknown>): Observable<T> {
    return this.http
      .post<GraphQLResponse<T>>(this.endpoint, { query: document, variables: variables ?? {} }, {
        headers: this.headersConAuth(),
      })
      .pipe(
        map((response) => {
          if (response.errors?.length) {
            const message = response.errors.map((error) => error.message).join(' | ');
            const first = response.errors[0];
            const classification = first.extensions?.['classification'] as string | undefined;
            const code = first.extensions?.['code'] as string | undefined;
            throw new GraphqlRequestError(message, classification, code);
          }
          return response.data as T;
        }),
      );
  }

  private headersConAuth(): HttpHeaders | undefined {
    const token = this.injector.get(AuthService).token();
    if (!token) {
      return undefined;
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
