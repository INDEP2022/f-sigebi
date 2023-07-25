import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
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
  filter = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  data: InvoiceFolioSeparate[] = [];

  constructor(
    private modalRef: BsModalRef,
    private invoiceService: InvoicefolioService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: BILLING_FOLIO_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.filter.getValue().addFilter('pulledapart', 'M', SearchFilter.EQ);
    this.filter.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => this.getInvoiceFolioSeparate(),
    });
  }

  getInvoiceFolioSeparate() {
    this.loading = true;
    this.invoiceService
      .getAllFolioSepate(this.filter.getValue().getParams())
      .subscribe({
        next: resp => {
          this.loading = false;
          resp.data.map(folio => {
            folio.recordDate = folio.recordDate
              ? folio.recordDate.split('-').reverse().join('/')
              : '';
          });
          this.data = resp.data ?? [];
          this.totalItems = resp.count ?? 0;
        },
        error: err => {
          this.loading = false;
          this.data = [];
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
