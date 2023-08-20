import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
import { BasePage } from 'src/app/core/shared';
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

const ALLOWED_EXTENSIONS = ['txt'];

@Component({
  selector: 'record-notification-filter',
  templateUrl: './record-notification-filter.component.html',
  styles: [],
})
export class RecordNotificationFilterComponent
  extends BasePage
  implements OnInit
{
  @Output() onSubmit = new EventEmitter<any>();
  @Input() form: FormGroup<GoodTrackerForm>;
  @Input() subloading: boolean = false;
  @Output() subloadingChange = new EventEmitter<boolean>();
  courts = new DefaultSelect();
  publicMins = new DefaultSelect();
  @Output() cleanFilters = new EventEmitter<void>();
  @ViewChild('goodNumbersInput', { static: true })
  goodNumbersInput: ElementRef<HTMLInputElement>;
  goodNumbersControl = new FormControl(null);
  constructor(
    private courtService: CourtService,
    private minPubService: MinPubService,
    private notificationService: NotificationService,
    private expedientService: ExpedientService
  ) {
    super();
  }

  ngOnInit(): void {}

  goodNumbersFileChange(event: Event) {
    if (!this.isValidFile(event)) {
      this.goodNumbersControl.reset();
      return;
    }
    const file = this.getFileFromEvent(event);
    const fileReader = new FileReader();
    fileReader.onload = e => {
      this.readTxt(e.target.result);
    };
    this.goodNumbersControl.reset();
    fileReader.readAsText(file);
  }

  readTxt(txt: string | ArrayBuffer) {
    if (typeof txt != 'string') {
      this.alert('error', 'Error', 'Archivo Inválido');
      return;
    }
    const goodNumbersArrPlain = txt.split(',');

    const goodNumbers = goodNumbersArrPlain
      .map(goodNum => Number(goodNum.trim()))
      .filter(goodNum => goodNum > 0)
      .map(goodNum => `${goodNum}`);
    if (!goodNumbers.length) {
      this.alert(
        'error',
        'Error',
        'El Archivo esta vació o tiene elementos inválidos'
      );
      return;
    }

    this.form.get('expedientNum').setValue(goodNumbers);
  }

  private getFileFromEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files[0];
    const filename = file.name;
    return file;
  }

  isValidFile(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files.length) {
      return false;
    }
    if (target.files.length > 1) {
      this.alert('error', 'Error', 'Solo puede seleccionar un Archivo');
      return false;
    }
    const file = target.files[0];
    const filename = file.name;
    const extension = filename.split('.').at(-1);
    if (!extension) {
      this.alert('error', 'Error', 'Archivo Inválido');
      return false;
    }
    if (!ALLOWED_EXTENSIONS.includes(extension.toLowerCase())) {
      this.alert('error', 'Error', 'Archivo Inválido');
      return false;
    }
    return true;
  }

  changeSubloading(value: boolean) {
    this.subloading = value;
    this.subloadingChange.emit(this.subloading);
  }

  search() {
    this.onSubmit.emit(this.form.value);
  }

  getMinPubs(params: ListParams) {
    const _params = new FilterParams();
    _params.page = params.page;
    _params.limit = params.limit;
    const search = params?.text ?? '';
    if (Number(search)) {
      _params.addFilter('id', search);
    } else {
      _params.addFilter('description', search, SearchFilter.ILIKE);
    }
    this.changeSubloading(true);
    this.minPubService.getAllWithFilters(_params.getParams()).subscribe({
      next: res => {
        this.changeSubloading(false);
        this.publicMins = new DefaultSelect(res.data, res.count);
      },
      error: () => {
        this.changeSubloading(false);
        this.publicMins = new DefaultSelect([], 0);
      },
    });
  }

  getCourts(params: ListParams) {
    const search = params?.text ?? '';
    if (Number(search)) {
      params['filter.id'] = search;
    } else {
      params['filter.description'] = '$ilike:' + search;
    }
    params.text = '';
    params['search'] = '';
    this.changeSubloading(true);
    this.courtService.getAll(params).subscribe({
      next: res => {
        this.changeSubloading(false);
        this.courts = new DefaultSelect(res.data, res.count);
      },
      error: () => {
        this.changeSubloading(false);
        this.courts = new DefaultSelect([], 0);
      },
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
