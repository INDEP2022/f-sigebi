export const DOCUMENTS_DICTUM_X_STATE = {
  officialNumber: { sort: false, title: 'No. Dictaminación' },
  typeDictum: { sort: false, title: 'Tipo Dictaminación' },
  expedientNumber: {
    title: 'No. Expediente',
    sort: false,
    // valuePrepareFunction: (data: any) => {
    //   return data ? data.id : '';
    // },
  },
  stateNumber: {
    sort: false,
    title: 'No. Bien',
    // valuePrepareFunction: (data: any) => {
    //   return data ? data.id : '';
    // },
  },
  key: {
    sort: false,
    title: 'Clave Documento',
    valuePrepareFunction: (data: any) => {
      return data ? data.key : '';
    },
  },
  dateReceipt: {
    sort: false,
    title: 'Fecha Recibido',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
  },
  userReceipt: { sort: false, title: 'Usuario Recibido' },
  insertionDate: {
    sort: false,
    title: 'Fecha Inserción',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
  },
  userInsertion: { sort: false, title: 'Usuario Inserto' },
  notificationDate: {
    sort: false,
    title: 'Fecha Notificación',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
  },
  secureKey: { sort: false, title: 'Aseg. Dev. Clave' },
};
