import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ParameterInvoiceService } from 'src/app/core/services/ms-parameterinvoice/parameterinvoice.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RebillingCausesModalComponent } from '../rebilling-causes-modal/rebilling-causes-modal.component';
import { REBILLING_CAUSES_COLUMNS } from './rebilling-causes-columns';

@Component({
  selector: 'app-rebilling-causes',
  templateUrl: './rebilling-causes.component.html',
  styles: [],
})
export class RebillingCausesComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  filter = new BehaviorSubject<FilterParams>(new FilterParams());
  data: any[] = [];
  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private modalService: BsModalService,
    private comerRebilService: ParameterInvoiceService
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
      columns: { ...REBILLING_CAUSES_COLUMNS },
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
              id: () => (searchFilter = SearchFilter.EQ),
              description: () => (searchFilter = SearchFilter.ILIKE),
              rebill: () => (searchFilter = SearchFilter.EQ),
              apply: () => (searchFilter = SearchFilter.EQ),
              comments: () => (searchFilter = SearchFilter.ILIKE),
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

  //Rellenar formulario con datos de la tabla
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
    this.modalService.show(RebillingCausesModalComponent, config);
  }

  getData() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.comerRebilService.getAll(params).subscribe({
      next: resp => {
        this.data = resp.data;
        this.totalItems = resp.count;
        this.dataFilter.load(resp.data);
        this.dataFilter.refresh();
        this.loading = false;
      },
      error: err => {
        this.data = [];
        this.totalItems = 0;
        this.dataFilter.load([]);
        this.dataFilter.refresh();
        this.loading = false;
        this.alert('error', 'Error', err.error.message);
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
        this.comerRebilService.remove(Number(data.id)).subscribe({
          next: () => {
            this.alert(
              'success',
              'Causa Refacturación',
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
                  'Debe eliminar las relaciones de este folio'
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
