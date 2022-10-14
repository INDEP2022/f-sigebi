import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { COLUMNS1, COLUMNS2 } from './columns';

@Component({
  selector: 'app-c-b-ecl-c-expense-concepts-list',
  templateUrl: './c-b-ecl-c-expense-concepts-list.component.html',
  styles: [],
})
export class CBEclCExpenseConceptsListComponent
  extends BasePage
  implements OnInit
{
  data: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  settings2 = {
    ...this.settings,
    actions: false,
  };
  data2: any[] = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  constructor(private modalRef: BsModalRef) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...COLUMNS1 },
    };

    this.settings2.columns = COLUMNS2;
  }

  ngOnInit(): void {}

  close() {
    this.modalRef.hide();
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  settingsChange2($event: any): void {
    this.settings2 = $event;
  }
}
