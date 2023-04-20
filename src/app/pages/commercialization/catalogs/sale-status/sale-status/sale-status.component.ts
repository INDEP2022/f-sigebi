import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { COLUMNS } from './columns';
//Components

//Provisional Data
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
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
export class SaleStatusComponent
  extends BasePageWidhtDinamicFilters
  implements OnInit
{
  saleStatusD: IComerSaleStatus[];
  selectedRow: IComerSaleStatus | null = null;

  //Columns
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
      columns: COLUMNS,
    };
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
        if (event.data.id === this.selectedRow.id) {
          this.selectedRow = null;
        }
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
  }
}
