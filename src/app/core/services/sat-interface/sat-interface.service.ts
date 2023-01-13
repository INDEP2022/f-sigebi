import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Repository } from '../../../common/repository/repository';
import { ICountResponse } from '../../models/operations/count-response.model';

interface ISatTransferLength {
  sat_no_partida: number;
}

interface ISatCountOffie {
  asunto: number;
}
@Injectable({
  providedIn: 'root',
})
export class SatInterfaceService {
  constructor(private satInterfaceRepository: Repository<any>) {}

  getCountByExpedient(body: { officeKey: string; expedient: number }) {
    return this.satInterfaceRepository.create(
      'interfacesat/transfersat/Expedient',
      body
    ) as Observable<ICountResponse>;
  }

  getLengthByJobSubject(body: { jobNumber: string; businessSat: number }) {
    return this.satInterfaceRepository
      .create('interfacesat/transfersat-v2/jobasunto', body)
      .pipe(
        map((response: any) => {
          if (response?.data[0]) {
            return response.data[0] as ISatTransferLength;
          } else {
            throw new HttpErrorResponse({ status: 404 });
          }
        })
      );
  }

  getCountByOffice(body: { officeKey: string }) {
    return this.satInterfaceRepository.create(
      'interfacesat/transfersat/byoffice',
      body
    ) as Observable<ISatCountOffie>;
  }

  getLengthByJob(body: { jobNumber: string }) {
    return this.satInterfaceRepository
      .create('interfacesat/transfersat-v2/job', body)
      .pipe(
        map((response: any) => {
          if (response?.data[0]) {
            return response.data[0] as ISatTransferLength;
          } else {
            throw new HttpErrorResponse({ status: 404 });
          }
        })
      );
  }
}
