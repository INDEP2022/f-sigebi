import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { CourtService } from 'src/app/core/services/catalogs/court.service';
import { MinPubService } from 'src/app/core/services/catalogs/minpub.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  COURTS,
  CRIMINAL_CASE,
  EXTERNAL_OFFICE,
  EXTERNAL_OFFICE_DATE,
  FLYER,
  FLYER_TYPE,
  MINPUBS,
  PROTECTIONS,
} from '../../utils/constants/filter-match';
import { GoodTrackerForm } from '../../utils/goods-tracker-form';

@Component({
  selector: 'record-notification-filter',
  templateUrl: './record-notification-filter.component.html',
  styles: [],
})
export class RecordNotificationFilterComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<any>();
  @Input() form: FormGroup<GoodTrackerForm>;
  @Input() subloading: boolean = false;
  @Output() subloadingChange = new EventEmitter<boolean>();
  courts = new DefaultSelect();
  publicMins = new DefaultSelect();
  constructor(
    private courtService: CourtService,
    private minPubService: MinPubService,
    private notificationService: NotificationService,
    private expedientService: ExpedientService
  ) {}

  ngOnInit(): void {}

  changeSubloading(value: boolean) {
    this.subloading = value;
    this.subloadingChange.emit(this.subloading);
  }

  search() {
    this.onSubmit.emit(this.form.value);
  }

  getMinPubs(params: ListParams) {
    this.changeSubloading(true);
    this.minPubService.getAll(params).subscribe({
      next: res => {
        this.changeSubloading(false);
        this.publicMins = new DefaultSelect(res.data, res.count);
      },
      error: () => this.changeSubloading(false),
    });
  }

  getCourts(params: ListParams) {
    this.changeSubloading(true);
    this.courtService.getAll(params).subscribe({
      next: res => {
        this.changeSubloading(false);
        this.courts = new DefaultSelect(res.data, res.count);
      },
      error: () => this.changeSubloading(false),
    });
  }

  getNotifications(field: string, value: string, operator: SearchFilter) {
    const params = new FilterParams();
    params.limit = 1000;
    params.addFilter(field, value, operator);
    return this.notificationService
      .getAllFilter(params.getParams())
      .pipe(map(res => res?.data?.map(n => n?.expedientNumber) ?? []));
  }

  getExpedients(field: string, value: string, operator: SearchFilter) {
    const params = new FilterParams();
    params.limit = 1000;
    params.addFilter(field, value, operator);
    return this.expedientService
      .getAllFilter(params.getParams())
      .pipe(map(res => res?.data?.map(n => n?.id) ?? []));
  }

  flyerChange(flyers: string[]) {
    if (flyers.length == 0) {
      return;
    }
    FLYER.length = 0;
    const flyer = this.form.controls.flyerNum.value.join(',');
    this.changeSubloading(true);
    this.getNotifications('wheelNumber', flyer, SearchFilter.IN).subscribe({
      next: data => {
        this.changeSubloading(false);
        FLYER.push(...data);
      },
      error: () => this.changeSubloading(false),
    });
  }

  courtChange(courts: string[]) {
    if (courts.length == 0) {
      return;
    }
    COURTS.length = 0;
    const court = this.form.controls.judgeNum.value;
    this.changeSubloading(true);
    this.getExpedients('id', court, SearchFilter.EQ).subscribe({
      next: res => {
        this.changeSubloading(false);
        COURTS.push(...res);
      },
      error: () => this.changeSubloading(false),
    });
  }

  flyerTypeChange() {
    FLYER_TYPE.length = 0;
    const flyer = this.form.controls.flyerType.value;
    if (!flyer) {
      return;
    }
    this.changeSubloading(true);
    this.getNotifications('wheelType', flyer, SearchFilter.EQ).subscribe({
      next: data => {
        this.changeSubloading(false);
        FLYER_TYPE.push(...data);
      },
      error: () => this.changeSubloading(false),
    });
  }

  fecChange() {
    EXTERNAL_OFFICE_DATE.length = 0;
    const date = this.form.controls.officeDate.value;
    if (!date) {
      return;
    }
    this.changeSubloading(true);
    this.getNotifications(
      'externalOfficeDate',
      date,
      SearchFilter.EQ
    ).subscribe({
      next: data => {
        this.changeSubloading(false);
        EXTERNAL_OFFICE_DATE.push(...data);
      },
      error: () => this.changeSubloading(false),
    });
  }

  protectionChange() {
    PROTECTIONS.length = 0;
    const protection = this.form.controls.protection.value;
    if (!protection) {
      return;
    }
    this.changeSubloading(true);
    this.getExpedients(
      'protectionKey',
      protection,
      SearchFilter.ILIKE
    ).subscribe({
      next: data => {
        this.changeSubloading(false);
        PROTECTIONS.push(...data);
      },
      error: () => this.changeSubloading(false),
    });
  }

  minpubChange() {
    MINPUBS.length = 0;
    const minpub = this.form.controls.publicMin.value;
    if (!minpub) {
      return;
    }
    this.changeSubloading(false);
    this.getNotifications('minpubNumber', minpub, SearchFilter.EQ).subscribe({
      next: data => {
        this.changeSubloading(false);
        MINPUBS.push(...data);
      },
      error: () => this.changeSubloading(false),
    });
  }

  externalOfficeChange() {
    EXTERNAL_OFFICE.length = 0;
    const office = this.form.controls.extOfficeNum.value;
    if (!office) {
      return;
    }
    this.changeSubloading(true);
    this.getNotifications(
      'officeExternalKey',
      office,
      SearchFilter.ILIKE
    ).subscribe({
      next: data => {
        this.changeSubloading(false);
        EXTERNAL_OFFICE.push(...data);
      },
      error: () => this.changeSubloading(false),
    });
  }

  criminalCaseChange() {
    CRIMINAL_CASE.length = 0;
    const cc = this.form.controls.criminalCase.value;
    if (!cc) {
      return;
    }
    this.changeSubloading(true);
    this.getNotifications('criminalCase', cc, SearchFilter.ILIKE).subscribe({
      next: data => {
        this.changeSubloading(false);
        EXTERNAL_OFFICE.push(...data);
      },
      error: () => this.changeSubloading(false),
    });
  }
}
