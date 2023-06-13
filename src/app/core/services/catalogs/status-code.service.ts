import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatusCode } from 'src/app/common/constants/endpoints/status-code';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStatusCode } from '../../models/catalogs/status-code.model';
@Injectable({
  providedIn: 'root',
})
export class StatusCodeService
  extends HttpService
  implements ICrudMethods<IStatusCode>
{
  private readonly route: string = ENDPOINT_LINKS.StatusCode;
  constructor(private statusCodeRepository: Repository<IStatusCode>) {
    super();
    this.microservice = StatusCode.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IStatusCode>> {
    return this.statusCodeRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IStatusCode> {
    return this.statusCodeRepository.getById(this.route, id);
  }

  create(model: IStatusCode): Observable<IStatusCode> {
    return this.statusCodeRepository.create(this.route, model);
  }

  newUpdate(model: IStatusCode): Observable<Object> {
    return this.statusCodeRepository.newUpdate(this.route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.statusCodeRepository.remove(this.route, id);
  }

  remove2(data: any): Observable<Object> {
    return this.delete('status-code', data);
  }
}
