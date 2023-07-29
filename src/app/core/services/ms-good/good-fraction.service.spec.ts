/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { GoodFractionService } from './good-fraction.service';

describe('Service: GoodFraction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodFractionService],
    });
  });

  it('should ...', inject(
    [GoodFractionService],
    (service: GoodFractionService) => {
      expect(service).toBeTruthy();
    }
  ));
});
