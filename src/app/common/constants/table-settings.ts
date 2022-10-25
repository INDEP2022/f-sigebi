export const TABLE_SETTINGS = {
  add: {
    // addButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
    // createButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
    // cancelButtonContent: '<i class="fa fa-pencil-alt text-warning mx-2"></i>',
    confirmCreate: true,
  },
  selectMode: '',
  actions: {
    columnTitle: 'Acciones',
    position: 'right',
    add: true,
    edit: true,
    delete: false,
  },
  attr: {
    class: 'table-bordered',
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
  noDataMessage: 'No se encontraron registros',
  selectedRowIndex: -1,
};
