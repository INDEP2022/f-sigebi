//Components

export const COLUMNS = {
  periodEndDate: {
    title: 'Fecha fin',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
  },
  notificationDate: {
    title: 'Fecha notificación',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
  },
  duct: {
    title: 'Conducto',
    sort: false,
  },
  notifiedTo: {
    title: 'Notificado',
    sort: false,
  },
  notifiedPlace: {
    title: 'Lugar',
    sort: false,
  },
  editPublicationDate: {
    title: 'Fecha publicación',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
  },
  newspaperPublication: {
    title: 'Periodico publicación',
    sort: false,
  },
  observation: {
    title: 'Observacion',
    sort: false,
  },
  statusNotified: {
    title: 'Status',
    sort: false,
  },
};
