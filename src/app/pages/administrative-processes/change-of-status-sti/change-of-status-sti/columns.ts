//Components
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export let goodCheck: any[] = [];
export const COLUMNS = {
  id: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripcion del Bien',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  check: {
    title: '',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
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
