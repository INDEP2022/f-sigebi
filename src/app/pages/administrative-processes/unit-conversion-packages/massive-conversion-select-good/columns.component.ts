import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any[] = [];
export const V_GOOD_COLUMNS = {
  turnSelect: {
    title: 'Selección',
    sort: false,
    showAlways: true,
    filter: false,
    editable: false,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
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
  },
  goodNumber: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false
  },
  amount: {
    title: 'Cantidad',
    type: 'string',
    sort: false
  },
  unitExtent: {
    title: 'Unidad Medida',
    type: 'string',
    sort: false
  },
  numberProceedings: {
    title: 'Expediente',
    type: 'number',
    sort: false
  }

};

export function clearGoodCheck() {
  goodCheck = [];
}