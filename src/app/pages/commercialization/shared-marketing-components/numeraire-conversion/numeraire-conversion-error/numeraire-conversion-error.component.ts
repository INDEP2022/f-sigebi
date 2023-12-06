import { Component, Input, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs';
import { IncosConvNumeraryService } from 'src/app/core/services/ms-conv-numerary/incos-conv-numerary.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { NumerarieService } from '../services/numerarie.service';
import { EVENTO_ERROR_COLUMNS } from './numeraire-conversion-error-columns';

@Component({
  selector: 'app-numeraire-conversion-error',
  templateUrl: './numeraire-conversion-error.component.html',
  styleUrls: ['./numeraire-conversion-error.component.scss'],
})
export class NumeraireConversionErrorComponent
  extends BasePageWidhtDinamicFiltersExtra
  implements OnInit
{
  @Input() address: string;
  constructor(
    private dataService: IncosConvNumeraryService,
    private numerarieService: NumerarieService
  ) {
    super();
    this.service = this.dataService;
    this.ilikeFilters = ['inconsistency'];
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...EVENTO_ERROR_COLUMNS },
    };
    this.numerarieService.selectedEventSubject
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.getData();
          }
        },
      });
  }

  override getField(filter: any) {
    console.log(filter);
    return filter.field === 'lotePublico'
      ? `filter.lots.lotPublic`
      : `filter.${filter.field}`;
  }

  get selectedEvent() {
    return this.numerarieService.selectedEvent;
  }

  override getParams() {
    let newColumnFilters: any = [];
    if (this.selectedEvent && this.selectedEvent.id) {
      newColumnFilters['filter.eventId'] = '$eq:' + this.selectedEvent.id;
    }
    if (this.address) {
      newColumnFilters['filter.event.addres'] = '$in:' + this.address + ',C';
    }

    return {
      ...this.params.getValue(),
      ...this.columnFilters,
      ...newColumnFilters,
    };
  }
}
