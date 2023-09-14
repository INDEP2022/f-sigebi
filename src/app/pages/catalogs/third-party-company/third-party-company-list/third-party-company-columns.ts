export const THIRDPARTYCOMPANY_COLUMS = {
  id: {
    title: 'Registro',
    type: 'number',
    sort: false,
  },
  keyCompany: {
    title: 'Clave',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  keyZoneContract: {
    title: 'Clave Zona Contrato',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value != null ? value.description : '';
    },
  },
};
