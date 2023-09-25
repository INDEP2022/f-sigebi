import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DEPOSIT_TOKENS_MODAL_COLUMNS } from './deposit-tokens-modal-columns';

@Component({
  selector: 'app-deposit-tokens-modal',
  templateUrl: './deposit-tokens-modal.component.html',
  styles: [``],
})
export class DepositTokensModalComponent extends BasePage implements OnInit {
  title: string = 'Movimientos';
  form: FormGroup;

  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  noCuenta: any;
  columnFilters: any = [];
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private accountMovementService: AccountMovementService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: DEPOSIT_TOKENS_MODAL_COLUMNS,
      rowClassFunction: (row: any) => {
        if (row.data.genderTransfer == 'S') {
          return 'bg-success text-white';
        }

        if (row.data.numberMotionTransfer != null) {
          return 'bg-warning text-white';
        }

        if (row.data.numberReturnPayCheck != null) {
          return 'bg-info text-white';
        } else {
          return '';
        }
      },
    };
  }

  ngOnInit(): void {
    if (!this.noCuenta) {
      return;
    }

    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              numberMotion: () => (searchFilter = SearchFilter.EQ),
              deposit: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              if (filter.field == 'deposit') {
                this.columnFilters[
                  field
                ] = `${searchFilter}:${filter.search.replace(/,/g, '')}`;
              } else {
                this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              }
              // this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getDataMovements();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getDataMovements();
    });
  }

  getDataMovements() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    params['filter.numberAccount'] = `$eq:${this.noCuenta}`;
    this.accountMovementService.getAllFiltered(params).subscribe({
      next: async (response: any) => {
        console.log('response', response);
        this.data1.load(response.data);
        this.data1.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.data1.load([]);
        this.data1.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }
  close() {
    this.modalRef.hide();
  }
}
