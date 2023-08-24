import { DatePipe } from '@angular/common';

export const CAPTURE_LINES = {
  id_evento: {
    title: 'Evento',
    sort: false,
  },
  id_lote: {
    title: 'Lote',
    sort: false,
  },
  rfc: {
    title: 'RFC',
    sort: false,
  },
  referencia: {
    title: 'Referencia',
    sort: false,
  },
  estatus: {
    title: 'Estado',
    sort: false,
  },
  tipo_lc: {
    title: 'Tipo de LC',
    sort: false,
  },
  fec_vigencia: {
    title: 'Fecha de Vigencia',
    sort: false,
    valuePrepareFunction: (fecha_pago: string) => {
      const datePipe = new DatePipe('en-US');
      const fechaObjeto = new Date(fecha_pago);
      return datePipe.transform(fechaObjeto, 'dd/MM/yyyy');
    },
  },
  monto: {
    title: 'Monto',
    sort: false,
  },
  penalty: {
    title: 'Personalización',
    sort: false,
  },
  monto_pagar: {
    title: 'Monto a Pagar',
    sort: false,
  },
  vista: {
    title: 'Vista',
    sort: false,
  },
};

export const CAPTURE_LINES_CLIENTS = {
  id_evento: {
    title: 'Evento',
    sort: false,
  },
  cve_proceso: {
    title: 'Cve Evento',
    sort: false,
  },
  direccion_des: {
    title: 'Tipo de Bien',
    sort: false,
  },
  id_lote: {
    title: 'Lote',
    sort: false,
  },
  lote_publico: {
    title: 'Lote Publico',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    sort: false,
  },
  cliente: {
    title: 'Cliente',
    sort: false,
  },
  rfc: {
    title: 'RFC',
    sort: false,
  },
  telefono: {
    title: 'Teléfono',
    sort: false,
  },
  correoweb: {
    title: 'Correo',
    sort: false,
  },
  precio_final: {
    title: 'Precio',
    sort: false,
  },
  monto_pagado: {
    title: 'Monto Pagado',
    sort: false,
  },
  pendiente_pagar: {
    title: 'Pago Pendiente',
    sort: false,
  },
};
