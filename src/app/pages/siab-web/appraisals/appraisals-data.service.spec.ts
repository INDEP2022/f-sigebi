/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { AppraisalsDataService } from './appraisals-data.service';

describe('Service: AppraisalsData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppraisalsDataService],
    });
  });

  it('should ...', inject(
    [AppraisalsDataService],
    (service: AppraisalsDataService) => {
      expect(service).toBeTruthy();
    }
  ));
});
