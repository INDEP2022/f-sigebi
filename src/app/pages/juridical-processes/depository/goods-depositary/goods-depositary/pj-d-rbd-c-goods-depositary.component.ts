/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-dj-c-juridical-ruling',
  templateUrl: './pj-dj-c-juridical-ruling.component.html',
  styleUrls: ['./pj-dj-c-juridical-ruling.component.scss'],
})
export class PJDJJuridicalRulingComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loading = true;
  }
}
