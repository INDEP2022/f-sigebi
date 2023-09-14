/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ProgrammingGoodReceiptService } from './programming-good-receipt.service';

describe('Service: ProgrammingGoodReceipt', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgrammingGoodReceiptService],
    });
  });

  it('should ...', inject(
    [ProgrammingGoodReceiptService],
    (service: ProgrammingGoodReceiptService) => {
      expect(service).toBeTruthy();
    }
  ));
});
