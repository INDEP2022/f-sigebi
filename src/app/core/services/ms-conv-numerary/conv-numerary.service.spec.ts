/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ConvNumeraryService } from './conv-numerary.service';

describe('Service: ConvNumerary', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConvNumeraryService],
    });
  });

  it('should ...', inject(
    [ConvNumeraryService],
    (service: ConvNumeraryService) => {
      expect(service).toBeTruthy();
    }
  ));
});
