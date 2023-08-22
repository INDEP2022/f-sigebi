import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any[] = [];
export const REQUESTS_COLUMNS_MODAL = {
  id_solnum: {
    title: 'No. Solicitud',
    type: 'string',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  no_delegacion: {
    title: 'Delegación',
    type: 'string',
    sort: false,
  },
  usuario: {
    title: 'Usuario que Solicita',
    type: 'string',
    sort: false,
  },
  fec_solnum: {
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
  check: {
    title: '',
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
         
          goodCheck = goodCheck.filter(
            valor => valor.id_solnum != data.row.id_solnum
          );
        }
      });
    },
    sort: false,
  },
};

export function clearGoodCheck() {
  goodCheck = [];
}
