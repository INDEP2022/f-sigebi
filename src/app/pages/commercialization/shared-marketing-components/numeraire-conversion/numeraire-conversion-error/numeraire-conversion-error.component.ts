import { Component, OnInit } from '@angular/core';

import { IncosConvNumeraryService } from 'src/app/core/services/ms-conv-numerary/incos-conv-numerary.service';
import { BasePageWidhtDinamicFiltersExtra } from 'src/app/core/shared/base-page-dinamic-filters-extra';
import { EVENTO_ERROR_COLUMNS } from './numeraire-conversion-error-columns';

@Component({
  selector: 'app-numeraire-conversion-error',
  templateUrl: './numeraire-conversion-error.component.html',
  styles: [],
})
export class NumeraireConversionErrorComponent
  extends BasePageWidhtDinamicFiltersExtra
  implements OnInit
{
  constructor(private dataService: IncosConvNumeraryService) {
    super();
    this.service = this.dataService;
    this.ilikeFilters = ['inconsistency'];
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...EVENTO_ERROR_COLUMNS },
    };
  }

  override getField(filter: any) {
    console.log(filter);
    return filter.field === 'lotePublico'
      ? `filter.lots.lotPublic`
      : `filter.${filter.field}`;
  }
}
