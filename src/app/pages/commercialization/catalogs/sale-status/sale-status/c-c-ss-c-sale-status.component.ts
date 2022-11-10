import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Provisional Data
import { data } from './data';

@Component({
  selector: 'app-c-c-ss-c-sale-status',
  templateUrl: './c-c-ss-c-sale-status.component.html',
  styles: [],
})
export class CCSsCSaleStatusComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  eventTypesD = data;

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  rowSelected: boolean = false;
  selectedRow: any = null;

  //Columns
  columns = COLUMNS;

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      mode: '',
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.data.load(this.eventTypesD);
  }

  selectRow(row: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }
}
