/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { PreviousRouteService } from './previous-route.service';

describe('Service: PreviousRoute', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PreviousRouteService],
    });
  });

  it('should ...', inject(
    [PreviousRouteService],
    (service: PreviousRouteService) => {
      expect(service).toBeTruthy();
    }
  ));
});
