/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { NumeraryXGoodsService } from './numerary-x-goods.service';

describe('Service: NumeraryXGoods', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumeraryXGoodsService],
    });
  });

  it('should ...', inject(
    [NumeraryXGoodsService],
    (service: NumeraryXGoodsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
