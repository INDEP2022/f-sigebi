/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ExpenseConceptsService } from './expense-concepts.service';

describe('Service: ExpenseConcepts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseConceptsService],
    });
  });

  it('should ...', inject(
    [ExpenseConceptsService],
    (service: ExpenseConceptsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
