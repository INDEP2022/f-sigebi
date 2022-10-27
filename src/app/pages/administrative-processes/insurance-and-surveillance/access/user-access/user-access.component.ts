import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { USER_ACCESS_COLUMNS } from './user-access-columns';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styles: [],
})
export class UserAccessComponent extends BasePage implements OnInit {
  users: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: USER_ACCESS_COLUMNS,
    };
  }

  ngOnInit(): void {}
}
