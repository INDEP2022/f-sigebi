import { DecimalPipe } from '@angular/common';
import { format } from 'date-fns';
import { SearchFilter } from 'src/app/common/repository/interfaces/list-params';
import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const APPRAISAL_DETAIL_COLUMNS = {
  idDetavaluo: {
    title: 'No.',
    sort: false,
  },
  noBien: {
    title: 'No. Bien',
    sort: false,
  },
  descripcion: {
    title: 'Descripción',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    operator: SearchFilter.ILIKE,
  },
  estatus: {
    title: 'Estatus',
    sort: false,
  },
  noClasifBien: {
    title: 'No. Clasif.',
    sort: false,
  },
  descSssubtipo: {
    title: 'Sub Sub Sub Tipo',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  descSsubtipo: {
    title: 'Sub Sub Tipo',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  descSubtipo: {
    title: 'Sub Tipo',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  descTipo: {
    title: 'Tipo',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  fechaAvaluo: {
    title: 'Fecha Avalúo',
    sort: false,
    valuePrepareFunction: (value: string) =>
      value ? format(new Date(value), 'dd/MM/yyyy') : '',
  },
  fechaVigAvaluo: {
    title: 'Fecha Vig.',
    sort: false,
    valuePrepareFunction: (value: string) =>
      value ? format(new Date(value), 'dd/MM/yyyy') : '',
  },
  nombreValuador: {
    title: 'Nombre Val.',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  refAvaluo: {
    title: 'Referencia',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  apto: {
    title: 'Apto',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  iva: {
    title: 'IVA',
    sort: false,
  },
  vri: {
    title: 'Valor de Ref. Inmediata',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
  vriIva: {
    title: 'Valor de Ref. Inmediata IVA',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
  vriIvaRedondeado: {
    title: 'VRI IVA Redondeado',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
  vc: {
    title: 'Valor Comercial',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
  vcIva: {
    title: 'Valor Comercial IVA',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
  dictamen: {
    title: 'Dictamen',
    sort: false,
    operator: SearchFilter.ILIKE,
  },
  fechaDictamen: {
    title: 'Fecha Dictamen',
    sort: false,
    valuePrepareFunction: (value: string) =>
      value ? format(new Date(value), 'dd/MM/yyyy') : '',
  },
  fechaVigDictamen: {
    title: 'Fecha Vig. Dictamen',
    sort: false,
    valuePrepareFunction: (value: string) =>
      value ? format(new Date(value), 'dd/MM/yyyy') : '',
  },
  descuentoVri: {
    title: 'VRI con Descuento',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
  descuentoIva: {
    title: 'VRI IVA con Descuento',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
};
