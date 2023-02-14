//Components
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  id: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  labelNumber: {
    title: 'Ind. Destino',
    sort: false,
    type: 'html',
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
