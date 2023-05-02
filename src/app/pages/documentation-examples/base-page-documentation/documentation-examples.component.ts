import { Component, OnDestroy, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  templateUrl: './documentation-examples.component.html',
  styleUrls: ['./documentation-examples.component.scss'],
})
export class DocumentationExamplesComponent
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
