import { CheckboxElementSamplingComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element-sampling';

export const LIST_DEDUCTIVES_COLUMNS = {
  description: {
    title: 'Descripción Deductiva',
    type: 'string',
    sort: false,
  },

  observations: {
    title: 'Observaciones',
    type: 'string',
    sort: false,
  },

  /*observation: {
    title: 'Observaciones',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: GssInputFieldComponent,
    onComponentInitFunction(instance: any) {},
    sort: false,
  }, */

  selected: {
    title: 'Selección',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    disabled: true,
    renderComponent: CheckboxElementSamplingComponent,
    onComponentInitFunction(instance: any) {},
    sort: false,
  },
};
