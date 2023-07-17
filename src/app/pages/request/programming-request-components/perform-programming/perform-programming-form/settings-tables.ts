import { TrackerValues } from 'src/app/pages/general-processes/goods-tracker/utils/constants/filter-match';
import {
  ESTATE_COLUMNS_1,
  ESTATE_COLUMNS_VIEW,
} from '../../acept-programming/columns/estate-columns';
import { USER_COLUMNS_SHOW } from '../../acept-programming/columns/users-columns';

export const SettingUserTable = {
  actions: {
    columnTitle: 'Acciones',
    position: 'right',
    delete: true,
  },
  columns: USER_COLUMNS_SHOW,
};

export const SettingUserTableClose = {
  actions: false,
  columns: USER_COLUMNS_SHOW,
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
  columns: ESTATE_COLUMNS_1,
};

export const settingTransGoodsClose = {
  actions: {
    delete: false,
    edit: true,
    columnTitle: 'Acciones',
    position: 'right',
  },
  edit: {
    editButtonContent: '<i class="fa fa-eye"></i>',
  },
  columns: ESTATE_COLUMNS_1,
};

export const settingGuard = {
  actions: {
    edit: true,
    delete: TrackerValues,
    columnTitle: 'Acciones',
    position: 'right',
  },
  edit: {
    editButtonContent: '<i class="fa fa-eye"></i>',
  },
  columns: ESTATE_COLUMNS_VIEW,
};

export const settingGuardClose = {
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
    delete: TrackerValues,
    columnTitle: 'Acciones',
    position: 'right',
  },
  edit: {
    editButtonContent: '<i class="fa fa-eye"></i>',
  },
  columns: ESTATE_COLUMNS_VIEW,
};

export const settingWarehouseClose = {
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
