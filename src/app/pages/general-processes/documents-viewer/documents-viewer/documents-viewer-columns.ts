import { CustomDateMounthFilterComponent } from '../../../../@standalone/shared-forms/filter-date-mounth-custom/custom-date-mounth-filter';

export const GENERAL_DOCS_DOCUMENTS_VIEWER_COLUMNS = {
  numberProceedings: {
    title: 'No. Expediente',
    sort: false,
  },
  flyerNumber: {
    title: 'No. Volante',
    sort: false,
  },
  keyTypeDocument: {
    title: 'Tipo documento',
    sort: false,
  },
  significantDate: {
    title: 'Fecha significativa',
    sort: false,
    //   valuePrepareFunction: (text: string) => {
    //   return `${
    //     text ? text.split('T')[0].split('-').reverse().join('-') : ''
    //   }`;
    // },
    filter: {
      type: 'custom',
      component: CustomDateMounthFilterComponent,
    },
  },
  id: {
    title: 'Folio universal',
    sort: false,
  },
  descriptionDocument: {
    title: 'Desc. documento',
    sort: false,
  },
  sheets: {
    title: 'Hojas',
    sort: false,
  },
};

function generateData() {
  const data = [];
  for (let index = 0; index < 10; index++) {
    const el = {
      expediente: 'TEST',
      voalnte: 'TEST',
      tipo: 'TEST',
      fecha: 'TEST',
      folio: 'TEST',
      desc: 'TEST',
      hojas: 'TEST',
      status: false,
    };
    const random = Math.random() * 10;
    el.status = random > 5;
    data.push(el);
  }
  return data;
}

export const GENERAL_DOCS_DOCUMENTS_VIEWER_DATA = generateData();
