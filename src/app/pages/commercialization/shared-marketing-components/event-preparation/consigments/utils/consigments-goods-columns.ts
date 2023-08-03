import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const CONSIGMENTS_GOODS_COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction: (empty: any, row: any) =>
      row.bienes?.description ?? '',
  },
  estatus: {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction: (empty: any, row: any) => row.bienes?.status ?? '',
  },
  label_good: {
    title: 'Destino',
    sort: false,
    valuePrepareFunction: (value: any, row: any) =>
      GOOD_LABELS[row?.bienes?.labelNumber] ?? 'INDEFINIDO',
  },
  transferente: {
    title: 'Mandato',
    sort: false,
    valuePrepareFunction: (transfer: any) => transfer?.key,
  },
  sold: {
    title: 'Vendido',
    sort: false,
  },
  observations: {
    title: 'Observaciones',
    sort: false,
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (obs: any) => obs ?? '',
  },
};

const GOOD_LABELS: { [key: string]: string } = {
  '1': 'VENTA',
  '2': 'DONACION',
  '3': 'ADMINISTRACION',
  '4': 'DESTRUCCION',
  '5': 'DEVOLUCION',
};
