/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ChecksDevolutionService } from './checks-devolution.service';

describe('Service: ChecksDevolution', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChecksDevolutionService],
    });
  });

  it('should ...', inject(
    [ChecksDevolutionService],
    (service: ChecksDevolutionService) => {
      expect(service).toBeTruthy();
    }
  ));
});
