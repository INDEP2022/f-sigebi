import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { MEASUREMENTUNITS_COLUMNS } from './measurement-units-columns';

@Component({
  selector: 'app-measurement-units',
  templateUrl: './measurement-units.component.html',
  styles: [],
})
export class MeasurementUnitsComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: MEASUREMENTUNITS_COLUMNS,
    };
  }
  ngOnInit(): void {}
}
