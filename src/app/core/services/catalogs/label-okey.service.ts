import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LabelGoodEndPoints } from 'src/app/common/constants/endpoints/label-good-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ILabelOKey } from '../../models/catalogs/label-okey.model';
@Injectable({
  providedIn: 'root',
})
export class LabelOkeyService
  extends HttpService
  implements ICrudMethods<ILabelOKey>
{
  private readonly route: string = ENDPOINT_LINKS.LabelOkey;

  constructor(private labelOkeyRepository: Repository<ILabelOKey>) {
    super();
    this.microservice = LabelGoodEndPoints.BasePage;
  }

  getAll(params?: ListParams | string): Observable<IListResponse<ILabelOKey>> {
    return this.labelOkeyRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ILabelOKey> {
    return this.labelOkeyRepository.getById(this.route + '/id', id);
  }

  create(model: ILabelOKey): Observable<ILabelOKey> {
    return this.labelOkeyRepository.create(this.route, model);
  }

  update(id: string | number, model: ILabelOKey): Observable<Object> {
    return this.labelOkeyRepository.newUpdateId(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.labelOkeyRepository.remove(this.route, id);
  }

  remove2(id: string | number) {
    const route = `${LabelGoodEndPoints.labelGood}/id/${id}`;
    return this.delete(route);
  }
}
