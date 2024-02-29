import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

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
    width: '50%',
  },
  name: {
    title: 'Nombre del Destinatario',
    type: 'string',
    sort: false,
    width: '50%',
  },
};

export const ELECTRONIC_SIGNATURE_TYPE_COLUMNS = {
  denomination: {
    title: 'Denominación',
    type: 'string',
    sort: false,
    width: '50%',
  },
  orderId: {
    title: 'Orden de Presentación',
    type: 'number',
    sort: false,
    width: '50%',
  },
};

export const ELECTRONIC_SIGNATURE_EVENT_COLUMNS = {
  referenceId: {
    title: 'Evento',
    type: 'number',
    sort: false,
    width: '10%',
  },
  documentsXMLId: {
    title: 'No. Reporte',
    type: 'number',
    sort: false,
    width: '10%',
  },
  origin: {
    title: 'Id Origen',
    type: 'number',
    sort: false,
    width: '10%',
  },
  documentId: {
    title: 'Id Documento',
    type: 'number',
    sort: false,
    width: '15%',
  },
  qualification: {
    title: 'Título',
    type: 'string',
    sort: false,
    width: '20%',
  },
  creationDate: {
    title: 'Fecha de Creación',
    width: '15%',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    filterFunction(): boolean {
      return true;
    },
  },
  description: {
    title: 'Estatus Reporte',
    type: 'string',
    sort: false,
    filter: false,
    width: '20%',
  },
  // description: {
  //   title: 'Descripción',
  //   type: 'string',
  //   sort: false,
  //   filter: false,
  //   width: "15%"
  // },
};

export const ELECTRONIC_SIGNATURE_SIGNATURE_COLUMNS = {
  no_consec: {
    title: 'No',
    type: 'number',
    sort: false,
    filter: true,
  },
  id_docums_xml: {
    title: 'No Reporte',
    type: 'number',
    sort: false,
    filter: true,
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
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
    filterFunction(): boolean {
      return true;
    },
  },
};
