export class ListParams {
  inicio: number = 1;
  text: string = '';
  pageSize?: number = 10;
  [others: string]: string | number;
  page?: number = 1;
  take?: number = 10;
  'filter.level'?: any = 0;
}
