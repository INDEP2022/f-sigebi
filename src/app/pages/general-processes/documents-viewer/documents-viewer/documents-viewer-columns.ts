export const GENERAL_DOCS_DOCUMENTS_VIEWER_COLUMNS = {
  expediente: {
    title: 'No Expediente',
    sort: false,
  },
  voalnte: {
    title: 'No Expediente',
    sort: false,
  },
  tipo: {
    title: 'No Expediente',
    sort: false,
  },
  fecha: {
    title: 'No Expediente',
    sort: false,
  },
  folio: {
    title: 'No Expediente',
    sort: false,
  },
  desc: {
    title: 'No Expediente',
    sort: false,
  },
  hojas: {
    title: 'No Expediente',
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
