import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { InputFieldComponent } from '../../service-transportable-goods-form/input-field/input-field.component';

export const DEDUCTIVE_COLUMN = {
  description: {
    title: 'Descripción deductiva',
    type: 'string',
    sort: false,
  },
  observation: {
    title: 'Cantidad Bienes No Retirados',
    type: 'custom',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  selected: {
    title: 'Seleccion',
    type: 'custom',
    filter: false,
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
};
