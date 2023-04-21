export const BOOK_EMAIL_COLUMNS = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  bookName: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  bookEmail: {
    title: 'Correo Electrónico',
    type: 'number',
    sort: false,
  },
  to: {
    title: 'Para',
    type: 'html',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return row.bookType == 'P'
        ? '<div class="text-center text-success"><i class="fas fa-check"></i></div>'
        : '';
    },
  },
  cc: {
    title: 'CC',
    type: 'html',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return row.bookType == 'C'
        ? '<div class="text-center text-success"><i class="fas fa-check"></i></div>'
        : '';
    },
  },
  bookStatus: {
    title: 'Estatus',
    type: 'text',
    sort: false,
    valuePrepareFunction: (_cell: any, row: any) => {
      return row.bookStatus == '1' ? 'SI' : '';
    },
  },
};
