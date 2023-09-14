import { Injectable } from '@angular/core';
import { Directaward } from 'src/app/common/constants/endpoints/ms-directaward';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class MsDirectawardService extends HttpService {
  private readonly route = Directaward;
  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }
  getGoodsByApplicant(id: any) {
    return this.get(
      `${this.route.DIRECAWARD_BIENES}?filter.soladjinstgobId=$eq:${id}`
    );
  }
  deleteGoodsById(id: any) {
    return this.delete(`${this.route.DIRECAWARD_BIENES}/${id}`);
  }
  createGoodsById(body: any) {
    return this.post(`${this.route.DIRECAWARD_BIENES}`, body);
  }
  updateGoodsById(id: any, body: any) {
    return this.put(`${this.route.DIRECAWARD_BIENES}/${id}`, body);
  }
}
