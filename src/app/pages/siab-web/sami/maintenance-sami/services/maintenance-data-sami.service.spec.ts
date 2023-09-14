/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { MaintenanceDataSamiService } from './maintenance-data-sami.service';

describe('Service: MaintenanceDataSami', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MaintenanceDataSamiService],
    });
  });

  it('should ...', inject(
    [MaintenanceDataSamiService],
    (service: MaintenanceDataSamiService) => {
      expect(service).toBeTruthy();
    }
  ));
});
