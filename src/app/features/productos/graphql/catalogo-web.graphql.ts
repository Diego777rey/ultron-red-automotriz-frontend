/** Fragmento común del producto publicado en la tienda. */
export const PRODUCTO_CATALOGO_FIELDS = `
  id_producto
  codigo
  nombre
  descripcion
  precioVenta
  imagen
  tipoIva
  categoriaProducto {
    id_categoria_producto
    nombre
    categoriaPadre {
      id_categoria_producto
      nombre
    }
  }
  presentaciones {
    id_presentacion_producto
    descripcion
    codigoBarras
    cantidad
    precio
  }
`;

export const CATALOGO_WEB_PRODUCTOS_QUERY = `
  query CatalogoWebProductos($filter: String) {
    catalogoWebProductos(filter: $filter) {
      ${PRODUCTO_CATALOGO_FIELDS}
    }
  }
`;

export const CATALOGO_WEB_PRODUCTO_POR_ID_QUERY = `
  query CatalogoWebProductoPorId($id: ID!) {
    catalogoWebProductoPorId(id: $id) {
      ${PRODUCTO_CATALOGO_FIELDS}
    }
  }
`;

export const CATALOGO_WEB_CATEGORIAS_QUERY = `
  query CatalogoWebCategorias {
    catalogoWebCategorias {
      id_categoria_producto
      nombre
      categoriaPadre {
        id_categoria_producto
        nombre
      }
    }
  }
`;

export const SUSCRIBIR_NEWSLETTER_MUTATION = `
  mutation SuscribirNewsletter($input: SuscripcionNewsletterInput!) {
    suscribirNewsletter(input: $input) {
      id_suscripcion
      email
      nombre
      activo
      creadoEn
      mensaje
    }
  }
`;

export const REGISTRAR_PEDIDO_WEB_MUTATION = `
  mutation RegistrarPedidoWeb($input: PedidoWebInput!) {
    registrarPedidoWeb(input: $input) {
      id_pedido_web
      codigo
      estado
      formaPago
      moneda
      total
      clienteNombre
      clienteEmail
      clienteTelefono
      clienteDocumento
      direccionEnvio
      ciudad
      notas
      pagoTransaccionId
      pagoUltimosCuatro
      pagoMensaje
      creadoEn
      detalles {
        id_detalle_pedido_web
        idProducto
        idPresentacionProducto
        nombreProducto
        presentacion
        cantidad
        precioUnitario
        subtotal
      }
    }
  }
`;

export const BUSCAR_PEDIDO_WEB_POR_CODIGO_QUERY = `
  query BuscarPedidoWebPorCodigo($codigo: String!) {
    buscarPedidoWebPorCodigo(codigo: $codigo) {
      id_pedido_web
      codigo
      estado
      formaPago
      moneda
      total
      clienteNombre
      clienteEmail
      clienteTelefono
      direccionEnvio
      ciudad
      notas
      pagoTransaccionId
      pagoUltimosCuatro
      pagoMensaje
      creadoEn
      detalles {
        id_detalle_pedido_web
        idProducto
        idPresentacionProducto
        nombreProducto
        presentacion
        cantidad
        precioUnitario
        subtotal
      }
    }
  }
`;
