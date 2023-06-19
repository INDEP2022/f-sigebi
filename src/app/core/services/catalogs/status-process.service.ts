import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StatusProcessCode } from 'src/app/common/constants/endpoints/status-process';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IStatusProcess } from '../../models/catalogs/status-process.model';
@Injectable({
  providedIn: 'root',
})
export class StatusProcessService
  extends HttpService
  implements ICrudMethods<IStatusProcess>
{
  private readonly route: string = ENDPOINT_LINKS.StatusProcess;
  constructor(private statusProcessRepository: Repository<IStatusProcess>) {
    super();
    this.microservice = StatusProcessCode.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IStatusProcess>> {
    return this.statusProcessRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IStatusProcess> {
    return this.statusProcessRepository.getById(this.route, id);
  }

  create(model: IStatusProcess): Observable<IStatusProcess> {
    return this.statusProcessRepository.create(this.route, model);
  }

  newUpdate(model: IStatusProcess): Observable<Object> {
    return this.statusProcessRepository.newUpdate(this.route, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.statusProcessRepository.remove(this.route, id);
  }

  remove2(data: any): Observable<Object> {
    return this.delete(this.route, data);
  }
}
