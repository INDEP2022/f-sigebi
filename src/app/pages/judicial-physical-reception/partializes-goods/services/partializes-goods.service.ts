import { Injectable } from '@angular/core';
import { IPartializedGoodList } from 'src/app/core/models/ms-partialize-goods/partialize-good.model';

@Injectable({
  providedIn: 'root',
})
export class PartializesGoodsService {
  items: IPartializedGoodList[] = [];
  numberGoodQueryParams: string = '1697373';
  constructor() {}
}
