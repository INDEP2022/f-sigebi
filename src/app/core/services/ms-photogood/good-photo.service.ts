import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PhotoGoodEndpoints } from 'src/app/common/constants/endpoints/photo-good-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodPhoto } from '../../models/ms-goodphoto/good-photo.model';

@Injectable({
  providedIn: 'root',
})
export class GoodPhotoService extends HttpService {
  constructor() {
    super();
    this.microservice = PhotoGoodEndpoints.BasePath;
  }

  getAll(params?: _Params): Observable<IListResponse<IGoodPhoto>> {
    return this.get<IListResponse<IGoodPhoto>>(
      PhotoGoodEndpoints.BienesFoto,
      params
    );
  }

  getFilterGoodPhoto(params: any) {
    return this.get<IListResponse<any>>(`good-photo`, params);
  }

  save(body: IGoodPhoto) {
    return this.post(PhotoGoodEndpoints.BienFoto, body);
  }
}
