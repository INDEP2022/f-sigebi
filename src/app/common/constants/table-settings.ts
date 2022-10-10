export const TABLE_SETTINGS = {
  actions: {
    columnTitle: 'Acciones',
    position: 'right',
    add: true,
    edit: true,
    delete: false,
  },
  pager: {
    display: false,
  },
  hideSubHeader: true,
  mode: 'external',
  edit: {
    editButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
  },
  delete: {
    deleteButtonContent: '<i class="fa fa-trash text-danger mx-2"></i>',
    confirmDelete: true,
  },
  columns: {},
  noDataMessage: 'No se encontrarón registros',
};
