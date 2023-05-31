import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISentSirsae } from 'src/app/core/models/administrative-processes/history-good.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { IGoodPossessionThirdParty } from 'src/app/core/models/ms-thirdparty-admon/third-party-admon.model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  GOODS_COLUMNS,
  NOTIFICATIONS_COLUMNS,
} from './thirdparties-possession-validation-columns';

const predifinedText =
  'En cumplimiento a la instrucción judicial derivada del juicio de amparo <A> por el cual se informa que se resolvió provisionalmente conceder al quejoso la restitución de la posesión  uso y disfrute  del(los) siguiente(s) mueble(s). Al respecto me permito señalar: \n\n<B> \n\n<C> \n\nCon fundamento en la fracción XIV del artículo 39 del Estatuto Orgánico del Servicio de Administración y Enajenación de Bienes y considerando la instrucción judicial deducida del juicio de garantías emitida por el Juez <DATOS DE JUZGADO>, por el cual se otorga la suspensión definitiva al quejoso <QUEJOSO> respecto del disfrute del inmueble de marras y, consecuentemente, la restitución de la posesión, en tal sentido y salvo que no exista aseguramiento anterior o posterior decretado por autoridad competente para ello, esa Delegación a su cargo deberá dar cabal cumplimiento a la suspensión definitiva, levantado para tal efecto el acta administrativa de entrega de posesión por virtud de suspensión provisional, afectando, consecuentemente, el SIAB bajo el estatus ¿PD3¿ ¿entrega en posesión a terceros por instrucción judicial¿. \n\nEl cumplimiento señalado, deberá realizarlo a la brevedad e informar al Juez de Amparo sobre los actos tendientes a su cumplimiento. \n\nNo omito señalar, que en el supuesto de que se resuelva el amparo en el cuaderno incidental y/o principal negando la protección de la justicia federal, se deberán llevar a cabo las acciones legales correspondientes para recuperar la posesión del inmueble asegurado. \n\nFinalmente, le informo que debe hacer del conocimiento de la autoridad que decretó el aseguramiento, así como, en su caso, del Juez que conozca del proceso penal federal. \n\nQuedo a sus órdenes para cualquier comentario.';

@Component({
  selector: 'app-thirdparties-possession-validation',
  templateUrl: './thirdparties-possession-validation.component.html',
  styleUrls: ['./thirdparties-possession-validation.component.scss'],
})
export class ThirdpartiesPossessionValidationComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  users: ISegUsers[] = [];
  dataTableNotifications: INotification[] = [];
  // Table settings
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsNotifications = new BehaviorSubject<ListParams>(new ListParams());
  selectedRows: IGood = {};
  selectedRows2: IGood = {};
  wheelNotifications: INotification;
  goodsPosessionThirdParty: IGoodPossessionThirdParty[] = [];

  tableSettingsNotificaciones = {
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    hideSubHeader: true, //oculta subheaader de filtro
    // mode: 'external', // ventana externa

    columns: NOTIFICATIONS_COLUMNS,
  };

  // Table settings
  tableSettingsBienes = {
    selectedRowIndex: -1,
    rowClassFunction: (row: any) => {
      if (row.cells[1].value != 'ADM') {
        return 'bg-dark text-white disabled-custom';
      } else {
        return 'bg-primary';
      }
    },
    actions: {
      columnTitle: '',
      add: false,
      edit: false,
      delete: false,
    },
    selectMode: 'none',
    hideSubHeader: true, //oculta subheaader de filtro
    // mode: 'external', // ventana externa

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
    selectedRowIndex: -1,

    selectMode: 'single',
    hideSubHeader: true,
    mode: 'external',

    columns: GOODS_COLUMNS,
  };
  dataTableBienesOficio: IGood[] = [];

  expedientNumber: number = 0;
  public form: FormGroup;
  public formCcpOficio: FormGroup;
  public noExpediente = new FormControl(null);
  public formGood: FormGroup;
  totalItemsNotificaciones: number = 0;

  isLoadingGood: boolean = false;
  paramsGood = new BehaviorSubject<ListParams>(new ListParams());
  totalItemsGood: number = 0;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private goodService: GoodService,
    // private usersService: UsersService,
    private siabService: SiabService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private historyGoodService: HistoryGoodService,
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    // this.loading = true;
    this.paramsNotifications.subscribe(params => {
      this.getNotifications(params);
    });

    this.paramsGood.subscribe(params => {
      this.getGoods(params);
    });
    // this.noExpediente.valueChanges // .get('noExpediente')
    //   .pipe(debounceTime(500))
    //   .subscribe(x => {
    //     this.getNotifications();
    //   });

    // this.form
    //   .get('wheelNumber')
    //   .valueChanges.pipe(debounceTime(500))
    //   .subscribe(x => {
    //     this.getNotificationByWheel(new ListParams(), x);
    //     this.getGoodsPosessionThird(new ListParams(), x);
    //   });
  }

  private prepareForm() {
    this.form = this.fb.group({
      wheelNumber: '',
      officeExternalKey: [''],
      addressee: ['', [Validators.pattern(STRING_PATTERN)]],
      texto: '',
    });
    // this.noExpediente = this.fb.group({
    //   noExpediente: '',
    // });
    this.formCcpOficio = this.fb.group({
      ccp1: ['', [Validators.pattern(STRING_PATTERN)]],
      ccp2: ['', [Validators.pattern(STRING_PATTERN)]],
      firma: ['', [Validators.pattern(STRING_PATTERN)]],
    });
    this.formGood = this.fb.group({
      delegationCloseNumber: [''],
      numClueNavy: [''],
      closingDate: [''],
    });
  }

  detailGoodPosessionThirdParty: {
    possessionNumber: number;
    goodNumber: number;
    steeringwheelNumber: number;
    nbOrigin: string;
    status?: any;
    description?: string;
  };

  formPositionThirdParty = new FormGroup({
    closingDate: new FormControl(''),
    delegationCloseNumber: new FormControl(null),
    jobKey: new FormControl(''),
    nbOrigin: new FormControl(''),
    numClueNavy: new FormControl(null),
    possessionNumber: new FormControl(null),
    steeringwheelNumber: new FormControl(null),
    text: new FormControl(''),
    usrAddressee: new FormControl(''),
    usrCcp1: new FormControl(''),
    usrCcp2: new FormControl(''),
    usrResponsible: new FormControl(''),
  });
  goodPosessionThirdParty: IGoodPossessionThirdParty;
  getGoodsPosessionThird() {
    const wheelNumber = this.notificationSelected.wheelNumber;
    if (!wheelNumber) {
      return;
    }
    const queryParams = `page=${1}&limit=${10}&filter.steeringwheelNumber=${wheelNumber}`;
    this.formPositionThirdParty.reset();
    this.detailGoodPosessionThirdParty = null;
    this.goodPosessionThirdParty;
    this.goodPosessionThirdpartyService.getAll(queryParams).subscribe({
      next: data => {
        console.log('data', data);
        this.goodPosessionThirdParty = data.data[0];
        this.formPositionThirdParty.patchValue(data.data[0]);
        this.formCcpOficio.get('ccp1').patchValue(data.data[0].usrCcp1);
        this.formCcpOficio.get('ccp2').patchValue(data.data[0].usrCcp2);
        this.formCcpOficio.get('firma').patchValue(data.data[0].usrResponsible);
        this.form.get('texto').setValue(data.data[0].text);
        this.form.get('officeExternalKey').setValue(data.data[0].jobKey);
        this.formGood
          .get('delegationCloseNumber')
          .setValue(data.data[0].delegationCloseNumber);
        this.formGood.get('numClueNavy').setValue(data.data[0].numClueNavy);
        this.formGood.get('closingDate').setValue(data.data[0].closingDate);
        if (data.data[0].possessionNumber) {
          // this.form.get('officeExternalKey').disable();
          this.goodPosessionThirdpartyService
            .getAllDetailGoodPossessionThirdParty(
              'filter.possessionNumber=' + data.data[0].possessionNumber
            )
            .subscribe({
              next: data => {
                this.detailGoodPosessionThirdParty = data.data[0];
                this.goodService
                  .getById(this.detailGoodPosessionThirdParty.goodNumber)
                  .subscribe({
                    next: (data: any) => {
                      console.log('data good', data);
                      this.detailGoodPosessionThirdParty['description'] =
                        data.data[0].description;
                      this.detailGoodPosessionThirdParty['status'] =
                        data.data[0].status;
                    },
                  });
              },
              error: () => {},
            });
        }
        // this.isLoadingGood = false;
      },
      error: () => {
        // this.formCcpOficio.get('ccp1').patchValue('');
        // this.formCcpOficio.get('ccp2').patchValue('');
        // this.formCcpOficio.get('firma').patchValue('');
        this.formCcpOficio.reset();
        this.form.reset();
        this.formGood.reset();
      },
    });
  }

  getNotificationByWheel(params: ListParams) {
    const wheelNumber = this.form.get('wheelNumber').value;
    if (!wheelNumber) {
      return;
    }

    // this.params = new BehaviorSubject<ListParams>(new ListParams());
    // let data = this.params.value;
    // data.page = params.page;
    // data.limit = params.limit;
    const queryParams = `page=${params.page}&limit=${params.limit}&filter.wheelNumber=${wheelNumber}`;

    // if (wheelNumber) {
    //   data['filter.wheelNumber'] = wheelNumber;
    // // }

    this.notificationService.getAllFilter(queryParams).subscribe({
      next: data => {
        this.wheelNotifications = data.data[0];

        this.totalItemsNotificaciones = data.count;
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  clearForm() {
    this.form.reset();
    this.formCcpOficio.reset();
    this.noExpediente.reset();
    this.formGood.reset();
    this.dataTableBienes = [];
    this.dataTableBienesOficio = [];
    this.dataTableNotifications = [];
    this.wheelNotifications = null;
  }

  getNotifications(params = new ListParams()) {
    const numberExpedient = this.noExpediente.value;
    this.expedientNumber = numberExpedient;
    if (!numberExpedient) {
      this.dataTableNotifications = [];
      this.dataTableBienesOficio = [];
      this.dataTableBienes = [];
      return;
    }

    // this.params = new BehaviorSubject<ListParams>(new ListParams());
    let data = this.params.value;
    data.page = params.page;
    data.limit = params.limit;
    let queryString = `page=${params.page}&limit=${params.limit}`;
    queryString += `&filter.expedientNumber=${numberExpedient}`;
    // if (numberExpedient) {
    //   // data['filter.expedientNumber'] = numberExpedient;
    // }

    this.dataTableNotifications = [];
    this.loading = true;
    this.notificationService.getAllFilter(queryString).subscribe({
      next: data => {
        this.dataTableNotifications = data.data;
        this.totalItemsNotificaciones = data.count;
        this.loading = false;
        this.notificationSelected = this.dataTableNotifications[0];
        this.getGoods(new ListParams());
      },
      error: () => {
        this.loading = false;
      },
    });
    this.dataTableBienes = [];
    this.dataTableBienesOficio = [];
  }

  notificationSelected: null | INotification = null;
  selectRowNotification(event: any) {
    this.notificationSelected = event.data;
    console.log({ notificationSelected: this.notificationSelected });
    this.form
      .get('wheelNumber')
      .setValue(this.notificationSelected.wheelNumber);
    this.paramsGood;
    this.getGoodsPosessionThird();
  }

  getGoods(params: ListParams) {
    // this.params = new BehaviorSubject<ListParams>(new ListParams());
    // let data = this.params.value;
    // data.page = params.page;
    // data.limit = params.limit;
    // const numberExpedient = this.notificationSelected.expedientNumber;
    const numberExpedient = this.noExpediente.value;
    const queryString = `page=${params.page}&limit=${params.limit}&filter.fileNumber=${numberExpedient}`;
    this.getGoodsByOffice(new ListParams(), numberExpedient);
    // if (numberExpedient) {
    // data['filter.fileNumber'] = numberExpedient;
    // }
    this.isLoadingGood = true;
    this.goodService.getAllFilter(queryString).subscribe({
      next: data => {
        this.dataTableBienes = data.data;
        this.totalItemsGood = data.count;
        this.isLoadingGood = false;
      },
      error: err => {
        this.isLoadingGood = false;
      },
    });
  }

  getGoodsByOffice(params: ListParams, numberExpedient: number) {
    // this.params = new BehaviorSubject<FilterParams>(new FilterParams());
    // let data = this.params.value;
    // data.page = params.page;
    // data.limit = params.limit;

    // data.addFilter('status', 'STI');
    // data.addFilter('fileNumber', numberExpedient);
    const queryString = `page=${params.page}&limit=${params.limit}&filter.fileNumber=${numberExpedient}&filter.status=STI`;
    this.goodService.getAllFilter(queryString).subscribe({
      next: data => {
        this.dataTableBienesOficio = data.data;
      },
      error: err => {
        this.loading = false;
      },
    });
  }

  rowSelected(rows: any) {
    this.selectedRows = rows.isSelected ? rows.data : {};
  }

  rowSelected2(rows: any) {
    this.selectedRows2 = rows.isSelected ? rows.data : {};
  }

  addGoodOffice() {
    if (Object.keys(this.selectedRows).length < 1) {
      this.alert(
        'info',
        'Selecciona un bien',
        'Selecciona un bien para poder realizar esta acción.'
      );
      return;
    }

    if (this.selectedRows.status === 'STI') {
      this.alert(
        'info',
        'Selecciona un bien',
        'Selecciona un bien que esté disponible.'
      );
      return;
    }

    this.goodService
      .updateGoodStatus(this.selectedRows.goodId, 'STI')
      .subscribe({
        next: data => {
          this.handleSuccess();
          this.selectedRows = {};
        },
        error: () => (this.loading = false),
      });
  }

  handleSuccess() {
    // this.getGoods(new ListParams(), this.expedientNumber);
    // this.alert('success', 'Excelente', 'Se ha agregado el bien correctamente');
    // this.loading = false;
  }

  deleteGoodOffice() {
    if (Object.keys(this.selectedRows2).length < 1) {
      this.alert(
        'info',
        'Selecciona un bien',
        'Selecciona un bien para poder realizar esta acción.'
      );
      return;
    }

    this.goodService
      .updateGoodStatus(this.selectedRows2.goodId, 'ADM')
      .subscribe({
        next: data => {
          this.handleSuccess();
          this.selectedRows2 = {};
        },
        error: () => (this.loading = false),
      });
  }

  mostrarInfo(form: any): any {
    console.log(form.value);
  }

  mostrarInfoDepositario(formDepositario: any): any {
    console.log(formDepositario.value);
  }

  sendForm() {
    let cveOficio = this.form.get('officeExternalKey').value;

    if (
      this.form.invalid ||
      this.formCcpOficio.invalid ||
      this.noExpediente.invalid
    ) {
      this.alert(
        'info',
        'Revisa los campos',
        'Existen errores en algunos de tus campos.'
      );
      return;
    }

    if (!cveOficio) {
      this.alert(
        'info',
        '',
        'No puede cerrar el Acta si no se han incorporado bienes y generado la clave armada.'
      );
      return;
    }
    const maxNumClaveArmada = this.goodsPosessionThirdParty.reduce(
      (max, obj) => {
        return Math.max(max, obj.numClueNavy || 0);
      },
      0
    );

    if (cveOficio.includes('?')) {
      let anio = cveOficio.substring(
        cveOficio.lastIndexOf('/') + 1,
        cveOficio.length
      );
      console.log(anio);
      if (!cveOficio.includes('?') && cveOficio.endsWith(anio)) {
        let oficio = maxNumClaveArmada + 1;

        cveOficio = cveOficio
          .replace('?', ('00000' + oficio).slice(-5))
          .replace(' ', '');

        console.log(maxNumClaveArmada);

        console.log(oficio);
        this.formGood.get('closingDate').patchValue(new Date());
        this.form
          .get('officeExternalKey')
          .patchValue(
            cveOficio
              .replace('?', ('00000' + oficio).slice(-5))
              .replace(' ', '')
          );

        this.formGood.get('numClueNavy').patchValue(oficio);

        let clave = 0;
        for (let i = 0; i < this.goodsPosessionThirdParty.length; i++) {
          if (
            this.goodsPosessionThirdParty[i].jobKey === cveOficio &&
            this.goodsPosessionThirdParty[i].jobKey.indexOf('?') === -1
          ) {
            clave++;
          }
        }

        if (clave > 1) {
          this.alert(
            'info',
            'Fatal ERROR ir al área de sistemas hay más de una clave armada con el mismo número',
            ''
          );
        }
      }
    }

    const request: ISentSirsae = {
      armyJobKey: this.formGood.get('numClueNavy').value,
      delegationNumOpinion: this.formGood.get('delegationCloseNumber').value,
      date: new Date().toString(),
      expedientNumber: this.noExpediente.value,
    };

    console.log(request);

    this.historyGoodService.sentSirsae(request).subscribe({
      next: data => {
        console.log(data);
      },
      error: err => {
        this.alert(
          'error',
          'Ha ocurrido un error',
          'Inténtalo de nuevo más tarde.'
        );
      },
    });
  }

  btnInsertarTextoPredefinido() {
    this.form.get('texto').setValue(predifinedText);
  }

  btnReemplazarMarcadores() {
    const queryParams = `filter.wheelNumber=${this.formPositionThirdParty.value.steeringwheelNumber}`;
    this.notificationService.getAllFilter(queryParams).subscribe({
      next: data => {
        const tGood =
          this.detailGoodPosessionThirdParty.goodNumber +
          ' ' +
          this.detailGoodPosessionThirdParty.description;
        let replaceText = predifinedText.replaceAll(
          '<A>',
          this.wheelNotifications
            ? this.wheelNotifications.protectionKey
            : '<A>'
        );
        const text = this.form.get('texto').value;
        text.replace('<A>', data.data[0].protectionKey);
        replaceText = replaceText.replaceAll('<B>', 'BIEN  DESCRIPCIÓN');
        replaceText = replaceText.replaceAll(
          '<C>',
          tGood
          // this.dataTableBienes
          //   ? `${this.dataTableBienes[0].goodId}  ${this.dataTableBienes[0].description}`
          //   : '<C>'
        );

        this.form.get('texto').setValue(replaceText);
      },
      error: err => {},
    });
  }

  btnImprimir() {
    // this.loading = true;
    // const pdfurl = `http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/blank.pdf`; //window.URL.createObjectURL(blob);

    // const downloadLink = document.createElement('a');
    // //console.log(linkSource);
    // downloadLink.href = pdfurl;
    // downloadLink.target = '_blank';
    // downloadLink.click();

    // console.log(this.flyersForm.value);
    if (!this.detailGoodPosessionThirdParty.goodNumber) {
      this.alert('info', '', 'Seleccione un bien');
      return;
    }
    if (!this.form.get('officeExternalKey')) {
      this.pupGeneratorKey();
    } else {
    }
  }

  pupGeneratorKey() {}

  pupPrint() {
    // let params = { ...this.form.value };
    // for (const key in params) {
    //   if (params[key] === null) delete params[key];
    // }
    const params = {
      PARAMFORM: 'NO',
      P_FIRMA: 'S',
      P_NO_POSESION: this.goodPosessionThirdParty.possessionNumber,
    };
    //let newWin = window.open(pdfurl, 'test.pdf');
    // this.alert('success', '', 'Reporte generado');
    // this.loading = false;
    this.siabService
      // .fetchReport('RGEROFPRECEPDOCUM', params)
      .fetchReport('RBIEVALPOSTERCERO', params)
      .subscribe(response => {
        if (response !== null) {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        } else {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          let config = {
            initialState: {
              documento: {
                urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                type: 'pdf',
              },
              callback: (data: any) => {},
            }, //pasar datos por aca
            class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
            ignoreBackdropClick: true, //ignora el click fuera del modal
          };
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }
}
