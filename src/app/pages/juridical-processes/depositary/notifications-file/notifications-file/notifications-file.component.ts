/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */
import { LocalDataSource } from 'ng2-smart-table';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { NotificationsFileService } from './services/notifications-file.service';
import { NOTIFICATIONS_FILE_LOAD_COLUMNS } from './utils/notifications-file.columns';
//Rxjs
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ERROR_AREA_DESTINO_DATA,
  ERROR_ASUNTO_DATA,
  EXPEDIENTE_EMPTY_DATA,
  EXPEDIENTE_ERROR_DATA,
  EXPEDIENTE_INCORRECTO_TEXT,
  EXPEDIENTE_INCORRECTO_TITLE,
  EXPEDIENTE_NOTIFICACIONES_ERROR_DATA,
} from './utils/notifications-file.message';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-notifications-file',
  templateUrl: './notifications-file.component.html',
  styleUrls: ['./notifications-file.component.scss'],
})
export class NotificationsFileComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  dataTable: LocalDataSource = new LocalDataSource();
  public form: FormGroup;
  fileNumber: number = null;
  fileNumberParam: number = null;
  origin: string = null;
  notificationByExpedient = new BehaviorSubject<ListParams>(new ListParams());
  totalData: number = 0;
  loadingTableData: boolean = false;

  constructor(
    private fb: FormBuilder,
    private notificationsFileService: NotificationsFileService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.fileNumberParam = null;
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        // this.fileNumberParam = params['no_expediente']
        //   ? Number(params['no_expediente'])
        //   : null;
        this.origin = params['origin'] ?? null;
      });
    this.setSettingsTable();
    this.prepareForm();
    let param = this.activatedRoute.snapshot.paramMap.get('id');
    if (param) {
      this.fileNumber = Number(param);
      this.form.get('fileNumber').setValue(this.fileNumber);
      this.form.updateValueAndValidity();
      this.fileNumberParam = this.fileNumber;
      this.form.get('fileNumber').markAsTouched();
      this.btnGetNotificationsByExpedient();
    }
  }

  private prepareForm() {
    this.form = this.fb.group({
      fileNumber: [
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(11),
        ],
      ],
      criminalCase: [
        { value: '', disabled: true },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      preliminaryInquiry: [
        { value: '', disabled: true },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
    });
  }

  setDataExpedient(criminalCase: string = '', preliminaryInquiry: string = '') {
    this.form.get('criminalCase').setValue(criminalCase);
    this.form.get('preliminaryInquiry').setValue(preliminaryInquiry);
    this.form.updateValueAndValidity();
  }

  setSettingsTable() {
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
      },
      hideSubHeader: true, //oculta subheaader de filtro
      columns: NOTIFICATIONS_FILE_LOAD_COLUMNS,
    };
  }

  setPaginationRefresh() {
    this.notificationByExpedient
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDataExpedientByFileNumber());
  }

  setDataTable(dataTable: any[] = []) {
    this.dataTable.load(dataTable);
    this.dataTable.refresh();
    this.loadingTableData = false;
  }

  btnGetNotificationsByExpedient() {
    this.setDataExpedient();
    this.setDataTable(); // Set data in table
    if (this.form.get('fileNumber').valid) {
      this.loading = true;
      this.fileNumber = this.form.get('fileNumber').value; // Setear expediente del input
      this.getDataExpedientByIdentificator();
    } else {
      this.alertInfo(
        'warning',
        EXPEDIENTE_INCORRECTO_TITLE,
        EXPEDIENTE_INCORRECTO_TEXT
      );
    }
  }

  async getDataExpedientByIdentificator() {
    await this.notificationsFileService
      .getExpedientByIdentificator(this.fileNumber)
      .subscribe({
        next: res => {
          this.setDataExpedient(res.criminalCase, res.preliminaryInquiry); // Set data expediente
          this.setSettingsTable();
          this.setPaginationRefresh();
        },
        error: err => {
          this.loading = false;
          this.alertInfo(
            'warning',
            EXPEDIENTE_ERROR_DATA(this.fileNumber),
            EXPEDIENTE_EMPTY_DATA
          );
        },
      });
  }

  async getDataExpedientByFileNumber() {
    this.loadingTableData = true;
    this.totalData = 0;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('expedientNumber', this.fileNumber);
    params.limit = this.notificationByExpedient.value.limit;
    params.page = this.notificationByExpedient.value.page;
    if (params.search) {
      delete params.search;
    }
    await this.notificationsFileService
      .getNotificationByFileNumber(params.getParams())
      .subscribe({
        next: res => {
          this.loading = false;
          res.data.map((i: any) => {
            // Área destino
            i['departmentDescription'] = i.departamentDestinyNumber
              ? '#' +
                i.departamentDestinyNumber +
                '---' +
                (i.departament
                  ? i.departament.description
                  : ERROR_AREA_DESTINO_DATA(i.departamentDestinyNumber))
              : ERROR_AREA_DESTINO_DATA(i.departamentDestinyNumber);
            // Asunto
            i['affairDescription'] = i.affairKey
              ? '#' +
                i.affairKey +
                '---' +
                (i.affair
                  ? i.affair.description
                  : ERROR_ASUNTO_DATA(i.affairKey))
              : ERROR_ASUNTO_DATA(i.affairKey);
            return i;
          });
          this.totalData = res.count;
          this.setDataTable(res.data); // Set data in table
        },
        error: err => {
          this.loading = false;
          this.setDataTable(); // Set data in table
          this.alertInfo(
            'warning',
            EXPEDIENTE_NOTIFICACIONES_ERROR_DATA(this.fileNumber),
            ''
          );
        },
      });
  }

  goBack() {
    if (this.origin == 'FACTJURBIENESXAMP') {
      this.router.navigate([
        '/pages/juridical/depositary/assignment-protected-assets/' +
          this.fileNumberParam,
      ]);
    }
  }
}
