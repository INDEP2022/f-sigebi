import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';

export const COLUMNS = {
  goodNum: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  proceedings: {
    title: 'No. Expediente',
    type: 'number',
    sort: false,
  },
  unit: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },
  sssubType: {
    title: 'Sssubtipo',
    type: 'string',
    sort: false,
  },
  delAdmin: {
    title: 'Del. Admin',
    type: 'string',
    sort: false,
  },
  warehouse: {
    title: 'Almacén',
    type: 'string',
    sort: false,
  },
  select: {
    title: 'Sel.',
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
