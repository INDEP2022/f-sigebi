import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { SURVEILLANCE_LOG_COLUMNS } from './surveillance-log-columns';

@Component({
  selector: 'app-surveillance-log',
  templateUrl: './surveillance-log.component.html',
  styles: [],
})
export class SurveillanceLogComponent extends BasePage implements OnInit {
  surveillance: any[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor() {
    super();
    this.settings.columns = SURVEILLANCE_LOG_COLUMNS;
    this.settings.actions.delete = true;
  }

  ngOnInit(): void {}
}
