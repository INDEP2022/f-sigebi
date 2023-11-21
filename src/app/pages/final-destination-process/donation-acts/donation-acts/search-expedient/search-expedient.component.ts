import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExpedientService } from 'src/app/core/services/expedients/expedient.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EXPEDIENTE } from '../columns2';

@Component({
  selector: 'app-search-expedient',
  templateUrl: './search-expedient.component.html',
  styles: [],
})
export class SearchExpedientComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  columnFilters: any = [];
  selectedRow: any | null = null;
  @Output() onSave = new EventEmitter<any>();
  constructor(
    private modalRef: BsModalRef,
    private expedientService: ExpedientService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...EXPEDIENTE,
      },
    };
  }

  ngOnInit(): void {
    this.data
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
              id: () => (searchFilter = SearchFilter.EQ),
              preliminaryInquiry: () => (searchFilter = SearchFilter.ILIKE),
              transferNumber: () => (searchFilter = SearchFilter.EQ),
              criminalCase: () => (searchFilter = SearchFilter.ILIKE),
              expedientType: () => (searchFilter = SearchFilter.EQ),
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
          //Su respectivo metodo de busqueda de datos
          this.search();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.search());
  }

  search() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.expedientService.getExpeidentByFilters(params).subscribe({
      next: response => {
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.totalItems = 0;
        this.data.load([]);
        this.data.refresh();
        this.loading = false;
      },
    });
  }
  handleSuccess() {
    this.onSave.emit(this.selectedRow);
    this.modalRef.hide();
  }

  cancel() {
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
