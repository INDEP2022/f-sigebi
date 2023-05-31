import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  lastValueFrom,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { DateCellComponent } from 'src/app/@standalone/smart-table/date-cell/date-cell.component';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodIndicator } from 'src/app/core/models/ms-event-programming/good-indicators.model';
import { IParameters } from 'src/app/core/models/ms-parametergood/parameters.model';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { EventProgrammingService } from 'src/app/core/services/ms-event-programming/event-programing.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { IndicatorsParametersService } from 'src/app/core/services/ms-parametergood/indicators-parameter.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import {
  ProceedingsDeliveryReceptionService,
  ProceedingsDetailDeliveryReceptionService,
} from 'src/app/core/services/ms-proceedings';
import { IndUserService } from 'src/app/core/services/ms-users/ind-user.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import {
  COLUMNS_CAPTURE_EVENTS,
  COLUMNS_CAPTURE_EVENTS_2,
} from './columns-capture-events';
import { SmartDateInputHeaderDirective } from './directives/smart-date-input.directive';
import { CaptureEventProceeding } from './utils/capture-event-proceeding';
import {
  CaptureEventRegisterForm,
  CaptureEventSiabForm,
} from './utils/capture-events-forms';
import { EventCaptureButtons } from './utils/event-capture-butttons';

interface IBlkCtrl {
  component: string | number;
  typeNum: string | number;
  typeNumCant: string | number;
  userLevel: string | number;
  reopenInd: string | number;
  cEvent: number;
  cQuantity: number;
  cSelAll: number;
  goodQuantity: number;
  asigTm: string | number;
  asigCb: string | number;
}

interface IGlobalV {
  paperworkArea: string;
  proceedingNum: number;
  noClosed: number;
  type: string;
  tran: string;
  cons: string;
  regi: string;
}

interface IBlkProceeding {
  txtCrtSus1: string | number;
}
@Component({
  selector: 'app-event-capture',
  templateUrl: './event-capture.component.html',
  styles: [
    `
      .r-label {
        margin-top: -14px !important;
      }
    `,
  ],
})
export class EventCaptureComponent
  extends BasePage
  implements OnInit, AfterViewInit, AfterContentInit
{
  @ViewChildren(SmartDateInputHeaderDirective, { read: ElementRef })
  private itemsElements: QueryList<ElementRef>;
  eventTypes = new DefaultSelect([
    { area_tramite: 'OP', descripcion: 'Oficialía de partes' },
  ]);
  typeOtions = new DefaultSelect([
    { value: 'RT', label: 'RT' },
    { value: 'A', label: 'A' },
    { value: 'D', label: 'D' },
  ]);

  progOptions = new DefaultSelect([
    { value: 'R', label: 'R' },
    { value: 'E', label: 'E' },
  ]);

  programedOptions = new DefaultSelect([
    { value: 0, label: 'Día a Día' },
    { value: 1, label: 'Desalojo' },
  ]);
  areas = new DefaultSelect();
  transfers = new DefaultSelect();
  users = new DefaultSelect();
  form = this.fb.group(new CaptureEventRegisterForm());
  formSiab = this.fb.group(new CaptureEventSiabForm());
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  detail: IGoodIndicator[] = [];
  ctrlButtons = new EventCaptureButtons();
  blkCtrl: IBlkCtrl = {
    component: null, // COMPONENTE
    typeNum: null, // NO_TIPO
    typeNumCant: null, // NO_TIPO_CANT
    userLevel: null, // NIVEL_USUARIO
    reopenInd: null, // IND_REAPERTURA

    cEvent: 0, // C_EVENTO
    cQuantity: 0, // C_CANTIDAD
    cSelAll: 0, // SEL_TODO
    goodQuantity: 0, //CANT_BIEN
    asigTm: null,
    asigCb: null,
  };

  blkProceeding: IBlkProceeding = {
    txtCrtSus1: null,
  };
  packNumCtrl = new FormControl(null);
  showPackNumCtrl = false;

  global: IGlobalV = {
    paperworkArea: 'RF', // AREA_TRAMITE
    proceedingNum: 821325, // NO_ACTA
    noClosed: null, //no_cerrado
    type: null, //TIPO
    tran: null, //TRAN
    regi: null, //REGI
    cons: null, //CONS
  };

  authUser: string = null;
  authUserName: string = null;

  // ACTAS_ENTREGA_RECEPCION
  proceeding: IProceedingDeliveryReception = new CaptureEventProceeding();

  defatulInputShow = false;

  private stageCreda: number | string = null;

  get registerControls() {
    return this.form.controls;
  }

  get siabControls() {
    return this.formSiab.controls;
  }
  constructor(
    private fb: FormBuilder,
    private parameterGoodService: ParametersService,
    private gParameterService: GoodParametersService,
    private authService: AuthService,
    private router: Router,
    private indUserService: IndUserService,
    private indicatorParametersService: IndicatorsParametersService,
    private proceedingDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private rNomenclaService: RNomenclaService,
    private segAccessXAreas: SegAcessXAreasService,
    private eventProgrammingService: EventProgrammingService,
    private detailDeliveryReceptionService: ProceedingsDetailDeliveryReceptionService,
    private activatedRoute: ActivatedRoute,
    private expedientService: ExpedientService
  ) {
    super();
    this.authUser = this.authService.decodeToken().preferred_username;
    this.authUserName = this.authService.decodeToken().name;
    this.settings = {
      ...this.settings,
      columns: {
        ...COLUMNS_CAPTURE_EVENTS,
        start: {
          title: 'Inicio',
          sort: false,
          type: 'custom',
          showAlways: true,
          filter: {
            type: 'custom',
            component: DateCellComponent,
          },
          filterFunction: (value: any, query: any) => {
            if (query != 'skip') {
              this.detail = this.detail.map(d => {
                return { ...d, start: new Date(query) };
              });
            }
            return query;
          },
          renderComponent: DateCellComponent,
          onComponentInitFunction: (instance: DateCellComponent) =>
            this.test(instance),
        },
        end: {
          title: 'Finalización',
          sort: false,
          type: 'custom',
          showAlways: true,
          filter: {
            type: 'custom',
            component: DateCellComponent,
          },
          filterFunction: (value: any, query: any) => {
            console.log({ value, query });
          },
          renderComponent: DateCellComponent,
        },
        select: {
          title: 'Selec.',
          sort: false,
          type: 'custom',
          filter: false,
          showAlways: true,
          renderComponent: CheckboxElementComponent,
        },
        ...COLUMNS_CAPTURE_EVENTS_2,
      },
      hideSubHeader: false,
      actions: false,
    };
    this.activatedRoute.queryParams.subscribe(params => {
      this.global.proceedingNum = params['numeroActa'] ?? null;
      this.global.paperworkArea = params['tipoEvento'] ?? null;
    });

    console.log(this.global);
  }

  test(instance: DateCellComponent) {
    instance.inputChange.subscribe(val => {
      console.log(val);
    });
  }
  ngAfterContentInit(): void {
    console.log(this.itemsElements);
  }
  ngAfterViewInit(): void {
    console.log(this.itemsElements);
  }

  async transferClick() {
    const firstDetail = this.detail[0];
    console.log('llego', firstDetail);
    const { transference } = this.registerControls;
    if (!firstDetail) {
      transference.reset();
      return;
    }

    if (!firstDetail.expedientnumber) {
      transference.reset();
      return;
    }
    const { expedientnumber } = firstDetail;
    const identifier = await this.getExpedientById(expedientnumber);

    if (identifier == 'TRANS') {
      const { type, key } = await this.getTransferType(expedientnumber);
      if (type == 'E') {
        const tTrans = await this.getTTrans(expedientnumber);
        transference.setValue(tTrans);
      } else {
        transference.setValue(key);
      }
    } else {
      const tAseg = await this.getTAseg(expedientnumber);
      transference.setValue(tAseg);
    }

    const transferent = transference.value;
    this.transfers = new DefaultSelect([
      { value: transferent, label: transferent },
    ]);
  }

  async getTAseg(expedientId: string | number) {
    // TODO: IMPLEMENTAR LA INCIDENCIA 863
    return await lastValueFrom(of('EL FONHAPO'));
  }

  async getTTrans(expedientId: string | number) {
    // TODO: IMPLEMENTAR LA INCIDENCIA 863
    return await lastValueFrom(of('FONDO NACIONAL DE HABITACIONES POPULARES'));
  }

  async getTransferType(expedientId: string | number) {
    // TODO: IMPLEMENTAR LA INCIDENCIA 862
    return await lastValueFrom(of({ type: 'A', key: 'EL FONHAPO' }));
  }

  async getExpedientById(id: string | number) {
    return await lastValueFrom(
      this.expedientService
        .getById(id)
        .pipe(map(expedient => expedient.identifier))
    );
  }

  getUserDelegation() {
    const params = new FilterParams();
    params.addFilter('user', this.authUser);
    return lastValueFrom(
      this.segAccessXAreas
        .getAll(params.getParams())
        .pipe(map(res => res.data[0].delegationNumber))
    );
  }

  async getAreas(params: FilterParams) {
    const stage = await this.getStage();
    const delegation = await this.getUserDelegation();
    params.addFilter('stageedo', stage);
    params.addFilter('numberDelegation2', delegation);
    this.rNomenclaService.getAll(params.getParams()).subscribe({
      next: resp => {
        this.areas = new DefaultSelect(resp.data, resp.count);
      },
    });
  }

  goToGoodsTracker() {
    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FINDICA_0035_1',
      },
    });
  }

  async loadGoods() {
    const { area, keysProceedings, typeEvent } = this.registerControls;
    if (
      this.proceeding.statusProceedings == 'CERRADA' ||
      this.proceeding.statusProceedings == 'CERRADO'
    ) {
      this.alert('error', 'Error', 'El programa esta cerrado');
      return;
    }

    if (!typeEvent.value) {
      this.alert('error', 'Error', 'No se ha especificado el Tipo de Evento');
      return;
    }

    if (!keysProceedings.value) {
      this.alert('error', 'Error', 'No se ha ingresado el programa');
      return;
    }
    let continueProcess = false;
    if (this.blkCtrl.goodQuantity > 0) {
      const response = await this.alertQuestion(
        'warning',
        'Advertencia',
        'La asignación de bienes ya se ha realizado, se ejecuta nuevamente?'
      );
      continueProcess = response.isConfirmed;
    } else {
      const response = await this.alertQuestion(
        'warning',
        'Advertencia',
        'Quiere continuar con el proceso'
      );
      continueProcess = response.isConfirmed;
    }

    if (!continueProcess) {
      return;
    }

    this.createFilters();

    if (typeEvent.value == 'RT') {
      if (this.blkProceeding.txtCrtSus1) {
        this.pupUpdate();
      } else {
        this.frConditions();
      }
      this.blkCtrl.asigTm = 1;
      this.blkCtrl.asigCb = 1;
    } else {
      this.pupUpdate();
    }

    this.progTotal();
  }

  // PUP_TOTALES_PROG
  progTotal() {}

  // PUP_GENERA_WHERE
  createFilters() {}

  // PUP_ACTUALIZA
  pupUpdate() {}

  // PUP_CONDICIONES_FR
  frConditions() {}

  async getStage() {
    return await lastValueFrom(
      this.gParameterService
        .getPhaseEdo()
        .pipe(map(response => response.stagecreated))
    );
  }

  responsibleChange() {
    return this.registerControls.responsible.valueChanges.pipe(
      takeUntil(this.$unSubscribe),
      tap(value => {
        this.proceeding.responsible = value;
      })
    );
  }

  typeEventChange() {
    return this.registerControls.typeEvent.valueChanges.pipe(
      takeUntil(this.$unSubscribe),
      tap(value => {
        if (!value) return;
        this.showPackNumCtrl = false;
        this.ctrlButtons.convPack.hide();
        this.ctrlButtons.deletePack.hide();
        this.activeFields();
        this.setProg();
      })
    );
  }

  private setProg() {
    const prog = this.registerControls.typeEvent.value == 'RF' ? 'R' : 'E';
    this.registerControls.prog.setValue(prog);
  }

  async ngOnInit() {
    await this.initForm();
  }

  async generateCve() {
    const {
      keysProceedings,
      year,
      month,
      user,
      area,
      folio,
      prog,
      transference,
      type,
    } = this.registerControls;
    this.global.type = null;
    this.global.tran = null;
    this.global.regi = null;
    const splitedArea = keysProceedings?.value?.split('/');
    const _area = splitedArea ? splitedArea[3] : null;
    const cons = splitedArea ? splitedArea[5] : null;

    this.setProg();
    const currentDate = new Date();
    const currentMonth = `${currentDate.getMonth()}`.padStart(2, '0');
    year.setValue(currentDate.getFullYear());
    month.setValue(currentMonth);
    user.setValue(this.authUser);
    // TODO: PASAR A LA FORMA CORRECTA "VALUE" Y "LABEL"
    this.users = new DefaultSelect([
      { value: this.authUser, label: this.authUserName },
    ]);
    this.validateTransfer(type.value ?? 'RT', transference.value);

    if (!area.value) {
      if (!_area) {
        this.global.regi = null;
        this.global.cons = null;
      } else {
        this.global.regi = _area;
        this.global.cons = cons;
      }
    } else {
      this.global.regi = area.value;
      const indicator = await this.getProceedingType();
      const _folio = await this.getFolio(indicator.certificateType);
      this.global.cons = `${_folio}`.padStart(5, '0');
    }

    if (!this.global.type) {
      this.global.type = 'RT';
    }
    const cve = `${this.global.type ?? ''}/${prog.value ?? ''}/${
      this.global.tran ?? ''
    }/${this.global.regi ?? ''}/${user.value ?? ''}/${this.global.cons ?? ''}/${
      year.value ?? ''
    }/${month.value ?? ''}`;
    keysProceedings.setValue(cve);
  }

  async getFolio(typeProceeding: string) {
    const { type, area, year } = this.registerControls;
    const body = {
      typeProceeding,
      type: type.value,
      regional: area.value,
      year: `${year.value}`.slice(-2),
    };
    return await lastValueFrom(
      this.eventProgrammingService.getFolio(body).pipe(
        catchError(error => {
          if (error.status >= 500) {
            this.onLoadToast(
              'error',
              'Error',
              'Error en la localización del folio'
            );
          }
          return throwError(() => error);
        }),
        map(response => response.folio)
      )
    );
  }

  // PUP_VAL_TRANF
  validateTransfer(_type: string, transfer: string) {
    const { keysProceedings } = this.registerControls;
    const splitedArea = keysProceedings?.value?.split('/');
    const cveType = splitedArea ? splitedArea[0] : null;
    const tran = splitedArea ? splitedArea[2] : null;
    const area = splitedArea ? splitedArea[3] : null;
    if (!transfer) {
      if (!cveType) {
        this.global.type = _type;
      } else {
        this.global.type = cveType == _type ? cveType : _type;
      }

      if (!tran) {
        this.global.tran = null;
      } else {
        if (
          (tran == 'PGR' || tran == 'PJF') &&
          (_type == 'D' || _type == 'A')
        ) {
          this.global.tran = tran;
          this.global.type = _type;
        } else if (
          tran != 'PGR' &&
          tran != 'PJF' &&
          (_type == 'D' || _type == 'A')
        ) {
          this.invalidTransfer();
        } else if ((tran == 'PGR' || tran == 'PJF') && _type == 'RT') {
          this.invalidTransfer();
        } else if (tran != 'PGR' && tran != 'PJF' && _type == 'RT') {
          this.global.tran = tran;
          this.global.type = _type;
        }
      }
    } else {
      // if(tran == transfer)  {
      if (
        (transfer == 'PGR' || transfer == 'PJF') &&
        (_type == 'D' || _type == 'A')
      ) {
        this.global.tran = transfer;
        this.global.type = _type;
      } else if (
        transfer != 'PGR' &&
        transfer != 'PJF' &&
        (_type == 'D' || _type == 'A')
      ) {
        this.invalidTransfer();
      } else if ((transfer == 'PGR' || transfer == 'PJF') && _type == 'RT') {
        this.invalidTransfer();
      } else if (transfer != 'PGR' && transfer != 'PJF' && _type == 'Rt') {
        this.global.tran = transfer;
        this.global.type = _type;
      }
      // }
    }
  }

  invalidTransfer() {
    this.global.tran = null;
    this.onLoadToast(
      'error',
      'Error',
      'La transferente no es válida para este tipo'
    );
  }

  getInitialParameter() {
    this.parameterGoodService
      .getById('SSF3_NOM_COMPONENTE')
      .pipe(map((parameter: any) => parameter as IParameters))
      .subscribe({
        next: parameter => {
          this.blkCtrl.component = parameter.initialValue + '';
        },
        error: () => {
          this.errorForm(
            'No se encontró el componente parametrizado del servidor de imagenes'
          );
        },
      });
  }

  getUserLevel() {
    return this.indUserService.getMinIndUser(this.authUser, 2).pipe(
      catchError(error => {
        this.errorForm('No se encontró el nivel de usuario');
        return throwError(() => error);
      }),
      switchMap(indicator =>
        this.eventProgrammingService
          .valUserInd({
            user: this.authUser,
            indicator,
          })
          .pipe(
            catchError(error => {
              this.errorForm('No se encontró el nivel de usuario');
              return throwError(() => error);
            })
          )
      ),
      tap(({ level }) => {
        if (!level) {
          this.errorForm('No se encontró el nivel de usuario');
          return;
        }
        this.blkCtrl.userLevel = Number(level);
      })
    );
  }

  getIndReopen() {
    return of(1).pipe(
      tap(account => {
        this.blkCtrl.reopenInd = account > 0 ? 0 : 1;
      })
    );
    // return of(0)
  }

  // CU_AREA_E
  async getAreasE() {}
  // CU_AREA_R;
  async getAreasR() {
    return await lastValueFrom(
      this.proceedingDeliveryReceptionService
        .getByUserAndArea(this.authUser, 'RF')
        .pipe(
          catchError(error => {
            if (error.status < 500) {
              this.onLoadToast(
                'error',
                ' Error',
                'No existen tipos de evento para el usuario ' + this.authUser
              );
            }
            return throwError(() => error);
          }),
          tap(response => {
            const def = {
              area_tramite: 'OP',
              descripcion: 'Oficialía de partes',
            };
            this.eventTypes = new DefaultSelect(
              [response, def],
              response.count
            );
          })
        )
    );
  }

  async initForm() {
    this.getInitialParameter();

    this.getUserLevel().subscribe();
    this.ctrlButtons.sendSise.hide();
    this.ctrlButtons.signOffice.hide();
    this.ctrlButtons.printOffice.hide();
    this.ctrlButtons.notificationDest.hide();

    const { typeEvent, prog, responsible } = this.registerControls;
    if (this.global.paperworkArea == 'RF') {
      this.ctrlButtons.closeProg.hide();

      if (this.global.proceedingNum == null) {
        this.blkCtrl.reopenInd = 1;
      } else {
        this.getIndReopen().subscribe();
      }
      await this.getAreasR();
    } else {
      this.ctrlButtons.closeProg.show();
      // TODO: LLenar los datos con la consulta de "CU_AREA_E"
    }

    typeEvent.setValue(this.global.paperworkArea);
    if (typeEvent.value == 'DS') {
      this.ctrlButtons.convPack.show();
    }

    if (typeEvent.value == 'DN') {
      this.ctrlButtons.convPack.show();
      this.ctrlButtons.deletePack.show();
      this.showPackNumCtrl = true;
    }
    const params = new FilterParams();
    if (this.global.proceedingNum) {
      const indicator = await this.getProceedingType();
      // console.log(indicator.procedureArea.id);
      params.addFilter('typeProceedings', indicator.certificateType);
      params.addFilter('id', this.global.proceedingNum);
      await this.getProceeding(params);
    }

    if (typeEvent.value) {
      this.activeFields();
    }

    if (typeEvent.value == 'RF') {
      prog.setValue('R');
      // TODO: CAMBIAR EL NOMBRE DE LOS ENCABEZADOS
    } else {
      prog.setValue('E');
      // TODO: CAMBIAR EL NOMBRE DE LOS ENCABEZADOS
    }
    this.blkCtrl.cEvent = 0;
    this.blkCtrl.cQuantity = 0;
    this.blkCtrl.cSelAll = 0;

    if (
      this.proceeding.statusProceedings == 'CERRADO' ||
      this.proceeding.statusProceedings == 'CERRADA'
    ) {
      if (typeEvent.value == 'RF') {
        this.ctrlButtons.closeProg.show();
      }
      this.ctrlButtons.closeProg.setText('Abrir Prog.');
    } else if (
      this.proceeding.statusProceedings == 'ABIERTO' ||
      this.proceeding.statusProceedings == 'ABIERTA'
    ) {
      this.ctrlButtons.closeProg.setText('Cerrar Prog.');
    } else if (this.proceeding.statusProceedings == null) {
      this.ctrlButtons.closeProg.setText('Cerrar Prog.');
      if (this.authUser.startsWith('TLP')) {
        responsible.setValue('TLP');
        this.proceeding.responsible = 'TLP';
      } else {
        this.proceeding.responsible = responsible.value;
      }
    }

    if (
      this.proceeding.statusProceedings == 'ABIERTO' ||
      this.proceeding.statusProceedings == 'ABIERTA'
    ) {
      this.global.noClosed = 1;
    } else {
      this.global.noClosed = 0;
    }
  }

  // PUP_ACTIVA_CAMPOS
  activeFields() {
    const { typeEvent } = this.registerControls;
    if (typeEvent.value == 'RF') {
      const FEC_APROBACION_X_ADMON = 'Inicio';
    } else if (typeEvent.value == 'DN') {
      const LOC_TRANSF = 'Dictamen Donación';
      const FEC_APROBACION_X_ADMON = 'Entrega';
    } else if (typeEvent.value == 'DV') {
      const LOC_TRANSF = 'Dictamen Devolución';
    } else if (typeEvent.value == 'CM') {
      const LOC_TRANSF = 'Dictamen Procedencia';
      const FEC_APROBACION_X_ADMON = 'Entrega';
    } else if (typeEvent.value == 'DS') {
      const LOC_TRANSF = 'Dictamen Destrucción';
      const FEC_APROBACION_X_ADMON = 'Entrega';
    }
  }

  async getProceeding(params: FilterParams) {
    return await lastValueFrom(
      this.proceedingDeliveryReceptionService.getAll(params.getParams()).pipe(
        tap(res => {
          this.proceeding = res.data[0];
          const form = {
            captureDate: new Date(res.data[0].captureDate),
            keysProceedings: res.data[0].keysProceedings,
            responsible: res.data[0].responsible,
          };
          this.form.patchValue(form);
          this.getDetail().subscribe();
        })
      )
    );
  }

  getDetail() {
    const params = new FilterParams();
    params.addFilter('numberProceedings', this.proceeding.id);
    return this.eventProgrammingService
      .getGoodsIndicators(this.proceeding.id)
      .pipe(
        tap(res => {
          this.detail = res.data.map(detail => {
            const { typeEvent } = this.registerControls;
            let locTrans = '';
            if (typeEvent.value == 'RF') {
              if (this.blkProceeding.txtCrtSus1) {
                locTrans = detail.warehouselocation;
              } else {
                locTrans = detail.transferentcity;
              }
            } else {
              switch (typeEvent.value) {
                case 'DN':
                  locTrans = detail.donationcontractkey;
                  break;
                case 'DV':
                  locTrans = detail.devolutionproceedingkey;
                  break;
                case 'CM':
                  locTrans = detail.dictationkey;
                  break;
                case 'DS':
                  locTrans = detail.destructionproceedingkey;
                  break;
                default:
                  break;
              }
            }
            return { ...detail, locTrans };
          });
        })
      );
  }

  patchProceedingValue(proceeding: IProceedings) {}

  async getProceedingType() {
    const { typeEvent } = this.registerControls;
    const params = new FilterParams();
    params.addFilter('procedureArea', typeEvent.value);
    return await lastValueFrom(
      this.indicatorParametersService.getAll(params.getParams()).pipe(
        catchError(error => {
          this.alert('error', 'Error', 'No se localizo el tipo de acta');
          return throwError(() => error);
        }),
        map(response => response.data[0])
      )
    );
  }

  onSubmit() {}

  onSubmit2() {}

  search() {}

  errorForm(message?: string) {
    if (message) {
      this.alert('error', 'Error', message);
    }
    // this.router.navigate([HOME_DEFAULT]);
  }
}
