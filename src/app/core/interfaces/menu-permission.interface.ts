export interface Permissions {
  id: number;
  menuId: number;
  groupId: number;
  read: number;
  write: number;
  add: number;
  delete: number;
  rename: number;
  import: number;
  export: number;
  sign: number;
  archive: number;
  workflow: number;
  download: number;
  print: number;
}

export interface Submenu {
  id: number;
  applicationId: number;
  name: string;
  parentid: number;
  icon?: any;
  menuType: number;
  description: string;
  screen: string;
  position: number;
  deleted: number;
  creation: Date;
  lastmodified: Date;
  permissions: Permissions;
  submenus: Submenu[];
}

export interface MenuPermission {
  id: number;
  applicationId: number;
  name: string;
  parentid: number;
  icon?: any;
  menuType: number;
  description: string;
  screen: string;
  position: number;
  deleted: number;
  creation: Date;
  lastmodified: Date;
  permissions: Permissions;
  submenus: Submenu[];
}
