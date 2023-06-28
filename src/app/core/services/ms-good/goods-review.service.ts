import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoodEndpoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService } from 'src/app/common/services/http.service';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IGoodsReview } from '../../models/ms-good/goods-review.model';
@Injectable({
  providedIn: 'root',
})
export class GoodsReview
  extends HttpService
  implements ICrudMethods<IGoodsReview>
{
  private readonly route: string = GoodEndpoints.GoodsMotivesrev;
  private readonly delegation: string = ENDPOINT_LINKS.Delegation;
  constructor(private goodsMotive: Repository<IGoodsReview>) {
    super();
    this.microservice = GoodEndpoints.GoodsMotivesrev;
  }

  getAll(params?: ListParams): Observable<IListResponse<IGoodsReview>> {
    return this.goodsMotive.getAllPaginated(this.route, params);
  }

  getAllFiltered(params: string): Observable<IListResponse<IGoodsReview>> {
    return this.get<IListResponse<IGoodsReview>>(
      GoodEndpoints.GoodsMotivesrev,
      params
    );
  }
}
