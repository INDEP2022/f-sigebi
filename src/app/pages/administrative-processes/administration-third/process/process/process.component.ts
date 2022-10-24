import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { PROCESS_COLUMNS } from './process-columns';

@Component({
  selector: 'app-process',
  templateUrl: './process.component.html',
  styles: [],
})
export class ProcessComponent extends BasePage implements OnInit {
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: PROCESS_COLUMNS,
    };
  }

  ngOnInit(): void {}
}
