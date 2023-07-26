// FIXME: 2

/** BASE IMPORT */
import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  skip,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { DEPOSITARY_ROUTES_2 } from 'src/app/common/constants/juridical-processes/depositary-routes-2';
import {
  baseMenu,
  baseMenuDepositaria,
} from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { IGoodsSubtype } from 'src/app/core/models/catalogs/goods-subtype.model';
import { IDictationCopies } from 'src/app/core/models/ms-dictation/dictation-model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IManagementArea } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { AccountMovements } from 'src/app/core/services/ms-account-movements/account-movements.service';
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { OficialDictationService } from 'src/app/core/services/ms-dictation/oficial-dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { JobDictumTextsService } from 'src/app/core/services/ms-office-management/job-dictum-texts.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { DetailProceedingsDevolutionService } from 'src/app/core/services/ms-proceedings/detail-proceedings-devolution';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { environment } from 'src/environments/environment';
import { AbandonmentsDeclarationTradesService } from '../../abandonments-declaration-trades/service/abandonments-declaration-trades.service';
import { RDictaminaDocModalComponent } from '../r-dictamina-doc-modal/r-dictamina-doc-modal.component';
import { TempGood } from './dataTemp';
import { DOCUMENTS_COLUMNS } from './documents-columns';
import { ListdictumsComponent } from './listdictums/listdictums.component';
import { GoodSubtype } from './model/good.model';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-juridical-ruling-g',
  templateUrl: './juridical-ruling-g.component.html',
  styleUrls: ['./juridical-ruling-g.component.scss'],
})
export class JuridicalRulingGComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  @Input() showCriminalCase: boolean = false;
  selectedGooods: IGood[] = [];
  selectedGooodsValid: IGood[] = [];
  goods: IGood[] | any[] = TempGood;
  goodsValid: any[] = [];
  documents: any[] = [];
  selectedDocuments: IDocuments[] = [];
  statusDict: string = undefined;
  dictNumber: string | number = null;
  delegationDictNumber: string | number = undefined;
  keyArmyNumber: string | number = undefined;
  maxDate = new Date();
  // params = new BehaviorSubject<ListParams>(new ListParams());

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  totalDocuments: number = 0;
  label: string = '';
  idGoodSelected: any = '';
  @ViewChild('cveOficio', { static: true }) cveOficio: ElementRef;
  goodData: IGood;
  goodData2: IGood;

  //tipos
  typesClass = new DefaultSelect<Partial<GoodSubtype>>();
  typesIdent = new DefaultSelect<Partial<{ identificador: string }>>();
  types = new DefaultSelect<Partial<IGoodType>>();
  subtypes = new DefaultSelect();
  ssubtypes = new DefaultSelect();
  sssubtypes = new DefaultSelect();

  typesDict = new DefaultSelect(
    [
      { id: 'PROCEDENCIA', typeDict: 'PROCEDENCIA' },
      { id: 'DESTINO', typeDict: 'DESTINO' },
      { id: 'DESTRUCCION', typeDict: 'DESTRUCCIÓN' },
      { id: 'DEVOLUCION', typeDict: 'DEVOLUCIÓN' },
      { id: 'DONACION', typeDict: 'DONACION' },
      { id: 'DECOMISO', typeDict: 'DECOMISO' },
      { id: 'EXT_DOM', typeDict: 'EXT_DOM' },
      { id: 'RESARCIMIENTO', typeDict: 'RESARCIMIENTO' },
      { id: 'ENAJENACION', typeDict: 'ENAJENACIÓN' },
      { id: 'TRANSFERENTE', typeDict: 'TRANSFERENTE' },
      { id: 'ABANDONO', typeDict: 'ABANDONO' },
    ],
    2
  );

  ident = new DefaultSelect(
    [
      { id: 'ASEG', value: 'ASEGURADO' },
      { id: 'TRANS', value: 'TRANSFERENTE' },
    ],
    2
  );

  typeField: string = 'type';
  subtypeField: string = 'subtype';
  ssubtypeField: string = 'ssubtype';
  sssubtypeField: string = 'sssubtype';

  goodTypeChange = new EventEmitter<IGoodType>();
  goodSubtypeChange = new EventEmitter<IGoodSubType>();
  goodSsubtypeChange = new EventEmitter<IGoodsSubtype>();
  goodSssubtypeChange = new EventEmitter<IGoodSssubtype>();

  data3 = [
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
    { id: 'DEST', documento: 'RESOLUCION DE LA AUTORIDAD JUDICIAL', fecha: '' },
  ];

  data4: IDocuments[] = [
    // { id: 'DEST', documento: 'PRIMER DOCUMENTO', fecha: '' },
    // { id: 'DEST', documento: 'SEGUNDO DOCUMENTO', fecha: '' },
  ];

  settings1 = {
    pager: {
      display: false,
    },

    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      name: {
        title: '',
        sort: false,
        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (isSelected: boolean, row: IGood) =>
          this.isGoodSelected(row),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onGoodSelect(instance),
      },
      id: {
        sort: false,
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        sort: false,
        title: 'Descripción',
        type: 'string',
      },
      quantity: {
        sort: false,
        title: 'Cantidad',
        type: 'string',
      },
      identifier: {
        sort: false,
        title: 'Ident.',
        type: 'string',
      },
      status: {
        sort: false,
        title: 'Estatus',
        type: 'string',
      },
      extDomProcess: {
        sort: false,
        title: 'Proceso',
        type: 'string',
      },
    },
    rowClassFunction: (row: any) => {
      if (row.data.est_disponible == 'S') {
        if (row.data.di_es_numerario == 'S') {
          if (row.data.di_esta_conciliado == 'N') {
            return 'bg-dark text-white';
          } else {
            if (row.data.v_amp == 'S') {
              return 'bg-success text-danger';
            } else {
              return 'bg-success text-white';
            }
          }
        } else {
          if (row.data.v_amp == 'S') {
            return 'bg-success text-danger';
          } else {
            return 'bg-success text-white';
          }
        }
      } else {
        if (row.data.v_amp == 'S') {
          return 'bg-dark text-danger';
        } else {
          return 'bg-dark text-white';
        }
      }
    },
    noDataMessage: 'No se encontrarón registros',
  };
  // TODO:

  settings2 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      name: {
        sort: false,
        title: '',

        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (isSelected: boolean, row: IGood) =>
          this.isGoodSelectedValid(row),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onGoodSelectValid(instance),
      },
      id: {
        sort: false,
        title: 'No. Bien',
        type: 'number',
      },
      descriptionDict: {
        sort: false,
        title: 'Descripción Dictaminación',
        type: 'string',
      },
      menaje: {
        sort: false,
        title: 'Menaje',
        type: 'string',
        valuePrepareFunction: (value: any) => {
          return value?.noGood;
        },
      },
      amountDict: {
        sort: false,
        title: 'Cant. Dictaminación',
        type: 'string',
      },
      status: {
        sort: false,
        title: 'Estatus',
        type: 'string',
      },
      extDomProcess: {
        sort: false,
        title: 'Proceso',
        type: 'string',
      },
      idDestino: {
        sort: false,
        title: 'ID Destino',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings3 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: { ...DOCUMENTS_COLUMNS },
    rowClassFunction: (row: any) => {
      return 'bg-info text-white';
    },
    noDataMessage: 'No se encontrarón registros',
  };

  expedientesForm: FormGroup;
  dictaminacionesForm: FormGroup;
  subtipoForm: FormGroup;
  gestionDestinoForm: FormGroup;
  public buttonDisabled: boolean = true;
  public buttonDeleteDisabled: boolean = false;
  public listadoDocumentos: boolean = false;
  // public rutaAprobado: string = baseMenu + baseMenuDepositaria + DEPOSITARY_ROUTES_2[0].link;

  isDelit: boolean = false;
  btnIsParcial: boolean = false;
  isIdent: boolean = true;

  documentsDictumXStateMList: any[] = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  loading2 = this.loading;
  listParams = new BehaviorSubject<ListParams>(new ListParams());
  desc_estatus_good: string = '';
  consult: string =
    '>> Click boton derecho para consultar dictaminaciones anteriores <<';

  origin: string = 'FACTJURDICTAMASG';
  disabledListDictums: boolean = false;
  formLoading: boolean = false;
  formLoading2: boolean = false;
  disabledD: boolean = true;
  inputsVisuales: boolean = true;

  totalItems3: number = 0;
  filter3 = new BehaviorSubject<FilterParams>(new FilterParams());

  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  filter2 = new BehaviorSubject<FilterParams>(new FilterParams());
  isExp: boolean = true;
  disabledSend: boolean = true;

  @ViewChild('datepickerElement') datepickerElement: ElementRef;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: GoodTypeService,
    private serviceGood: GoodProcessService,
    private goodSubtypesService: GoodSubtypeService,
    private goodSsubtypeService: GoodSsubtypeService,
    private goodSssubtypeService: GoodSssubtypeService,
    private readonly goodServices: GoodService,
    private readonly documentService: DocumentsService,
    private readonly expedientServices: ExpedientService,
    private readonly authService: AuthService,
    private applicationGoodsQueryService: ApplicationGoodsQueryService,
    private datePipe: DatePipe,
    private router: Router,
    private usersService: UsersService,
    private documentsDictumStatetMService: DocumentsDictumStatetMService,
    private modalService: BsModalService,
    private screenServ: ScreenStatusService,
    private DictationXGood1Service: DictationXGood1Service,
    private dictationService: DictationService,
    private segAcessXAreasService: SegAcessXAreasService,
    private parametersService: ParametersService,
    private departamentService: DepartamentService,
    private oficialDictationService: OficialDictationService,
    private statusGoodService: StatusGoodService,
    private abandonmentsService: AbandonmentsDeclarationTradesService,
    private detailProceedingsDevolutionService: DetailProceedingsDevolutionService,
    private jobDictumTextsService: JobDictumTextsService,
    private AccountMovements: AccountMovements,
    private comerDetailsService: ComerDetailsService
  ) {
    super();
    this.dictamen = {
      id: null,
      passOfficeArmy: null,
      expedientNumber: null,
      typeDict: null,
      statusDict: null,
      dictDate: null,
      userDict: null,
      observations: null,
      delegationDictNumber: null,
      areaDict: null,
      instructorDate: null,
      registerNumber: null,
      esDelit: null,
      wheelNumber: null,
      keyArmyNumber: null,
      notifyAssuranceDate: null,
      resolutionDate: null,
      notifyResolutionDate: null,
      folioUniversal: null,
      entryDate: null,
      dictHcDAte: null,
      entryHcDate: null,
    };

    this.oficioDictamen = {
      officialNumber: null,
      typeDict: null,
      sender: null,
      city: null,
      text1: null,
      text2: null,
      recipient: null,
      registerNumber: null,
      delegacionRecipientNumber: null,
      recipientDepartmentNumber: null,
      statusOf: null,
      recipientEsxt: null,
      desSenderPa: null,
      text3: null,
      text2To: null,
      notaryNumber: null,
      cveChargeRem: null,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.expedientesForm.get('noExpediente').setValue(params?.expediente);
      this.expedientesForm.get('tipoDictaminacion').setValue(params?.tipoDic);
      this.expedientesForm.get('noVolante').setValue(params?.volante);
      this.dictaminacionesForm.get('wheelNumber').setValue(params?.volante);
    });
    this.params
      .pipe(
        skip(1),
        tap(() => {
          // aquí colocas la función que deseas ejecutar
          this.onLoadGoodList(0, 'all');
        }),
        takeUntil(this.$unSubscribe),
        tap(() => {
          this.onLoadGoodList(0, 'all');
          // if (this.goods.length > 0) {
          //   // this.formLoading = true;

          // }
        })
      )
      .subscribe();

    this.filter1
      .pipe(
        skip(1),
        tap(() => {
          // aquí colocas la función que deseas ejecutar
          this.onLoadWithClass({});
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {
        // if (this.goods.length > 0) {
        this.onLoadWithClass({});
        // }
      });
    // this.filter1.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
    //   if (this.goods.length > 0) {
    //     this.onLoadWithClass();
    //   }
    // });

    this.params2
      .pipe(
        skip(1),
        tap(() => {
          // aquí colocas la función que deseas ejecutar
          this.getDocumentDicXStateM(null);
        }),
        takeUntil(this.$unSubscribe),
        tap(() => this.getDocumentDicXStateM(null))
      )
      .subscribe();

    this.filter3
      .pipe(
        skip(1),
        tap(() => {
          // aquí colocas la función que deseas ejecutar
          this.checkDictumXGood(this.dictamen);
        }),
        takeUntil(this.$unSubscribe),
        tap(() => this.checkDictumXGood(this.dictamen))
      )
      .subscribe();

    this.getParams();
    // OBTENEMOS DELEGACIÓN DEL USUARIO //
    const paramsSender = new ListParams();
    paramsSender.text = this.authService.decodeToken().preferred_username;
    this.get___Senders(paramsSender);
  }

  /**
   * Preparar formularios
   */
  prepareForm() {
    this.expedientesForm = this.fb.group({
      noDictaminacion: [null, [Validators.required]],
      tipoDictaminacion: [null],
      noExpediente: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      criminalCase: [null, [Validators.pattern(STRING_PATTERN)]],
      delito: ['N'],
      averiguacionPrevia: [null, [Validators.pattern(STRING_PATTERN)]],
      causaPenal: [null, [Validators.pattern(STRING_PATTERN)]],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      noVolante: [null],
      identifier: [null],
      type: [null],
    });

    this.dictaminacionesForm = this.fb.group({
      wheelNumber: [null],
      etiqueta: [null, [Validators.pattern(STRING_PATTERN)]],
      fechaPPFF: [null, [Validators.required]],
      fechaInstructora: [null],
      fechaResolucion: [null],
      fechaDictaminacion: [this.datePipe.transform(new Date(), 'dd/MM/yyyy')],
      fechaNotificacion: [null],
      fechaNotificacionAseg: [null],
      autoriza_remitente: [null],
      criminalCase: [null, [Validators.pattern(STRING_PATTERN)]],
      autoriza_nombre: ['', [Validators.pattern(STRING_PATTERN)]],
      cveOficio: [null],
      estatus: [null],
    });
    this.subtipoForm = this.fb.group({
      tipoDictaminacion: [null],
      ident: [null],
      type: [null, [Validators.required]],
      subtype: [null, [Validators.required]],
      ssubtype: [null, [Validators.required]],
      sssubtype: [null, [Validators.required]],
      attrib: [
        { value: null, disabled: true },
        Validators.pattern(NUMBERS_PATTERN),
      ],
    });
    this.gestionDestinoForm = this.fb.group({
      estatus: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    // this.dictaminacionesForm.get('autoriza_nombre').setValue(null);
  }

  dateValidS: any;
  P_NO_TRAMITE: any;
  getParams() {
    this.dictaminacionesForm.get('wheelNumber').setValue(null);
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.expedientesForm.get('noExpediente').setValue(params?.EXPEDIENTE);
      if (params.TIPO_DIC == 'DECOMISO') {
        this.showCriminalCase = false;
        //corregido
      }
      console.log('params?', params);
      this.expedientesForm.get('tipoDictaminacion').setValue(params?.TIPO_DIC);
      console.log('params?.TIPO_DIC', params?.TIPO_DIC);
      this.TIPO_VO = params.TIPO_VO;
      if (params?.TIPO_DIC == 'PROCEDENCIA') {
        this.buttonDisabled = false;
      }
      if (params?.TIPO_VO) {
        console.log('PRUEBA');
        this.validateTypeVol(params.TIPO_VO, params.TIPO_DIC);
      }
      this.expedientesForm.get('noVolante').setValue(params?.VOLANTE);
      this.dictaminacionesForm.get('wheelNumber').setValue(params?.VOLANTE);
      this.P_NO_TRAMITE = params?.P_NO_TRAMITE;
    });

    this.changeNumExpediente();
  }

  validateTypeVol(typeVol: string, typeDic: string) {
    if (typeVol == 'T') {
      this.label = 'Fec. P.P.F.F.';
      this.isDelit = typeDic == 'PROCEDENCIA' ? true : false;
    } else if (typeDic == 'PROCEDENCIA') {
      this.label = 'Fec. Aseg.';
      this.isDelit = true;
    } else if (typeDic == 'DESTINO') {
      this.label = 'Fec. Dest.';
      this.isDelit = false;
    } else if (typeDic == 'DESTRUCCION') {
      this.label = 'Fec. Dest.';
      this.isDelit = false;
    } else if (['DEVOLUCION', 'RESARCIMIENTO'].includes(typeDic)) {
      this.label = 'Fec. Devo.';
      this.isDelit = false;
    } else if (typeDic == 'DONACION') {
      this.label = 'Fec. Dona.';
      this.isDelit = false;
    } else if (typeDic == 'DECOMISO') {
      this.label = 'Fec. Deco.';
      this.isDelit = false;
    } else if (typeDic == 'EXT_DOM') {
      this.label = 'Fec. ExDom.';
      this.isDelit = false;
    } else if (typeDic == 'TRANSFERENTE') {
      this.label = 'Fec. P.P.F.F.';
      this.isDelit = false;
    }

    this.btnIsParcial = typeDic != 'PROCEDENCIA' ? true : false;
  }

  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value).getTime();
    const currentDate = new Date().getTime() - 99999;
    if (selectedDate < currentDate) {
      return { invalidDate: true };
    }
    return null;
  }

  async changeNumExpediente() {
    this.resetALL();
    await this.onLoadDictationInfo(0, 'all');

    await this.onLoadExpedientData();
    await this.onLoadGoodList(0, 'all');
  }

  onKeyPress($event: any) {
    // if ($event.key === 'Enter') $event.currentTarget.blur();
    // $event.currentTarget.focus();
  }

  resetALL() {
    this.selectedDocuments = [];
    // this.cleanForm();
    this.selectedGooods = [];
    this.selectedGooodsValid = [];
    this.goodsValid = [];
    this.data4 = [];
    this.documents = [];
    this.documentsDictumXStateMList = [];
    this.idGoodSelected = null;
    this.statusDict = '';
    this.dictNumber = null;
    this.dictaminacionesForm.get('cveOficio').setValue(null);
    this.dictamen = {
      id: null,
      passOfficeArmy: null,
      expedientNumber: null,
      typeDict: null,
      statusDict: null,
      dictDate: null,
      userDict: null,
      observations: null,
      delegationDictNumber: null,
      areaDict: null,
      instructorDate: null,
      registerNumber: null,
      esDelit: null,
      wheelNumber: null,
      keyArmyNumber: null,
      notifyAssuranceDate: null,
      resolutionDate: null,
      notifyResolutionDate: null,
      folioUniversal: null,
      entryDate: null,
      dictHcDAte: null,
      entryHcDate: null,
    };

    this.oficioDictamen = {
      officialNumber: null,
      typeDict: null,
      sender: null,
      city: null,
      text1: null,
      text2: null,
      recipient: null,
      registerNumber: null,
      delegacionRecipientNumber: null,
      recipientDepartmentNumber: null,
      statusOf: null,
      recipientEsxt: null,
      desSenderPa: null,
      text3: null,
      text2To: null,
      notaryNumber: null,
      cveChargeRem: null,
    };

    this.dictamenXGood1 = {
      ofDictNumber: null,
      proceedingsNumber: null,
      id: null,
      descriptionDict: null,
      amountDict: null,
      registerNumber: null,
      typeDict: null,
      proceedings: null,
      good: null,
      dictation: null,
    };
  }

  cleanForm() {
    this.statusDict = '';
    this.expedientesForm.get('noDictaminacion').setValue(null);
    this.expedientesForm.get('tipoDictaminacion').setValue(null);
    this.expedientesForm.get('averiguacionPrevia').setValue(null);
    this.expedientesForm.get('observaciones').setValue(null);
    this.expedientesForm.get('noVolante').setValue(null);
    this.expedientesForm.get('criminalCase').setValue(null);
    this.expedientesForm.get('delito').setValue(null);

    // ..dictaminación
    // this.dictaminacionesForm.get('wheelNumber').setValue(null);
    this.dictaminacionesForm.get('criminalCase').setValue(null);
    this.dictaminacionesForm.get('etiqueta').setValue(null);
    this.dictaminacionesForm.get('fechaPPFF').setValue(null);
    this.dictaminacionesForm.get('fechaInstructora').setValue(null);
    this.dictaminacionesForm.get('fechaResolucion').setValue(null);
    this.dictaminacionesForm.get('fechaDictaminacion').setValue(null);
    this.dictaminacionesForm.get('fechaNotificacion').setValue(null);
    this.dictaminacionesForm.get('fechaNotificacionAseg').setValue(null);
    this.dictaminacionesForm.get('autoriza_remitente').setValue(null);
    this.dictaminacionesForm.get('autoriza_remitente').setValue(null);
    this.dictaminacionesForm.get('autoriza_nombre').setValue(null);
    this.dictaminacionesForm.get('cveOficio').setValue(null);
    this.dictaminacionesForm.get('estatus').setValue(null);
  }

  get typeDictamination() {
    return this.expedientesForm.get('tipoDictaminacion');
  }

  async onLoadExpedientData() {
    let noExpediente = this.expedientesForm.get('noExpediente').value || '';
    if (noExpediente !== '') {
      const body = {
        cve_forma: 'FACTJURDICTAMASG',
        tipo_dicta: this.expedientesForm.get('tipoDictaminacion').value,
        no_expediente: this.expedientesForm.get('noExpediente').value,
      };
      this.serviceGood.getFact(body).subscribe({
        next: resp => {
          resp.data.unshift({
            no_clasif_bien: 0,
            desc_subtipo: '0',
            desc_ssubtipo: '-',
            desc_sssubtipo: 'Todos',
          });
          this.typesClass = new DefaultSelect(resp.data, resp.count);
        },
        error: () => {
          const data = [
            {
              no_clasif_bien: 0,
              desc_subtipo: '0',
              desc_ssubtipo: '-',
              desc_sssubtipo: 'Todos',
            },
          ];
          this.typesClass = new DefaultSelect(data, 1);
        },
      });

      const body2 = {
        cve_forma: 'FACTJURDICTAMASG',
        tipo_dicta: this.expedientesForm.get('tipoDictaminacion').value,
        no_expediente: this.expedientesForm.get('noExpediente').value,
      };
      this.serviceGood.getIdent(body2).subscribe({
        next: resp => {
          this.typesIdent = new DefaultSelect(resp.data, resp.count);
        },
        error: () => {
          const data = [
            {
              identificador: '',
            },
          ];
          this.typesIdent = new DefaultSelect(data, 1);
        },
      });

      this.expedientServices.getById(noExpediente).subscribe({
        next: response => {
          // this.dictaminacionesForm
          //   .get('autoriza_remitente')
          //   .setValue(response.identifier);
          // this.dictaminacionesForm
          //   .get('autoriza_nombre')
          //   .setValue(response.indicatedName);
          // ..Datos del expediente
          this.expedientesForm
            .get('criminalCase')
            .setValue(response.criminalCase);
          this.expedientesForm
            .get('averiguacionPrevia')
            .setValue(response.preliminaryInquiry);
          //this.expedientesForm.get('identifier').setValue(response.identifier);
        },
        error: () => {
          // this.cleanForm();
        },
      });
    }
  }

  /**
   * Trae información de dictamen
   * según # de expediente
   */
  disabledButtons: boolean = true;
  async onLoadDictationInfo(id: any, filter: any) {
    let noExpediente = this.expedientesForm.get('noExpediente').value || '';
    let noWheel = this.dictaminacionesForm.get('wheelNumber').value;
    const params = new FilterParams();
    if (filter == 'all') {
      params.addFilter('wheelNumber', noWheel, SearchFilter.EQ);
      params.addFilter('expedientNumber', noExpediente, SearchFilter.EQ);
    } else {
      params.addFilter('id', id, SearchFilter.EQ);
    }

    params.addFilter(
      'typeDict',
      this.expedientesForm.get('tipoDictaminacion').value,
      SearchFilter.EQ
    );
    // params['filter.wheelNumber'] = `$eq:${noWheel}`
    // params['filter.expedientNumber'] = `$eq:${noExpediente}`
    this.dictationService.getAllWithFilters(params.getParams()).subscribe({
      next: async (res: any) => {
        if (res.data.length > 1) {
          this.disabledListDictums = true;
        }
        console.log('res', res);
        console.log('fecha dic', res.data[0].dictDate);
        this.dictNumber = res.data[0].id;
        this.dictamen = res.data[0];
        this.dictamen.id = res.data[0].id;
        // this.wheelNumber = res.data[0].wheelNumber;
        this.delegationDictNumber = res.data[0].delegationDictNumber;
        this.expedientesForm
          .get('delito')
          .setValue(res.data[0].crimeStatus || null);
        this.expedientesForm
          .get('tipoDictaminacion')
          .setValue(res.data[0].typeDict || undefined);
        this.expedientesForm
          .get('noDictaminacion')
          .setValue(res.data[0].id || undefined);
        this.dictaminacionesForm
          .get('cveOficio')
          .setValue(res.data[0].passOfficeArmy || undefined);
        this.dictaminacionesForm
          .get('fechaInstructora')
          .setValue(new Date(res.data[0]?.instructorDate) || undefined);
        // this.dictaminacionesForm
        //   .get('wheelNumber')
        //   .setValue(res.data[0].wheelNumber || undefined);
        this.dictaminacionesForm
          .get('fechaDictaminacion')
          .setValue(
            this.datePipe.transform(new Date(), 'dd/MM/yyyy') || undefined
          );
        this.dictaminacionesForm
          .get('fechaResolucion')
          .setValue(new Date(res.data[0].dictHcDAte) || undefined);
        this.dictaminacionesForm
          .get('fechaNotificacionAseg')
          .setValue(new Date(res.data[0].entryHcDate) || undefined);
        this.dictaminacionesForm
          .get('fechaNotificacion')
          .setValue(new Date(res.data[0].entryDate) || undefined);
        this.expedientesForm
          .get('observaciones')
          .setValue(res.data[0].observations || undefined);
        this.keyArmyNumber = res.data[0].keyArmyNumber;
        this.statusDict = res.data[0].statusDict;

        this.dictaminacionesForm
          .get('etiqueta')
          .setValue(res.data[0].instructorDate);

        const noFecha: any = new Date(res.data[0].instructorDate);
        noFecha.setUTCDate(noFecha.getUTCDate() + 1);
        const _noFecha: any = new Date(noFecha.toISOString());

        this.dictaminacionesForm.get('fechaPPFF').setValue(_noFecha);

        this.dictaminacionesForm
          .get('estatus')
          .setValue(res.data[0].statusDict || undefined);

        console.log(res.data[0].typeDict);
        if (res.data[0].typeDict == 'PROCEDENCIA') {
          this.buttonDisabled = false;
        }
        if (
          res.data[0].statusDict == 'DICTAMINADO' ||
          res.data[0].statusDict == 'ABIERTO'
        ) {
          this.buttonDeleteDisabled = true;
        }
        this.buttonApr = false;

        const cadena = this.dictamen.passOfficeArmy;
        const elemento = '?';
        const contieneElemento = cadena.includes(elemento);

        if (contieneElemento == true || cadena == null) {
          this.disabledButtons = true;
        } else {
          this.disabledButtons = false;
        }

        if (!contieneElemento) {
          this.disabledSend = false;
          this.datepickerElement.nativeElement.disabled = false;
        } else {
          this.disabledSend = true;
        }

        await this.checkDictumXGood(this.dictamen);

        await this.getOficioDictamen(this.dictamen);
      },
      error: err => {
        console.log('err', err);
        if (
          this.expedientesForm.get('noExpediente').value &&
          this.dictaminacionesForm.get('fechaDictaminacion').value == ''
        ) {
          this.alert('warning', '', 'No tiene fecha de dictaminación');
        }

        this.activatedRoute.queryParams.subscribe((params: any) => {
          this.expedientesForm
            .get('noExpediente')
            .setValue(
              params?.EXPEDIENTE ||
                this.expedientesForm.get('noExpediente').value
            );
          this.expedientesForm
            .get('tipoDictaminacion')
            .setValue(params?.TIPO_DIC);
          this.expedientesForm
            .get('noVolante')
            .setValue(params?.VOLANTE || null);
          this.dictaminacionesForm
            .get('wheelNumber')
            .setValue(params?.VOLANTE || null);
        });

        // this.expedientesForm.get('tipoDictaminacion').setValue(null);
        // this.dictaminacionesForm.get('wheelNumber').setValue(null);
        this.dictaminacionesForm.get('cveOficio').setValue(null);
        //this.dictaminacionesForm.get('fechaDictaminacion').setValue(null);
        this.expedientesForm.get('observaciones').setValue(null);
        this.dictaminacionesForm.get('fechaNotificacion').setValue(null);
        this.dictaminacionesForm.get('etiqueta').setValue(null);
        this.dictaminacionesForm.get('estatus').setValue(null);
        this.dictaminacionesForm.get('cveOficio').setValue(null);
        this.disabledSend = true;
        this.departamentNumberOficioDict = null;
        this.delegationNumberOficioDict = null;
        console.log(err);
      },
    });
    // this.loadExpedientInfo(noExpediente).then(({ json }) => {
    //   json.then(res => {
    //     console.log("res", res)
    //     console.log('fecha dic', res.data[0].dictDate);
    //     this.dictNumber = res.data[0].id;
    //     this.dictamen = res.data[0];
    //     this.dictamen.id = res.data[0].id;
    //     // this.wheelNumber = res.data[0].wheelNumber;
    //     this.delegationDictNumber = res.data[0].delegationDictNumber;
    //     this.expedientesForm.get('delito').setValue(res.data[0].crimeStatus || undefined);
    //     this.expedientesForm.get('tipoDictaminacion').setValue(res.data[0].typeDict || undefined);
    //     this.expedientesForm.get('noDictaminacion').setValue(res.data[0].id || undefined);
    //     this.dictaminacionesForm.get('cveOficio').setValue(res.data[0].passOfficeArmy || undefined);
    //     this.dictaminacionesForm.get('fechaInstructora').setValue(new Date(res.data[0]?.instructorDate) || undefined);
    //     this.dictaminacionesForm.get('wheelNumber').setValue(res.data[0].wheelNumber || undefined);
    //     this.dictaminacionesForm.get('fechaDictaminacion').setValue(
    //       this.datePipe.transform(new Date(), 'dd-MM-yyyy') || undefined
    //     );
    //     this.dictaminacionesForm.get('fechaResolucion').setValue(new Date(res.data[0].dictHcDAte) || undefined);
    //     this.dictaminacionesForm.get('fechaNotificacionAseg').setValue(new Date(res.data[0].entryHcDate) || undefined);
    //     this.dictaminacionesForm.get('fechaNotificacion').setValue(new Date(res.data[0].entryDate) || undefined);
    //     this.expedientesForm.get('observaciones').setValue(res.data[0].observations || undefined);
    //     this.keyArmyNumber = res.data[0].keyArmyNumber;
    //     this.statusDict = res.data[0].statusDict;
    //     this.dictaminacionesForm.get('etiqueta').setValue(new Date(res.data[0].instructorDate) || undefined);
    //     this.dictaminacionesForm.get('estatus').setValue(res.data[0].statusDict || undefined);

    //     console.log(res.data[0].typeDict);
    //     if (res.data[0].typeDict == 'PROCEDENCIA') {
    //       this.buttonDisabled = false;
    //     }
    //     if (res.data[0].statusDict == 'DICTAMINADO' || res.data[0].statusDict == 'ABIERTO') {
    //       this.buttonDeleteDisabled = true;
    //     }

    //   })
    //     .catch(err => {
    //       console.log("err", err)
    //       if (this.expedientesForm.get('noExpediente').value && this.dictaminacionesForm.get('fechaDictaminacion').value == '') {
    //         this.alert('warning', '', 'No tiene fecha de dictaminación');
    //       }

    //       this.activatedRoute.queryParams.subscribe((params: any) => {
    //         this.expedientesForm.get('noExpediente').setValue(params?.EXPEDIENTE || this.expedientesForm.get('noExpediente').value);
    //         this.expedientesForm.get('tipoDictaminacion').setValue(params?.TIPO_DIC);
    //         this.expedientesForm.get('noVolante').setValue(params?.VOLANTE || null);
    //         this.dictaminacionesForm.get('wheelNumber').setValue(params?.VOLANTE || null);
    //       });

    //       // this.expedientesForm.get('tipoDictaminacion').setValue(null);
    //       // this.dictaminacionesForm.get('wheelNumber').setValue(null);
    //       this.dictaminacionesForm.get('cveOficio').setValue(null);
    //       //this.dictaminacionesForm.get('fechaDictaminacion').setValue(null);
    //       this.expedientesForm.get('observaciones').setValue(null);
    //       this.dictaminacionesForm.get('fechaNotificacion').setValue(null);
    //       this.dictaminacionesForm.get('etiqueta').setValue(null);
    //       this.dictaminacionesForm.get('estatus').setValue(null);
    //       this.dictaminacionesForm.get('cveOficio').setValue(null);
    //     });
    // });
  }

  dictamenXGood1: any;
  async checkDictumXGood(data: any) {
    this.formLoading2 = true;
    const params = new ListParams();
    this.filter3.getValue().removeAllFilters();
    this.filter3.getValue().addFilter('ofDictNumber', data.id, SearchFilter.EQ);
    this.filter3
      .getValue()
      .addFilter('typeDict', data.typeDict, SearchFilter.EQ);
    // params['filter.ofDictNumber'] = `$eq:${data.id}`;
    // params['filter.typeDict'] = `$eq:${data.typeDict}`;
    // console.log()
    this.DictationXGood1Service.getAll(
      this.filter3.getValue().getParams()
    ).subscribe({
      next: async (data: any) => {
        // this.dictamenesXBien1 = data.data;

        let result = data.data.map(async (item: any) => {
          item['status'] = item.good.status;
          item['extDomProcess'] = item.good.extDomProcess;
          item['est_disponible'] = null;
          item['di_disponible'] = null;
          item['name'] = null;
          item['goodClassNumber'] = item.good.goodClassNumber;
          item['identifier'] = item.good.identifier;
          item['statusDict'] = item.dictation.statusDict;
          // this.goods[index].est_disponible = 'S';
          // this.goods[index].di_disponible = 'S';
          // this.goods[index].name = false;
        });
        this.goodsValid = data.data;

        this.totalItems3 = data.count;
        this.dictamenXGood1 = data.data[0];
        console.log('DATA DICTXGOOD', data);
        this.idGoodSelected = this.dictamenXGood1.id;
        await this.getDocumentDicXStateM(this.dictamenXGood1.id);
        this.loading = false;
        this.formLoading2 = false;
      },
      error: (error: any) => {
        console.log('DICT', error);
        this.totalItems3 = 0;
        this.loading = false;
      },
    });
  }

  // getDicXGood() {
  //   this.formLoading2 = true;
  //   this.DictationXGood1Service.getAll(
  //     this.filter3.getValue().getParams()
  //   ).subscribe({
  //     next: resp => {
  //       resp.data.map((goodx: any) => {

  //         goodx.id = goodx.id;
  //         goodx.description = goodx.descriptionDict;
  //         goodx.menaje = '';
  //         goodx.quantity = goodx.amountDict;
  //         goodx.status = goodx.good.status;
  //         goodx.extDomProcess = goodx.good.extDomProcess;
  //         goodx.goodClassNumber = goodx.good.goodClassNumber;
  //       });
  //       this.goodsValid = [...resp.data];
  //       this.totalItems2 = resp.count;
  //       this.formLoading2 = false;
  //     },
  //     error: () => { },
  //   });
  // }

  arrgetFunt(Dicta: any) {
    let arr: any = [];
    for (let i = 0; i < this.arrDXG.length; i++) {
      if (this.arrDXG[i].id == Dicta.id) {
        arr.push(this.arrDXG[i]);
      }
    }
    return arr;
  }
  numberClassifyGood: string;
  typeDictation: string;
  crime: string;
  typeSteeringwheel: string;
  documentsSeleccionados: any[] = [];
  btnDocumentos() {
    // console.log('btnDocumentos');
    // this.listadoDocumentos = true;

    console.log('GoodClassNumber', this.goodClassNumber);

    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log('params', params);
      this.TIPO_VO = params.TIPO_VO;
      this.typeDictation = params.TIPO_DIC;
    });

    //console.log('btnDocumentos ', this.goodData2);
    //const numberClassifyGood = this.goodData2.goodClassNumber;

    const typeDictation = this.typeDictation;
    const crime = this.expedientesForm.controls['delito'].value;
    const typeSteeringwheel = this.TIPO_VO;
    // const numberClassifyGood = this.goodClassNumber;
    const numberClassifyGood = this.goodClassNumber;
    const stateNumber = this.stateNumber;
    const dateValid = this.dictaminacionesForm.get('fechaPPFF').value;
    const documentsCreate = this.documents;
    let config: ModalOptions = {
      initialState: {
        // numberClassifyGood,
        documentsCreate,
        typeDictation,
        crime,
        typeSteeringwheel,
        numberClassifyGood,
        stateNumber,
        dateValid,
        callback: (next: any) => {
          console.log('next', next);
          let arr = [];
          if (this.documents.length > 0) {
            for (let i = 0; i < this.documents.length; i++) {
              if (numberClassifyGood != this.documents[i].numberClassifyGood) {
                arr.push(this.documents[i]);
              }
            }
            this.documents = arr;
            const concatenatedArray = this.documents.concat(next);
            this.documents = concatenatedArray;
          } else {
            this.documents = next;
          }
          console.log('NEXT', this.documents);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(RDictaminaDocModalComponent, config);
  }
  btnAprobar() {
    console.log('btnAprobar');
  }
  btnRechazar() {
    return console.log('btnRechazar');
  }
  async btnBorrarDictamen() {
    let V_BAN: boolean;
    let V_ELIMINA: any = 'S';
    let V_VALID: any = null;
    let V_EXIST: any = null;
    const object = {
      vProceedingsNumber: this.expedientesForm.get('noExpediente').value,
      vTypeDicta: this.expedientesForm.get('tipoDictaminacion').value,
      vOfNumberDicta: this.dictamen.id ? this.dictamen.id : this.dictNumber,
      vWheelNumber: this.dictaminacionesForm.get('wheelNumber').value,
    };

    if (this.dictamen.id == null) {
      this.alert('warning', 'No existe dictamen a eliminar', '');
      return;
    }

    const toolbar_user = this.authService.decodeToken().preferred_username;
    const cadena = this.dictamen.passOfficeArmy
      ? this.dictamen.passOfficeArmy.indexOf('?')
      : 0;
    console.log('cadena', cadena);
    if (cadena == 0) {
      V_BAN = true;
    }

    if (cadena != 0 && this.dictamen.userDict == toolbar_user) {
      null;
    } else {
      if (this.dictamen.userDict != toolbar_user) {
        this.alert(
          'warning',
          'El Usuario no está Autorizado para Eliminar este Dictamen',
          ''
        );
        return;
      }

      if (V_BAN == true) {
        V_ELIMINA = await this.getRTdictaAarusr(toolbar_user);

        if (V_ELIMINA == 'X') {
          this.alert(
            'warning',
            'El Usuario no está autorizado para eliminar el dictamen cerrado',
            ''
          );
          return;
        }
      } else {
        V_ELIMINA = await this.getRTdictaAarusr2(
          toolbar_user,
          this.expedientesForm.get('tipoDictaminacion').value
        );

        if (V_ELIMINA == 'X') {
          this.alert(
            'warning',
            'El Usuario no está autorizado para eliminar el dictamen',
            ''
          );
          return;
        } else if (V_ELIMINA == 'S') {
          const paramsSender = new ListParams();
          paramsSender.text = this.authService.decodeToken().preferred_username;

          V_VALID = await this.getAutorizateDelete(paramsSender);

          if (V_VALID == null) {
            this.alert(
              'warning',
              'El Usuario no está autorizado para eliminar el dictamen',
              ''
            );
            return;
          }
        }
      }
    }

    // MISMO MES //
    const fechaEspecifica = new Date(this.dictamen.dictDate); // Meses se cuentan desde 0 (enero) hasta 11 (diciembre)
    // Obtener la fecha actual
    const fechaActual = new Date();
    // Comprobar si pertenecen al mismo mes
    const esMismoMes =
      fechaEspecifica.getMonth() === fechaActual.getMonth() &&
      fechaEspecifica.getFullYear() === fechaActual.getFullYear();
    if (esMismoMes) {
      console.log(
        'La fecha específica y la fecha actual pertenecen al mismo mes.'
      );
    } else {
      console.log(
        'La fecha específica y la fecha actual NO pertenecen al mismo mes.'
      );
    }
    if (!esMismoMes) {
      this.alert(
        'warning',
        'No puede Eliminar el Dictamen',
        'El mes de Dictaminación y el Actual no coinciden'
      );
      return;
    }

    if (V_BAN == true && V_ELIMINA == 'S') {
      this.alertQuestion(
        'question',
        `Se borra dictamen cerrado (Exp.: ${object.vProceedingsNumber} Tipo: ${object.vTypeDicta} No.Dict.: ${this.dictNumber})?`,
        '¿Deseas continuar?'
      ).then(async question => {
        if (question.isConfirmed) {
          for (let i = 0; i < this.goodsValid.length; i++) {
            if (
              this.expedientesForm.get('tipoDictaminacion').value ==
              'DEVOLUCION'
            ) {
              // REALIZAR CONSULTA
              V_EXIST = await this.getVexist(this.goodsValid[i].id);
              console.log(V_EXIST);
            } else if (
              this.expedientesForm.get('tipoDictaminacion').value == 'DECOMISO'
            ) {
              V_EXIST = 'XX';
            } else {
              V_EXIST = await this.getDetailProeedings(this.goodsValid[i].id);
              // RESPUESTA DE CONSULTA 'S' o 'XX'
            }

            if (V_EXIST == 'S') {
              this.alert(
                'warning',
                'Al menos un bien se encuentra en otra fase...',
                ''
              );
              return;
            } else if (V_EXIST == 'XX') {
              if (
                this.expedientesForm.get('tipoDictaminacion').value ==
                'DECOMISO'
              ) {
                // SE REALIZA CONSULTA //
                const statusAndProExtDom: any =
                  await this.GetVstatusIniVproextdomIni(this.goodsValid[i].id);
                let V_ESTATUS_INI = statusAndProExtDom.V_ESTATUS_INI;
                let V_PROEXTDOM_INI = statusAndProExtDom.V_PROEXTDOM_INI;
                if (V_ESTATUS_INI != null) {
                  let obj = {
                    vStatusIni: V_ESTATUS_INI,
                    vProextdomIni: V_PROEXTDOM_INI,
                  };
                  await this.updateGoodXGoodNumber(this.goodsValid[i].id, obj);
                  // UPDATE DE BIENES //
                }
              } else if (
                this.expedientesForm.get('tipoDictaminacion').value == 'EXT_DOM'
              ) {
                // SE REALIZA CONSULTA //
                const statusAndProExtDom: any =
                  await this.GetVstatusIniVproextdomIni(this.goodsValid[i].id);
                let V_ESTATUS_INI = statusAndProExtDom.V_ESTATUS_INI;
                let V_PROEXTDOM_INI = statusAndProExtDom.V_PROEXTDOM_INI;
                if (V_ESTATUS_INI != null) {
                  let obj = {
                    vStatusIni: V_ESTATUS_INI,
                    vProextdomIni: V_PROEXTDOM_INI,
                  };
                  await this.updateGoodXGoodNumber(this.goodsValid[i].id, obj);
                  // UPDATE DE BIENES //
                }
              } else {
                // SE REALIZA CONSULTA //
                let obj = {
                  goodNumber: this.goodsValid[i].id,
                  vcScreen: 'FACTJURDICTAMASG',
                  rulingStatus: this.goodsValid[i].statusDict,
                  opinionType: this.goodsValid[i].typeDict,
                  identifier: this.goodsValid[i].identifier,
                  status: this.goodsValid[i].status,
                };
                const statusAndProExtDom: any = await this.getVstatusIni2(obj);
                let V_ESTATUS_INI = statusAndProExtDom.V_ESTATUS_INI;

                if (V_ESTATUS_INI != null) {
                  // UPDATE DE BIENES //
                  let obj = {
                    vStatusIni: V_ESTATUS_INI,
                  };
                  await this.updateGoodXGoodNumber(this.goodsValid[i].id, obj);
                }
              }
            }
          }

          const V_TIPO_DICTA =
            this.expedientesForm.get('tipoDictaminacion').value;
          const V_NO_OF_DICTA = this.dictamen.id
            ? this.dictamen.id
            : this.dictNumber;
          const V_NO_EXPEDIENT = this.expedientesForm.get('noExpediente').value;
          if (this.dictamen.folioUniversal)
            await this.getFolioUniversalDelete(this.dictamen.folioUniversal);
          // // DELETE OFICIO_DICTAMEN_TEXTOS
          // await this.deleteOficioDictamenTextos(V_NO_OF_DICTA, V_TIPO_DICTA);
          // // DELETE COPIAS_OFICIO_DICTAMEN
          // await this.deleteCopyOficioDictamen(V_NO_OF_DICTA, V_TIPO_DICTA);
          // // DELETE OFICIO_DICTAMEN
          // await this.deleteOficioDictamen(V_NO_OF_DICTA, V_TIPO_DICTA);
          // // DELETE DICTAMINACIONES
          // await this.deleteDictamen(V_NO_OF_DICTA, V_TIPO_DICTA);

          this.dictationService.deletePupDeleteDictum(object).subscribe({
            next: (value: any) => {
              this.buttonApr = true;
              this.alert(
                'success',
                'Se ha eliminado el Dictamen correctamente',
                ''
              );
              this.onLoadGoodList(0, 'all');
              this.resetALL();
              setTimeout(() => {
                this.cveOficio.nativeElement.focus();
              }, 1000);
              this.buttonDeleteDisabled = false;
              this.statusDict = '';
              this.dictaminacionesForm.get('fechaPPFF').setValue('');
              this.dictaminacionesForm.get('autoriza_remitente').setValue(null);
              this.dictaminacionesForm.get('autoriza_nombre').setValue('');
              this.getDocumentDicXStateM(null);
            },
            error: (err: any) => {
              this.alert(
                'error',
                'Ha ocurrido un error al eliminar el dictamen',
                ''
              );
            },
          });
        }
      });
    } else {
      this.alertQuestion(
        'question',
        `Se borra dictamen cerrado (Exp.: ${object.vProceedingsNumber} Tipo: ${object.vTypeDicta} No.Dict.: ${this.dictNumber})?`,
        '¿Deseas continuar?'
      ).then(async question => {
        if (question.isConfirmed) {
          for (let i = 0; i < this.goodsValid.length; i++) {
            let obj = {
              identifier: this.goodsValid[i].identifier,
              rulingStatus: this.goodsValid[i].statusDict,
              opinionType: this.goodsValid[i].typeDict,
              goodNumber: this.goodsValid[i].id,
            };
            const statusHistGood: any = await this.GetVstatusIniVproextdomIni2(
              obj
            );
            if (statusHistGood.V_ESTATUS == 'XXX' && V_BAN == true) {
              this.alert(
                'error',
                'Al menos un bien se encuentra en otra fase...',
                ''
              );
              return;
            }

            if (statusHistGood.V_ESTATUS != 'XXX') {
              if (
                this.expedientesForm.get('tipoDictaminacion').value ==
                'DECOMISO'
              ) {
                let obj = {
                  vProextdom: this.goodsValid[i].extDomProcess,
                  goodNumber: this.goodsValid[i].id,
                };
                const getHistoryGood: any =
                  await this.GetVstatusIniVnoRegisterVproextdomIni(obj);

                if (getHistoryGood.V_ESTATUS_INI != null) {
                  let obj = {
                    vStatusIni: getHistoryGood.V_ESTATUS_INI,
                    vProextdomIni: getHistoryGood.V_PROEXTDOM_INI,
                  };
                  await this.updateGoodXGoodNumber(this.goodsValid[i].id, obj);
                }

                if (getHistoryGood.V_NO_REGISTRO != null) {
                  let obj = {
                    goodNumber: this.goodsValid[i].id,
                    recordNumber: getHistoryGood.V_NO_REGISTRO,
                  };
                  await this.deleteHistoryGoodStatus(obj);
                }
              } else if (
                this.expedientesForm.get('tipoDictaminacion').value == 'EXT_DOM'
              ) {
                let obj = {
                  vProextdom: this.goodsValid[i].extDomProcess,
                  goodNumber: this.goodsValid[i].id,
                };
                const getHistoryGood: any =
                  await this.GetVstatusIniVnoRegisterVproextdomIni(obj);

                if (getHistoryGood.V_ESTATUS_INI != null) {
                  let obj = {
                    vStatusIni: getHistoryGood.V_ESTATUS_INI,
                    vProextdomIni: getHistoryGood.V_PROEXTDOM_INI,
                  };
                  await this.updateGoodXGoodNumber(this.goodsValid[i].id, obj);
                }

                if (getHistoryGood.V_NO_REGISTRO != null) {
                  let obj = {
                    goodNumber: this.goodsValid[i].id,
                    recordNumber: getHistoryGood.V_NO_REGISTRO,
                  };
                  await this.deleteHistoryGoodStatus(obj);
                }
              } else {
                let obj = {
                  goodNumber: this.goodsValid[i].id,
                  identifier: this.goodsValid[i].identifier,
                  opinionType: this.goodsValid[i].typeDict,
                  rulingStatus: this.goodsValid[i].statusDict,
                  status: this.goodsValid[i].status,
                  vcScreen: 'FACTJURDICTAMASG',
                  vStatus: statusHistGood.V_ESTATUS,
                };

                const getHistoryGood: any = await this.getVstatusIniVnoRegister(
                  obj
                );

                if (getHistoryGood.V_ESTATUS_INI != null) {
                  let obj = {
                    vStatusIni: getHistoryGood.V_ESTATUS_INI,
                  };
                  await this.updateGoodXGoodNumber(this.goodsValid[i].id, obj);
                }

                if (getHistoryGood.V_NO_REGISTRO != null) {
                  let obj = {
                    goodNumber: this.goodsValid[i].id,
                    recordNumber: getHistoryGood.V_NO_REGISTRO,
                  };
                  await this.deleteHistoryGoodStatus(obj);
                }
              }
            }
          }

          const V_TIPO_DICTA =
            this.expedientesForm.get('tipoDictaminacion').value;
          const V_NO_OF_DICTA = this.dictamen.id
            ? this.dictamen.id
            : this.dictNumber;
          const V_NO_EXPEDIENT = this.expedientesForm.get('noExpediente').value;

          if (this.dictamen.folioUniversal)
            await this.getFolioUniversalDelete(this.dictamen.folioUniversal);

          this.dictationService.deletePupDeleteDictum(object).subscribe({
            next: (value: any) => {
              this.buttonApr = true;
              this.alert(
                'success',
                'Se ha eliminado el Dictamen correctamente',
                ''
              );
              this.onLoadGoodList(0, 'all');
              this.resetALL();
              setTimeout(() => {
                this.cveOficio.nativeElement.focus();
              }, 1000);
              this.buttonDeleteDisabled = false;
              this.statusDict = '';
              this.dictaminacionesForm.get('fechaPPFF').setValue('');
              this.dictaminacionesForm.get('autoriza_remitente').setValue(null);
              this.dictaminacionesForm.get('autoriza_nombre').setValue('');
              this.getDocumentDicXStateM(null);
            },
            error: (err: any) => {
              this.alert(
                'error',
                'Ha ocurrido un error al eliminar el dictamen',
                ''
              );
            },
          });
        }
      });
    }

    // this.btnDeleteDictation();
  }

  getFolioUniversalDelete(folioUniversal: any) {
    return new Promise((resolve, reject) => {
      this.documentService.remove(folioUniversal).subscribe({
        next: (resp: any) => {
          resolve(resp);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  // DELETE OFICIO_DICTAMEN_TEXTOS
  async deleteOficioDictamenTextos(ofDictNumber: any, type: string) {
    const body = {
      dictatesNumber: ofDictNumber,
      rulingType: type,
    };

    console.log('DELETE OFICIO_DICTAMEN_TEXTOS', body);

    this.jobDictumTextsService.remove(body).subscribe({
      next: (resp: any) => {
        // this.alert(
        //   'success',
        //   'Datos eliminados correctamente',
        //   'tabla: OFICIO_DICTAMEN_TEXTOS'
        // );
        this.loading = false;
      },
      error: error => {
        // this.onLoadToast(
        //   'error',
        //   'Error al eliminar los textos del Oficio.',
        //   'tabla: OFICIO_DICTAMEN_TEXTOS'
        // );
        this.loading = false;
      },
    });
  }

  // DELETE DOCUMENTOS_DICTAMEN_X_BIEN_M -- (SIN ENDPOINT PARA ELIMINAR) //
  async deleteDocsDictXGoodM(data: any) {
    this.documentService.deleteDocumentsDictuXStateM(data).subscribe({
      next: (resp: any) => {
        // this.alert(
        //   'error',
        //   'Datos Eliminados Correctamente',
        //   'tabla: DOCUMENTOS_DICTAMEN_X_BIEN_M'
        // );
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        // this.onLoadToast(
        //   'error',
        //   'Error al eliminar los documentos de los bienes',
        //   'tabla: DOCUMENTOS_DICTAMEN_X_BIEN_M'
        // );
      },
    });
  }
  // DELETE DICTAMINACION_X_BIEN1
  async deleteDictaXGood1(ofDictNumber: any, type: string, expedient: any) {
    const dictGood1: any = await this.getDictaXGood_(
      ofDictNumber,
      type,
      expedient
    );

    if (dictGood1) {
      console.log('DELETE DICTAMINACION_X_BIEN1', dictGood1);
      for (let i = 0; i < dictGood1.length; i++) {
        if (dictGood1[i].id != null) {
          let body = {
            ofDictNumber: dictGood1[i].ofDictNumber,
            id: dictGood1[i].id,
            typeDict: dictGood1[i].typeDict,
          };

          this.DictationXGood1Service.remove(body).subscribe({
            next: (resp: any) => {
              // this.alert(
              //   'success',
              //   'Datos eliminados correctamente',
              //   'tabla: DICTAMINACION_X_BIEN1'
              // );
              this.loading = false;
            },
            error: error => {
              // this.onLoadToast(
              //   'error',
              //   'Error al eliminar los bienes.',
              //   'tabla: DICTAMINACION_X_BIEN1'
              // );
              this.loading = false;
            },
          });
        }
      }
    }
  }

  // DELETE COPIAS_OFICIO_DICTAMEN
  async deleteCopyOficioDictamen(ofDictNumber: any, type: string) {
    const copyDictOfi: any = await this.getCopiasDictOfi(ofDictNumber, type);

    if (copyDictOfi) {
      console.log('DELETE COPIAS_OFICIO_DICTAMEN', copyDictOfi);
      for (let i = 0; i < copyDictOfi.length; i++) {
        if (copyDictOfi[i].id != null) {
          const body: IDictationCopies = {
            id: copyDictOfi[i].id,
            numberOfDicta: copyDictOfi[i].numberOfDicta,
            typeDictamination: copyDictOfi[i].typeDictamination,
            recipientCopy: copyDictOfi[i].recipientCopy,
            copyDestinationNumber: copyDictOfi[i].copyDestinationNumber,
            personExtInt: copyDictOfi[i].personExtInt,
            namePersonExt: copyDictOfi[i].namePersonExt,
            registerNumber: copyDictOfi[i].registerNumber,
          };

          this.dictationService.deleteCopiesOfficialOpinion(body).subscribe({
            next: (resp: any) => {
              // this.alert(
              //   'success',
              //   'Datos eliminados correctamente',
              //   'tabla: COPIAS_OFICIO_DICTAMEN'
              // );
              this.loading = false;
            },
            error: error => {
              // this.onLoadToast(
              //   'error',
              //   'Error al eliminar las copias del Oficio.',
              //   'tabla: COPIAS_OFICIO_DICTAMEN'
              // );
              this.loading = false;
            },
          });
        }
      }
    }
  }
  // GET COPIAS_OFICIO_DICTAMEN
  async getCopiasDictOfi(ofDictNumber: any, type: string) {
    const params = new ListParams();
    params['filter.numberOfDicta'] = `$eq:${ofDictNumber}`;
    params['filter.typeDictamination'] = `$eq:${type}`;
    return new Promise((resolve, reject) => {
      this.dictationService.findUserByOficNum(params).subscribe({
        next: (resp: any) => {
          const data = resp.data;
          this.loading = false;
          resolve(data);
        },
        error: error => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // DELETE OFICIO_DICTAMEN
  async deleteOficioDictamen(ofDictNumber: any, type: string) {
    const body = {
      officialNumber: ofDictNumber,
      typeDict: type,
    };
    console.log('DELETE OFICIO_DICTAMEN', body);

    this.oficialDictationService.remove(body).subscribe({
      next: (resp: any) => {
        // this.alert(
        //   'success',
        //   'Datos eliminados correctamente',
        //   'tabla: OFICIO_DICTAMEN'
        // );
        this.loading = false;
      },
      error: error => {
        // this.onLoadToast(
        //   'error',
        //   'Error al eliminar el Oficio del Dictamen.',
        //   'tabla: OFICIO_DICTAMEN'
        // );
        this.loading = false;
      },
    });
  }

  // DICTAMINACION_X_BIEN1
  async getDictaXGood_(ofDictNumber: any, type: string, expedient: any) {
    const params = new ListParams();
    params['filter.ofDictNumber'] = `$eq:${ofDictNumber}`;
    params['filter.typeDict'] = `$eq:${type}`;
    params['filter.proceedingsNumber'] = `$eq:${expedient}`;
    return new Promise((resolve, reject) => {
      this.DictationXGood1Service.getAll(params).subscribe({
        next: (resp: any) => {
          console.log('respresprespresp', resp);

          const data = resp.data;
          this.loading = false;
          resolve(data);
        },
        error: error => {
          this.loading = false;
          // this.onLoadToast(
          //   'error',
          //   error.error.message,
          //   'tabla: DICTAMINACION_X_BIEN1'
          // );
          resolve(null);
        },
      });
    });
  }

  // DELETE DICTAMINACIONES
  async deleteDictamen(ofDictNumber: any, type: string) {
    const body = {
      id: ofDictNumber,
      typeDict: type,
    };
    console.log('DELETE DICTAMINACIONES', body);

    this.dictationService.remove(body).subscribe({
      next: (resp: any) => {
        this.buttonApr = true;
        this.alert('success', 'Se ha eliminado el Dictamen correctamente', '');
        this.onLoadGoodList(0, 'all');
        this.resetALL();
        setTimeout(() => {
          this.cveOficio.nativeElement.focus();
        }, 1000);
        this.buttonDeleteDisabled = false;
        this.statusDict = '';
        this.dictaminacionesForm.get('fechaPPFF').setValue('');
        this.dictaminacionesForm.get('autoriza_remitente').setValue(null);
        this.dictaminacionesForm.get('autoriza_nombre').setValue('');
        this.getDocumentDicXStateM(null);

        // this.alert('success', 'Se eliminó correctamente el dictamen', '');
        this.loading = false;
      },
      error: error => {
        this.alert(
          'error',
          'Error al eliminar el Dictamen.',
          'tabla: DICTAMINACIONES'
        );
        this.loading = false;
      },
    });
  }

  async getDeleteDocsDictXGoodM2(data: any) {
    const params = new ListParams();
    params['filter.stateNumber'] = `$eq:${data.stateNumber}`;
    params['filter.expedientNumber'] = `$eq:${data.expedientNumber}`;
    return new Promise((resolve, reject) => {
      this.documentService.getDeleteDocumentsDictuXStateM(params).subscribe({
        next: (resp: any) => {
          const data = resp.data;
          resolve(data);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // UPDATE NOTIFICACIONES
  async updateNotifications(noVolante: any) {
    const body: any = {
      dictumKey: null,
    };
    console.log('UPDATE NOTIFICACIONES', body);

    // this.notificationService.updateWithBody(noVolante, body).subscribe({
    //   next: (resp: any) => {
    //     // this.alert(
    //     //   'success',
    //     //   'Datos actualizados correctamente',
    //     //   'tabla: NOTIFICACIONES'
    //     // );
    //     this.loading = false;
    //   },
    //   error: error => {
    //     // this.onLoadToast(
    //     //   'error',
    //     //   'Error al actualizar el volante.',
    //     //   'tabla: NOTIFICACIONES'
    //     // );
    //     this.loading = false;
    //   },
    // });
  }

  async updateGoodXGoodNumber(params: any, body: any) {
    return new Promise((resolve, reject) => {
      this.serviceGood.updateGoodXGoodNumber(params, body).subscribe({
        next: async (resp: any) => {
          resolve(resp);

          this.loading = false;
        },
        error: err => {
          resolve(null);
          this.loading = false;
          return;
        },
      });
    });
  }
  async deleteHistoryGoodStatus(params: any) {
    return new Promise((resolve, reject) => {
      this.serviceGood.deleteHistoricalStatusGoodXrecord(params).subscribe({
        next: async (resp: any) => {
          console.log('resp', resp);

          resolve(true);
          this.loading = false;
        },
        error: err => {
          console.log('err', err);
          resolve(false);
          this.loading = false;
          return;
        },
      });
    });
  }
  async getVstatusIni2(params: any) {
    return new Promise((resolve, reject) => {
      this.serviceGood.getVstatusIni2(params).subscribe({
        next: async (resp: any) => {
          console.log('resp', resp);
          if (resp.data.length > 0) {
            let obj: any = {
              V_ESTATUS_INI: null,
            };
            resolve(obj);
          } else {
            let obj: any = {
              V_ESTATUS_INI: null,
            };
            resolve(obj);
          }

          this.loading = false;
        },
        error: err => {
          console.log('err', err);
          let obj: any = {
            V_ESTATUS_INI: null,
          };
          resolve(obj);
          this.loading = false;
          return;
        },
      });
    });
  }
  async getVstatusIniVnoRegister(params: any) {
    return new Promise((resolve, reject) => {
      this.serviceGood.getVstatusIniVnoRegister(params).subscribe({
        next: async (resp: any) => {
          console.log('resp', resp);
          if (resp.data.length > 0) {
            let obj: any = {
              V_ESTATUS_INI: resp.data[0].v_estatus_ini,
              V_NO_REGISTRO: resp.data[0].v_no_registro,
            };
            resolve(obj);
          } else {
            let obj: any = {
              V_ESTATUS_INI: null,
              V_NO_REGISTRO: null,
            };
            resolve(obj);
          }

          this.loading = false;
        },
        error: err => {
          console.log('err', err);
          let obj: any = {
            V_ESTATUS_INI: null,
            V_NO_REGISTRO: null,
          };
          resolve(obj);
          this.loading = false;
          return;
        },
      });
    });
  }

  async GetVstatusIniVnoRegisterVproextdomIni(params: any) {
    return new Promise((resolve, reject) => {
      this.serviceGood.GetVstatusIniVnoRegisterVproextdomIni(params).subscribe({
        next: async (resp: any) => {
          console.log('resp', resp);
          if (resp.data.length > 0) {
            let obj: any = {
              V_ESTATUS_INI: resp.data[0].v_estatus_ini,
              V_NO_REGISTRO: resp.data[0].v_no_registro,
              V_PROEXTDOM_INI: resp.data[0].v_proextdom_ini,
            };
            resolve(obj);
          } else {
            let obj: any = {
              ESTATUS: null,
              V_NO_REGISTRO: null,
              V_PROEXTDOM_INI: null,
            };
            resolve(obj);
          }

          this.loading = false;
        },
        error: err => {
          console.log('err', err);
          let obj: any = {
            V_ESTATUS: null,
            V_NO_REGISTRO: null,
            V_PROEXTDOM_INI: null,
          };
          resolve(obj);
          this.loading = false;
          return;
        },
      });
    });
  }
  async GetVstatusIniVproextdomIni2(params: any) {
    return new Promise((resolve, reject) => {
      this.serviceGood.GetVstatusIniVproextdomIni2(params).subscribe({
        next: async (resp: any) => {
          console.log('resp', resp);
          if (resp.data.length > 0) {
            let obj: any = {
              V_ESTATUS: resp.data[0].v_estatus,
              V_PROEXTDOM: resp.data[0].v_proextdom,
            };
            resolve(obj);
          } else {
            let obj: any = {
              V_ESTATUS: null,
              V_PROEXTDOM: null,
            };
            resolve(obj);
          }

          this.loading = false;
        },
        error: err => {
          console.log('err', err);
          let obj: any = {
            V_ESTATUS: 'XXX',
            V_PROEXTDOM: 'XXX',
          };
          resolve(obj);
          this.loading = false;
          return;
        },
      });
    });
  }

  async GetVstatusIniVproextdomIni(params: any) {
    return new Promise((resolve, reject) => {
      this.serviceGood.GetVstatusIniVproextdomIni(params).subscribe({
        next: async (resp: any) => {
          console.log('resp', resp);
          if (resp.data.length > 0) {
            let obj: any = {
              V_ESTATUS_INI: resp.data[0].v_estatus_ini,
              V_PROEXTDOM_INI: resp.data[0].v_proextdom_ini,
            };
            resolve(obj);
          } else {
            let obj: any = {
              V_ESTATUS_INI: null,
              V_PROEXTDOM_INI: null,
            };
            resolve(obj);
          }

          this.loading = false;
        },
        error: err => {
          console.log('err', err);
          let obj: any = {
            V_ESTATUS_INI: null,
            V_PROEXTDOM_INI: null,
          };
          resolve(obj);
          this.loading = false;
          return;
        },
      });
    });
  }
  async getDetailProeedings(params: any) {
    return new Promise((resolve, reject) => {
      this.detailProceedingsDevolutionService
        .getRecepcionProcedings(params)
        .subscribe({
          next: async (resp: any) => {
            console.log('USER', resp);

            resolve('S');

            this.loading = false;
          },
          error: err => {
            console.log('err', err);
            resolve('XX');
            this.loading = false;
            return;
          },
        });
    });
  }

  async getVexist(params: any) {
    return new Promise((resolve, reject) => {
      this.serviceGood.GetVexist(params).subscribe({
        next: async (resp: any) => {
          console.log('USER', resp);

          resolve('S');

          this.loading = false;
        },
        error: err => {
          console.log('err', err);
          resolve('XX');
          this.loading = false;
          return;
        },
      });
    });
  }

  async getRTdictaAarusr(toolbar_user: any) {
    return new Promise((resolve, reject) => {
      // const params = new ListParams();
      // params['filter.user'] = `$eq:${toolbar_user}`;
      // params['filter.reading'] = `$eq:S`;
      // params['filter.writing'] = `$eq:S`;
      this.dictationService.getVElimina(toolbar_user).subscribe({
        next: async (resp: any) => {
          console.log('USER', resp);
          resolve('S');
          this.loading = false;
        },
        error: err => {
          console.log('err', err);
          resolve('X');
          this.loading = false;
          return;
        },
      });
    });
  }

  async getRTdictaAarusr2(toolbar_user: any, typeNumber: any) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.user'] = `$eq:${toolbar_user}`;
      params['filter.delete'] = `$not:null`;
      params['filter.typeNumber'] = `$eq:${typeNumber}`;
      this.dictationService.getRTdictaAarusr(params).subscribe({
        next: async (resp: any) => {
          console.log('USER', resp);
          resolve('S');
          this.loading = false;
        },
        error: err => {
          console.log('err', err);
          resolve('X');
          this.loading = false;
          return;
        },
      });
    });
  }

  CLAVE_OFICIO_ARMADA: any;
  P_GEST_OK: any;
  CONSULTA: any;
  VOLANTE: any;
  EXPEDIENTE: any;
  TIPO_DICT: any;
  TIPO_VO: any;

  // IMPRESIONES - BUTTON //
  btnImprimeOficio() {
    console.log('this.P_NO_TRAMITE', this.P_NO_TRAMITE);
    // return
    this.activatedRoute.queryParams.subscribe((params: any) => {
      console.log('params', params);
      this.TIPO_VO = params.TIPO_VO;
      this.P_GEST_OK = params.P_GEST_OK;
    });

    console.log('this.dictamen.id', this.dictamen.id);
    let exp = this.expedientesForm.get('noExpediente').value;
    let typeDict = this.expedientesForm.get('tipoDictaminacion').value;
    if (exp !== '' && this.dictNumber !== null) {
      this.router.navigate(
        [baseMenu + baseMenuDepositaria + DEPOSITARY_ROUTES_2[0].link],
        {
          queryParams: {
            PAQUETE: 0,
            P_GEST_OK: '',
            CLAVE_OFICIO_ARMADA: this.dictamen.passOfficeArmy,
            P_NO_TRAMITE: this.P_NO_TRAMITE,
            TIPO: typeDict,
            P_VALOR: this.dictNumber ? this.dictNumber : this.dictamen.id,
            TIPO_VO: this.TIPO_VO,
            // CLAVE_OFICIO_ARMADA: cveOficio,
            // TIPO: tipo,
            // P_VALOR: noDictaminacion,
            // PAQUETE: '',
            // P_GEST_OK: 1, // ..hardcoded - no llega de la pantalla anterior
            // P_NO_TRAMITE: 1044141, // ..hardcoded - no llega de la pantalla anterior
            origin: 'FACTJURDICTAMASG',
            origin3: 'FACTGENACTDATEX',
          },
        }
      );
      // this.router.navigate(
      //   ['/pages/juridical/depositary/legal-opinions-office/'],
      //   {
      //     queryParams: {
      //       origin: 'FACTJURDICTAMASG', //Cambiar
      //       P_VALOR: this.dictamen.id,
      //       P_NO_TRAMITE: this.expedientesForm.get('noExpediente').value,
      //       CLAVE_OFICIO_ARMADA:
      //         this.dictaminacionesForm.get('cveOficio').value,
      //       P_GEST_OK: this.P_GEST_OK,
      //       CONSULTA: this.CONSULTA,
      //       VOLANTE: this.dictaminacionesForm.get('wheelNumber').value,
      //       EXPEDIENTE: this.expedientesForm.get('noExpediente').value,
      //       TIPO: this.expedientesForm.get('tipoDictaminacion').value,
      //       TIPO_VO: this.TIPO_VO,
      //       // this.expedientesForm.get('noVolante').value
      //     },
      //   }
      // );
    } else {
      this.alert(
        'warning',
        'Necesitas un Número de Expediente con Oficio.',
        ''
      );
      return; // Si 'documents' está vacío, detiene la ejecución aquí
    }
  }

  btnParcializar() {
    this.btnVerify();
  }

  btnOficioSubstanciacion() {
    console.log('btnOficioSubstanciacion');
    let typeDict = this.expedientesForm.get('tipoDictaminacion').value;
    //MANDA A  LLAMAR LA FORMA FACTADBOFICIOGEST
    this.router.navigate(
      [
        '/pages/documents-reception/flyers-registration/related-document-management/1',
      ],
      {
        queryParams: {
          VOLANTE: this.dictaminacionesForm.get('wheelNumber').value,
          EXPEDIENTE: this.expedientesForm.get('noExpediente').value,
          DOC: 'N',
          TIPO_OF: 'EXTERNO',
          SALE: 'C',
          BIEN: 'N',
          PLLAMO: typeDict,
          P_GEST_OK: this.P_GEST_OK,
          P_NO_TRAMITE: this.P_NO_TRAMITE,
          NO_DICTAMEN: this.dictamen.id ? this.dictamen.id : this.dictNumber, //No lo pide originalmente
        },
      }
    );
  }

  btnOficioRelacionado() {
    console.log('btnOficioRelacionado');

    //MANDA A LLAMAR A LA FORMA FACTADBOFICIOGESTREL
    this.router.navigate(
      [
        '/pages/documents-reception/flyers-registration/related-document-management/2',
      ],
      {
        queryParams: {
          VOLANTE: this.dictaminacionesForm.get('wheelNumber').value,
          EXPEDIENTE: this.expedientesForm.get('noExpediente').value,
          P_GEST_OK: this.P_GEST_OK,
          P_NO_TRAMITE: this.P_NO_TRAMITE,
          PLLAMO: 'ABANDONO',
        },
      }
    );
  }
  // PUP_DICTA_LOG
  async PUP_DICTA_LOG(data: any) {
    const fechaActual = new Date();

    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    const anio = fechaActual.getFullYear();
    const hora = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    const segundos = fechaActual.getSeconds();

    const LST_TIEMPO = `${dia}-${mes}-${anio} ${hora}:${minutos}:${segundos}`;
    return LST_TIEMPO;
  }

  btnSalir() {
    // --
    // Sube documentos seleccionados
    if (this.selectedDocuments.length > 0) {
      this.listadoDocumentos = false;
      this.documents = this.documents.concat(this.selectedDocuments);
      this.selectedDocuments.forEach(doc => {
        this.goods = this.goods.filter(_doc => _doc.id != doc.id);
      });
      this.selectedDocuments = [];
    } else {
      this.alert(
        'warning',
        '',
        'Debes seleccionar la fecha de un documento para continuar.'
      );
    }
  }
  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }

  isGoodSelected(_good: IGood) {
    const exists = this.selectedGooods.find(good => good.id == _good.id);
    return !exists ? false : true;
  }

  goodSelectedChange(good: IGood, selected: boolean) {
    if (selected) {
      this.selectedGooods.push(good);
    } else {
      this.selectedGooods = this.selectedGooods.filter(
        _good => _good.id != good.id
      );
    }
  }
  onGoodSelectValid(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChangeValid(data.row, data.toggle),
    });
  }

  isGoodSelectedValid(_good: IGood) {
    const exists = this.selectedGooodsValid.find(good => good.id == _good.id);
    return !exists ? false : true;
  }

  goodSelectedChangeValid(good: IGood, selected?: boolean) {
    if (selected) {
      this.selectedGooodsValid.push(good);
    } else {
      this.selectedGooodsValid = this.selectedGooodsValid.filter(
        _good => _good.id != good.id
      );
    }
  }

  /**
   * Selected document methods
   */
  // onDocsSelectValid(instance: CheckboxElementComponent) {
  //   instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
  //     next: data => this.documentSelectedChangeValid(data.row, data.toggle),
  //   });
  // }
  // onDocsSelectValid(instance: DatePickerElementComponent) {
  //   instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
  //     next: (data: any) =>
  //       this.documentSelectedChangeValid(data.row, data.toggle),
  //   });
  // }
  // isDocumentSelectedValid(_doc: any) {
  //   const exists = this.selectedDocuments.find(doc => doc.id == _doc.id);
  //   return !exists ? false : true;
  // }
  documentSelectedChangeValid(doc: any, selected?: string) {
    console.log('fecha ', selected);
    doc = { ...doc, selectedDate: selected };
    if (selected) {
      this.selectedDocuments.push(doc);
    } else {
      this.selectedDocuments = this.selectedDocuments.filter(
        _doc => _doc.id != doc.id
      );
    }
  }

  addAll() {
    if (!this.expedientesForm.get('identifier').value) {
      this.alert('warning', 'Debe seleccionar un identificador', '');
      return;
    }

    if (this.dictamen.passOfficeArmy != null) {
      const cadena = this.dictamen.passOfficeArmy;
      const elemento = '?';
      const contieneElemento = cadena.includes(elemento);

      if (contieneElemento == false) {
        this.alert('warning', 'Este dictamen ya no se puede modificar', '');
        return;
      }
    }

    if (this.statusDict == 'DICTAMINADO' || this.statusDict == 'IMPROCEDENTE') {
      this.alert(
        'warning',
        'Este dictamen ya tiene un estatus DICTAMINADO',
        ''
      );
      return;
    }

    if (this.expedientesForm.get('identifier').value) {
      this.isIdent = false;
    }

    if (!this.dictaminacionesForm.get('autoriza_remitente').value) {
      this.alert('warning', 'Debe especificar quien autoriza dictamen', '');
      return;
    }

    if (this.expedientesForm.get('type').value == null) {
      this.alert('warning', 'Debe seleccionar un tipo de bien', '');
      return;
    }

    if (!this.dictaminacionesForm.get('fechaPPFF').value) {
      this.alert('warning', `Debe capturar la ${this.label}`, '');
      return;
    }
    let typeDict = this.expedientesForm.get('tipoDictaminacion').value;
    if (this.goods.length > 0) {
      this.goods.forEach(_g => {
        console.log(_g);

        if (_g.goodDictaminado == true) {
          this.onLoadToast(
            'warning',
            `El bien ${_g.id} ya se encuentra dictaminado`,
            ''
          );
          return;
        }

        if (
          _g.di_es_numerario == 'S' &&
          _g.di_esta_conciliado == 'N' &&
          typeDict
        ) {
          this.onLoadToast(
            'warning',
            `El numerario no esta conciliado`,
            `No. Bien: ${_g.id}`
          );
          return;
        }

        if (_g.est_disponible == 'S' && _g.di_disponible == 'S') {
          _g.est_disponible = 'N';
          _g.di_disponible = 'N';
          _g.name = false;
          let valid = this.goodsValid.some(goodV => goodV == _g);

          if (!valid) {
            this.goodsValid = [...this.goodsValid, _g];
          }
        }

        this.totalItems3 = this.goodsValid.length;
        // if (_g.status !== 'STI') {
        //   // _g.status = 'STI';
        //   _g.est_disponible = 'N';
        //   _g.di_disponible = 'N';
        //   _g.name = false;
        //   let valid = this.goodsValid.some(goodV => goodV == _g);
        //   if (!valid) {
        //     this.goodsValid = [...this.goodsValid, _g];
        //   }
        // }
      });
    }
  }

  async addSelect() {
    if (this.dictamen.passOfficeArmy != null) {
      const cadena = this.dictamen.passOfficeArmy;
      const elemento = '?';
      const contieneElemento = cadena.includes(elemento);

      if (contieneElemento == false) {
        this.alert('warning', 'Este dictamen ya no se puede modificar', '');
        return;
      }
    }

    if (this.statusDict == 'DICTAMINADO' || this.statusDict == 'IMPROCEDENTE') {
      this.alert(
        'warning',
        'Este dictamen ya tiene un estatus DICTAMINADO',
        ''
      );
      return;
    }

    if (this.expedientesForm.get('identifier').value) {
      this.isIdent = false;
    }

    if (!this.dictaminacionesForm.get('autoriza_remitente').value) {
      this.alert('warning', 'Debe especificar quien autoriza dictamen', '');
      return;
    }

    if (this.expedientesForm.get('type').value == null) {
      this.alert('warning', 'Debe seleccionar un tipo de bien', '');
      return;
    }

    if (!this.expedientesForm.get('identifier').value) {
      this.alert('warning', 'Debe seleccionar un identificador', '');
      return;
    }

    if (!this.dictaminacionesForm.get('fechaPPFF').value) {
      this.alert('warning', `Debe capturar la ${this.label}`, '');
      return;
    }
    let obj = {};
    const statusScreen: any = await this.getScreenStatus(obj);

    console.log(
      "== 'PROCEDENCIA'",
      this.expedientesForm.get('tipoDictaminacion').value
    );
    let typeDict = this.expedientesForm.get('tipoDictaminacion').value;
    console.log('this.selectedGooods', this.selectedGooods);
    if (this.selectedGooods.length > 0) {
      this.selectedGooods.forEach((good: any) => {
        if (!this.goodsValid.some(v => v === good)) {
          let indexGood = this.goods.findIndex(_good => _good.id == good.id);
          console.log('aaa', this.goods);
          console.log('indexGood', indexGood);
          if (indexGood != -1) {
            if (this.goods[indexGood].goodDictaminado == true) {
              this.onLoadToast(
                'warning',
                `El bien ${this.goods[indexGood].id} ya se encuentra dictaminado`,
                ''
              );
              return;
            } else if (
              this.goods[indexGood].est_disponible == 'N' ||
              this.goods[indexGood].di_disponible == 'N'
            ) {
              return;
            } else if (
              this.goods[indexGood].di_es_numerario == 'S' &&
              this.goods[indexGood].di_esta_conciliado == 'N' &&
              typeDict
            ) {
              this.onLoadToast(
                'warning',
                'El numerario no está conciliado',
                ''
              );
              return;
            }

            // IF: bienes.DI_ES_NUMERARIO = 'S' AND: bienes.DI_ESTA_CONCILIADO = 'N' AND: VARIABLES.TIPO_DICTA = 'PROCEDENCIA' THEN
            // LIP_MENSAJE('El numerario no está conciliado', 'S');
            this.goods[indexGood].est_disponible = 'N';
            this.goods[indexGood].di_disponible = 'N';
          }

          this.goodsValid.push(good);
          this.goodsValid = [...this.goodsValid];
          this.totalItems3 = this.goodsValid.length;
        } else {
          if (good.di_disponible == 'N') {
            this.alert('warning', `El bien ${good.goodId} ya existe`, '');
          }
        }
      });
    }
  }

  getScreenStatus(good: any) {
    let obj = {
      identifier: good.identifier,
      estatus: good.status,
      vc_pantalla: 'FACTJURABANDONOS',
      extDomProcess: good.extDomProcess,
      propertyNum: good.id,
    };

    // console.log('re', obj);
    return new Promise((resolve, reject) => {
      this.screenServ.getAllFiltro_(obj).subscribe({
        next: (resp: any) => {
          // console.log('ESCR', resp);
          const data = resp.data[0];

          let objScSt = {
            di_disponible: 'S',
          };

          resolve(objScSt);
          this.loading = false;
        },
        error: (error: any) => {
          // console.log('SCREEN ERROR', error.error.message);
          let objScSt: any = {
            di_disponible: 'N',
          };
          resolve(objScSt);
          this.loading = false;
        },
      });
    });
  }
  removeSelect() {
    if (this.dictamen.passOfficeArmy != null) {
      const cadena = this.dictamen.passOfficeArmy;
      const elemento = '?';
      const contieneElemento = cadena.includes(elemento);

      if (contieneElemento == false) {
        this.alert('warning', 'Este dictamen ya no se puede modificar', '');
        return;
      }
    }

    if (this.statusDict == 'DICTAMINADO' || this.statusDict == 'IMPROCEDENTE') {
      this.alert(
        'warning',
        'Este dictamen ya tiene un estatus DICTAMINADO',
        ''
      );
      return;
    }

    if (this.selectedGooodsValid.length > 0) {
      // this.goods = this.goods.concat(this.selectedGooodsValid);
      this.selectedGooodsValid.forEach(good => {
        console.log('good', good);
        this.goodsValid = this.goodsValid.filter(_good => _good.id != good.id);
        let index = this.goods.findIndex(g => g.id === good.id);
        if (index != -1) {
          this.goods[index].est_disponible = 'S';
          this.goods[index].di_disponible = 'S';
          // this.goods[index].status = 'ADM';
          this.goods[index].name = false;
        }

        // this.selectedGooods = [];
      });
      this.selectedGooodsValid = [];
      this.totalItems3 = this.goodsValid.length;
    }

    // if (this.selectedGooodsValid.length > 0) {
    //   console.log('this.selectedGooodsValid', this.selectedGooodsValid);

    //   // let arr: any = [];
    //   // let arr2: any = [];
    //   // for (let i = 0; i < this.goodsValid.length; i++) {
    //   //   if (this.goodsValid[i].ofDictNumber == null) {
    //   //     arr2.push(this.goodsValid[i]);
    //   //   } else {
    //   //     arr.push(this.goodsValid[i]);
    //   //   }
    //   // }
    //   // this.goodsValid = arr2;
    //   this.goods = this.goods.concat(this.selectedGooodsValid);
    //   this.selectedGooodsValid.forEach(good => {
    //     this.goodsValid = this.goodsValid.filter(_good => _good.id != good.id);
    //     let index = this.goods.findIndex(g => g === good);
    //     this.goods[index].est_disponible = 'S';
    //     this.goods[index].di_disponible = 'S';

    //     //this.goods[index].status = 'ADM';
    //     this.goods[index].name = false;
    //     // this.selectedGooods = [];
    //   });
    //   this.selectedGooodsValid = [];
    //   // this.goodsValid = arr;
    // }
  }
  removeAll() {
    if (this.statusDict == 'DICTAMINADO' || this.statusDict == 'IMPROCEDENTE') {
      this.alert(
        'warning',
        'Este dictamen ya tiene un estatus DICTAMINADO',
        ''
      );
      return;
    }

    if (this.dictamen.passOfficeArmy != null) {
      const cadena = this.dictamen.passOfficeArmy;
      const elemento = '?';
      const contieneElemento = cadena.includes(elemento);

      if (contieneElemento == false) {
        this.alert('warning', 'Este dictamen ya no se puede modificar', '');
        return;
      }
    }

    console.log('aaa', this.goodsValid);
    if (this.goodsValid.length > 0) {
      this.goodsValid.forEach(good => {
        this.goodsValid = this.goodsValid.filter(_good => _good.id != good.id);
        // let index = this.goods.findIndex(g => g === good);
        // this.goods[index].status = 'ADM';
        // this.goods[index].name = false;
        // this.goodsValid = this.goodsValid.filter(_good => _good.id != good.id);
        console.log('aaa2', this.goodsValid);
        let index = this.goods.findIndex(g => g.id === good.id);
        if (index != -1) {
          if (this.goods[index].est_disponible) {
            this.goods[index].est_disponible = 'S';
          }

          if (this.goods[index].di_disponible) {
            this.goods[index].di_disponible = 'S';
          }

          //this.goods[index].status = 'ADM';
          if (this.goods[index].name) {
            this.goods[index].name = false;
          }
        }
      });
      this.goodsValid = [];
      this.totalItems3 = this.goodsValid.length;
    }
    // if (this.goodsValid.length > 0) {
    //   // let arr: any = [];
    //   // let arr2: any = [];
    //   // for (let i = 0; i < this.goodsValid.length; i++) {
    //   //   if (this.goodsValid[i].ofDictNumber == null) {
    //   //     arr2.push(this.goodsValid[i]);
    //   //   } else {
    //   //     arr.push(this.goodsValid[i]);
    //   //   }
    //   // }

    //   // this.goodsValid = arr2;
    //   // CAMBIAR COLOR A VERDE

    //   // let index = this.goods.findIndex(g => g === arr2);
    //   // this.goods[index].est_disponible = 'S';
    //   // this.goods[index].di_disponible = 'S';
    //   // this.goods[index].name = false;

    //   // this.goodsValid = arr

    //   this.goodsValid.forEach(async good => {
    //     console.log('aaa1', this.goodsValid);

    //     this.goodsValid = this.goodsValid.filter(_good => _good.id != good.id);
    //     console.log('aaa2', this.goodsValid);
    //     let index = this.goods.findIndex(g => g === good);

    //     if (this.goods[index].est_disponible) {
    //       this.goods[index].est_disponible = 'S';
    //     }

    //     if (this.goods[index].di_disponible) {
    //       this.goods[index].di_disponible = 'S';
    //     }

    //     //this.goods[index].status = 'ADM';
    //     if (this.goods[index].name) {
    //       this.goods[index].name = false;
    //     }
    //   });
    //   this.goodsValid = [];
    // }
  }

  onSelectedRow(event: any) {
    console.log('EVENT', event);
    this.getStatusGood(event.data);
    let obj: IGood = this.goods.find(element => element.id === event.data.id);
    let index: number = this.goods.findIndex(elm => elm === obj);
    console.log(index);
  }

  onSelectedRow2(event: any) {
    console.log('EVENT2', event);
  }
  // getStatusGood(data: any) {
  //   const params = new ListParams();
  //   params['filter.status'] = `$eq:${data}`;

  //   this.statusGoodService.getAll(params).subscribe(
  //     (response: any) => {
  //       const { data } = response;
  //       this.desc_estatus_good = data[0].description;
  //       // this.di_status.get('di_desc_estatus').setValue(data[0].description);
  //       console.log('SCREEN', data);
  //     },
  //     error => {
  //       console.log('SCREEN', error.error.message);
  //     }
  //   );
  // }

  getStatusGood(data: any) {
    // const params = new ListParams();
    // params['filter.status'] = `$eq:${data}`;
    console.log(data);
    this.desc_estatus_good = data.pDiDescStatus;

    // const body = {
    //   pGoodNumber: data.goodId,
    //   pClasifGoodNumber: data.goodClassNumber,
    //   pStatus: data.status,
    //   pTypeDicta: this.expedientesForm.get('tipoDictaminacion').value,
    //   pLBTypesDicta: this.expedientesForm.get('tipoDictaminacion').value,
    //   pIdentity: data.identifier,
    //   pVcScreem: 'FACTJURDICTAMASG',
    //   pDiDescStatus: data.estatus
    //     ? data.estatus.descriptionStatus
    //     : data.statusDetails.descriptionStatus,
    //   pProccessExtDom: data.extDomProcess,
    // };

    // this.screenServ.getStatusCheck(body).subscribe({
    //   next: state => {
    //     data.est_disponible = state.EST_DISPONIBLE;
    //     data.v_amp = state.v_amp ? state.v_amp : null;
    //     data.pDiDescStatus = state.pDiDescStatus;
    //     this.desc_estatus_good = state.pDiDescStatus;
    //   },
    //   error: () => {
    //     console.log('fallo');
    //   },
    // });
    // this.statusGoodService.getAll(params).subscribe(
    //   (response: any) => {
    //     const { data } = response;
    //     this.desc_estatus_good = data[0].description;
    //     // this.di_status.get('di_desc_estatus').setValue(data[0].description);
    //     console.log('SCREEN', data);
    //   },
    //   error => {
    //     console.log('SCREEN', error.error.message);
    //   }
    // );
  }

  get type() {
    return this.subtipoForm.get(this.typeField);
  }
  get subtype() {
    return this.subtipoForm.get(this.subtypeField);
  }
  get ssubtype() {
    return this.subtipoForm.get(this.ssubtypeField);
  }
  get sssubtype() {
    return this.subtipoForm.get(this.sssubtypeField);
  }

  async onTypesChange(type: any) {
    this.numberClassifyGood = type.no_clasif_bien;

    if (type.no_clasif_bien == 0) {
      this.isExp = true;
      await this.onLoadGoodList(0, 'all');
    } else {
      this.isExp = false;
      // const filter = new FilterParams();
      await this.onLoadWithClass(type);
      // const { noExpediente } = this.expedientesForm.value;
      // this.filter1.getValue().removeAllFilters();
      // this.filter1
      //   .getValue()
      //   .addFilter('goodClassNumber', type.no_clasif_bien, SearchFilter.EQ);
      // this.filter1
      //   .getValue()
      //   .addFilter('fileNumber', noExpediente, SearchFilter.EQ);
      // // this.filter1.getValue().addFilter('status', 'ROP', SearchFilter.EQ);
      // this.filter1.getValue().addFilter('status', 'STA,ROP', SearchFilter.IN);
      // this.filter1.getValue().page = 1;
      // this.goodServices
      //   .getAllFilter(this.filter1.getValue().getParams())
      //   .subscribe({
      //     next: response => {
      //       console.log('GODDDDSS12312312', response);
      //       const data = response.data;

      //       data.map(async (good: any) => {
      //         good.di_disponible = 'S';

      //         good['descriptionDict'] = good.description;
      //         good['amountDict'] = good.quantity;
      //         good['goodDictaminado'] = false;
      //         good['ofDictNumber'] = null;
      //         const dictamenXGood1: any = await this.getDictaXGood(good.id);

      //         if (dictamenXGood1 == null) {
      //           good['goodDictaminado'] = false;
      //         } else {
      //           good['goodDictaminado'] = true;
      //         }

      //         const resp = await new Promise((resolve, reject) => {
      //           const body = {
      //             pGoodNumber: good.id,
      //             pClasifGoodNumber: good.goodClassNumber,
      //             pStatus: good.status,
      //             pTypeDicta:
      //               this.expedientesForm.get('tipoDictaminacion').value,
      //             pLBTypesDicta:
      //               this.expedientesForm.get('tipoDictaminacion').value,
      //             pIdentity: good.identifier,
      //             pVcScreem: 'FACTJURDICTAMASG',
      //             pDiDescStatus: good.statusDetails
      //               ? good.statusDetails.descriptionStatus
      //               : '',
      //             pProccessExtDom: good.extDomProcess,
      //           };

      //           this.screenServ.getStatusCheck(body).subscribe({
      //             next: state => {
      //               good.est_disponible = state.EST_DISPONIBLE;
      //               good.v_amp = state.v_amp ? state.v_amp : null;
      //               good.pDiDescStatus = state.pDiDescStatus;
      //               this.desc_estatus_good = state.pDiDescStatus;
      //               resolve(state);
      //             },
      //             error: () => {
      //               resolve(null);
      //               console.log('fallo');
      //             },
      //           });
      //         });

      //         if (
      //           good.goodClassNumber == 62 ||
      //           good.goodClassNumber == 1424 ||
      //           good.goodClassNumber == 1426 ||
      //           good.goodClassNumber == 1590
      //         ) {
      //           good.di_es_numerario = 'S';
      //           good.di_esta_conciliado = 'N';

      //           console.log('AQUI');
      //           let vf_fecha: any = '';
      //           const movimientoCuentas = await this.getMovimientoCuentas(
      //             good.id
      //           );
      //           console.log('movimientoCuentas', movimientoCuentas);
      //           if (movimientoCuentas != null) {
      //             good.di_esta_conciliado = 'S';
      //           }

      //           if (good.di_esta_conciliado == 'N') {
      //             const cadena1 = good.val5 ? good.val5.indexOf('/') : 0;
      //             if (cadena1 > 0) {
      //               vf_fecha = this.datePipe.transform(good.val5, 'yyyy/MM/dd');
      //             } else {
      //               const cadena2 = good.val5 ? good.val5.indexOf('-') : 0;

      //               if (cadena2 > 0) {
      //                 vf_fecha = this.datePipe.transform(
      //                   good.val5,
      //                   'yyyy-MM-dd'
      //                 );
      //               } else {
      //                 vf_fecha = good.val5;
      //               }
      //             }

      //             let obj = {
      //               goodNumber: good.id ? Number(good.id) : null,
      //               proceedingNumber: good.fileNumber,
      //               cveCurrency: good.val1 ? good.val1 : null,
      //               cveBank: good.val4 ? good.val4 : null,
      //               cveAccount: good.val6 ? good.val6 : null,
      //               deposit: good.val2 ? Number(good.val2) : null,
      //               dateMovement: vf_fecha,
      //               updates: 'S',
      //             };
      //             console.log('obj', obj);
      //             const faConciles: any = await this.getFaConciles(obj);
      //             console.log('faConciles', faConciles);
      //             good.di_esta_conciliado = faConciles;
      //           }
      //         } else {
      //           good.di_es_numerario = 'N';
      //           good.di_esta_conciliado = 'N';
      //         }
      //       });

      //       this.goods = data;
      //       this.totalItems = response.count || 0;
      //       this.formLoading = false;
      //     },
      //     error: err => {
      //       this.formLoading = false;
      //     },
      //   });
    }
    // this.resetFields([this.subtype, this.ssubtype, this.sssubtype]);
    // this.subtypes = new DefaultSelect();
    // this.ssubtypes = new DefaultSelect();
    // this.sssubtypes = new DefaultSelect();
    // this.subtipoForm.updateValueAndValidity();
    // this.goodTypeChange.emit(type);
  }

  async onLoadWithClass(type: any) {
    console.log('typetypetype', type);
    // this.formLoading = true;
    this.formLoading = true;
    const { noExpediente } = this.expedientesForm.value;
    this.filter1.getValue().removeAllFilters();
    this.filter1
      .getValue()
      .addFilter('goodClassNumber', this.numberClassifyGood, SearchFilter.EQ);
    this.filter1
      .getValue()
      .addFilter('fileNumber', noExpediente, SearchFilter.EQ);
    // this.filter1.getValue().addFilter('status', 'ROP', SearchFilter.EQ);
    let typeDict = this.expedientesForm.get('tipoDictaminacion').value;
    if (typeDict == 'PROCEDENCIA') {
      this.filter1.getValue().addFilter('status', 'STA,ROP', SearchFilter.IN);
    } else if (typeDict == 'DECOMISO') {
      this.filter1
        .getValue()
        .addFilter('status', 'ADM,ROP,STA,VXR', SearchFilter.IN);
    } else if (typeDict == 'DEVOLUCION') {
      this.filter1
        .getValue()
        .addFilter('status', 'ADM,PD3,CNE', SearchFilter.IN);
    } else if (typeDict == 'EXT_DOM') {
      this.filter1
        .getValue()
        .addFilter('status', 'ADM,ROP,STA,VXR', SearchFilter.IN);
    }
    this.goodServices
      .getAllFilter(this.filter1.getValue().getParams())
      .subscribe({
        next: response => {
          console.log('GODDDDSS12312312', response);
          const data = response.data;

          data.map(async (good: any) => {
            good.di_disponible = 'S';

            good['descriptionDict'] = good.description;
            good['amountDict'] = good.quantity;
            good['goodDictaminado'] = false;
            good['ofDictNumber'] = null;
            const dictamenXGood1: any = await this.getDictaXGood(good.id);

            if (dictamenXGood1 == null) {
              good['goodDictaminado'] = false;
            } else {
              good['goodDictaminado'] = true;
            }

            const resp = await new Promise((resolve, reject) => {
              const body = {
                pGoodNumber: good.id,
                pClasifGoodNumber: good.goodClassNumber,
                pStatus: good.status,
                pTypeDicta: this.expedientesForm.get('tipoDictaminacion').value,
                pLBTypesDicta:
                  this.expedientesForm.get('tipoDictaminacion').value,
                pIdentity: good.identifier,
                pVcScreem: 'FACTJURDICTAMASG',
                pDiDescStatus: good.statusDetails
                  ? good.statusDetails.descriptionStatus
                  : '',
                pProccessExtDom: good.extDomProcess,
              };

              this.screenServ.getStatusCheck(body).subscribe({
                next: state => {
                  good.est_disponible = state.EST_DISPONIBLE;
                  good.v_amp = state.v_amp ? state.v_amp : null;
                  good.pDiDescStatus = state.pDiDescStatus;
                  this.desc_estatus_good = state.pDiDescStatus;
                  resolve(state);
                },
                error: () => {
                  resolve(null);
                  console.log('fallo');
                },
              });

              // if (good.goodClassNumber == 62 || good.goodClassNumber == 1424 ||
              //   good.goodClassNumber == 1426 || good.goodClassNumber == 1590) {
              //   good.di_es_numerario = 'S';
              //   good.di_esta_conciliado = 'N';

              //   console.log("AQUI")
              //   let vf_fecha: any = '';
              //   const movimientoCuentas = await this.getMovimientoCuentas(good.id)
              //   console.log("movimientoCuentas", movimientoCuentas)
              //   if (movimientoCuentas != null) {
              //     good.di_esta_conciliado = 'S';
              //   }

              //   if (good.di_esta_conciliado == 'N') {

              //     const cadena1 = good.val5 ? good.val5.indexOf('/') : 0;
              //     if (cadena1 > 0) {
              //       vf_fecha = this.datePipe.transform(good.val5, 'yyyy/MM/dd');;
              //     } else {

              //       const cadena2 = good.val5 ? good.val5.indexOf('-') : 0;

              //       if (cadena2 > 0) {
              //         vf_fecha = this.datePipe.transform(good.val5, 'yyyy-MM-dd');
              //       } else {
              //         vf_fecha = good.val5;
              //       }
              //     }

              //     let obj = {
              //       goodNumber: (good.id) ? Number(good.id) : null,
              //       proceedingNumber: good.fileNumber,
              //       cveCurrency: good.val1 ? good.val1 : null,
              //       cveBank: good.val4 ? good.val4 : null,
              //       cveAccount: good.val6 ? good.val6 : null,
              //       deposit: (good.val2) ? Number(good.val2) : null,
              //       dateMovement: vf_fecha,
              //       updates: 'S',
              //     };
              //     console.log("obj", obj)
              //     const faConciles: any = await this.getFaConciles(obj);
              //     console.log("faConciles", faConciles)
              //     good.di_esta_conciliado = faConciles;
              //   }

              // } else {
              //   good.di_es_numerario = 'N';
              //   good.di_esta_conciliado = 'N';
              // }
            });

            if (
              good.goodClassNumber == 62 ||
              good.goodClassNumber == 1424 ||
              good.goodClassNumber == 1426 ||
              good.goodClassNumber == 1590
            ) {
              good.di_es_numerario = 'S';
              good.di_esta_conciliado = 'N';

              console.log('AQUI');
              let vf_fecha: any = '';
              const movimientoCuentas = await this.getMovimientoCuentas(
                good.id
              );
              console.log('movimientoCuentas', movimientoCuentas);
              if (movimientoCuentas != null) {
                good.di_esta_conciliado = 'S';
              }

              if (good.di_esta_conciliado == 'N') {
                const cadena1 = good.val5 ? good.val5.indexOf('/') : 0;
                if (cadena1 > 0) {
                  let cadena = good.val5;

                  // Utilizar el método split() para separar la cadena en un array de elementos
                  let arrayCadena = cadena.split('/');

                  // Obtener el segundo elemento del array, que es "06"
                  let elemento2 = `${arrayCadena[2]}/${arrayCadena[1]}/${arrayCadena[0]}`;
                  vf_fecha = elemento2;
                } else {
                  const cadena2 = good.val5 ? good.val5.indexOf('-') : 0;

                  if (cadena2 > 0) {
                    let cadena = good.val5;
                    console.log('cadena2', cadena2);
                    const valCad = cadena;
                    const elemento = 'T';
                    const contieneElemento = cadena.includes(elemento);
                    let arrayCadena;
                    let elemento2;

                    if (contieneElemento) {
                      arrayCadena = cadena.split('T');
                      let arrayCadena2 = arrayCadena[0].split('-');

                      elemento2 = `${arrayCadena2[0]}-${arrayCadena2[1]}-${arrayCadena2[2]}`;
                      vf_fecha = elemento2;
                    } else {
                      // Utilizar el método split() para separar la cadena en un array de elementos
                      console.log('arrayCadena', arrayCadena);
                      let arrayCadena2 = cadena.split('-');
                      elemento2 = `${arrayCadena2[2]}-${arrayCadena2[1]}-${arrayCadena2[0]}`;

                      // Obtener el segundo elemento del array, que es "06"
                      vf_fecha = elemento2;
                    }
                  } else {
                    vf_fecha = good.val5;
                  }
                }

                let obj = {
                  goodNumber: good.id ? Number(good.id) : null,
                  proceedingNumber: good.fileNumber,
                  cveCurrency: good.val1 ? good.val1 : null,
                  cveBank: good.val4 ? good.val4 : null,
                  cveAccount: good.val6 ? good.val6 : null,
                  deposit: good.val2 ? Number(good.val2) : null,
                  dateMovement: vf_fecha,
                  updates: 'S',
                };
                console.log('obj', obj);
                const faConciles: any = await this.getFaConciles(obj);
                console.log('faConciles', faConciles);
                good.di_esta_conciliado = faConciles;
              }
            } else {
              good.di_es_numerario = 'N';
              good.di_esta_conciliado = 'N';
            }
          });

          this.goods = data;
          this.totalItems = response.count || 0;
          this.formLoading = false;
        },
        error: err => {
          this.goods = [];
          this.formLoading = false;
        },
      });
  }
  // onLoadWithClass() {
  //   // this.formLoading = true;
  //   this.goodServices
  //     .getAllFilter(this.filter1.getValue().getParams())
  //     .subscribe({
  //       next: response => {
  //         const data = response.data;
  //         this.totalItems = response.count;
  //         data.map(async (good: any, index) => {
  //           if (index == 0)
  //             this.desc_estatus_good = good.statusDetails.descriptionStatus;
  //           good.di_disponible = 'S';
  //           good['descriptionDict'] = good.description;
  //           good['amountDict'] = good.quantity;
  //           good['goodDictaminado'] = false;
  //           good['ofDictNumber'] = null;
  //           const dictamenXGood1: any = await this.getDictaXGood(good.id);

  //           if (dictamenXGood1 == null) {
  //             good['goodDictaminado'] = false;
  //           } else {
  //             good['goodDictaminado'] = true;
  //           }

  //           const resp = await new Promise(async (resolve, reject) => {

  //             const body = {
  //               pGoodNumber: good.id,
  //               pClasifGoodNumber: good.goodClassNumber,
  //               pStatus: good.status,
  //               pTypeDicta: this.expedientesForm.get('tipoDictaminacion').value,
  //               pLBTypesDicta:
  //                 this.expedientesForm.get('tipoDictaminacion').value,
  //               pIdentity: good.identifier,
  //               pVcScreem: 'FACTJURDICTAMASG',
  //               pDiDescStatus: good.statusDetails
  //                 ? good.statusDetails.descriptionStatus
  //                 : '',
  //               pProccessExtDom: good.extDomProcess,
  //             };

  //             this.screenServ.getStatusCheck(body).subscribe({
  //               next: state => {
  //                 good.est_disponible = state.EST_DISPONIBLE;
  //                 good.v_amp = state.v_amp ? state.v_amp : null;
  //                 good.pDiDescStatus = state.pDiDescStatus;
  //                 this.desc_estatus_good = state.pDiDescStatus;
  //                 resolve(state);
  //               },
  //               error: () => {
  //                 resolve(null);
  //                 console.log('fallo');
  //               },
  //             });

  //             // if (good.goodClassNumber == 62 || good.goodClassNumber == 1424 ||
  //             //   good.goodClassNumber == 1426 || good.goodClassNumber == 1590) {
  //             //   good.di_es_numerario = 'S';
  //             //   good.di_esta_conciliado = 'N';

  //             //   console.log("AQUI")
  //             //   let vf_fecha: any = '';
  //             //   const movimientoCuentas = await this.getMovimientoCuentas(good.id)
  //             //   console.log("movimientoCuentas", movimientoCuentas)
  //             //   if (movimientoCuentas != null) {
  //             //     good.di_esta_conciliado = 'S';
  //             //   }

  //             //   if (good.di_esta_conciliado == 'N') {

  //             //     const cadena1 = good.val5 ? good.val5.indexOf('/') : 0;
  //             //     if (cadena1 > 0) {
  //             //       vf_fecha = this.datePipe.transform(good.val5, 'yyyy/MM/dd');;
  //             //     } else {

  //             //       const cadena2 = good.val5 ? good.val5.indexOf('-') : 0;

  //             //       if (cadena2 > 0) {
  //             //         vf_fecha = this.datePipe.transform(good.val5, 'yyyy-MM-dd');
  //             //       } else {
  //             //         vf_fecha = good.val5;
  //             //       }
  //             //     }

  //             //     let obj = {
  //             //       goodNumber: (good.id) ? Number(good.id) : null,
  //             //       proceedingNumber: good.fileNumber,
  //             //       cveCurrency: good.val1 ? good.val1 : null,
  //             //       cveBank: good.val4 ? good.val4 : null,
  //             //       cveAccount: good.val6 ? good.val6 : null,
  //             //       deposit: (good.val2) ? Number(good.val2) : null,
  //             //       dateMovement: vf_fecha,
  //             //       updates: 'S',
  //             //     };
  //             //     console.log("obj", obj)
  //             //     const faConciles: any = await this.getFaConciles(obj);
  //             //     console.log("faConciles", faConciles)
  //             //     good.di_esta_conciliado = faConciles;
  //             //   }

  //             // } else {
  //             //   good.di_es_numerario = 'N';
  //             //   good.di_esta_conciliado = 'N';
  //             // }
  //           });
  //         });

  //         this.goods = data;
  //         this.formLoading = false;
  //       },
  //       error: err => {
  //         this.formLoading = false;
  //       },
  //     });
  // }

  goBack() {
    this.router.navigateByUrl('/pages/juridical/file-data-update');
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field.setValue(null);
    });
    this.subtipoForm.updateValueAndValidity();
  }

  //Métodos para autocompletar los tipos
  getTypes(params: ListParams) {
    this.service.getAll(params).subscribe(
      res => {
        this.types = new DefaultSelect(res.data, res.count);
      },
      err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.message;
        }

        this.alert('error', 'Error', error);
      }
    );
  }

  getSubtypes(params: ListParams) {
    this.goodSubtypesService
      .getAll({ type: this.type.value, ...params })
      .subscribe(data => {
        console.log(data);
        this.subtypes = new DefaultSelect(data.data, data.count);
      });
  }

  onSubtypesChange(subtype: any) {
    if (!this.type.value) {
      this.types = new DefaultSelect([subtype.idTypeGood], 1);
      this.type.setValue(subtype.idTypeGood.id);
    }
    this.resetFields([this.ssubtype, this.sssubtype]);
    this.ssubtypes = new DefaultSelect();
    this.sssubtypes = new DefaultSelect();
    this.goodSubtypeChange.emit(subtype);
  }

  getSsubtypes(params: ListParams) {
    this.goodSsubtypeService
      .getAll({
        type: this.type.value,
        subtype: this.subtype.value,
        ...params,
      })
      .subscribe(data => {
        this.ssubtypes = new DefaultSelect(data.data, data.count);
      });
  }

  onSsubtypesChange(ssubtype: any) {
    if (!this.type.value || !this.subtype.value) {
      this.types = new DefaultSelect([ssubtype.noType], 1);
      this.subtypes = new DefaultSelect([ssubtype.noSubType], 1);
      this.type.setValue(ssubtype.noType.id);
      this.subtype.setValue(ssubtype.noSubType.id);
    }
    this.resetFields([this.sssubtype]);
    this.goodSsubtypeChange.emit(ssubtype);
  }
  goodSssubType: IGoodSssubtype;
  onValuesChange(goodSssubtypeChange: IGoodSssubtype): void {
    console.log(goodSssubtypeChange);
    this.goodSssubType = goodSssubtypeChange;
    this.subtipoForm.controls['attrib'].setValue(
      goodSssubtypeChange.numClasifGoods
    );
    this.subtipoForm.controls['id'].setValue(goodSssubtypeChange.id);
    this.sssubtypes = new DefaultSelect();
  }
  getSssubtypes(params: ListParams) {
    this.goodSssubtypeService
      .getAll({
        type: this.type.value,
        subtype: this.subtype.value,
        ssubtype: this.ssubtype.value,
        ...params,
      })
      .subscribe(data => {
        this.sssubtypes = new DefaultSelect(data.data, data.count);
      });
  }
  onSssubtypesChange(sssubtype: any) {
    if (!this.type.value || !this.subtype.value || !this.ssubtype.value) {
      console.log(sssubtype);
      this.types = new DefaultSelect([sssubtype.numType], 1);
      this.subtypes = new DefaultSelect([sssubtype.numSubType], 1);
      this.ssubtypes = new DefaultSelect([sssubtype.numSsubType], 1);
      this.type.setValue(sssubtype.numType.id);
      this.subtype.setValue(sssubtype.numSubType.id);
      this.ssubtype.setValue(sssubtype.numSsubType.id);
    }

    this.goodSssubtypeChange.emit(sssubtype);
  }

  /**
   * Listado de bienes según No. de expediente
   */
  arrDXG: any[] = [];
  async onLoadGoodList(id: any, filter: any) {
    this.formLoading = true;
    this.loading = true;
    // this.params.getValue().page = 1;
    this.goodServices
      .getByExpedient(
        this.expedientesForm.get('noExpediente').value
        //this.params.getValue() //Se estaba enviado dos veces el expediente y marcaba error.
      )
      .subscribe({
        next: response => {
          const data = response.data;
          console.log('GODDDDSS', response);

          let arr: any = [];
          let arrD: any = [];

          let result = data.map(async (good: any) => {
            good.di_disponible = 'S';
            good.est_disponible = 'N';
            good['descriptionDict'] = good.description;
            good['amountDict'] = good.quantity;
            good['goodDictaminado'] = false;
            good['ofDictNumber'] = null;
            const dictamenXGood1: any = await this.getDictaXGood(good.id);

            if (dictamenXGood1 == null) {
              good['goodDictaminado'] = false;
            } else {
              good['goodDictaminado'] = true;
            }

            await new Promise((resolve, reject) => {
              const body = {
                pGoodNumber: good.id,
                pClasifGoodNumber: good.goodClassNumber,
                pStatus: good.status,
                pTypeDicta: this.expedientesForm.get('tipoDictaminacion').value,
                pLBTypesDicta:
                  this.expedientesForm.get('tipoDictaminacion').value,
                pIdentity: good.identifier,
                pVcScreem: 'FACTJURDICTAMASG',
                pDiDescStatus: good.estatus
                  ? good.estatus.descriptionStatus
                  : '',
                pProccessExtDom: good.extDomProcess,
              };

              this.screenServ.getStatusCheck(body).subscribe({
                next: async (state: any) => {
                  console.log('state', state);
                  good.est_disponible = state.EST_DISPONIBLE;
                  good.v_amp = state.v_amp ? state.v_amp : null;
                  good.pDiDescStatus = state.pDiDescStatus;
                  this.desc_estatus_good = state.pDiDescStatus;
                  resolve(state);
                },
                error: () => {
                  good.est_disponible = 'N';
                  resolve(null);
                },
              });
            });

            if (
              good.goodClassNumber == 62 ||
              good.goodClassNumber == 1424 ||
              good.goodClassNumber == 1426 ||
              good.goodClassNumber == 1590
            ) {
              good.di_es_numerario = 'S';
              good.di_esta_conciliado = 'N';

              console.log('AQUI');
              let vf_fecha: any = '';
              const movimientoCuentas = await this.getMovimientoCuentas(
                good.id
              );
              console.log('movimientoCuentas', movimientoCuentas);
              if (movimientoCuentas != null) {
                good.di_esta_conciliado = 'S';
              }

              if (good.di_esta_conciliado == 'N') {
                const cadena1 = good.val5 ? good.val5.indexOf('/') : 0;
                if (cadena1 > 0) {
                  let cadena = good.val5;

                  // Utilizar el método split() para separar la cadena en un array de elementos
                  let arrayCadena = cadena.split('/');

                  // Obtener el segundo elemento del array, que es "06"
                  let elemento2 = `${arrayCadena[2]}/${arrayCadena[1]}/${arrayCadena[0]}`;
                  vf_fecha = elemento2;
                } else {
                  const cadena2 = good.val5 ? good.val5.indexOf('-') : 0;

                  if (cadena2 > 0) {
                    let cadena = good.val5;
                    console.log('cadena2', cadena2);
                    const valCad = cadena;
                    const elemento = 'T';
                    const contieneElemento = cadena.includes(elemento);
                    let arrayCadena;
                    let elemento2;

                    if (contieneElemento) {
                      arrayCadena = cadena.split('T');
                      let arrayCadena2 = arrayCadena[0].split('-');

                      elemento2 = `${arrayCadena2[0]}-${arrayCadena2[1]}-${arrayCadena2[2]}`;
                      vf_fecha = elemento2;
                    } else {
                      // Utilizar el método split() para separar la cadena en un array de elementos
                      console.log('arrayCadena', arrayCadena);
                      let arrayCadena2 = cadena.split('-');
                      elemento2 = `${arrayCadena2[2]}-${arrayCadena2[1]}-${arrayCadena2[0]}`;

                      // Obtener el segundo elemento del array, que es "06"
                      vf_fecha = elemento2;
                    }
                  } else {
                    vf_fecha = good.val5;
                  }
                }

                let obj = {
                  goodNumber: good.id ? Number(good.id) : null,
                  proceedingNumber: good.fileNumber,
                  cveCurrency: good.val1 ? good.val1 : null,
                  cveBank: good.val4 ? good.val4 : null,
                  cveAccount: good.val6 ? good.val6 : null,
                  deposit: good.val2 ? Number(good.val2) : null,
                  dateMovement: vf_fecha,
                  updates: 'S',
                };
                console.log('obj', obj);
                const faConciles: any = await this.getFaConciles(obj);
                console.log('faConciles', faConciles);
                good.di_esta_conciliado = faConciles;
              }
            } else {
              good.di_es_numerario = 'N';
              good.di_esta_conciliado = 'N';
            }
            // if ([62, 1424, 1426, 1590].includes(good.goodClassNumber)) {
            //   // good.di_es_numerario = 'S';
            //   // good.di_esta_conciliado = 'N';

            //   // let vf_fecha: any = '';
            //   // const movimientoCuentas = await this.getMovimientoCuentas(good.id)
            //   // console.log("movimientoCuentas", movimientoCuentas)
            //   // if (movimientoCuentas != null) {
            //   //   good.di_esta_conciliado = 'S';
            //   // }

            //   // if (good.di_esta_conciliado == 'N') {

            //   //   const cadena1 = good.val5 ? good.val5.indexOf('/') : 0;
            //   //   if (cadena1 > 0) {
            //   //     vf_fecha = this.datePipe.transform(good.val5, 'dd/MM/yyyy');;
            //   //   } else {

            //   //     const cadena2 = good.val5 ? good.val5.indexOf('-') : 0;

            //   //     if (cadena2 > 0) {
            //   //       vf_fecha = this.datePipe.transform(good.val5, 'dd-MM-yyyy');
            //   //     } else {
            //   //       vf_fecha = good.val5;
            //   //     }
            //   //   }

            //   //   let obj = {
            //   //     goodNumber: good.id,
            //   //     proceedingNumber: good.fileNumber,
            //   //     cveCurrency: good.val1 ? good.val1 : '',
            //   //     cveBank: good.val4 ? good.val4 : '',
            //   //     cveAccount: good.val6 ? good.val6 : '',
            //   //     deposit: good.val2 ? good.val2 : '',
            //   //     dateMovement: vf_fecha,
            //   //     updates: 'S',
            //   //   };
            //   //   console.log("obj", obj)
            //   //   const faConciles: any = await this.getFaConciles(obj);
            //   //   good.di_esta_conciliado = faConciles;
            //   // }

            //   // good['fa_concilia_bien'] = faConciles;

            //   // await new Promise((resolve, reject) => {
            //   //   const body = {
            //   //     pGoodNumber: good.id,
            //   //     pExpendientNumber: good.fileNumber,
            //   //     pVal1: good.val1 ?? '',
            //   //     pVal2: good.val2 ?? '',
            //   //     pVal4: good.val4 ?? '',
            //   //     pVal5: good.val5 ?? '',
            //   //     pVal6: good.val6 ?? '',
            //   //   };

            //   //   this.serviceGood.dictationConcilation(body).subscribe({
            //   //     next: (state: any) => {
            //   //       console.log('state', state);
            //   //       good.di_esta_conciliado = state.EST_DISPONIBLE;
            //   //       resolve(state);
            //   //     },
            //   //     error: (error: any) => {
            //   //       console.log('errrorrr', error);
            //   //       good.di_esta_conciliado = 'N';
            //   //       resolve(null);
            //   //     },
            //   //   });
            //   // });
            // } else {
            //   // good.di_es_numerario = 'N';
            //   // good.di_esta_conciliado = 'N';
            // }
            // if (this.goodsValid.length > 0) {
            //   good.est_disponible = await this.getDictXGood(good);
            // }
          });

          Promise.all(result).then((resp: any) => {
            console.log('this.goods', arr);
            console.log('GODDDDSS222', data);
            this.goods = data;
            if (this.goodsValid.length > 0) {
              this.idGoodSelected = this.goodsValid[0].id;
            }
            this.totalItems = response.count || 0;
            this.formLoading = false;
          });
        },
        error: err => {
          console.log(err);
          this.goods = [];
          this.formLoading = false;
        },
      });
  }

  getMovimientoCuentas(id: any) {
    const params = new ListParams();
    params['filter.numberGood'] = `$eq:${id}`;
    return new Promise((resolve, reject) => {
      this.AccountMovements.getAccountMovementsGood(params).subscribe({
        next: (resp: any) => {
          console.log('getMovimientoCuentas', resp);
          const data = resp.data[0];
          resolve(data);
          this.loading = false;
        },
        error: error => {
          resolve(null);
          this.loading = false;
        },
      });
    });
  }

  private async getDictXGood(good: any) {
    for (let i = 0; i < this.goodsValid.length; i++) {
      if (good.id == this.goodsValid[i].id) {
        return 'N';
      }
    }
    return good.est_disponible;
  }

  getFaConciles(data: any) {
    return new Promise((resolve, reject) => {
      this.AccountMovements.geFaReconcilesGood(data).subscribe({
        next: (resp: any) => {
          console.log('obj2222', resp);
          // console.log('DICTAMINACION X BIEN', resp.data);
          const data = resp.data[0];
          resolve(data.fa_concilia_bien);
          this.loading = false;
        },
        error: error => {
          console.log('errorerrorerrorerror', error);
          // console.log('ERROR DICTAMINACION X BIEN', error.error.message);
          resolve('N');
          this.loading = false;
        },
      });
    });
  }
  getDictaXGood(id: any) {
    const params = new ListParams();
    // if (filter == null) {
    //   params['filter.id'] = `$eq:${id}`;
    // } else {
    let typeDict = this.expedientesForm.get('tipoDictaminacion').value;
    params['filter.id'] = `$eq:${id}`;
    params['filter.typeDict'] = `$eq:${typeDict}`;
    // }
    return new Promise((resolve, reject) => {
      this.DictationXGood1Service.getAll(params).subscribe({
        next: (resp: any) => {
          // console.log('DICTAMINACION X BIEN', resp.data);
          const data = resp.data[0];
          resolve(resp.data[0]);
          this.loading = false;
        },
        error: error => {
          // console.log('ERROR DICTAMINACION X BIEN', error.error.message);
          resolve(null);
          this.loading = false;
        },
      });
    });
  }

  goodClassNumber: number = 0;
  stateNumber: any;
  selectRow(row?: any) {
    /*if (row) {
      this.idGoodSelected = row.data?.id;
      this.onLoadDocumentsByGood();
    }
    console.log('Información del bien seleccionado', row.data);*/

    const idGood = { ...this.goodData };
    this.totalItems2 = 0;
    // this.documentsDictumXStateMList = [];
    this.goodData = row.data;

    this.goodClassNumber = Number(this.goodData.goodClassNumber);
    this.stateNumber = this.goodData.goodId;
    this.idGoodSelected = row.data.id;
    console.log(
      'Información del bien seleccionado rowsSelected2',
      this.goodData
    );
  }

  rowsSelected(event: any) {
    console.log('event', event);
    this.goodData = event.data;
    this.goodClassNumber = Number(this.goodData.goodClassNumber);
    this.getDocumentDicXStateM(event.data.id);
    /*const idGood = { ...this.goodData };
    this.totalItems2 = 0;
    this.documentsDictumXStateMList = [];
    this.goodData = event.data;
    console.log(
      'Información del bien seleccionado rowsSelected2',
      this.goodData.goodClassNumber
    );*/
    this.idGoodSelected = event.data.id;
  }

  async getDocumentDicXStateM(id?: number) {
    this.loading2 = true;
    let typeDict = this.expedientesForm.get('tipoDictaminacion').value;
    let params = {
      ...this.listParams.getValue(),
      stateNumber: id,
    };
    this.documentService.getDocumentsByGood2(id, typeDict, params).subscribe({
      next: resp => {
        let arr: any = [];
        let result = resp.data.map(async (item: any) => {
          item.dateReceipt = this.datePipe.transform(
            item.dateReceipt,
            'dd/MM/yyyy'
          );
          const docsss = await this.docsssDicOficM(item.cveDocument);
          arr.push(docsss);
        });
        this.documentsDictumXStateMList = resp.data;
        this.totalItems2 = resp.count;
        this.loading2 = false;
        this.idGoodSelected = id;
        console.log('Documentos, ', resp);
      },
      error: error => {
        this.totalItems2 = 0;
        this.documentsDictumXStateMList = [];
        console.log('No hay respuesta ', error);
      },
    });
  }

  docsssDicOficM(data: any) {
    const params = new ListParams();
    params['filter.key'] = `$eq:${data}`;
    return new Promise((resolve, reject) => {
      this.documentService.getDocParaDictum(params).subscribe({
        next: (resp: any) => {
          // this.data2 = resp.data;
          resolve(resp.data[0]);
          this.loading = false;
        },
        error: error => {
          console.log('error DOCS PARA DICTUM', error.error.message);
          resolve(error);
          this.loading = false;
        },
      });
    });
  }

  onLoadDocumentsByGood() {
    this.documentService.getDocumentsByGood(this.idGoodSelected).subscribe({
      next: response => {
        this.data4 = response.data;
      },
      error: err => {
        console.log(err);
        this.goods = [];
      },
    });
  }

  btnVerify() {
    let cveOficio = this.dictaminacionesForm.get('cveOficio').value;
    let tipo = this.expedientesForm.get('tipoDictaminacion').value;
    let noDictaminacion = this.expedientesForm.get('noDictaminacion').value;
    const status = this.statusDict;
    const expedient = this.expedientesForm.get('noExpediente').value;

    if (this.goodsValid.length === 0) {
      this.alert('warning', 'AVISO', 'Debes seleccionar un bien');
      return;
    }
    if (status === 'DICTAMINADO') {
      this.alert('warning', 'Bien ya se encuentra dictaminado', '');
      return;
    } else {
      if (expedient === null || undefined || '') {
        this.alert('error', 'ERROR', 'Falta seleccionar expediente');
        return;
      } else {
        let query = true;
        if (query) {
          if (true) {
            let obj = {
              good: this.goodsValid[0].id,
              screen: 'FACTJURDICTAMASG',
            };
            //MANDA A LLAMAR A FACTGENPARCBIEN
            console.log('OBJ', obj);
            this.router.navigate(
              ['/pages/judicial-physical-reception/partializes-general-goods'],
              {
                queryParams: {
                  // CLAVE_OFICIO_ARMADA: cveOficio,
                  // TIPO: tipo,
                  // P_VALOR: noDictaminacion,
                  // PAQUETE: '',
                  // P_GEST_OK: 1, // ..hardcoded - no llega de la pantalla anterior
                  // P_NO_TRAMITE: 1044141, // ..hardcoded - no llega de la pantalla anterior
                  good: this.goodsValid[0].id,
                  screen: 'FACTJURDICTAMASG',
                },
              }
            );
          }
        }
        // this.alert('warning', 'PENDIENTE', 'Parcializa la dictaminazión.');}
        // Swal.fire('PENDIENTE', 'Parcializa la dictaminazión.', 'warning').then(
        //   () => {
        //     this.router.navigate(
        //       ['/pages/general-processes/goods-partialization'],
        //       {
        //         queryParams: {
        //           // anterior..
        //           // good: this.goodsValid[0].id,
        //           // screen: 'FACTJURDICTAMASG',
        //           // origin: 'FACTJURDICTAMASG',
        //           // ..
        //           CLAVE_OFICIO_ARMADA: cveOficio,
        //           TIPO: tipo,
        //           P_VALOR: noDictaminacion,
        //           PAQUETE: '',
        //           P_GEST_OK: 1, // ..hardcoded - no llega de la pantalla anterior
        //           P_NO_TRAMITE: 1044141, // ..hardcoded - no llega de la pantalla anterior
        //           origin: 'FACTJURDICTAMASG',
        //         },
        //       }
        //     );
        //   }
        // );
      }
    }
  }

  btnDeleteDictation() {
    let token = this.authService.decodeToken();

    const object = {
      proceedingsNumber: this.expedientesForm.get('noExpediente').value,
      typeDicta: this.expedientesForm.get('tipoDictaminacion').value,
      numberOfDicta: this.dictNumber,
      wheelNumber: this.dictaminacionesForm.get('wheelNumber').value,
      user: token.preferred_username,
      delegationNumberDictam: this.delegationDictNumber,
      clueJobNavy: this.keyArmyNumber, // -- keyArmyNumber
      judgmentDate: this.dictaminacionesForm.get('fechaNotificacion').value, // -- entryDate
      statusJudgment: this.statusDict, // -- statusDict
      typeJudgment: this.expedientesForm.get('tipoDictaminacion').value, // -- typeDict
    };

    this.checkout1(object)
      .then(({ json }) => {
        json.then(res => {
          if (res.statusCode === 200) {
            if (res.vBan === 'S' && res.vDelete === 'S') {
              // Pendiente
              // --
            } else {
              let object2 = {
                vProceedingsNumber: res.data.vProceedingsNumber,
                vTypeDicta: res.data.vTypeDicta,
                vOfDictaNumber: res.data.vOfDictaNumber,
                vWheelNumber: res.data.vWheelNumber,
              };
              this.checkout2(object2).then(({ json }) => {
                json.then(res => {
                  if (res.statusCode !== 200) {
                    this.alert('warning', 'AVISO', res.message[0]);
                  } else {
                    console.log('TODO SALE BIEN', res.data);
                  }
                });
              });
            }
          } else if (res.statusCode === 400) {
            this.alert('warning', 'AVISO', res.message[0]);
          }
        });
      })
      .catch(err => {});
  }
  disabledParBtn: boolean = false;
  onTypeDictChange($event: any) {
    console.log(this.expedientesForm.get('tipoDictaminacion').value);
    console.log('event', $event);
    const querys = this.activatedRoute.snapshot.queryParams;

    const type = this.expedientesForm.get('tipoDictaminacion').value;

    this.validateTypeVol(querys['TIPO_VO'], type);
    this.validateTypeVol(this.TIPO_VO, type);

    if (this.expedientesForm.get('tipoDictaminacion').value == 'PROCEDENCIA') {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }
    // ..activar para ver cambio
    // console.log($event);
  }

  async checkout1(object: object) {
    let response = await fetch(
      `${environment.API_URL}dictation/api/v1/application/factjurdictamasDeleteDisctp1`,
      {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(object),
      }
    );
    return { status: response.status, json: response.json() };
  }

  async checkout2(object: object) {
    let response = await fetch(
      `${environment.API_URL}dictation/api/v1/application/factjurdictamasDeleteDisctp2`,
      {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(object),
      }
    );
    return { status: response.status, json: response.json() };
  }

  async checkout3(object: object) {
    let response = await fetch(
      `${environment.API_URL}dictation/api/v1/application/factjurdictamasDeleteDisctp3`,
      {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: JSON.stringify(object),
      }
    );
    return { status: response.status, json: response.json() };
  }

  async loadExpedientInfo(id: number | string) {
    const response = await fetch(
      `${environment.API_URL}dictation/api/v1/dictation?filter.expedientNumber=` +
        id,
      {
        method: 'GET',
      }
    );
    return { status: response.status, json: response.json() };
  }

  isDocsEmpty() {
    return this.documents.length === 0;
  }

  disabledApro: boolean = true;
  dictamen: any;
  oficioDictamen: any;
  buttonApr: boolean = true;
  async btnApprove() {
    if (this.goodsValid.length == 0) {
      this.alert(
        'warning',
        'Debe seleccionar al menos un bien para dictaminar',
        ''
      );
      return;
    }
    let OFICIO: any = null;
    let vCVE_CARGO: any = null;
    let vNO_DELEGACION: any = null;
    let vNO_SUBDELEGACION: any = null;
    let vNO_DEPARTAMENTO: any = null;
    let VALOR: any = null;
    let SIGLA,
      vnivel,
      vdepend,
      vdep_deleg: any = null;
    let SIGLAp,
      vnivelp,
      vdependp,
      vdep_delegP: any = null;
    let vniveld4: any = null;
    let vniveld5: any = null;
    let vniveld3: any = null;
    let vniveld2: any = null;
    let v_tip_dicta: any = null;
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const SYSDATE = `${day}/${month}/${year}`;
    const SYSDATE2 = `${month}/${day}/${year}`;

    const FA_ETAPACREDA: any = await this.getFaStageCreda(SYSDATE2);

    // if (this.documents.length === 0) {
    //   this.alert('warning', '', 'Debes seleccionar un documento.');
    //   return; // Si 'documents' está vacío, detiene la ejecución aquí
    // }
    let token = this.authService.decodeToken();
    const pNumber = Number(token.department);
    const status = this.statusDict;
    if (status === 'DICTAMINADO') {
      this.alert('error', 'Ya se encuentra dictaminado.', '');
    } else {
      let lst_id =
        'E:' +
        this.expedientesForm.get('noExpediente').value +
        'N:' +
        this.dictaminacionesForm.get('wheelNumber').value;

      // PUP_DICTA_LOG
      await this.PUP_DICTA_LOG(lst_id + ' Inicio de aprobar. ');

      // IF :parameter.p_gest_ok = 1  or :global.gnu_activa_gestion = 1 THEN
      let p_gest_ok = 2;
      let gnu_activa_gestion = 2;
      let ESTATUS_TRAMITE = null;
      if (p_gest_ok == 1 || gnu_activa_gestion == 1) {
        // F: VARIABLES.ESTATUS_TRAMITE IS NULL THEN
        if (ESTATUS_TRAMITE == null) {
          await this.PUP_DICTA_LOG(
            lst_id + ' No se definió la gestión destino. '
          );
          this.alert('warning', 'No se ha definido el área de gestión.', '');
          return;
        }
      }

      let typeDict = this.expedientesForm.get('tipoDictaminacion').value;
      if (typeDict != null || typeDict != '') {
        let lst_bloque = true;
        await this.PUP_DICTA_LOG(lst_id + ' se extrae el current block. ');
      } else {
        await this.PUP_DICTA_LOG(lst_id + ' No se definió el tipo_dicta. ');
      }

      let fechaPPFF = this.dictaminacionesForm.get('fechaPPFF').value;
      if (fechaPPFF != '' && fechaPPFF != null) {
        await this.PUP_DICTA_LOG(lst_id + ' SELECT SIGLA ');
        let sender = this.dictaminacionesForm.get('autoriza_remitente').value;
        console.log('sender', sender);

        const validDest: any = await this.valideDataRemitente(sender);

        if (validDest == null) {
          this.alert(
            'warning',
            'No se localizaron datos de la persona que autoriza.',
            ''
          );
          return;
        } else {
          vNO_DELEGACION = validDest.delegation1Number;
          vNO_SUBDELEGACION = validDest.subdelegationNumber;
          vNO_DEPARTAMENTO = validDest.departament1Number;
        }
        vCVE_CARGO = await this.valideDataCargo(sender);
        if (vCVE_CARGO == null) {
          this.alert(
            'warning',
            'No se localizaron datos de la persona que autoriza.',
            ''
          );
          return;
        }
        let obj = {
          department: vNO_DEPARTAMENTO,
          subDelegation: vNO_SUBDELEGACION,
          delegation: vNO_DELEGACION,
          stage: FA_ETAPACREDA,
        };
        const CAT_DEPARTAMENTOS: any = await this.getDepartment(obj);
        console.log('CAT_DEPARTAMENTOS', CAT_DEPARTAMENTOS);

        if (CAT_DEPARTAMENTOS == null) {
          this.alert(
            'warning',
            'No se localizaron datos de la persona que autoriza..',
            ''
          );
          return;
        } else if (CAT_DEPARTAMENTOS.length == 0) {
          this.alert(
            'warning',
            'No se encontraron datos del departamento.',
            ''
          );
          return;
        } else if (
          CAT_DEPARTAMENTOS.dsarea == null ||
          CAT_DEPARTAMENTOS.depDelegation == null ||
          CAT_DEPARTAMENTOS.level == null ||
          CAT_DEPARTAMENTOS.depend == null
        ) {
          this.alert(
            'warning',
            'No se localizó las dependencias para el configurado de la clave',
            ''
          );
          return;
        }
        SIGLA = CAT_DEPARTAMENTOS.dsarea;
        vnivel = CAT_DEPARTAMENTOS.level;
        vdepend = CAT_DEPARTAMENTOS.depend;
        vdep_deleg = CAT_DEPARTAMENTOS.depDelegation;

        if (vnivel == 4) {
          vniveld4 = SIGLA;
          vniveld5 = vCVE_CARGO;
        } else {
          vniveld4 = vCVE_CARGO;
          vniveld3 = SIGLA;
        }

        // SIGUIENTE CONSULTA
        let obj2 = {
          vDepend: vdepend,
          vDepDeleg: vdep_deleg,
          stage: FA_ETAPACREDA,
          vLevel: vnivel,
        };
        const CAT_DEPARTAMENTOS2: any = await this.getDepartment2(obj2);

        if (CAT_DEPARTAMENTOS2 == null) {
          this.alert(
            'warning',
            'No se localizaron datos de la persona que autoriza..',
            ''
          );
          return;
        } else if (CAT_DEPARTAMENTOS2.length == 0) {
          this.alert(
            'warning',
            'No se encontraron datos del departamento.',
            ''
          );
          return;
        } else if (
          CAT_DEPARTAMENTOS2.dsarea == null ||
          CAT_DEPARTAMENTOS2.dep_delegacion == null ||
          CAT_DEPARTAMENTOS2.nivel == null ||
          CAT_DEPARTAMENTOS2.depend == null
        ) {
          this.alert(
            'warning',
            'No se localizó las dependencias para el configurado de la clave',
            ''
          );
          return;
        }

        SIGLAp = CAT_DEPARTAMENTOS2.dsarea;
        vnivelp = CAT_DEPARTAMENTOS2.nivel;
        vdependp = CAT_DEPARTAMENTOS2.depend;
        vdep_delegP = CAT_DEPARTAMENTOS2.dep_delegacion;
        vniveld2 = CAT_DEPARTAMENTOS2.vLeveld2;
        vniveld3 = CAT_DEPARTAMENTOS2.vLeveld3
          ? CAT_DEPARTAMENTOS2.vLeveld3
          : vniveld3;

        // if (vnivelp == 3) {
        //   vniveld3 = SIGLAp;
        // } else if (vnivelp == 2) {
        //   vniveld2 = SIGLAp;
        // }
        vdepend = vdependp;
        vdep_deleg = vdep_delegP;
        console.log('AA', CAT_DEPARTAMENTOS2);

        // --------------------
        await this.PUP_DICTA_LOG(lst_id + ' SELECT SIGLA OK. ');
        await this.PUP_DICTA_LOG(lst_id + ' SELECT AR_REMITENTE ');
        await this.PUP_DICTA_LOG(lst_id + ' SELECT AR_REMITENTE OK ');
        await this.PUP_DICTA_LOG(lst_id + ' SELECT ANIO ');

        v_tip_dicta = typeDict.substring(0, 3);
        await this.PUP_DICTA_LOG(lst_id + ' SELECT ANIO OK ');
      } else {
        await this.PUP_DICTA_LOG(lst_id + ' FECHA INSTRUCTORA NULA ');
      }

      await this.PUP_DICTA_LOG(lst_id + ' ARMADO DE CLAVE DE OFICIO ');

      if (v_tip_dicta == 'RES') {
        this.dictamen.passOfficeArmy =
          vniveld2 + '/' + vniveld3 + '/' + vniveld4 + '/' + v_tip_dicta;
      } else {
        this.dictamen.passOfficeArmy =
          vniveld2 + '/' + vniveld3 + '/' + vniveld4;
      }
      let vnivel_ = Number(vnivel) + 1;
      console.log('vnivel_', vnivel_);
      if (vnivel_ == 5) {
        this.dictamen.passOfficeArmy =
          this.dictamen.passOfficeArmy + '/' + vniveld5;
      }

      let clave_oficio_armada = this.dictamen.passOfficeArmy || '';
      let cadena = clave_oficio_armada + '/ ? /' + year;
      let resultado = cadena.replace(/^\/*/, '');
      this.dictamen.passOfficeArmy = resultado;
      // : DICTAMINACIONES.CLAVE_OFICIO_ARMADA := LTRIM(: DICTAMINACIONES.CLAVE_OFICIO_ARMADA || '/ ? /' || ANIO, '/');
      await this.PUP_DICTA_LOG(
        lst_id + ' ARMADO DE CLAVE DE OFICIO ' + this.dictamen.passOfficeArmy
      );

      // ESPERANDO DESPLIEGUE ENDPOINT //

      OFICIO = await this.getOFICIODict(typeDict);

      // ESPERANDO DESPLIEGUE ENDPOINT //
      this.PUP_DICTA_LOG(lst_id + ' ESTATUS DICTAMINACION ');
      this.dictamen.statusDict = 'DICTAMINADO';

      this.PUP_DICTA_LOG(
        lst_id + ' ESTATUS DICTAMINACION ' + this.dictamen.statusDict
      );
      if (OFICIO != null) {
        VALOR = OFICIO;
        // this.dictamen.id = VALOR;
        // this.oficioDictamen.officialNumber = VALOR;
      }
      if (typeDict == 'PROCEDENCIA') {
        this.PUP_DICTA_LOG(
          lst_id + ' PUP_BOTON_APRUEBA_RECHAZA IN ' + this.dictamen.statusDict
        );

        this.PUP_DICTA_LOG(
          lst_id + ' PUP_BOTON_APRUEBA_RECHAZA OUT ' + this.dictamen.statusDict
        );
      }

      if (
        typeDict == 'DESTINO' ||
        typeDict == 'DESTRUCCION' ||
        typeDict == 'DONACION' ||
        typeDict == 'DECOMISO' ||
        typeDict == 'EXT_DOM' ||
        typeDict == 'TRANSFERENTE' ||
        typeDict == 'ENAJENACION'
      ) {
        this.PUP_DICTA_LOG(
          lst_id + ' PUP_BOTON_APRUEBA_RECHAZA IN ' + this.dictamen.statusDict
        );
        this.PUP_DICTA_LOG(
          lst_id + ' PUP_BOTON_APRUEBA_RECHAZA OUT ' + this.dictamen.statusDict
        );
      }

      // return

      // this.applicationGoodsQueryService.getDictamenSeq(pNumber).subscribe({
      //   next: (response: any) => {
      //     console.log('resss', response);
      //   },
      // });

      const SYSDATE3 = `${year}/${month}/${day}`;
      const isDelit = this.expedientesForm.get('delito').value;
      this.dictamen.statusDict = 'DICTAMINADO';
      this.dictamen.expedientNumber =
        this.expedientesForm.get('noExpediente').value;
      this.dictamen.wheelNumber =
        this.dictaminacionesForm.get('wheelNumber').value;
      this.dictamen.userDict = token.preferred_username;
      this.dictamen.delegationDictNumber = this.delegation;
      this.dictamen.areaDict = this.areaDict;
      this.dictamen.dictDate = new Date(SYSDATE3);
      this.dictamen.notifyAssuranceDate = new Date(SYSDATE);
      this.dictamen.resolutionDate = new Date(SYSDATE);
      this.dictamen.notifyResolutionDate = new Date(SYSDATE);
      this.dictamen.typeDict =
        this.expedientesForm.get('tipoDictaminacion').value;
      this.dictamen.esDelit = isDelit == null ? 'N' : 'S';
      this.dictamen.instructorDate =
        this.dictaminacionesForm.get('fechaPPFF').value;

      this.dictationService.create(this.dictamen).subscribe({
        next: async (response: any) => {
          this.dictamen.id = response.id;
          console.log('resss', response);
          await this.agregarDictamenXGood();
          let sender_ =
            this.dictaminacionesForm.get('autoriza_remitente').value;
          this.oficioDictamen.sender = sender_;
          this.oficioDictamen.cveChargeRem = this.positionKeyCargo;
          this.oficioDictamen.typeDict = this.dictamen.typeDict;
          this.oficioDictamen.officialNumber = this.dictamen.id;
          this.oficioDictamen.delegacionRecipientNumber =
            this.delegationNumberOficioDict;
          this.oficioDictamen.recipientDepartmentNumber =
            this.departamentNumberOficioDict;
          await this.createOficioDictamen(this.oficioDictamen);
          await this.generateCveOficio(this.dictamen.id);
          this.cveOficio.nativeElement.focus();
          this.buttonApr = false;
          for (let i = 0; i < this.documents.length; i++) {
            console.log('DSADS', this.documents[i]);
            await this.createDocumentDictum(this.documents[i]);
          }
          this.alertInfo('success', 'Dictamen creado correctamente', '').then(
            () => {
              let cveOficio = this.dictaminacionesForm.get('cveOficio').value;
              let tipo = this.expedientesForm.get('tipoDictaminacion').value;
              let noDictaminacion =
                this.expedientesForm.get('noDictaminacion').value;
              let volante = this.dictaminacionesForm.get('wheelNumber').value;
              this.router.navigate(
                [baseMenu + baseMenuDepositaria + DEPOSITARY_ROUTES_2[0].link],
                {
                  queryParams: {
                    PAQUETE: 0,
                    P_GEST_OK: '',
                    CLAVE_OFICIO_ARMADA: this.dictamen.passOfficeArmy,
                    P_NO_TRAMITE: this.P_NO_TRAMITE,
                    TIPO: typeDict,
                    P_VALOR: this.dictamen.id
                      ? this.dictamen.id
                      : this.dictNumber,
                    TIPO_VO: this.TIPO_VO,
                    // CLAVE_OFICIO_ARMADA: cveOficio,
                    // TIPO: tipo,
                    // P_VALOR: noDictaminacion,
                    // PAQUETE: '',
                    // P_GEST_OK: 1, // ..hardcoded - no llega de la pantalla anterior
                    // P_NO_TRAMITE: 1044141, // ..hardcoded - no llega de la pantalla anterior
                    origin: 'FACTJURDICTAMASG',
                    origin3: 'FACTGENACTDATEX',
                  },
                }
              );
            }
          );
        },
        error: (err: any) => {
          console.log('erer', err);
          if (
            err.error.message ==
            'duplicate key value violates unique constraint "no_ofdicta_pk"'
          ) {
            this.alert(
              'error',
              'Ya se encuentra un dictamen con estos datos',
              ''
            );
          }
        },
      });
      // this.applicationGoodsQueryService.getDictamenSeq(pNumber).subscribe({
      //   next: (response: any) => {
      //     console.log("resss", response)
      //     this.generateCveOficio(response.dictamenDelregSeq);
      //     this.cveOficio.nativeElement.focus();
      //     setTimeout(
      //       () =>
      //         Swal.fire(
      //           '',
      //           'Clave de oficio generada correctamente.',
      //           'success'
      //         ).then(() => {
      //           let cveOficio = this.dictaminacionesForm.get('cveOficio').value;
      //           let tipo = this.expedientesForm.get('tipoDictaminacion').value;
      //           let noDictaminacion =
      //             this.expedientesForm.get('noDictaminacion').value;
      //           let volante = this.dictaminacionesForm.get('wheelNumber').value;
      //           this.router.navigate(
      //             [
      //               baseMenu +
      //               baseMenuDepositaria +
      //               DEPOSITARY_ROUTES_2[0].link,
      //             ],
      //             {
      //               queryParams: {
      //                 CLAVE_OFICIO_ARMADA: cveOficio,
      //                 TIPO: tipo,
      //                 P_VALOR: noDictaminacion,
      //                 PAQUETE: '',
      //                 P_GEST_OK: 1, // ..hardcoded - no llega de la pantalla anterior
      //                 P_NO_TRAMITE: 1044141, // ..hardcoded - no llega de la pantalla anterior
      //                 origin: 'FACTJURDICTAMASG',
      //               },
      //             }
      //           );
      //         }),
      //       1000
      //     );
      //   },
      //   error: (err: any) => {
      //     this.alert('error', '', err);
      //   },
      // });
    }
  }

  async getDocumentsDictums(data: any) {
    return new Promise((resolve, reject) => {
      this.parametersService.getFaStageCreda(data).subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.loading = false;
          resolve(resp.stagecreated);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async getOFICIODict(typeDict: any) {
    return new Promise((resolve, reject) => {
      this.dictationService.getFactjurdictamasg(typeDict).subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.loading = false;
          resolve(resp.job);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async getFaStageCreda(data: any) {
    return new Promise((resolve, reject) => {
      this.parametersService.getFaStageCreda(data).subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.loading = false;
          resolve(resp.stagecreated);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async getDepartment2(data: any) {
    return new Promise((resolve, reject) => {
      this.departamentService.getInCatDepartaments(data).subscribe({
        next: (resp: any) => {
          console.log('AAA', resp);
          if (resp.data.length > 1) {
            const data = resp.data[1];
            resolve(data);
          } else if (resp.data.length == 1) {
            const data = resp.data[0];
            resolve(data);
          }
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async getDepartment(data: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${data.department}`;
    params['filter.numDelegation'] = `$eq:${data.delegation}`;
    params['filter.numSubDelegation'] = `$eq:${data.subDelegation}`;
    params['filter.phaseEdo'] = `$eq:${data.stage}`;
    return new Promise((resolve, reject) => {
      this.departamentService.getAll(params).subscribe({
        next: (resp: any) => {
          const data = resp.data[0];
          resolve(data);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async valideDataRemitente(data: any) {
    const params = new ListParams();
    params['filter.user'] = `$eq:${data}`;
    params['filter.assigned'] = `$eq:S`;
    return new Promise((resolve, reject) => {
      this.segAcessXAreasService.getAll(params).subscribe({
        next: (resp: any) => {
          console.log('resp', resp);
          const data = resp.data[0];
          resolve(data);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async valideDataCargo(data: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${data}`;
    return new Promise((resolve, reject) => {
      this.segAcessXAreasService.getAll__(params).subscribe({
        next: (resp: any) => {
          const data = resp.data[0];
          resolve(data.positionKey);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // CREATE OFICIO DICTAMEN //
  async createOficioDictamen(body: any) {
    this.dictationService.createOfficialDictation(body).subscribe({
      next: (data: any) => {
        console.log('SII2', data);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  // OBTENEMOS OFICIO DICTAMEN //
  async getOficioDictamen(data: any) {
    const params = new ListParams();
    params['filter.officialNumber'] = `$eq:${data.id}`;
    params['filter.typeDict'] = `$eq:${data.typeDict}`;

    this.oficialDictationService.getAll(params).subscribe({
      next: async (data: any) => {
        console.log('OFICIO,', data);
        this.oficioDictamen = data.data[0];

        if (this.oficioDictamen.sender != null) {
          let paramsSender = this.oficioDictamen.sender;
          await this.getSenders2(paramsSender);
        }

        if (this.oficioDictamen.statusOf == 'ENVIADO') {
          this.disabledSend = false;
        } else {
          this.disabledSend = true;
        }
        console.log('DATA OFFICE', data);
        this.loading = false;
      },
      error: error => {
        // this.alert(
        //   'warning',
        //   'OFICIO DE DICTÁMENES',
        //   'No se encontraron oficio de dictámenes'
        // );
        this.disabledSend = true;
        this.departamentNumberOficioDict = null;
        this.delegationNumberOficioDict = null;
        this.loading = false;
      },
    });
  }
  async getSenders2(params: any) {
    console.log('user', params);
    // return this.usersService.getAllSegUsers(params).pipe(
    //   catchError(error => {
    //     console.log("USUARIOEE", error)
    //     this.users$ = new DefaultSelect([], 0, true);
    //     return throwError(() => error);
    //   }),
    //   tap(response => {
    //     console.log("USUARIO", response)

    //     // this.users$ = new DefaultSelect(response.data, response.count);

    //   })
    // );
    const params_ = new ListParams();
    params_['filter.id'] = `$eq:${params}`;
    console.log(params_);
    this.usersService.getAllSegUsers(params_).subscribe(
      (data: any) => {
        console.log('USUARIO', data);
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.id + ' - ' + item.name;
        });
        Promise.all(result).then((resp: any) => {
          this.dictaminacionesForm
            .get('autoriza_remitente')
            .setValue(data.data[0].id);
          this.dictaminacionesForm
            .get('autoriza_nombre')
            .setValue(data.data[0].name);
          // this.senders = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        console.log('ERR', error);
        this.users$ = new DefaultSelect([], 0, true);
      }
    );
  }

  async createDocumentDictum(document: any) {
    const token = this.authService.decodeToken();
    for (let i = 0; i < this.goodsValid.length; i++) {
      if (this.goodsValid[i].goodClassNumber == document.numberClassifyGood) {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const year = today.getFullYear();
        const SYSDATE5 = `${year}-${month}-${day}`;

        // Definir el string original
        let cadena = document.date;

        // Utilizar el método split() para separar la cadena en un array de elementos
        let arrayCadena = cadena.split('/');

        // Obtener el segundo elemento del array, que es "06"
        let elemento2 = `${arrayCadena[2]}/${arrayCadena[1]}/${arrayCadena[0]}`;

        let obj: any = {
          expedientNumber: this.expedientesForm.get('noExpediente').value,
          stateNumber: this.goodsValid[i].id,
          key: document.cveDocument,
          typeDictum: this.expedientesForm.get('tipoDictaminacion').value,
          dateReceipt: elemento2,
          userReceipt: '',
          insertionDate: new Date(SYSDATE5),
          userInsertion: token.preferred_username,
          numRegister: null,
          officialNumber: this.dictamen.id,
          notificationDate: null,
          secureKey: null,
        };
        console.log('OBJB', obj);
        this.documentsDictumStatetMService.create(obj).subscribe({
          next: resp => {
            console.log('CREADO DOC', resp);
          },
          error: error => {
            console.log('ERROR DOC', error.error);
            this.alert('warning', 'DOCUMENTOS', error.error.message);
          },
        });
      }
    }
  }

  async createDocumentXDictumM(body: any) {
    this.DictationXGood1Service.createDictaXGood1(body).subscribe({
      next: resp => {
        console.log('CREADO', resp);
      },
      error: error => {
        console.log('ERROR', error.error);
      },
    });
  }

  async agregarDictamenXGood() {
    // console.log('this.dictamenesXBien1', this.dictamenesXBien1);

    let dataBienes: any = this.goodsValid;
    console.log('dataBienesdataBienes', dataBienes);
    for (let i = 0; i < this.goodsValid.length; i++) {
      let obj = {
        ofDictNumber: this.dictamen.id,
        proceedingsNumber: this.expedientesForm.get('noExpediente').value,
        id: this.goodsValid[i].id,
        typeDict: this.expedientesForm.get('tipoDictaminacion').value,
        descriptionDict: this.goodsValid[i].description,
        amountDict: this.goodsValid[i].quantity,
      };

      console.log('OBJ CREATE', obj);
      this.createDictamenXGood1(obj);
    }

    this.onLoadGoodList(this.dictamen.id, 'id');
  }

  async createDictamenXGood1(body: any) {
    this.DictationXGood1Service.createDictaXGood1(body).subscribe({
      next: resp => {
        console.log('SE GUARDARON LOS BIENES ', resp);
      },
      error: error => {
        this.alert('error', 'Error al crear dictamenXbien1', '');
        console.log('ERROR', error.error);
        return;
      },
    });
  }

  async generateCveOficio(noDictamen: string) {
    let token = this.authService.decodeToken();
    const year = new Date().getFullYear();
    let cveOficio = '';
    cveOficio =
      token.siglasnivel1 + '/' + token.siglasnivel2 + '/' + token.siglasnivel3;
    cveOficio = cveOficio + '/' + noDictamen + '/' + year;
    return this.dictaminacionesForm.get('cveOficio').setValue(cveOficio);
  }

  btnCloseDocs() {
    this.listadoDocumentos = false;
  }

  // USUARIOS
  // --
  users$ = new DefaultSelect<ISegUsers>();
  areas$ = new DefaultSelect<IManagementArea>();
  columnFilters: any = [];

  get managementAreaF() {
    return this.dictaminacionesForm.controls['autoriza_remitente'];
  }

  getAllUsers(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams()).pipe(
      catchError(error => {
        this.users$ = new DefaultSelect([], 0, true);
        return throwError(() => error);
      }),
      tap(response => {
        this.users$ = new DefaultSelect(response.data, response.count);
      })
    );
  }
  delegationNumberOficioDict: any = null;
  departamentNumberOficioDict: any = null;
  positionKeyCargo: any = null;

  userChange(user: any) {
    // ..captura usuario
    console.log(user);
    this.positionKeyCargo = user.positionKey;
    if (user.usuario)
      this.delegationNumberOficioDict = user.usuario.delegationNumber;

    if (user.usuario)
      this.departamentNumberOficioDict = user.usuario.departamentNumber;

    this.dictaminacionesForm.get('autoriza_nombre').setValue(user.name);
  }

  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    const area = this.managementAreaF.value;
    params.search = $params.text;
    this.getAllUsers(params).subscribe();
  }

  async getDeleteDocsDictXGoodM(data: any) {
    const params = new ListParams();
    params['filter.stateNumber'] = `$eq:${data.stateNumber}`;
    params['filter.expedientNumber'] = `$eq:${data.expedientNumber}`;
    return new Promise((resolve, reject) => {
      this.documentService.getDeleteDocumentsDictuXStateM(params).subscribe({
        next: (resp: any) => {
          const data = resp.data;
          resolve(data);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  newDictums() {
    this.resetALL();
    let obj = {
      no_clasif_bien: 0,
    };
    this.disabledSend = true;
    this.statusDict = '';
    this.disabledButtons = true;
    this.dictaminacionesForm.get('fechaPPFF').setValue('');
    this.dictaminacionesForm.get('autoriza_remitente').setValue(null);
    this.dictaminacionesForm.get('autoriza_nombre').setValue('');
    this.departamentNumberOficioDict = null;
    this.delegationNumberOficioDict = null;
    this.buttonApr = true;
    this.buttonDeleteDisabled = false;
    this.totalItems3 = 0;
    this.totalItems2 = 0;
    this.getDocumentDicXStateM(null);
    this.onTypesChange(obj);
  }

  listDictums() {
    const expedient = this.expedientesForm.get('noExpediente').value;
    const volante = this.dictaminacionesForm.get('wheelNumber').value;
    this.openModalDictums({ noVolante_: volante, noExpediente_: expedient });
  }

  openModalDictums(context?: Partial<ListdictumsComponent>) {
    const modalRef = this.modalService.show(ListdictumsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.dataText.subscribe(async (next: any) => {
      console.log('NEXT', next);
      this.goodsValid = [];
      this.documentsDictumXStateMList = [];
      await this.onLoadDictationInfo(next.data.id, 'id');
      await this.onLoadGoodList(next.data.id, 'id');

      // await this.checkDictum(next.data.id, 'id');
      // await this.checkDictum_(this.noVolante_, 'all');
    });
  }
  async saveDataForm() {
    let token = this.authService.decodeToken();
    // this.dictamen.statusDict = 'DICTAMINADO';
    // this.dictamen.expedientNumber =this.expedientesForm.get('noExpediente').value;
    // this.dictamen.wheelNumber = this.dictaminacionesForm.get('wheelNumber').value;
    // this.dictamen.userDict = token.preferred_username;
    // this.dictamen.delegationDictNumber = this.delegation;
    // this.dictamen.areaDict = null;
    // this.dictamen.typeDict = this.expedientesForm.get('tipoDictaminacion').value;

    // this.dictamen.instructorDate = this.dictaminacionesForm.get('fechaPPFF').value;
    let fecha = new Date(this.dictaminacionesForm.get('fechaPPFF').value);
    // Restar un día
    fecha.setDate(fecha.getDate() - 1);
    // Imprimir la fecha resultante
    console.log(fecha.toString());
    let obj = {
      id: this.dictamen.id ? this.dictamen.id : this.dictNumber,
      typeDict: this.expedientesForm.get('tipoDictaminacion').value,
      instructorDate: fecha.toString(),
    };
    console.log(obj);
    await this.updateDictamen(obj);

    let sender_ = this.dictaminacionesForm.get('autoriza_remitente').value;
    console.log(sender_);
    this.oficioDictamen.sender = sender_;

    let obj1 = {
      sender: sender_,
      delegacionRecipientNumber: this.delegationNumberOficioDict,
      recipientDepartmentNumber: this.departamentNumberOficioDict,
      typeDict: this.oficioDictamen.typeDict,
      officialNumber: this.oficioDictamen.officialNumber,
      cveChargeRem: this.positionKeyCargo,
    };

    await this.updateOficioDictamen(obj1);
    // await this.agregarDictamenXGood();

    // for (let i = 0; i < this.documents.length; i++) {
    //   await this.createDocumentDictum(this.documents[i]);
    // }
  }

  // CREATE OFICIO DICTAMEN //
  async updateOficioDictamen(body: any) {
    this.dictationService.updateOfficialDictation(body).subscribe({
      next: (data: any) => {
        console.log('SII2', data);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  async updateDictamen(obj: any) {
    this.dictationService.update(obj).subscribe({
      next: async (response: any) => {
        this.alert('success', 'Dictamen actualizado correctamente', '');
      },
      error: (err: any) => {
        console.log('erer', err);
      },
    });
  }

  delegation: any;
  subdelegation: any;
  areaDict: any;
  async get___Senders(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    params.addFilter('assigned', 'S');
    if (lparams?.text.length > 0)
      params.addFilter('user', lparams.text, SearchFilter.LIKE);
    this.hideError();
    this.abandonmentsService.getUsers(params.getParams()).subscribe({
      next: (data: any) => {
        console.log('DATA DDELE', data);
        this.delegation = data.data[0].delegationNumber;
        this.subdelegation = data.data[0].subdelegationNumber;
        this.areaDict = data.data[0].departamentNumber;
      },
      error: () => {},
    });
  }

  async getAutorizateDelete(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    params.addFilter('assigned', 'S');
    if (lparams?.text.length > 0)
      params.addFilter('user', lparams.text, SearchFilter.LIKE);

    return new Promise((resolve, reject) => {
      this.abandonmentsService.getUsers(params.getParams()).subscribe({
        next: (data: any) => {
          resolve(1);
        },
        error: () => {
          resolve(null);
        },
      });
    });
  }
}
