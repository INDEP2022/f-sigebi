import { Injectable, QueryList } from '@angular/core';

import * as JSZip from 'jszip';
import { Subject } from 'rxjs';
import { PhotoComponent } from '../photos-list/photo/photo.component';

@Injectable({
  providedIn: 'root',
})
export class GoodPhotosService {
  deleteEvent = new Subject<boolean>();
  constructor() {}

  private base64toBlob(base64Data: any, contentType: string): Blob {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  async downloadByGood(photos: QueryList<PhotoComponent>) {
    const zip = new JSZip();
    photos.forEach(photo => {
      // console.log(photo.filename);
      // console.log(photo.base64);
      const b = this.base64toBlob(photo.base64, 'base64');
      zip.file(photo.filename, b);
    });
    return zip;
  }
}
