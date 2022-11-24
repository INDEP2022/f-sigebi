import { BtnRequestComponent } from '../../../../shared-request/expedients-tabs/sub-tabs/btn-request/btn-request.component';

export const SERVICE_ORDERS_COLUMNS = {
  noServiceOrder: {
    title: 'No. Ordern Servicio',
    type: 'text',
    sort: false,
  },
  folioServiceOrder: {
    title: 'Folio orden de servicio',
    type: 'text',
    sort: false,
  },
  typeServiceOrder: {
    title: 'Folio orden de servicio',
    type: 'text',
    sort: false,
  },
  noRequest: {
    title: 'No. Solicitud',
    type: 'text',
    sort: false,
  },
  noContract: {
    title: 'No. Contrato',
    type: 'text',
    sort: false,
  },
  serviceCost: {
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
