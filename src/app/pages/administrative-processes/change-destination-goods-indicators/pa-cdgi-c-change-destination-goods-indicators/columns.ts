//Components
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  descriptionGood: {
    title: 'Descripcion',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  indDestin: {
    title: 'Ind. Destino',
    sort: false,
  },
  valid: {
    title: 'Válido',
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
