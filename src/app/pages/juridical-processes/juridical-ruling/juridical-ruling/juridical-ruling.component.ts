/** BASE IMPORT */
import {
  Component,
  ElementRef,
  EventEmitter,
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
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */
/*Redux NgRX Global Vars Service*/
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, takeUntil, tap, throwError } from 'rxjs';
import { GlobalVarsService } from 'src/app//shared/global-vars/services/global-vars.service';
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
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { POSITVE_NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DatePickerElementComponent } from 'src/app/shared/components/datepicker-element-smarttable/datepicker.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { environment } from 'src/environments/environment';
import { GoodSubtype } from '../../juridical-ruling-g/juridical-ruling-g/model/good.model';
import { RDictaminaDocModalComponent } from '../../juridical-ruling-g/r-dictamina-doc-modal/r-dictamina-doc-modal.component';
/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

@Component({
  selector: 'app-juridical-ruling',
  templateUrl: './juridical-ruling.component.html',
  styleUrls: ['./juridical-ruling.component.scss'],
})
export class JuridicalRulingComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  params = new BehaviorSubject<ListParams>(new ListParams());
  expedientesForm: FormGroup;
  selectedGooods: IGood[] = [];
  selectedGooodsValid: IGood[] = [];
  goods: IGood[] | any[] = [];
  goodsValid: IGood[] = [];
  idGoodSelected = 0;
  statusDict: string = undefined;
  dictNumber: string | number = undefined;
  wheelNumber: string | number = undefined;
  delegationDictNumber: string | number = undefined;
  keyArmyNumber: string | number = undefined;
  public buttonDisabled: boolean = false;
  public buttonDeleteDisabled: boolean = true;
  @ViewChild('cveOficio', { static: true }) cveOficio: ElementRef;

  //tipos
  types = new DefaultSelect<Partial<IGoodType>>();
  subtypes = new DefaultSelect();
  ssubtypes = new DefaultSelect();
  sssubtypes = new DefaultSelect();

  typesDict = new DefaultSelect([
    { id: 'DESTRUCCION', typeDict: 'DESTRUCCION' },
  ]);

  typeField: string = 'type';
  subtypeField: string = 'subtype';
  ssubtypeField: string = 'ssubtype';
  sssubtypeField: string = 'sssubtype';

  goodTypeChange = new EventEmitter<IGoodType>();
  goodSubtypeChange = new EventEmitter<IGoodSubType>();
  goodSsubtypeChange = new EventEmitter<IGoodsSubtype>();
  goodSssubtypeChange = new EventEmitter<IGoodSssubtype>();

  data4: IDocuments[] = [];
  documents: IDocuments[] = [];
  selectedDocuments: IDocuments[] = [];

  totalItems: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;

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
      extDomProcess: {
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
      extDomProcess: {
        title: 'Proceso',
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
      id: {
        title: '#',
        type: 'number',
      },
      descriptionDocument: {
        title: 'Documentos',
        type: 'string',
      },
      selectedDate: {
        title: 'Fecha',
        sort: false,
        type: 'custom',
        showAlways: true,
        valuePrepareFunction: (bsValue: Date, row: IDocuments) =>
          this.isDocumentSelectedValid(row),
        renderComponent: DatePickerElementComponent,
        onComponentInitFunction: (instance: DatePickerElementComponent) =>
          this.onDocsSelectValid(instance),
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };

  legalForm: FormGroup;
  subtipoForm: FormGroup;
  /*Redux NgRX Global Vars Model*/
  /*Redux NgRX Global Vars Model*/
  globalVars: IGlobalVars;
  public listadoDocumentos: boolean = false;

  activeRadio: boolean = true;
  hideForm: boolean = false;
  label: string = '';
  maxDate = new Date();
  users$ = new DefaultSelect<ISegUsers>();
  isIdent: boolean = true;
  typesClass = new DefaultSelect<Partial<GoodSubtype>>();
  typesIdent = new DefaultSelect<Partial<{ identificador: string }>>();
  desc_estatus_good: string = '';
  isSearch: boolean = false;
  variablesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: GoodTypeService,
    private globalVarsService: GlobalVarsService,
    private readonly goodServices: GoodService,
    private goodSubtypesService: GoodSubtypeService,
    private goodSssubtypeService: GoodSssubtypeService,
    private readonly documentService: DocumentsService,
    private goodSsubtypeService: GoodSsubtypeService,
    private readonly expedientServices: ExpedientService,
    private readonly authService: AuthService,
    private applicationGoodsQueryService: ApplicationGoodsQueryService,
    private readonly router: Router,
    private usersService: UsersService,
    private serviceGood: GoodProcessService,
    private dictationServ: DictationService,
    private notServ: NotificationService,
    private modalService: BsModalService
  ) {
    super();
  }

  consulta1() {
    const body = {
      cve_forma: 'FACTJURDICTAMAS',
      tipo_dicta: this.legalForm.get('tipoDictaminacion').value,
      no_expediente: this.legalForm.get('noExpediente').value,
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
  }

  consulta2() {
    const body2 = {
      cve_forma: 'FACTJURDICTAMAS',
      tipo_dicta: this.legalForm.get('tipoDictaminacion').value,
      no_expediente: this.legalForm.get('noExpediente').value,
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
  }

  clearSearch() {
    this.resetALL();
    this.legalForm.reset();
    this.legalForm.get('tipoDictaminacion').patchValue('DESTRUCCION');
    this.legalForm.get('tipo').patchValue('N');
    this.legalForm.get('fecDicta').patchValue(new Date());
    this.goods = [];
    this.goodsValid = [];
    this.isSearch = false;
    this.isIdent = false;
  }

  searchExp() {
    const { noExpediente, preliminaryInquiry, criminalCase } =
      this.legalForm.value;
    if (!noExpediente && !preliminaryInquiry && !criminalCase) return;
    this.isSearch = true;
    this.onLoadExpedientData();
    this.onLoadDictationInfo();
    const { tipoDictaminacion, subtype } = this.subtipoForm.value;

    if (tipoDictaminacion == 0 || !subtype) {
      this.params.getValue().page = 1;
      this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
        this.goodServices
          .getByExpedient(noExpediente, this.params.getValue())
          .subscribe({
            next: resp => {
              this.consulta1();
              this.consulta2();

              const data = resp.data;

              data.map(async (good: any) => {
                good.di_disponible = 'S';
                await new Promise((resolve, reject) => {
                  const body = {
                    no_bien: good.goodId,
                    estatus: good.status,
                    tipo_dicta: this.legalForm.get('tipoDictaminacion').value,
                    identificador: good.identifier,
                    vc_pantalla: 'FACTJURDICTAMAS',
                    proceso_ext_dom: good.extDomProcess,
                    sel_paq: this.legalForm.get('tipo').value,
                  };

                  this.dictationServ.checkGoodAvaliable(body).subscribe({
                    next: state => {
                      good.est_disponible = state.est_disponible;
                      good.v_amp = state.v_amp ? state.v_amp : null;
                      good.pDiDescStatus = state.pDiDescStatus;
                      this.desc_estatus_good = state.pDiDescStatus ?? '';
                    },
                    error: () => {
                      resolve(null);
                    },
                  });
                });
              });

              this.goods = data;
              this.totalItems = resp.count || 0;
            },
            error: err => {
              console.log(err);
            },
          });
      });
    } else {
    }
  }

  getUsers($params: ListParams) {
    let params = new FilterParams();
    params.page = $params.page;
    params.limit = $params.limit;
    const area = this.legalForm.controls['autoriza_remitente'].value;
    params.search = $params.text;
    this.getAllUsers(params).subscribe();
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
    this.legalForm.get('autoriza_nombre').setValue(user.name);
  }

  //Cosas viejas

  ngOnInit(): void {
    this.prepareForm();
    this.loading = true;
    this.globalVarsService
      .getGlobalVars$()
      .subscribe((globalVars: IGlobalVars) => {
        this.globalVars = globalVars;
        console.log(globalVars);
      });
    //this.getParams();
  }

  getParams() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.legalForm.get('noExpediente').setValue(params?.expediente);
      this.legalForm.get('tipoDictaminacion').setValue(params?.tipoDic);
      this.legalForm.get('tipoDictaminacion').setValue(params?.tipoDic);
      this.subtipoForm.get('tipoDictaminacion').setValue(params?.tipoDic);
    });
    // this.activatedRoute.queryParams
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(params => {
    //     this.legalForm
    //       .get('noExpediente')
    //       .setValue(
    //         params['noExpediente'] ? Number(params['noExpediente']) : undefined
    //       );
    //   });
    this.changeNumExpediente();
  }

  onKeyPress($event: any) {
    if ($event.key === 'Enter') $event.currentTarget.blur();
  }

  changeNumExpediente() {
    this.onLoadGoodList();
    this.onLoadExpedientData();
    this.onLoadDictationInfo();
    this.resetALL();
  }

  resetALL() {
    this.selectedDocuments = [];
    this.selectedGooods = [];
    this.selectedGooodsValid = [];
    this.goodsValid = [];
    this.data4 = [];
  }

  onLoadExpedientData() {
    let noExpediente = this.legalForm.get('noExpediente').value || '';
    this.expedientServices.getById(noExpediente).subscribe({
      next: response => {
        // ..Datos del expediente
        this.legalForm.get('criminalCase').setValue(response.criminalCase);
        this.legalForm
          .get('preliminaryInquiry')
          .setValue(response.preliminaryInquiry);
      },
    });
  }

  /**
   * Trae información de dictamen
   * según # de expediente
   */
  onLoadDictationInfo() {
    let noExpediente = this.legalForm.get('noExpediente').value || '';
    this.loadExpedientInfo(noExpediente).then(({ json }) => {
      json
        .then(res => {
          this.dictNumber = res.data[0].id;
          this.wheelNumber = res.data[0].wheelNumber;
          this.delegationDictNumber = res.data[0].delegationDictNumber;
          this.legalForm
            .get('tipoDictaminacion')
            .setValue(res.data[0].typeDict || undefined);
          this.legalForm
            .get('fecDicta')
            .setValue(new Date(res.data[0].dictDate) || undefined);
          this.legalForm
            .get('observations')
            .setValue(res.data[0].observations || undefined);
          this.keyArmyNumber = res.data[0].keyArmyNumber;
          this.statusDict = res.data[0].statusDict;
          this.legalForm
            .get('label')
            .setValue(new Date(res.data[0].instructorDate) || undefined);
          this.legalForm.get('cveOficio').setValue(res.data[0].passOfficeArmy);
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
          // this.legalForm.get('tipoDictaminacion').setValue(null);
          // this.legalForm.get('cveOficio').setValue(null);
          // this.legalForm.get('observations').setValue(null);
          // this.legalForm.get('fecDicta').setValue(null);
          // this.legalForm.get('label').setValue(null);
          // this.keyArmyNumber = undefined;
          // this.statusDict = undefined;
        });
    });
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

  onLoadGoodList() {
    let noExpediente = this.legalForm.get('noExpediente').value || '';
    if (noExpediente !== '') {
      this.goodServices
        .getByExpedient(noExpediente, this.params.getValue())
        .subscribe({
          next: response => {
            const data = response.data;

            data.map(async (good: any) => {
              good.di_disponible = 'S';
              await new Promise((resolve, reject) => {
                const body = {
                  no_bien: good.goodId,
                  estatus: good.status,
                  tipo_dicta: this.legalForm.get('tipoDictaminacion').value,
                  identificador: good.identifier,
                  vc_pantalla: 'FACTJURDICTAMAS',
                  proceso_ext_dom: good.extDomProcess,
                  sel_paq: this.legalForm.get('tipo').value,
                };

                this.dictationServ.checkGoodAvaliable(body).subscribe({
                  next: state => {
                    good.est_disponible = state.est_disponible;
                    good.v_amp = state.v_amp ? state.v_amp : null;
                    good.pDiDescStatus = state.pDiDescStatus;
                    this.desc_estatus_good = state.pDiDescStatus ?? '';
                  },
                  error: () => {
                    resolve(null);
                  },
                });
              });
            });

            this.goods = data;
            this.totalItems2 = response.count || 0;
          },
          error: err => {
            console.log(err);
            this.goods = [];
          },
        });
    }
  }

  prepareForm() {
    this.legalForm = this.fb.group({
      tipoDictaminacion: [null, [Validators.required]],
      noExpediente: [
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(11),
        ],
      ],
      // averPrevia: [null, [Validators.pattern(KEYGENERATION_PATTERN)]], // Se cambia por preliminaryInquiry (según doc)
      preliminaryInquiry: [null, [Validators.pattern(KEYGENERATION_PATTERN)]],
      // causaPenal: [null, [Validators.pattern(STRING_PATTERN)]], // Se cambia por CriminalCase (según doc)
      criminalCase: [null, [Validators.pattern(STRING_PATTERN)]],
      tipo: [null],
      esPropiedad: [false],
      // observaciones: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
      fecDest: [null, [Validators.required]],
      fecRes: [null, [Validators.required]],
      fecNotiAse: [null, [Validators.required]],
      fecNoti: [null, [Validators.required]],
      fecDicta: [new Date()],
      autoriza: [null, [Validators.required]],
      cveOficio: [null, [Validators.required]],
      identifier: [null],
      tipos: [null],
      fechaPPFF: [null],
      autoriza_remitente: [null],
      type: [null],
    });
    this.subtipoForm = this.fb.group({
      tipoDictaminacion: [null],
      type: [null, [Validators.required]],
      subtype: [null, [Validators.required]],
      ssubtype: [null, [Validators.required]],
      sssubtype: [null, [Validators.required]],
      attrib: [
        { value: null, disabled: true },
        Validators.pattern(NUMBERS_PATTERN),
      ],
    });

    this.variablesForm = this.fb.group({
      tipo_vol: [null],
      clasif2: [null],
      clsif: [null],
    });
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
    if (type.no_clasif_bien == 0) {
      this.onLoadGoodList();
    } else {
      const filter = new FilterParams();
      const { noExpediente } = this.legalForm.value;

      filter.addFilter('goodClassNumber', type.no_clasif_bien, SearchFilter.EQ);
      filter.addFilter('fileNumber', noExpediente, SearchFilter.EQ);

      this.goodServices.getAllFilter(filter.getParams()).subscribe({
        next: response => {
          const data = response.data;

          data.map(async (good: any) => {
            good.di_disponible = 'S';
            await new Promise((resolve, reject) => {
              const body = {
                no_bien: good.goodId,
                estatus: good.status,
                tipo_dicta: this.legalForm.get('tipoDictaminacion').value,
                identificador: good.identifier,
                vc_pantalla: 'FACTJURDICTAMAS',
                proceso_ext_dom: good.extDomProcess,
                sel_paq: this.legalForm.get('tipo').value,
              };

              this.dictationServ.checkGoodAvaliable(body).subscribe({
                next: state => {
                  good.est_disponible = state.est_disponible;
                  good.v_amp = state.v_amp ? state.v_amp : null;
                  good.pDiDescStatus = state.pDiDescStatus;
                  this.desc_estatus_good = state.pDiDescStatus ?? '';
                },
                error: () => {
                  resolve(null);
                },
              });
            });
          });

          this.goods = data;
          this.totalItems3 = response.count || 0;

          // data.map(async (good: any) => {
          //   good.di_disponible = 'S';
          //   const resp = await new Promise((resolve, reject) => {
          //     const body = {
          //       pGoodNumber: good.goodId,
          //       pClasifGoodNumber: good.goodClassNumber,
          //       pStatus: good.status,
          //       pTypeDicta: this.expedientesForm.get('tipoDictaminacion').value,
          //       pLBTypesDicta:
          //         this.expedientesForm.get('tipoDictaminacion').value,
          //       pIdentity: good.identifier,
          //       pVcScreem: 'FACTJURDICTAMASG',
          //       pDiDescStatus: good.estatus
          //         ? good.estatus.descriptionStatus
          //         : '',
          //       pProccessExtDom: good.extDomProcess,
          //     };

          //     this.screenServ.getStatusCheck(body).subscribe({
          //       next: state => {
          //         good.est_disponible = state.EST_DISPONIBLE;
          //         good.v_amp = state.v_amp ? state.v_amp : null;
          //         good.pDiDescStatus = state.pDiDescStatus;
          //         this.desc_estatus_good = state.pDiDescStatus;
          //         resolve(state);
          //       },
          //       error: () => {
          //         resolve(null);
          //         console.log('fallo');
          //       },
          //     });
          //   });
          // });

          //this.totalItems = response.count || 0;
        },
      });
    }
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field.setValue(null);
    });
    this.subtipoForm.updateValueAndValidity();
  }

  /**
   * Traer descripción dictaminada por bien
   * @param id del bien
   */
  async getDicDescriptionByGood(id: number) {
    const response = await fetch(
      `${environment.API_URL}dictation/api/v1/dictation-x-good1/find-by-ids`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: id }),
      }
    );
    return { status: response.status, json: response.json() };
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

  isGoodSelected(_good: IGood) {
    const exists = this.selectedGooods.find(good => good.id == _good.id);
    return !exists ? false : true;
  }
  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
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

  isGoodSelectedValid(_good: IGood) {
    const exists = this.selectedGooodsValid.find(good => good.id == _good.id);
    return !exists ? false : true;
  }

  onGoodSelectValid(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChangeValid(data.row, data.toggle),
    });
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

  addSelect() {
    if (this.statusDict == 'DICTAMINADO' || this.statusDict == 'IMPROCEDENTE') {
      this.onLoadToast(
        'error',
        'Este dictamen ya tiene un estatus DICTAMINADO'
      );
      return;
    }

    if (this.legalForm.get('identifier').value) {
      this.isIdent = false;
    }

    if (!this.legalForm.get('autoriza_remitente').value) {
      this.onLoadToast('error', 'Debe especificar quien autoriza dictamen');
      return;
    }

    if (this.legalForm.get('type').value == null) {
      this.onLoadToast('error', 'Debe seleccionar un tipo de bien');
      return;
    }

    if (!this.legalForm.get('identifier').value) {
      this.onLoadToast('error', 'Debe seleccionar un identificador');
      return;
    }

    if (!this.legalForm.get('fechaPPFF').value) {
      this.onLoadToast('error', `Debe capturar la ${this.label}`);
      return;
    }

    if (this.selectedGooods.length > 0) {
      this.selectedGooods.forEach((good: any) => {
        if (!this.goodsValid.some(v => v === good)) {
          if (
            (this.legalForm.get('type').value == 0 ||
              this.legalForm.get('type').value == good.goodClassNumber) &&
            this.legalForm.get('identifier').value ==
              good.identifier.substr(0, 1) &&
            good.di_disponible != 'N'
          ) {
            let indexGood = this.goods.findIndex(_good => _good == good);
            this.goods[indexGood].est_disponible = 'N';
            this.goods[indexGood].di_disponible = 'N';
            this.goodsValid.push(good);
            this.goodsValid = [...this.goodsValid];
          } else {
            this.onLoadToast(
              'error',
              'El bien no tiene el mismo tipo de bien o el identificador no es el mismo que selecciono o ya esta dictaminado'
            );
          }
        } else {
          if (good.di_disponible == 'N') {
            this.onLoadToast('error', `El bien ${good.goodId} ya existe`);
            return;
          }

          if (good.est_disponible == 'N') {
            this.onLoadToast(
              'error',
              `El bien ${good.goodId} tiene un estatus invalido para ser dictaminado o ya esta dictaminado`
            );
            return;
          }
        }
      });
    }
  }

  addAll() {
    if (!this.legalForm.get('identifier').value) {
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

    if (this.legalForm.get('identifier').value) {
      this.isIdent = false;
    }

    if (!this.legalForm.get('autoriza_remitente').value) {
      this.onLoadToast('error', 'Debe especificar quien autoriza dictamen');
      return;
    }

    if (this.legalForm.get('type').value == null) {
      this.onLoadToast('error', 'Debe seleccionar un tipo de bien');
      return;
    }

    if (!this.legalForm.get('fechaPPFF').value) {
      this.onLoadToast('error', `Debe capturar la ${this.label}`);
      return;
    }

    if (this.goods.length > 0) {
      this.goods.forEach(_g => {
        if (_g.est_disponible == 'S' && _g.di_disponible == 'S') {
          if (
            (this.legalForm.get('type').value == 0 ||
              this.legalForm.get('type').value == _g.goodClassNumber) &&
            this.legalForm.get('identifier').value == _g.identifier.substr(0, 1)
          ) {
            _g.est_disponible = 'N';
            _g.di_disponible = 'N';
            _g.name = false;
            let valid = this.goodsValid.some(goodV => goodV == _g);
            if (!valid) {
              this.goodsValid = [...this.goodsValid, _g];
            }
          }
        }
      });
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

  rowSelected(e: any) {
    if (e) {
      this.idGoodSelected = e.data?.id;
      this.onLoadDocumentsByGood();
    }
  }

  /** --
   * DOCUMENTOS
   * --
   */
  btnDocumentos() {
    this.variablesForm.get('tipo_vol').setValue('');
    let tipo_vol = '';
    let dicta = '';
    let classif = '';
    const { noExpediente } = this.legalForm.value;
    const params = new FilterParams();
    params.addFilter('wheelNumber', noExpediente, SearchFilter.EQ);
    this.notServ.getAllFilter(params.getParams()).subscribe({
      next: resp => {
        this.variablesForm.get('tipo_vol').patchValue(resp.data[0].wheelType);
        if (!this.legalForm.get('esPropiedad').value) {
          dicta = 'N';
        } else {
          dicta = this.legalForm.get('esPropiedad').value;
        }

        if (!this.legalForm.get('fechaPPFF')) {
          this.onLoadToast('error', `Debe especificar la ${this.label}`);
          return;
        }
        classif = null;

        const typeDictation = this.legalForm.get('tipoDictaminacion').value;
        const crime = this.legalForm.get('esPropiedad').value ?? 'N';
        const typeSteeringwheel = this.variablesForm.get('tipo_vol').value;
        const numberClassifyGood = 1206;
        const stateNumber = this.idGoodSelected;
        let config: ModalOptions = {
          initialState: {
            // numberClassifyGood,
            typeDictation,
            crime,
            typeSteeringwheel,
            numberClassifyGood,
            stateNumber,
            callback: (next: boolean) => {
              /*if (next) {
                
              }*/
            },
          },
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        this.modalService.show(RDictaminaDocModalComponent, config);
      },
      error: () => {},
    });
  }

  onLoadDocumentsByGood() {
    this.documentService.getByGood(this.idGoodSelected).subscribe({
      next: response => {
        this.data4 = response.data;
      },
      error: err => {
        console.log(err);
        this.goods = [];
      },
    });
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
      // this.selectedDocuments.find(v => console.log(v));
      // this.documents = this.documents.concat(this.selectedDocuments);
      // this.selectedDocuments.forEach(doc => {
      //   this.goods = this.goods.filter(_doc => _doc.id != doc.id);
      // });
      this.selectedDocuments = [];
    } else {
      this.alert(
        'info',
        '',
        'Debes seleccionar la fecha de un documento para continuar.'
      );
    }
  }
  isDocumentSelectedValid(_doc: any) {
    const exists = this.selectedDocuments.find(doc => doc.id == _doc.id);
    return !exists ? false : true;
  }

  onDocsSelectValid(instance: DatePickerElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: (data: any) =>
        this.documentSelectedChangeValid(data.row, data.toggle),
    });
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

  isDocsEmpty() {
    return this.documents.length === 0;
  }

  btnApprove() {
    let token = this.authService.decodeToken();
    const pNumber = Number(token.department);
    this.applicationGoodsQueryService.getDictamenSeq(pNumber).subscribe({
      next: (response: any) => {
        this.generateCveOficio(response.dictamenDelregSeq);
        // document.getElementById('cveOficio').focus();
        this.cveOficio.nativeElement.focus();
        setTimeout(
          () =>
            this.alert(
              'success',
              '',
              'Clave de oficio generada correctamente.'
            ),
          1000
        );
      },
    });
  }

  generateCveOficio(noDictamen: string) {
    let token = this.authService.decodeToken();
    const year = new Date().getFullYear();
    let cveOficio = '';
    cveOficio =
      token.siglasnivel1 + '/' + token.siglasnivel2 + '/' + token.siglasnivel3;
    // if (token.siglasnivel4 !== null) {
    //   cveOficio = cveOficio + '/' + token.siglasnivel4;
    // }
    cveOficio = cveOficio + '/' + noDictamen + '/' + year;
    this.legalForm.get('cveOficio').setValue(cveOficio);
  }

  btnVerify() {
    if (this.statusDict == 'DICTAMINADO') {
      this.onLoadToast('error', 'Bien ya dictaminado');
    } else {
      if (!this.legalForm.get('noExpediente').value) {
        this.onLoadToast('error', 'Falta seleccionar expediente');
      } else {
        //Manda a llamar a FACTGENPARCIALIZA
        this.router.navigate(['pages/general-processes/goods-partialization'], {
          queryParams: {
            good: this.idGoodSelected,
            screen: 'FACTJURDICTAMAS',
          },
        });
      }
    }

    // const status = this.statusDict;
    // const expedient = this.legalForm.get('noExpediente').value;
    // if (status === 'DICTAMINADO') {
    //   this.alert('info', 'AVISO', 'Bien ya dictaminado');
    // } else {
    //   if (expedient === null || undefined) {
    //     this.alert('error', 'ERROR', 'Falta seleccionar expediente');
    //   } else {
    //     // this.alert('warning', 'PENDIENTE', 'Parcializa la dictaminazión.');}
    //     Swal.fire('PENDIENTE', 'Parcializa la dictaminazión.', 'warning').then(
    //       () => {
    //         window.location.replace(
    //           '/pages/general-processes/goods-partialization'
    //         );
    //       }
    //     );
    //   }
    // }
  }

  btnDeleteDictation() {
    let token = this.authService.decodeToken();

    const object = {
      proceedingsNumber: this.legalForm.get('noExpediente').value,
      typeDicta: this.legalForm.get('tipoDictaminacion').value,
      numberOfDicta: this.dictNumber,
      wheelNumber: this.wheelNumber,
      user: token.preferred_username,
      delegationNumberDictam: this.delegationDictNumber,
      clueJobNavy: this.keyArmyNumber, // -- keyArmyNumber
      judgmentDate: this.legalForm.get('fecDicta').value, // -- entryDate
      statusJudgment: this.statusDict, // -- statusDict
      typeJudgment: this.legalForm.get('tipoDictaminacion').value, // -- typeDict
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

  btnDeleteListDocs() {
    this.documents = [];
    this.selectedDocuments = [];
  }

  onTypeDictChange({ id }: any) {
    if (id) {
      if (id == 'DESTRUCCION') {
        this.activeRadio = true;
        this.hideForm = true;
        this.label = 'Fec. Dest.';
      }
    }
  }

  btnCloseDocs() {
    this.listadoDocumentos = false;
  }

  CLAVE_OFICIO_ARMADA: any;
  P_GEST_OK: any;
  CONSULTA: any;
  VOLANTE: any;
  EXPEDIENTE: any;
  TIPO_DICT: any;
  TIPO_VO: any;
  P_NO_TRAMITE: any;

  // IMPRESIONES - BUTTON //
  btnImprimeOficio() {
    this.router.navigate(
      ['/pages/juridical/depositary/legal-opinions-office/'],
      {
        queryParams: {
          origin: 'FACTGENACTDATEX', //Cambiar
          P_VALOR: this.dictNumber,
          TIPO: this.legalForm.get('tipoDictaminacion').value,
          PAQUETE: "this.expedientesForm.get('tipoDictaminacion').value",
        },
      }
    );
  }

  btnRefuse() {
    console.log('btnRechazar');
  }
}
