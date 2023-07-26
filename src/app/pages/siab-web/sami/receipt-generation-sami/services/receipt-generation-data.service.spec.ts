/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ReceiptGenerationDataService } from './receipt-generation-data.service';

describe('Service: ReceiptGenerationData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReceiptGenerationDataService],
    });
  });

  it('should ...', inject(
    [ReceiptGenerationDataService],
    (service: ReceiptGenerationDataService) => {
      expect(service).toBeTruthy();
    }
  ));
});
