export const DOCUMENTS_DICTUM_X_STATE = {
  officialNumber: { title: 'No. Dictaminación' },
  typeDictum: { title: 'Tipo Dictaminación' },
  expedientNumber: {
    title: 'No. Expediente',
    valuePrepareFunction: (data: any) => {
      return data ? data.id : '';
    },
  },
  stateNumber: {
    title: 'No. Bien',
    valuePrepareFunction: (data: any) => {
      return data ? data.id : '';
    },
  },
  key: {
    title: 'Clave Documento',
    valuePrepareFunction: (data: any) => {
      return data ? data.key : '';
    },
  },
  dateReceipt: { title: 'Fecha Recibido' },
  userReceipt: { title: 'Usuario Recibido' },
  insertionDate: { title: 'Fecha Inserción' },
  userInsertion: { title: 'Usuario Inserto' },
  notificationDate: { title: 'Fecha Notificación' },
  secureKey: { title: 'Aseg. Dev. Clave' },
};
