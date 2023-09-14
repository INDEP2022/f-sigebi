/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { IncosConvNumeraryService } from './incos-conv-numerary.service';

describe('Service: IncosConvNumerary', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IncosConvNumeraryService],
    });
  });

  it('should ...', inject(
    [IncosConvNumeraryService],
    (service: IncosConvNumeraryService) => {
      expect(service).toBeTruthy();
    }
  ));
});
