import { DatePipe } from '@angular/common';

export const REQUEST_LIST_COLUMNS = {
  title: {
    title: 'Tarea',
    type: 'string',
    sort: false,
  },
  requestId: {
    title: 'No. Solicitud',
    type: 'number',
    sort: false,
  },
  taskNumber: {
    title: 'No. de Tarea',
    type: 'string',
    sort: false,
  },

  backwardness: {
    title: 'Días de Atraso',
    type: 'number',
    sort: false,
  },

  State: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },

  createdDate: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      if (date != null) {
        var raw = new Date(date);
        var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy');
      }
      return formatted;
    },
  },
  endDate: {
    title: 'Fecha Finalización',
    type: 'string',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      if (date != null) {
        var raw = new Date(date);
        var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy');
      }
      return formatted;
    },
  },
  idDelegationRegional: {
    title: 'No. Delegación Regional',
    type: 'string',
    sort: false,
  },
  idTransferee: {
    title: 'No. Transferente',
    type: 'string',
    sort: false,
  },
  transferringDescription: {
    title: 'Descripción Transferente',
    type: 'string',
    sort: false,
  },
  idstation: {
    title: 'No. Emisora',
    type: 'string',
    sort: false,
  },
  stationDescription: {
    title: 'Descripción Emisora',
    type: 'string',
    sort: false,
  },
  idAuthority: {
    title: 'No. Autoridad',
    type: 'string',
    sort: false,
  },
  descriptionAuthority: {
    title: 'Descripción Autoridad',
    type: 'string',
    sort: false,
  },
  programmingId: {
    title: 'No. Programación',
    type: 'number',
    sort: false,
  },
  activityName: {
    title: 'Nombre de la Actividad',
    type: 'string',
    sort: false,
    /* valuePrepareFunction: (value: string) => {
      return value ? value.replace(/_/g,' ') : '';
    } */
  },
  creator: {
    title: 'Autor',
    type: 'string',
    sort: false,
  },
  assignees: {
    //originalAssigneeUser: {
    title: 'Asignado a',
    type: 'string',
    sort: false,
  },
  approvers: {
    title: 'Aprobador',
    type: 'string',
    sort: false,
  },
  applicationdescription: {
    title: 'Nombre de la Aplicación',
    type: 'string',
    sort: false,
  },
  processName: {
    title: 'Nombre del Proceso',
    type: 'string',
    sort: false,
  },
  percentageComplete: {
    title: 'Porcentaje Completado',
    type: 'string',
    sort: false,
  },
  instanceId: {
    title: 'No. Instancia',
    type: 'number',
    sort: false,
  },
  //////////////////////////// FALTA SOLO ESTO
  instaId: {
    title: 'Nombre Tarea BPM',
    type: 'number',
    sort: false,
  },
  ////////////////////////////
  outcome: {
    title: 'Salida',
    type: 'number',
    sort: false,
  },
  pushbackSequence: {
    title: 'Secuencia',
    type: 'number',
    sort: false,
  },
  nuMinelapsed: {
    title: 'Duración tiempo (min)',
    type: 'number',
    sort: false,
  },
  nuDayelapsed: {
    title: 'Duración tiempo (Días)',
    type: 'number',
    sort: false,
  },
  idDeliverySchedule: {
    title: 'No. Programación Entrega ',
    type: 'number',
    sort: false,
  },
  idOrderService: {
    title: 'No. Orden Servicio',
    type: 'number',
    sort: false,
  },
  idSampling: {
    title: 'No. Muestreo',
    type: 'number',
    sort: false,
  },
  idSamplingOrder: {
    title: 'No. Muestreo Orden',
    type: 'number',
    sort: false,
  },
  idOrderIncome: {
    title: 'No. Orden Ingreso',
    type: 'number',
    sort: false,
  },
  idOrderPay: {
    title: 'No. Orden Pago',
    type: 'number',
    sort: false,
  },

  //
};
