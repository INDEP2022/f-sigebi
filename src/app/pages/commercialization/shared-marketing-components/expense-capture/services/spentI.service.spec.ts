/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { SpentIService } from './spentI.service';

describe('Service: SpentI', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpentIService],
    });
  });

  it('should ...', inject([SpentIService], (service: SpentIService) => {
    expect(service).toBeTruthy();
  }));
});
