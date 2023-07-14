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
    title: 'Tipo Documento',
    sort: false,
  },
  significantDate: {
    title: 'Fecha Significativa',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomDateMounthFilterComponent,
    },
    // valuePrepareFunction: (date: string) => formatDate(date),
  },
  id: {
    title: 'Folio Universal',
    sort: false,
  },
  descriptionDocument: {
    title: 'Desc. Documento',
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

function formatDate(date: string): string {
  return date.replace('-', '/');
}

export const GENERAL_DOCS_DOCUMENTS_VIEWER_DATA = generateData();
