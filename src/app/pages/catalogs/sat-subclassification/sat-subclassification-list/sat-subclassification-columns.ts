export const SAT_SUBCLASSIFICATION_COLUMNS = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
    width: '10%',
  },
  nameSubClasification: {
    title: 'Nombre Subclasificación',
    type: 'string',
    sort: false,
    width: '40%',
  },
  clasificationDetails: {
    title: 'Clasificación',
    type: 'string',
    sort: false,
    width: '40%',
    valuePrepareFunction: (value: any) => {
      return value.typeDescription;
    },
    filterFunction: (cell?: any, search?: string) => {
      return search != null ? search : '';
    },
  },
};
