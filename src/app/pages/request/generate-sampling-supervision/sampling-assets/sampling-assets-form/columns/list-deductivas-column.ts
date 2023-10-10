import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { GssInputFieldComponent } from '../../../shared-component-gss/gss-input-field/gss-input-field.component';

export const LIST_DEDUCTIVES_COLUMNS = {
  description: {
    title: 'Descripción Deductiva',
    type: 'string',
    sort: false,
  },
  observation: {
    title: 'Observaciones',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: GssInputFieldComponent,
    onComponentInitFunction(instance: any) {},
    sort: false,
  },
  selected: {
    title: 'Selección',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {},
    sort: false,
  },
};
