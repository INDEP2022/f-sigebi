import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { GoodService } from 'src/app/core/services/good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GOODS } from '../historical-good-situation/historical-good-situation-columns';

@Component({
  selector: 'app-find-inventary',
  templateUrl: './find-inventary.component.html',
  styles: [],
})
export class FindInventaryComponent extends BasePage implements OnInit {
  selectedRow: any | null = null;
  providerForm: FormGroup = new FormGroup({});
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataGoodTable: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  provider: any;
  @Output() onSave = new EventEmitter<any>();
  totalItems2: number = 0;
  constructor(private goodService: GoodService, private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...GOODS,
      },
    };
  }

  ngOnInit(): void {
    this.dataGoodTable
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              id: () => (searchFilter = SearchFilter.ILIKE),
              inventoryNumber: () => (searchFilter = SearchFilter.ILIKE),
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              descripcion: () => (searchFilter = SearchFilter.EQ),
              quantity: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getListGoods();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getListGoods());
  }

  getListGoods() {
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['sortBy'] = `inventaryNumber:DESC`;
    this.goodService.getAll(params).subscribe({
      next: data => {
        console.log(data);
        this.totalItems2 = data.count;
        this.dataGoodTable.load(data.data);
        this.dataGoodTable.refresh();
      },
      error: () => console.log('no hay bienes'),
    });
  }
  return() {
    this.modalRef.hide();
  }
  handleSuccess(): void {
    this.loading = false;
    this.onSave.emit(this.selectedRow);
    this.modalRef.hide();
  }
  onUserRowSelect(row: any): void {
    if (row.isSelected) {
      this.selectedRow = row.data;
    } else {
      this.selectedRow = null;
    }

    console.log(this.selectedRow);
  }
}
