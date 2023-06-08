import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EdosXCoorEndpoints } from 'src/app/common/constants/endpoints/edos-x-coor';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IEdosXCoor } from '../../models/catalogs/edos-x-coor.model';
import { HttpService } from 'src/app/common/services/http.service';
import { EdosXCoorEndpoints } from 'src/app/common/constants/endpoints/edos-x-coor';
@Injectable({
  providedIn: 'root',
})
export class EdosXCoorService
  extends HttpService
  implements ICrudMethods<IEdosXCoor>
{
  private readonly route: string = ENDPOINT_LINKS.EdosXCoor;
  constructor(private edosXCoorRepository: Repository<IEdosXCoor>) {
    super();
    this.microservice = EdosXCoorEndpoints.BasePath;
  }

  getAll(params?: ListParams): Observable<IListResponse<IEdosXCoor>> {
    return this.edosXCoorRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IEdosXCoor> {
    return this.edosXCoorRepository.getById(this.route, id);
  }

  create(model: IEdosXCoor): Observable<IEdosXCoor> {
    return this.edosXCoorRepository.create(this.route, model);
  }

  update(id: string | number, model: IEdosXCoor): Observable<Object> {
    return this.edosXCoorRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.edosXCoorRepository.remove(this.route, id);
  }

  remove2(model: IEdosXCoor) {
    const route = `${EdosXCoorEndpoints.EdosXCoor}`;
    return this.delete(route, model);
  }
}
