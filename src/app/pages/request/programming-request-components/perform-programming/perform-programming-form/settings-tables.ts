import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ESTATE_COLUMNS_VIEW } from '../../acept-programming/columns/estate-columns';
import { USER_COLUMNS_SHOW } from '../../acept-programming/columns/users-columns';

export const SettingUserTable = {
  actions: {
    columnTitle: 'Acciones',
    position: 'right',
    delete: true,
  },
  columns: USER_COLUMNS_SHOW,
};

export const settingTransGoods = {
  actions: {
    delete: false,
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
  columns: ESTATE_COLUMNS_VIEW,
};

export const settingGuard = {
  actions: {
    edit: true,
    delete: false,
    columnTitle: 'Acciones',
    position: 'right',
  },
  edit: {
    editButtonContent: '<i class="fa fa-eye"></i>',
  },
  columns: ESTATE_COLUMNS_VIEW,
};

export const settingWarehouse = {
  actions: {
    edit: true,
    delete: false,
    columnTitle: 'Acciones',
    position: 'right',
  },
  edit: {
    editButtonContent: '<i class="fa fa-eye"></i>',
  },
  columns: ESTATE_COLUMNS_VIEW,
};
