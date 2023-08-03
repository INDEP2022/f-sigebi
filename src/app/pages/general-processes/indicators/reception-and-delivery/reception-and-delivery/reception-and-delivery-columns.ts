export const GENERAL_PROCESSES_RECEPTION_AND_DELIVERY_COLUNNS = {
  regional: {
    title: 'Cve. Acta/Evento',
    sort: false,
  },
  cve: {
    title: 'Coord.',
    sort: false,
  },
  expediente: {
    title: 'Usuario',
    sort: false,
  },
  noVolante: {
    title: 'Expediente',
    sort: false,
  },
  tramite: {
    title: 'Cantidad de Registros',
    sort: false,
  },
  usuario: {
    title: 'Cantidad de Bienes',
    sort: false,
  },
  inicio: {
    title: 'Fecha Inicio',
    sort: false,
  },
  max: {
    title: 'Fecha Término',
    sort: false,
  },
  max2: {
    title: 'Fecha Máxima',
    sort: false,
  },
  cumplio: {
    title: 'Cumplió',
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
export const GENERAL_PROCESSES_RECEPTION_AND_DELIVERY_DATA = getData();
