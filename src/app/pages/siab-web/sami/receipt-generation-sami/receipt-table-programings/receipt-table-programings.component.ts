import { Component, Input } from '@angular/core';
import { takeUntil } from 'rxjs';
import { ReceptionTicketsService } from 'src/app/core/services/reception/reception-tickets.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { EReceiptType } from '../models/eReceiptType';
import { ReceiptGenerationDataService } from '../services/receipt-generation-data.service';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-receipt-table-programings',
  templateUrl: './receipt-table-programings.component.html',
  styleUrls: ['./receipt-table-programings.component.scss'],
})
export class ReceiptTableProgramingsComponent extends BasePageWidhtDinamicFiltersExtra<any> {
  @Input() id_programacion: string;
  // pageSizeOptions = [5, 10, 20, 25];
  // limit: FormControl = new FormControl(5);
  constructor(
    private dataService: ReceiptGenerationDataService,
    private receptionTicketsService: ReceptionTicketsService
  ) {
    super();
    this.service = this.receptionTicketsService;
    // this.params.value.limit = 5;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        ...COLUMNS,
      },
      // rowClassFunction: (row: any) => {
      //   return row.data.notSelect ? 'notSelect' : '';
      // },
    };
    this.dataService.refreshTableProgrammings
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.getData();
          }
        },
      });
    this.dataService.refreshAll.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: response => {
        if (response) {
          this.getData();
        }
      },
    });
  }

  get typeReceiptSelected() {
    return this.dataService.typeReceiptSelected;
  }

  override extraOperationsGetData() {
    if (this.typeReceiptSelected === EReceiptType.Recibos) {
      this.dataService.recibos = this.totalItems;
    }
    if (this.typeReceiptSelected === EReceiptType.Resguardo) {
      this.dataService.resguardo = this.totalItems;
    }
    if (this.typeReceiptSelected === EReceiptType.Almacen) {
      this.dataService.resguardo = this.totalItems;
    }
  }

  override getParams() {
    // debugger;
    let newColumnFilters = this.columnFilters;
    if (this.id_programacion) {
      newColumnFilters['filter.id_programacion'] =
        '$eq:' + this.id_programacion;
    }
    if (this.typeReceiptSelected) {
      newColumnFilters['filter.tipo_recibo'] =
        '$eq:' + this.typeReceiptSelected;
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }
}
