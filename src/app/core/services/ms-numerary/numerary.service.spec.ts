/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { NumeraryService } from './numerary.service';

describe('Service: Numerary', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumeraryService],
    });
  });

  it('should ...', inject([NumeraryService], (service: NumeraryService) => {
    expect(service).toBeTruthy();
  }));
});
