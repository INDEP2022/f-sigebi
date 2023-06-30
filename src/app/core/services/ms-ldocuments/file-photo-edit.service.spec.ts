/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { FilePhotoEditService } from './file-photo-edit.service';

describe('Service: FilePhotoEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilePhotoEditService],
    });
  });

  it('should ...', inject(
    [FilePhotoEditService],
    (service: FilePhotoEditService) => {
      expect(service).toBeTruthy();
    }
  ));
});
