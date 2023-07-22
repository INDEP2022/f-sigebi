export const NOTARY_COLUMNS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  name: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  valid: {
    title: 'Válido',
    type: 'string',
    valuePrepareFunction: (value: string) => {
      if (value == 'S') return 'Si';
      if (value == 'N') return 'No';

      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'S', title: 'SI' },
          { value: 'N', title: 'NO' },
        ],
      },
    },
    sort: false,
  },
  notaryNumber: {
    title: 'Número Notaria',
    type: 'number',
    sort: false,
  },
  ubication: {
    title: 'Ubicación',
    type: 'string',
    sort: false,
  },
  domicile: {
    title: 'Domicilio',
    type: 'string',
    sort: false,
  },
  phone: {
    title: 'Teléfono',
    type: 'string',
    sort: false,
  },
  email: {
    title: 'Correo',
    type: 'string',
    sort: false,
  },
  registryNumber: {
    title: 'Número de Registro',
    type: 'number',
    sort: false,
  },
};
