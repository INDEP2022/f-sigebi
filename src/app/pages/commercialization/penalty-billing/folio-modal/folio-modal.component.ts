import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { InvoiceFolioSeparate } from 'src/app/core/models/ms-invoicefolio/invoicefolio.model';
import { InvoicefolioService } from 'src/app/core/services/ms-invoicefolio/invoicefolio.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { BILLING_FOLIO_COLUMNS } from './folio-columns';

@Component({
  selector: 'app-folio-modal',
  templateUrl: './folio-modal.component.html',
  styles: [],
})
export class FolioModalComponent extends BasePage implements OnInit {
  title: string = 'Folios Apartados';
  selectedRows: InvoiceFolioSeparate = {} as InvoiceFolioSeparate;
  @Output() onSelected = new EventEmitter<any>();
  filter = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  data: LocalDataSource = new LocalDataSource();
  // data: InvoiceFolioSeparate[] = [];
  columnFilters: any = [];
  constructor(
    private modalRef: BsModalRef,
    private invoiceService: InvoicefolioService,
    private datePipe: DatePipe
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: BILLING_FOLIO_COLUMNS,
    };
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.filter.getValue()['pulledapart'] = `${SearchFilter.EQ}:M`;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            const search: any = {
              series: () => (searchFilter = SearchFilter.EQ),
              invoice: () => (searchFilter = SearchFilter.EQ),
              pulledapart: () => (searchFilter = SearchFilter.EQ),
              comerF: () => (searchFilter = SearchFilter.ILIKE),
              recordDate: () => (searchFilter = SearchFilter.EQ),
            };

            search[filter.field]();

            if (filter.search !== '') {
              if (filter.field == 'eventDate') {
                filter.search = this.datePipe.transform(
                  filter.search,
                  'yyyy-MM-dd'
                );
              }
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.filter = this.pageFilter(this.filter);
          this.getInvoiceFolioSeparate();
        }
      });

    // this.filter.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
    //   if (this.totalItems > 0) this.getInvoiceFolioSeparate();
    // });

    this.filter.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => this.getInvoiceFolioSeparate(),
    });
  }

  getInvoiceFolioSeparate() {
    this.loading = true;
    let params = {
      ...this.filter,
      ...this.columnFilters,
    };
    this.invoiceService.getAllFolioSepate(params).subscribe({
      next: resp => {
        this.loading = false;
        resp.data.map(folio => {
          folio.recordDate = folio.recordDate
            ? folio.recordDate.split('-').reverse().join('/')
            : '';
        });
        this.data.load(resp.data ?? []);
        this.totalItems = resp.count ?? 0;
      },
      error: err => {
        this.loading = false;
        this.data.load([]);
        this.totalItems = 0;
      },
    });
  }

  isSelect(data: InvoiceFolioSeparate) {
    this.selectedRows = data;
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    if (this.selectedRows.folioinvoiceId) {
      this.modalRef.hide();
      this.modalRef.content.callback(true, this.selectedRows);
    } else {
      this.alert('error', 'Error', 'Debe seleccionar un folio');
    }
  }
}
