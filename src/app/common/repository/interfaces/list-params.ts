export class ListParams {
  text?: string = '';
  [others: string]: string | number;
  page?: number = 1;
  inicio?: number = 1;
  limit?: number = 10;
  pageSize?: number = 10;
  take?: number = 10;
}
