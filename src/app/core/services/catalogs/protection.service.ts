import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from 'src/app/common/constants/endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IProtection } from '../../models/catalogs/protection.model';

@Injectable({
  providedIn: 'root',
})
export class ProtectionService {
  private readonly route: string = ENDPOINT_LINKS.Rack;
  private readonly warehouseRoute: string = ENDPOINT_LINKS.Warehouse;
  constructor(private protectionRepository: Repository<IProtection>) {}

  getAll(params?: ListParams): Observable<IListResponse<IProtection>> {
    return this.protectionRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IProtection> {
    return this.protectionRepository.getById(this.route, id);
  }

  create(model: IProtection): Observable<IProtection> {
    return this.protectionRepository.create(this.route, model);
  }

  update(id: string | number, model: IProtection): Observable<Object> {
    return this.protectionRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.protectionRepository.remove(this.route, id);
  }
}
