import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { format } from 'date-fns';
import {
  BehaviorSubject,
  forkJoin,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';

import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SHIPPING_DOCUMENTS_COLUMNS } from './shipping-documents-columns';
import {
  AREAS_TEXT,
  DIRECTION_TEXT,
} from './utils/shipping-documents-contants';
import { SHIPPING_DOCUMENTS_FORM } from './utils/shipping-documents-forms';

@Component({
  selector: 'app-shipping-documents',
  templateUrl: './shipping-documents.component.html',
  styles: [],
})
export class ShippingDocumentsComponent extends BasePage implements OnInit {
  documentsForm = this.fb.group(SHIPPING_DOCUMENTS_FORM);
  select = new DefaultSelect();
  // data = SHIPPING_DOCUMENTS_EXAMPLE_DATA;
  notificationParams = new BehaviorSubject<ListParams>(new ListParams());
  totalNotifications: number = 0;
  senders = new DefaultSelect();
  receivers = new DefaultSelect();
  departments = new DefaultSelect();
  notifications: any[] = [];

  get formControls() {
    return this.documentsForm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private notificationService: NotificationService,
    private affairService: AffairService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...SHIPPING_DOCUMENTS_COLUMNS },
      selectMode: 'multi',
    };
  }

  ngOnInit(): void {
    this.notificationParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getNotifications());
    this.formControls.messageType.valueChanges
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => this.onMessageTypeChange())
      )
      .subscribe();
  }

  onMessageTypeChange() {
    const messageType = this.formControls.messageType.value;
    if (messageType == 'area') {
      const dateCtrl = new Date(this.formControls.date.value);
      const date = format(dateCtrl, 'dd-mm-yyyy');
      this.formControls.messageBody.setValue(AREAS_TEXT(date));
    }
    if (messageType == 'direction') {
      this.formControls.messageBody.setValue(DIRECTION_TEXT);
    }
  }

  save() {
    this.documentsForm.markAllAsTouched();
  }

  getSenders(params: ListParams) {
    this.getUsers(params)
      .pipe(
        map(response => {
          const receiverCode = this.formControls.receiver.value;
          return this.filterUsers(response, receiverCode);
        }),
        tap(
          response =>
            (this.senders = new DefaultSelect(response.data, response.count))
        )
      )
      .subscribe();
  }

  getReceivers(params: ListParams) {
    console.log('entro');
    this.getUsers(params)
      .pipe(
        map(response => {
          const senderCode = this.formControls.sender.value;
          return this.filterUsers(response, senderCode);
        }),
        tap(
          response =>
            (this.receivers = new DefaultSelect(response.data, response.count))
        )
      )
      .subscribe();
  }

  getUsers(params: ListParams) {
    return this.usersService.getAllSegXAreas(params);
  }

  getDepartmentTarget(user: any) {
    const body = {
      id: user.departamentNumber,
      numDelegation: user.delegationNumber,
      numSubDelegation: user.subdelegationNumber,
      phaseEdo: 1,
    };
    this.usersService.getDepartmentByIds(body).subscribe({
      next: response => {
        this.departments = new DefaultSelect([response], 1);
        this.formControls.department.setValue(response.id);
      },
    });
  }

  filterUsers(response: IListResponse<any>, usercode: string) {
    if (usercode) {
      response.data = response.data.filter(user => user.id != usercode);
      return response;
    } else {
      return response;
    }
  }

  getNotifications() {
    this.getNotificationsByAreas().subscribe({
      next: res => {
        console.log(res);
        this.notifications = res.data;
        this.totalNotifications = res.count;
      },
    });
  }

  getNotificationsByAreas() {
    const params = this.notificationParams.getValue();
    return this.notificationService.getAll(params).pipe(
      tap(response => {
        if (response.count == 0) {
          this.onLoadToast('error', 'Error', 'No hay notificaciones');
        }
      }),
      switchMap(response => {
        return forkJoin(
          response.data.map(notification =>
            this.getSubjectById(notification.affairKey).pipe(
              tap(
                subject => (notification.subject = subject?.description ?? '')
              )
            )
          )
        ).pipe(map(() => response));
      })
    );
  }

  getSubjectById(code: string) {
    return this.affairService.getById(code);
  }
}
