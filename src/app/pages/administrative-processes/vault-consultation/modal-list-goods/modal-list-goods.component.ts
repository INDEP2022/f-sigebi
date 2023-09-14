import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ISafe } from 'src/app/core/models/catalogs/safe.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { SafeService } from 'src/app/core/services/catalogs/safe.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COUNT_GOOD_COLUMNS } from '../vault-consultation/vault-consultation-column';

@Component({
  selector: 'app-modal-list-goods',
  templateUrl: './modal-list-goods.component.html',
  styles: [],
})
export class ModalListGoodsComponent extends BasePage implements OnInit {
  // totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  //Data Table
  goods: IGood[] = [];
  columnFilters: any = [];
  vault: ISafe;
  edit = false;
  vaultSelect: any;
  totalItems2: number = 0;
  provider: any;
  providerForm: FormGroup = new FormGroup({});
  dataFactGood: LocalDataSource = new LocalDataSource();
  @Input() idSafe: number;

  // @Output() onConfirm = new EventEmitter<any>();
  constructor(
    private bsModalRef: BsModalRef,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private opcion: ModalOptions,
    private readonly goodServices: GoodService,
    private readonly safeService: SafeService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...COUNT_GOOD_COLUMNS,
      },
    };
  }
  ngOnInit(): void {
    console.log(this.provider);
    this.dataFactGood
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'id' ||
            filter.field == 'description' ||
            filter.field == 'quantity' ||
            filter.field == 'fileNumber'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getGoodBySafe(this.provider.idSafe);
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodBySafe(this.provider.idSafe));
  }

  return() {
    this.bsModalRef.hide();
  }
  getGoodBySafe(id: string | number): void {
    this.loading = true;
    let para = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodServices.getBySafe(id, para).subscribe({
      next: response => {
        console.log(response);
        this.goods = response.data;
        this.totalItems2 = response.count | 0;
        this.dataFactGood.load(response.data);
        this.dataFactGood.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
}
