import { Component, OnInit } from '@angular/core';
import { BasePage } from 'src/app/core/shared/base-page';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { IRequest } from 'src/app/core/models/catalogs/request.model';
import { EXPEDIENTS_REQUEST_COLUMNS } from './expedients-request-columns';

@Component({
  selector: 'app-expedients-request-tab',
  templateUrl: './expedients-request-tab.component.html',
  styles: [],
})
export class ExpedientsRequestTabComponent extends BasePage implements OnInit {
  title: string = 'Solicitudes del Expediente';
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  paragraphs: any[] = [];

  constructor() {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: EXPEDIENTS_REQUEST_COLUMNS,
    };
  }

  ngOnInit(): void {}
}
