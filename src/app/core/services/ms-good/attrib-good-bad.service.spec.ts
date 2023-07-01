/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { AttribGoodBadService } from './attrib-good-bad.service';

describe('Service: AttribGoodBad', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttribGoodBadService],
    });
  });

  it('should ...', inject(
    [AttribGoodBadService],
    (service: AttribGoodBadService) => {
      expect(service).toBeTruthy();
    }
  ));
});
