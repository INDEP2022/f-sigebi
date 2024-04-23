import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const CONTROLSERVICEORDERS_COLUMNS = {
  formatKey: {
    title: 'Orden de Servicio',
    width: '10%',
    sort: false,
  },
  captureDate: {
    title: 'Fecha Captura',
    width: '15%',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  status: {
    title: 'Estado',
    width: '10%',
    sort: false,
    filterFunction: () => {
      return true;
    },
  },
  descriptionProcess: {
    title: 'Proceso',
    width: '30%',
    sort: false,
    filterFunction: () => {
      return true;
    },
  },
  regionalDelegation: {
    title: 'Delegación Regional',
    width: '30%',
    sort: false,
    filterFunction: () => {
      return true;
    },
  },
  implementationReport: {
    title: 'Reporte Implementación',
    width: '5%',
    filter: false,
    sort: false,
  },
};

export const BITACORA_COLUMNS = {
  changeDate: {
    title: 'Fecha de Cambio',
    width: '15%',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  justification: {
    title: 'Justificación',
    width: '10%',
    sort: false,
    filterFunction: () => {
      return true;
    },
  },
  status: {
    title: 'Estatus',
    width: '30%',
    sort: false,
    filterFunction: () => {
      return true;
    },
  },
  user: {
    title: 'Usuario',
    width: '30%',
    sort: false,
    filterFunction: () => {
      return true;
    },
  },
};
