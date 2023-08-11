import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const CONSULT_SIRSAE_COLUMNS = {
  accountbank: {
    title: 'Cuenta Bancaria',
    type: 'string',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return row.accountbank?.name_bank;
    },
  },
  ifdsc: {
    title: 'Banco',
    type: 'string',
    sort: false,
  },
  reference: {
    title: 'Referencia',
    type: 'string',
    sort: false,
  },
  movDate: {
    title: 'Fecha Movimiento',
    type: 'number',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  importdep: {
    title: 'Importe Depósito',
    type: 'string',
    sort: false,
  },
  keycheck: {
    title: 'Cve. Cheque',
    type: 'number',
    sort: false,
  },
  statusMov: {
    title: 'Estatus Movimiento',
    type: 'number',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return row.statusMov?.id;
    },
  },
  statusMovDescription: {
    title: 'Descripción Movimiento',
    type: 'string',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      const status = row.statusMov?.id;
      if (status == 0) {
        return 'Pagado';
      }
      if (status == 1) {
        return 'Cheque salvo buen cobro';
      }
      if (status == 2) {
        return 'Cheque Devuelto';
      }

      return '';
    },
  },
};
