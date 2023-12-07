import { InputTextComponent } from 'src/app/pages/request/transfer-request/tabs/compliance-verification-components/verify-compliance-tab/input-text/input-text.component';
import { QuantitySaeInputComponent } from 'src/app/pages/request/transfer-request/tabs/compliance-verification-components/verify-compliance-tab/quantity-sae-input/quantity-sae-input.component';

export const LIST_VERIFY_NONCOMPLIANCE = {
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
  evaluationResult: {
    title: 'Resultado de evaluación',
    type: 'string',
    sort: false,
  },
  goodState: {
    title: 'Estado del bien',
    type: 'string',
    sort: false,
  },
  quantityBreak: {
    title: 'Cantidad faltante/dañado',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: QuantitySaeInputComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },

  statusGoodObservations: {
    title: 'Observaciones Estado de Bien',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: InputTextComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
};

export const LIST_VERIFY_WAREHOUSE = {
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
  evaluationResult: {
    title: 'Resultado de evaluación',
    type: 'string',
    sort: false,
  },
  goodStatus: {
    title: 'Estado del bien',
    type: 'string',
    sort: false,
  },
  quantityBreak: {
    title: 'Cantidad faltante/dañado',
    type: 'string',
    edit: true,
    sort: false,
  },
  statusGoodObservations: {
    title: 'Observaciones Estado del Bien',
    type: 'string',
    edit: true,
    sort: false,
  },
};
