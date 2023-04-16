import { SelectUserComponent } from 'src/app/shared/render-components/select-user/select-user.component';

export const COLUMNS = {
  item: {
    title: 'Item',
    type: 'string',
    sort: false,
    editable: false,
    addable: false,
  },

  numberInventory: {
    title: 'Número inventario',
    type: 'string',
    sort: false,
    editable: false,
    addable: false,
  },

  gestionNumber: {
    title: 'Número de gestión',
    type: 'number',
    sort: false,
    editable: false,
    addable: false,
  },

  descriptionGood: {
    title: 'Descripción bien',
    type: 'string',
    sort: false,
    editable: false,
    addable: false,
  },

  causeNotDelivered: {
    title: 'Causa de no entrego',
    type: 'string',
    sort: false,
    editor: {
      type: 'custom',
      component: SelectUserComponent,
    },
  },

  numberSae: {
    title: 'Número INDEP',
    type: 'number',
    sort: false,
    editable: false,
    addable: false,
  },

  quantityEstate: {
    title: 'Cantidad bienes',
    type: 'number',
    sort: false,
    editable: false,
    addable: false,
  },

  measureUnit: {
    title: 'Unidad de medida',
    type: 'number',
    sort: false,
    editable: false,
    addable: false,
  },

  totalGoodsDelivered: {
    title: 'Total de bienes entregados',
    type: 'number',
    sort: false,
    editable: false,
    addable: false,
  },

  observation: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
    editable: false,
    addable: false,
  },
};
