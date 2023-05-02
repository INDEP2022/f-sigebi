export const GENERAL_PROCESSES_TECHNICAL_DATASHEET_COLUNNS = {
  regional: {
    title: 'Año',
    sort: false,
  },
  cve: {
    title: 'Mes',
    sort: false,
  },
  expediente: {
    title: 'Usuario',
    sort: false,
  },
  noVolante: {
    title: 'Coordinador Regional',
    sort: false,
  },
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
    max2: 'EXAMPLE_DATA',
  };
  for (let index = 0; index < 10; index++) {
    data.push(el);
  }
  return data;
}
export const GENERAL_PROCESSES_TECHNICAL_DATASHEET_DATA = getData();
