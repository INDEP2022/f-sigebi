/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { FilePhotoSaveZipService } from './file-photo-save-zip.service';

describe('Service: FilePhotoSaveZip', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FilePhotoSaveZipService],
    });
  });

  it('should ...', inject(
    [FilePhotoSaveZipService],
    (service: FilePhotoSaveZipService) => {
      expect(service).toBeTruthy();
    }
  ));
});
