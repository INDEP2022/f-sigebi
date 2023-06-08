/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { GoodsCharacteristicsService } from './goods-characteristics.service';

describe('Service: GoodsCharacteristics', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodsCharacteristicsService],
    });
  });

  it('should ...', inject(
    [GoodsCharacteristicsService],
    (service: GoodsCharacteristicsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
