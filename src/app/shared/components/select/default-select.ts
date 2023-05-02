export class DefaultSelect<T = any> {
  constructor(
    public data: any[] = [],
    public count: number = 0,
    public reset: boolean = false
  ) {}
}
