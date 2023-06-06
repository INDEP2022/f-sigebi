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
  skip,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { DateCellComponent } from 'src/app/@standalone/smart-table/date-cell/date-cell.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { _Params } from 'src/app/common/services/http.service';
import { maxDate, minDate } from 'src/app/common/validations/date.validators';
import {
  IHistoryProcesdingAct,
  IPAAbrirActasPrograma,
  IPACambioStatusGood,
  ITmpProgValidation,
} from 'src/app/core/models/good-programming/good-programming';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGoodIndicator } from 'src/app/core/models/ms-event-programming/good-indicators.model';
import { IParameters } from 'src/app/core/models/ms-parametergood/parameters.model';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import {
  IProceedings,
  IUpdateActasEntregaRecepcion,
} from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { EventProgrammingService } from 'src/app/core/services/ms-event-programming/event-programing.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodParametersService } from 'src/app/core/services/ms-good-parameters/good-parameters.service';
import { FIndicaService } from 'src/app/core/services/ms-good/findica.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { IndicatorsParametersService } from 'src/app/core/services/ms-parametergood/indicators-parameter.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import {
  ProceedingsDeliveryReceptionService,
  ProceedingsDetailDeliveryReceptionService,
  ProceedingsService,
} from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodsService } from 'src/app/core/services/ms-programming-good/programming-good.service';
import { TmpContProgrammingService } from 'src/app/core/services/ms-programming-good/tmp-cont-programming.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { IndUserService } from 'src/app/core/services/ms-users/ind-user.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
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
  typeNumCant: number;
  userLevel: string | number;
  reopenInd: string | number;
  cEvent: number;
  cQuantity: number;
  cSelAll: number;
  goodQuantity: number;
  asigTm: string | number;
  asigCb: string | number;
  txtDirSatLabel: string;
  txtDirSat: string;
  processingArea: string | number;
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
  txtCrtSus1: string;
  txtCrtSus2: string;
}
@Component({
  selector: 'app-event-capture',
  templateUrl: './event-capture.component.html',
  styles: [
    `
      .r-label {
        margin-top: -14px !important;
      }

      .cantidad {
        border-radius: 10px;
        border: 1px solid #eaeaeaea;
        // width: 150px;
        padding: 8px 10px;
        position: relative;
        top: -19px;
        margin: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 0px 20px 0px rgba(69, 90, 100, 0.08) !important;

        @media screen and (max-width: 576px) {
          margin-top: 10px;
        }
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
  saveLoading = false;
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
  originalType: string = null;
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
    txtDirSatLabel: 'Vo. Bo. de Sat',
    txtDirSat: null,
    cEvent: 0, // C_EVENTO
    cQuantity: 0, // C_CANTIDAD
    cSelAll: 0, // SEL_TODO
    goodQuantity: 0, //CANT_BIEN
    asigTm: null,
    asigCb: null,
    processingArea: null,
  };

  blkProceeding: IBlkProceeding = {
    txtCrtSus1: null,
    txtCrtSus2: null,
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

  // BLK_CANT
  blkQuantities = {
    goods: 0,
    registers: 0,
    expedients: 0,
    dictums: 0,
  };

  handoverReceptionMinutes = {
    statusAct: 'CERRADO',
    typeAct: '',
    actaNumber: 1,
    folio: 1,
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

  gInitialDate: Date;
  gFinalDate: Date;

  startDateCtrl = new FormControl<Date>(null, minDate(new Date()));
  endDateCtrl = new FormControl<Date>(null);

  selectedProceedings: IGoodIndicator[] = [];

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
    private expedientService: ExpedientService,
    private dynamicCatalogService: DynamicCatalogService,
    private procedureManagementService: ProcedureManagementService,
    private procudeServ: ProcedureManagementService,
    private security: SecurityService,
    private progammingServ: ProgrammingGoodService,
    private documentsService: DocumentsService,
    private proceedingsService: ProceedingsService,
    private programmingGoodService: ProgrammingGoodsService,
    private tmpContProgrammingService: TmpContProgrammingService,
    private fIndicaService: FIndicaService,
    private excelService: ExcelService,
    private goodPosessionThirdpartyService: GoodPosessionThirdpartyService,
    private massiveGoodService: MassiveGoodService
  ) {
    super();
    this.authUser = this.authService.decodeToken().preferred_username;
    this.authUserName = this.authService.decodeToken().name;
    this.settings = {
      ...this.settings,
      columns: {
        ...COLUMNS_CAPTURE_EVENTS,
        dateapprovalxadmon: {
          title: 'Inicio',
          sort: false,
          type: 'custom',
          showAlways: true,
          renderComponent: DateCellComponent,
          onComponentInitFunction: (instance: DateCellComponent) =>
            this.setStartDate(instance),
        },
        dateindicatesuserapproval: {
          title: 'Finalización',
          sort: false,
          type: 'custom',
          showAlways: true,
          renderComponent: DateCellComponent,
          onComponentInitFunction: (instance: DateCellComponent) =>
            this.setEndDate(instance),
        },
        ...COLUMNS_CAPTURE_EVENTS_2,
        select: {
          title: 'Seleccionar',
          sort: false,
          type: 'custom',
          filter: false,
          showAlways: true,
          renderComponent: CheckboxElementComponent,
          valuePrepareFunction: (departament: any, row: any) =>
            this.isProceedingSelected(row),
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.proceedingSelectChange(instance),
        },
      },
      // hideSubHeader: false,
      actions: false,
    };
    this.activatedRoute.queryParams.subscribe(params => {
      this.global.proceedingNum = params['numeroActa'] ?? null;
      this.global.paperworkArea = params['tipoEvento'] ?? null;
    });
  }

  onSelectProceeding(notification: any, selected: boolean) {
    if (selected) {
      this.selectedProceedings.push(notification);
    } else {
      this.selectedProceedings = this.selectedProceedings.filter(
        proc => proc.goodnumber != proc.goodnumber
      );
    }
  }

  proceedingSelectChange(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.onSelectProceeding(data.row, data.toggle),
    });
  }

  isProceedingSelected(proceeding: IGoodIndicator) {
    const exists = this.selectedProceedings.find(
      prc => prc.goodnumber == proceeding.goodnumber
    );
    if (!exists) return false;
    return true;
  }

  setStartDate(instance: DateCellComponent) {
    instance.inputChange.subscribe(val => {
      const { row, value } = val;
      row.dateapprovalxadmon = value;
      this.updateDetail(row);
    });
  }

  setEndDate(instance: DateCellComponent) {
    instance.inputChange.subscribe(val => {
      const { row, value } = val;
      row.dateindicatesuserapproval = value;
      this.updateDetail(row);
    });
  }

  updateDetail(detail: any) {
    const data = {
      numberProceedings: this.proceeding.id,
      numberGood: detail.goodnumber,
      approvedDateXAdmon: detail.dateapprovalxadmon,
      dateIndicatesUserApproval: detail.dateindicatesuserapproval,
    };
    this.loading = true;
    this.detailDeliveryReceptionService.update(data as any).subscribe({
      next: res => {
        this.loading = false;
        this.onLoadToast('success', 'Fecha actualizada');
      },
      error: error => {
        this.loading = false;
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrió un error al actualizar la fecha'
        );
      },
    });
  }

  async saveProceeding() {
    if (this.proceeding.id) {
      this.updateProceeding().subscribe();
      return;
    }
    await this.createProceeding();
  }

  updateProceeding() {
    console.log(this.proceeding);
    const formValue = this.form.value;
    const { numFile, keysProceedings, captureDate, responsible } = formValue;
    console.log({ numFile, keysProceedings, captureDate, responsible });
    const data = {
      ...this.proceeding,
      numFile,
      keysProceedings,
      captureDate,
      responsible,
    };

    return this.proceedingDeliveryReceptionService
      .update(this.proceeding.id, data as any)
      .pipe(tap(() => this.onLoadToast('success', 'Acta actualizada')));
  }

  excelExport() {
    if (this.detail.length === 0) {
      this.alert('warning', 'Advertencia', 'No hay datos para exportar');
      return;
    }
    const cve = this.registerControls.keysProceedings.value;
    const dataToExport = this.detail.map((det: any) => {
      return {
        'CVE Acta': cve,
        'Localidad Ent': det.locTrans,
        'No Bien': det.goodnumber,
        Estatus: det.status,
        Proceso: det.proccessextdom,
        Descripción: det.description,
        'Tipo Bien': det.typegood,
        Expediente: det.expedientnumber,
        Inicio: det.dateapprovalxadmon,
        Finalizacion: det.dateindicatesuserapproval,
      };
    });
    this.excelService.export(dataToExport, { filename: cve });
  }

  udpateProceedingExpedient() {
    const { numFile } = this.proceeding;
    return this.proceedingDeliveryReceptionService
      .update(this.proceeding.id, { numFile } as any)
      .pipe();
  }

  async createProceeding() {
    await this.generateCve();
    const formValue = this.form.value;
    const { numFile, keysProceedings, captureDate, responsible } = formValue;
    if (!responsible) {
      this.alert('error', 'Error', 'Eliga un responsable');
      return;
    }
    if (!numFile) {
      formValue.numFile = 2;
    }
    const elaborationDate = new Date();
    const statusProceedings = 'ABIERTA';
    const typeProceedings = this.originalType;
    const elaborate = this.authUser;
    const numDelegation1 = await this.getUserDelegation();
    const dataToSave = {
      keysProceedings,
      elaborationDate,
      captureDate,
      responsible,
      numFile: formValue.numFile,
      statusProceedings,
      typeProceedings,
      elaborate,
      numDelegation1,
    } as any;
    this.saveLoading = true;
    this.proceedingDeliveryReceptionService.create(dataToSave).subscribe({
      next: async res => {
        this.saveLoading = false;
        this.onLoadToast('success', 'Acta Generada Correctamente');
        this.global.proceedingNum = res.id;
        this.global.paperworkArea = this.originalType;
        await this.initForm();
        console.log(this.proceeding.keysProceedings);
        this.registerControls.keysProceedings.setValue(
          this.proceeding.keysProceedings
        );
        // await this.generateCve();
      },
      error: error => {
        this.saveLoading = false;
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrió un error al guardar el acta'
        );
      },
    });
  }

  changeStartDate(start: Date) {
    if (start) {
      this.endDateCtrl.addValidators(minDate(start));
    } else {
      this.endDateCtrl.clearValidators();
    }
  }

  changeEndDate(end: Date) {
    if (end) {
      this.startDateCtrl.addValidators(maxDate(end));
    } else {
      this.startDateCtrl.clearValidators();
    }

    this.startDateCtrl.addValidators(minDate(new Date()));
  }

  validateDates() {
    const start = this.startDateCtrl.value;
    const end = this.endDateCtrl.value;
    if (!start) {
      this.throwDateErrors('La fecha inicial no puede se nula');
      return;
    }

    if (!end) {
      this.throwDateErrors('La fecha final no puede ser nula');
      return;
    }

    this.detailDeliveryReceptionService
      .updateMassiveNew(
        start.toLocaleDateString(),
        end.toLocaleDateString(),
        Number(this.proceeding.id)
      )
      .subscribe({
        next: data => {
          this.onLoadToast('success', 'Fechas actualizadas');
          this.getDetail().subscribe();
        },
        error: error => {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio un error al actualizar las fechas'
          );
        },
      });
  }

  throwDateErrors(message: string) {
    this.onLoadToast('error', 'Error', message);
  }

  ngAfterContentInit(): void {
    console.log(this.itemsElements);
  }
  ngAfterViewInit(): void {
    console.log(this.itemsElements);
  }

  async transferClick() {
    const firstDetail = this.detail[0];
    const { transference, type } = this.registerControls;
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

    if (transference.value == 'PGR' || transference.value == 'PJF') {
      type.setValue('A');
    } else {
      type.setValue('RT');
    }

    await this.generateCve();
  }

  async getTAseg(expedientId: string | number) {
    return await lastValueFrom(
      this.dynamicCatalogService
        .getClaveCTransparente(expedientId)
        .pipe(map(res => res.data[0].clave))
    );
  }

  async getTTrans(expedientId: string | number) {
    return await lastValueFrom(
      this.dynamicCatalogService
        .getDescEmisora(expedientId)
        .pipe(map(res => res.data[0].desc_emisora))
    );
  }

  async getTransferType(expedientId: string | number) {
    return await lastValueFrom(
      this.dynamicCatalogService.getIncapAndClave(expedientId).pipe(
        map(res => {
          return { type: res.data[0].coaelesce, key: res.data[0].clave };
        })
      )
    );
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
    if (!this.proceeding.id) {
      this.onLoadToast('error', 'Error', 'Primero debes guardar el acta');
      return;
    }
    const { area, keysProceedings, typeEvent } = this.registerControls;
    const totalFilters = Object.values(this.formSiab.value);
    const filters = totalFilters.map(filter =>
      Array.isArray(filter) ? filter.join(',') : filter
    );
    const nullFilters = filters.filter(filter => !filter);
    if (nullFilters.length == totalFilters.length) {
      this.onLoadToast(
        'error',
        'Error',
        'Debe ingresar almenos 1 parametro de busqueda'
      );
      return;
    }
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
        // this.pupUpdate();
      } else {
        // this.frConditions();
      }
      this.blkCtrl.asigTm = 1;
      this.blkCtrl.asigCb = 1;
    } else {
      // this.pupUpdate();
    }

    this.progTotal();
  }

  // PUP_TOTALES_PROG
  progTotal() {}

  // PUP_GENERA_WHERE
  createFilters() {
    const { typeEvent } = this.form.value;
    const {
      initialDate,
      finalDate,
      flyer,
      expedient,
      dictumCve,
      delegation,
      programed,
      cdonacCve,
      lot,
      donatNumber,
      adonacCve,
      event,
      warehouse,
      autoInitialDate,
      autoFinalDate,
      transfer,
      transmitter,
      authority,
    } = this.formSiab.value;
    const body = {
      startDate: initialDate,
      endDate: finalDate,
      processingArea: typeEvent,
      steeringWheel: flyer,
      proceedings: expedient,
      opinion: dictumCve,
      coordination: delegation.join(','),
      program: programed,
      cdonacKey: cdonacCve,
      idLot: lot,
      doneeNumber: donatNumber,
      adonacKey: adonacCve,
      idEvent: event,
      storeNumber: warehouse,
      iniAutDate: autoInitialDate,
      endAutDate: autoFinalDate,
      transferee: transfer.join(','),
      station: transmitter.join(','),
      authority: authority.join(','),
    };

    this.fIndicaService.pupGenerateWhere(body).subscribe(res => {
      console.log({ res });
      this.pupUpdate();
    });
  }

  // PUP_ACTUALIZA
  pupUpdate() {
    const { typeEvent } = this.registerControls;
    const { expedient } = this.formSiab.value;
    this.loading = true;
    this.fIndicaService
      .pupUpdate(typeEvent.value, expedient, this.proceeding.id)
      .subscribe({
        next: res => {
          if (res.data.length > 0) {
            this.onLoadToast('success', 'Bienes cargados correctamente');
          } else {
            this.onLoadToast('info', 'No se encontraron bienes para agregar');
          }
          this.loading = false;
          this.getDetail().subscribe();
        },
        error: error => {
          this.loading = false;
        },
      });
  }

  // PUP_CONDICIONES_FR
  frConditions() {
    this.pupUpdate();
  }

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
        this.generateCve();
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
    const { responsible } = this.registerControls;
    responsible.valueChanges.pipe(skip(1)).subscribe(() => {
      this.generateCve();
    });
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
    const __folio = splitedArea ? splitedArea[5] : null;
    const existingTrans = splitedArea ? splitedArea[2] : null;

    this.setProg();
    const currentDate = new Date();
    const currentMonth = `${currentDate.getMonth() + 1}`.padStart(2, '0');
    year.setValue(currentDate.getFullYear());
    month.setValue(currentMonth);
    user.setValue(this.authUser);
    // TODO: PASAR A LA FORMA CORRECTA "VALUE" Y "LABEL"
    this.users = new DefaultSelect([
      { value: this.authUser, label: this.authUserName },
    ]);
    if (existingTrans == 'PGR' || existingTrans == 'PJF') {
      type.setValue('A');
    } else {
      type.setValue('RT');
    }
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
    folio.setValue(this.global.cons);

    if (!this.global.type) {
      this.global.type = 'RT';
    }
    const cve = `${this.global.type ?? ''}/${prog.value ?? ''}/${
      this.global.tran ?? ''
    }/${this.global.regi ?? ''}/${user.value ?? ''}/${this.global.cons ?? ''}/${
      year.value ?? ''
    }/${month.value ?? ''}`;
    // .slice(-2)
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
    this.global.tran = transfer;
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
          console.log('1');
          this.invalidTransfer();
        } else if ((tran == 'PGR' || tran == 'PJF') && _type == 'RT') {
          console.log('2');
          this.invalidTransfer();
        } else if (tran != 'PGR' && tran != 'PJF' && _type == 'RT') {
          this.global.tran = tran;
          this.global.type = _type;
        }
      }
    } else {
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
        console.log('3');
        this.invalidTransfer();
      } else if ((transfer == 'PGR' || transfer == 'PJF') && _type == 'RT') {
        console.log('4');
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

  getType() {
    const params = new FilterParams();
    params.addFilter('certificateType', this.global.paperworkArea);
    return lastValueFrom(
      this.indicatorParametersService.getAll(params.getParams()).pipe(
        catchError(() => of(null)),
        map(res => res.data[0].procedureArea.id)
      )
    );
  }

  async initForm() {
    this.originalType = this.global.paperworkArea;
    this.getInitialParameter();
    if (this.global.paperworkArea) {
      this.global.paperworkArea = await this.getType();
    }
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
      console.log('muestra 790');
      this.ctrlButtons.closeProg.show();
      // TODO: LLenar los datos con la consulta de "CU_AREA_E"
    }

    typeEvent.setValue(this.global.paperworkArea);
    if (typeEvent.value == 'DS') {
      this.ctrlButtons.convPack.enable();
    }

    if (typeEvent.value == 'DN') {
      this.ctrlButtons.convPack.enable();
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
      this.ctrlButtons.closeProg.setText('Abrir Programación');
    } else if (
      this.proceeding.statusProceedings == 'ABIERTO' ||
      this.proceeding.statusProceedings == 'ABIERTA'
    ) {
      this.ctrlButtons.closeProg.setText('Cerrar Programación');
    } else if (this.proceeding.statusProceedings == null) {
      this.ctrlButtons.closeProg.setText('Cerrar Programación');
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
        tap(async res => {
          this.proceeding = res.data[0];
          const form = {
            captureDate: new Date(res.data[0].captureDate),
            keysProceedings: res.data[0].keysProceedings,
            responsible: res.data[0].responsible,
          };
          this.form.patchValue(form);
          await this.afterGetProceeding();

          this.getDetail().subscribe();
        })
      )
    );
  }

  async afterGetProceeding() {
    const { typeEvent } = this.registerControls;
    if (typeEvent.value == 'RF') {
      const count = (await this.getExpedientsCount()) ?? 0;
      console.log(count);
      const options = ['CERRADA', 'CERRADO'];
      if (options.find(opt => opt == this.proceeding.statusProceedings)) {
        this.ctrlButtons.closeProg.show();
        this.ctrlButtons.closeProg.label = 'Abrir Programación';
        if (count > 0) {
          if (this.proceeding.receiveBy != '1') {
            this.ctrlButtons.sendSise.show();
          } else {
            this.ctrlButtons.sendSise.hide();
          }
        } else {
          this.ctrlButtons.sendSise.hide();
        }
      } else {
        this.ctrlButtons.closeProg.label = 'Cerrar Programación';
        if (count > 0) {
          this.ctrlButtons.closeProg.hide();
        } else {
          if (this.proceeding.statusProceedings) {
            this.ctrlButtons.closeProg.show();
          }
        }
      }
    }

    await this.generateCve();
  }

  getDetail() {
    const params = new FilterParams();
    params.addFilter('numberProceedings', this.proceeding.id);
    this.loading = true;
    return this.eventProgrammingService
      .getGoodsIndicators(this.proceeding.id)
      .pipe(
        catchError(error => {
          this.loading = false;
          this.blkCtrl.goodQuantity = 0;
          this.detail = [];
          return throwError(() => error);
        }),
        tap(res => {
          this.loading = false;
          const detail = res.data[0];
          this.blkCtrl.goodQuantity = res.data.length;
          this.afterGetDetail(detail);
          this.detail = res.data.map(detail => {
            console.log(detail);
            if (
              detail.expedientnumber &&
              (this.proceeding.numFile == 2 || !this.proceeding.numFile)
            ) {
              this.proceeding.numFile = Number(detail.expedientnumber);
              this.udpateProceedingExpedient().subscribe();
            }
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

  // PA_CALCULA_CANTIDADES
  calculateQuantities() {
    console.log('xd');
    const { typeEvent } = this.registerControls;
    this.programmingGoodService
      .computeEntities(this.proceeding.id, typeEvent.value)
      .pipe(
        tap(() => {
          const params = new FilterParams();
          params.addFilter('minutesNumber', this.proceeding.id);
          return this.tmpContProgrammingService
            .computeEntities(params.getParams())
            .pipe(
              tap(response => {
                const count = response.data[0];
                if (count) {
                  const {
                    amountEstate,
                    recordsAmount,
                    amountfiles,
                    amountOpinions,
                  } = count;
                  this.blkQuantities.goods = Number(amountEstate);
                  this.blkQuantities.registers = Number(recordsAmount);
                  this.blkQuantities.expedients = Number(amountfiles);
                  this.blkQuantities.dictums = Number(amountOpinions);
                }
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  // DETALLE_ACTA_ENT_RECEP.POST_QUERY
  afterGetDetail(detail: IGoodIndicator) {
    const { typeEvent } = this.registerControls;
    this.blkCtrl.typeNum = detail.typegood;
    this.blkCtrl.typeNumCant = this.blkCtrl.typeNumCant ?? 0;
    if (typeEvent.value == 'RF' && detail.status == 'CPR') {
      (this.settings.columns as any).status.title = 'VA_CPR';
    }

    if (
      !this.blkProceeding.txtCrtSus1 &&
      detail.inventorysiabi?.split('-').length >= 3
    ) {
      this.blkProceeding.txtCrtSus1 = detail.inventorysiabi.split('-')[0];
      const firstDashIndex = detail.inventorysiabi.indexOf('-');
      const secondDashIndex = detail.inventorysiabi.indexOf(
        '-',
        firstDashIndex + 1
      );

      if (firstDashIndex !== -1 && secondDashIndex !== -1) {
        this.blkProceeding.txtCrtSus2 = detail.inventorysiabi.substring(
          firstDashIndex + 1,
          secondDashIndex
        );
      }

      this.blkProceeding.txtCrtSus2 =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(
          this.blkProceeding.txtCrtSus2.substring(0, 1)
        ) === -1
          ? '%'
          : (this.blkProceeding.txtCrtSus1 = '%');

      if (typeEvent.value == 'RF') {
        this.blkCtrl.txtDirSatLabel = 'Dirección';
        (this.settings.columns as any).locTrans.title = 'Almacén';
        this.blkCtrl.txtDirSat = detail.txt_dirsat;
      }
    }

    this.calculateQuantities();
    // TODO: PEDIR TODOS LOS CAMPOS DEL DETALLE
    // this.blkCtrl.cQuantity = (this.blkCtrl.cQuantity?? 0) + this.
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

  async getExpedientsCount() {
    const params = new FilterParams();
    params.addFilter('expedient', this.proceeding.numFile);
    params.addFilter('typeManagement', 2);
    return await lastValueFrom(
      this.procedureManagementService.getAllFiltered(params.getParams()).pipe(
        catchError(() => of({ count: 0 })),
        map(res => res.count)
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

  async notificationBtn() {
    let n_cont;
    let c_mail;
    let l_ban;
    let c_user;
    let v_usuariotlp: number = 0;
    let v_usuarioost: number = 0;

    const user = this.authService.decodeToken().name.toUpperCase();

    v_usuariotlp = user.indexOf('TLP');
    v_usuarioost = user.indexOf('OST');

    const STATUS = ['CERRADO', 'CERRADA'];

    if (
      !STATUS.includes(this.proceeding.statusProceedings) &&
      this.global.paperworkArea == 'RF' &&
      this.proceeding.numFile &&
      v_usuarioost == -1 &&
      v_usuariotlp == -1
    ) {
      const count = await new Promise<number>((resolve, reject) => {
        const filters = new FilterParams();
        filters.addFilter(
          'flierNumber',
          this.proceeding.numFile,
          SearchFilter.EQ
        );
        filters.addFilter('typeManagement', 2, SearchFilter.EQ);

        this.procudeServ.getAllFiltered(filters.getParams()).subscribe({
          next: resp => {
            resolve(resp.count);
          },
          error: () => {
            resolve(0);
          },
        });
      });

      if (count == 0) {
        this.emailInser();
      }
    } else if (v_usuarioost != -1 || v_usuariotlp != -1) {
      this.onLoadToast(
        'info',
        'Usuario TLP y OST, no puede cargar los correos de envió de convocatoria a SISE.'
      );
    }
  }

  async emailInser() {
    let c_mail: string;
    let l_ban: boolean;
    let c_user: string;

    const { user, mail } = await new Promise<any>((resolve, reject) => {
      const user = this.authService.decodeToken().name.toUpperCase();
      const filters = new FilterParams();
      filters.addFilter(
        'user',
        'ZLB11_130' /*this.proceeding.numFile*/,
        SearchFilter.EQ
      );

      this.security.getAllUsersTracker(filters.getParams()).subscribe({
        next: resp => {
          const user = resp.data[0].user;
          const mail = resp.data[0].mail;
          resolve({ user, mail });
        },
        error: () => {
          resolve({ user: '', mail: 'X' });
        },
      });
    });

    c_mail = mail;

    if (c_mail != 'X') {
      l_ban = true;
    }
  }

  async closeProg() {
    this.PUP_MOVIMINETO_PRO();
  }

  dateNow2Day(): Date {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2);
    return currentDate;
  }

  openMinutesProyect(model: IPAAbrirActasPrograma) {
    console.log(model);
    return new Promise((res, rej) => {
      this.progammingServ.paOpenProceedingProgam(model).subscribe({
        next: resp => {
          console.log(resp);
          res(resp);
        },
        error: error => error,
      });
    });
  }

  async PA_CAMBIO_ESTATUS_BIEN(model: IPACambioStatusGood) {
    return new Promise((res, rej) => {
      this.progammingServ.paChangeStatusGood(model).subscribe({
        next: resp => res(resp),
        error: error => rej(error),
      });
    });
  }

  returPreviosStatus(model: IPAAbrirActasPrograma) {
    this.progammingServ.paRegresaEstAnterior(model).subscribe({
      next: resp => resp,
      error: error => error,
    });
  }

  async tmpProgValidacion() {
    const filter = new FilterParams();
    const user = this.authService.decodeToken().username;
    filter.addFilter('valUser', user, SearchFilter.EQ);
    filter.addFilter('valMinutesNumber', this.proceeding.id, SearchFilter.EQ);
    return new Promise<ITmpProgValidation[]>((resolve, reject) => {
      this.progammingServ.getTmpProgValidation(filter.getParams()).subscribe({
        next: resp => {
          console.info(resp.data);
          resolve(resp.data);
        },
        error: error => {
          const err: ITmpProgValidation[] = [
            {
              valmovement: 0,
              valMessage: 'No se puede cerrar el acta',
              valMinutesNumber: 0,
              valUser: '',
            },
          ];
          resolve(err);
        },
      });
    });
  }

  async PUP_MOVIMINETO_PRO() {
    let LV_VALMOTOS: number;
    let LV_VALMENSA: string;
    const LV_PANTALLA: string = 'FINDICA_0035_1';
    let v_COUNT: number = 0;
    let c_STR: string;
    let c_MENSAJE: string = null;
    let n_FOLIO_UNIVERSAL: number;
    let n_CONT: number = 0;

    const C_DATVAL: any = await this.tmpProgValidacion();

    if (this.detail.length <= 0) {
      this.onLoadToast('info', 'No se tienen bienes ingresados.', '');
      return;
    }
    console.log('PAso bienes');

    if (this.global.paperworkArea === 'RF') {
      n_CONT = (await this.getExpedientsCount()) ?? 0;
    }
    console.log('PAso Parameter Area');

    if (['CERRADO', 'CERRADA'].includes(this.proceeding.statusProceedings)) {
      if (this.proceeding.typeProceedings === 'EVENTREC' && n_CONT > 0) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 2);
        const FEC_APROBACION_X_ADMON = new Date(
          this.proceeding.approvalDateXAdmon
        );
        if (currentDate >= FEC_APROBACION_X_ADMON) {
          this.onLoadToast(
            'info',
            'La programación no puede abrirse hasta 2 días antes del evento.'
          );
          return;
        }
      }
      await this.alertQuestion(
        'warning',
        'Abrir programación',
        `¿Está seguro de abrir la Programación ${this.proceeding.keysProceedings} ?`
      )
        .then(question => {
          if (question.isConfirmed) {
            this.openProg(C_DATVAL, n_CONT);
          }
        })
        .catch(error => console.error(error));
    } else {
      console.log('PASO --- Al else de no esta cerrada');
      /// this.onLoadToast('info','El estado del acta es diferente a CERRADO o CERRADA, no se puede abrir.');
      if (C_DATVAL[0].valmovement === null) {
        console.log('Entro a vacio');
        C_DATVAL[0].valmovement = 0;
      }
      if (C_DATVAL[0].valmovement === 1) {
        await this.valMotodIsOne(n_CONT).then().catch();
      } else if (C_DATVAL[0].valmovement === 0) {
        console.log('PASO ----> Entro Cierre');
        ///////// Llamar a la funcion PUP_CIERRE_PRI
        this.PUP_CIERRE_PRI();
      }
    }
  }

  async valMotodIsOne(n_CONT: number) {
    if (this.proceeding.typeProceedings === 'EVENTREC' && n_CONT > 0) {
      const v_COUNT = (await this.getVCount()) ?? 0;
      if (v_COUNT === 0) {
        this.onLoadToast(
          'info',
          'No se ha firmado el oficio de programación de entrega.'
        );
        throw new Error('FORM_TRIGGER_FAILURE');
      }
    }
    if (this.proceeding.typeProceedings === 'EVENCOMER') {
      const no_Acta: number | string = this.proceeding.id; //// :ACTAS_ENTREGA_RECEPCION.NO_ACTA
      const message: string = await this.PUF_VERIF_COMER(no_Acta); //// esta variable se llena con lo que devuelva la funcion PUF_VERIF_COMER
      if (message !== 'OK') {
        throw new Error('e_EXCEPPROC');
      }
    }
    const model: IPACambioStatusGood = {
      P_NOACTA: Number(this.proceeding.id),
      P_AREATRA: this.blkCtrl.processingArea.toString(),
      P_PANTALLA: 'FINDICA_0035_1',
    };
    await this.PA_CAMBIO_ESTATUS_BIEN(model).then().catch();
    const no_Acta: number | string = this.proceeding.id; //// :ACTAS_ENTREGA_RECEPCION.NO_ACTA
    await this.PA_ACTUALIZA_BIENES_SIN_M(no_Acta).then().catch();

    if (this.proceeding.typeProceedings === 'EVENTREC' && n_CONT > 0) {
      await this.PUP_ING_REG_FOLIO_UNIV_SSF3(
        this.proceeding.numFile,
        `'OFICIO DE PROGRAMACION: ${this.proceeding.keysProceedings}`,
        null,
        'ENTRE'
      )
        .then()
        .catch();
      ///// y hace este update c_STR := 'UPDATE ACTAS_ENTREGA_RECEPCION SET FOLIO_UNIVERSAL = '||TO_CHAR(n_FOLIO_UNIVERSAL)||', TESTIGO1 ='''||:BLK_TOOLBAR.TOOLBAR_USUARIO||''' WHERE NO_ACTA = '||TO_CHAR(:ACTAS_ENTREGA_RECEPCION.NO_ACTA);
    }

    if (this.global.paperworkArea === 'RF' && n_CONT > 0) {
      const no_Acta: number | string = this.proceeding.id; //// :ACTAS_ENTREGA_RECEPCION.NO_ACTA
      await this.INSERT_ACTAS_CTL_NOTIF_SSF3(no_Acta, 'CERRADA');
      /// AQUI HACER ESA ACTUALIZACION UPDATE_SSF3_ACTAS_PROG_DST Esperando enpoint
      //c_STR UPDATE SSF3_ACTAS_PROG_DST SET IND_ENVIO = 0 WHERE NO_ACTA = ||TO_CHAR(:ACTAS_ENTREGA_RECEPCION.NO_ACTA);
      await this.UPDATE_SSF3_ACTAS_PROG_DST(null);

      this.onLoadToast(
        'info',
        `Se realizó la firma y cierre del oficio (Folio Universal: ${this.proceeding.universalFolio})`
      );
      this.PUP_GENERA_PDF();
    } else {
      this.onLoadToast('info', 'La programación ha sido cerrada');
    }
  }

  async PUF_VERIF_COMER(numberAct: number | string): Promise<string> {
    const model = {
      pcActNo: Number(numberAct),
    };
    return new Promise<string>((res, rej) => {
      this.massiveGoodService.pufVerificaComers(model).subscribe({
        next: resp => {
          res('OK');
        },
        error: err => rej('Error'),
      });
    });
  }

  async INSERT_ACTAS_CTL_NOTIF_SSF3(
    ActaNumber: number | string,
    statusAct: string
  ) {
    ////// hacer un insert a esta tabla
    const postActsCtl: any = {
      NO_ACTA: ActaNumber,
      FEC_MOV: new Date(),
      ESTATUS_ACTA: statusAct,
      IND_NOTIF: '1',
    };
    return new Promise((res, rej) => {
      this.progammingServ.createActasCtlNotifSSF3(postActsCtl).subscribe({
        next: resp => res(resp),
        error: err => rej(err),
      });
    });
  }

  async PUP_GENERA_PDF() {
    let REPID: any;
    let v_REP: string;
    let v_URL: string;
    let v_ARCHOSAL: string;
    let v_NOMBRE: string;
    let v_RUTA: string;
    let v_COUNT: number;
    let c_STR: string;

    try {
      // OBTIENE INFORMACIÓN DE RUTA Y URL
      /* SELECT VALOR_FINAL, VALOR_INICIAL INTO v_RUTA, v_URL
      FROM PARAMETROS
      WHERE CVE_PARAMETRO ='SSF3_FIRMA_ELEC_DOCS'; */
      const response: any = await this.GET_RUTA_URL_PARAMETER(
        'SSF3_FIRMA_ELEC_DOCS'
      );
      v_RUTA = response.finalValue;
      v_URL = response.initialValue;
    } catch {
      this.onLoadToast('info', 'No se encontró la ruta y URL para el PDF.');
      throw new Error('FORM_TRIGGER_FAILURE');
    }

    v_NOMBRE = this.proceeding.keysProceedings.replace('/', '-');
    v_ARCHOSAL = v_RUTA + v_NOMBRE + '.PDF';

    // GENERA LISTA DE PARÁMETROS
    /*    REPID = FIND_REPORT_OBJECT('RPROGENTREGA');
   SET_REPORT_OBJECT_PROPERTY(REPID, REPORT_EXECUTION_MODE, BATCH);
   SET_REPORT_OBJECT_PROPERTY(REPID, REPORT_COMM_MODE, SYNCHRONOUS);
   SET_REPORT_OBJECT_PROPERTY(REPID, REPORT_DESTYPE, FILE);
   SET_REPORT_OBJECT_PROPERTY(REPID, REPORT_DESNAME, "'" + v_ARCHOSAL + "'");
   SET_REPORT_OBJECT_PROPERTY(REPID, REPORT_DESFORMAT, 'PDF');
   SET_REPORT_OBJECT_PROPERTY(REPID, REPORT_OTHER, 'PARAMFORM=NO P_NO_ACTA=' + LTRIM(TO_CHAR(:ACTAS_ENTREGA_RECEPCION.NO_ACTA)));
   v_REP = RUN_REPORT_OBJECT(REPID);
 */
    /* >> JACG 30/06/15 Ingresa PDF a BD */
    this.PUP_ELIMINA_PDF_BD_SSF3(this.proceeding.universalFolio, 1);
    this.PUP_CARGA_PDF_BD_SSF3(this.proceeding.universalFolio, 1, v_ARCHOSAL);
    /* << JACG 30/06/15 Ingresa PDF a BD */
  }

  GET_RUTA_URL_PARAMETER(cveParameter: string) {
    const response = {
      finalValue: 0,
      initialValue: 0,
    };
    return new Promise((res, rej) => {
      this.parameterGoodService.getById(cveParameter).subscribe({
        next: resp => {
          response.finalValue = resp.data[0].finalValue;
          response.initialValue = resp.data[0].initialValue;
          res(response);
        },
        error: err => rej(response),
      });
    });
  }

  PUP_ELIMINA_PDF_BD_SSF3(p_LLAVE: string, p_NO_ARCHO: number) {}

  PUP_CARGA_PDF_BD_SSF3(p_LLAVE: string, p_NO_ARCHO: number, p_RUTA: string) {}

  async PUP_ING_REG_FOLIO_UNIV_SSF3(
    p_NO_EXPEDIENTE: number,
    p_DESCRIPCION_DOCUMENTO: string,
    p_NO_VOLANTE: number,
    p_CVE_TIPO_DOCUMENTO: string
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      // Definición de variables
      let c_NO_VOLANTE: string;
      // Cuerpo del procedimiento
      let n_NO_EXPEDIENTE = p_NO_EXPEDIENTE;
      let c_DESCRIPCION_DOCUMENTO = p_DESCRIPCION_DOCUMENTO;
      if (p_NO_VOLANTE === null) {
        c_NO_VOLANTE = 'NULL';
      } else {
        c_NO_VOLANTE = p_NO_VOLANTE.toString();
      }
      let c_CVE_TIPO_DOCUMENTO = p_CVE_TIPO_DOCUMENTO;
      const postDocument: IDocuments = {
        numberProceedings: n_NO_EXPEDIENTE,
        keySeparator: '60',
        keyTypeDocument: c_CVE_TIPO_DOCUMENTO,
        natureDocument: 'ORIGINAL',
        descriptionDocument: c_DESCRIPCION_DOCUMENTO,
        significantDate: this.getFormattedDate(),
        scanStatus: 'ESCANEADO',
        userRequestsScan: 'user',
        scanRequestDate: new Date(),
        numberDelegationRequested: 2,
        numberDepartmentRequest: 2,
        numberSubdelegationRequests: 2,
        flyerNumber: c_NO_VOLANTE,
        mediumId: '-1',
        sheets: '1',
        dateRegistrationScan: new Date(),
        userRegistersScan: 'user',
      };
      this.documentsService.create(postDocument).subscribe({
        next: resp => {
          const postHistory: IHistoryProcesdingAct = {
            dateMov: new Date(),
            invoiceUniversal: resp.id,
            minutesNumber: Number(this.proceeding.id), /// Aqui va el :ACTAS_ENTREGA_RECEPCION.NO_ACTA)
          };
          this.progammingServ.createHistoryProcedingAct(postHistory).subscribe({
            next: resp => console.log(resp),
            error: err => console.error(err),
          });
        },
        error: err => console.error(err),
      });
      const p_FOLIO_UNIVERSAL: string = '0';
      resolve(p_FOLIO_UNIVERSAL);
    });
  }

  getFormattedDate(): string {
    const currentDate = new Date();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Agrega un cero al mes si es necesario
    const year = String(currentDate.getFullYear());
    return `${month}-${year}`;
  }
  async UPDATE_SSF3_ACTAS_PROG_DST(no_Acta: string | number) {
    const model = {
      minutesNumber: no_Acta,
    };
    return new Promise((res, rej) => {
      this.eventProgrammingService.putSsf3(model).subscribe({
        next: resp => res(resp),
        error: error => rej(error),
      });
    });
  }

  async PA_ACTUALIZA_BIENES_SIN_M(actaNumber: number | string) {
    return new Promise((res, rej) => {
      this.progammingServ.updateGoodSim(Number(actaNumber)).subscribe({
        next: resp => res(resp),
        error: error => rej(error),
      });
    });
  }

  async getVCount() {
    //// falta cambiar los filtros y la tabla
    /* 
    SELECT COUNT(0)
                 INTO v_COUNT
                 FROM SSF3_FIRMA_ELEC_DOCS
                WHERE NATURALEZA_DOC = 'PROGRAMACION'
                  AND NO_DOCUMENTO   = :ACTAS_ENTREGA_RECEPCION.NO_ACTA 
                  AND TIPO_DOCUMENTO = 'EVENTREC';
    */
    const params = new FilterParams();
    params.addFilter('expedient', this.proceeding.numFile);
    params.addFilter('typeManagement', 2);
    return await lastValueFrom(
      this.procedureManagementService.getAllFiltered(params.getParams()).pipe(
        catchError(() => of({ count: 0 })),
        map(res => res.count)
      )
    );
  }

  async openProg(C_DATVAL: ITmpProgValidation[], n_CONT: number) {
    const model: IPAAbrirActasPrograma = {
      P_AREATRA: `${this.blkCtrl.processingArea}`,
      P_NOACTA: Number(this.proceeding.id),
      P_PANTALLA: 'FINDICA_0035_1',
      P_TIPOMOV: null,
    };
    await this.openMinutesProyect(model);
    /////////////////////////////////////
    if (C_DATVAL[0].valmovement === 1) {
      console.log('Entro al otro if ');

      const model: IPAAbrirActasPrograma = {
        P_AREATRA: this.blkCtrl.processingArea.toString(),
        P_NOACTA: Number(this.proceeding.id),
        P_PANTALLA: 'FINDICA_0035_1',
        P_TIPOMOV: 1,
      };
      this.returPreviosStatus(model);
      //////////////////////////////// aqui va el endpoint esperado por EDWIN

      ////////////////////////////////////////7
      if (this.global.paperworkArea === 'RF' && n_CONT > 0) {
        ///////////// Hacer inset a esta tabla ACTAS_CTL_NOTIF_SSF3
        const no_Acta: number | string = this.proceeding.id; /// :ACTAS_ENTREGA_RECEPCION.NO_ACTA
        await this.INSERT_ACTAS_CTL_NOTIF_SSF3(no_Acta, 'ABIERTA');
      }

      this.blkCtrl.reopenInd = 0;
    } else {
      this.onLoadToast('info', C_DATVAL[0].valMessage);
    }
  }

  GET_APPLICATION_PROPERTY(currentDate: any): string {
    return '';
  }

  getEstatusAct() {
    return new Promise<string>((res, rej) => {
      //// esperar el ms de proceding
      const params: _Params = {};
      params['filter.id'] = `$eq:${this.proceeding.id}`;
      console.log(params);
      console.log('ESTO ------> Paramas');

      this.proceedingDeliveryReceptionService.getAll(params).subscribe({
        next: resp => res(resp.data[0].statusProceedings),
        error: err => rej('Error'),
      });
    });
  }
  PUF_VERIFICA_CLAVE(): boolean {
    return this.form.get('keysProceedings').value.includes('//');
  }

  PUP_DEPURA_DETALLE() {
    return new Promise((res, rej) => {
      this.detail.forEach(deta => {
        if (deta) {
        }
      });
    });
  }

  async PUP_CIERRE_PRI() {
    let lv_VALFECP: number;
    let lv_PANTALLA: string = this.GET_APPLICATION_PROPERTY('');
    let lv_VALESTAC: string;
    let v_COUNT: number;
    let c_RESP: string;
    let n_FOLIO_UNIVERSAL: number;
    let c_STR: string;
    let n_CONT: number = 0;
    let c_MENSAJE: string;
    let e_EXCEPPROC: Error;
    try {
      // Valida que la llave de la programación no sea nula ni el tipo de acta (valida 3)
      if (
        this.proceeding.id === null &&
        this.proceeding.typeProceedings === null
      ) {
        this.onLoadToast('info', 'No se tiene Programa a cerrar.');
        return;
      }

      // Area de Tramite no puede ser nula para cerrar una programación (valida 1)
      if (this.form.get('typeEvent').value === null) {
        ////:BLK_CONTROL.AREA_TRAMITE preguntar donde esta esta propiedad
        this.onLoadToast('info', 'No se ha especificado el Tipo de Evento.');
        return;
      }
      console.log('PASO ------> Paso tipo Event');

      // Valida que la clave de la programación este completa (valida 2)
      if (this.PUF_VERIFICA_CLAVE()) {
        this.onLoadToast(
          'info',
          'El Programa es inconsistente en su estructura.'
        );
        return;
      }
      console.log('PASO ------> Paso la Clave');

      //  await this.PUP_DEPURA_DETALLE();

      console.log('PASO ------> DEPURA DETALLE');
      //// -----------> PREGUNTAR POR ESTO <-----------

      /* SET_BLOCK_PROPERTY('ACTAS_ENTREGA_RECEPCION', DEFAULT_WHERE, 'NO_ACTA = ' + :ACTAS_ENTREGA_RECEPCION.NO_ACTA);
        GO_BLOCK('ACTAS_ENTREGA_RECEPCION');
        EXECUTE_QUERY();
        GO_BLOCK('DETALLE_ACTA_ENT_RECEP');
        FIRST_RECORD(); */

      if (this.detail[0].goodnumber === null) {
        this.onLoadToast(
          'info',
          'No se pudo realizar la actualización de bienes.'
        );
        return;
      } else {
        console.log('PASO ------> ACTUALIZACION Bienes');
        lv_VALFECP = 0;
        //// recorrer el array que llene la tabla DETALLE_ACTA_ENT_RECEP
        for (const element of this.detail) {
          const deta: any = element;
          if (
            deta.dateindicatesuserapproval == null ||
            deta.dateapprovalxadmon == null
          ) {
            lv_VALFECP = lv_VALFECP + 1;
            console.log('PASO ------> Notiene fecha');
            console.log('FEcha 1 ------> ', deta.dateindicatesuserapproval);
            console.log(
              'FEcha 2 ------> No tiene fecha',
              deta.dateapprovalxadmon
            );
            console.log(deta);
            break;
          }
        }
        console.log('PASO ------> Aca voy en Array detalla recorrer');
        if (lv_VALFECP === 0) {
          if (this.global.paperworkArea === 'RF') {
            n_CONT = (await this.getExpedientsCount()) ?? 0;
          }
          if (this.proceeding.typeProceedings === 'EVENTREC' && n_CONT > 0) {
            //// VALIDA SI EXISTE EL XML GENERADO
            v_COUNT = (await this.getVCount()) ?? 0;
            if (v_COUNT === 0) {
              this.onLoadToast(
                'info',
                'No se ha firmado el oficio de programación de entrega.'
              );
              return;
            }
          }
          if (this.global.paperworkArea === 'RF' && n_CONT > 0) {
            console.log('Ahora si entro a CERRAR EL ACTA');
            await this.closedProgramming(n_CONT);
          } else {
            await this.alertQuestion(
              'warning',
              'Cerrar programación',
              '¿Seguro que desea realizar el cierre de esta Programación ?'
            )
              .then(async question => {
                if (question.isConfirmed) {
                  await this.closedProgramming(n_CONT);
                }
              })
              .catch(error => console.error(error));
          }
        } else {
          this.onLoadToast(
            'info',
            'Falta complementar Fechas de Recepción/Entrega y/o Finalización.'
          );
        }
      }
    } catch (e_EXCEPPROC) {
      c_MENSAJE =
        'Favor de Informar a Informática. < ' || 'e_EXCEPPROC.MESSAGE' || ' >';
      this.onLoadToast('error', c_MENSAJE);
    }
  }

  PA_CIERRE_INICIAL_PROGR(
    no_Acta: string | number,
    lv_PANTALLA: string,
    blkCtrlArea: string | number
  ) {
    return new Promise((res, rej) => {
      this.programmingGoodService
        .PaCierreInicialProgr(no_Acta, lv_PANTALLA, blkCtrlArea)
        .subscribe({
          next: resp => res(resp.message[0]),
          error: err => rej('Error'),
        });
    });
  }

  async closedProgramming(n_CONT: number) {
    if (this.proceeding.typeProceedings === 'EVENCOMER') {
      const message: string = await this.PUF_VERIF_COMER(this.proceeding.id);
      console.log('Aqui es el mensaje', message);
      if (message !== 'OK') {
        return;
      }
    }
    ///// llama al pack PA_CIERRE_INICIAL_PROGR
    await this.PA_CIERRE_INICIAL_PROGR(
      this.proceeding.id,
      'FINDICA_0035_1',
      this.blkCtrl.processingArea
    );
    /////////
    console.log('PASO ----> Llego a getEstatusAct');

    const T_VALEACT: string = await this.getEstatusAct();
    console.log('PASO ----> ya paso getEstatusAct');
    console.log(this.global.paperworkArea, n_CONT);

    if (['ABIERTO', 'ABIERTA'].includes(T_VALEACT)) {
      this.onLoadToast(
        'info',
        'La Programación no ha sido cerrada, verifique sus datos...'
      );
    } else {
      if (this.global.paperworkArea === 'RF' && n_CONT > 0) {
        this.PUP_ING_REG_FOLIO_UNIV_SSF3(
          this.proceeding.numFile,
          `OFICIO DE PROGRAMACION: ${this.proceeding.keysProceedings}`,
          null,
          'ENTRE'
        )
          .then()
          .catch();
        //// aqui hace los DDL que pedi a Edwin
        await this.firmaAndClosedOffi();
        ///////////////////////////////////////
        //// esperar que se resuelva el DDL y mostrar el mensaje
        this.onLoadToast(
          'success',
          `Se realizó la firma y cierre del oficio (Folio Universal: ${this.proceeding.universalFolio})`
        );
      } else {
        this.onLoadToast('success', 'La programación ha sido cerrada');
        this.updateStatusGood();
      }
      ///// aqui va esto :PARAMETER.NO_FORMATO
      const parameterNoFormat: any = '';
      if (parameterNoFormat !== null) {
        this.UPDATE_ESTRATEGIA_BIENES(parameterNoFormat, this.proceeding.id);
      }
    }
  }

  async firmaAndClosedOffi() {
    const respAct = await this.UPDATE_ACTAS_ENTREGA_RECEPCION(
      this.proceeding.universalFolio,
      this.authUserName,
      this.proceeding.id
    );
    const respActCtr = await this.INSERT_ACTAS_CTL_NOTIF_SSF3(
      this.proceeding.id,
      'CERRADA'
    );
    const respActProg = await this.UPDATE_SSF3_ACTAS_PROG_DST(null);
  }

  updateStatusGood() {}

  UPDATE_ACTAS_ENTREGA_RECEPCION(
    universalFolio: string,
    userToolbar: string,
    no_Acta: string | number
  ) {
    const model: IUpdateActasEntregaRecepcion = {
      universalFolio,
      userToolbar,
    };
    return new Promise<string>((res, rej) => {
      this.proceedingsService
        .updateActasEntregaRecepcion(model, no_Acta)
        .subscribe({
          next: (resp: any) => res(resp.message),
          error: err => rej(err),
        });
    });
  }

  UPDATE_ESTRATEGIA_BIENES(noFormat: number, no_Acta: string | number) {
    const model = {
      minutesNumber: no_Acta,
    };
    this.goodPosessionThirdpartyService
      .updateThirdPartyAdmonXFormatNumber(noFormat, model)
      .subscribe({
        next: (resp: any) => console.log(resp.message),
        error: err => console.log(err),
      });
  }

  async paqConv() {
    let v_ind_proc: boolean;
    let V_TIPO_ACTA: string | number;
    let lv_PAQWHERE: string;

    if (
      this.proceeding.typeProceedings === 'CERRADO' ||
      this.proceeding.statusProceedings === 'CERRADA'
    ) {
      this.onLoadToast('info', 'El Programa está cerrado.');
      return;
    }

    if (this.blkCtrl.processingArea === null) {
      this.onLoadToast('info', 'No se ha especificado el Tipo de Evento.');
      return;
    }

    V_TIPO_ACTA = await this.getParameterGood(this.blkCtrl.processingArea);

    if (V_TIPO_ACTA === null) {
      this.onLoadToast('info', 'No se localizó el Tipo de Acta.');
      return;
    }

    if (this.proceeding.keysProceedings === null) {
      this.onLoadToast('info', 'No se ha ingresado el Programa.');
      return;
    }

    v_ind_proc = false;

    if (this.detail.length > 0) {
      await this.alertQuestion(
        'info',
        'Información',
        'La asignación de bienes ya se ha realizado, se ejecuta nuevamente?'
      ).then(question => {
        if (question.isConfirmed) {
          v_ind_proc = true;
        }
      });
    } else {
      await this.alertQuestion(
        'info',
        'Información',
        '¿Quiere continuar con la selección?'
      ).then(question => {
        if (question.isConfirmed) {
          v_ind_proc = true;
        }
      });
    }

    if (v_ind_proc) {
      if (this.blkCtrl.processingArea === 'DS') {
        lv_PAQWHERE =
          "ESTATUS_PAQ = 'C' AND TIPO_PAQUETE = 1 AND ESTATUS IN (SELECT ESTATUS FROM ESTATUS_X_PANTALLA WHERE CVE_PANTALLA = 'FINDICA_0035_1' AND ACCION = 'DS')";
      } else if (this.blkCtrl.processingArea === 'DN') {
        lv_PAQWHERE =
          "ESTATUS_PAQ = 'C' AND TIPO_PAQUETE = 2 AND ESTATUS IN (SELECT ESTATUS FROM ESTATUS_X_PANTALLA WHERE CVE_PANTALLA = 'FINDICA_0035_1' AND ACCION = 'DN')";
      }
      //// -----> solo falta esto en este botón <----------
      /* GO_ITEM('PAQ_DESTINO_ENC.NO_PAQUETE');
      SET_BLOCK_PROPERTY('PAQ_DESTINO_ENC', 'DEFAULT_WHERE', lv_PAQWHERE);
      CLEAR_BLOCK();
      EXECUTE_QUERY(); */
    }
  }

  getParameterGood(procedureArea: string | number) {
    const params: ListParams = {};
    params['filter.procedureAreaDetails.id=$eq:'] = procedureArea;
    console.log(params);

    return new Promise<string | number>((res, rej) => {
      this.parameterGoodService.getIndicatorParameter().subscribe({
        next: resp => res(resp.data[0].certificateType),
        error: _err => rej('Error'),
      });
    });
  }

  async signOffice() {
    let n_CONT: number;
    let l_BAN: boolean;
    let l_BAS: boolean;
    let V_USUARIOTLP: number;
    let V_USUARIOOST: number;

    V_USUARIOTLP = this.authUserName.indexOf('TLP');
    V_USUARIOOST = this.authUserName.indexOf('OST');

    if (
      ['CERRADO', 'CERRADA'].includes(this.proceeding.statusProceedings) &&
      this.proceeding.typeProceedings === 'EVENTREC' &&
      this.proceeding.id !== null &&
      this.proceeding.numFile !== null &&
      V_USUARIOTLP === 0 &&
      V_USUARIOOST === 0
    ) {
      n_CONT = (await this.getExpedientsCount()) ?? 0;
      if (n_CONT > 0) {
        const SSF3_ACTAS_PROG_DST = {
          EMAIL: '',
          TIPO_DEST: '',
        };
        if (SSF3_ACTAS_PROG_DST.EMAIL === null) {
          this.onLoadToast(
            'info',
            'No se cuenta con Lista de Distribución de correo.'
          );
          this.PUP_ING_CORREO_SAE();
          return;
        }
        l_BAN = true;
        l_BAS = true;
        /*         while (SYSTEM.LAST_RECORD !== 'TRUE') {
          if (SSF3_ACTAS_PROG_DST.TIPO_DEST === 'SAT') {
            l_BAN = false;
          }
          if (SSF3_ACTAS_PROG_DST.TIPO_DEST === 'SAE') {
            l_BAS = false;
          }
          NEXT_RECORD();
        }
        FIRST_RECORD(); */
        if (l_BAN) {
          this.onLoadToast(
            'info',
            'No se cuenta con Distribución de correo al SAT.'
          );
          return;
        }
        if (l_BAS) {
          this.onLoadToast(
            'info',
            'No se cuenta con Distribución de correo al SAE.'
          );
          return;
        }
      }

      if (this.detail[0].goodnumber === null) {
        this.onLoadToast('info', 'No se tienen bienes relacionados');
        return;
      } else if (this.detail[0].dateapprovalxadmon === null) {
        this.onLoadToast('info', 'No se cuenta con Fecha de inicio de acto.');
        return;
      } else if (this.detail[0].dateindicatesuserapproval === null) {
        this.onLoadToast(
          'info',
          'No se cuenta con Fecha de finalización de acto.'
        );
        return;
      }
      if (this.blkCtrl.processingArea === null) {
        this.onLoadToast('info', 'No se ha especificado el Tipo de Evento.');
        return;
      }
      if (this.PUF_VERIFICA_CLAVE()) {
        this.onLoadToast(
          'info',
          'El Programa es inconsistente en su estructura.'
        );
        return;
      }
      this.PUP_GENERA_XML();
    } else if (V_USUARIOTLP === 1 || V_USUARIOOST === 1) {
      this.onLoadToast(
        'info',
        'Usuario TLP y OST no pueden realizar el cierre de Programaciones.'
      );
    } else {
      this.onLoadToast('info', 'Inválido para firma de Oficio');
    }
  }

  PUP_ING_CORREO_SAE() {}
  PUP_GENERA_XML() {}
}
