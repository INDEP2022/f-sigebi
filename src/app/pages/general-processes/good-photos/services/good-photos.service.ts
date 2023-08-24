import { Injectable } from '@angular/core';

import * as JSZip from 'jszip';
import { map, Subject } from 'rxjs';
import { GoodFinderEndpoint } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponseMessage } from 'src/app/core/interfaces/list-response.interface';
import { IGood } from 'src/app/core/models/good/good.model';
import { PhotoComponent } from '../photos-list/photo/photo.component';

@Injectable({
  providedIn: 'root',
})
export class GoodPhotosService extends HttpService {
  deleteEvent = new Subject<boolean>();
  showEvent = new Subject();
  selectedGood: any;
  selectedGoods: any[] = [];
  constructor() {
    super();
    this.microservice = GoodFinderEndpoint.GoodFinderBase;
  }

  get userName() {
    return localStorage.getItem('username')
      ? localStorage.getItem('username').toUpperCase()
      : null;
  }
  getAll(params?: _Params) {
    const route = GoodFinderEndpoint.GoodQuery;
    return this.get<IListResponseMessage<IGood>>(route, params).pipe(
      map(x => {
        return {
          ...x,
          data: x.data.map(good => {
            return {
              ...good,
              select:
                this.selectedGoods.length > 0
                  ? this.selectedGoods.includes(good.id)
                  : false,
            };
          }),
        };
      })
    );
  }

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

  async downloadByGood(photos: PhotoComponent[]) {
    const zip = new JSZip();
    photos.forEach(photo => {
      // console.log(photo.filename);
      // console.log(photo.base64);
      const b = this.base64toBlob(photo.base64, 'base64');
      zip.file(photo.file.name, b);
    });
    return zip;
  }
}
