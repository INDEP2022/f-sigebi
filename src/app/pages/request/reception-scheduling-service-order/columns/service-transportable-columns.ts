import { EvaluationSelectFieldComponent } from '../../shared-request/service-transportable-goods-form/evaluation-select-field/evaluation-select-field.component';
import { InputFieldNumComponent } from '../../shared-request/service-transportable-goods-form/input-field-num/input-field-num.component';
import { InputFieldComponent } from '../../shared-request/service-transportable-goods-form/input-field/input-field.component';

export const SERVICE_TRANSPORTABLE_COLUMNS = {
  /*selected: {
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
  },*/
  //17.1.5 reporte de implementacion autorizada
  resultAssessment: {
    title: 'Resultado Evaluación',
    type: 'custom',
    renderComponent: EvaluationSelectFieldComponent,
    onComponentInitFunction(instance?: any) { },
    sort: false,
  },
  //17.1.5 reporte de implementacion autorizada
  amountNumbercomplies: {
    title: 'No. Recursos No Cumple',
    type: 'custom',
    renderComponent: InputFieldNumComponent,
    onComponentInitFunction(instance?: any) { },
    sort: false,
  },
  //17.1.5 reporte de implementacion autorizada
  porcbreaches: {
    title: 'Incumplimiento (%)',
    type: 'custom',
    renderComponent: InputFieldNumComponent,
    onComponentInitFunction(instance?: any) { },
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },

  andmidserv: {
    title: 'Únidad de Medida de Servico',
    type: 'string',
    sort: false,
  },

  classificationService: {
    title: 'Clasificación de Servicio',
    type: 'string',
    sort: false,
  },

  commentService: {
    title: 'Comentarios de Servico',
    type: 'custom',
    class: 'custom',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) { },
    sort: false,
  },

  durationTime: {
    title: 'Duración (Horas)',
    type: 'custom',
    class: 'custom',
    filter: false,
    sort: false,
    renderComponent: InputFieldNumComponent,
    onComponentInitFunction(instance?: any) { },
  },

  resourcesNumber: {
    title: 'No. Recursos',
    type: 'custom',
    class: 'custom',
    filter: false,
    sort: false,
    renderComponent: InputFieldNumComponent,
    onComponentInitFunction(instance?: any) { },
  },
  //17.1.4 reporte de implementacion enviada
  //17.1.5 reporte de implementacion autorizada
  resourcesReal: {
    title: 'Recurso Real',
    type: 'custom',
    class: 'custom',
    filter: false,
    sort: false,
    renderComponent: InputFieldNumComponent,
    onComponentInitFunction(instance?: any) { },
  },

  priceUnitary: {
    title: 'Precio Unitario',
    type: 'string',
    sort: false,
  },

  total: {
    title: 'Total',
    type: 'string',
    sort: false,
  },
  //17.1.4 reporte de implementacion enviada
  //17.1.5 reporte de implementacion autorizada
  descriptionDifference: {
    title: 'Descripción de Diferencia',
    type: 'custom',
    class: 'custom',
    filter: false,
    sort: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) { },
  },
};

export const SERVICE_TRANSPORTABLE_COLUMNS_READONLY_2 = {
  resultAssessment: {
    title: 'Resultado Evaluación',
    type: 'string',
    sort: false,
  },
  //17.1.5 reporte de implementacion autorizada
  amountNumbercomplies: {
    title: 'No. Recursos No Cumple',
    type: 'string',
    sort: false,
  },
  //17.1.5 reporte de implementacion autorizada
  porcbreaches: {
    title: 'Incumplimiento (%)',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },

  andmidserv: {
    title: 'Únidad de Medida de Servico',
    type: 'string',
    sort: false,
  },

  classificationService: {
    title: 'Clasificación de Servicio',
    type: 'string',
    sort: false,
  },

  commentService: {
    title: 'Comentarios de Servico',
    type: 'string',
    filter: false,
    sort: false,
  },

  durationTime: {
    title: 'Duración (Horas)',
    type: 'string',
    filter: false,
    sort: false,
  },

  resourcesNumber: {
    title: 'No. Recursos',
    type: 'string',
    filter: false,
    sort: false,
  },
  //17.1.4 reporte de implementacion enviada
  //17.1.5 reporte de implementacion autorizada
  resourcesReal: {
    title: 'Recurso Real',
    type: 'string',
    filter: false,
    sort: false,
  },

  priceUnitary: {
    title: 'Precio Unitario',
    type: 'string',
    sort: false,
  },

  total: {
    title: 'Total',
    type: 'string',
    sort: false,
  },
  //17.1.4 reporte de implementacion enviada
  //17.1.5 reporte de implementacion autorizada
  descriptionDifference: {
    title: 'Descripción de Diferencia',
    type: 'string',
    filter: false,
    sort: false,
  },
};

export const SERVICE_TRANSPORTABLE_COLUMNS_CAPTURE = {
  /*selected: {
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
  },*/
  /*
  //17.1.5 reporte de implementacion autorizada
  resultAssessment: {
    title: 'Resultado Evaluación',
    type: 'custom',
    renderComponent: EvaluationSelectFieldComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  //17.1.5 reporte de implementacion autorizada
  amountNumbercomplies: {
    title: 'No. Recursos No Cumple',
    type: 'custom',
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  //17.1.5 reporte de implementacion autorizada
  porcbreaches: {
    title: 'Incumplimiento (%)',
    type: 'custom',
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  }, */
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },

  andmidserv: {
    title: 'Únidad de Medida de Servico',
    type: 'string',
    sort: false,
  },

  classificationService: {
    title: 'Clasificación de servicio',
    type: 'string',
    sort: false,
  },

  commentService: {
    title: 'Comentarios de servicio',
    type: 'custom',
    class: 'custom',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) { },
    sort: false,
  },

  durationTime: {
    title: 'Duración (Horas)',
    type: 'custom',
    class: 'custom',
    filter: false,
    sort: false,
    renderComponent: InputFieldNumComponent,
    onComponentInitFunction(instance?: any) { },
  },

  resourcesNumber: {
    title: 'No. Recursos',
    type: 'custom',
    class: 'custom',
    filter: false,
    sort: false,
    renderComponent: InputFieldNumComponent,
    onComponentInitFunction(instance?: any) { },
  },
  //17.1.4 reporte de implementacion enviada
  //17.1.5 reporte de implementacion autorizada
  /*resourcesReal: {
    title: 'Recurso Real',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
  }, */

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
  //17.1.4 reporte de implementacion enviada
  //17.1.5 reporte de implementacion autorizada
  /*descriptionDifference: {
    title: 'Descripción de Diferencia',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) {},
  },*/
};

export const SERVICE_TRANSPORTABLE_COLUMNS_READONLY = {
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },

  andmidserv: {
    title: 'Únidad de Medida de Servico',
    type: 'string',
    sort: false,
  },

  classificationService: {
    title: 'Clasificación de servicio',
    type: 'string',
    sort: false,
  },

  commentService: {
    title: 'Comentarios de servicio',
    type: 'string',
    filter: false,
    sort: false,
  },

  durationTime: {
    title: 'Duración (Horas)',
    type: 'string',
    filter: false,
    sort: false,
  },

  resourcesNumber: {
    title: 'No. Recursos',
    type: 'string',
    filter: false,
    sort: false,
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
};

export const SERVICE_TRANSPORTABLE_COLUMNS_CAPTURE_APROVE = {
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },

  andmidserv: {
    title: 'Únidad de Medida de Servico',
    type: 'string',
    sort: false,
  },

  classificationService: {
    title: 'Clasificación de servicio',
    type: 'string',
    sort: false,
  },

  commentService: {
    title: 'Comentarios de servicio',
    type: 'string',
    filter: false,
    sort: false,
  },

  durationTime: {
    title: 'Duración (Horas)',
    type: 'string',
    filter: false,
    sort: false,
  },

  resourcesNumber: {
    title: 'No. Recursos',
    type: 'string',
    filter: false,
    sort: false,
  },

  resourcesReal: {
    title: 'Recurso Real',
    type: 'custom',
    class: 'custom',
    filter: false,
    renderComponent: InputFieldNumComponent,
    onComponentInitFunction(instance?: any) { },
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
    class: 'custom',
    filter: false,
    renderComponent: InputFieldComponent,
    onComponentInitFunction(instance?: any) { },
  },
};

export const SERVICE_TRANSPORTABLE_COLUMNS_CAPTURE_VALIDATE = {
  //17.1.5 reporte de implementacion autorizada
  resultAssessment: {
    title: 'Resultado Evaluación',
    type: 'custom',
    renderComponent: EvaluationSelectFieldComponent,
    onComponentInitFunction(instance?: any) { },
    sort: false,
  },
  //17.1.5 reporte de implementacion autorizada
  amountNumbercomplies: {
    title: 'No. Recursos No Cumple',
    type: 'custom',
    renderComponent: InputFieldNumComponent,
    onComponentInitFunction(instance?: any) { },
    sort: false,
  },
  //17.1.5 reporte de implementacion autorizada
  porcbreaches: {
    title: 'Incumplimiento (%)',
    type: 'custom',
    renderComponent: InputFieldNumComponent,
    onComponentInitFunction(instance?: any) { },
    sort: false,
  },

  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },

  andmidserv: {
    title: 'Únidad de Medida de Servico',
    type: 'string',
    sort: false,
  },

  classificationService: {
    title: 'Clasificación de servicio',
    type: 'string',
    sort: false,
  },

  commentService: {
    title: 'Comentarios de servicio',
    type: 'string',
    filter: false,
    sort: false,
  },

  durationTime: {
    title: 'Duración (Horas)',
    type: 'string',
    filter: false,
    sort: false,
  },

  resourcesNumber: {
    title: 'No. Recursos',
    type: 'string',
    filter: false,
    sort: false,
  },

  resourcesReal: {
    title: 'Recurso Real',
    type: 'string',
    filter: false,
    sort: false,
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
    type: 'string',
    filter: false,
    sort: false,
  },
};

export const SERVICE_TRANSPORTABLE_COLUMNS_CAPTURE_VALIDATE_READONLY = {
  resultAssessment: {
    title: 'Resultado Evaluación',
    type: 'string',
    sort: false,
  },
  amountNumbercomplies: {
    title: 'No. Recursos No Cumple',
    type: 'string',
    sort: false,
  },
  porcbreaches: {
    title: 'Incumplimiento (%)',
    type: 'string',
    sort: false,
  },

  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },

  andmidserv: {
    title: 'Únidad de Medida de Servico',
    type: 'string',
    sort: false,
  },

  classificationService: {
    title: 'Clasificación de servicio',
    type: 'string',
    sort: false,
  },

  commentService: {
    title: 'Comentarios de servicio',
    type: 'string',
    filter: false,
    sort: false,
  },

  durationTime: {
    title: 'Duración (Horas)',
    type: 'string',
    filter: false,
    sort: false,
  },

  resourcesNumber: {
    title: 'No. Recursos',
    type: 'string',
    filter: false,
    sort: false,
  },

  resourcesReal: {
    title: 'Recurso Real',
    type: 'string',
    filter: false,
    sort: false,
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
    type: 'string',
    filter: false,
    sort: false,
  },
};
