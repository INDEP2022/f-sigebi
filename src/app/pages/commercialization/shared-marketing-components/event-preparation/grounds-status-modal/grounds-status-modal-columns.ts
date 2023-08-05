import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any[] = [];
export const GROUNDSSTATUSMODAL_COLUMNS = {
  id: {
    title: 'id Mot',
    width: '2px',
    sort: false,
  },
  descriptionReason: {
    title: 'Motivos',
    width: '30px',
    sort: false,
  },
  check: {
    width: '5px',
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
          goodCheck.push(data);
        } else {
          goodCheck = goodCheck.filter(valor => valor.row.id != data.row.id);
        }
      });
    },
    sort: false,
  },
};
