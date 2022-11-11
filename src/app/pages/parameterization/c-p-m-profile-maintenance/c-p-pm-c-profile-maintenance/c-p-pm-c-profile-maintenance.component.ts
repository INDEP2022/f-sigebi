import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS_PERFIL } from './columns';

@Component({
  selector: 'app-c-p-pm-c-profile-maintenance',
  templateUrl: './c-p-pm-c-profile-maintenance.component.html',
  styles: [],
})
export class CPPmCProfileMaintenanceComponent
  extends BasePage
  implements OnInit
{
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any[] = [];
  constructor() {
    super();
    this.settings.columns = COLUMNS_PERFIL;
    this.settings.columns = COLUMNS_PERFIL;
    this.settings.actions = false;
  }
  ngOnInit(): void {}
}
