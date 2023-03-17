import { Injectable } from '@angular/core';
import { _Params } from 'src/app/common/services/http.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';

@Injectable({
  providedIn: 'root',
})
export class FlyersService {
  constructor(private msMJobManagementService: MJobManagementService) {}

  getMOficioGestion(params: _Params) {
    return this.msMJobManagementService.getAllFiltered(params);
  }
}
