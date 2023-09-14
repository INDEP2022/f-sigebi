import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const CONTROLSERVICEORDERS_COLUMNS = {
  serviceOrder: {
    title: 'Orden de Servicio',
    width: '10%',
    sort: false,
  },
  captureDate: {
    title: 'Fecha Captura',
    width: '10%',
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
  },
  noProcess: {
    title: 'No. Proceso',
    width: '5%',
    sort: false,
  },
  process: {
    title: 'Proceso',
    width: '10%',
    sort: false,
  },
  noRegionalDelegation: {
    title: 'No. Delegación Regional',
    width: '5%',
    sort: false,
  },
  regionalDelegation: {
    title: 'Delegación Regional',
    width: '10%',
    sort: false,
  },
  implementationReport: {
    title: 'Reporte Implementación',
    width: '10%',
    sort: false,
  },
};
