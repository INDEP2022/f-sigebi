import { Injectable } from '@angular/core';
import { DinamicCatalogEndPoints } from 'src/app/common/constants/endpoints/ms-dinamiccatalog-endpoint';
import { HttpService, _Params } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class DynamicCatalogsService extends HttpService {
  constructor() {
    super();
    this.microservice = DinamicCatalogEndPoints.classifygood;
  }

  getOtkeyOtvalue(body: Object) {
    return this.post(DinamicCatalogEndPoints.getOtkeyOtvalue, body);
  }

  getPuestovalue(valPuesto: string) {
    return this.get(DinamicCatalogEndPoints.getPuestovalue + valPuesto);
  }

  getTvalTable5(params: _Params) {
    return this.get(DinamicCatalogEndPoints.TvalTable5, params);
  }

  getOtValor(params: any) {
    return this.post(DinamicCatalogEndPoints.GetOtValor, params);
  }

  getPostQuery(data: {
    noTransferee: number;
    cveUnidSat: string;
    cveProdservSat: string;
  }) {
    return this.post(DinamicCatalogEndPoints.PostQuery, data);
  }
  getTvaltable1_(params: _Params) {
    return this.get(DinamicCatalogEndPoints.GetTvaltable1, params);

  }
  editTvalTable1(params: _Params) {
    return this.put(DinamicCatalogEndPoints.GetTvaltable1, params);
  }

  GetMax(value: number) {
    return this.get(`${DinamicCatalogEndPoints.getMax}/${value}`);

  }
}
