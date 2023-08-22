/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { MassiveFilePhotoSaveZipService } from './massive-file-photo-save-zip.service';

describe('Service: MassiveFilePhotoSaveZip', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MassiveFilePhotoSaveZipService],
    });
  });

  it('should ...', inject(
    [MassiveFilePhotoSaveZipService],
    (service: MassiveFilePhotoSaveZipService) => {
      expect(service).toBeTruthy();
    }
  ));
});
