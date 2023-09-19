/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { NumerarieService } from './numerarie.service';

describe('Service: Numerarie', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumerarieService],
    });
  });

  it('should ...', inject([NumerarieService], (service: NumerarieService) => {
    expect(service).toBeTruthy();
  }));
});
