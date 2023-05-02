import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from '../../../../../common/repository/interfaces/list-params';
import { COMPLETE_PROPOSED_COLUMNS } from './complete-proposed-columns';
import { PROPOSED_COLUMNS } from './proposed_columns';

@Component({
  selector: 'app-modal-view',
  templateUrl: './modal-view.component.html',
  styles: [],
})
export class ModalViewComponent extends BasePage implements OnInit {
  op: number;
  data: any;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  constructor() {
    super();
    this.settings = { ...this.settings, actions: false };
  }

  ngOnInit(): void {
    if (this.op == 1) {
      this.settings.columns = PROPOSED_COLUMNS;
    } else {
      this.settings.columns = COMPLETE_PROPOSED_COLUMNS;
    }
  }

  settingsChange(event: any) {
    this.settings = event;
  }
}
