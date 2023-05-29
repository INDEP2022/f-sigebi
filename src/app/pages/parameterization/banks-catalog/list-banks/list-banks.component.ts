import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IBankAccount } from 'src/app/core/models/catalogs/bank-account.model';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { BanksCatalogComponent } from '../banks-catalog/banks-catalog.component';
import { COLUMNSLIST } from './columns';

@Component({
  selector: 'app-list-banks',
  templateUrl: './list-banks.component.html',
  styles: [],
})
export class ListBanksComponent extends BasePage implements OnInit {
  filterParams = new BehaviorSubject<ListParams>(new ListParams());

  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;

  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private bankService: BankAccountService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...COLUMNSLIST },
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'accountNumber':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getCourts();
        }
      });
    this.filterParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCourts());
  }

  getCourts() {
    this.loading = true;
    let params = {
      ...this.filterParams.getValue(),

      ...this.columnFilters,
    };
    console.log(params);
    this.bankService.getAllWithFilters(params).subscribe({
      next: response => {
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (
        this.onLoadToast('error', error.error.message, ''),
        (this.loading = false)
      ),
    });
  }

  formDataCourt(data: IBankAccount) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      data,
      callback: (next: boolean) => {
        if (next) {
          this.filterParams
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getCourts());
        }
      },
    };
    this.modalService.show(BanksCatalogComponent, modalConfig);
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

  openForm() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean, data: IBankAccount) => {
          if (next) {
            this.filterParams
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getCourts());
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(BanksCatalogComponent, config);
  }
}
