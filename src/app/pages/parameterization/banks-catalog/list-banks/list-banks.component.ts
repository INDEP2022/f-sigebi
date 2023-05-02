import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
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
  dataCourt: IListResponse<IBankAccount> = {} as IListResponse<IBankAccount>;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;

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

    this.searchFilter = { field: 'cveBank', operator: SearchFilter.ILIKE };
  }

  ngOnInit(): void {
    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getCourts();
    });
  }

  getCourts() {
    this.loading = true;
    this.bankService
      .getAllWithFilters(this.filterParams.getValue().getParams())
      .subscribe({
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

  deleteCourt(accountNumber: number) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.bankService.remove(accountNumber).subscribe({
          next: () => {
            this.onLoadToast('success', 'Ha sido eliminado', '');
            this.getCourts();
          },
          error: err => this.onLoadToast('error', err.error.message, ''),
        });
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
