export const BATTERY_COLUMNS = {
  idBattery: {
    title: 'No. Bateria',
    sort: false,
    filter: false,
  },
  storeCode: {
    title: 'No. Guardavalor',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
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
  registerNumber: {
    title: 'No. Registrado',
    sort: false,
    filter: false,
  },
};
