import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  IVChecaPost,
  IVChecaPostReport,
} from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class JpDBldcCBulkLoadingDepositoryCargoService {
  constructor(
    private htpp: HttpClient,
    private msMsDepositaryService: MsDepositaryService
  ) {}

  postDedPayDepositary(body: any): Observable<any> {
    const url = `${environment.API_URL}depositary/api/v1/ded-pay-depositary`;
    return this.htpp.post(url, body);
  }
  postDetrepoDepositary(body: any): Observable<any> {
    const url = `${environment.API_URL}depositary/api/v1/detrepo-depositary`;
    return this.htpp.post(url, body);
  }
  getAppointmentNumber_PBAplica(goodNumber: number) {
    return this.msMsDepositaryService.getAppointmentNumber_PBAplica(goodNumber);
  }
  getVCheca(cvePayConcept: number) {
    return this.msMsDepositaryService.getVCheca(cvePayConcept);
  }
  getVChecaPost(body: IVChecaPost) {
    return this.msMsDepositaryService.getVChecaPost(body);
  }
  getVChecaPostReport(body: IVChecaPostReport) {
    return this.msMsDepositaryService.getVChecaPostReport(body);
  }
}
