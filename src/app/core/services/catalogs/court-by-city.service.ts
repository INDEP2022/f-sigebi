import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ICourtModel } from '../../models/catalogs/court.model';
@Injectable({
  providedIn: 'root',
})
export class CourtByCityService
  extends HttpService
  implements ICrudMethods<ICourtModel>
{
  private readonly route: string = ENDPOINT_LINKS.CourtByCity;
  constructor(private courtRepository: Repository<ICourtModel>) {
    super();
    this.microservice = 'catalog';
  }

  getAllWithFilters(params?: string): Observable<IListResponse<ICourtModel>> {
    return this.get<IListResponse<ICourtModel>>('court-by-city', params);
  }

  getById(id: string | number): Observable<ICourtModel> {
    return this.courtRepository.getById(this.route, id);
  }

  create(model: ICourtModel): Observable<ICourtModel> {
    return this.courtRepository.create(this.route, model);
  }

  update(id: string | number, model: ICourtModel): Observable<Object> {
    return this.courtRepository.update(this.route, id, model);
  }

  updateCity(model: ICourtModel) {
    return this.httpClient.put(
      `${environment.API_URL}catalog/api/v1/court`,
      model
    );
  }

  deleteCity(
    idCourt: number | string,
    idCity: number | string
  ): Observable<ICourtModel> {
    return this.httpClient.delete<ICourtModel>(
      `${environment.API_URL}catalog/api/v1/court-by-city/city/${idCity}/court/${idCourt}`
    );
  }
}
