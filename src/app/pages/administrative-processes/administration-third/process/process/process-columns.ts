export const PROCESS_COLUMNS = {
  processNumber: {
    title: 'Número',
    sort: false,
  },
  desShort: {
    title: 'Clave',
    sort: false,
  },
  relayEstate: {
    title: 'Relacionado Bienes',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value === 'N') {
        return 'No';
      } else if (value === 'S') {
        return 'Sí';
      } else {
        return '';
      }
    },
  },
  relayStrategy: {
    title: 'Requiere Est. Admon.',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (value === 'N') {
        return 'No';
      } else if (value === 'S') {
        return 'Sí';
      } else {
        return '';
      }
    },
  },
  programmingType: {
    title: 'Tipo programación',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
};
