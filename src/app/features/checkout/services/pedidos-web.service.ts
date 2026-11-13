import { Service, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GraphqlService } from '../../../core/graphql/graphql.service';
import {
  BUSCAR_PEDIDO_WEB_POR_CODIGO_QUERY,
  REGISTRAR_PEDIDO_WEB_MUTATION,
} from '../../productos/graphql/catalogo-web.graphql';
import { PedidoWeb, PedidoWebInput } from '../models/pedido-web.model';

@Service()
export class PedidosWebService {
  private readonly graphql = inject(GraphqlService);

  registrar(input: PedidoWebInput): Observable<PedidoWeb> {
    return this.graphql
      .mutate<{ registrarPedidoWeb: PedidoWeb }>(REGISTRAR_PEDIDO_WEB_MUTATION, { input })
      .pipe(map((data) => data.registrarPedidoWeb));
  }

  buscarPorCodigo(codigo: string): Observable<PedidoWeb> {
    return this.graphql
      .query<{ buscarPedidoWebPorCodigo: PedidoWeb }>(BUSCAR_PEDIDO_WEB_POR_CODIGO_QUERY, {
        codigo: codigo.trim(),
      })
      .pipe(map((data) => data.buscarPedidoWebPorCodigo));
  }
}
