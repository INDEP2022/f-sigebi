import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IDinamicQueryParams } from '../../models/ms-interfacesat/ms-interfacesat.interface';
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
/**
 * @deprecated Cambiar a la nueva forma
 */
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

  getSatTransfer(body: IDinamicQueryParams | any) {
    return this.satInterfaceRepository.create(
      'interfacesat/transfersat-v3/dynamicQuery',
      body
    );
  }

  /**
   * Se obtiene el listado de una busqueda para gestion de tramite SAT
   * @param body Params de tipo @ListParams
   * @returns
   */
  getVSatTransferencia(body: ListParams) {
    return this.satInterfaceRepository.getAllPaginated(
      'interfacesat/transfersat-v3/VSatTransferencia',
      body
    );
  }

  getSatTinmBreak(body: any) {
    return this.satInterfaceRepository.create(
      'interfacesat/transfersat-v2/onlykey',
      body
    );
  }

  findAllExpJob(body: any) {
    return this.satInterfaceRepository.create(
      'interfacesat/transfersat-v3/allExpJob',
      body
    );
  }

  getSatTransExp(body: any) {
    return this.satInterfaceRepository.create(
      'interfacesat/transfersat-v3/satTransExpe',
      body
    );
  }
}
