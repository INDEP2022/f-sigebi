/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ExpenseNumeraryService } from './expense-numerary.service';

describe('Service: ExpenseNumerary', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseNumeraryService],
    });
  });

  it('should ...', inject(
    [ExpenseNumeraryService],
    (service: ExpenseNumeraryService) => {
      expect(service).toBeTruthy();
    }
  ));
});
