import { formatDate } from '@angular/common';
import { type FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { type INotification } from 'src/app/core/models/ms-notification/notification.model';
import { IMJobManagement } from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { FlyersService } from '../services/flyers.service';
import { IGoodAndAvailable } from './related-documents.component';

export abstract class RelateDocumentsResponse extends BasePage {
  protected abstract goodServices: GoodService;
  protected abstract serviceOficces: GoodsJobManagementService;
  protected abstract notificationService: NotificationService;
  protected abstract mJobManagementService: MJobManagementService;
  protected abstract flyerService: FlyersService;
  protected abstract parametersService: ParametersService;
  protected abstract departmentService: DepartamentService;
  protected abstract authService: AuthService;
  protected abstract formJobManagement: FormGroup;
  protected abstract formNotification: FormGroup;
  protected abstract route: ActivatedRoute;
  protected abstract siabService: SiabService;
  protected abstract sanitizer: DomSanitizer;
  protected abstract modalService: BsModalService;

  abstract dataTableGoods: IGoodAndAvailable[];
  abstract managementForm: FormGroup;
  isLoadingGood: boolean;
  abstract totalItems: number;
  getGoods1(params: ListParams) {
    this.isLoadingGood = true;
    this.goodServices.getAll(params).subscribe({
      next: async data => {
        const goods = await data.data.map(async item => {
          const isAvailable = await this.getFactaDbOficioGestrel(
            this.formJobManagement.get('managementNumber').value,
            item.goodId
          );
          return {
            ...item,
            available: isAvailable,
          };
        });
        this.dataTableGoods = await Promise.all(goods);
        this.totalItems = data.count;
        this.isLoadingGood = false;
      },
      error: () => {
        this.isLoadingGood = false;
      },
    });
  }

  getFactaDbOficioGestrel(
    no_of_gestion: string | number,
    no_bien: string | number
  ): Promise<boolean> {
    return firstValueFrom(
      this.goodServices
        .getFactaDbOficioGestrel({
          no_bien,
          no_of_gestion,
        })
        .pipe(
          map(x => false),
          catchError(() => {
            return of(true);
          })
        )
    );
  }

  getNotification(
    wheelNumber: string | number,
    expendient: string | number
  ): Observable<INotification> {
    const params = new ListParams();
    params.page = 1;
    params.limit = 1;
    params['filter.wheelNumber'] = wheelNumber;
    if (expendient) {
      params['filter.expendient'] = expendient;
    }
    return this.notificationService.getAll(params).pipe(map(x => x.data[0]));
  }

  getMJobManagement(wheelNumber: string | number): Observable<IMJobManagement> {
    const params = new ListParams();
    params.page = 1;
    params.limit = 1;
    params['filter.flyerNumber'] = wheelNumber;
    return this.mJobManagementService.getAll(params).pipe(map(x => x.data[0]));
  }

  getCity(text: string | number): Observable<ICity> {
    return this.flyerService.getCityById(text);
  }

  /**
   *
   * @param date Date
   * @returns
   */
  getFaStageCreda(date: Date): Promise<number> {
    const _date = formatDate(date, 'dd-MM-yyyy', 'en-US');
    return firstValueFrom(
      this.parametersService.getFaStageCreda(_date).pipe(
        map(response => {
          console.log(response);
          return response.stagecreated;
        })
      )
    );
  }

  getDepartment(
    params: ListParams,
    first: boolean = true
  ): Promise<IListResponse<IDepartment> | IDepartment> {
    return firstValueFrom(
      this.departmentService.getAll(params).pipe(
        map(res => {
          if (first) {
            return res.data[0];
          } else {
            return res;
          }
        })
      )
    );
  }

  getGoodsManagement(list: ListParams): Promise<number> {
    return firstValueFrom(
      this.serviceOficces.getGoodsJobManagement(list).pipe(
        map(x => x.count),
        catchError(() => {
          return of(0);
        })
      )
    );
  }

  getDocOficioGestion(params: ListParams) {
    params.page = 1;
    params.limit = 1;

    return firstValueFrom(
      this.mJobManagementService.getDocOficioGestion(params).pipe(
        map(x => x.count),
        catchError(ex => {
          return of(0);
        })
      )
    );
  }

  getGoodsJobManagement(params: ListParams) {
    return firstValueFrom(this.serviceOficces.getGoodsJobManagement(params));
  }

  /*-------------------------- TOOLS----------------------------------*/

  getParamsForName(name: string): string | null {
    return this.route.snapshot.paramMap.get(name) || null;
  }

  pupShowReport() {
    const params = {
      // PARAMFORM: 'NO',
      // P_FIRMA: 'S',
      PARAMFORM: 'NO',
      NO_OF_GES: this.formJobManagement.value.managementNumber,
      TIPO_OF: this.formJobManagement.value.jobType,
      VOLANTE: this.formNotification.value.wheelNumber,
      EXP: this.formNotification.value.expedientNumber,
    };

    let nameReport = 'RGEROFGESTION';
    const jobType = this.formJobManagement.value.jobType;
    const PLLAMO = this.getParamsForName('PLLAMO');
    if (jobType == 'INTERNO' && PLLAMO != 'ABANDONO') {
      nameReport = 'RGEROFGESTION';
    } else if (jobType == 'EXTERNO' && PLLAMO != 'ABANDONO') {
      nameReport = 'RGEROFGESTION_EXT';
    } else if (jobType == 'EXTERNO' && PLLAMO == 'ABANDONO') {
      nameReport = 'RGENABANSUB';
    } else {
      this.alert(
        'error',
        'Error',
        'No se ha especificado el tipo de oficio (EXTERNO,INTERNO)'
      );
    }

    this.siabService.fetchReport(nameReport, params).subscribe(response => {
      if (response !== null) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      } else {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      }
    });
  }

  enableOrDisabledRadioRefersTo(letter: 'A' | 'B' | 'C', isEnable = true) {
    if (!isEnable) {
      document
        .getElementById(`se_refiere_a_${letter}`)
        .setAttribute('disabled', 'disabled');
    } else {
      document
        .getElementById(`se_refiere_a_${letter}`)
        .removeAttribute('disabled');
    }
    // document.getElementById(`se_refiere_a_${letter}`).removeAttribute('disabled');
  }
}
