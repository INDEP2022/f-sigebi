/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ExpenseLotService } from './expense-lot.service';

describe('Service: ExpenseLot', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseLotService],
    });
  });

  it('should ...', inject([ExpenseLotService], (service: ExpenseLotService) => {
    expect(service).toBeTruthy();
  }));
});
