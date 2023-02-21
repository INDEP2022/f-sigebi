import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ICourt } from '../../models/catalogs/court.model';
@Injectable({
  providedIn: 'root',
})
export class CourtService implements ICrudMethods<ICourt> {
  private readonly route: string = ENDPOINT_LINKS.Court;
  constructor(
    private courtRepository: Repository<ICourt>,
    private httpClient: HttpClient
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<ICourt>> {
    return this.courtRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ICourt> {
    return this.courtRepository.getById(this.route, id);
  }

  create(model: ICourt): Observable<ICourt> {
    return this.courtRepository.create(this.route, model);
  }

  update(id: string | number, model: ICourt): Observable<Object> {
    return this.courtRepository.update(this.route, id, model);
  }

  updateCourt(model: ICourt) {
    return this.httpClient.put(
      `${environment.API_URL}catalog/api/v1/court`,
      model
    );
  }

  remove(id: string | number): Observable<Object> {
    return this.courtRepository.remove(this.route, id);
  }
}
