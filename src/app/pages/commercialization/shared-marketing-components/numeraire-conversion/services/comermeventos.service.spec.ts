/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ComermeventosService } from './comermeventos.service';

describe('Service: Comermeventos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComermeventosService],
    });
  });

  it('should ...', inject(
    [ComermeventosService],
    (service: ComermeventosService) => {
      expect(service).toBeTruthy();
    }
  ));
});
