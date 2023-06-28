export const REGULATORY_COLUMNS = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  fractionId: {
    title: 'No. Fracción',
    type: 'number',
    sort: false,
  },
  fractionDetails: {
    title: 'Fracción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.description;
    },
    filterFunction(cell?: any, search?: string): boolean {
      let column = cell.description;
      if (column?.toUpperCase() >= search.toUpperCase() || search === '') {
        return true;
      } else {
        return false;
      }
    },
  },
  number: {
    title: 'Número',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  validateEf: {
    title: 'Validar Ef',
    type: 'string',
    sort: false,
  },
  validateEc: {
    title: 'Validar Ec',
    type: 'string',
    sort: false,
  },
  version: {
    title: 'Versión',
    type: 'number',
    sort: false,
  },
};
