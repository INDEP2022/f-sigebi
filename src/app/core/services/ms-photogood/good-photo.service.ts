import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PhotoGoodEndpoints } from 'src/app/common/constants/endpoints/photo-good-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodPhoto } from '../../models/ms-goodphoto/good-photo.model';

@Injectable({
  providedIn: 'root',
})
export class GoodPhotoService extends HttpService {
  private readonly _url = environment.API_URL;
  private readonly _prefix = environment.URL_PREFIX;
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
