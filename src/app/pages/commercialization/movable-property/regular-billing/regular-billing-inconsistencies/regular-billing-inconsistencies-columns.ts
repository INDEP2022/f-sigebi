import { CustomFilterComponent } from 'src/app/@standalone/shared-forms/input-number/input-number';
import { NotFilterCustomFilterComponent } from 'src/app/@standalone/shared-forms/not-filter/not-filter';

export const REGULAR_BILLING_INCONSISTENCIES_COLUMNS = {
  batchPublic: {
    title: 'Lote',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  notGood: {
    title: 'No. Bien',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  descripcion: {
    title: 'Descripicón',
    sort: false,
    filter: {
      type: 'custom',
      component: NotFilterCustomFilterComponent,
    },
  },
  exhibit: {
    title: 'Anexo',
    sort: false,
  },
  descExhibit: {
    title: 'Descripción',
    sort: false,
    filter: {
      type: 'custom',
      component: NotFilterCustomFilterComponent,
    },
  },
  Type: {
    title: 'Tipo Siab',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  notSsubtype: {
    title: 'Sub Tipo Siab',
    sort: false,
    filter: {
      type: 'custom',
      component: CustomFilterComponent,
    },
  },
  desctipo: {
    title: 'Descripción',
    sort: false,
    filter: {
      type: 'custom',
      component: NotFilterCustomFilterComponent,
    },
  },
};
