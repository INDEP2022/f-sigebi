export class DefaultSelect<T = any> {
  [x: string]: any;
  constructor(
    public data: any[] = [],
    public count: number = 0,
    public reset: boolean = false
  ) {}
}
