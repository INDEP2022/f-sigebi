import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const GENERAL_PROCESSES_OPINION_COLUNNS = {
  coordinacion_regional: {
    title: 'Coordinación Regional',
    sort: false,
  },
  cve_dictamen: {
    title: 'Tipo de Desahogo',
    sort: false,
  },
  no_oficio: {
    title: 'Número de Oficio',
    sort: false,
  },
  no_expediente: {
    title: 'Número de Expediente',
    sort: false,
  },
  no_volante: {
    title: 'Número Volante',
    sort: false,
  },
  finiind: {
    title: 'Fecha Volante',
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
  ffinaliza: {
    title: 'Fecha Desahogo',
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
  fmaxima: {
    title: 'Fecha Máxima',
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
  uinicia: {
    title: 'Usuario',
    sort: false,
  },
  // cumplio: {
  //     title: 'Cumplio',
  //     sort: false
  // },
};
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
export const GENERAL_PROCESSES_OPINION_DATA = getData();
