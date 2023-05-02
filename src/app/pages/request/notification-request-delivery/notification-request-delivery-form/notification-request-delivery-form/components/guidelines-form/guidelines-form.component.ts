import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { GUIDELINES_COLUMNS } from 'src/app/pages/request/shared-request/guidelines/guidelines-columns';

@Component({
  selector: 'app-guidelines-form',
  templateUrl: './guidelines-form.component.html',
  styles: [],
})
export class GuidelinesFormComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  guidelines: any[] = [];
  constructor() {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: GUIDELINES_COLUMNS,
    };
  }

  ngOnInit(): void {}
}
