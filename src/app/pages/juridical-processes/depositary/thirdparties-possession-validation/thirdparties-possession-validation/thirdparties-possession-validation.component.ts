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

const predifinedText =
  'En cumplimiento a la instrucción judicial derivada del juicio de amparo <A> por el cual se informa que se resolvió provisionalmente conceder al quejoso la restitución de la posesión  uso y disfrute  del(los) siguiente(s) mueble(s). Al respecto me permito señalar: <B> <C> Con fundamento en la fracción XIV del artículo 39 del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes y considerando la instrucción judicial deducida del juicio de garantías emitida por el Juez <DATOS DE JUZGADO>, por el cual se otorga la suspensión definitiva al quejoso <QUEJOSO> respecto del disfrute del inmueble de marras y, consecuentemente, la restitución de la posesión, en tal sentido y salvo que no exista aseguramiento anterior o posterior decretado por autoridad competente para ello, esa Delegación a su cargo deberá dar cabal cumplimiento a la suspensión definitiva, levantado para tal efecto el acta administrativa de entrega de posesión por virtud de suspensión provisional, afectando, consecuentemente, el SIAB bajo el estatus ¿PD3¿ ¿entrega en posesión a terceros por instrucción judicial¿. El cumplimiento señalado, deberá realizarlo a la brevedad e informar al Juez de Amparo sobre los actos tendientes a su cumplimiento. No omito señalar, que en el supuesto de que se resuelva el amparo en el cuaderno incidental y/o principal negando la protección de la justicia federal, se deberán llevar a cabo las acciones legales correspondientes para recuperar la posesión del inmueble asegurado. Finalmente, le informo que debe hacer del conocimiento de la autoridad que decretó el aseguramiento, así como, en su caso, del Juez que conozca del proceso penal federal. Quedo a sus órdenes para cualquier comentario.';

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
  selectedRows: IGood = {};
  wheelNotifications: any[] = [];

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
    selectMode: 'multi',
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

    columns: GOODS_COLUMNS,
  };
  // Data table
  dataTableBienesOficio: IGood[] = [];

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

    this.form
      .get('wheelNumber')
      .valueChanges.pipe(debounceTime(500))
      .subscribe(x => {
        if (x) this.getNotifications(new ListParams(), x);
      });
  }

  private prepareForm() {
    this.form = this.fb.group({
      wheelNumber: '',
      officeExternalKey: ['', [Validators.pattern(KEYGENERATION_PATTERN)]],
      addressee: ['', [Validators.pattern(STRING_PATTERN)]], // Detalle destinatario
      texto: '',
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

  getNotificationByWheel(params: ListParams, wheelNumber?: number) {
    if (!wheelNumber) {
      this.wheelNotifications = [];
    }

    this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;

    if (wheelNumber) {
      data.addFilter('wheelNumber', wheelNumber);
    }

    this.notificationService.getAllFilter(data.getParams()).subscribe({
      next: data => {
        this.wheelNotifications = data.data;
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  getNotifications(params: ListParams, numberExpedient?: number) {
    this.expedientNumber = numberExpedient;
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
        this.dataTableBienesOficio = data.data;
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  rowSelected(rows: any) {
    this.selectedRows = rows.data;
  }

  addGoodOffice() {
    const request: IGood = {
      ...this.selectedRows,
      delegationNumber: null,
      subDelegationNumber: null,
    };

    this.goodService.create(request).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    this.getNotifications(new ListParams(), this.expedientNumber);
    this.onLoadToast(
      'success',
      'Excelente',
      'Se ha agregado el bien correctamente'
    );
    this.loading = false;
  }

  deleteGoodOffice() {}

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
    this.form.get('texto').setValue(predifinedText);
  }

  btnReemplazarMarcadores() {
    let replaceText = predifinedText.replaceAll('<A>', 'LST_AMPARO');
    replaceText = replaceText.replaceAll('<B>', 'BIEN DESCRIPCIÓN');
    replaceText = replaceText.replaceAll('<C>', 'T_BIENES');

    this.form.get('texto').setValue(replaceText);
  }

  btnImprimir() {
    console.log('btnImprimir');
  }
}
