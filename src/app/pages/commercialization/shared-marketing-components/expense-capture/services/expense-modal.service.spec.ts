/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ExpenseModalService } from './expense-modal.service';

describe('Service: ExpenseModal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseModalService],
    });
  });

  it('should ...', inject(
    [ExpenseModalService],
    (service: ExpenseModalService) => {
      expect(service).toBeTruthy();
    }
  ));
});
