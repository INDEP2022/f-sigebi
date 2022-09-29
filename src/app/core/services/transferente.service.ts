import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../common/constants/endpoints';
import { ICrudMethods } from '../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../common/repository/interfaces/list-params';
import { Repository } from '../../common/repository/repository';
import { IListResponse } from '../interfaces/list-response';
import { ITransferente } from '../models/transferente.model';
@Injectable({
  providedIn: 'root',
})
export class TransferenteService implements ICrudMethods<ITransferente> {
  private readonly route: string = ENDPOINT_LINKS.Transferente;
  constructor(private transferenteRepository: Repository<ITransferente>) {}

  getAll(params?: ListParams): Observable<IListResponse<ITransferente>> {
    return this.transferenteRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<ITransferente> {
    return this.transferenteRepository.getById(this.route, id);
  }

  create(model: ITransferente): Observable<ITransferente> {
    return this.transferenteRepository.create(this.route, model);
  }

  update(id: string | number, model: ITransferente): Observable<Object> {
    return this.transferenteRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.transferenteRepository.remove(this.route, id);
  }
}
