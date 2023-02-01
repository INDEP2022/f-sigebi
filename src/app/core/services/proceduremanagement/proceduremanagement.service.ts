import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';

@Injectable({
  providedIn: 'root',
})
export class ProcedureManagementService {
  private baseURL: string = 'proceduremanagement/';

  constructor(private procedureManagementRepository: Repository<any>) {}

  getManagamentProcessSat(body: ListParams) {
    return this.procedureManagementRepository.getAllPaginated(
      this.baseURL + 'views/management-process-sat',
      body
    );
  }

  getManagamentProcessSatArea(body: ListParams) {
    return this.procedureManagementRepository.getAllPaginated(
      this.baseURL + 'management-area',
      body
    );
  }
}
