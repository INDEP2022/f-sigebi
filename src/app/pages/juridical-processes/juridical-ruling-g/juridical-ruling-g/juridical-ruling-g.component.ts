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
import { BehaviorSubject, catchError, takeUntil, tap, throwError } from 'rxjs';
import { DEPOSITARY_ROUTES_2 } from 'src/app/common/constants/juridical-processes/depositary-routes-2';
import {
  baseMenu,
  baseMenuDepositaria,
} from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { IGoodsSubtype } from 'src/app/core/models/catalogs/goods-subtype.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IDocumentsDictumXStateM } from 'src/app/core/models/ms-documents/documents-dictum-x-state-m';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IManagementArea } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsDictumStatetMService } from 'src/app/core/services/catalogs/documents-dictum-state-m.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DatePickerElementComponent } from 'src/app/shared/components/datepicker-element-smarttable/datepicker.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { TempGood } from './dataTemp';

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
  goodsValid: IGood[] = [];
  documents: IDocuments[] = [];
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
  idGoodSelected = 0;
  @ViewChild('cveOficio', { static: true }) cveOficio: ElementRef;
  goodData: IGood;

  //tipos
  types = new DefaultSelect<Partial<IGoodType>>();
  subtypes = new DefaultSelect();
  ssubtypes = new DefaultSelect();
  sssubtypes = new DefaultSelect();

  typesDict = new DefaultSelect(
    [
      { id: 'DESTRUCCION', typeDict: 'DESTRUCCIÓN' },
      { id: 'DONACION', typeDict: 'DONACION' },
      { id: 'ENAJENACION', typeDict: 'ENAJENACIÓN' },
      { id: 'TRANSFERENTE', typeDict: 'TRANSFERENTE' },
      { id: 'PROCEDENCIA', typeDict: 'PROCEDENCIA' },
      { id: 'DEVOLUCIÓN', typeDict: 'DEVOLUCIÓN' },
      { id: 'ABANDONO', typeDict: 'ABANDONO' },
      { id: 'RESARCIMIENTO', typeDict: 'RESARCIMIENTO' },
    ],
    2
  );

  ident = new DefaultSelect(
    [
      { id: 'ASEGURADO', value: 'ASEGURADO' },
      { id: 'TRANSFERENTE', value: 'TRANSFERENTE' },
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
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        title: 'Descripción',
        type: 'string',
      },
      quantity: {
        title: 'Cantidad',
        type: 'string',
      },
      identifier: {
        title: 'Ident.',
        type: 'string',
      },
      status: {
        title: 'Estatus',
        type: 'string',
      },
      processStatus: {
        title: 'Proceso',
        type: 'string',
      },
    },
    rowClassFunction: (row: any) => {
      if (
        row.data.status === 'STA' ||
        row.data.status === 'ROP' ||
        row.data.status === 'ADM'
      ) {
        return 'bg-success text-white';
      } else {
        return 'bg-dark text-white';
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
        title: '',
        sort: false,
        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (isSelected: boolean, row: IGood) =>
          this.isGoodSelectedValid(row),
        renderComponent: CheckboxElementComponent,
        onComponentInitFunction: (instance: CheckboxElementComponent) =>
          this.onGoodSelectValid(instance),
      },
      id: {
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        title: 'Descripción Dictaminación',
        type: 'string',
      },
      menaje: {
        title: 'Menaje',
        type: 'string',
      },
      quantity: {
        title: 'Cant. Dictaminación',
        type: 'string',
      },
      status: {
        title: 'Estatus',
        type: 'string',
      },
      processStatus: {
        title: 'Proceso',
        type: 'string',
      },
      idDestino: {
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
    columns: {
      id: {
        title: '#',
        type: 'number',
      },
      descriptionDocument: {
        title: 'Documentos',
        type: 'string',
      },
      selectedDate: {
        title: 'Fec. Recibido',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  settings4 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      numRegister: {
        title: '#',
        type: 'number',
      },
      key: {
        title: 'Documentos',
        type: 'string',
        valuePrepareFunction: (value: any) => {
          return value.description;
        },
      },
      fecha: {
        title: 'Fecha',
        type: 'custom',
        class: 'custom-title',
        valuePrepareFunction: (bsValue: Date, row: IDocuments) =>
          this.isDocumentSelectedValid(row),
        renderComponent: DatePickerElementComponent,
        onComponentInitFunction: (instance: DatePickerElementComponent) =>
          this.onDocsSelectValid(instance),
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  expedientesForm: FormGroup;
  dictaminacionesForm: FormGroup;
  subtipoForm: FormGroup;
  gestionDestinoForm: FormGroup;
  public buttonDisabled: boolean = false;
  public buttonDeleteDisabled: boolean = true;
  public listadoDocumentos: boolean = false;
  // public rutaAprobado: string = baseMenu + baseMenuDepositaria + DEPOSITARY_ROUTES_2[0].link;

  isDelit: boolean = true;
  btnIsParcial: boolean = true;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: GoodTypeService,
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
    private documentsDictumStatetMService: DocumentsDictumStatetMService
  ) {
    super();
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
      delito: [false],
      averiguacionPrevia: [null, [Validators.pattern(STRING_PATTERN)]],
      causaPenal: [null, [Validators.pattern(STRING_PATTERN)]],
      observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      noVolante: [null],
    });

    this.dictaminacionesForm = this.fb.group({
      wheelNumber: [null],
      etiqueta: [null, [Validators.pattern(STRING_PATTERN)]],
      fechaPPFF: [null, [Validators.required]],
      fechaInstructora: [null],
      fechaResolucion: [null],
      fechaDictaminacion: [null],
      fechaNotificacion: [null],
      fechaNotificacionAseg: [null],
      autoriza_remitente: [null],
      criminalCase: [null, [Validators.pattern(STRING_PATTERN)]],
      autoriza_nombre: [null, [Validators.pattern(STRING_PATTERN)]],
      cveOficio: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
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

  getParams() {
    this.dictaminacionesForm.get('wheelNumber').setValue(null);
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.expedientesForm.get('noExpediente').setValue(params?.expediente);
      if (params.tipoDic) {
        this.showCriminalCase = true;
      }
      this.expedientesForm.get('tipoDictaminacion').setValue(params?.tipoDic);
      if (params?.tipoVo) {
        this.validateTypeVol(params.tipoVo, params.tipoDic);
      }
      this.expedientesForm.get('noVolante').setValue(params?.volante);
      this.dictaminacionesForm.get('wheelNumber').setValue(params?.volante);
    });

    this.changeNumExpediente();
  }

  validateTypeVol(typeVol: string, typeDic: string) {
    if (typeVol == 'T') {
      this.label = 'Fec. P.P.F.F.';
      this.isDelit = typeDic == 'PROCEDENCIA' ? true : false;
    } else if ((typeDic = 'PROCEDENCIA')) {
      this.label = 'Fec. Aseg.';
      this.isDelit = true;
    } else if ((typeDic = 'DESTINO')) {
      this.label = 'Fec. Dest.';
      this.isDelit = false;
    } else if ((typeDic = 'DESTRUCCION')) {
      this.label = 'Fec. Dest.';
      this.isDelit = false;
    } else if (['DEVOLUCION', 'RESARCIMIENTO'].includes(typeDic)) {
      this.label = 'Fec. Devo.';
      this.isDelit = false;
    } else if ((typeDic = 'DONACION')) {
      this.label = 'Fec. Dona.';
      this.isDelit = false;
    } else if ((typeDic = 'DECOMISO')) {
      this.label = 'Fec. Deco.';
      this.isDelit = false;
    } else if ((typeDic = 'EXT_DOM')) {
      this.label = 'Fec. ExDom.';
      this.isDelit = false;
    } else if ((typeDic = 'TRANSFERENTE')) {
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

  changeNumExpediente() {
    this.resetALL();
    this.onLoadGoodList();
    this.onLoadExpedientData();
    this.onLoadDictationInfo();
  }

  onKeyPress($event: any) {
    if ($event.key === 'Enter') $event.currentTarget.blur();
    $event.currentTarget.focus();
  }

  resetALL() {
    this.selectedDocuments = [];
    // this.cleanForm();
    this.selectedGooods = [];
    this.selectedGooodsValid = [];
    this.goodsValid = [];
    this.data4 = [];
    this.documents = [];
    this.idGoodSelected = null;
  }

  cleanForm() {
    this.statusDict = null;
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

  onLoadExpedientData() {
    let noExpediente = this.expedientesForm.get('noExpediente').value || '';
    if (noExpediente !== '') {
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
  onLoadDictationInfo() {
    let noExpediente = this.expedientesForm.get('noExpediente').value || '';
    this.loadExpedientInfo(noExpediente).then(({ json }) => {
      json
        .then(res => {
          console.log('fecha dic', res.data[0].dictDate);
          this.dictNumber = res.data[0].id;
          // this.wheelNumber = res.data[0].wheelNumber;
          this.delegationDictNumber = res.data[0].delegationDictNumber;
          this.expedientesForm
            .get('delito')
            .setValue(res.data[0].crimeStatus || undefined);
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
              this.datePipe.transform(res.data[0].dictDate, 'dd-MM-yyyy') ||
                undefined
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
            .setValue(new Date(res.data[0].instructorDate) || undefined);
          this.dictaminacionesForm
            .get('estatus')
            .setValue(res.data[0].statusDict || undefined);
          console.log(res.data[0].typeDict);
          if (res.data[0].typeDict == 'PROCEDENCIA') {
            this.buttonDisabled = true;
          }
          if (
            res.data[0].statusDict == 'DICTAMINADO' ||
            res.data[0].statusDict == 'ABIERTO'
          ) {
            this.buttonDeleteDisabled = false;
          }
        })
        .catch(err => {
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
                params?.expediente ||
                  this.expedientesForm.get('noExpediente').value
              );
            this.expedientesForm
              .get('tipoDictaminacion')
              .setValue(params?.tipoDic);
            this.expedientesForm
              .get('noVolante')
              .setValue(params?.volante || null);
            this.dictaminacionesForm
              .get('wheelNumber')
              .setValue(params?.volante || null);
          });

          // this.expedientesForm.get('tipoDictaminacion').setValue(null);
          // this.dictaminacionesForm.get('wheelNumber').setValue(null);
          this.dictaminacionesForm.get('cveOficio').setValue(null);
          this.dictaminacionesForm.get('fechaDictaminacion').setValue(null);
          this.expedientesForm.get('observaciones').setValue(null);
          this.dictaminacionesForm.get('fechaNotificacion').setValue(null);
          this.dictaminacionesForm.get('etiqueta').setValue(null);
          this.dictaminacionesForm.get('estatus').setValue(null);
          this.dictaminacionesForm.get('cveOficio').setValue(null);
        });
    });
  }

  btnDocumentos() {
    console.log('btnDocumentos');
    this.listadoDocumentos = true;
  }
  btnAprobar() {
    console.log('btnAprobar');
  }
  btnRechazar() {
    console.log('btnRechazar');
  }
  btnBorrarDictamen() {
    this.btnDeleteDictation();
  }

  btnImprimeOficio() {
    console.log(this.expedientesForm);
    if (this.expedientesForm.get('noExpediente').value === null) {
      this.alert('warning', '', 'Debes seleccionar un expediente.');
      return; // Si 'documents' está vacío, detiene la ejecución aquí
    }
    this.router.navigateByUrl(
      baseMenu +
        baseMenuDepositaria +
        DEPOSITARY_ROUTES_2[0].link +
        `?origin=juridical-ruling-g&P_VALOR=${
          this.expedientesForm.get('noVolante').value
        }&P_NO_TRAMITE=${this.expedientesForm.get('noExpediente').value}`
    );
  }
  btnParcializar() {
    this.btnVerify();
  }
  btnOficioSubstanciacion() {
    console.log('btnOficioSubstanciacion');
  }
  btnOficioRelacionado() {
    console.log('btnOficioRelacionado');
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
  onDocsSelectValid(instance: DatePickerElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: (data: any) =>
        this.documentSelectedChangeValid(data.row, data.toggle),
    });
  }
  isDocumentSelectedValid(_doc: any) {
    const exists = this.selectedDocuments.find(doc => doc.id == _doc.id);
    return !exists ? false : true;
  }
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
    if (this.goods.length > 0) {
      this.goods.forEach(_g => {
        if (_g.status !== 'STI') {
          _g.status = 'STI';
          _g.name = false;
          let valid = this.goodsValid.some(goodV => goodV == _g);
          if (!valid) {
            this.goodsValid = [...this.goodsValid, _g];
          }
        }
      });
    }
  }
  addSelect() {
    if (this.selectedGooods.length > 0) {
      this.selectedGooods.forEach(good => {
        if (!this.goodsValid.some(v => v === good)) {
          if (good.status.toUpperCase() !== 'STI') {
            let indexGood = this.goods.findIndex(_good => _good == good);
            this.goods[indexGood].status = 'STI';
            this.goodsValid = this.goodsValid.concat(this.selectedGooods);
            // this.goods = this.goods.filter(_good => _good.id != good.id);
          }
        } else {
          // this.alert('error', '', 'El bien ya está seleccionado.');
        }
      });
      // this.selectedGooods = [];
    }
  }
  removeSelect() {
    if (this.selectedGooodsValid.length > 0) {
      // this.goods = this.goods.concat(this.selectedGooodsValid);
      this.selectedGooodsValid.forEach(good => {
        this.goodsValid = this.goodsValid.filter(_good => _good.id != good.id);
        let index = this.goods.findIndex(g => g === good);
        this.goods[index].status = 'ADM';
        this.goods[index].name = false;
        // this.selectedGooods = [];
      });
      this.selectedGooodsValid = [];
    }
  }
  removeAll() {
    if (this.goodsValid.length > 0) {
      this.goodsValid.forEach(good => {
        this.goodsValid = this.goodsValid.filter(_good => _good.id != good.id);
        let index = this.goods.findIndex(g => g === good);
        this.goods[index].status = 'ADM';
        this.goods[index].name = false;
      });
      this.goodsValid = [];
    }
  }

  onSelectedRow(event: any) {
    let obj: IGood = this.goods.find(element => element.id === event.data.id);
    let index: number = this.goods.findIndex(elm => elm === obj);
    console.log(index);
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
    this.resetFields([this.subtype, this.ssubtype, this.sssubtype]);
    this.subtypes = new DefaultSelect();
    this.ssubtypes = new DefaultSelect();
    this.sssubtypes = new DefaultSelect();
    this.subtipoForm.updateValueAndValidity();
    this.goodTypeChange.emit(type);
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
  onLoadGoodList() {
    this.loading = true;
    this.goodServices
      .getByExpedient(
        this.expedientesForm.get('noExpediente').value,
        this.params.getValue()
      )
      .subscribe({
        next: response => {
          this.goods = response.data;
          this.totalItems = response.count || 0;
        },
        error: err => {
          console.log(err);
          this.goods = [];
        },
      });
  }

  selectRow(e: any) {
    if (e) {
      this.idGoodSelected = e.data?.id;
      this.onLoadDocumentsByGood();
    }
    console.log('Información del bien seleccionado', e.data);
  }

  documentsDictumXStateMList: IDocumentsDictumXStateM[] = [];
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  loading2 = this.loading;
  rowsSelected(event: any) {
    const idGood = { ...this.goodData };
    this.totalItems2 = 0;
    this.documentsDictumXStateMList = [];
    this.goodData = event.data;
    console.log('Información del bien seleccionado rowsSelected', event.data);
    this.params2
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDocumentDicXStateM(idGood.id));
  }

  getDocumentDicXStateM(id?: number) {
    this.loading2 = true;
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
      this.alert('info', 'AVISO', 'Bien ya dictaminado');
    } else {
      if (expedient === null || undefined) {
        this.alert('error', 'ERROR', 'Falta seleccionar expediente');
      } else {
        // this.alert('warning', 'PENDIENTE', 'Parcializa la dictaminazión.');}
        Swal.fire('PENDIENTE', 'Parcializa la dictaminazión.', 'warning').then(
          () => {
            this.router.navigate(
              ['/pages/general-processes/goods-partialization'],
              {
                queryParams: {
                  // anterior..
                  // good: this.goodsValid[0].id,
                  // screen: 'FACTJURDICTAMASG',
                  // origin: 'FACTJURDICTAMASG',
                  // ..
                  CLAVE_OFICIO_ARMADA: cveOficio,
                  TIPO: tipo,
                  P_VALOR: noDictaminacion,
                  PAQUETE: '',
                  P_GEST_OK: 1, // ..hardcoded - no llega de la pantalla anterior
                  P_NO_TRAMITE: 1044141, // ..hardcoded - no llega de la pantalla anterior
                  origin: 'FACTJURDICTAMASG',
                },
              }
            );
          }
        );
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

  onTypeDictChange($event: any) {
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

  btnApprove() {
    if (this.documents.length === 0) {
      this.alert('warning', '', 'Debes seleccionar un documento.');
      return; // Si 'documents' está vacío, detiene la ejecución aquí
    }
    let token = this.authService.decodeToken();
    const pNumber = Number(token.department);
    const status =
      this.dictaminacionesForm.get('estatus').value || this.statusDict;
    if (status === 'DICTAMINADO') {
      this.alert('error', '', 'Ya se encuentra dictaminado.');
    } else {
      this.applicationGoodsQueryService.getDictamenSeq(pNumber).subscribe({
        next: (response: any) => {
          this.generateCveOficio(response.dictamenDelregSeq);
          this.cveOficio.nativeElement.focus();
          setTimeout(
            () =>
              Swal.fire(
                '',
                'Clave de oficio generada correctamente.',
                'success'
              ).then(() => {
                let cveOficio = this.dictaminacionesForm.get('cveOficio').value;
                let tipo = this.expedientesForm.get('tipoDictaminacion').value;
                let noDictaminacion =
                  this.expedientesForm.get('noDictaminacion').value;
                let volante = this.dictaminacionesForm.get('wheelNumber').value;
                this.router.navigate(
                  [
                    baseMenu +
                      baseMenuDepositaria +
                      DEPOSITARY_ROUTES_2[0].link,
                  ],
                  {
                    queryParams: {
                      CLAVE_OFICIO_ARMADA: cveOficio,
                      TIPO: tipo,
                      P_VALOR: noDictaminacion,
                      PAQUETE: '',
                      P_GEST_OK: 1, // ..hardcoded - no llega de la pantalla anterior
                      P_NO_TRAMITE: 1044141, // ..hardcoded - no llega de la pantalla anterior
                      origin: 'FACTJURDICTAMASG',
                    },
                  }
                );
              }),
            1000
          );
        },
        error: (err: any) => {
          this.alert('error', '', err);
        },
      });
    }
  }

  generateCveOficio(noDictamen: string) {
    let token = this.authService.decodeToken();
    const year = new Date().getFullYear();
    let cveOficio = '';
    cveOficio =
      token.siglasnivel1 + '/' + token.siglasnivel2 + '/' + token.siglasnivel3;
    cveOficio = cveOficio + '/' + noDictamen + '/' + year;
    this.dictaminacionesForm.get('cveOficio').setValue(cveOficio);
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
}
