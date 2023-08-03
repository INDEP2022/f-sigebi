import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-list-reference',
  templateUrl: './list-reference.component.html',
  styles: [],
})
export class ListReferenceComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      // columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {}

  rowsSelected(event: any) {}
}
