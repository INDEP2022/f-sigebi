import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IRAsuntDic } from '../../models/catalogs/r-asunt-dic.model';
@Injectable({
  providedIn: 'root',
})
export class RAsuntDicService
  extends HttpService
  implements ICrudMethods<IRAsuntDic>
{
  private readonly route: string = ENDPOINT_LINKS.RAsuntDic;
  constructor(private rAsuntDicRepository: Repository<IRAsuntDic>) {
    super();
    this.microservice = 'catalog';
  }

  getAll(params?: ListParams): Observable<IListResponse<IRAsuntDic>> {
    return this.rAsuntDicRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IRAsuntDic> {
    return this.rAsuntDicRepository.getById(this.route, id);
  }

  create(model: IRAsuntDic): Observable<IRAsuntDic> {
    return this.rAsuntDicRepository.create(this.route, model);
  }

  update(id: string | number, model: IRAsuntDic): Observable<Object> {
    return this.rAsuntDicRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.rAsuntDicRepository.remove(this.route, id);
  }

  getByIds(model: IRAsuntDic) {
    return this.post('r-asunt-dic/find-one-by-ids', model);
  }
}
