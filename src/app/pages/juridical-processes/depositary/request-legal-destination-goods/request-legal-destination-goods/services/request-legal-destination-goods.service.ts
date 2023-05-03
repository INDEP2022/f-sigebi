import { Injectable } from '@angular/core';
import { GoodService } from 'src/app/core/services/ms-good/good.service';

@Injectable({
  providedIn: 'root',
})
export class RequestLegalDestinationGoodsService {
  constructor(private msGoodService: GoodService) {}

  getGoodDataByFilter(body: string) {
    return this.msGoodService.getAllFilter(body);
  }
}
