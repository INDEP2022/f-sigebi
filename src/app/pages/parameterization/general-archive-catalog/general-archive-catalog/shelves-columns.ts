export const SHELVES_COLUMNS = {
  key: {
    title: 'Cve. Guardavalor',
    sort: false,
    filter: false,
    width: '25px',
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
  },
  batteryNumber: {
    title: 'No. Bateria',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: any) => {
      return value.idBattery;
    },
  },
  id: {
    title: 'No. Estante',
    sort: false,
    filter: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    filter: false,
  },
  status: {
    title: 'Estado',
    sort: false,
    filter: false,
  },
};
