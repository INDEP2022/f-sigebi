import { InputFieldComponent } from '../input-field/input-field.component';

export const GOOD_DELIVERY_COLUMN = {
  item: {
    title: 'Item',
    type: 'string',
    sort: false,
  },
  inventoryNumber: {
    title: 'No. Inventario',
    type: 'string',
    sort: false,
  },
  goodId: {
    title: 'No. Gestión',
    type: 'string',
    sort: false,
  },
  descriptionGood: {
    title: 'Descripción Bien',
    type: 'string',
    sort: false,
  },
  amountGood: {
    title: 'Cantidad Bienes',
    type: 'string',
    sort: false,
  },
  unit: {
    title: 'Unidad de Medida',
    type: 'string',
    sort: false,
  },
  nosae: {
    title: 'No. SAE',
    type: 'string',
    sort: false,
  },
  commercialLot: {
    title: 'Lote Comercial',
    type: 'string',
    sort: false,
  },
  commercialEventDate: {
    title: 'Evento Comercial',
    type: 'string',
    sort: false,
  },
  invoice: {
    title: 'Factura',
    type: 'string',
    sort: false,
  },
  amountDelivered: {
    title: 'Cantidad Entregados',
    type: 'custom',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  sunGoodEnt: {
    title: 'Total Bienes Entregados',
    type: 'string',
    sort: false,
  },
  amountNotDelivered: {
    title: 'Cantidad No Entregados',
    type: 'string',
    sort: false,
  },
  sumGoodNoEnt: {
    title: 'Total Bienes No Entregados',
    type: 'string',
    sort: false,
  },
  anountNotAccelted: {
    title: 'Cantidad Bienes No Aceptados',
    type: 'string',
    sort: false,
  },
  sumGoodNoAce: {
    title: 'Cantidad Bienes No Aceptados',
    type: 'string',
    sort: false,
  },
  amountNotWhithdrawn: {
    title: 'Cantidad Bienes No Retirados',
    type: 'string',
    sort: false,
  },
  sumGoodNoRet: {
    title: 'Suma Bienes No Retirados',
    type: 'string',
    sort: false,
  },
  missing: {
    title: 'Faltante',
    type: 'string',
    sort: false,
  },
};
