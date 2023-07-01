import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ConvertiongoodEndpoints } from 'src/app/common/constants/endpoints/ms-convertiongood-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IConverGoodCreate } from 'src/app/pages/administrative-processes/proceedings-conversion/proceedings-conversion/proceedings-conversion-columns';
// import { IRSender } from 'src/app/pages/administrative-processes/proceedings-conversion/proceedings-conversion/proceedings-conversion.component';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IAssetConversion } from '../../models/ms-convertiongood/asset-conversion';
import { IConvertiongood } from '../../models/ms-convertiongood/convertiongood';
import { environment } from './../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ConvertiongoodService extends HttpService {
  constructor(private http: HttpClient) {
    super();
    this.microservice = ConvertiongoodEndpoints.Convertiongood;
  }

  getAll(params?: ListParams): Observable<IListResponse<IConvertiongood>> {
    return this.get<IListResponse<IConvertiongood>>(
      ConvertiongoodEndpoints.Convertiongood,
      params
    );
  }

  getById(id: string | number) {
    const route = `${ConvertiongoodEndpoints.Convertion}/${id}`;
    return this.get<IConvertiongood>(route);
  }

  create(good: IConvertiongood) {
    return this.post(ConvertiongoodEndpoints.AddActa, good);
  }

  update(id: string | number, good: IConvertiongood | any) {
    const route = `${ConvertiongoodEndpoints.Convertion}/${id}`;
    return this.put(route, good);
  }

  remove(id: string | number) {
    const route = `${ConvertiongoodEndpoints.Convertion}/${id}`;
    return this.delete(route);
  }

  getActsByGood(id: string | number) {
    const route = `${ConvertiongoodEndpoints.Convertion}/procedure/returnMinutes/${id}`;
    return this.get(route);
  }
  createAssetConversions(assetConversions: IAssetConversion) {
    return this.post(
      ConvertiongoodEndpoints.AssetConversions,
      assetConversions
    );
  }
  getRegSender(params?: ListParams) {
    const route = `${ConvertiongoodEndpoints.RtdictaAarusr}`;
    return this.get(route, params);
  }
  getRegAddressee(params: ListParams): Observable<IListResponse<IRSender>> {
    const route = `${ConvertiongoodEndpoints.RtdictaAarusr}`;
    return this.get(route, params);
  }

  getAllGoodsConversions(paramsList: any, conversionId: any) {
    const URL = `${environment.API_URL}/convertiongood/api/v1/${ConvertiongoodEndpoints.AssetConversions}/get-all`;
    const headers = new HttpHeaders();
    let params = new HttpParams().append(
      'filter.conversionId',
      `$eq:${conversionId}`
    );

    return this.http
      .get<any>(URL, { headers: headers, params: params })
      .pipe(map(res => res));
  }
  download(uri: string, params: any): Observable<any> {
    const header: Object = {
      responseType: 'arraybuffer',
    };
    return this.httpClient.get(`${ConvertiongoodEndpoints.ActsConvertion}`);
  }

  getAllGoods(id: number) {
    const URL = `${environment.API_URL}/convertiongood/api/v1/${ConvertiongoodEndpoints.ActsConvertion}`;
    const headers = new HttpHeaders();
    let params = new HttpParams().append('filter.conversionId', `$eq:${id}`);

    return this.http
      .get<any>(URL, { headers: headers, params: params })
      .pipe(map(res => res));
  }
  createActa(conversionActa: IConverGoodCreate) {
    return this.post(ConvertiongoodEndpoints.Convertion, conversionActa);
  }

  updateActa(id: string | number, conversionActa: IConverGoodCreate) {
    const route = `${ConvertiongoodEndpoints.ConvertionActa}/${id}`;
    return this.put(route, conversionActa);
  }
  getAllActasConversion(params: ListParams) {
    const route = `${ConvertiongoodEndpoints.LisActas}`;
    return this.get(route, params);
  }
  getActasByConvertion(cve: string) {
    const route = `${ConvertiongoodEndpoints.LisActas}?filter.cve_acta_conv=${cve}`;
    return this.get(route, cve);
  }
}
