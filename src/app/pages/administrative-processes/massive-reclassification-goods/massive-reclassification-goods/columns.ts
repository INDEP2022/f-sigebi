//Components
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  reclassify: {
    title: 'Reclasificar',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  DescriptionClassification: {
    title: 'Descripcion de la clasificacion',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  descriptionGood: {
    title: 'Descripción del Bien',
    sort: false,
  },
};
