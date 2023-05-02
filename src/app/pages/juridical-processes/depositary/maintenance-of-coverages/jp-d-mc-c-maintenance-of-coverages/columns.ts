//Components

import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  numberGood: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  unit: {
    title: 'Unidad',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
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
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
};
