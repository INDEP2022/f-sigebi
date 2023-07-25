import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const GENERAL_RECEPTION_STRATEGIES_COLUNNS = {
  proceedings: {
    title: 'Expediente',
    sort: false,
  },
  id: {
    title: 'Bien',
    sort: false,
  },
  statusGood: {
    title: 'Estatus Bien',
    sort: false,
  },
  keyCodeMinutesReception: {
    title: 'Clave Acta Recepción',
    sort: false,
  },
  coordinationRegional: {
    title: 'Coordinación Regional',
    sort: false,
  },
  usrActrecep: {
    title: 'Usuario',
    sort: false,
  },
  captureMinutesReceptionDate: {
    title: 'Fecha de Estrategia',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  fin: {
    title: 'Fecha page Programación',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  receptionPhysicalDate: {
    title: 'Fecha Fin Programación',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  cumplio: {
    title: 'Cumplio',
    sort: false,
    /* valuePrepareFunction: (text: string) => {
      return text === 'S' ? 'SI' : 'NO';
    } */
  },
};

///cumplio
function getData() {
  const data = [];
  const el = {
    regional: 'EXAMPLE_DATA',
    cve: 'EXAMPLE_DATA',
    expediente: 'EXAMPLE_DATA',
    noVolante: 'EXAMPLE_DATA',
    tramite: 'EXAMPLE_DATA',
    usuario: 'EXAMPLE_DATA',
    page: 'EXAMPLE_DATA',
    fin: 'EXAMPLE_DATA',
    max: 'EXAMPLE_DATA',
  };
  for (let index = 0; index < 10; index++) {
    data.push(el);
  }
  return data;
}
export const GENERAL_RECEPTION_STRETEGIES_DATA = getData();
