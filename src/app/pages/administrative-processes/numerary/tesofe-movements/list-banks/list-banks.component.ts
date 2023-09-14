import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IAccountMovement } from 'src/app/core/models/ms-account-movements/account-movement.model';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BankAccount } from './bank';
import { BANKS_COLUMNS } from './columns-list';

@Component({
  selector: 'app-list-banks',
  templateUrl: './list-banks.component.html',
  styles: [],
})
export class ListBanksComponent extends BasePage implements OnInit {
  banks = new DefaultSelect<any>();
  data: BankAccount = {} as BankAccount;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  dataAcount: IListResponse<IAccountMovement> =
    {} as IListResponse<IAccountMovement>;
  totalItem: number = 0;
  data2 = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private accountService: BankAccountService,
    private modal: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: BANKS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.data2
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filters.field) {
              case 'cve_banco':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'cve_cuenta':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'no_cuenta':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'nombre':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'tipo_cuenta':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'cve_moneda':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'desc_moneda':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'tasa_calculo':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getBank();
        }
      });
    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        if (this.banks) this.getBank();
      },
    });

    //this.getBank();
  }

  getBank() {
    this.loading = true;
    this.accountService.getBankAndAccount().subscribe({
      next: resp => {
        this.banks = new DefaultSelect(resp.data, resp.count);
        console.log('this banks -> ', this.banks.count);
        this.totalItem = this.banks.count;
        //this.dataAcount = this.banks.count;
        this.data2.load(this.banks.data);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  sendData() {
    if (this.data.cve_banco) {
      this.modal.content.callback(true, this.data);
      this.modal.hide();
    } else {
      this.onLoadToast('info', 'Debe seleccionar un banco primero', '');
    }
  }

  selectItem(data: BankAccount) {
    this.data = data;
  }

  close() {
    this.modal.hide();
  }
}
