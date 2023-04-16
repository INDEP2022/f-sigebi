import { CheckboxComponent } from './checkbox/checkbox.component';
import { FulfillmentComponent } from './fulfillment/fulfillment.component';

export const VERIRY_COMPLIANCE_COLUMNS = {
  cumple: {
    title: '',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: CheckboxComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  fulfill: {
    /*  title: 'Cumplimiento',
    type: 'string',
    sort: false, */
    title: 'Cumplimiento',
    type: 'custom',
    class: 'custom-fulfill',
    filter: false,
    renderComponent: FulfillmentComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  article: {
    title: 'Artículo',
    type: 'string',
    sort: false,
  },
};
