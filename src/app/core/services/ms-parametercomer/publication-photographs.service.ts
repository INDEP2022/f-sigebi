import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BatchEndpoints } from 'src/app/common/constants/endpoints/ms-batch';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IPhoto } from '../../models/ms-parametercomer/parameter';

@Injectable({
  providedIn: 'root',
})
export class PublicationPhotographsService extends HttpService {
  private readonly endpoint: string = BatchEndpoints.Photo;
  constructor(private htpp: HttpClient) {
    super();
    this.microservice = BatchEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IPhoto>> {
    return this.get<IListResponse<IPhoto>>(this.endpoint, params);
  }

  getById(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.get(route);
  }

  create(photo: IPhoto) {
    return this.post(this.endpoint, photo);
  }

  update(id: string | number, photo: IPhoto) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, photo);
  }

  remove(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.delete(route);
  }
}
