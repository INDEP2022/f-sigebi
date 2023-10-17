import { DatePipe } from '@angular/common';

export const DATA_COLUMNS = {
  NoMovimiento: {
    title: 'No. Movimiento',
    sort: false,
  },
  FechaMov: {
    title: 'Fecha Movimiento',
    sort: false,
    valuePrepareFunction: (date: number): string => {
      const fechaString = date.toString();
      const año = fechaString.substring(0, 4);
      const mes = fechaString.substring(4, 6);
      const dia = fechaString.substring(6, 8);
      const fecha = new Date(`${año}-${mes}-${dia}`);
      var formatted = new DatePipe('en-EN').transform(
        fecha,
        'dd/MM/yyyy',
        'UTC'
      );
      return formatted;
    },
  },
  Movimiento: {
    title: 'Movimiento',
    sort: false,
  },
  Cuenta: {
    title: 'cuenta',
    sort: false,
  },
  Referencia: {
    title: 'Referencia',
    sort: false,
  },
  ReferenciaOrdenIngreso: {
    title: 'Referencia Orden Ingreso',
    sort: false,
  },
  Banco: {
    title: 'Banco',
    sort: false,
  },
  Sucursal: {
    title: 'Sucursal',
    sort: false,
  },
  Monto: {
    title: 'Monto',
    sort: false,
  },
  Resultado: {
    title: 'Resultado',
    sort: false,
  },
  /*valid: {
    title: 'Validar',
    sort: false,
  },*/
  ValidoText: {
    title: 'Valido',
    sort: false,
  },
  idPago: {
    title: 'Id Pago',
    sort: false,
  },
  LotePublico: {
    title: 'Lote Público',
    sort: false,
  },
  Evento: {
    title: 'Evento',
    sort: false,
  },
  OrdenIngreso: {
    title: 'Orden de Ingreso',
    sort: false,
  },
  Fecha: {
    title: 'Fecha',
    sort: false,
  },
  DescripcionSAT: {
    title: 'Descripción SAT',
    sort: false,
  },
  Contador: {
    title: 'Id Recorrido',
    sort: false,
  },
};
