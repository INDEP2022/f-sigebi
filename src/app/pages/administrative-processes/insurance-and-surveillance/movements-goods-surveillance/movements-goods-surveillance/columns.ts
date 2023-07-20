import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const MOVEMENTS_COLUMNS = {
  goodnumber: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción del Bien',
    type: 'string',
    sort: false,
  },
  contract_code: {
    title: 'Cve. Contrato',
    type: 'string',
    sort: false,
  },
  contract_start_date: {
    title: 'Fecha Ingreso',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  shifts_inforce: {
    title: 'Dir.',
    type: 'string',
    sort: false,
  },
  medical_turns: {
    title: '1/2 D.',
    type: 'string',
    sort: false,
  },
  industrial_turns: {
    title: 'Ind.',
    type: 'string',
    sort: false,
  },
  turns_can_number: {
    title: 'Can.',
    type: 'number',
    sort: false,
  },
  registration_supervisor: {
    title: 'Región',
    type: 'string',
    sort: false,
  },
};
