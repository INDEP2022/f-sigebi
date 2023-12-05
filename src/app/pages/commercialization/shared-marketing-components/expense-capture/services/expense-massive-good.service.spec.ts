/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ExpenseMassiveGoodService } from './expense-massive-good.service';

describe('Service: ExpenseMassiveGood', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseMassiveGoodService],
    });
  });

  it('should ...', inject(
    [ExpenseMassiveGoodService],
    (service: ExpenseMassiveGoodService) => {
      expect(service).toBeTruthy();
    }
  ));
});
