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
