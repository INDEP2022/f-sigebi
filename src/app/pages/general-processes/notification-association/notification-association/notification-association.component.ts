import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { InputCellComponent } from 'src/app/@standalone/smart-table/input-cell/input-cell.component';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';

import {
  NOTIFICATION_ASSOCIATION_COLUMNS,
  NOTIFICATION_ASSOCIATION_EXAMPLE_DATA,
} from './notification-association-columns';

@Component({
  selector: 'app-notification-association',
  templateUrl: './notification-association.component.html',
  styles: [],
})
export class NotificationAssociationComponent
  extends BasePage
  implements OnInit
{
  data = NOTIFICATION_ASSOCIATION_EXAMPLE_DATA;
  params = new BehaviorSubject(new FilterParams());
  notifications: INotification[] = [];
  totalItems: number = 0;
  notificationSelected: Partial<INotification>[] = [];
  loadingText = '';

  constructor(
    private notificationService: NotificationService,
    private expedientService: ExpedientService
  ) {
    super();
    this.settings.columns = {
      ...NOTIFICATION_ASSOCIATION_COLUMNS,
      expedientNumber: {
        title: 'No. Expediente',
        sort: false,
        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (value: any, row: INotification) =>
          this.isNotificationSelected(row),
        renderComponent: InputCellComponent<INotification>,
        onComponentInitFunction: (instance: InputCellComponent) =>
          this.onInputElementInit(instance),
      },
    };
    this.settings.actions = false;
    const params = this.params.getValue();
    params.addFilter('expedientNumber', SearchFilter.NULL);
    this.params.next(params);
  }

  isNotificationSelected(notification: INotification) {
    const exist = this.notificationSelected.find(
      _notification => _notification.wheelNumber == notification.wheelNumber
    );
    return exist ? exist.expedientNumber : null;
  }

  onInputElementInit(inputElement: InputCellComponent<INotification>) {
    inputElement.control.addValidators([Validators.maxLength(10)]);
    inputElement.inputType = 'number';
    inputElement.inputChange.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.handleExpedientChange(data, inputElement),
    });
  }

  ngOnInit(): void {
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => this.getNotifications())
      )
      .subscribe();
  }

  getNotifications() {
    const params = this.params.getValue();
    this.loading = true;
    this.loadingText = 'Cargando';
    this.notificationService.getAllFilter(params.getParams()).subscribe({
      next: response => {
        this.loading = false;
        this.notifications = response.data;
        this.totalItems = response.count;
      },
      error: () => (this.loading = false),
    });
  }

  setExpedientError(inputElement: InputCellComponent<INotification>) {
    inputElement.control.setValue(null);
  }

  handleExpedientChange(
    data: { row: INotification; value: string | number },
    inputElement: InputCellComponent<INotification>
  ) {
    const { row, value } = data;
    if (value) {
      this.findExpedient(value, row).subscribe({
        error: () => this.setExpedientError(inputElement),
      });
    } else {
      this.removeNotification(row.wheelNumber);
    }
  }

  findExpedient(expedientNum: string | number, notification: INotification) {
    this.loading = true;
    return this.expedientService.getById(expedientNum).pipe(
      catchError(error => {
        if (error.status <= 404) {
          this.onLoadToast('error', 'Error', 'El expediente no existe');
        }
        this.loading = false;
        return throwError(() => error);
      }),
      tap(expedient => {
        this.loading = false;
        notification.expedientNumber = Number(expedient.id);
        this.pushNotification(notification);
      })
    );
  }

  pushNotification(notification: INotification) {
    const { wheelNumber, expedientNumber } = notification;
    const index = this.notificationSelected.findIndex(
      _notification => _notification.wheelNumber == notification.wheelNumber
    );
    if (index >= 0) {
      this.notificationSelected[index] = { wheelNumber, expedientNumber };
    } else {
      this.notificationSelected.push({ wheelNumber, expedientNumber });
    }
  }

  removeNotification(wheelNumber: string | number) {
    this.notificationSelected = this.notificationSelected.filter(
      notification => notification.wheelNumber != wheelNumber
    );
    console.log(this.notificationSelected);
  }

  save() {
    const obsArr = this.notificationSelected.map(notification => {
      const { expedientNumber } = notification;
      return this.notificationService.update(notification.wheelNumber, {
        expedientNumber,
      });
    });
    this.loading = true;
    this.loadingText = 'Guardando';
    forkJoin(obsArr).subscribe({
      next: () => {
        this.loading = false;
        this.getNotifications();
      },
      error: error => {
        this.loading = false;
      },
    });
  }
}
