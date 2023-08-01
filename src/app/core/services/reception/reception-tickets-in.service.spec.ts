/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ReceptionTicketsInService } from './reception-tickets-in.service';

describe('Service: ReceptionTicketsIn', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReceptionTicketsInService],
    });
  });

  it('should ...', inject(
    [ReceptionTicketsInService],
    (service: ReceptionTicketsInService) => {
      expect(service).toBeTruthy();
    }
  ));
});
