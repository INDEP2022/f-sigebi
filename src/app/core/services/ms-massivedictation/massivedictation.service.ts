import { Injectable } from '@angular/core';
import { MassiveDictationEndpoints } from 'src/app/common/constants/endpoints/ms-massivedictation-endpoint';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class MassiveDictationService extends HttpService {
  private readonly route = MassiveDictationEndpoints;
  constructor() {
    super();
    this.microservice = this.route.BasePath;
  }

  deleteGoodOpinion(id: number) {
    return this.delete(`${this.route.P_ELIMINA_BIENES_DICTAMENT}/${id}`);
  }
}
