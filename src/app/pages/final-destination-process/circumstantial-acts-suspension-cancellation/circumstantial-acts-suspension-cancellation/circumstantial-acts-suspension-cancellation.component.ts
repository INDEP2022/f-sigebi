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
import { BehaviorSubject, takeUntil } from 'rxjs';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IGoodParameter } from 'src/app/core/models/ms-good-parameter/good-parameter.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import {
  IDetailProceedingsDevollution,
  IDetailProceedingsDevollutionDelete,
} from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
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
import { ProgrammingGoodsService } from 'src/app/core/services/ms-programming-good/programming-good.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { getTrackedGoods } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.selector';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
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
  styles: [],
})
export class CircumstantialActsSuspensionCancellationComponent
  extends BasePage
  implements OnInit
{
  formBlkExpedient: FormGroup;
  form: FormGroup;
  formTable1: FormGroup;
  formTable2: FormGroup;
  formTag: FormGroup;
  response: boolean;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  settings2: any;
  data1: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  bsValueFromMonth: Date = new Date();
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
    private activatedRoute: ActivatedRoute
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
          console.error(params);
          this.queryParams.origin = params['origin'];
          this.queryParams.noExpedient = params['noExpedient'];
          this.search(this.queryParams.noExpedient);
          this.inputValue = Number(this.queryParams.noExpedient);
        }
      });
    this.initForm();
    this.startCalendars();
    this.pupInitForms();
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
        this.form.controls['universalFolio'].setValue(folio);
      }
      this.search(Number(localExpdeient));
      localStorage.removeItem('expediente');
    }
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
      noExpedient: [null],
      averiguacionPrevia: [null],
      causePenal: [null],
    });
    this.formBlkExpedient.disable();
    this.formTable1 = this.fb.group({
      detail: [null],
    });
    this.formTable2 = this.fb.group({
      detail: [null],
    });
  }

  onSubmit() {}

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
    const data = await this.data1.getAll();
    if (data.length > 0) {
      if (['CERRADO', 'CERRADA'].includes(this.form.get('statusAct').value)) {
        this.global.cerrada = 'S';
      } else {
        this.global.cerrada = 'N';
      }
      this.pupMovimientoActa();
    } else {
      this.alert(
        'warning',
        this.title,
        'El Acta no contiene Bienes ingresados.'
      );
    }
  }

  async pupMovimientoActa() {
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
          'error',
          this.title,
          'El acta ya esta cerrada, no puede realizar modificaciones a esta'
        );
      } else {
        const data: any[] = await this.data1.getAll();
        data.forEach(item => {
          if (item.id === this.selectedGood2.numberGood) {
            item.di_disponible = 'S';
          }
        });
        this.data1.load(data);
        this.data1.refresh();
        this.deleteDetailProceedingsDevolution(
          this.selectedGood2.numberGood,
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
        this.getDetailProceedingsDevolution(numberProceedings);
        this.alert(
          'success',
          this.title,
          'Se ha eliminado el registro correctamente'
        );
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
        this.getDetailProceedingsDevolution(numberProceedings);
      },
      error: error => {
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
    localStorage.setItem('expediente', this.expediente.toString());
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

  search(term: number | string) {
    this.expediente = Number(term);
    const params: ListParams = {};
    params['filter.id'] = `$eq:${this.expediente}`;
    this.expedientService.getAll(params).subscribe({
      next: resp => {
        console.log(resp);
        this.formBlkExpedient.controls['averiguacionPrevia'].setValue(
          resp.data[0].preliminaryInquiry
        );
        this.formBlkExpedient.controls['causePenal'].setValue(
          resp.data[0].criminalCase
        );
        this.relationsExpedient();
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
    this.proceedingsDetailDel.getProceeding2(this.expediente).subscribe(
      response => {
        console.log(response);
        if (response == null) {
          this.alert('info', this.title, 'No se encontrarón registros', '');
          return;
        }

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
          this.datePipe.transform(
            response.data[0].elaborationDate,
            'dd/MM/yyyy'
          )
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
          response.data[0].numTransfer.key
        );
        this.form.controls['universalFolio'].setValue(
          response.data[0].universalFolio
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
        this.getDetailProceedingsDevolution(this.form.controls['noActa'].value);
      },
      error => {
        this.alert(
          'error',
          this.title,
          'No se encontraron registros con este numero'
        );
      }
    );
  }

  getGoods(): void {
    console.log('ENTRO A BUSCAR BIENES');
    this.loading = true;
    let params = {
      ...this.params,
      ...this.columnFilters,
    };
    params['filter.fileNumber'] = `$eq:${this.expediente}`;
    this.goodService.getAll(params).subscribe({
      next: async response => {
        console.log(response);
        const datos = await Promise.all(
          response.data.map(async (item: IGood) => {
            const acta = await this.getActDescription(
              item.goodId,
              item.fileNumber
            );
            const di_disponible = await this.getDisponible(item.goodId);
            return {
              ...item,
              acta,
              di_disponible,
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

  getActDescription(goodNumber: number, fileNumber: number) {
    return new Promise<string>((res, _rej) => {
      const model = {
        goodNumber,
        fileNumber,
      };
      this.proceedingService.getAct(model).subscribe({
        next: (response: any) => {
          res(response.data[0].cve_acta);
        },
        error: error => {
          console.log(error);
          res(null);
        },
      });
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

  getDetailProceedingsDevolution(numberAct: number) {
    this.loading2 = true;
    let params = {
      ...this.params2,
      ...this.columnFilters2,
    };
    params['filter.numberProceedings'] = `$eq:${numberAct}`;
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

  manejarTipoActa(event: any): void {
    console.log(event);
    /* const idTipoActaControl = form.get('idTipoActa') as FormControl;
    const identificadorControl = form.get('identificador') as FormControl;
    const asunControl = form.get('asun') as FormControl; */ // Supongo que asun es el nombre de tu control
    const idTipoActaValue = event;

    /* if (idTipoActaValue === 'S/DON' || idTipoActaValue === 'C/DON') {
      identificadorControl.setValue('DON');
      asunControl.disable();
      asunControl.disable();
    } else if (idTipoActaValue === 'S/DES' || idTipoActaValue === 'C/DES') {
      identificadorControl.setValue('DES');
      asunControl.disable();
      asunControl.disable();
    } else if (idTipoActaValue === 'S/DEV' || idTipoActaValue === 'C/DEV') {
      identificadorControl.setValue('DEV');
      asunControl.disable();
      asunControl.disable();
    } else if (idTipoActaValue === 'S/VEN') {
      // LIP_MENSAJE('BLK_ACT','A'); // No estoy seguro de cómo implementar esta función.
      // Supongo que es una función para mostrar un mensaje, podrías usar un MatSnackBar por ejemplo.
      form.get('asun').enable();
      form.get('asun').disable();
    } else if (idTipoActaValue === 'C/VNR') {
      // Aquí deberías implementar tu lógica para mostrar un mensaje de confirmación y realizar acciones basadas en la respuesta.
      // IF LIF_MENSAJE_SI_NO(...) = 'S' THEN
      // ...
      // GO_ITEM('BLK_VNR.ID_EVENTO');
      // ...
      // GO_ITEM('BLK_VNR.ID_EVENTO');
      // ...
      // ELSE
      // ...
      // END IF;
    } */
  }
}
