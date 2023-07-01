import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ClassifyGoodService } from 'src/app/core/services/ms-classifygood/ms-classifygood.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { InterfacefgrService } from 'src/app/core/services/ms-interfacefgr/ms-interfacefgr.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { OfficeManagementService } from 'src/app/core/services/office-management/officeManagement.service';
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
  private classifyGood = inject(ClassifyGoodService);
  private officeManagement = inject(OfficeManagementService);
  private historyGoodService = inject(HistoryGoodService);

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

  PUP_DIST_CLASIF(user: string) {
    return new Promise((resolve, reject) => {
      this.classifyGood.getPupDistClasif(user).subscribe({
        next: resp => {
          console.log(resp);
          resolve(resp);
        },
        error: error => {
          console.log('Error al ejecutarse la funcion PUP_DIST_CLASIF', error);
          reject('error al ejecutar el PUP DIST CLASIF');
          this.onLoadToast(
            'error',
            'Error al ejecutarse la funcion PUP_DIST_CLASIF'
          );
        },
      });
    });
  }

  callTmpClasifBien(body: any) {
    return new Promise((resolve, reject) => {
      this.officeManagement.customPostTmpClasifGood(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          console.log(error);
          reject('error al insertar en la tabla tmp_clasif_bien');
          this.onLoadToast(
            'error',
            'Error al insertar en la tabla TMP_CLASIF_BIEN',
            ''
          );
        },
      });
    });
  }

  deleteJobManagement(management: string | number, volante: string | number) {
    const body = {
      pCveOfManagement: Number(management),
      pFlyerNumber: Number(volante),
    };
    return this.officeManagement.deleteJobGestion(body);
  }

  updateGoodStatus(body: any) {
    return new Promise((resolve, reject) => {
      this.historyGoodService.updateGoodStatusWhenDelete(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          console.log('Error al actualizar los estados de bienes', error);
          reject('error');
        },
      });
    });
  }
}
