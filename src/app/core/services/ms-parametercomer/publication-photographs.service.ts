import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PhotoGoodEndpoints } from 'src/app/common/constants/endpoints/photo-good-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import {
  IFindPhoto,
  IGoodPhoto,
} from '../../models/ms-parametercomer/parameter';
@Injectable({
  providedIn: 'root',
})
export class PublicationPhotographsService extends HttpService {
  private readonly endpoint: string = PhotoGoodEndpoints.PhotoGood;
  constructor(private htpp: HttpClient) {
    super();
    this.microservice = PhotoGoodEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IGoodPhoto>> {
    return this.get<IListResponse<IGoodPhoto>>(this.endpoint, params);
  }

  getByGoodPhoto(findg: IFindPhoto) {
    const route = `${this.endpoint}`;
    return this.post(route, findg);
  }

  // create(photo: IPhoto) {
  //   return this.post(this.endpoint, photo);
  // }

  // update(id: string | number, photo: IPhoto) {
  //   const route = `${this.endpoint}/${id}`;
  //   return this.put(route, photo);
  // }

  // remove(id: string | number) {
  //   const route = `${this.endpoint}/${id}`;
  //   return this.delete(route);
  // }
}
