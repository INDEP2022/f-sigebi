import { InputDateComponent } from '../../../transfer-request/tabs/compliance-verification-components/verify-compliance-tab/input-date/input-date.component';

export const LIST_RESTITUTION_COLUMNS = {
  goodId: {
    title: 'No. Gestión',
    type: 'string',
    sort: false,
  },
  inventoryNumber: {
    title: 'No. Inventario',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  unit: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },
  typeRestitution: {
    title: 'Tipo Restitución',
    type: 'string',
    sort: false,
  },
  repositionDate: {
    title: 'Fecha Reposición',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: InputDateComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },

  quantityBreak: {
    title: 'Cantidad faltante/dañado',
    type: 'string',
    sort: false,
  },
};
