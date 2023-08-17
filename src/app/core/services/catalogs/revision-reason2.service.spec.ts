/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { RevisionReason2Service } from './revision-reason2.service';

describe('Service: RevisionReason2', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevisionReason2Service],
    });
  });

  it('should ...', inject(
    [RevisionReason2Service],
    (service: RevisionReason2Service) => {
      expect(service).toBeTruthy();
    }
  ));
});
