import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

import { EVENTO_ERROR_COLUMNS } from './numeraire-conversion-error-columns';

@Component({
  selector: 'app-numeraire-conversion-error',
  templateUrl: './numeraire-conversion-error.component.html',
  styles: [],
})
export class NumeraireConversionErrorComponent
  extends BasePage
  implements OnInit
{
  list: any;

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...EVENTO_ERROR_COLUMNS },
    };
  }

  ngOnInit(): void {}
}
