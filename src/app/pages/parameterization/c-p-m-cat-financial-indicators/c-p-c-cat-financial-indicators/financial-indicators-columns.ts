import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const FINANCIAL_INDICATORS_COLUMNS = {
  id: {
    title: 'No. Indicador',
    sort: false,
  },
  name: {
    title: 'Nombre',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  formuleCheck: {
    title: 'C/fórmula?',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  formule: {
    title: 'Formula',
    sort: false,
  },
};
