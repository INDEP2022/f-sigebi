import { InputCellComponent } from 'src/app/@standalone/smart-table/input-cell/input-cell.component';

export const REGULAR_GOODS_COLUMN = {
  goodNot: {
    title: 'No. Bien',
    sort: false,
  },
  amount: {
    title: 'Cantidad',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  price: {
    title: 'Importe',
    sort: false,
  },
  vat: {
    title: 'Iva',
    sort: false,
  },
  total: {
    title: 'Total',
    sort: false,
  },
  brand: {
    title: 'Marca',
    sort: false,
  },
  subBrand: {
    title: 'Sub Marca',
    sort: false,
  },
  model: {
    title: 'Modelo',
    sort: false,
  },
  series: {
    title: 'Serie',
    sort: false,
  },
  downloadcvman: {
    title: 'Mandato',
    sort: false,
  },
  modmandato: {
    title: 'Matrícula',
    sort: false,
    type: 'custom',
    renderComponent: InputCellComponent,
    onComponentInitFunction: (instance: any) => {
      instance.inputChange.subscribe({
        next: (resp: any) => {
          resp.row.modmandato = resp.value;
        },
      });
    },
  },
  desc_unidad_det: {
    title: 'Unidad',
    sort: false,
  },
  desc_producto_det: {
    title: 'Prod./Serv.',
    sort: false,
  },
};
