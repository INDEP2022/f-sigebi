import { CheckboxComponent } from './checkbox/checkbox.component';

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
  downloadCompliance: {
    title: 'Cumplimiento',
    type: 'string',
    sort: false,
  },
  article: {
    title: 'Acticulo',
    type: 'string',
    sort: false,
  },
};
