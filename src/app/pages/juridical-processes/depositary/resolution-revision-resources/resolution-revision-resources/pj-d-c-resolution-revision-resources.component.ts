/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-pj-d-c-resolution-revision-resources',
  templateUrl: './pj-d-c-resolution-revision-resources.component.html',
  styleUrls: ['./pj-d-c-resolution-revision-resources.component.scss'],
})
export class PJDResolutionRevisionResourcesComponent
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
