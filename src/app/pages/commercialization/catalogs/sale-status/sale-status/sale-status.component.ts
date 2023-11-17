import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { IComerSaleStatus } from '../../../../../core/models/ms-event/sale-status.model';
import { ComerSaleStatusService } from '../../../../../core/services/ms-event/comer-sale-status.service';
import { SaleStatusFormComponent } from '../sale-status-form/sale-status-form.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-sale-status',
  templateUrl: './sale-status.component.html',
  styles: [],
})
export class SaleStatusComponent extends BasePage implements OnInit {
  saleStatusD: IComerSaleStatus[];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  selectedRow: IComerSaleStatus;

  constructor(
    private modalService: BsModalService,
    private saleStatusService: ComerSaleStatusService
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.add = false;
    this.settings.actions.edit = true;
    this.settings.actions.delete = true;
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
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
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
          this.getDeductives();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  selectRow(row: IComerSaleStatus): void {
    this.selectedRow = row;
  }

  getDeductives() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.saleStatusService.getAll(params).subscribe({
      next: response => {
        this.saleStatusD = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  openForm(saleStatus?: IComerSaleStatus) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      saleStatus,
      callback: (next: boolean) => {
        if (next) {
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getDeductives());
        }
      },
    };
    this.modalService.show(SaleStatusFormComponent, modalConfig);
  }

  onDeleteConfirm(data: any): void {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        this.saleStatusService.remove(data.id).subscribe({
          next: response => {
            this.getDeductives();
            this.loading = false;
            this.alert('success', 'El estatus ha sido eliminado', '');
          },
          error: () => {
            this.loading = false;
            this.alert('error', 'Error al conectar con el servidor', '');
          },
        });
      }
    });
  }
}

/*


import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import { IComerSaleStatus } from '../../../../../core/models/ms-event/sale-status.model';
import { ComerSaleStatusService } from '../../../../../core/services/ms-event/comer-sale-status.service';
import { SaleStatusFormComponent } from '../sale-status-form/sale-status-form.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-sale-status',
  templateUrl: './sale-status.component.html',
  styles: [],
})
export class SaleStatusComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  saleStatusD: IComerSaleStatus[];
  selectedRow: IComerSaleStatus | null = null;
  columns = COLUMNS;

  constructor(
    private modalService: BsModalService,
    private saleStatusService: ComerSaleStatusService
  ) {
    super();
    this.service = this.saleStatusService;
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: true,
        delete: true,
      },
      columns: COLUMNS,
    };
  }

  openForm(saleStatus?: any) {
    let config: ModalOptions = {
      initialState: {
        saleStatus,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(SaleStatusFormComponent, config);
  }

  onDeleteConfirm(data: any): void {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        this.saleStatusService.remove(data.id).subscribe({
          next: response => {
            this.getData();
            this.loading = false;
            this.alert('success', 'Elemento Eliminado', '');
          },
          error: () => {
            this.loading = false;
            this.alert('error', 'Error al Conectar con el Servidor', '');
          },
        });
      }
    });
  }

  selectRow(row: IComerSaleStatus): void {
    this.selectedRow = row;
  }
}
*/
