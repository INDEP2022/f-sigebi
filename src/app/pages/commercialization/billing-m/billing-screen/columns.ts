import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

let this_: any = this;
// import { onBillingSelect } from "./billing-screen.component"
export const FACTURAS = {};
export const DETALLES_FACTURAS = {};

export const INCONSISTENCIAS = {
  eventId: {
    title: 'Evento',
    type: 'string',
    sort: false,
    width: '15%',
  },
  goodNumber: {
    title: 'No. Bien / No. Pago',
    type: 'string',
    sort: false,
    width: '20%',
  },
  batchPublic: {
    title: 'Lote Público',
    type: 'string',
    sort: false,
    width: '15%',
  },
  downloadMistake: {
    title: 'Descripción Error (Procedimiento/Nulos)',
    type: 'string',
    sort: false,
    width: '50%',
    filter: false,
  },
};
export const INCONSISTENCIAS1 = {
  eventId: {
    title: 'Evento',
    type: 'string',
    sort: false,
    width: '15%',
  },
  goodNumber: {
    title: 'Factura',
    type: 'string',
    sort: false,
    width: '20%',
  },
  batchPublic: {
    title: 'Lote Público',
    type: 'string',
    sort: false,
    width: '15%',
  },
  downloadMistake: {
    title: 'Descripción Error (al solicitar folio a SIRSAE)',
    type: 'string',
    sort: false,
    width: '50%',
    filter: false,
  },
};

export const COMER_EST_LOTES = {
  idEvent: {
    title: 'Evento',
    type: 'string',
    sort: false,
    width: '10%',
  },
  lotPublic: {
    title: 'Lote Público',
    type: 'string',
    sort: false,
    width: '10%',
  },
  status: {
    title: 'Estatus Solicitado',
    type: 'string',
    sort: false,
    width: '15%',
  },
  statusAnt: {
    title: 'Estatus Ant',
    type: 'string',
    sort: false,
    width: '10%',
  },
  changeDate: {
    title: 'Fecha Cambio',
    type: 'string',
    sort: false,
    width: '15%',
    valuePrepareFunction: (text: string) => {
      // console.log('text', text);
      if (!text) return null;
      const fechaOriginal: any = text;

      // Dividir la fecha en día, mes y año
      const partesFecha = fechaOriginal.split('-');
      const dia = partesFecha[0];
      const mes = partesFecha[1] - 1; // Restamos 1 ya que los arrays en JavaScript comienzan desde 0
      const ano = partesFecha[2];

      // Crear la nueva fecha en el formato deseado
      const fechaTransformada = `${dia}-${mes}-${ano}`;
      // console.log("fechaTransformada", fechaTransformada)
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  changeReason: {
    title: 'Motivo Cambio',
    type: 'string',
    sort: false,
    width: '30%',
  },
  changeType: {
    title: 'Tipo Cambio',
    type: 'string',
    sort: false,
    width: '15%',
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 1, title: 'Última actualización del lote solicitada' },
          { value: 2, title: 'Automático' },
          { value: 3, title: 'Última actualización del evento solicitada' },
          { value: 4, title: 'Automático' },
          { value: 5, title: 'Histórico Lote' },
          { value: 6, title: 'Histórico Evento' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.changeType == 1) {
        return 'Última actualización del lote solicitada';
      } else if (row.changeType == 2) {
        return 'Automático';
      } else if (row.changeType == 3) {
        return 'Última actualización del evento solicitada';
      } else if (row.changeType == 4) {
        return 'Automático';
      } else if (row.changeType == 5) {
        return 'Histórico Lote';
      } else if (row.changeType == 6) {
        return 'Histórico Evento';
      } else {
        return row.changeType;
      }
    },
  },
  user: {
    title: 'Usuario',
    type: 'string',
    sort: false,
    width: '15%',
  },
};
