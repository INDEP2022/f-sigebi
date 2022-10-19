import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ESTATE_COLUMNS_NOTIFY } from '../../acept-programming/columns/estate-columns';
import { USER_COLUMNS } from '../../acept-programming/columns/users-columns';

@Component({
  selector: 'app-schedule-notify-form',
  templateUrl: './schedule-notify-form.component.html',
  styles: [],
})
export class ScheduleNotifyFormComponent extends BasePage implements OnInit {
  settingsUser = { ...TABLE_SETTINGS, actions: false };
  settingsState = { ...TABLE_SETTINGS };

  users: any[] = [];
  estates: any[] = [];

  params = new BehaviorSubject<ListParams>(new ListParams());

  totalItems: number = 0;

  constructor() {
    super();
    this.settingsUser.columns = USER_COLUMNS;
    this.settingsState.columns = ESTATE_COLUMNS_NOTIFY;
    this.settingsState.actions.columnTitle = 'Detalle domicilio';
    this.settingsState.edit.editButtonContent =
      '<i class="fa fa-file-alt text-success mx-2"></i>';

    this.estates = [
      {
        gestionNumber: '24234',
        uniqueKey: '43533',
        record: 'Expediente',
        description: 'Descripción',
        transerAmount: '34534',
        transerUnit: '53453',
      },
    ];

    this.users = [
      {
        user: 'Usuario',
        email: 'usuario@gmail.com',
        chargeUser: 'Usuario cargo',
      },
    ];
  }

  ngOnInit(): void {}
}
