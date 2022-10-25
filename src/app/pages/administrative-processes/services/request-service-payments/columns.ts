//Components
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  isPayment: {
    title: 'Pagado',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction: (instance: any) => {},
    sort: false,
  },
  request: {
    title: 'Solicitud',
    sort: false,
  },
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  service: {
    title: 'Servicio',
    sort: false,
  },

  requestDate: {
    title: 'Fecha de Solicitud',
    sort: false,
  },
  paymentDate: {
    title: 'Fecha de Pago',
    sort: false,
  },
  amount: {
    title: 'Importe',
    sort: false,
  },
};
