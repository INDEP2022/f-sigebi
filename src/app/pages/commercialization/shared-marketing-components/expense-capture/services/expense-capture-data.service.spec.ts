/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ExpenseCaptureDataService } from './expense-capture-data.service';

describe('Service: ExpenseCaptureData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseCaptureDataService],
    });
  });

  it('should ...', inject(
    [ExpenseCaptureDataService],
    (service: ExpenseCaptureDataService) => {
      expect(service).toBeTruthy();
    }
  ));
});
