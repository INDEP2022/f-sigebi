import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { COLUMNS } from './columns';
//Components

//Provisional Data
import { BasePageWidhtDinamicFilters } from 'src/app/core/shared/base-page-dinamic-filters';
import { IComerSaleStatus } from '../../../../../core/models/ms-event/sale-status.model';
import { ComerSaleStatusService } from '../../../../../core/services/ms-event/comer-sale-status.service';
import { SaleStatusFormComponent } from '../sale-status-form/sale-status-form.component';

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
      'Desea eliminar este registro?'
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
            this.alert('error', 'Error al conectar con el servidor', '');
          },
        });
      }
    });
  }

  selectRow(row: IComerSaleStatus): void {
    this.selectedRow = row;
  }
}
