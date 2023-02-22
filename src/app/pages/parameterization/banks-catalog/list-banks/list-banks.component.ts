import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IBankAccount } from 'src/app/core/models/catalogs/bank-account.model';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNSLIST } from './columns';

@Component({
  selector: 'app-list-banks',
  templateUrl: './list-banks.component.html',
  styles: [],
})
export class ListBanksComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataCourt: IListResponse<IBankAccount> = {} as IListResponse<IBankAccount>;

  constructor(
    private modalRef: BsModalRef,
    private bankService: BankAccountService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...COLUMNSLIST },
    };
    this.dataCourt.count = 0;
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCourts());
  }

  getCourts() {
    this.loading = true;
    this.bankService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.dataCourt = response;
        this.loading = false;
      },
      error: error => (
        this.onLoadToast('error', error.error.message, ''),
        (this.loading = false)
      ),
    });
  }

  formDataCourt(data: IBankAccount) {
    this.modalRef.content.callback(true, data);
    this.modalRef.hide();
  }
  deleteCourt(id: number) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
      }
    });
  }

  handleSuccess() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
