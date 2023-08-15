import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IGoodAndAvailable } from 'src/app/pages/documents-reception/flyers/related-documents/related-documents.component';
import { GOODS_COLUMNS } from '../columns';
@Component({
  selector: 'app-find-all-good',
  templateUrl: './find-all-good.component.html',
  styles: [],
})
export class FindAllGoodComponent extends BasePage implements OnInit {
  // loading: boolean = false;
  good: any;
  filenumber: any;
  loadingModalE: boolean = false;
  goods: IGood[] = [];
  providerForm: FormGroup = new FormGroup({});
  dataFactGood: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  loadingGood: boolean = false;
  dataTableGoodsMap = new Map<number, IGoodAndAvailable>();
  selectGood: any | null = null;
  @Output() onSave = new EventEmitter<any>();
  @Input() goRed: Function;
  constructor(private modalRef: BsModalRef, private goodService: GoodService) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...GOODS_COLUMNS,
      },
    };
  }

  ngOnInit(): void {
    console.log(this.filenumber);
    this.loadingModalE = true;
    this.providerForm.patchValue(this.good);
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
            filter.field == 'amount'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getGoods(this.params.getValue());
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoods(this.params.getValue()));
  }

  getGoods(lparams: ListParams) {
    this.loadingModalE = true;
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    // this.goRed(this.good);
    // if (lparams?.text.length > 0)
    //   params.addFilter('noExp', lparams.text, SearchFilter.LIKE);
    // para filtrar
    const params2 = {
      ...params,
      ...this.columnFilters,
    };
    this.goodService.getByExpedient(this.filenumber).subscribe({
      next: data => {
        this.loadingModalE = false;
        this.goods = data.data;
        console.log(data.data);
        this.totalItems = data.count;
        this.dataFactGood.load(data.data);
        this.dataFactGood.refresh();
      },
      error: () => {
        this.loading = false;
        console.error('no existe el bien');
      },
    });
  }

  onUserRowSelect(row: any): void {
    if (row.isSelected) {
      this.selectGood = row.data;
    } else {
      this.selectGood = null;
    }
    console.log(this.selectGood);
  }
  return() {
    this.modalRef.hide();
  }
  handleSuccess(): void {
    this.loadingGood = true;
    this.onSave.emit(this.selectGood);
    this.loadingGood = false;
    this.modalRef.hide();
  }
}
