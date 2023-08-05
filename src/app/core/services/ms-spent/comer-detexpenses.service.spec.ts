/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ComerDetexpensesService } from './comer-detexpenses.service';

describe('Service: ComerDetexpenses', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComerDetexpensesService],
    });
  });

  it('should ...', inject(
    [ComerDetexpensesService],
    (service: ComerDetexpensesService) => {
      expect(service).toBeTruthy();
    }
  ));
});
