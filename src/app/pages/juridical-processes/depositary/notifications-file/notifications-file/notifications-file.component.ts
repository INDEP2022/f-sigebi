/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { NOTIFICATIONS_FILE_LOAD_COLUMNS } from './notifications-file.columns';
import { NotificationsFileService } from './services/notifications-file.service';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

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
  tableSettings = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa
    columns: {},
  };
  // Data table
  dataTable = [
    {
      noVolante: 'DATA',
      fechaCaptura: 'DATA',
      fechaRecepcion: 'DATA',
      noOficio: 'DATA',
      asunto: 'DATA',
      observaciones: 'DATA',
      cveAmparo: 'DATA',
      areaDestino: 'DATA',
    },
  ];
  public form: FormGroup;
  fileNumber: number = null;

  constructor(
    private fb: FormBuilder,
    private notificationsFileService: NotificationsFileService
  ) {
    super();
    this.tableSettings = {
      ...this.tableSettings,
      columns: NOTIFICATIONS_FILE_LOAD_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
  }

  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: [
        '',
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(11),
        ],
      ],
      causaPenal: [
        [{ value: '', disabled: true }],
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
      averiguacionPrevia: [
        [{ value: '', disabled: true }],
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(40)],
      ],
    });
  }

  btnGetNotificationsByExpedient() {
    console.log('GetNotificationsByExpedient');
    if (this.form.get('noExpediente').valid) {
      this.fileNumber = this.form.get('noExpediente').value; // Setear expediente del input
      this.getDataExpedientByFileNumber();
    } else {
      this.alertInfo(
        'warning',
        'Número de Expediente Incorrecto',
        'Es necesario ingresar un número de Expediente para consultar.'
      );
    }
  }
  async getDataExpedientByFileNumber() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('expedientNumber', this.fileNumber);
    await this.notificationsFileService
      .getNotificationByFileNumber(params.getParams())
      .subscribe({
        next: res => {
          console.log(res);
          this.form.get('noExpediente');
        },
        error: err => {
          console.log(err);
          this.alertQuestion(
            'warning',
            'Número de Expediente',
            'El número de expediente "' + this.fileNumber + '" NO existe.'
          );
        },
      });
  }
}
