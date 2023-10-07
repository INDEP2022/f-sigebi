import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { DinamicTablesService } from 'src/app/core/services/catalogs/dinamic-tables.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { BILLING_FOLIO_COLUMNS } from './use-columns';

@Component({
  selector: 'use-modal',
  templateUrl: './use-modal.component.html',
  styles: [],
})
export class UseModalComponent extends BasePage implements OnInit {
  title: string = 'Uso Comprobante';
  filter = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  data: any[] = [];
  name: string;
  selectedRows: any = null;

  constructor(
    private modalRef: BsModalRef,
    private dynamicService: DinamicTablesService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: BILLING_FOLIO_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.filter.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => this.getDinamicTable(),
    });
  }

  getDinamicTable() {
    this.loading = true;
    this.dynamicService
      .getKeyTable(this.filter.getValue().getParams(), this.name)
      .subscribe({
        next: resp => {
          this.loading = false;
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

  isSelect(data: any) {
    this.selectedRows = data;
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    if (this.selectedRows) {
      this.modalRef.hide();
      this.modalRef.content.callback(true, this.selectedRows);
    } else {
      this.alert('error', 'Error', 'Seleccione almenos un dato');
    }
  }
}
