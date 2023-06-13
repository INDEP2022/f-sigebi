import { inject, Injectable } from '@angular/core';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { InterfacefgrService } from 'src/app/core/services/ms-interfacefgr/ms-interfacefgr.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { BasePage } from 'src/app/core/shared';

@Injectable()
export class RelatedDocumentDesahogo extends BasePage {
  private notificationService = inject(NotificationService);
  private interfaceFgrService = inject(InterfacefgrService);
  private mJobManagementService = inject(MJobManagementService);

  constructor() {
    super();
  }

  async isPGRAndElectronic(pgrOffice: number | string): Promise<boolean> {
    const params = new FilterParams();
    params.addFilter('pgrOffice', pgrOffice);
    let filter = params.getParams();
    const result: any = await this.getPgrtransferent(filter);
    let displayInputs = false;

    if (result) {
      displayInputs = true;
    }

    return displayInputs;
  }

  getNotification(params: ListParams) {
    return new Promise((resolve, reject) => {
      this.notificationService.getAll(params).subscribe({
        next: resp => {
          resolve(resp);
        },
      });
    });
  }

  getPgrtransferent(params: string) {
    return new Promise((resolve, reject) => {
      this.interfaceFgrService.getPgrTransferFiltered(params).subscribe({
        next: resp => {
          resolve(resp);
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }

  getMJobManagement(params: ListParams) {
    return new Promise((resolve, reject) => {
      this.mJobManagementService.getAll(params).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async pupBienDoc(paramsGestionDictamen: any) {
    const volante = paramsGestionDictamen.volante;
    const params = new ListParams();
    params[`filter.flyerNumber`] = `$eq:${volante}`;
    const m_job_management = await this.getMJobManagement(params);

    if (paramsGestionDictamen.doc === 'N') {
      this.onLoadToast('info', 'Este oficio no lleva Documentos', '');
      return;
    }

    /*if (this.m_job_management.status_of === 'ENVIADO') {
      this.onLoadToast(
        'info',
        'El oficio ya está enviado, no pude ser actualizado',
        ''
      );
      return;
    }*/
  }
}
