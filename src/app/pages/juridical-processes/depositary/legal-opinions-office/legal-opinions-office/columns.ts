//Components

import { SeeMoreComponent } from 'src/app/shared/components/see-more/see-more.component';

export const COLUMNS = {
  goodId: {
    title: 'No. Bien',
    sort: false,
  },
  description: {
    title: 'Descripcion',
    sort: false,
    type: 'custom',
    renderComponent: SeeMoreComponent,
    valuePrepareFunction: (value: string) => {
      if (value == 'null' || value == 'undefined') {
        return '';
      }

      return value ? value : '';
    },
  },
  menaje: {
    title: 'Menaje',
    sort: false,
  },
  amountDict: {
    title: 'Cant. Dict.',
    sort: false,
  },
  status: {
    title: 'Estatus',
    sort: false,
  },
  identifier: {
    title: 'Ident',
    sort: false,
  },
  extDomProcess: {
    title: 'Proceso',
    sort: false,
  },
};

export const officeTypeOption = [
  {
    option: 'ASEGURADOS ORDINARIOS',
    value: 'A-O',
  },
  {
    option: 'ASEGURADOS ORDINARIOS HMLLO',
    value: 'A-OH',
  },
  {
    option: 'ASEGURADOS TERCER TRANSITORIO',
    value: 'A-TT',
  },
  {
    option: 'COMERCIO EXTERIOR',
    value: 'C-E',
  },
  {
    option: 'DECOMISO',
    value: 'D',
  },
  {
    option: 'DEVOLUCIÓN ASEGURADOS',
    value: 'D-A',
  },
  {
    option: 'DEVOLUCIÓN NUMERARIO ASEGURADO',
    value: 'D-NA',
  },
  {
    option: 'NUMERARIO ASEGURADO',
    value: 'N-A',
  },
  {
    option: 'TESOFE',
    value: 'T',
  },
  {
    option: 'DECLARATORIA ABANDONO NUMERARIO',
    value: 'DAN',
  },
  {
    option: 'DECLARATORIA ABANDONO BIENES',
    value: 'DAB',
  },
  {
    option: 'EXTINCIÓN DE DOMINIO',
    value: 'E-D',
  },
];
export const RELATED_FOLIO_COLUMNS = {
  id: {
    title: 'Folio',
    sort: false,
  },
  sheets: {
    title: 'Documentos',
    sort: false,
  },
  descriptionDocument: {
    title: 'Descripción del Documento',
    sort: false,
  },
};

export const CCP_COLUMS_OFICIO = {
  personExtInt_: {
    title: 'Tipo Persona',
    type: 'string',
    sort: false,
    // valuePrepareFunction: (value: any) => {
    //   console.log(value);
    //   if (value !== null) {
    //     switch (value) {
    //       case 'I':
    //         value = `INTERNA`;
    //         return value;
    //       case 'E':
    //         value = `EXTERNA`;
    //         return value;
    //       default:
    //         value = '';
    //         return value;
    //     }
    //   }
    // },
  },
  userOrPerson: {
    title: 'Nombre de la Persona',
    type: 'string',
    sort: false,
  },
};
