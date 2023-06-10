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
import { BehaviorSubject, catchError, takeUntil, tap, throwError } from 'rxjs';
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
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { OficialDictationService } from 'src/app/core/services/ms-dictation/oficial-dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
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
  dictNumber: string | number = undefined;
  delegationDictNumber: string | number = undefined;
  keyArmyNumber: string | number = undefined;
  maxDate = new Date();
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
        if (row.data.v_amp == 'S') {
          return 'bg-success text-danger';
        } else {
          return 'bg-success text-white';
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
  disabledD: boolean = true;
  inputsVisuales: boolean = true;
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
    private statusGoodService: StatusGoodService
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
    // this.activatedRoute.queryParams.subscribe((params: any) => {
    //   this.expedientesForm.get('noExpediente').setValue(params?.expediente);
    //   this.expedientesForm.get('tipoDictaminacion').setValue(params?.tipoDic);
    //   this.expedientesForm.get('noVolante').setValue(params?.volante);
    //   this.dictaminacionesForm.get('wheelNumber').setValue(params?.volante);
    // });
    this.getParams();
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
      autoriza_nombre: [null, [Validators.pattern(STRING_PATTERN)]],
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
  }

  dateValidS: any;
  P_NO_TRAMITE: any;
  getParams() {
    this.dictaminacionesForm.get('wheelNumber').setValue(null);
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.expedientesForm.get('noExpediente').setValue(params?.EXPEDIENTE);
      if (params.TIPO_DIC) {
        this.showCriminalCase = false;
        //corregido
      }
      console.log('params?', params);
      this.expedientesForm.get('tipoDictaminacion').setValue(params?.TIPO_DIC);
      console.log('params?.TIPO_DIC', params?.TIPO_DIC);

      if (params?.TIPO_DIC == 'PROCEDENCIA') {
        this.buttonDisabled = false;
      }
      if (params?.TIPO_VO) {
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
    this.dictaminacionesForm.get('wheelNumber').setValue(null);
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
          this.dictaminacionesForm
            .get('autoriza_nombre')
            .setValue(response.indicatedName);
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
        this.dictaminacionesForm
          .get('wheelNumber')
          .setValue(res.data[0].wheelNumber || undefined);
        this.dictaminacionesForm
          .get('fechaDictaminacion')
          .setValue(
            this.datePipe.transform(new Date(), 'dd-MM-yyyy') || undefined
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
    const params = new ListParams();
    params['filter.ofDictNumber'] = `$eq:${data.id}`;
    params['filter.typeDict'] = `$eq:${data.typeDict}`;
    // console.log()
    this.DictationXGood1Service.getAll(params).subscribe({
      next: async (data: any) => {
        // this.dictamenesXBien1 = data.data;

        let result = data.data.map(async (item: any) => {
          item['status'] = item.good.status;
          item['extDomProcess'] = item.good.extDomProcess;
        });
        this.goodsValid = data.data;
        this.dictamenXGood1 = data.data[0];
        console.log('DATA DICTXGOOD', data);

        await this.getDocumentDicXStateM(this.dictamenXGood1.id);
        this.loading = false;
      },
      error: (error: any) => {
        console.log('DICT', error);
        this.loading = false;
      },
    });
  }

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
      this.TIPO_VO = params.TIPO_VO;
      this.typeDictation = params.TIPO_DIC;
    });

    //console.log('btnDocumentos ', this.goodData2);
    //const numberClassifyGood = this.goodData2.goodClassNumber;

    const typeDictation = this.typeDictation;
    const crime = this.expedientesForm.controls['delito'].value;
    const typeSteeringwheel = this.TIPO_VO;
    // const numberClassifyGood = this.goodClassNumber;
    const numberClassifyGood = this.numberClassifyGood;
    const stateNumber = this.stateNumber;
    const dateValid = this.dictaminacionesForm.get('fechaPPFF').value;
    let config: ModalOptions = {
      initialState: {
        // numberClassifyGood,
        typeDictation,
        crime,
        typeSteeringwheel,
        numberClassifyGood,
        stateNumber,
        dateValid,
        callback: (next: any) => {
          this.documents = next;
          console.log('NEXT', next);
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
  btnBorrarDictamen() {
    const object = {
      vProceedingsNumber: this.expedientesForm.get('noExpediente').value,
      vTypeDicta: this.expedientesForm.get('tipoDictaminacion').value,
      vOfNumberDicta: this.dictNumber,
      vWheelNumber: this.dictaminacionesForm.get('wheelNumber').value,
    };
    this.alertQuestion(
      'info',
      'Desea eliminar el Dictamen?',
      '¿Deseas continuar?'
    ).then(question => {
      if (question.isConfirmed) {
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
            this.cveOficio.nativeElement.focus();
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

    // this.btnDeleteDictation();
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
    if (exp !== '' && this.dictamen.id !== null) {
      this.router.navigate(
        ['/pages/juridical/depositary/legal-opinions-office/'],
        {
          queryParams: {
            origin: 'FACTJURDICTAMASG', //Cambiar
            P_VALOR: this.dictamen.id,
            P_NO_TRAMITE: this.expedientesForm.get('noExpediente').value,
            CLAVE_OFICIO_ARMADA:
              this.dictaminacionesForm.get('cveOficio').value,
            P_GEST_OK: this.P_GEST_OK,
            CONSULTA: this.CONSULTA,
            VOLANTE: this.dictaminacionesForm.get('wheelNumber').value,
            EXPEDIENTE: this.expedientesForm.get('noExpediente').value,
            TIPO: this.expedientesForm.get('tipoDictaminacion').value,
            TIPO_VO: this.TIPO_VO,
            // this.expedientesForm.get('noVolante').value
          },
        }
      );
    } else {
      this.alert(
        'warning',
        'Necesitas un número de expedientes con oficio.',
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
          BIEN: this.stateNumber,
          PLLAMO: 'ABANDONO',
          P_GEST_OK: this.P_GEST_OK,
          P_NO_TRAMITE: this.P_NO_TRAMITE,
          NO_DICTAMEN: this.dictamen.id, //No lo pide originalmente
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
        'info',
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
      this.onLoadToast('error', 'Debe seleccionar un identificador');
      return;
    }

    if (this.statusDict == 'DICTAMINADO' || this.statusDict == 'IMPROCEDENTE') {
      this.onLoadToast(
        'error',
        'Este dictamen ya tiene un estatus DICTAMINADO'
      );
      return;
    }

    if (this.expedientesForm.get('identifier').value) {
      this.isIdent = false;
    }

    if (!this.dictaminacionesForm.get('autoriza_remitente').value) {
      this.onLoadToast('error', 'Debe especificar quien autoriza dictamen');
      return;
    }

    if (this.expedientesForm.get('type').value == null) {
      this.onLoadToast('error', 'Debe seleccionar un tipo de bien');
      return;
    }

    if (!this.dictaminacionesForm.get('fechaPPFF').value) {
      this.onLoadToast('error', `Debe capturar la ${this.label}`);
      return;
    }

    if (this.goods.length > 0) {
      this.goods.forEach(_g => {
        console.log(_g);

        if (_g.est_disponible == 'S' && _g.di_disponible == 'S') {
          _g.est_disponible = 'N';
          _g.di_disponible = 'N';
          _g.name = false;
          let valid = this.goodsValid.some(goodV => goodV == _g);
          if (!valid) {
            this.goodsValid = [...this.goodsValid, _g];
          }
        }

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

  addSelect() {
    if (this.statusDict == 'DICTAMINADO' || this.statusDict == 'IMPROCEDENTE') {
      this.onLoadToast(
        'error',
        'Este dictamen ya tiene un estatus DICTAMINADO'
      );
      return;
    }

    if (this.expedientesForm.get('identifier').value) {
      this.isIdent = false;
    }

    if (!this.dictaminacionesForm.get('autoriza_remitente').value) {
      this.onLoadToast('error', 'Debe especificar quien autoriza dictamen');
      return;
    }

    // Cambiar la forma en agregar bien ya que es un push y no dato directo para el estatus
    // if(this.bien.est_disponible = 'N'){
    //   this.onLoadToast('error','El bien tiene un estatus invalido para ser dictaminado o ya esta dictaminado')
    //   return
    // }

    if (this.expedientesForm.get('type').value == null) {
      this.onLoadToast('error', 'Debe seleccionar un tipo de bien');
      return;
    }

    if (!this.expedientesForm.get('identifier').value) {
      this.onLoadToast('error', 'Debe seleccionar un identificador');
      return;
    }

    // Cambiar la forma en agregar bien ya que es un push y no dato directo para el estatus
    // if(this.bien.di_disponible = 'N'){
    //   this.onLoadToast('error','El Bien ya existe')
    //   return
    // }

    if (!this.dictaminacionesForm.get('fechaPPFF').value) {
      this.onLoadToast('error', `Debe capturar la ${this.label}`);
      return;
    }

    // Cambiar la forma en agregar bien ya que es un push y no dato directo para el estatus
    //if (this.bienes.DI_ES_NUMERARIO == 'S' this.bienes.DI_ESTA_CONCILIADO == 'N' AND: this.expedientesForm.get('tipoDictaminacion').value == 'PROCEDENCIA')
    //   this.onLoadToast('error', 'El numerario no esta conciliado')
    //   return

    if (this.selectedGooods.length > 0) {
      this.selectedGooods.forEach((good: any) => {
        if (!this.goodsValid.some(v => v === good)) {
          let indexGood = this.goods.findIndex(_good => _good == good);
          this.goods[indexGood].est_disponible = 'N';
          this.goods[indexGood].di_disponible = 'N';
          this.goodsValid.push(good);
          this.goodsValid = [...this.goodsValid];
        } else {
          if (good.di_disponible == 'N') {
            this.onLoadToast('error', `El bien ${good.goodId} ya existe`);
          }
        }
      });
    }
  }
  removeSelect() {
    if (this.statusDict == 'DICTAMINADO') {
      this.onLoadToast(
        'error',
        'El bien ya esta Dictaminado... Imposible borrar'
      );
      return;
    }

    if (this.selectedGooodsValid.length > 0) {
      // this.goods = this.goods.concat(this.selectedGooodsValid);
      this.selectedGooodsValid.forEach(good => {
        this.goodsValid = this.goodsValid.filter(_good => _good.id != good.id);
        let index = this.goods.findIndex(g => g === good);
        this.goods[index].est_disponible = 'S';
        this.goods[index].di_disponible = 'S';

        //this.goods[index].status = 'ADM';
        this.goods[index].name = false;
        // this.selectedGooods = [];
      });
      this.selectedGooodsValid = [];
    }
  }
  removeAll() {
    if (this.statusDict == 'DICTAMINADO') {
      this.onLoadToast(
        'error',
        'El bien ya esta Dictaminado... Imposible borrar'
      );
      return;
    }

    if (this.goodsValid.length > 0) {
      this.goodsValid.forEach(good => {
        this.goodsValid = this.goodsValid.filter(_good => _good.id != good.id);
        let index = this.goods.findIndex(g => g === good);
        this.goods[index].est_disponible = 'S';
        this.goods[index].di_disponible = 'S';

        //this.goods[index].status = 'ADM';
        this.goods[index].name = false;
      });
      this.goodsValid = [];
    }
  }

  onSelectedRow(event: any) {
    console.log('EVENT', event);
    this.getStatusGood(event.data.status);
    let obj: IGood = this.goods.find(element => element.id === event.data.id);
    let index: number = this.goods.findIndex(elm => elm === obj);
    console.log(index);
  }
  getStatusGood(data: any) {
    const params = new ListParams();
    params['filter.status'] = `$eq:${data}`;

    this.statusGoodService.getAll(params).subscribe(
      (response: any) => {
        const { data } = response;
        this.desc_estatus_good = data[0].description;
        // this.di_status.get('di_desc_estatus').setValue(data[0].description);
        console.log('SCREEN', data);
      },
      error => {
        console.log('SCREEN', error.error.message);
      }
    );
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

  onTypesChange(type: any) {
    this.numberClassifyGood = type.no_clasif_bien;
    if (type.no_clasif_bien == 0) {
      this.onLoadGoodList(0, 'all');
    } else {
      const filter = new FilterParams();
      const { noExpediente } = this.expedientesForm.value;

      filter.addFilter('goodClassNumber', type.no_clasif_bien, SearchFilter.EQ);
      filter.addFilter('fileNumber', noExpediente, SearchFilter.EQ);

      this.goodServices.getAllFilter(filter.getParams()).subscribe({
        next: response => {
          const data = response.data;

          data.map(async (good: any) => {
            good.di_disponible = 'S';
            const resp = await new Promise((resolve, reject) => {
              const body = {
                pGoodNumber: good.goodId,
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
                next: state => {
                  good.est_disponible = state.EST_DISPONIBLE;
                  good.v_amp = state.v_amp ? state.v_amp : null;
                  good.pDiDescStatus = state.pDiDescStatus;
                  // this.desc_estatus_good = state.pDiDescStatus;
                  resolve(state);
                },
                error: () => {
                  resolve(null);
                  console.log('fallo');
                },
              });
            });
          });

          this.goods = data;
          this.totalItems = response.count || 0;
        },
      });
    }
    // this.resetFields([this.subtype, this.ssubtype, this.sssubtype]);
    // this.subtypes = new DefaultSelect();
    // this.ssubtypes = new DefaultSelect();
    // this.sssubtypes = new DefaultSelect();
    // this.subtipoForm.updateValueAndValidity();
    // this.goodTypeChange.emit(type);
  }

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

        this.onLoadToast('error', 'Error', error);
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
    this.goodServices
      .getByExpedient(
        this.expedientesForm.get('noExpediente').value,
        this.params.getValue()
      )
      .subscribe({
        next: response => {
          const data = response.data;
          console.log('GODDDDSS', response);

          let arr: any = [];
          let arrD: any = [];
          let result = data.map(async (good: any) => {
            good.di_disponible = 'S';

            const dictamenXGood1: any = await this.getDictaXGood(
              good.id,
              this.dictamen.id
            );
            console.log(dictamenXGood1);
            if (dictamenXGood1 != null) {
              if (dictamenXGood1.ofDictNumber == this.dictamen.id) {
                arr.push(good);
                arrD.push(dictamenXGood1);
              }
            }

            await new Promise((resolve, reject) => {
              const body = {
                pGoodNumber: good.goodId,
                pClasifGoodNumber: good.goodClassNumber,
                pStatus: good.status,
                pTypeDicta: this.expedientesForm.get('tipoDictaminacion').value,
                pLBTypesDicta:
                  this.expedientesForm.get('tipoDictaminacion').value,
                pIdentity: good.identifier,
                pVcScreem: 'FACTJURDICTAMASG',
                pDiDescStatus: good.estatus.descriptionStatus ?? '',
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
                },
              });
            });

            if ([62, 1424, 1426, 1590].includes(good.cgoodClassNumber)) {
              good.di_es_numerario = 'S';
              good.di_esta_conciliado = 'N';

              await new Promise((resolve, reject) => {
                const body = {
                  pGoodNumber: good.goodId,
                  pExpendientNumber: good.fileNumber,
                  pVal1: good.val1 ?? '',
                  pVal2: good.val2 ?? '',
                  pVal4: good.val4 ?? '',
                  pVal5: good.val5 ?? '',
                  pVal6: good.val6 ?? '',
                };

                this.serviceGood.dictationConcilation(body).subscribe({
                  next: state => {
                    good.di_esta_conciliado = 'S';
                    resolve(state);
                  },
                  error: () => {
                    good.di_esta_conciliado = 'N';
                    resolve(null);
                  },
                });
              });
            } else {
              good.di_es_numerario = 'N';
              good.di_esta_conciliado = 'N';
            }
          });

          Promise.all(result).then((resp: any) => {
            console.log('this.goods', arr);
            this.goods = data;
            // let arr2 = [];
            // this.arrDXG = arr;

            // this.goodsValid = arr;

            // for (let i = 0; i < arrD.length; i++) {
            //   if (id == arrD[i].ofDictNumber) {
            //     arr2.push(arr[i])
            //   }
            // }

            // if (filter == 'all') {
            //   this.goodsValid = arr;
            // } else {
            //   this.goodsValid = arr2;
            // }

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

  async getDictXGood() {}

  getDictaXGood(id: any, filter: any) {
    const params = new ListParams();
    // if (filter == null) {
    //   params['filter.id'] = `$eq:${id}`;
    // } else {
    params['filter.id'] = `$eq:${id}`;
    params['filter.ofDictNumber'] = `$eq:${filter}`;
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
    // this.getDocumentDicXStateM(event.data.id);
    /*const idGood = { ...this.goodData };
    this.totalItems2 = 0;
    this.documentsDictumXStateMList = [];
    this.goodData = event.data;
    console.log(
      'Información del bien seleccionado rowsSelected2',
      this.goodData.goodClassNumber
    );*/
  }

  async getDocumentDicXStateM(id?: number) {
    this.loading2 = true;
    let params = {
      ...this.listParams.getValue(),
      stateNumber: id,
    };
    this.documentService.getDocumentsByGood(id, params).subscribe({
      next: resp => {
        let arr: any = [];
        let result = resp.data.map(async (item: any) => {
          const docsss = await this.docsssDicOficM(item.cveDocument);
          arr.push(docsss);
        });
        this.documentsDictumXStateMList = resp.data;
        this.totalItems2 = resp.count;
        this.loading2 = false;

        console.log('Documentos, ', resp);
      },
      error: error => {
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
      this.alert('info', 'AVISO', 'Debes seleccionar un bien');
      return;
    }
    if (status === 'DICTAMINADO') {
      this.alert('info', 'Bien ya se encuentra dictaminado', '');
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

        if (vnivelp == 3) {
          vniveld3 = SIGLAp;
        } else if (vnivelp == 2) {
          vniveld2 = SIGLAp;
        }
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
      let vnivel_ = vnivel + 1;
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

      this.dictamen.statusDict = 'DICTAMINADO';
      this.dictamen.expedientNumber =
        this.expedientesForm.get('noExpediente').value;
      this.dictamen.wheelNumber =
        this.dictaminacionesForm.get('wheelNumber').value;
      this.dictamen.userDict = token.preferred_username;
      this.dictamen.delegationDictNumber = 2;
      this.dictamen.areaDict = null;
      this.dictamen.dictDate = new Date(SYSDATE);
      this.dictamen.notifyAssuranceDate = new Date(SYSDATE);
      this.dictamen.resolutionDate = new Date(SYSDATE);
      this.dictamen.notifyResolutionDate = new Date(SYSDATE);
      this.dictamen.typeDict =
        this.expedientesForm.get('tipoDictaminacion').value;

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
          this.oficioDictamen.typeDict = this.dictamen.typeDict;
          this.oficioDictamen.officialNumber = this.dictamen.id;
          this.oficioDictamen.delegacionRecipientNumber = null;

          await this.createOficioDictamen(this.oficioDictamen);
          await this.generateCveOficio(this.dictamen.id);
          this.cveOficio.nativeElement.focus();
          this.buttonApr = false;
          for (let i = 0; i < this.documents.length; i++) {
            await this.createDocumentDictum(this.documents[i]);
          }
          Swal.fire('Dictamen creado correctamente', '', 'success').then(() => {
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
                  P_VALOR: this.dictamen.id,
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
          });
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
      next: data => {
        console.log('OFICIO,', data);
        this.oficioDictamen = data.data[0];

        if (this.oficioDictamen.sender != null) {
          const paramsSender: any = new ListParams();
          paramsSender.text = this.oficioDictamen.sender;
          this.getSenders2(paramsSender);
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
        this.loading = false;
      },
    });
  }
  async getSenders2(params: ListParams) {
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
    // params['filter.user'] = `$eq:${params.text}`;
    this.usersService.getAllSegUsers(params).subscribe(
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
      let obj: any = {
        expedientNumber: this.expedientesForm.get('noExpediente').value,
        stateNumber: this.goodsValid[i].id,
        key: document.cveDocument,
        typeDictum: this.expedientesForm.get('tipoDictaminacion').value,
        dateReceipt: document.date,
        userReceipt: '',
        insertionDate: document.dae,
        userInsertion: token.preferred_username,
        numRegister: null,
        officialNumber: this.dictamen.id,
        notificationDate: null,
        secureKey: null,
      };

      this.documentsDictumStatetMService.create(obj).subscribe({
        next: resp => {
          console.log('CREADO DOC', resp);
        },
        error: error => {
          console.log('ERROR DOC', error.error);
        },
      });
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
        console.log('CREADO', resp);
      },
      error: error => {
        console.log('ERROR', error.error);
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
  userChange(user: any) {
    // ..captura usuario
    console.log(user);
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
      // this.documentsService.getDeleteDocumentsDictuXStateM(params).subscribe({
      //   next: (resp: any) => {
      //     const data = resp.data;
      //     resolve(data);
      //     this.loading = false;
      //   },
      //   error: error => {
      //     this.loading = false;
      //     resolve(null);
      //   },
      // });
    });
  }

  newDictums() {
    this.resetALL();
    let obj = {
      no_clasif_bien: 0,
    };
    this.statusDict = '';
    this.dictaminacionesForm.get('fechaPPFF').setValue('');
    this.dictaminacionesForm.get('autoriza_remitente').setValue(null);
    this.dictaminacionesForm.get('autoriza_nombre').setValue('');
    this.buttonApr = true;
    this.buttonDeleteDisabled = false;
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
      await this.onLoadDictationInfo(next.data.id, 'id');
      this.goodsValid = [];
      await this.onLoadGoodList(next.data.id, 'id');

      // await this.checkDictum(next.data.id, 'id');
      // await this.checkDictum_(this.noVolante_, 'all');
    });
  }
}
