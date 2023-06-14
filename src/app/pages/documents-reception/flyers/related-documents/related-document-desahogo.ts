import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { InterfacefgrService } from 'src/app/core/services/ms-interfacefgr/ms-interfacefgr.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { BasePage } from 'src/app/core/shared';
import { IJuridicalDocumentManagementParams } from 'src/app/pages/juridical-processes/file-data-update/interfaces/file-data-update-parameters';

@Injectable()
export class RelatedDocumentDesahogo extends BasePage {
  paramsGestionDictamen: IJuridicalDocumentManagementParams;
  origin: any = null;
  pantallaActual: string;

  /* injections */
  private notificationService = inject(NotificationService);
  private interfaceFgrService = inject(InterfacefgrService);
  private mJobManagementService = inject(MJobManagementService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private goodprocess = inject(GoodProcessService);

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

  getQueryParams() {
    this.route.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        console.log(params);
        this.origin = params['origin'] ?? null;
        this.paramsGestionDictamen.volante = params['volante'] ?? null;
        this.paramsGestionDictamen.expediente = params['expediente'] ?? null;
        this.paramsGestionDictamen.tipoOf = params['tipoOf'] ?? null;
        this.paramsGestionDictamen.doc = params['doc'] ?? null;
        this.paramsGestionDictamen.pDictamen = params['pDictamen'] ?? null;
        this.paramsGestionDictamen.sale = params['sale'] ?? null;
        this.paramsGestionDictamen.pGestOk = params['pGestOk'] ?? null;
        this.paramsGestionDictamen.pllamo = params['pllamo'] ?? null; // Se agrego
      });
    this.pantallaActual = this.route.snapshot.paramMap.get('id');
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

  PUP_CAMBIO_IMPRO(
    checked: boolean | string,
    managementNumber: number,
    proceedingNumber: number
  ) {
    const chk = checked == true || checked === 'true' ? 1 : 0;

    const body: any = {
      chkSelect: chk,
      managementOfNumber: managementNumber,
      proceedingNumber: proceedingNumber,
    };
    this.goodprocess.callPupChangeImpro(body).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: error => {
        console.log('error al llamar al pup cambio impro', error);
      },
    });
  }
}
