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
  /*dffDays: {

    title: 'Días de Atraso',
    type: 'number',
    sort: false,

  },*/
  /*nonBusinessDays: {

    title: 'Días Inhábiles',
    type: 'number',
    sort: false,

  },*/
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
  activitydescription: {
    title: 'Nombre de la Actividad',
    type: 'string',
    sort: false,
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

  processName: {
    title: 'Proceso',
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
  processdescription: {
    title: 'Nombre del Proceso',
    type: 'string',
    sort: false,
  },
  percentageComplete: {
    title: 'Porcentaje Completado',
    type: 'string',
    sort: false,
  },
  /*assignedDate: {
    title: 'Fecha Asignación',
    type: 'string',
    sort: false,
  },*/

  instanceId: {
    title: 'No. Instancia',
    type: 'number',
    sort: false,
  },

  //
};
