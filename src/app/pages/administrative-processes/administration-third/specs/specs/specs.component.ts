import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SPECS_COLUMNS } from './specs-columns';

@Component({
  selector: 'app-specs',
  templateUrl: './specs.component.html',
  styles: [
  ]
})
export class SpecsComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor()
  {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: SPECS_COLUMNS,
    };
  }
  ngOnInit(): void {
  }

}
