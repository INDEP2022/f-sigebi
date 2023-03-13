import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  CURRENT_REGIONAL_OFFICE_COLUMNS,
  SCHEDULE_MANINTENANCE_COLUMNS,
  STATUS_COLUMNS,
} from './schedule-maintenance-columns';

@Component({
  selector: 'app-schedule-maintenance',
  templateUrl: './schedule-maintenance.component.html',
  styles: [],
})
export class ScheduleMaintenanceComponent extends BasePage implements OnInit {
  maintenanceForm: FormGroup;
  tariffFractionForm: FormGroup;
  requestForm: FormGroup;
  statusForm: FormGroup;

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  settings2 = { ...this.settings, actions: false };
  settings3 = { ...this.settings, actions: false };

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: SCHEDULE_MANINTENANCE_COLUMNS,
    };
    this.settings2.columns = CURRENT_REGIONAL_OFFICE_COLUMNS;
    this.settings3.columns = STATUS_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  private prepareForm() {
    this.maintenanceForm = this.fb.group({
      noManagement: [null, Validators.required],
      description: [null, Validators.required],
      rationaleChange: [null, Validators.required],
      reception: [null, Validators.required],
      scheduleDelivery: [null, Validators.required],
      startDate: [null, Validators.required],
      startEnd: [null, Validators.required],
    });
    this.tariffFractionForm = this.fb.group({
      newTariffFraction: [null, Validators.required],
      rationaleChange: [null, Validators.required],
    });
    this.requestForm = this.fb.group({
      request: [null, Validators.required],
      newRegionalOffice: [null, Validators.required],
      rationaleChange: [null, Validators.required],
    });
    this.statusForm = this.fb.group({
      request: [null, Validators.required],
      statusNew: [null, Validators.required],
      rationaleChange: [null, Validators.required],
    });
  }
}
