import { Injectable } from '@angular/core';
import {
  IVChecaPost,
  IVChecaPostReport,
} from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';

@Injectable({
  providedIn: 'root',
})
export class JpDBldcCBulkLoadingDepositoryCargoService {
  constructor(private msMsDepositaryService: MsDepositaryService) {}
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
