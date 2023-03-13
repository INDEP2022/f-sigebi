export const GENERAL_RECEPTION_STRATEGIES_COLUNNS = {
  regional: {
    title: 'Expediente',
    sort: false,
  },
  cve: {
    title: 'Bien',
    sort: false,
  },
  expediente: {
    title: 'Estatus Bien',
    sort: false,
  },
  noVolante: {
    title: 'Clave Acta Recepción',
    sort: false,
  },
  tramite: {
    title: 'Coordinación Regional',
    sort: false,
  },
  usuario: {
    title: 'Usuario',
    sort: false,
  },
  page: {
    title: 'Fecha de Estrategia',
    sort: false,
  },
  fin: {
    title: 'Fecha page Programación',
    sort: false,
  },
  max: {
    title: 'Fecha Fin Programación',
    sort: false,
  },
  cumplio: {
    title: 'Cumplio',
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
  };
  for (let index = 0; index < 10; index++) {
    data.push(el);
  }
  return data;
}
export const GENERAL_RECEPTION_STRETEGIES_DATA = getData();
