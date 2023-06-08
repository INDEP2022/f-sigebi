import { formatDate } from '@angular/common';
import { type FormGroup } from '@angular/forms';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { type INotification } from 'src/app/core/models/ms-notification/notification.model';
import { IMJobManagement } from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { FlyersService } from '../services/flyers.service';

export abstract class RelateDocumentsResponse extends BasePage {
  protected abstract goodServices: GoodService;
  protected abstract serviceOficces: GoodsJobManagementService;
  protected abstract notificationService: NotificationService;
  protected abstract mJobManagementService: MJobManagementService;
  protected abstract flyerService: FlyersService;
  protected abstract parametersService: ParametersService;
  protected abstract departmentService: DepartamentService;
  protected abstract authService: AuthService;

  abstract data1: IGood[];
  abstract managementForm: FormGroup;
  isLoadingGood: boolean;
  abstract totalItems: number;
  abstract formJobManagement: FormGroup;
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
        this.data1 = await Promise.all(goods as any);
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
}
