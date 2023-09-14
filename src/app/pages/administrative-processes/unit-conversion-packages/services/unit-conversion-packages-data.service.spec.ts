/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { UnitConversionPackagesDataService } from './unit-conversion-packages-data.service';

describe('Service: UnitConversionPackagesData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnitConversionPackagesDataService],
    });
  });

  it('should ...', inject(
    [UnitConversionPackagesDataService],
    (service: UnitConversionPackagesDataService) => {
      expect(service).toBeTruthy();
    }
  ));
});
