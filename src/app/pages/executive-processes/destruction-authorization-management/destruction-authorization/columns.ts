import { format } from 'date-fns';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const PROCEEDINGS_COLUMNS = {
  id: {
    title: 'No.',
    sort: false,
  },
  keysProceedings: {
    title: 'Cve. Acta',
    sort: false,
  },
  elaborationDate: {
    title: 'Fecha elaboración',
    sort: false,
    valuePrepareFunction: (value: string) => {
      console.log(value);
      const date = value ? new Date(value) : null;
      return date ? format(date, 'yyyy-MM-dd') : null;
    },
  },
  /*datePhysicalReception: {
    title: 'Fecha recepción',
    sort: false,
  },*/
  captureDate: {
    title: 'Fecha captura',
    valuePrepareFunction: (value: string) => {
      console.log(value);
      const date = value ? new Date(value) : null;
      return date ? format(date, 'yyyy-MM-dd') : null;
    },
    sort: false,
  },
  statusProceedings: {
    title: 'Estado',
    sort: false,
  },
};

export const DETAIL_PROCEEDINGS_DELIVERY_RECEPTION = {
  numberGood: {
    title: 'No. Bien',
    sort: false,
  },
  good: {
    title: 'Descripción',
    sort: false,
    type: 'custom',
    valuePrepareFunction: (value: any) => {
      return value.description ?? '';
    },
    renderComponent: SeeMoreComponent,
  },
  amount: {
    title: 'Cantidad',
    sort: false,
  },
};

export const GOODS_COLUMNS = {
  id: {
    title: 'No. Bien',
    width: '25px',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'custom',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value ?? '';
    },
    renderComponent: SeeMoreComponent,
  },
  quantity: {
    title: 'Cantidad',
    type: 'string',
    sort: false,
  },
  requestFolio: {
    title: 'Of. Sol.',
    type: 'string',
    sort: false,
  },
};

export const DICTATION_COLUMNS = {
  clave_oficio_armada: {
    title: 'DICTAMINACIONES',
    sort: false,
  },
};

export const ACTA_RECEPTION_COLUMNS = {
  actaCve: {
    title: 'ACTAS DE RECEPCIÓN',
    sort: false,
  },
};
