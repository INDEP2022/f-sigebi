export const GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_COLUNNS = {
  regional: {
    title: 'Regional',
    sort: false,
  },
  cve: {
    title: 'Cve Oficio Externo',
    sort: false,
  },
  expediente: {
    title: 'No Expediente',
    sort: false,
  },
  noVolante: {
    title: 'No Volante',
    sort: false,
  },
  tramite: {
    title: 'No Tramite',
    sort: false,
  },
  usuario: {
    title: 'Usuario',
    sort: false,
  },
  page: {
    title: 'Fecha page Ind.',
    sort: false,
  },
  fin: {
    title: 'Fecha Fin Ind.',
    sort: false,
  },
  max: {
    title: 'Fecha Máxima',
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
export const GENERAL_PROCESSES_CAPTURE_DIGITALIZATION_DATA = getData();
