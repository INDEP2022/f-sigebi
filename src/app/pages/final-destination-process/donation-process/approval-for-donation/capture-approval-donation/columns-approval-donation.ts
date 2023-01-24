import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
export const COLUMNS_APPROVAL_DONATION = {
  ref: {
    title: 'Ref',
    type: 'number',
    sort: false,
  },
  goods: {
    title: 'Bien',
    type: 'number',
    sort: false,
  },
  goodsDescrip: {
    title: 'Descripción del Bien',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  unit: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  proceedings: {
    title: 'Expediente',
    type: 'number',
    sort: false,
  },
  targetTag: {
    title: 'Expediente',
    type: 'string',
    sort: false,
  },
  transfNumb: {
    title: 'No. Tranf.',
    type: 'string',
    sort: false,
  },
  desTransf: {
    title: 'Des. Tranf.',
    type: 'string',
    sort: false,
  },
  clasifNumb: {
    title: 'No. Clasif.',
    type: 'number',
    sort: false,
  },
  process: {
    title: 'Proceso',
    type: 'string',
    sort: false,
  },
  warehouseNumb: {
    title: 'No. Alma.',
    type: 'number',
    sort: false,
  },
  warehouse: {
    title: 'Almacén',
    type: 'string',
    sort: false,
  },
  warehouseLocat: {
    title: 'Ubica. Almacén ',
    type: 'string',
    sort: false,
  },
  coordAdmin: {
    title: 'Coord. Admin.',
    type: 'string',
    sort: false,
  },
  select: {
    title: 'Selec.',
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
