import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IMinpub } from 'src/app/core/models/catalogs/minpub.model';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  styles: [],
})
export class MaintenanceListComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataMinPub: IListResponse<IMinpub> = {} as IListResponse<IMinpub>;

  constructor(
    private modalRef: BsModalRef,
    private ministerService: MinPubService
  ) {
    super();
    this.settings.columns = COLUMNS;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getMinPub());
  }

  getMinPub() {
    this.loading = true;
    this.ministerService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.dataMinPub = response;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.onLoadToast('error', err.error.message, '');
      },
    });
  }

  formDataMin(data: IMinpub) {
    this.modalRef.content.callback(true, data);
    this.modalRef.hide();
  }
  deleteMin(id: number) {}

  close() {
    this.modalRef.hide();
  }
}
