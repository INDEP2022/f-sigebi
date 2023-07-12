import { DatePipe } from '@angular/common';

export const DOC_REQUEST_TAB_COLUMNS = {
  //Documentos Solicitud arreglar paginado
  dDocName: {
    title: 'No. Documento',
    type: 'string',
    sort: false,
  },
  xidSolicitud: {
    title: 'No. Solicitud',
    type: 'string',
    sort: false,
  },

  ddocTitle: {
    title: 'Título del Documento',
    type: 'string',
    sort: false,
  },

  xtipoDocumento: {
    title: 'Tipo de Documento',
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

  xtipoTransferencia: {
    title: 'Tipo de Transferencia',
    type: 'string',
    sort: false,
  },

  xcontribuyente: {
    title: 'Contribuyente',
    type: 'string',
    sort: false,
  },

  xremitente: {
    title: 'Remitente',
    type: 'string',
    sort: false,
  },

  xnoOficio: {
    title: 'No. Oficio',
    type: 'string',
    sort: false,
  },

  xcargoRemitente: {
    title: 'Cargo Remitente',
    type: 'string',
    sort: false,
  },

  xcomments: {
    title: 'Comentarios',
    type: 'string',
    sort: false,
  },

  xresponsable: {
    title: 'Responsable',
    type: 'string',
    sort: false,
  },

  /*delegationName: {
    title: 'Delegación Regional',
    type: 'string',
    sort: false,
  },

  stateName: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },

  transferentName: {
    title: 'Transferente',
    type: 'string',
    sort: false,
  }, */
};

export const DOC_GOODS_COLUMNS = {
  dDocName: {
    title: 'No. Documento',
    type: 'string',
    sort: false,
  },
  xidBien: {
    title: 'No. Bien',
    type: 'string',
    sort: false,
  },

  ddocTitle: {
    title: 'Título del Documento',
    type: 'string',
    sort: false,
  },

  xtipoDocumento: {
    title: 'Tipo de Documento',
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

  xtipoTransferencia: {
    title: 'Tipo de Transferencia',
    type: 'string',
    sort: false,
  },

  xcontribuyente: {
    title: 'Contribuyente',
    type: 'string',
    sort: false,
  },

  xremitente: {
    title: 'Remitente',
    type: 'string',
    sort: false,
  },

  xnoOficio: {
    title: 'No. Oficio',
    type: 'string',
    sort: false,
  },

  xcargoRemitente: {
    title: 'Cargo Remitente',
    type: 'string',
    sort: false,
  },

  xcomments: {
    title: 'Comentarios',
    type: 'string',
    sort: false,
  },

  xresponsable: {
    title: 'Responsable',
    type: 'string',
    sort: false,
  },

  xidSIAB: {
    title: 'No. SIAB',
    type: 'string',
    sort: false,
  },

  /*delegationName: {
    title: 'Delegación regional',
    type: 'string',
    sort: false,
  },

  stateName: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },

  transferentName: {
    title: 'Transferente',
    type: 'string',
    sort: false,
  }, */
};

export const DOC_EXPEDIENT_COLUMNS = {
  dDocName: {
    title: 'No. Documento',
    type: 'string',
    sort: false,
  },
  xidExpediente: {
    title: 'No. Expediente',
    type: 'string',
    sort: false,
  },

  ddocTitle: {
    title: 'Título del Documento',
    type: 'string',
    sort: false,
  },

  xtipoDocumento: {
    title: 'Tipo de Documento',
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

  xtipoTransferencia: {
    title: 'Tipo de Transferenciaa',
    type: 'string',
    sort: false,
  },

  xcontribuyente: {
    title: 'Contribuyente',
    type: 'string',
    sort: false,
  },

  xremitente: {
    title: 'Remitente',
    type: 'string',
    sort: false,
  },

  xnoOficio: {
    title: 'No. Oficio',
    type: 'string',
    sort: false,
  },

  xcargoRemitente: {
    title: 'Cargo Remitente',
    type: 'string',
    sort: false,
  },

  xcomments: {
    title: 'Comentarios',
    type: 'string',
    sort: false,
  },

  xresponsable: {
    title: 'Responsable',
    type: 'string',
    sort: false,
  },
};
