import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGeneric } from 'src/app/core/models/catalogs/generic.model';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NORMS_DETINATION_COLUMNS } from './norms-destination-columns';

@Component({
  selector: 'app-norms-destination',
  templateUrl: './norms-destination.component.html',
  styles: [],
})
export class NormsDestinationComponent extends BasePage implements OnInit {
  @Output() refresh = new EventEmitter<true>();
  columns: IGeneric[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  rowSelected: boolean = false;
  selectedRow: any = null;
  columnFilters: any = [];

  constructor(
    private genericService: GenericService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: NORMS_DETINATION_COLUMNS,
      selectedRowIndex: -1,
      hideSubHeader: true,
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
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'keyId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
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
          this.params = this.pageFilter(this.params);
          this.getExample();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    const d = (this.params.getValue()['filter.name'] = 'Destino');
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.genericService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.data.load(response.data);
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }
  close() {
    this.modalRef.hide();
  }
  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row;
    this.rowSelected = true;
  }
  confirm() {
    if (!this.rowSelected) return;
    this.refresh.emit(this.selectedRow);
    this.modalRef.hide();
  }
}
