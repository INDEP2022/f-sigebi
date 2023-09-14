/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { GoodPhotosService } from './good-photos.service';

describe('Service: GoodPhotos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoodPhotosService],
    });
  });

  it('should ...', inject([GoodPhotosService], (service: GoodPhotosService) => {
    expect(service).toBeTruthy();
  }));
});
