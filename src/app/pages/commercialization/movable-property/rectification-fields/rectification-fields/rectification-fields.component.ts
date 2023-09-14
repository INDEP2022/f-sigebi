import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { RectifitationFieldsService } from 'src/app/core/services/ms-parameterinvoice/rectification-fields.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RectificationFieldsModalComponent } from '../rectification-fileds-modal/rectification-fields-modal.component';
import { RECTIFICATION_FIELDS_COLUMNS } from './rectification-fields-columns';

@Component({
  selector: 'app-rectification-fields',
  templateUrl: './rectification-fields.component.html',
  styles: [],
})
export class RectificationFieldsComponent extends BasePage implements OnInit {
  data: {
    columnId: string;
    invoiceFieldId: string;
    table: string;
  }[] = [];
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  totalItems: number = 0;
  dataFilter: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private rectificationFieldService: RectifitationFieldsService,
    private modalService: BsModalService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: true,
        delete: true,
      },
      columns: { ...RECTIFICATION_FIELDS_COLUMNS },
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

            if (filter.field == 'tabla') {
              field = `filter.table`;
            } else {
              field = `filter.${filter.field}`;
            }

            const search: any = {
              columnId: () => (searchFilter = SearchFilter.ILIKE),
              invoiceFieldId: () => (searchFilter = SearchFilter.ILIKE),
              tabla: () => (searchFilter = SearchFilter.ILIKE),
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

  getData() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };
    this.rectificationFieldService.getAll(params).subscribe({
      next: resp => {
        resp.data.map((fact: any) => {
          fact.tabla = fact.table;
        });
        this.data = resp.data;
        this.totalItems = resp.count;
        this.loading = false;
        this.dataFilter.load(resp.data);
        this.dataFilter.refresh();
      },
      error: err => {
        this.data = [];
        this.totalItems = 0;
        this.loading = false;
        this.dataFilter.load([]);
        this.dataFilter.refresh();
        this.alert('error', 'Error', err.error.message);
      },
    });
  }

  openForm(allotment?: any) {
    this.openModal(allotment);
  }

  openModal(context?: any) {
    let config: ModalOptions = {
      initialState: {
        allotment: context,
        callback: (next: boolean) => {
          if (next) {
            this.getData();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RectificationFieldsModalComponent, config);
  }

  remove(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este registro?'
    ).then(answ => {
      if (answ.isConfirmed) {
        this.rectificationFieldService.remove(data).subscribe({
          next: () => {
            this.alert(
              'success',
              'Campo Rectificación  de Facturación',
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
                  'Debe eliminar las relaciones de este campo'
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
