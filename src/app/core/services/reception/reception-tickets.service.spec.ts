/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ReceptionTicketsService } from './reception-tickets.service';

describe('Service: ReceptionTickets', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReceptionTicketsService],
    });
  });

  it('should ...', inject(
    [ReceptionTicketsService],
    (service: ReceptionTicketsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
