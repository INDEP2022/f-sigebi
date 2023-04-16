export interface IMenuItem {
  id?: number;
  label?: string;
  icon?: string;
  link?: string;
  subItems?: IMenuItem[];
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
  isLayout?: boolean;
}

export interface ITreeItem {
  id?: number;
  label?: string;
  description?: string;
  parentId?: number;
  subItems: ITreeItem[];
  [others: string]: any;
}

/*export interface ISubItems {
  id?: number;
  label?: string;
  icon?: string;
  link?: string;
  subItems?: IMenuItem[];
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
  isLayout?: boolean;
}*/
