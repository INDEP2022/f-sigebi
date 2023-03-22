import { LocalDataSource } from 'ng2-smart-table';
import { DataSource } from 'ng2-smart-table/lib/lib/data-source/data-source';
export interface ICreateConfirmEvent<T> {
  newData: T;
  source: DataSource;
  confirm: IConfirm<T>;
}

export interface IDeleteExternalEvent<T> {
  data: T;
  source: DataSource;
}

export interface IDeleteConfirmEvent<T> {
  data: T;
  source: DataSource;
  confirm: IConfirm<T>;
}

export interface IEditExternalEvent<T> {
  data: T;
  source: DataSource;
}

export interface IEditConfirmEvent<T> {
  data: T;
  newData: T;
  source: DataSource;
  confirm: IConfirm<T>;
}

export interface IConfirm<T> {
  resolve(newData?: T): void;
  reject(): void;
}

export interface IUserRowSelectEvent<T> {
  data: T;
  isSelected: boolean;
  selected: T[];
  source: LocalDataSource;
}
