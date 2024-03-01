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

  xfecha: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (date: string) => {
      let raw = date;
      if (date) {
        let formatted = raw.split(' ')[0]; // Para obtener solo la fecha sin la hora
        let parts = formatted.split('-');
        formatted = `${parts[2]}/${parts[1]}/${parts[0]}`; // Cambiar el formato a dd/MM/yyyy
        return formatted;
      }
      return '';
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
export const DOC_SCHEDULE_TAB_COLUMNS = {
  //Documentos Solicitud arreglar paginado
  dDocName: {
    title: 'No. Documento',
    type: 'string',
    sort: false,
  },
  xnoProgramacion: {
    title: 'No. Programación',
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

  xfecha: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (date: string) => {
      let raw = date;
      if (date) {
        let formatted = raw.split(' ')[0]; // Para obtener solo la fecha sin la hora
        let parts = formatted.split('-');
        formatted = `${parts[2]}/${parts[1]}/${parts[0]}`; // Cambiar el formato a dd/MM/yyyy
        return formatted;
      }
      return '';
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

  xfecha: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (date: string) => {
      let raw = date;
      if (date) {
        let formatted = raw.split(' ')[0]; // Para obtener solo la fecha sin la hora
        let parts = formatted.split('-');
        formatted = `${parts[2]}/${parts[1]}/${parts[0]}`; // Cambiar el formato a dd/MM/yyyy
        return formatted;
      }
      return '';
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

  xfecha: {
    title: 'Fecha Creación',
    type: 'string',
    sort: false,
    valuePrepareFunction: (date: string) => {
      let raw = date;
      if (date) {
        let formatted = raw.split(' ')[0]; // Para obtener solo la fecha sin la hora
        let parts = formatted.split('-');
        formatted = `${parts[2]}/${parts[1]}/${parts[0]}`; // Cambiar el formato a dd/MM/yyyy
        return formatted;
      }
      return '';
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
};
