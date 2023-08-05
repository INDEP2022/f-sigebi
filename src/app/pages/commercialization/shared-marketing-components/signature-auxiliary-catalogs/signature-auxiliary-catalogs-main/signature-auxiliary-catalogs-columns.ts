import { DatePipe } from '@angular/common';

export const ELECTRONIC_SIGNATURE_REPORT_COLUMNS = {
  screenKey: {
    title: 'Pantalla',
    type: 'string',
    sort: false,
  },
  signatoriesNumber: {
    title: 'Número de Firmantes',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Título del Reporte (XML)',
    type: 'string',
    sort: false,
  },
  reportKey: {
    title: 'Reporte Asociado (XML)',
    type: 'string',
    sort: false,
  },
};

export const ELECTRONIC_SIGNATURE_ADDRESSEE_COLUMNS = {
  email: {
    title: 'Dirección de Correo',
    type: 'string',
    sort: false,
  },
  name: {
    title: 'Nombre del Destinatario',
    type: 'string',
    sort: false,
  },
};

export const ELECTRONIC_SIGNATURE_TYPE_COLUMNS = {
  denomination: {
    title: 'Denominación',
    type: 'string',
    sort: false,
  },
  orderId: {
    title: 'Orden de Presentación',
    type: 'number',
    sort: false,
  },
};

export const ELECTRONIC_SIGNATURE_EVENT_COLUMNS = {
  referenceId: {
    title: 'Evento',
    type: 'number',
    sort: false,
  },
  documentsXMLId: {
    title: 'No. Reporte',
    type: 'number',
    sort: false,
  },
  origin: {
    title: 'Id Origen',
    type: 'number',
    sort: false,
  },
  documentId: {
    title: 'Id Documento',
    type: 'number',
    sort: false,
  },
  qualification: {
    title: 'Título',
    type: 'string',
    sort: false,
  },
  creationDate: {
    title: 'Fecha de Creación',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
    },
  },
  description: {
    title: 'Estatus Reporte',
    type: 'string',
    sort: false,
    filter: false,
  },
};

export const ELECTRONIC_SIGNATURE_SIGNATURE_COLUMNS = {
  no_consec: {
    title: 'No',
    type: 'number',
    sort: false,
    filter: false,
  },
  id_docums_xml: {
    title: 'No Reporte',
    type: 'number',
    sort: false,
    filter: false,
  },
  usuario: {
    title: 'Usuario',
    type: 'string',
    sort: false,
  },
  nombre: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  cargo: {
    title: 'Cargo',
    type: 'string',
    sort: false,
  },
  id_tipo_firmante: {
    title: 'Tipo',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Firmante',
    type: 'string',
    sort: false,
    filter: false,
  },
  fec_firma: {
    title: 'Fecha Firma',
    type: 'string',
    sort: false,
    filter: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return new DatePipe('en-US').transform(value, 'dd/MM/yyyy');
    },
  },
};
