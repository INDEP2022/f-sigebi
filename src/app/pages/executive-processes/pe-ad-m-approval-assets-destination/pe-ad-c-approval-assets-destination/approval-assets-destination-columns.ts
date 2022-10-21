import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const ASSETS_DESTINATION_COLUMNS = {
  noBien: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  ubiExact: {
    title: 'Ubicación Exacta',
    type: 'string',
    sort: false,
  },
  direction: {
    title: 'Dirección',
    type: 'string',
    sort: false,
  },
  passed: {
    title: 'Aprobado',
    type: 'custom',
    renderComponent: CheckboxElementComponent,
    onComponentInitFunction(instance: any) {
      instance.toggle.subscribe((data: any) => {
        data.row.to = data.toggle;
      });
    },
    sort: false,
  },
  noOficio: {
    title: 'No. de Autorización',
    type: 'string',
    sort: false,
  },
  fecha: {
    title: 'Fecha',
    type: 'string',
    sort: false,
  },
};
