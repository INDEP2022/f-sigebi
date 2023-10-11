import { DatePipe } from '@angular/common';

export const PHOTOGRAPHY_COLUMNS = {
  dDocName: {
    title: 'No. Fotografía',
    type: 'string',
    sort: false,
  },

  xidBien: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },

  /*xtipoDocumento: {
    title: 'Tipo de Documento',
    type: 'string',
    sort: false,
  }, */

  ddocTitle: {
    title: 'Título del Documento',
    type: 'string',
    sort: false,
  },
  dDocAuthor: {
    title: 'Autor',
    type: 'string',
    sort: false,
  },
  dInDate: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy');
      return formatted;
    },
  },

  xnoProgramacion: {
    title: 'No. Programación',
    type: 'number',
    sort: false,
  },

  xfolioProgramacion: {
    title: 'Folio de programación',
    type: 'string',
    sort: false,
  },

  /*noPhotography: {
    title: 'No. fotografía',
    type: 'number',
    sort: false,
  },

  managementNumber: {
    title: 'No. gestión',
    type: 'string',
    sort: false,
  },

  typeDocument: {
    title: 'Tipo de documento',
    type: 'string',
    sort: false,
  },

  titleDocument: {
    title: 'Título del documento',
    type: 'string',
    sort: false,
  },

  author: {
    title: 'Autor',
    type: 'string',
    sort: false,
  },

  createDate: {
    title: 'Fecha de creación',
    type: 'string',
    sort: false,
  },

  noProgrammation: {
    title: 'No. programación',
    type: 'number',
    sort: false,
  },

  programmingFolio: {
    title: 'Folio de programación',
    type: 'string',
    sort: false,
  }, */
};
