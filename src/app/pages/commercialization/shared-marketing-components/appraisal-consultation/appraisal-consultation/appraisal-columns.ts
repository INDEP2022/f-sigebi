import { DecimalPipe } from '@angular/common';
import { format } from 'date-fns';

export const APPRAISAL_COLUMNS = {
  // idEvent: {
  //   title: 'ID Evento',
  //
  //   sort: false,
  // },
  idAppraisal: {
    title: 'Id Avalúo',
    sort: false,
  },
  keyAppraisal: {
    title: 'Cve. Avalúo',
    sort: false,
  },
  keyOffice: {
    title: 'Cve. Oficio',
    sort: false,
  },
  userInsert: {
    title: 'Usuario Captura',
    sort: false,
  },
  insertDate: {
    title: 'Fecha captura',
    sort: false,
    valuePrepareFunction: (value: string) =>
      value ? format(new Date(value), 'dd/MM/yyyy') : '',
  },
  idDetAppraisal: {
    title: 'No.',
    sort: false,
  },
  noGood: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripción',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  noClasifGood: {
    title: 'No. Clasif.',
    sort: false,
  },
  descSssubType: {
    title: 'Descripción Sub Sub Sub Tipo',
    sort: false,
  },
  descSsubtype: {
    title: 'Descripción Sub Sub Tipo',
    sort: false,
  },
  descSubtype: {
    title: 'Descripción Sub Tipo',
    sort: false,
  },
  descType: {
    title: 'Descripción Tipo',
    sort: false,
  },
  apraisalDate: {
    title: 'Fecha de Avalúo',
    sort: false,
    valuePrepareFunction: (value: string) =>
      value ? format(new Date(value), 'dd/MM/yyyy') : '',
  },
  dateVigAppraisal: {
    title: 'Fecha Vigente de Avalúo',
    sort: false,
    valuePrepareFunction: (value: string) =>
      value ? format(new Date(value), 'dd/MM/yyyy') : '',
  },
  statusAppraisal: {
    title: 'Estado de Avalúo',
    sort: false,
  },
  daysLeft: {
    title: 'Días Restantes',
    sort: false,
  },
  nameAppraiser: {
    title: 'Nombre Valuador',
    sort: false,
  },
  typeReference: {
    title: 'Tipo Referencia',
    sort: false,
  },
  descApt: {
    title: 'Desc. Apto.',
    sort: false,
  },
  iva: {
    title: 'IVA',
    sort: false,
  },
  valorRefInmediate: {
    title: 'Valor Referencia Inmediata',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
  valor_ref_inmediata_iva: {
    title: 'Valor Referencia Inmediata IVA',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
  valor_ref_inmediata_redondeado: {
    title: 'Valor Referencia Inmediata Redondeado',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
  valueCommercial: {
    title: 'Valor Comercial',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
  valueCommercialIva: {
    title: 'Valor Comercial IVA',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
  opinion: {
    title: 'Dictamen',
    sort: false,
  },
  opinionDate: {
    title: 'Fecha Dictamen',
    sort: false,
    valuePrepareFunction: (value: string) =>
      value ? format(new Date(value), 'dd/MM/yyyy') : '',
  },
  vigOpenDate: {
    title: 'Fecha Vig. Dictamen',
    sort: false,
  },
  discountVri: {
    title: 'VRI con Descuento',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
  discountIva: {
    title: 'IVA VRI con Descuento',
    sort: false,
    valuePrepareFunction: (value: string) =>
      new DecimalPipe('en-US').transform(value),
  },
  //Faltan más columnas por agregar
};
