/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { AccountingService } from './accounting.service';

describe('Service: Accounting', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountingService],
    });
  });

  it('should ...', inject([AccountingService], (service: AccountingService) => {
    expect(service).toBeTruthy();
  }));
});
