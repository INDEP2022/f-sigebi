/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { GoodsManagementService } from './goods-management.service';

describe('Service: GoodsManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodsManagementService],
    });
  });

  it('should ...', inject(
    [GoodsManagementService],
    (service: GoodsManagementService) => {
      expect(service).toBeTruthy();
    }
  ));
});
