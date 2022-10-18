import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

import { EVENTO_ERROR_COLUMNS } from './numeraire-conversion-error-columns';

@Component({
  selector: 'app-c-b-ge-can-c-numeraire-conversion-error',
  templateUrl: './c-b-ge-can-c-numeraire-conversion-error.component.html',
  styles: [],
})
export class CBGeCanCNumeraireConversionErrorComponent
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
