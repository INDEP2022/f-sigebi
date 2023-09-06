import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { InputFieldComponent } from '../../shared-request/service-transportable-goods-form/input-field/input-field.component';

export const SERVICE_TRANSPORTABLE_COLUMNS = {
  selected: {
    title: 'Selección',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
    hide: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },

  andmidserv: {
    title: 'Únidad de medida de servico',
    type: 'string',
    sort: false,
  },

  classificationService: {
    title: 'Clasificación de servicio',
    type: 'string',
    sort: false,
  },

  commentService: {
    title: 'Comentarios de servico',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },

  durationTime: {
    title: 'Duración (Horas)',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
  },

  resourcesNumber: {
    title: 'No. resources',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
  },

  resourcesReal: {
    title: 'Recurso Real',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
  },

  priceUnitary: {
    title: 'Precio unitario',
    type: 'string',
    sort: false,
  },

  total: {
    title: 'Total',
    type: 'string',
    sort: false,
  },

  descriptionDifference: {
    title: 'Descripción de Diferencia',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
  },
};
