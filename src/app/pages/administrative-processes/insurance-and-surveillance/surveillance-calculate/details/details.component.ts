import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DETAIL_COLUMNS } from './detail-columns';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styles: [],
})
export class DetailsComponent extends BasePage implements OnInit {
  details: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor() {
    super();
    this.settings.columns = DETAIL_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {}
}
