/** BASE IMPORT */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, debounceTime } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import {
  GOODS_COLUMNS,
  NOTIFICATIONS_COLUMNS,
} from './thirdparties-possession-validation-columns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-thirdparties-possession-validation',
  templateUrl: './thirdparties-possession-validation.component.html',
  styleUrls: ['./thirdparties-possession-validation.component.scss'],
})
export class ThirdpartiesPossessionValidationComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  dataTableNotifications: INotification[] = [];
  // Table settings
  params = new BehaviorSubject<FilterParams>(new FilterParams());

  tableSettingsNotificaciones = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: NOTIFICATIONS_COLUMNS,
  };

  // Table settings
  tableSettingsBienes = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: GOODS_COLUMNS,
  };
  // Data table
  dataTableBienes: IGood[] = [];

  // Table settings
  tableSettingsBienesOficio = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    mode: 'external', // ventana externa

    columns: {
      noBien: { title: 'No. Bien' },
      estatus: { title: 'Estatus' },
      descripcion: { title: 'Descripción' },
    },
  };
  // Data table
  dataTableBienesOficio = [
    {
      noBien: 'DATA',
      estatus: 'DATA',
      descripcion: 'DATA',
    },
  ];
  expedientNumber: number = 0;
  public form: FormGroup;
  public formCcpOficio: FormGroup;
  public noExpediente: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private goodService: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;

    this.noExpediente
      .get('noExpediente')
      .valueChanges.pipe(debounceTime(500))
      .subscribe(x => {
        if (x) this.getNotifications(new ListParams(), x);
      });
  }

  private prepareForm() {
    this.form = this.fb.group({
      noVolante: '',
      claveOficio: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
      destinatario: ['', [Validators.pattern(STRING_PATTERN)]], // Detalle destinatario
      texto: ['', [Validators.pattern(STRING_PATTERN)]],
    });
    this.noExpediente = this.fb.group({
      noExpediente: '',
    });
    this.formCcpOficio = this.fb.group({
      ccp1: ['', [Validators.pattern(STRING_PATTERN)]],
      ccp2: ['', [Validators.pattern(STRING_PATTERN)]],
      firma: ['', [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getNotifications(params: ListParams, numberExpedient?: number) {
    if (!numberExpedient) {
      this.dataTableNotifications = [];
    }

    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;

    if (numberExpedient) {
      data.addFilter('expedientNumber', numberExpedient);
    }

    this.notificationService.getAllFilter(data.getParams()).subscribe({
      next: data => {
        this.dataTableNotifications = data.data;
      },
      error: err => {
        this.loading = false;
      },
    });
    if (numberExpedient) this.getGoods(new ListParams(), numberExpedient);
  }

  getGoods(params: ListParams, numberExpedient?: number) {
    if (!numberExpedient) {
      this.dataTableBienes = [];
    }

    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;

    if (numberExpedient) {
      data.addFilter('fileNumber', numberExpedient);
    }

    this.goodService.getAllFilter(data.getParams()).subscribe({
      next: data => {
        this.dataTableBienes = data.data;
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  mostrarInfo(form: any): any {
    console.log(form.value);
  }

  mostrarInfoDepositario(formDepositario: any): any {
    console.log(formDepositario.value);
  }

  sendForm() {
    console.log('Send form log');
  }
  btnInsertarTextoPredefinido() {
    this.form.get('texto').setValue('Texto predifinido');
  }
  btnReemplazarMarcadores() {
    console.log('btnReemplazarMarcadores');
  }
  btnImprimir() {
    console.log('btnImprimir');
  }
}
