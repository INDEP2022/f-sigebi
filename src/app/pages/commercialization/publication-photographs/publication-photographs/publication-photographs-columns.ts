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
    title: 'Bien',
    type: 'number',
    sort: true,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.goodsNumber;
    },
  },
  location: {
    title: 'Photo',
    type: 'html',
    sort: true,
    valuePrepareFunction: (location: string) => {
      return `<img width="50px" src="${location}" />`;
    },
  },
  publicImgcatWeb: {
    title: 'Pública',
    type: 'html',
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
    type: 'boolean',
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
