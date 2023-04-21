import { FulfillmentComponent } from '../../compliance-verification-components/verify-compliance-tab/fulfillment/fulfillment.component';

export const CLARIFICATION_COLUMNS = {
  rejectionDate: {
    title: 'Fecha de Aclaración',
    type: 'string',
    sort: false,
  },
  clarificationType: {
    title: 'Tipo Aclaración',
    type: 'string',
    sort: false,
  },
  clarificationName: {
    title: 'Aclaración',
    type: 'string',
    sort: false,
  },
  reason: {
    title: 'Motivo',
    type: 'string',
    class: 'custom-fulfill',
    filter: false,
    renderComponent: FulfillmentComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  answered: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },
  observation: {
    title: 'Observación',
    type: 'string',
    sort: false,
  },
};
