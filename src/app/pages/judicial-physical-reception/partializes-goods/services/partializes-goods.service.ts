import { Injectable } from '@angular/core';
import { IPartializedGoods } from 'src/app/core/models/ms-partialize-goods/partialize-good.model';

@Injectable({
  providedIn: 'root',
})
export class PartializesGoodsService {
  data: IPartializedGoods[] = [];
  loading = false;
  constructor() {}
}
