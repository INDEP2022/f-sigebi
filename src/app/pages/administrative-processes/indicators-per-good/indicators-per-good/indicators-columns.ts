import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const INDICATORS_GOOD_COLUMNS1 = {
  description: {
    title: 'Descripción',
    type: 'text',
    sort: false,
  },
  value: {
    title: 'Valor',
    type: 'number',
    sort: false,
  },
};

export const INDICATORS_COLUMNS2 = {
  idGoodNumber: {
    title: 'Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'text',
    sort: false,
  },
  value: {
    title: '',
    sort: true,
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
  },
};
