export const BATTERY_COLUMNS = {
  storeCode: {
    title: 'Cve. Guardavalor',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
    width: '25px',
  },
  idBattery: {
    title: 'No. Bateria',
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
