/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { KeyProceedingsService } from './key-proceedings.service';

describe('Service: KeyProceedings', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyProceedingsService],
    });
  });

  it('should ...', inject(
    [KeyProceedingsService],
    (service: KeyProceedingsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
