import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription, takeUntil, tap } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IQueryGoodTracker } from 'src/app/core/models/ms-delivery-constancy/ms-delivery-constancy-model';
import { IGoodParameter } from 'src/app/core/models/ms-good-parameter/good-parameter.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import {
  IDetailProceedingsDevollution,
  IDetailProceedingsDevollutionDelete,
  IPupPrimaryClosureSus,
} from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { CertificatesGoodsService } from 'src/app/core/services/ms-delivery-constancy/certificates-goods.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import {
  ProceedingsDeliveryReceptionService,
  ProceedingsService,
} from 'src/app/core/services/ms-proceedings';
import {
  IPostQueryGoodFACTCIRCUN_0001,
  ProceedingSusPcancelService,
} from 'src/app/core/services/ms-proceedings/proceeding-suspcancel.service';
import { ProgrammingGoodsService } from 'src/app/core/services/ms-programming-good/programming-good.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import { AllExpedientsModal } from '../all-expedientes-modal/all-expedients-modal.component';
import { ExportDataModal } from '../export-data-modal/export-data-modal.component';
import { ProceedingNVRModalComponent } from '../proceeding-nvr-modal/procceding-nvr-modal.component';
import {
  FilterParams,
  ListParams,
} from './../../../../common/repository/interfaces/list-params';
import { COLUMNS1 } from './columns1';
import { COLUMNS2 } from './columns2';

interface IGlobal {
  gNoActaCopia: number;
  gStTodo: string;
  gStRecAdm: string;
  gNoDelegacion?: number;
  gIdTipoActa?: string | number;
  gNoActivaGestion?: number;
  cerrada: string;
  dest: number;
}
interface IParametro {
  pGestOk: number;
  pNumeroTramite: string;
}

interface IQueryParams {
  origin: string;
  noExpedient: string;
}

interface IBlkControl {
  diClasifNumerario: string;
  tipoActa: string;
  tipoAcIr: string;
}
@Component({
  selector: 'app-circumstantial-acts-suspension-cancellation',
  templateUrl: './circumstantial-acts-suspension-cancellation.component.html',
  styles: [
    `
      .top-layer {
        position: relative;
        z-index: 9999;
      }
    `,
  ],
})
export class CircumstantialActsSuspensionCancellationComponent
  extends BasePage
  implements OnInit
{
  formBlkExpedient: FormGroup;
  formSubject: FormGroup;
  form: FormGroup;
  formTable1: FormGroup;
  formTable2: FormGroup;
  formTag: FormGroup;
  response: boolean;
  bsValueFromYear = new Date().getFullYear();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  settings2: any;
  data1: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  bsValueFromMonth = new Date().getMonth() + 1;
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  totalItems: number = 0;
  totalItems2: number = 0;
  loading2 = this.loading;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  columnFilters2: any = [];
  parametro: IParametro = {
    pGestOk: null,
    pNumeroTramite: '',
  };
  global: IGlobal = {
    gNoActaCopia: 0,
    gStTodo: 'NADA',
    gStRecAdm: '',
    cerrada: null,
    dest: null,
  };
  blkControl: IBlkControl = {
    diClasifNumerario: null,
    tipoActa: null,
    tipoAcIr: null,
  };
  title: string = 'Actas Circunstanciadas Suspensión/Cancelación';
  deleteAct: boolean = false;
  textButtonAct: string = 'Abrir Acta';
  expediente: number;
  settings1: any;
  selectedGood: any;
  selectedGood2: any;
  goodTrackerGoods: any;
  $trackedGoods = this.store.select(getTrackedGoods);
  inputValue: number;
  queryParams: IQueryParams = {
    origin: null,
    noExpedient: null,
  };
  dataIdent = new DefaultSelect(['DES', 'DEV', 'DON', 'RES', 'VEN', 'SUS']);
  dataSubject = new DefaultSelect([
    { value: 1, label: 'EL CLIENTE NO SE PRESENTÓ A LA ENTREGA.' },
    {
      value: 2,
      label: 'EL CLIENTE SE PRESENTÓ PERO ESTÁ INCONFORME CON LOS BIENES.',
    },
    { value: 3, label: 'LA MERCANCÍA NO ESTÁ COMPLETA EN ALMACÉN PROPIO.' },
    { value: 4, label: 'LA MERCANCÍA NO ESTÁ COMPLETA EN ALMACÉN DE TERCERO.' },
    { value: 5, label: 'CANCELACIÓN POR SOLICITUD DE AUTORIDAD.' },
  ]);
  dataAuthority = new DefaultSelect();
  dataDelegation = new DefaultSelect();

  canNew = false;
  canSave = false;
  subscriptions: Subscription[] = [];

  maxDate = new Date();
  status_time: string = null;
  type_proceeding: string = null;

  numberProccedings: string = null;
  ngGlobal: any;
  flag: boolean = true;

  get username() {
    return this.authService.decodeToken().username;
  }
  constructor(
    private fb: FormBuilder,
    private parameterGood: GoodParametersService,
    private location: Location,
    private proceduremanagementService: ProcedureManagementService,
    private authService: AuthService,
    private proceedingsDetailDel: ProceedingsDeliveryReceptionService,
    private goodService: GoodService,
    private proceedingService: ProceedingsService,
    private goodprocessService: GoodProcessService,
    private statusGoodService: StatusGoodService,
    private datePipe: DatePipe,
    private router: Router,
    private store: Store,
    private programminggoodService: ProgrammingGoodsService,
    private expedientService: ExpedientService,
    private historygoodService: HistoryGoodService,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private proceedingSusCanService: ProceedingSusPcancelService,
    private globalVarService: GlobalVarsService,
    private deliveryConstancy: CertificatesGoodsService
  ) {
    super();
    this.settings1 = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      rowClassFunction: (row: any) => {
        if (row.data.di_disponible === 'S') {
          return 'bg-success text-white';
        } else {
          return 'bg-dark text-white';
        }
      },
    };
    this.settings2 = { ...this.settings, actions: false };
    this.settings1.columns = COLUMNS1;
    this.settings2.columns = COLUMNS2;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        if (params['origin']) {
          this.queryParams.origin = params['origin'];
          this.queryParams.noExpedient = params['noExpedient'];
          this.formBlkExpedient
            .get('noExpedient')
            .setValue(this.queryParams.noExpedient);
          this.search();
          this.inputValue = Number(this.queryParams.noExpedient);
        }
      });

    this.initForm();
    this.startCalendars();
    this.pupInitForms();
    this.navigateGoods();
    this.returnInGoodTracker();

    const localExpdeient = localStorage.getItem('expediente');
    const folio = localStorage.getItem('folio');
    if (localExpdeient) {
      this.inputValue = Number(localExpdeient);
      this.$trackedGoods.subscribe(async data => {
        console.error(data);
        const data1 = await this.data1.getAll();
        const dataNew = [...data, data1];
        this.data1.load(dataNew);
        this.data1.refresh();
      });
      if (folio) {
        this.form.get('universalFolio').setValue(folio);
      }
      this.formBlkExpedient.get('noExpedient').setValue(Number(localExpdeient));
      this.search();
      localStorage.removeItem('expediente');
      //
    }
  }

  returnInGoodTracker() {
    //TODO:
    this.globalVarService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          if (this.ngGlobal.REL_BIENES && this.flag) {
            console.log(this.ngGlobal.REL_BIENES);
            this.flag = false;
            const acta = localStorage.getItem('acta');

            const body: IQueryGoodTracker = {
              vcsScreen: 'FACTCIRCUN_0001',
              typeMinutes: acta,
              relGood: this.ngGlobal.REL_BIENES,
            };

            this.deliveryConstancy.queryGoodTracker(body).subscribe(
              res => {
                console.log(res);
                localStorage.removeItem('acta');
                localStorage.removeItem('expediente');
                localStorage.removeItem('acta');
              },
              err => {
                console.log(err);
              }
            );
          }
        },
      });
  }

  subscribeAssembleKey() {
    this.subscriptions.push(
      this.form
        .get('ident')
        .valueChanges.pipe(takeUntil(this.$unSubscribe))
        .subscribe(value => {
          if (value == 'DON') {
            this.type_proceeding = 'ACIRDON';
          } else if (value == 'DES') {
            this.type_proceeding = 'ACIRDES';
          } else if (value == 'DEV') {
            this.type_proceeding = 'ACIRDEV';
          } else if (value == 'VEN') {
            this.type_proceeding = 'ACIRVEN';
          } else {
            this.type_proceeding = null;
          }
        }),

      this.form
        .get('actSelect')
        .valueChanges.pipe(takeUntil(this.$unSubscribe))
        .subscribe(value => {
          if (['S/DON', 'C/DON'].includes(value)) {
            this.form.get('ident').setValue('DON');
            this.form.get('ident').disable();
            this.getTransferent();
            //OCULTAR Y DESHABILITAS EL ASUN
          } else if (['S/DES', 'C/DES'].includes(value)) {
            this.form.get('ident').setValue('DES');
            this.form.get('ident').disable();
            this.getTransferent();
            //OCULTAR Y DESHABILITAS EL ASUN
          } else if (['S/DEV', 'C/DEV'].includes(value)) {
            this.form.get('ident').setValue('DEV');
            this.form.get('ident').disable();
            this.getTransferent();
            //OCULTAR Y DESHABILITAS EL ASUN
          } else if (value == 'S/VEN') {
            //ACTIVA LA ACTUALIZACIÓN E INSERVIÓN DE BLK_ACT
            this.form.get('ident').enable();
            this.getTransferent();
            //MUESTRA Y HABILITA EL ASUN
          } else if (value == 'C/VNR') {
            this.alertQuestion(
              'question',
              'Esta seleccionando el proceso de Bien vendido dejado por el comprador',
              '¿Desea continuar ? '
            ).then(response => {
              if (response.isConfirmed) {
                this.form.get('ident').setValue('VEN');
                this.form.get('ident').disable();
                //TODO: ABRE MODAL
                this.getTransferent();
                //OCULTA Y DESHABILITA EL ASUN
              } else {
                this.form.get('actSelect').reset();
                this.form.get('authority').reset();
                this.dataAuthority = new DefaultSelect();
              }
            });
          } else {
            this.form.get('ident').reset();
            this.form.get('ident').enable();
          }
          this.assembleKey();
        }),
      this.form
        .get('authority')
        .valueChanges.pipe(takeUntil(this.$unSubscribe))
        .subscribe(value => {
          this.assembleKey();
        }),
      this.form
        .get('ident')
        .valueChanges.pipe(takeUntil(this.$unSubscribe))
        .subscribe(value => {
          this.assembleKey();
        }),
      this.form
        .get('receive')
        .valueChanges.pipe(takeUntil(this.$unSubscribe))
        .subscribe(value => {
          this.assembleKey();
        }),
      this.form
        .get('admin')
        .valueChanges.pipe(takeUntil(this.$unSubscribe))
        .subscribe(value => {
          this.assembleKey();
        }),
      this.form
        .get('folio')
        .valueChanges.pipe(takeUntil(this.$unSubscribe))
        .subscribe(value => {
          this.assembleKey();
        }),
      this.form
        .get('year')
        .valueChanges.pipe(takeUntil(this.$unSubscribe))
        .subscribe(value => {
          this.assembleKey();
        }),
      this.form
        .get('month')
        .valueChanges.pipe(takeUntil(this.$unSubscribe))
        .subscribe(value => {
          this.assembleKey();
        })
    );
  }

  unsubscribeAssembleKey() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  zeroAdd(number: number, lengthS: number) {
    if (number != null) {
      const stringNum = number.toString();
      let newString = '';
      if (stringNum.length < lengthS) {
        lengthS = lengthS - stringNum.length;
        for (let i = 0; i < lengthS; i++) {
          newString = newString + '0';
        }
        newString = newString + stringNum;
        return newString;
      } else {
        return stringNum;
      }
    } else {
      return null;
    }
  }

  assembleKey() {
    const nameAct =
      (this.form.get('actSelect').value != null
        ? this.form.get('actSelect').value
        : '') +
      '/' +
      (this.form.get('authority').value != null
        ? this.form.get('authority').value.transferKey
        : '') +
      '/' +
      (this.form.get('ident').value != null
        ? this.form.get('ident').value
        : '') +
      '/' +
      (this.form.get('receive').value != null
        ? this.form.get('receive').value.delegation
        : '') +
      '/' +
      (this.form.get('admin').value != null
        ? this.form.get('admin').value.delegation
        : '') +
      '/' +
      (this.form.get('folio').value != null
        ? this.zeroAdd(this.form.get('folio').value, 5)
        : '') +
      '/' +
      (this.form.get('year').value != null
        ? this.form.get('year').value.toString().substr(2, 2)
        : '') +
      '/' +
      (this.form.get('month').value != null
        ? this.zeroAdd(this.form.get('month').value, 2)
        : '');

    console.log(nameAct);
    this.form.get('act').setValue(nameAct);
  }

  startCalendars() {
    this.bsConfigFromMonth = Object.assign(
      {},
      {
        minMode: this.minModeFromMonth,
        dateInputFormat: 'MM',
      }
    );
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  selectRow(event: any) {
    this.selectedGood = event;
    this.statusGoodSelected(event.status);
  }

  statusGoodSelected(status: string) {
    const params: ListParams = {};
    params['filter.status'] = `$eq:${status}`;
    this.statusGoodService.getAll(params).subscribe({
      next: (response: any) => {
        this.formTable1.get('detail').setValue(response.data[0].description);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  selectRow2(event: any) {
    console.log(event);
    this.selectedGood2 = event.good;
    this.statusGoodSelected2(event.good.status);
  }

  statusGoodSelected2(status: string) {
    const params: ListParams = {};
    params['filter.status'] = `$eq:${status}`;
    this.statusGoodService.getAll(params).subscribe({
      next: (response: any) => {
        this.formTable2.get('detail').setValue(response.data[0].description);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  initForm() {
    this.form = this.fb.group({
      noActa: [null],
      statusAct: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      elabDate: [null, [Validators.required]],
      closingDate: [null, [Validators.required]],
      captureDate: [null, [Validators.required]],
      actSelect: [null, [Validators.required]],
      authority: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      ident: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      receive: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      admin: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      folio: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      act: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      autorithyCS: [null],
      observations: [null],
      elaboration: [null],
      responsible: [null],
      witnessContr: [null],
      universalFolio: [null],
    });

    this.formBlkExpedient = this.fb.group({
      noExpedient: [null, Validators.required],
      averiguacionPrevia: [null],
      causePenal: [null],
    });
    this.formBlkExpedient.disable();
    this.formBlkExpedient.get('noExpedient').enable();
    this.formTable1 = this.fb.group({
      detail: [null],
    });
    this.formTable2 = this.fb.group({
      detail: [null],
    });
    this.formSubject = this.fb.group({
      subject: [null],
    });
  }

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }

  async pupInitForms() {
    const etapa: any = await this.faEtapaCreada();
    this.global.gStRecAdm = await this.getRNomencla(
      etapa,
      this.global.gNoDelegacion
    );
    const parameters: IGoodParameter[] = await this.getAllParameters();

    if (parameters.length > 0) {
      this.blkControl.diClasifNumerario = parameters.find(
        p => p.id === 'CLASINUMER'
      ).initialValue;
    } else {
      this.alert(
        'warning',
        this.title,
        'No se tiene definido en PARAMETROS la clasificación para numerario-efectivo'
      );
      this.location.back();
      return;
    }

    if (this.parametro.pGestOk === 1 || this.global.gNoActivaGestion === 1) {
      const tramite: boolean = await this.updateTramite();
      const lnuNoExpedient: number = await this.getLnuNoExpedient();
      this.getBlkExpedient(lnuNoExpedient);
    } else {
      /// llamar esto LIP_ENTQRY
    }

    if (
      ['MARRIETA', 'SERA', 'DESARROLLO', 'ALEDESMA'].includes(this.username)
    ) {
      this.deleteAct = false;
    } else {
      this.deleteAct = true;
    }

    this.global.cerrada = 'N';
    this.global.dest = 0;
  }

  faEtapaCreada() {
    return new Promise((res, _rej) => {
      this.parameterGood.getPhaseEdo().subscribe({
        next: resp => {
          res(resp);
        },
        error: err => {
          res(null);
          console.log(err);
        },
      });
    });
  }
  getRNomencla(etapa: number | string, delegation: number | string) {
    return new Promise<string>((res, _rej) => {
      const params: ListParams = {};
      params['filter.stageedo'] = `$eq:${etapa}`;
      params['filter.numberDelegation2'] = `$eq:${delegation}`;
      this.parameterGood.getRNomencla(params).subscribe({
        next: resp => {
          res(resp.data[0].delegation);
        },
        error: err => {
          res('NADA');
          console.log(err);
        },
      });
    });
  }
  getAllParameters() {
    return new Promise<IGoodParameter[]>((res, _rej) => {
      const params: ListParams = {};
      params['filter.id'] = `$eq:CLASINUMER`;
      this.parameterGood.getAll(params).subscribe({
        next: resp => {
          res(resp.data);
        },
        error: err => {
          res([]);
          console.log(err);
        },
      });
    });
  }
  updateTramite() {
    return new Promise<boolean>((res, _rej) => {
      this.proceduremanagementService
        .updateGestionTramite(Number(this.parametro.pNumeroTramite))
        .subscribe({
          next: resp => {
            console.log(resp);
            res(true);
          },
          error: err => {
            console.log(err);
            res(false);
          },
        });
    });
  }
  getLnuNoExpedient() {
    return new Promise<number>((res, _rej) => {
      const params: ListParams = {};
      params['filter.id'] = `$eq:${this.parametro.pNumeroTramite}`;
      this.proceduremanagementService.getAll(params).subscribe({
        next: resp => {
          console.log(resp.data[0].expedient);
          res(resp.data[0].expedient);
        },
        error: err => {
          console.log(err);
          res(null);
        },
      });
    });
  }
  getBlkExpedient(expedient: number) {}

  async actButton() {
    console.log(this.data2);
    console.log(this.data2['data']);
    console.log(this.data2['data'].length);

    if (this.data2['data'].length == 0 || this.data2 == null) {
      this.alert('warning', 'El Acta no contiene Bienes ingresados', '');
      return;
    }

    if (['CERRADO', 'CERRADA'].includes(this.form.get('statusAct').value)) {
      this.global.cerrada = 'S';
    } else {
      this.global.cerrada = 'N';
    }
    this.pupMovimientoActa();
  }

  async pupMovimientoActa() {
    const proceedingKey = this.form.get('act').value;
    const partsKey = proceedingKey.split('/');

    console.log(this.form.get('act').value);
    console.log(`${partsKey[0]}/${partsKey[1]}`);
    if (
      this.form.get('statusAct').value === 'CERRADO' ||
      this.form.get('statusAct').value === 'CERRADA'
    ) {
      const resp = await this.alertQuestion(
        'warning',
        this.title,
        `¿Desea abrir el Acta ${this.form.get('noActa').value}?`
      );
      if (resp.isConfirmed) {
        this.pupBuscaTiposActa();
        this.openActa();
        const lv_VALMOTOS: any = await this.getLvValMotos();
        console.log(lv_VALMOTOS);
        if (lv_VALMOTOS) {
          if (lv_VALMOTOS.valmovement === '1') {
            const regresa = await this.pupRegresaActa();
            this.relationsExpedient();
          } else {
            this.global.cerrada = 'N';
          }
        } else {
          this.global.cerrada = 'N';
        }
      } else {
        this.global.cerrada = 'N';
      }
    } else {
      let lv_VALMOTOS: any = await this.getLvValMotos();
      if (lv_VALMOTOS == null) {
        lv_VALMOTOS = 0;
      }

      if (lv_VALMOTOS == 1) {
        this.closeProceeding();
      } else if (lv_VALMOTOS == 0) {
        this.closeProceeding();
      }
    }
  }

  closeProceeding() {
    const elaboratedDate = this.form.get('elabDate').value;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const elaboratedYear = new Date(elaboratedDate).getFullYear();
    const elaboratedMonth = new Date(elaboratedDate).getMonth() + 1;

    const proceedingKey = this.form.get('act').value;
    const partsKey = proceedingKey.split('/');
    const typeProceding = `${partsKey[0]}/${partsKey[1]}`;

    const userData = this.authService.decodeToken();
    const user = userData.preferred_username;

    if (['CERRADO', 'CERRADA'].includes(this.form.get('statusAct').value)) {
      this.alert('warning', 'El acta ya esta cerrada', '');
      return;
    }

    if (this.form.get('closingDate').value == null) {
      this.alert('warning', 'Debe introducir la fecha de cancelación', '');
      return;
    }

    if (this.form.get('address').value == null) {
      this.alert(
        'warning',
        'Debe introducir la direccion de donde se caceló la recepción',
        ''
      );
      return;
    }

    if (currentYear != elaboratedYear || currentMonth != elaboratedMonth) {
      this.alert(
        'warning',
        'Solo se pueden cerrar las actas con el mismo año y mes de hoy a la fecha de elaboración',
        ''
      );
      return;
    }

    if (
      typeProceding == 'S/VEN' &&
      this.formSubject.get('subject').value == null
    ) {
      this.alert(
        'warning',
        'No se puede cerrar el acta',
        'La etiqueta de razón es obligatoria'
      );
      return;
    }

    const body: IPupPrimaryClosureSus = {
      universalFolio: this.form.get('universalFolio').value,
      expedient: this.formBlkExpedient.get('noExpedient').value,
      screen: 'FACTCIRCUN_0001',
      user: user,
      receptionDate: this.form.get('closingDate').value,
      proceeding: this.form.get('noActa').value,
      proceedingKey: proceedingKey,
    };

    this.proceedingService.pupPrimayClosureSus(body).subscribe(
      res => {
        console.log(res);
        if (res.status === 400) {
          this.alert('warning', 'Error al cerrar el acta', res.message);
          return;
        }

        this.alert('success', 'Acta cerrada correctamente', '');
        this.form.get('statusAct').setValue('CERRADA');
      },
      err => {
        console.log(err);
        if (err.status === 400) {
          this.alert('warning', 'Error al cerrar el acta', err.error.message);
          return;
        }

        this.alert(
          'error',
          'Error al cerrar el acta',
          'Se presentó un error inesperado al cerrar el acta'
        );
      }
    );
  }

  correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }

  deleteProceeding() {
    const user = this.authService
      .decodeToken()
      .preferred_username.toUpperCase();
    const statusProceedings = this.form.get('statusAct').value;
    const elaboratedDate = this.form.get('elabDate').value;
    const newElaboratedDate = new Date(elaboratedDate);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const elaboratedYear = new Date(elaboratedDate).getFullYear();
    const elaboratedMonth = new Date(elaboratedDate).getMonth() + 1;

    console.log({
      elaboratedDate,
      newElaboratedDate,
      currentYear,
      currentMonth,
      elaboratedYear,
      elaboratedMonth,
    });

    if (
      !['MARRIETA', 'SERA', 'DESARROLLO', 'ALEDESMA', 'JRAMIREZ'].includes(user)
    ) {
      if (['CERRADO', 'CERRADA'].includes(statusProceedings)) {
        this.alert('warning', 'No puede eliminar un acta cerrada', '');
        return;
      }

      if (currentYear != elaboratedYear || currentMonth != elaboratedMonth) {
        this.alert(
          'warning',
          'No puede eliminar un Acta fuera del mes de elaboración',
          ''
        );
        return;
      }
    }

    if (statusProceedings != null) {
      this.alertQuestion(
        'question',
        '¿Está seguro de eliminar el Acta?',
        'Esta acción no se puede deshacer'
      ).then(response => {
        if (response.isConfirmed) {
          this.proceedingSusCanService
            .deleteProceeding(this.form.get('noActa').value)
            .subscribe({
              next: (response: any) => {
                this.alert(
                  'success',
                  this.title,
                  'El Acta se ha eliminado correctamente'
                );
                this.search();
              },
              error: err => {
                this.alert(
                  'error',
                  'Se presentó un error al eliminar el acta',
                  ''
                );
                console.log(err);
              },
            });
        }
      });
    }
  }

  setState() {
    /* this.$state.pipe(takeUntil(this.$unSubscribe)).subscribe(state => {
      const { trackerGoods } = state;
      this.goodTrackerGoods = trackerGoods;
      //this.getProceedingGoods(id.value).subscribe();
    }); */
  }

  pupRegresaActa() {
    return new Promise<any>((res, _rej) => {
      const model = {
        P_NOACTA: this.form.get('noActa').value,
        P_AREATRA: 4,
        P_PANTALLA: 'FACTCIRCUN_0001',
        P_TIPOMOV: this.form.get('noActa').value,
        USUARIO:
          localStorage.getItem('username') === 'sigebiadmon'
            ? localStorage.getItem('username')
            : localStorage.getItem('username').toLocaleUpperCase(),
      };
      this.programminggoodService.paRegresaEstAnterior(model).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: err => {
          res(null);
        },
      });
    });
  }

  pupBuscaTiposActa() {}

  getLvValMotos() {
    return new Promise<any>((res, _rej) => {
      const params: ListParams = {};
      params['filter.valUser'] = `$eq:${this.username}`;
      params['filter.valMinutesNumber'] = `$eq:${
        this.form.get('noActa').value
      }`;
      this.programminggoodService.getTmpProgValidation(params).subscribe({
        next: resp => {
          res(resp.data[0]);
        },
        error: err => {
          res(null);
        },
      });
    });
  }

  openActa() {
    return new Promise<any>((res, _rej) => {
      const model = {
        P_NOACTA: this.form.get('noActa').value,
        P_AREATRA: 4,
        P_PANTALLA: 'FACTCIRCUN_0001',
        P_TIPOMOV: this.form.get('noActa').value,
        USUARIO:
          localStorage.getItem('username') === 'sigebiadmon'
            ? localStorage.getItem('username')
            : localStorage.getItem('username').toLocaleUpperCase(),
      };
      console.log(model);
      this.programminggoodService.paAbrirActasPrograma(model).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: err => {
          if (err.error.message) {
            if (err.error.message.includes('El usuario sigebiadmon no fue')) {
              let message = err.error.message.replace('la', 'el Acta');
              message = message.replace('   ', '');
              this.alert('error', this.title, message);
            }
          } else {
            this.alert('error', this.title, 'No se pudo abrir el Acta');
          }
          res(null);
        },
      });
    });
  }

  async removeSelect() {
    if (this.selectedGood2 === null) {
      this.alert('error', this.title, 'Debe Seleccionar un Registro');
    } else {
      if (this.form.get('statusAct').value === 'CERRADA') {
        this.alert(
          'warning',
          this.title,
          'El acta ya esta cerrada, no puede realizar modificaciones a esta'
        );
      } else {
        const data: any[] = await this.data1.getAll();
        data.forEach(item => {
          if (item.id === this.selectedGood2.id) {
            item.di_disponible = 'S';
          }
        });
        this.data1.load(data);
        this.data1.refresh();
        console.log(this.selectedGood2.id);
        this.deleteDetailProceedingsDevolution(
          this.selectedGood2.id,
          this.form.get('noActa').value
        );
      }
    }
  }
  deleteDetailProceedingsDevolution(
    numberGood: number,
    numberProceedings: number
  ) {
    const model: IDetailProceedingsDevollutionDelete = {
      numberGood,
      numberProceedings,
    };
    this.proceedingService.deleteDetailProceedingsDevolution(model).subscribe({
      next: (response: any) => {
        console.log(response.data);
        this.selectedGood2 = null;
        this.getDetailProceedingsDevolution(numberProceedings);
        this.alert('success', 'Se ha eliminado el registro correctamente', '');
      },
      error: err => {
        console.log(err);
      },
    });
  }

  addSelect() {
    if (!this.validAdd(this.selectedGood)) {
      return;
    }
    if (this.selectedGood === null) {
      this.onLoadToast('error', 'Debe Seleccionar un Registro');
    } else {
      this.preInsert(this.selectedGood);
      this.createDetailProceedingsDevolution(
        this.selectedGood,
        this.form.get('noActa').value
      );
    }
  }

  createDetailProceedingsDevolution(good: IGood, numberProceedings: number) {
    const { id, quantity } = good;
    const model: IDetailProceedingsDevollution = {
      numberGood: id,
      amount: quantity,
      numberProceedings,
    };
    console.log(model);
    this.proceedingService.createDetailProceedingsDevolution(model).subscribe({
      next: (response: any) => {
        console.log(response);
        this.alert('success', 'Se ha agregado el registro correctamente', '');
        this.getGoods();
        this.getDetailProceedingsDevolution(numberProceedings);
      },
      error: error => {
        this.alert('warning', 'Error al agregar el registro', '');
        console.log(error);
      },
    });
  }

  statusFinal(goodNumber: number) {
    return new Promise<any[]>((res, rej) => {
      const model = {
        vcScreen: 'FACTCIRCUN_0001',
        goodNumber,
      };
      this.goodprocessService.getStatusFinal(model).subscribe({
        next: (response: any) => {
          res(response.data.filter((index: number) => index === 0));
        },
        error: error => {
          console.log(error);
          res([]);
        },
      });
    });
  }

  async preInsert(good: any) {
    if (this.form.get('statusAct').value === 'CERRADA') {
      const data: any[] = await this.statusFinal(good.goodId);
      if (data.length === 0) {
        data.forEach(element => {
          if (element.estatus_final !== null) {
            this.updateGood(good, element.estatus_final);
            this.insertHistoryStatus(
              good,
              element.estatus_final,
              this.username
            );
          }
        });
      }
    }
  }

  insertHistoryStatus(good: IGood, statusFinal: string, usuario: string) {
    const model: IHistoryGood = {
      changeDate: this.getCurrentDate(),
      userChange: usuario,
      propertyNum: good.id,
      reasonForChange: 'Automatico',
      status: statusFinal,
      statusChangeProgram: 'FACTDESACTASUTILI',
    };
    this.historygoodService.create(model).subscribe({
      next: (response: any) => {
        console.log(response.data);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateGood(good: any, statusFinal: string) {
    const model: IGood = null;
    model.id = good.id;
    model.goodId = good.goodId;
    model.status = statusFinal;
    this.goodService.update(model).subscribe({
      next: (response: any) => {
        console.log(response.data);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  validAdd(good: any) {
    console.log(good);
    const cve_act: string = this.form.get('act').value;
    const status_act: string = this.form.get('statusAct').value;
    if (good.di_disponible === 'N') {
      this.onLoadToast(
        'warning',
        this.title,
        'El bien tiene un estatus inválido para ser asignado a alguna acta'
      );
      return false;
    }
    if (cve_act === null) {
      this.onLoadToast(
        'warning',
        this.title,
        'Debe registrar un acta antes de poder mover el bien'
      );
      return false;
    }
    if (good.goodClassNumber === 62 && cve_act.substring(0, 2) !== 'NA') {
      this.onLoadToast(
        'warning',
        this.title,
        'Para este bien la clave de acta dede iniciar con " NA "'
      );
      return false;
    }
    if (
      good.goodClassNumber === 62 &&
      cve_act.substring(13, 3) !== 'DAB' &&
      cve_act.substring(14, 3) !== 'DAB'
    ) {
      this.onLoadToast(
        'warning',
        this.title,
        'En la parte de quien administra en la clave de acta debe ser para este bien " DAB "'
      );
      return false;
    }
    if (status_act === 'CERRADA') {
      this.onLoadToast(
        'warning',
        this.title,
        'El acta ya esta cerrada, no puede realizar modificaciones a esta'
      );
      return false;
    } else {
      if (good.acta !== null) {
        this.onLoadToast(
          'warning',
          this.title,
          'Ese bien ya se encuentra en la acta ' + good.acta
        );
        return false;
      }
    }
    return true;
  }

  addGood() {
    /// llamar al Rastreador de bienes
    //this.alert('success',this.title,'Llamar al Rastreador de Bienes');
    const proceedingKey = this.form.get('act').value;
    const partsKey = proceedingKey.split('/');
    const acta = `${partsKey[0]}/${partsKey[1]}`;
    localStorage.setItem('expediente', this.expediente.toString());
    localStorage.setItem('acta', this.form.get('noActa').value.toString());
    localStorage.setItem('tipoActa', acta);
    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FACTCIRCUN_0001',
      },
    });
  }

  async deleteActa() {
    if (
      !['MARRIETA', 'SERA', 'DESARROLLO', 'ALEDESMA'].includes(this.username)
    ) {
      if (
        this.form.get('statusAct').value === 'CERRADO' ||
        this.form.get('statusAct').value === 'CERRADA'
      ) {
        this.alert('warning', this.title, 'No puede eliminar un Acta cerrada');
        return;
      }
      if (
        this.formatDateToMMYYYY(this.form.get('elabDate').value) !==
        this.formatDateToMMYYYY(new Date())
      ) {
        this.alert(
          'warning',
          this.title,
          'No puede eliminar un Acta fuera del mes de elaboración'
        );
        return;
      }
    }
    if (this.form.get('noActa').value !== null) {
      const resp = await this.alertQuestion(
        'warning',
        this.title,
        '¿Desea eliminar completamente el acta?'
      );
      if (resp.isConfirmed) {
        this.pupDelActaEntrega();
      }
    }
  }

  async pupDelActaEntrega() {
    const data: any[] = await this.data2.getAll();
    data.forEach(async element => {
      const del: boolean = await this.deleteDet(
        element.noActa,
        element.goodNumber
      );
    });
    this.deleteActaEntrega(this.form.get('noActa').value);
  }

  deleteDet(noActa: number, goodNumber: number) {
    return new Promise<boolean>((res, _rej) => {
      this.proceedingsDetailDel.deleteDetail(goodNumber, noActa).subscribe({
        next: resp => {
          console.log(resp);
          res(true);
        },
        error: err => {
          console.log(err);
          res(false);
        },
      });
    });
  }

  deleteActaEntrega(noActa: number) {
    this.proceedingsDetailDel
      .deleteProceedingsDeliveryReception(noActa)
      .subscribe({
        next: resp => {
          console.log(resp);
          this.alert('success', this.title, 'Acta Eliminada correctamente');
        },
        error: err => {
          console.log(err);
          this.alert('error', this.title, 'Error al eliminar la Acta');
        },
      });
  }

  formatDateToMMYYYY(date: any) {
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      return `${parsedDate.getMonth() + 1}/${parsedDate.getFullYear()}`;
    } else if (date instanceof Date) {
      return `${date.getMonth() + 1}/${date.getFullYear()}`;
    } else {
      throw new Error('Formato de fecha no válido');
    }
  }

  clearAll() {
    this.canNew = false;
    this.formBlkExpedient.reset();
    this.form.reset();
    this.formTable1.reset();
    this.formTable2.reset();
    this.data1.load([]);
    this.data2.load([]);
    this.totalItems = 0;
    this.totalItems2 = 0;
    this.unsubscribeAssembleKey();
    this.notRequired();
  }

  notRequired() {
    this.form.controls['actSelect'].clearValidators();
    this.form.controls['actSelect'].updateValueAndValidity();
    this.form.controls['authority'].clearValidators();
    this.form.controls['authority'].updateValueAndValidity();
    this.form.controls['ident'].clearValidators();
    this.form.controls['ident'].updateValueAndValidity();
    this.form.controls['receive'].clearValidators();
    this.form.controls['receive'].updateValueAndValidity();
    this.form.controls['admin'].clearValidators();
    this.form.controls['admin'].updateValueAndValidity();
    this.form.controls['folio'].clearValidators();
    this.form.controls['folio'].updateValueAndValidity();
    this.form.controls['year'].clearValidators();
    this.form.controls['year'].updateValueAndValidity();
    this.form.controls['month'].clearValidators();
    this.form.controls['month'].updateValueAndValidity();
  }

  required() {
    this.form.controls['actSelect'].setValidators(Validators.required);
    this.form.controls['actSelect'].updateValueAndValidity();
    this.form.controls['authority'].setValidators(Validators.required);
    this.form.controls['authority'].updateValueAndValidity();
    this.form.controls['ident'].setValidators(Validators.required);
    this.form.controls['ident'].updateValueAndValidity();
    this.form.controls['receive'].setValidators(Validators.required);
    this.form.controls['receive'].updateValueAndValidity();
    this.form.controls['admin'].setValidators(Validators.required);
    this.form.controls['admin'].updateValueAndValidity();
    this.form.controls['folio'].setValidators(Validators.required);
    this.form.controls['folio'].updateValueAndValidity();
    this.form.controls['year'].setValidators(Validators.required);
    this.form.controls['year'].updateValueAndValidity();
    this.form.controls['month'].setValidators(Validators.required);
    this.form.controls['month'].updateValueAndValidity();
  }

  newProceeding() {
    this.required();
    this.form.reset();
    this.data2.load([]);
    this.totalItems2 = 0;
    this.subscribeAssembleKey();
    this.canSave = true;
    this.form.get('captureDate').setValue(new Date());
    this.form.get('captureDate').disable();
    this.form.get('year').setValue(new Date().getFullYear());
    this.form.get('month').setValue(new Date().getMonth() + 1);
    this.getDelegations();
  }

  search() {
    this.expediente = this.formBlkExpedient.get('noExpedient').value;
    const params: ListParams = {};
    params['filter.id'] = `$eq:${this.expediente}`;

    this.expedientService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.canNew = true;
        this.formBlkExpedient.controls['averiguacionPrevia'].setValue(
          resp.data[0].preliminaryInquiry
        );
        this.formBlkExpedient.controls['causePenal'].setValue(
          resp.data[0].criminalCase
        );
        this.relationsExpedient();
        this.notRequired();
      },
      error: err => {
        this.alert(
          'info',
          this.title,
          'No se encontrarón registros para este expediente',
          ''
        );
      },
    });
    //// buscar en el
  }

  relationsExpedient() {
    this.getGoods();
    this.loading = false;

    const paramsF = new FilterParams();
    paramsF.addFilter('numFile', this.expediente);
    if (this.numberProccedings != null) {
      paramsF.addFilter('id', this.numberProccedings);
    }

    this.proceedingsDetailDel.getProceeding2All(paramsF.getParams()).subscribe(
      response => {
        console.log(response);

        if (response == null) {
          this.alert('info', this.title, 'No se encontrarón registros', '');
          return;
        }
        this.form
          .get('universalFolio')
          .setValue(response.data[0].universalFolio);

        console.log('Folio: ' + response.data[0].universalFolio);
        this.response = true;
        //this.idActa = Number(response.data[i].id);
        this.form.controls['noActa'].setValue(response.data[0].id);
        this.form.controls['act'].setValue(response.data[0].keysProceedings);
        this.form.controls['observations'].setValue(
          response.data[0].observations
        );
        this.form.controls['statusAct'].setValue(
          response.data[0].statusProceedings
        );
        this.form.controls['address'].setValue(response.data[0].address);
        this.form.controls['elabDate'].setValue(
          this.correctDate(response.data[0].elaborationDate)
        );
        this.form.controls['captureDate'].setValue(
          this.datePipe.transform(response.data[0].captureDate, 'dd/MM/yyyy')
        );
        this.form.controls['closingDate'].setValue(
          response.data[0].datePhysicalReception
            ? this.datePipe.transform(
                response.data[0].datePhysicalReception,
                'dd/MM/yyyy'
              )
            : null
        );
        this.form.controls['autorithyCS'].setValue(response.data[0].witness1);
        this.form.controls['elaboration'].setValue(response.data[0].witness2);
        this.form.controls['witnessContr'].setValue(
          response.data[0].comptrollerWitness
        );
        this.form.controls['authority'].setValue(
          response.data[0].numTransfer != null
            ? response.data[0].numTransfer.key
            : null
        );
        this.form.controls['ident'].setValue(response.data[0].identifier);
        this.form.controls['receive'].setValue(response.data[0].receiptKey);

        //receive
        // receiptKey clave del que recibe
        const statusAct = this.form.get('statusAct').value;
        if (['CERRADO', 'CERRADA'].includes(statusAct)) {
          this.textButtonAct = 'Abrir Acta';
        } else if (['ABIERTO', 'ABIERTA'].includes(statusAct)) {
          this.textButtonAct = 'Cerrar Acta';
        } else if (statusAct === null) {
          this.textButtonAct = 'Cerrar Acta';
        }
        //TODO
        console.log('numero de acta: ' + response.data[0].id);
        this.numberProccedings = null;
        this.getDetailProceedingsDevolution(response.data[0].id);
      },
      error => {
        this.numberProccedings = null;
        this.alert(
          'error',
          this.title,
          'No se encontraron registros con este numero'
        );
      }
    );
  }

  getGoods(): void {
    this.loading = true;
    console.log('ENTRO A BUSCAR BIENES');
    console.log(this.params);
    console.log(this.columnFilters);
    const paramsF = new FilterParams();
    this.loading = true;
    paramsF.addFilter('fileNumber', this.expediente);

    paramsF.page = this.params.value.page;
    paramsF.limit = this.params.value.limit;

    this.goodService.getAll(paramsF.getParams()).subscribe({
      next: async response => {
        console.log(response);
        const datos = await Promise.all(
          response.data.map(async (item: IGood) => {
            const di_disponible = await this.postQueryGoods(item);
            // console.log(di_disponible);
            return {
              ...item,
              acta: di_disponible.minutes,
              di_disponible: di_disponible.available,
            };
          })
        );
        this.totalItems = response.count;
        this.data1.load(datos);
        this.data1.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data1.load([]);
        this.data1.refresh();
      },
    });
  }

  getDisponible(goodNumber: number) {
    return new Promise((res, _rej) => {
      const model = {
        vcScreen: 'FACTDESACTASUTILI',
        goodNumber,
      };
      this.goodprocessService.getDisponible(model).subscribe({
        next: response => {
          console.log(response);
          res('S');
        },
        error: err => {
          res('N');
        },
      });
    });
  }

  getDetailProceedingsDevolution(numberAct: number | string) {
    console.log('Se llamo los bienes');
    this.loading2 = true;
    let params = {
      ...this.params2,
      ...this.columnFilters2,
    };
    params['filter.numberProceedings'] = `$eq:${numberAct}`;
    console.log(params);
    this.proceedingService.getDetailProceedingsDevolution(params).subscribe({
      next: response => {
        console.log(response);
        const data = response.data.map((item: any) => {
          return {
            ...item,
            unit: item.good.unit,
            process: item.good.extDomProcess,
            goodClassNumber: item.good.goodClassNumber,
          };
        });
        this.data2.load(data);
        this.data2.refresh();
        this.totalItems2 = response.count;
        this.loading2 = false;
      },
      error: error => {
        this.data2.load([]);
        this.data2.refresh();
        this.loading2 = false;
        console.log(error);
      },
    });
  }

  goBack() {
    //FCONGENRASTREADOR
    if (this.queryParams.origin == 'FCONGENRASTREADOR') {
      this.router.navigate([`/pages/general-processes/goods-tracker`]);
    }
  }

  listAllExpedients() {
    let modalConfig = MODAL_CONFIG;
    modalConfig = {
      initialState: {
        title: 'Lista general de actas',
        callback: (data: any) => {
          console.log(data);
          this.expediente = data.numFile;
          this.formBlkExpedient.get('noExpedient').setValue(data.numFile);
          this.numberProccedings = data.id;
          this.search();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };

    this.modalService.show(AllExpedientsModal, modalConfig);
  }

  exportDataModal() {
    if (
      this.formBlkExpedient.get('noExpedient').value != null &&
      this.form.get('act').value != null &&
      this.form.get('statusAct').value != null
    ) {
      let modalConfig = MODAL_CONFIG;
      modalConfig = {
        initialState: {
          expedientNumber: this.formBlkExpedient.get('noExpedient').value,
          proceedingNumber: this.form.get('noActa').value,
          callback: (data: any) => {},
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };

      this.modalService.show(ExportDataModal, modalConfig);
    } else {
      this.alert('warning', 'Necesitas un número de expediente con actas', '');
    }
  }

  nvrProceedingModal() {
    if (
      !['CERRADO', 'CERRADA', null].includes(this.form.get('statusAct').value)
    ) {
      let modalConfig = MODAL_CONFIG;
      modalConfig = {
        initialState: {
          callback: (isProcees: boolean) => {
            console.log(isProcees);
          },
        },
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      };

      this.modalService.show(ProceedingNVRModalComponent, modalConfig);
    } else {
      this.alert('warning', 'El acta no cuenta con un estado válido', '');
    }
  }

  listProceedingByExpedient() {
    const expedient = this.formBlkExpedient.get('noExpedient').value;
    if (expedient === null || expedient === undefined) {
      expedient.markAsTouched();
      this.alert('warning', 'Error', 'Debe registrar un expediente');
      return;
    }

    let modalConfig = MODAL_CONFIG;
    modalConfig = {
      initialState: {
        expedient: expedient,
        title: 'Lista de actas del expediente ' + expedient,
        callback: (data: any) => {
          console.log(data);
          this.expediente = data.numFile;
          this.formBlkExpedient.get('noExpedient').setValue(data.numFile);
          this.numberProccedings = data.id;
          this.search();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };

    this.modalService.show(AllExpedientsModal, modalConfig);
  }

  navigateGoods() {
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(params => {
          console.log(params);
          this.getGoods();
        })
      )
      .subscribe();
  }

  existProceeding() {
    return new Promise((res, _rej) => {
      const paramsF = new FilterParams();
      paramsF.addFilter('keysProceedings', this.form.get('act').value);
      this.proceedingsDetailDel
        .getProceeding2All(paramsF.getParams())
        .subscribe(
          response => {
            console.log(response);
            res(true);
          },
          err => {
            res(false);
          }
        );
    });
  }

  keyIsValid() {
    return new Promise((res, _rej) => {
      let cveActa = this.form.get('act').value;

      if (
        cveActa.includes('//') ||
        cveActa.startsWith('/') ||
        cveActa.endsWith('/')
      ) {
        res(false);
      } else {
        res(true);
      }
    });
  }

  validElaborationDate() {
    if (
      this.canSave ||
      ['ABIERTA', 'ABIERTO'].includes(this.form.get('statusAct').value)
    ) {
      const date = this.form.get('elabDate').value;
      console.log(date);
      //VALIDAR HORA
      const hours = date.getHours();
      console.log(hours);
      if (hours == 0) {
        this.alert(
          'warning',
          'Fecha de elaboración inválida',
          'Indicar la hora de elaboración'
        );
        this.form.get('elabDate').reset();
        return;
      }
      //VALIDAR HORAS TRANSCURRIDAS
      const now = new Date();
      const diffInMilliseconds = now.getTime() - date.getTime();
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
      console.log(diffInHours);

      if (diffInHours > 72) {
        this.status_time = 'DESTIEMPO';
        this.alert(
          'info',
          'Acto registrado con ' +
            parseInt(diffInHours.toString()) +
            ' horas de retraso',
          ''
        );
      } else {
        this.status_time = 'EN TIEMPO';
      }

      //VALIDAR AÑO Y MES
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      console.log({ currentYear, currentMonth, year, month });

      if (currentYear !== year || currentMonth !== month) {
        this.alert(
          'warning',
          'Fecha de elaboración inválida',
          'El acta no puede ser registrada por encontrarse fuera de las políticas de registro de actas de recepción física.'
        );
        // this.form.get('elabDate').reset();
        return;
      }

      this.form.get('closingDate').setValue(date);
    }
  }

  async saveNewProceeding() {
    //TODO Agregar loading
    const exists = await this.existProceeding();
    console.log(exists);
    this.form.markAllAsTouched();

    if (exists) {
      this.alert(
        'warning',
        'Ya existe un acta con el mismo número',
        'Se sumará uno al folio'
      );
      this.form
        .get('folio')
        .setValue(parseInt(this.form.get('folio').value) + 1);
      return;
    }

    const isValid = await this.keyIsValid();

    if (!isValid) {
      this.alert(
        'warning',
        'Clave de acta inválida',
        'Verifique la clave de acta'
      );
      return;
    }

    if (this.type_proceeding == null) {
      this.alert(
        'warning',
        'Tipo de acta inválida',
        'Seleccione un tipo de acta'
      );
      return;
    }

    if (this.form.get('elabDate').value == null) {
      this.alert(
        'warning',
        'Fecha de elaboración inválida',
        'Seleccione una fecha de elaboración'
      );
      return;
    }

    if (this.form.get('closingDate').value == null) {
      this.alert(
        'warning',
        'Fecha de cierre inválida',
        'Seleccione una fecha de cierre'
      );
      return;
    }

    if (this.form.get('address').value == null) {
      this.alert('warning', 'Dirección inválida', 'Ingrese una dirección');
      return;
    }

    this.form.get('captureDate').setValue(new Date());

    const user = this.authService.decodeToken();

    const body: IProccedingsDeliveryReception = {
      keysProceedings: this.form.get('act').value,
      statusProceedings: 'ABIERTA',
      elaborationDate: this.form.get('elabDate').value.getTime(),
      datePhysicalReception: this.form.get('closingDate').value.getTime(),
      address: this.form.get('address').value,
      elaborate: user.preferred_username,
      numFile: this.formBlkExpedient.get('noExpedient').value,
      observations: this.form.get('observations').value,
      witness1: this.form.get('autorithyCS').value,
      witness2: this.form.get('elaboration').value,
      comptrollerWitness: this.form.get('witnessContr').value,
      typeProceedings: this.type_proceeding,
      captureDate: new Date().getTime(),
      numDelegation1: this.form.get('admin').value.delegationNumber2,
      numDelegation2:
        this.form.get('admin').value.delegationNumber2 == 11 ? '11' : null,
    };

    console.log(body);
    this.proceedingsDetailDel.create(body).subscribe(
      res => {
        console.log(res);
        this.alert('success', 'Acta registrada', '');
        this.form.get('statusAct').setValue('ABIERTA');
        this.canSave = false;
        this.unsubscribeAssembleKey();
        this.form.get('noActa').setValue(res.id);
      },
      err => {
        console.log(err);
      }
    );
  }

  updateProceeding() {
    const body: IProccedingsDeliveryReception = {
      elaborationDate:
        this.form.get('elabDate').value.getTime() ??
        new Date(this.form.get('elabDate').value).getTime(),
      datePhysicalReception:
        this.form.get('closingDate').value.getTime() ??
        new Date(this.form.get('closingDate').value).getTime(),
      address: this.form.get('address').value,
      observations: this.form.get('observations').value,
      witness1: this.form.get('autorithyCS').value,
      witness2: this.form.get('elaboration').value,
      comptrollerWitness: this.form.get('witnessContr').value,
    };

    this.alertQuestion(
      'question',
      '¿Está seguro de actualizar el acta?',
      ''
    ).then(response => {
      if (response.isConfirmed) {
        this.proceedingsDetailDel
          .update(this.form.get('noActa').value, body)
          .subscribe(
            res => {
              this.alert('success', 'Acta actualizada', '');
              console.log(res);
            },
            err => {
              this.alert(
                'error',
                'Se presentó un error al actualizar el acta',
                'Intentelo nuevamente'
              );
              console.log(err);
            }
          );
      }
    });
  }

  getTransferent() {
    if (this.formBlkExpedient.get('noExpedient').value != null) {
      this.form.get('authority').reset();

      const body = {
        proceedingsNumber: this.formBlkExpedient.get('noExpedient').value,
        typeMinutes: this.form.get('actSelect').value,
      };

      this.proceedingSusCanService.queryTransferKey(body).subscribe(
        res => {
          console.log(res);
          this.dataAuthority = new DefaultSelect(res.data, res.count);
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  getDelegations() {
    const delegation = this.authService.decodeToken().department;
    console.log(delegation);

    this.proceedingSusCanService.queryRNomencla(delegation).subscribe(
      res => {
        console.log(res);
        this.dataDelegation = new DefaultSelect(res.data, res.count);
      },
      err => {
        console.log(err);
        this.dataDelegation = new DefaultSelect();
      }
    );
  }

  postQueryGoods(good: any): any {
    return new Promise((res, _rej) => {
      const user = this.authService.decodeToken();
      const body: IPostQueryGoodFACTCIRCUN_0001 = {
        elaborationDate: this.form.get('elabDate').value,
        delegationNumber: user.department,
        subdelegationNumber: user.department,
        goodNumber: good.id,
        proceedingsNumber: this.formBlkExpedient.get('noExpedient').value,
        status: good.status,
        screen: 'FACTCIRCUN_0001',
      };

      this.proceedingSusCanService.postQuery(body).subscribe(
        response => {
          // console.log(response);
          res(response);
        },
        err => {
          console.log(err);
        }
      );
    });
  }

  validateGoods() {
    const proceedingsNumber = this.form.get('noActa').value;

    this.proceedingSusCanService.validateGoods(proceedingsNumber).subscribe(
      res => {
        console.log(res);
        this.alert('success', res.msg, '');
      },
      err => {
        this.alert('error', 'Se presentó un error al validar los bienes', '');
        console.log(err);
      }
    );
  }
}
