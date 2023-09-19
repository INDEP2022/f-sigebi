/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ComerieventosService } from './comerieventos.service';

describe('Service: Comerieventos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComerieventosService],
    });
  });

  it('should ...', inject(
    [ComerieventosService],
    (service: ComerieventosService) => {
      expect(service).toBeTruthy();
    }
  ));
});
