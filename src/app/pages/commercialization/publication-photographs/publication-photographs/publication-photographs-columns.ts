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
  id: {
    title: 'Lote',
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
  button: {
    title: 'Button',
    type: 'custom',
  },
};
export const SUBTYPE = {
  id: {
    title: 'Subtipo',
    sort: false,
    filter: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.id;
    },
  },
  creationUser: {
    title: 'Usuario',
    sort: false,
    filter: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.creationUser;
    },
  },
  creationDate: {
    title: 'Fecha de creación',
    sort: false,
    filter: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.creationDate;
    },
  },
  noPhotography: {
    title: 'Numero de fotografías',
    sort: false,
    filter: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.noPhotography;
    },
  },
  descriptionPhotography: {
    title: 'descripción de foto',
    sort: false,
    filter: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.descriptionPhotography;
    },
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

export const Lot = {
  id: {
    title: 'Lote',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Description',
    type: 'string',
    sort: true,
  },
  statusVtantId: {
    title: 'Estatus',
    type: 'number',
    sort: true,
  },
  customerId: {
    title: 'Cliente',
    type: 'string',
    sort: true,
  },
  goodsNumber: {
    type: 'list',
    location: {
      title: 'Bien',
      type: 'string',
      sort: true,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.goodsNumber.location;
      },
    },
  },
  events: {
    type: 'list',
    id: {
      title: 'Evento',
      type: 'number',
      sort: true,
      valuePrepareFunction: (cell: any, row: any) => {
        return row.events.id;
      },
    },
  },
};
export const GoodPhoto = {
  goodsNumber: {
    title: 'Photo',
    type: 'number',
    sort: true,
  },
  location: {
    title: 'Ubicación de archivo',
    type: 'string',
    sort: true,
  },
  publicImgcatWeb: {
    title: 'Pública',
    type: 'number',
    sort: true,
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
  existsfs: {
    title: 'Favoritos',
    type: 'number',
    sort: true,
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
};

export const Events = {
  id: {
    title: 'Lote',
    type: 'number',
    sort: false,
  },
  address: {
    title: 'Dirección de evento',
    type: 'number',
    sort: false,
  },
  failureDate: {
    title: 'Fecha de evento',
    type: 'string',
    sort: false,
  },
  place: {
    title: 'Lugar',
    type: 'string',
    sort: false,
  },
  eventDate: {
    title: 'Fecha de evento',
    type: 'string',
    sort: false,
  },
  baseCost: {
    title: 'Costo inicial',
    type: 'number',
    sort: false,
  },
  baseVendNumber: {
    title: 'Venta inicial',
    type: 'number',
    sort: false,
  },
};
