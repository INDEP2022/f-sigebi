export const PUBLICATION_PHOTO1 = {
  allotment: {
    title: 'lote',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  status: {
    title: 'Estado',
    sort: false,
  },
  customer: {
    title: 'Cliente',
    sort: false,
  },
};

export const PUBLICATION_PHOTO2 = {
  noGood: {
    title: 'No. Bien',
    sort: false,
  },
  status: {
    title: 'Estado',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
};

export const dataBatchColum = {
  id: {
    title: 'id Lote',
    type: 'string',
    sort: true,
  },
  description: {
    title: 'Description',
    type: 'string',
    sort: true,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: true,
  },
  numStore: {
    type: 'list',
    ubication: {
      title: 'Ubicación',
      type: 'string',
      sort: true,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.numStore.ubication;
      },
    },
    manager: {
      title: 'Ubicación',
      type: 'string',
      sort: true,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.numStore.manager;
      },
    },
  },
};
