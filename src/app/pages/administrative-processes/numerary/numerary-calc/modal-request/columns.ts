import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export let goodCheck: any[] = [];
export const REQUESTS_COLUMNS_MODAL = {
  solnumid: {
    title: 'Número Solicitud',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  delegationnumber: {
    title: 'Delegación',
    type: 'string',
    sort: false,
  },
  user: {
    title: 'Usuario que solicita',
    type: 'string',
    sort: false,
  },
  solnumdate: {
    title: 'Fecha solicitud',
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
  /*   check: {
    title: 'Seleccionar',
    type: 'custom',
    filter: false,
    renderComponent: CheckboxElementComponent,
    valuePrepareFunction: (isSelected: any, row: any) => {
      return goodCheck.find((e: any) => e.row.id == row.id) ? true : false;
    },
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        if (data.toggle) {
          console.log(goodCheck);
          goodCheck.push(data.row);
        } else {
          goodCheck = goodCheck.filter(valor => valor.id != data.id);
        }
      });
    },
    sort: false,
  }, */
};

export function clearGoodCheck() {
  goodCheck = [];
}
