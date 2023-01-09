import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Repository } from '../../../common/repository/repository';
import { ICountResponse } from '../../models/operations/count-response.model';

@Injectable({
  providedIn: 'root',
})
export class SatInterfaceService {
  constructor(private satInterfaceRepository: Repository<any>) {}

  getCountByExpedient(body: any) {
    return this.satInterfaceRepository.create(
      'interfacesat/transfersat/Expedient',
      body
    ) as Observable<ICountResponse>;
  }
}
