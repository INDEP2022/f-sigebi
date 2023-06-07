import { type FormGroup } from '@angular/forms';
import { catchError, firstValueFrom, map, Observable, of } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { type INotification } from 'src/app/core/models/ms-notification/notification.model';
import { IMJobManagement } from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { FlyersService } from '../services/flyers.service';

export abstract class RelateDocumentsResponse extends BasePage {
  protected abstract goodServices: GoodService;
  protected abstract serviceOficces: GoodsJobManagementService;
  protected abstract notificationService: NotificationService;
  protected abstract mJobManagementService: MJobManagementService;
  protected abstract flyerService: FlyersService;

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
    // const params = new ListParams();
    // params.page = 1;
    // params.limit = 1;
    // params['filter.idCity'] = text;
    return this.flyerService.getCityById(text);
  }
}
