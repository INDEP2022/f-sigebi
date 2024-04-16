import { format } from 'date-fns';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const SUB_DELEGATION_COLUMS = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  registerNumber: {
    title: 'No Registro',
    type: 'number',
    sort: false,
    // valuePrepareFunction: (value: any) => {
    //   return value != null ? value.id : '';
    // },
  },
  dailyConNumber: {
    title: 'Nro C. diario',
    type: 'number',
    sort: false,
  },
  dateDailyCon: {
    title: 'Fecha',
    sort: false,
    valuePrepareFunction: (value: string) =>
      value ? format(new Date(value), 'dd/MM/yyyy') : '',
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  phaseEdo: {
    title: 'Etapa EDO',
    type: 'number',
    sort: false,
  },
  // registerNumber: {
  //   title: 'Registro',
  //   type: 'number',
  //   sort: false,
  // },
};
