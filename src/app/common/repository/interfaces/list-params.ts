export class ListParams {
  page: number = 1;
  text: string = '';
  limit?: number = 10;
  [others: string]: string | number;
}
