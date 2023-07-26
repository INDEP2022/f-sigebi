import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { ReceptionTicketsService } from 'src/app/core/services/reception/reception-tickets.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { ReceiptGenerationDataService } from '../services/receipt-generation-data.service';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-receipt-table-programings',
  templateUrl: './receipt-table-programings.component.html',
  styleUrls: ['./receipt-table-programings.component.scss'],
})
export class ReceiptTableProgramingsComponent extends BasePageWidhtDinamicFiltersExtra<any> {
  pageSizeOptions = [5, 10, 20, 25];
  limit: FormControl = new FormControl(5);
  constructor(
    private dataService: ReceiptGenerationDataService,
    private receptionTicketsService: ReceptionTicketsService
  ) {
    super();
    this.service = this.receptionTicketsService;
    this.params.value.limit = 5;
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
  }

  get folio() {
    return this.dataService.folio;
  }

  get typeReceiptSelected() {
    return this.dataService.typeReceiptSelected;
  }

  override getParams() {
    // debugger;
    let newColumnFilters = this.columnFilters;
    if (this.folio) {
      newColumnFilters['filter.folio'] = '$eq:' + this.folio;
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
