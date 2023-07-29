/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { RequestsService } from './requests.service';

describe('Service: Requests', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestsService],
    });
  });

  it('should ...', inject([RequestsService], (service: RequestsService) => {
    expect(service).toBeTruthy();
  }));
});
