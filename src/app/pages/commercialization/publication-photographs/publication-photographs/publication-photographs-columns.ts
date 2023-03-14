import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

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
export const numStoreColumn = {
  numStore: {
    idWarehouse: {
      title: 'Almacén',
      type: 'string',
      sort: false,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.numStore.idWarehouse;
      },
    },
    description: {
      title: 'Descripción',
      type: 'string',
      sort: false,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.numStore.description;
      },
    },
    ubication: {
      title: 'Ubicación',
      type: 'string',
      sort: false,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.numStore.ubication;
      },
    },
    manager: {
      title: 'Cliente',
      type: 'string',
      sort: false,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.numStore.manager;
      },
    },
    registerNumber: {
      title: 'Número de registro',
      type: 'string',
      sort: false,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.numStore.registerNumber;
      },
    },
    indActive: {
      title: 'Activo',
      sort: true,
      type: 'custom',
      renderComponent: CheckboxElementComponent,
      onComponentInitFunction(instance: any) {
        instance.toggle.subscribe((data: any) => {
          data.row.to = data.toggle;
        });
      },
      valuePrepareFunction: (cell: any, row: any) => {
        return row.numStore.indActive;
      },
    },
  },
};

export const dataBatchColum = {
  id: {
    title: 'id Lote',
    type: 'string',
    sort: false,
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
    manager: {
      title: 'Cliente',
      type: 'string',
      sort: true,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.numStore.manager;
      },
    },
  },
};

export const SUBTYPE = {
  // id: {
  //   title: 'Subtipo',
  //   sort: false,
  //   filter: false,
  // },

  creationUser: {
    title: 'Usuario',
    sort: false,
    filter: false,
  },
  creationDate: {
    title: 'Fecha de creación',
    sort: false,
    filter: false,
  },
  noPhotography: {
    title: 'Numero de fotografías',
    sort: false,
    filter: false,
  },
  descriptionPhotography: {
    title: 'descripción de foto',
    sort: false,
    filter: false,
  },
  idTypeGood: {
    type: 'list',
    id: {
      title: 'Tipo',
      sort: false,
      filter: false,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.idTypeGood.id;
      },
    },
    nameGoodType: {
      title: 'Nombre de Tipo',
      sort: false,
      filter: false,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.idTypeGood.nameGoodType;
      },
    },
  },
};

export const TYPE = {
  idTypeGood: {
    id: {
      title: 'Tipo de Bien',
      sort: false,
      filter: false,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.idTypeGood.id;
      },
    },
    nameGoodType: {
      title: 'Nombre de Bien',
      sort: false,
      filter: false,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.idTypeGood.nameGoodType;
      },
    },
    manager: {
      title: 'Número de registro',
      sort: false,
      filter: false,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.idTypeGood.manager;
      },
    },
  },
};
