//Components
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  DescriptionGood: {
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
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
};
