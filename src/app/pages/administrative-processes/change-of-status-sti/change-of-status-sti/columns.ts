//Components
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any[] = [];
export const COLUMNS = {
  id: {
    title: 'No. Bien',
    sort: false,
    width: '150px',
  },
  description: {
    title: 'Descripción del Bien',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
    filter: false,
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
          goodCheck.push(data);
        } else {
          goodCheck = goodCheck.filter(valor => valor.row.id != data.row.id);
        }
      });
    },
    sort: false,
  },
};

export function clearGoodCheck() {
  goodCheck = [];
}
