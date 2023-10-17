import { BtnRequestComponent } from '../../../../shared-request/expedients-tabs/sub-tabs/btn-request/btn-request.component';

export const SERVICE_ORDERS_COLUMNS = {
  orderServiceId: {
    title: 'No. Ordern Servicio',
    type: 'text',
    sort: false,
  },
  orderServiceFolio: {
    title: 'Folio orden de servicio',
    type: 'text',
    sort: false,
  },
  orderServiceType: {
    title: 'Tipo orden de servicio',
    type: 'text',
    sort: false,
  },
  requestId: {
    title: 'No. Solicitud',
    type: 'text',
    sort: false,
  },
  contractNumber: {
    title: 'No. Contrato',
    type: 'text',
    sort: false,
  },
  costService: {
    title: 'Costo Servicio',
    type: 'text',
    sort: false,
  },
  button: {
    title: '',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: BtnRequestComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
};
