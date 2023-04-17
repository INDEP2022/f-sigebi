import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ITransferente } from '../../models/catalogs/transferente.model';
@Injectable({
  providedIn: 'root',
})
export class TransferenteService extends HttpService {
  private readonly route: string = ENDPOINT_LINKS.Transferente;
  private readonly endpoint: string = 'transferent';
  constructor(
    private transferenteRepository: Repository<ITransferente>,
    private http: HttpClient
  ) {
    super();
    this.microservice = 'catalog';
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<ITransferente>> {
    return this.transferenteRepository.getAllPaginated(this.endpoint, params);
  }

  getAllWithFilter(params?: string): Observable<IListResponse<ITransferente>> {
    return this.transferenteRepository.getAllPaginated(this.endpoint, params);
  }

  getById(id: string | number): Observable<ITransferente> {
    return this.transferenteRepository.getById(this.route, id);
  }

  getByTypeUserIdState(
    params: ListParams,
    state: number,
    type: string
  ): Observable<IListResponse<ITransferente>> {
    const route = `catalog/transferent/get-entity-transferent-by-user/${type}/state/${state}`;
    return this.transferenteRepository.getAllPaginated(route, params);
  }

  getByIdState(id: string | number): Observable<IListResponse<ITransferente>> {
    const route = `catalog/api/v1/transferent/get-entity-transferent-by-state/${id}`;
    return this.http.get<IListResponse<ITransferente>>(
      `${environment.API_URL}/${route}`
    );
    //return this.httpService.get<IListResponse<T>>(``);
  }

  create(transferente: ITransferente) {
    return this.post(this.endpoint, transferente);
  }

  update(id: string | number, transferente: ITransferente) {
    const route = `${this.endpoint}/${id}`;
    return this.put(route, transferente);
  }

  remove(id: string | number) {
    const route = `${this.endpoint}/${id}`;
    return this.delete(route);
  }

  search(params: ListParams): Observable<IListResponse<ITransferente>> {
    var route = `${this.endpoint}/search`;
    return this.get<IListResponse<ITransferente>>(route, params);
  }
}
