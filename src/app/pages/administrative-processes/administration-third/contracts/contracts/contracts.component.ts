import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { CONTRACTS_COLUMNS } from './contracts-columns';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styles: [
  ]
})
export class ContractsComponent extends BasePage implements OnInit {
  settings = { ...TABLE_SETTINGS, actions: false,selectMode: 'multi'};
  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  constructor()
  {
    super();
    this.settings.columns = CONTRACTS_COLUMNS;
  }

  ngOnInit(): void {
  }

}
