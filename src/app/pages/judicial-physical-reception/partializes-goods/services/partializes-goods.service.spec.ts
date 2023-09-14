/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { PartializesGoodsService } from './partializes-goods.service';

describe('Service: PartializesGoods', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PartializesGoodsService],
    });
  });

  it('should ...', inject(
    [PartializesGoodsService],
    (service: PartializesGoodsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
