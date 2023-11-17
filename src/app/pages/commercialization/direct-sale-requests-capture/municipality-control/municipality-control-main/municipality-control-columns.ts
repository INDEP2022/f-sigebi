import * as moment from 'moment';

export const MUNICIPALITY_CONTROL_APPLICANT_COLUMNS = {
  soladjinstgobId: {
    title: 'Solicitud',
    type: 'number',
    sort: false,
  },
  typeentgobId: {
    title: 'Entidad',
    type: 'string',
    sort: false,
    valuePrepareFunction: (id: any) => {
      return id.typeentgobId;
    },
  },
  applicant: {
    title: 'Solicitante',
    type: 'string',
    sort: false,
  },
  position: {
    title: 'Puesto',
    type: 'string',
    sort: false,
  },
  municipality: {
    title: 'Municipio',
    type: 'string',
    sort: false,
  },
  state: {
    title: 'Estado',
    type: 'string',
    sort: false,
  },
  applicationDate: {
    title: 'Fecha Solicitud',
    type: 'string',
    sort: false,
  },
  amount: {
    title: 'Cant. Solic.',
    type: 'number',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  phone: {
    title: 'Teléfono',
    type: 'string',
    sort: false,
  },
  award: {
    title: 'Adjudicación',
    type: 'string',
    sort: false,
  },
  webmail: {
    title: 'Correo Web',
    type: 'string',
    sort: false,
  },
};

export const MUNICIPALITY_CONTROL_ASSIGNED_GOOD_COLUMNS = {
  estateNumber: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
    width: '15%',
  },
  worthappraisal: {
    title: 'Valor Avalúo',
    type: 'number',
    sort: false,
    width: '15%',
  },
  appraisalDate: {
    title: 'Fecha Avalúo',
    type: 'string',
    sort: false,
    width: '15%',
    valuePrepareFunction: (date: any) => {
      if (date == null) return null;
      const newDate = parseDateNoOffset(date);
      return moment(new Date(newDate)).format('DD/MM/YYYY');
    },
  },
  sessionNumber: {
    title: 'No. Sesión',
    type: 'number',
    sort: false,
    width: '15%',
  },
  ranksEstate: {
    title: 'Clasifica Bien',
    type: 'string',
    sort: false,
    width: '15%',
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    width: '15%',
  },
  delegation: {
    title: 'Delegación',
    type: 'string',
    sort: false,
    width: '10%',
  },
  location: {
    title: 'Ubicación',
    type: 'string',
    sort: false,
    width: '10%',
  },
  mandate: {
    title: 'Mandato',
    type: 'string',
    sort: false,
    width: '10%',
  },
  rankssiab: {
    title: 'Clasifica SIAB',
    type: 'string',
    sort: false,
    width: '10%',
  },
  comments: {
    title: 'Comentarios',
    type: 'string',
    sort: false,
    width: '10%',
  },
};

function parseDateNoOffset(date: string | Date): Date {
  const dateLocal = new Date(date);
  return new Date(
    dateLocal.valueOf() + dateLocal.getTimezoneOffset() * 60 * 1000
  );
}
