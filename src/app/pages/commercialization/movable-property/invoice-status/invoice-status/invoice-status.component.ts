import { Component, OnInit } from '@angular/core';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { StatusInvoiceService } from 'src/app/core/services/ms-parameterinvoice/status-invoice.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { InvoiceStatusModalComponent } from '../invoice-status-modal/invoice-status-modal.component';
import { INVOICE_STATUS_COLUMNS } from './invoice-status-columns';

@Component({
  selector: 'app-invoice-status',
  templateUrl: './invoice-status.component.html',
  styles: [],
})
export class InvoiceStatusComponent extends BasePage implements OnInit {
  columns: any[] = [];
  totalItems: number = 0;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  data: { id: string; description: string }[] = [];
  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private modalService: BsModalService,
    private statusInvoiceService: StatusInvoiceService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...INVOICE_STATUS_COLUMNS },
    };
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.dataFilter
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
              id: () => (searchFilter = SearchFilter.ILIKE),
              description: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          this.getData();
        }
      });

    this.paramsList
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  openForm(allotment?: any) {
    this.openModal(allotment);
  }

  openModal(context?: any) {
    let config: ModalOptions = {
      initialState: {
        allotment: context,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(InvoiceStatusModalComponent, config);
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.statusInvoiceService.getAll(params).subscribe({
      next: resp => {
        this.loading = false;
        this.data = resp.data;
        this.totalItems = resp.count;
        this.dataFilter.load(resp.data);
        this.dataFilter.refresh();
      },
      error: err => {
        this.data = [];
        this.totalItems = 0;
        this.dataFilter.load([]);
        this.dataFilter.refresh();
        this.alert('error', 'Error', err.error.message);
        this.loading = false;
      },
    });
  }

  remove(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este registro?'
    ).then(answ => {
      if (answ.isConfirmed) {
        this.statusInvoiceService.remove(data.id).subscribe({
          next: () => {
            this.alert(
              'success',
              'Estatus Facturación',
              'Eliminado Correctamente'
            );
            this.getData();
          },
          error: err => {
            if (err.status == 500) {
              if (
                err.error.message.includes('violates foreign key constraint')
              ) {
                this.alert(
                  'error',
                  'Error',
                  'Debe eliminar las relaciones de este estatus'
                );
                return;
              }
            }
            this.alert('error', 'Error', err.error.message);
          },
        });
      }
    });
  }
}
