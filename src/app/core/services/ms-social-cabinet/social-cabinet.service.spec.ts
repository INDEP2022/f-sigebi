/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { SocialCabinetService } from './social-cabinet.service';

describe('Service: SocialCabinet', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialCabinetService],
    });
  });

  it('should ...', inject(
    [SocialCabinetService],
    (service: SocialCabinetService) => {
      expect(service).toBeTruthy();
    }
  ));
});
