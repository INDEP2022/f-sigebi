import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const CONSIGMENTS_GOODS_COLUMNS = {
  goodNumber: {
    title: 'No. Bien',
    sort: false,
    valuePrepareFunction: (good: any) => good?.id ?? '',
  },
  description: {
    title: 'Descripción',
    sort: false,
    valuePrepareFunction: (empty: any, row: any) =>
      row.goodNumber?.description ?? '',
  },
  estatus: {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction: (empty: any, row: any) =>
      row.goodNumber?.status ?? '',
  },
  label_good: {
    title: 'Destino',
    sort: false,
    valuePrepareFunction: (value: any, row: any) =>
      GOOD_LABELS[row?.goodNumber?.labelNumber] ?? 'INDEFINIDO',
  },
  transferNumber: {
    title: 'Mandato',
    sort: false,
    valuePrepareFunction: (transfer: any) => transfer?.nameTransferent,
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
