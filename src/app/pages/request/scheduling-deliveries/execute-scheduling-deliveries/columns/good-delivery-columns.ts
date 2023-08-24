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
    type: 'custom',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  sumGoodNoEnt: {
    title: 'Total Bienes No Entregados',
    type: 'string',
    sort: false,
  },
  anountNotAccelted: {
    title: 'Cantidad Bienes No Aceptados',
    type: 'custom',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  sumGoodNoAce: {
    title: 'Suma Bienes No Aceptados',
    type: 'string',
    sort: false,
  },
  amountNotWhithdrawn: {
    title: 'Cantidad Bienes No Retirados',
    type: 'custom',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
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

export const CONSTANCY_DELIVERY_COLUMNS = {
  certificateId: {
    title: 'Id Constancia',
    type: 'string',
    sort: false,
  },
  folio: {
    title: 'Folio',
    type: 'string',
    sort: false,
  },
  certificateType: {
    title: 'Tipo Constancia',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: any) => {
      let result = '';
      if (value == 1) result = 'Entregados';
      if (value == 2) result = 'No Entregados';
      if (value == 3) result = 'No Aceptados';
      if (value == 4) result = 'No Retirados';

      return result;
    },
  },
  identificator: {
    title: 'Identificación',
    type: 'string',
    sort: false,
  },
  /* clientIden: {
    title: 'Identificación Cliente',
    type: 'string',
    sort: false,
  },
  repLegalIden: {
    title: 'Identificación Rep. Legal',
    type: 'string',
    sort: false,
  }, */
  IdennNum: {
    title: 'No. Identificación',
    type: 'string',
    sort: false,
  },
  /* clientIdennNum: {
    title: 'No. Identificación Cliente',
    type: 'string',
    sort: false,
  },
  repLegalIdenNum: {
    title: 'No. Identificación Rep. Legal',
    type: 'string',
    sort: false,
  }, */
  name: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  /* client: {
    title: 'Usuario Cliente',
    type: 'string',
    sort: false,
  },
  repLegal: {
    title: 'Usuario Rep. Legal',
    type: 'string',
    sort: false,
  }, */
};
