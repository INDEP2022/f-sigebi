import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { LIST_ASSETS_COLUMNS } from './list-assets-columns';

@Component({
  selector: 'app-approval-assets-tabs',
  templateUrl: './approval-assets-tabs.component.html',
  styles: [],
})
export class ApprovalAssetsTabsComponent extends BasePage implements OnInit {
  @Input() dataObject: string;
  @Input() process: string;
  //bsModalRef: BsModalRef;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: LIST_ASSETS_COLUMNS,
    };

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  getData(): void {}

  selectRow(event: any): void {
    console.log(event);
  }
}
