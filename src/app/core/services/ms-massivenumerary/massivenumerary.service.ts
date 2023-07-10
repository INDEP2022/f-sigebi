import { Injectable } from '@angular/core';
import { MassiveNumeraryEndpoints } from 'src/app/common/constants/endpoints/ms-massivenumerary-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
@Injectable({
  providedIn: 'root',
})
export class MassiveNumeraryService extends HttpService {
  constructor() {
    super();
    this.microservice = MassiveNumeraryEndpoints.BasePath;
  }

  getAll(params?: ListParams) {
    return this.get(MassiveNumeraryEndpoints.MassiveNumeraryALL, params);
  }
}
