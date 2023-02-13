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
  courts = new DefaultSelect();
  publicMins = new DefaultSelect();
  constructor(
    private courtService: CourtService,
    private minPubService: MinPubService,
    private notificationService: NotificationService,
    private expedientService: ExpedientService
  ) {}

  ngOnInit(): void {}

  search() {
    this.onSubmit.emit(this.form.value);
  }

  getMinPubs(params: ListParams) {
    this.minPubService.getAll(params).subscribe({
      next: res => (this.publicMins = new DefaultSelect(res.data, res.count)),
    });
  }

  getCourts(params: ListParams) {
    this.courtService.getAll(params).subscribe({
      next: res => (this.courts = new DefaultSelect(res.data, res.count)),
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

  flyerChange() {
    FLYER.length = 0;
    const flyer = this.form.controls.flyerNum.value.join(',');
    this.getNotifications('wheelNumber', flyer, SearchFilter.IN).subscribe({
      next: data => FLYER.push(...data),
    });
  }

  courtChange() {
    COURTS.length = 0;
    const court = this.form.controls.judgeNum.value;
    this.getExpedients('id', court, SearchFilter.EQ).subscribe({
      next: res => COURTS.push(...res),
    });
  }

  flyerTypeChange() {
    FLYER_TYPE.length = 0;
    const flyer = this.form.controls.flyerType.value;
    this.getNotifications('wheelType', flyer, SearchFilter.EQ).subscribe({
      next: data => FLYER_TYPE.push(...data),
    });
  }

  fecChange() {
    console.log('entra');
    EXTERNAL_OFFICE_DATE.length = 0;
    const date = this.form.controls.officeDate.value;
    this.getNotifications(
      'externalOfficeDate',
      date,
      SearchFilter.EQ
    ).subscribe({
      next: data => EXTERNAL_OFFICE_DATE.push(...data),
    });
  }

  protectionChange() {
    PROTECTIONS.length = 0;
    const protection = this.form.controls.protection.value;
    this.getExpedients(
      'protectionKey',
      protection,
      SearchFilter.ILIKE
    ).subscribe({
      next: data => PROTECTIONS.push(...data),
    });
  }

  minpubChange() {
    MINPUBS.length = 0;
    const minpub = this.form.controls.publicMin.value;
    this.getNotifications('minpubNumber', minpub, SearchFilter.EQ).subscribe({
      next: data => MINPUBS.push(...data),
    });
  }

  externalOfficeChange() {
    EXTERNAL_OFFICE.length = 0;
    const office = this.form.controls.extOfficeNum.value;
    this.getNotifications(
      'officeExternalKey',
      office,
      SearchFilter.ILIKE
    ).subscribe({
      next: data => EXTERNAL_OFFICE.push(...data),
    });
  }

  criminalCaseChange() {
    CRIMINAL_CASE.length = 0;
    const cc = this.form.controls.criminalCase.value;
    this.getNotifications('criminalCase', cc, SearchFilter.ILIKE).subscribe({
      next: data => EXTERNAL_OFFICE.push(...data),
    });
  }
}
