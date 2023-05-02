export const GENERAL_PROCESSES_OPINION_COLUNNS = {
  regional: {
    title: 'Regional',
    sort: false,
  },
  cve: {
    title: 'Tipo de Desahogo',
    sort: false,
  },
  expediente: {
    title: 'Número de Oficio',
    sort: false,
  },
  noVolante: {
    title: 'Número de Expediente',
    sort: false,
  },
  tramite: {
    title: 'Número Volante',
    sort: false,
  },
  usuario: {
    title: 'Fecha Volante',
    sort: false,
  },
  page: {
    title: 'Fecha Desahogo',
    sort: false,
  },
  fin: {
    title: 'Fecha Máxima',
    sort: false,
  },
  max: {
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
