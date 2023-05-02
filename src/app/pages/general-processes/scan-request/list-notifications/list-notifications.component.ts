import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-list-notifications',
  templateUrl: './list-notifications.component.html',
  styles: [],
})
export class ListNotificationsComponent extends BasePage implements OnInit {
  dataNotification: IListResponse<INotification> =
    {} as IListResponse<INotification>;
  filterParamsDocuments = new BehaviorSubject<FilterParams>(new FilterParams());

  constructor(
    private modalRef: BsModalRef,
    private notifyService: NotificationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        position: 'right',
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.filterParamsDocuments
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => {
        this.getNotfications();
      });
  }

  formDataNoti(notify: INotification) {
    this.modalRef.content.callback(true, notify);
    this.modalRef.hide();
  }

  getNotfications() {
    this.loading = true;
    this.notifyService
      .getAllFilter(this.filterParamsDocuments.getValue().getParams())
      .subscribe({
        next: resp => {
          this.loading = false;
          this.dataNotification = resp;
        },
        error: err => {
          this.loading = false;
          this.onLoadToast('error', err.error.message, '');
        },
      });
  }

  close() {
    this.modalRef.hide();
  }
}
