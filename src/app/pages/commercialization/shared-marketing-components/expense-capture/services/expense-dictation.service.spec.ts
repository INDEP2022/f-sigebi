/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ExpenseDictationService } from './expense-dictation.service';

describe('Service: ExpenseDictation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseDictationService],
    });
  });

  it('should ...', inject(
    [ExpenseDictationService],
    (service: ExpenseDictationService) => {
      expect(service).toBeTruthy();
    }
  ));
});
