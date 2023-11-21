import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { takeUntil } from 'rxjs';
import { IMandExpenseCont } from 'src/app/core/models/ms-accounting/mand-expensecont';
import { ICabms } from 'src/app/core/services/ms-payment/payment-service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-part-cont-sirsae',
  templateUrl: './part-cont-sirsae.component.html',
  styleUrls: ['./part-cont-sirsae.component.scss'],
})
export class PartContSirsaeComponent extends BasePageWidhtDinamicFiltersExtra<ICabms> {
  mand: IMandExpenseCont;
  selected: ICabms;
  apply = false;
  constructor(
    private dataService: PaymentService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };
  }

  selectRow(row: ICabms) {
    this.selected = row;
  }

  confirm() {
    this.modalRef.content.callback({
      selected: this.selected,
      apply: this.apply,
    });
    this.modalRef.hide();
  }

  override setFilters(change: any) {
    let haveFilter = false;

    let filters = change.filter.filters;
    filters.map((filter: any) => {
      let field = this.getField(filter);
      if (filter.search !== '') {
        this.columnFilters[field] = `${filter.search}`;
        haveFilter = true;
      } else {
        delete this.columnFilters[field];
      }
      if (haveFilter) {
        this.params.value.page = 1;
      }
      console.log(this.columnFilters);
    });
  }

  override getData() {
    this.loading = true;
    // if (this.mand) {
    //   this.columnFilters['filter.CLKCABMS'] = 'OT39909193'; //`${this.mand.cabms}`;
    // }
    let params = this.getParams();
    if (this.dataService) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.subscription = this.dataService
        .getCabms(1, params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: (response: any) => {
            if (response) {
              this.totalItems = response.count || 0;
              console.log(response);

              this.data.load(response.data);
              this.data.refresh();
              this.loading = false;
              this.extraOperationsGetData();
            }
          },
          error: err => {
            this.dataNotFound();
          },
        });
    } else {
      this.dataNotFound();
    }
  }

  close() {
    this.modalRef.hide();
  }
}
