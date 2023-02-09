import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components

//Provisional Data
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import {
  ICreateConfirmEvent,
  IDeleteConfirmEvent,
  IEditConfirmEvent,
} from '../../../../../core/interfaces/ng2-smart-table.interface';
import { IComerSaleStatus } from '../../../../../core/models/ms-event/sale-status.model';
import { ComerSaleStatusService } from '../../../../../core/services/ms-event/comer-sale-status.service';

@Component({
  selector: 'app-sale-status',
  templateUrl: './sale-status.component.html',
  styles: [],
})
export class SaleStatusComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  saleStatusD: IComerSaleStatus[];

  totalItems: number = 0;
  params = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;

  rowSelected: boolean = false;
  selectedRow: IComerSaleStatus | null = null;

  //Columns
  columns = COLUMNS;

  constructor(
    private modalService: BsModalService,
    private saleStatusService: ComerSaleStatusService
  ) {
    super();
    this.searchFilter = { field: 'description' };
    this.settings = {
      ...this.settings,
      actions: {
        ...this.settings.actions,
        add: true,
        edit: true,
        delete: true,
      },
      edit: {
        ...this.settings.edit,
        saveButtonContent: '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmSave: true,
      },
      add: {
        addButtonContent: '<i class="fa fa-solid fa-plus mx-2"></i>',
        createButtonContent:
          '<i class="bx bxs-save me-1 text-success mx-2"></i>',
        cancelButtonContent:
          '<i class="bx bxs-x-square me-1 text-danger mx-2"></i>',
        confirmCreate: true,
      },
      mode: 'inline',
      hideSubHeader: false,
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      this.getData();
    });
    // this.data.load(this.saleStatusD);
  }

  getData(): void {
    this.loading = true;
    this.saleStatusService
      .getAllWithFilters(this.params.getValue().getParams())
      .subscribe({
        next: response => {
          this.saleStatusD = response.data;
          this.totalItems = response.count;
          this.data.load(this.saleStatusD);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          console.log(error);
        },
      });
  }

  onSaveConfirm(event: IEditConfirmEvent<IComerSaleStatus>) {
    this.loading = true;
    this.saleStatusService.update(event.newData.id, event.newData).subscribe({
      next: response => {
        event.confirm.resolve();
        this.loading = false;
        this.onLoadToast('success', 'Elemento Actualizado', '');
      },
      error: () => {
        event.confirm.reject();
        this.loading = false;
        this.onLoadToast('error', 'Error al conectar con el servidor', '');
      },
    });
  }

  onAddConfirm(event: ICreateConfirmEvent<IComerSaleStatus>): void {
    this.loading = true;
    this.saleStatusService.checkExistingId(event.newData.id).subscribe({
      next: response => {
        console.log(response);
        if (response) {
          this.loading = false;
          this.onLoadToast(
            'error',
            'Estatus No Válido',
            'El estatus ingresado ya existe'
          );
          event.confirm.reject();
        } else {
          this.saleStatusService.create(event.newData).subscribe({
            next: response => {
              event.confirm.resolve();
              this.getData();
              this.loading = false;
              this.onLoadToast('success', 'Elemento Creado', '');
            },
            error: () => {
              event.confirm.reject();
              this.loading = false;
              this.onLoadToast(
                'error',
                'Error al conectar con el servidor',
                ''
              );
            },
          });
        }
      },
    });
  }

  onDeleteConfirm(event: IDeleteConfirmEvent<IComerSaleStatus>): void {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.loading = true;
        this.saleStatusService.remove(event.data.id).subscribe({
          next: response => {
            event.confirm.resolve();
            this.getData();
            this.loading = false;
            this.onLoadToast('success', 'Elemento Eliminado', '');
          },
          error: () => {
            event.confirm.reject();
            this.loading = false;
            this.onLoadToast('error', 'Error al conectar con el servidor', '');
          },
        });
      }
    });
  }

  selectRow(row: IComerSaleStatus): void {
    this.selectedRow = row;
    this.rowSelected = true;
  }
}
