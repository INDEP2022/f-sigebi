import { DatePipe } from '@angular/common';

export const WINNERS_REPORT_COLUMNS = {
  id_evento: {
    title: 'Id Evento',
    sort: false,
  },
  lote: {
    title: 'Lote',
    sort: false,
  },
  referencia: {
    title: 'Referencia',
    sort: false,
  },
  monto: {
    title: 'Monto',
    sort: false,
  },
  fecha_pago: {
    title: 'Fecha Pago',
    sort: false,
    valuePrepareFunction: (fecha_pago: string) => {
      const datePipe = new DatePipe('en-US');
      const fechaObjeto = new Date(fecha_pago);
      return datePipe.transform(fechaObjeto, 'dd/MM/yyyy');
    },
  },
  cve_banco: {
    title: 'Cve Banco',
    sort: false,
  },
  cuenta: {
    title: 'Cuenta',
    sort: false,
  },
  id_cliente: {
    title: 'Id Cliente',
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
    title: 'Correo Web',
    sort: false,
  },
  clabe_interbancaria: {
    title: 'CLABE',
    sort: false,
  },
  banco: {
    title: 'Banco',
    sort: false,
  },
  sucursal: {
    title: 'Sucursal',
    sort: false,
  },
  cuenta_cheques: {
    title: 'Cuenta de Cheques',
    sort: false,
  },
};
