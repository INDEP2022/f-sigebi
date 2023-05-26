import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ESTATE_COLUMNS_NOTIFY } from '../../acept-programming/columns/estate-columns';
import { USER_COLUMNS } from '../../acept-programming/columns/users-columns';
import { estates, users } from './schedule-notify-data';

@Component({
  selector: 'app-schedule-notify-form',
  templateUrl: './schedule-notify-form.component.html',
  styles: [],
})
export class ScheduleNotifyFormComponent extends BasePage implements OnInit {
  settingsUser = { ...this.settings, actions: false, columns: USER_COLUMNS };
  settingsState = {
    ...this.settings,
    columns: ESTATE_COLUMNS_NOTIFY,
    actions: { columnTitle: 'Detalle domicilio', position: 'right' },
    edit: {
      editButtonContent: '<i class="fa fa-file-alt text-success mx-2"></i>',
    },
  };

  users = users;
  estates = estates;
  idProgramming: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  totalItems: number = 0;
  programming: Iprogramming;
  constructor(
    private activatedRoute: ActivatedRoute,
    private programmingService: ProgrammingRequestService
  ) {
    super();
    this.idProgramming = Number(
      this.activatedRoute.snapshot.paramMap.get('id')
    );
  }

  ngOnInit(): void {
    this.getProgrammingData();
  }

  getProgrammingData() {
    this.programmingService
      .getProgrammingId(this.idProgramming)
      .subscribe(data => {
        console.log('programming', data);
        this.programming = data;
      });
  }
}
