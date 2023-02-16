import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ESTATE_COLUMNS } from '../../acept-programming/columns/estate-columns';
import { USER_COLUMNS } from '../../acept-programming/columns/users-columns';

export const SettingUserTable = {
  actions: {
    columnTitle: 'Acciones',
    position: 'right',
    delete: true,
  },
  columns: USER_COLUMNS,
};

export const settingTransGoods = {
  actions: {
    delete: true,
    edit: true,
    columnTitle: 'Acciones',
    position: 'right',
  },
  edit: {
    editButtonContent: '<i class="fa fa-eye"></i>',
  },
  delete: {
    ...TABLE_SETTINGS.delete,
    confirmDelete: true,
  },
  columns: ESTATE_COLUMNS,
};

export const settingGuard = {
  actions: {
    edit: true,
    delete: true,
    columnTitle: 'Acciones',
    position: 'right',
  },
  edit: {
    editButtonContent: '<i class="fa fa-eye"></i>',
  },
  columns: ESTATE_COLUMNS,
};

export const settingWarehouse = {
  actions: {
    edit: true,
    delete: true,
    columnTitle: 'Acciones',
    position: 'right',
  },
  edit: {
    editButtonContent: '<i class="fa fa-eye"></i>',
  },
  columns: ESTATE_COLUMNS,
};
