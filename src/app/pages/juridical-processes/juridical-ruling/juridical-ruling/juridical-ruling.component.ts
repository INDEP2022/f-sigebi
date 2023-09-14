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
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, takeUntil, tap, throwError } from 'rxjs';
import { GlobalVarsService } from 'src/app//shared/global-vars/services/global-vars.service';
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
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { POSITVE_NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DatePickerElementComponent } from 'src/app/shared/components/datepicker-element-smarttable/datepicker.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { GoodSubtype } from '../../juridical-ruling-g/juridical-ruling-g/model/good.model';
import { ListdictumsComponent } from '../listdictums/listdictums.component';
import { RDictaminaDocModalComponent } from '../r-dictamina-doc-modal/r-dictamina-doc-modal.component';
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
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  filter2 = new BehaviorSubject<FilterParams>(new FilterParams());

  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());

  expedientesForm: FormGroup;
  selectedGooods: IGood[] = [];
  selectedGooodsValid: IGood[] = [];
  goods: IGood[] | any[] = [];
  goodsValid: IGood[] = [];
  idGoodSelected: any;
  statusDict: string = undefined;
  dictNumber: string | number = undefined;
  wheelNumber: string | number = undefined;
  delegationDictNumber: string | number = undefined;
  keyArmyNumber: string | number = undefined;
  public buttonDisabled: boolean = false;
  public buttonDeleteDisabled: boolean = true;
  @ViewChild('cveOficio', { static: true }) cveOficio: ElementRef;
  loadingAppro: boolean = false;

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
  documents_m1: any[] = [];
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

        sort: false,
      },
      description: {
        title: 'Descripción',
        type: 'string',
        sort: false,
      },
      quantity: {
        title: 'Cantidad',
        type: 'string',
        sort: false,
      },
      identifier: {
        title: 'Ident.',
        type: 'string',
        sort: false,
      },
      status: {
        title: 'Estatus',
        type: 'string',
        sort: false,
      },
      extDomProcess: {
        title: 'Proceso',
        type: 'string',
        sort: false,
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
        sort: false,
      },
      description: {
        title: 'Descripción Dictaminación',
        type: 'string',
        sort: false,
      },
      menaje: {
        title: 'Menaje',
        type: 'string',
        sort: false,
        valuePrepareFunction: (value: any) => {
          return value?.noGood;
        },
      },
      quantity: {
        title: 'Cant. Dictaminación',
        type: 'string',
        sort: false,
      },
      status: {
        title: 'Estatus',
        type: 'string',
        sort: false,
      },
      extDomProcess: {
        title: 'Proceso',
        type: 'string',
        sort: false,
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
      k: {
        title: 'Cve. Documento',
        sort: false,
        type: 'string',
      },
      d: {
        title: 'Descripción',
        sort: false,
        // valuePrepareFunction: (cell: any, value: any) => {
        //   return value.documentDetails.description;
        // },
      },
      date: {
        title: 'Fecha Recibido',
        sort: false,
        type: 'string',
        valuePrepareFunction: (row: any) => {
          return row.split('-').reverse().join('/');
        },
      },
    },

    rowClassFunction: (row: any) => {
      return 'bg-info text-white';
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
  isDisabledExp: boolean = false;
  variablesForm: FormGroup;
  formOficio: FormGroup;
  buttonRefuse: boolean = true;
  buttonAprove: boolean = true;
  di_desc_est: string = '';
  dictationForm: FormGroup;
  isDelit: boolean = true;
  dictantion: any;
  moreDictation: boolean = false;
  typeDictation: string;
  user_dicta: string;
  isExp: boolean = true;
  oficioDictamen: any;
  goodSelect: any;
  formLoading: boolean;
  loadingDic: boolean = false;
  origin: string = '';

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
    private modalService: BsModalService,
    private parametersService: ParametersService,
    private segAcessXAreasService: SegAcessXAreasService,
    private segUser: UsersService,
    private departamentService: DepartamentService,
    private oficialDictationService: OficialDictationService,
    private documentsMServ: DocumentsDictumStatetMService,
    private DictationXGood1Service: DictationXGood1Service,
    private datePipe: DatePipe,
    private userDetail: UsersService
  ) {
    super();
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

  back() {
    if (this.origin == 'FCONGENRASTREADOR') {
      this.router.navigate(['pages/general-processes/goods-tracker']);
    }
  }

  async saveDataForm() {
    const { fechaPPFF, tipoDictaminacion, autoriza_remitente } =
      this.legalForm.value;
    let fecha = new Date(fechaPPFF);

    // Restar un día
    fecha.setDate(fecha.getDate() - 1);

    // Imprimir la fecha resultante
    console.log(fecha.toString());
    let obj = {
      id: this.dictNumber,
      typeDict: tipoDictaminacion,
      instructorDate: fecha.toString(),
    };
    console.log(obj);
    await this.updateDictamen(obj);

    let sender_ = autoriza_remitente.id;
    this.oficioDictamen.sender = sender_;
    let obj1 = {
      sender: sender_,
      typeDict: this.oficioDictamen.typeDict,
      officialNumber: this.oficioDictamen.officialNumber,
    };

    await this.updateOficioDictamen(obj1);
  }

  async updateOficioDictamen(body: any) {
    this.dictationServ.updateOfficialDictation(body).subscribe({
      next: (data: any) => {
        //  this.alert('success', 'Oficio Dictamen actualizado correctamente', '');
      },
      error: error => {},
    });
  }

  async updateDictamen(obj: any) {
    this.dictationServ.update(obj).subscribe({
      next: async (response: any) => {
        this.alert('success', 'Dictamen actualizado correctamente', '');
      },
      error: (err: any) => {},
    });
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
    this.dictationForm.reset();
    this.variablesForm.reset();
    this.formOficio.reset();
    this.goods = [];
    this.goodsValid = [];
    this.documents_m1 = [];
    this.documents = [];
    this.buttonAprove = true;
    this.isIdent = true;
    this.isDisabledExp = false;
    this.statusDict = '';
    this.dictNumber = null;
    this.totalItems2 = 0;

    this.onTypeDictChange({ id: 'DESTRUCCION' });
  }

  loadGoodsPipe() {
    this.formLoading = true;
    const { noExpediente } = this.legalForm.value;
    this.goodServices
      .getByExpedient(noExpediente, this.params.getValue())
      .subscribe({
        next: resp => {
          const data = resp.data;
          this.formLoading = false;
          data.map(async (good: any, index) => {
            if (index == 0) this.di_desc_est = good.estatus.descriptionStatus;
            good.di_disponible = 'S';
            await new Promise((resolve, reject) => {
              const body = {
                no_bien: good.id,
                estatus: good.status,
                tipo_dicta: this.legalForm.get('tipoDictaminacion').value,
                identificador: good.identifier,
                vc_pantalla: 'FACTJURDICTAMAS',
                proceso_ext_dom: good.extDomProcess ?? '',
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

          //this.onLoadDictationInfo();
        },
        error: err => {
          this.formLoading = false;
          console.log(err);
        },
      });
  }

  searchExp() {
    const {
      noExpediente,
      preliminaryInquiry,
      criminalCase,
      tipoDictaminacion,
    } = this.legalForm.value;
    if (!noExpediente && !preliminaryInquiry && !criminalCase) return;
    this.isSearch = true;
    this.isDisabledExp = true;
    this.onLoadExpedientData();

    this.params.getValue().page = 1;

    this.formLoading = true;
    this.goodServices
      .getByExpedient(noExpediente, this.params.getValue())
      .subscribe({
        next: resp => {
          const data = resp.data;

          this.formLoading = false;
          data.map(async (good: any, index) => {
            if (index == 0) this.di_desc_est = good.estatus.descriptionStatus;
            good.di_disponible = 'S';
            await new Promise((resolve, reject) => {
              const body = {
                no_bien: good.id,
                estatus: good.status,
                tipo_dicta: tipoDictaminacion,
                identificador: good.identifier,
                vc_pantalla: 'FACTJURDICTAMAS',
                proceso_ext_dom: good.extDomProcess ?? '',
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
                  this.formLoading = false;
                  resolve(null);
                },
              });
            });
          });

          this.goods = data;
          this.totalItems = resp.count || 0;

          this.onLoadDictationInfo();
        },
        error: err => {
          console.log(err);
        },
      });

    // this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {

    // });
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
        if (response.count > 0) {
          const name = this.legalForm.get('autoriza_remitente').value;
          const data = response.data.filter(m => m.id == name);
          console.log(data);
          this.legalForm.get('autoriza_remitente').patchValue(data[0]);
        }
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
    this.getParams();

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.goods.length > 0) {
        this.loadGoodsPipe();
      }
    });

    this.filter1.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.goods.length > 0) {
        this.onLoadWithClass();
      }
    });

    this.filter2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (this.totalItems2) this.getDicXGood();
    });
  }

  getParams() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        this.origin = params.origin ?? '';
        if (params?.NO_EXP) {
          this.legalForm.get('noExpediente').patchValue(params.NO_EXP);
          this.legalForm.get('tipoDictaminacion').setValue('DESTRUCCION');
          this.legalForm.get('tipo').setValue('N');
          this.legalForm.get('fecDicta').setValue(new Date());
          this.onTypeDictChange({ id: 'DESTRUCCION' });
          this.changeNumExpediente();
        }
        //this.legalForm.get('noExpediente').setValue(params?.expediente);
        //this.legalForm.get('tipoDictaminacion').setValue(params?.tipoDic);
        //this.legalForm.get('tipoDictaminacion').setValue(params?.tipoDic);
        //this.subtipoForm.get('tipoDictaminacion').setValue(params?.tipoDic);
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
  }

  onKeyPress($event: any) {
    if ($event.key === 'Enter') $event.currentTarget.blur();
  }

  changeNumExpediente() {
    this.onLoadExpedientData();
    this.onLoadGoodList();
    this.onLoadDictationInfo();
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
        this.isDisabledExp = true;
        this.legalForm.get('criminalCase').setValue(response.criminalCase);
        this.legalForm
          .get('preliminaryInquiry')
          .setValue(response.preliminaryInquiry);
      },
    });

    this.consulta1();
    this.consulta2();
  }

  /**
   * Trae información de dictamen
   * según # de expediente
   */
  onLoadDictationInfo(id?: number) {
    let noExpediente = this.legalForm.get('noExpediente').value || '';

    const params = new FilterParams();
    params.addFilter('expedientNumber', noExpediente, SearchFilter.EQ);
    params.addFilter('typeDict', 'DESTRUCCION', SearchFilter.EQ);

    if (id) {
      params.addFilter('id', id, SearchFilter.EQ);
    }

    this.dictationServ.getAllWithFilters(params.getParams()).subscribe({
      next: async res => {
        if (res.count > 0) this.moreDictation = true;
        this.dictNumber = res.data[0].id;
        this.wheelNumber = res.data[0].wheelNumber;
        this.delegationDictNumber = res.data[0].delegationDictNumber;
        this.typeDictation = res.data[0].typeDict;
        this.user_dicta = res.data[0].userDict;
        // this.legalForm
        //   .get('tipoDictaminacion')
        //   .setValue(res.data[0].typeDict || undefined);
        const date = res.data[0].dictDate
          ? new Date(String(res.data[0].dictDate).split('-').join('/'))
          : '';
        this.legalForm.get('fecDicta').setValue(date);
        this.legalForm
          .get('observations')
          .setValue(res.data[0].observations || undefined);
        this.keyArmyNumber = res.data[0].keyArmyNumber;
        this.statusDict = res.data[0].statusDict;
        const date2 = res.data[0].instructorDate
          ? new Date(String(res.data[0].instructorDate).split('-').join('/'))
          : '';

        this.legalForm.get('fechaPPFF').setValue(date2);
        this.legalForm.get('cveOficio').setValue(res.data[0].passOfficeArmy);
        if (res.data[0].typeDict == 'PROCEDENCIA') {
          this.buttonDisabled = true;
        }
        if (
          res.data[0].statusDict == 'DICTAMINADO' ||
          res.data[0].statusDict == 'ABIERTO'
        ) {
          this.buttonDeleteDisabled = false;
          this.buttonAprove = false;
        }

        this.getOficioDictamen({
          id: res.data[0].id,
          typeDict: res.data[0].typeDict,
        });

        await this.getDictaionXGoo1();

        //this.goods.forEach(async good => {
        await this.getDictaDoc(
          res.data[0].id,
          res.data[0].typeDict,
          this.goodsValid[0].id
        );
        //});

        return;
      },
      error: () => {},
    });
  }

  getDictaDoc(dica: number, type: string, good: number) {
    return new Promise((resolve, reject) => {
      const params = new FilterParams();
      params.addFilter('officialNumber', dica, SearchFilter.EQ);
      params.addFilter('typeDictum', type, SearchFilter.EQ);
      params.addFilter('stateNumber', good, SearchFilter.EQ);
      this.documentsMServ.getAllDictum(params.getParams()).subscribe({
        next: resp => {
          resp.data.map((doc: any) => {
            (doc.k = doc.key.key),
              (doc.d = doc.key.description),
              (doc.date = doc.dateReceipt);
          });

          this.documents_m1 = [...resp.data];
          console.log(this.documents_m1);

          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  }

  onLoadGoodList() {
    this.formLoading = true;
    let noExpediente = this.legalForm.get('noExpediente').value || '';
    this.params.getValue().page = 1;
    this.params.getValue().limit = 10;
    this.formLoading = true;
    if (noExpediente !== '') {
      this.goodServices
        .getByExpedient(noExpediente, this.params.getValue())
        .subscribe({
          next: response => {
            const data = response.data;

            this.formLoading = false;
            data.map(async (good: any, index) => {
              if (index == 0) this.di_desc_est = good.estatus.descriptionStatus;
              good.di_disponible = 'S';
              await new Promise((resolve, reject) => {
                const body = {
                  no_bien: good.id,
                  estatus: good.status,
                  tipo_dicta: this.legalForm.get('tipoDictaminacion').value,
                  identificador: good.identifier,
                  vc_pantalla: 'FACTJURDICTAMAS',
                  proceso_ext_dom: good.extDomProcess ?? '',
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
                    this.formLoading = false;
                    resolve(null);
                  },
                });
              });
            });

            this.goods = data;
            this.totalItems = response.count;
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
      no_of_dicta: [null],
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
      clasif: [null],
      oficio: [null],
    });

    this.formOficio = this.fb.group({
      no_of_dicta: [null],
      oficio: [null],
    });

    this.dictationForm = this.fb.group({
      no_volante: [null],
      tipo_volante: [null],
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
      this.isExp = true;
      this.onLoadGoodList();
    } else {
      this.isExp = false;
      const { noExpediente } = this.legalForm.value;
      this.filter1.getValue().removeAllFilters();
      this.filter1.getValue().limit = 10;
      this.filter1
        .getValue()
        .addFilter('goodClassNumber', type.no_clasif_bien, SearchFilter.EQ);
      this.filter1
        .getValue()
        .addFilter('fileNumber', noExpediente, SearchFilter.EQ);
      this.filter1.getValue().addFilter('status', 'ADM', SearchFilter.EQ);
      this.filter1.getValue().page = 1;
      this.formLoading = true;
      this.goodServices
        .getAllFilter(this.filter1.getValue().getParams())
        .subscribe({
          next: response => {
            this.formLoading = false;
            const data = response.data;
            this.totalItems = response.count;
            data.map(async (good: any, index) => {
              if (index == 0)
                this.di_desc_est = good.statusDetails.descriptionStatus;
              good.di_disponible = 'S';
              await new Promise((resolve, reject) => {
                const body = {
                  no_bien: good.id,
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
          },
          error: () => {
            this.formLoading = false;
          },
        });
    }
  }

  onLoadWithClass() {
    this.formLoading = true;
    this.goodServices
      .getAllFilter(this.filter1.getValue().getParams())
      .subscribe({
        next: response => {
          this.formLoading = false;
          const data = response.data;
          this.totalItems = response.count;
          data.map(async (good: any, index) => {
            if (index == 0)
              this.di_desc_est = good.statusDetails.descriptionStatus;
            good.di_disponible = 'S';
            await new Promise((resolve, reject) => {
              const body = {
                no_bien: good.id,
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
        },
        error: () => {
          this.formLoading = false;
        },
      });
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

  async getOficioDictamen(data: any) {
    const params = new ListParams();
    params['filter.officialNumber'] = `$eq:${data.id}`;
    params['filter.typeDict'] = `$eq:${data.typeDict}`;

    return this.oficialDictationService.getAll(params).subscribe({
      next: resp => {
        console.log('OFICIO,', resp);
        this.oficioDictamen = resp.data[0];
        const params = new ListParams();
        params.text = resp.data[0].sender;
        this.legalForm
          .get('autoriza_remitente')
          .patchValue(resp.data[0].sender);

        this.getUsers(params);
        // this.oficioDictamen = data.data[0];

        // if (this.oficioDictamen.sender != null) {
        //   const paramsSender: any = new ListParams();
        //   paramsSender.text = this.oficioDictamen.sender;
        //   this.getSenders2(paramsSender);
        // }

        // console.log('DATA OFFICE', data);
        // this.loading = false;
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
    this.goodSelect = _good;
    const exists = this.selectedGooods.find(good => good.id == _good.id);
    return !exists ? false : true;
  }
  onGoodSelect(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.goodSelectedChange(data.row, data.toggle),
    });
  }
  goodSelectedChange(good: IGood | any, selected: boolean) {
    this.goodSelect = good;
    this.di_desc_est = good.estatus
      ? good.estatus.descriptionStatus
      : good.statusDetails.descriptionStatus;
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
            this.onLoadToast('error', `El bien ${good.id} ya existe`);
            return;
          }

          if (good.est_disponible == 'N') {
            this.onLoadToast(
              'error',
              `El bien ${good.id} tiene un estatus invalido para ser dictaminado o ya esta dictaminado`
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
      this.idGoodSelected = e;
      //this.onLoadDocumentsByGood();
    }
  }

  /** --
   * DOCUMENTOS
   * --
   */
  btnDocumentos() {
    let dicta = '';
    const { noExpediente } = this.legalForm.value;
    this.notServ.getVariableType(noExpediente).subscribe({
      next: resp => {
        this.variablesForm.get('tipo_vol').patchValue(resp.volType);
        if (!this.legalForm.get('esPropiedad').value) {
          dicta = 'N';
        } else {
          dicta = this.legalForm.get('esPropiedad').value;
        }
        if (!this.legalForm.get('fechaPPFF')) {
          this.onLoadToast('error', `Debe especificar la ${this.label}`);
          return;
        }
        this.variablesForm.get('clasif').setValue(null);

        if (this.idGoodSelected.goodClassNumber) {
          if (
            !['DEVOLUCION', 'ABANDONO'].includes(
              this.legalForm.get('tipoDictaminacion').value
            )
          ) {
            this.variablesForm.get('clasif').setValue(null);

            if (
              this.variablesForm.get('clasif').value == null &&
              this.idGoodSelected.goodClassNumber
            ) {
              this.variablesForm
                .get('clasif')
                .setValue(
                  this.variablesForm.get('clasif').value ??
                    '' + this.idGoodSelected.goodClassNumber
                );
            } else if (
              this.variablesForm
                .get('clasif')
                .value.indexOf(this.idGoodSelected.goodClassNumber) == 0 &&
              this.idGoodSelected.goodClassNumber
            ) {
              this.variablesForm
                .get('clasif')
                .setValue(
                  this.variablesForm.get('clasif').value +
                    ',' +
                    this.idGoodSelected.goodClassNumber
                );
            }

            if (
              this.idGoodSelected.goodClassNumber &&
              this.variablesForm
                .get('clasif')
                .value.indexOf(this.idGoodSelected.goodClassNumber) == 0
            ) {
              this.variablesForm
                .get('clasif')
                .setValue(this.variablesForm.get('clasif').value);
            }

            this.variablesForm
              .get('clasif2')
              .patchValue(this.variablesForm.get('clasif').value);

            const typeDictation = this.legalForm.get('tipoDictaminacion').value;
            const typeSteeringwheel = this.variablesForm.get('tipo_vol').value;
            const numberClassifyGood = this.variablesForm.get('clasif2').value;
            const dateValid = this.legalForm.get('fechaPPFF').value;
            const documenst = this.documents;
            let config: ModalOptions = {
              initialState: {
                typeDictation,
                typeSteeringwheel,
                numberClassifyGood,
                dateValid,
                documenst,
                callback: (next: any[]) => {
                  if (!this.dictNumber) {
                    this.buttonAprove = true;
                    this.buttonRefuse = false;
                  }
                  //const concatenatedArray = this.documents.concat(next);
                  this.documents = next;
                  console.log(this.documents);
                },
              },
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(RDictaminaDocModalComponent, config);
          }
        }
      },
      error: () => {},
    });
  }

  onLoadDocumentsByGood() {
    this.documentService.getByGood(this.idGoodSelected.id).subscribe({
      next: response => {
        console.log(response);

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

  async btnApprove() {
    this.loadingDic = true;

    const user = this.authService.decodeToken();
    const {
      tipoDictaminacion,
      no_of_dicta,
      cveOficio,
      fechaPPFF,
      autoriza_remitente,
      noExpediente,
      esPropiedad,
    } = this.legalForm.value;

    let SIGLA,
      AR_REMITENTE,
      ANIO,
      MES,
      OFICIO: number,
      VALOR: number,
      DATO,
      LST_ID,
      vNO_DELEGACION,
      vNO_SUBDELEGACION,
      vNO_DEPARTAMENTO,
      vCVE_CARGO,
      vniveld2,
      vniveld3,
      vniveld4,
      vniveld5,
      vnivel,
      vdepend,
      vdep_deleg,
      vnivelp,
      vdependp,
      vdep_delegP,
      SIGLAp;

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const SYSDATE = `${day}/${month}/${year}`;
    const SYSDATE2 = `${month}/${day}/${year}`;
    const ETAPA: number = await this.getFaStageCreda(SYSDATE2);

    const systemLevel = 0;

    LST_ID = `E:${noExpediente}`;

    await this.PUP_DICTA_LOG(LST_ID + ' Inicio de aprobar. ');

    if (tipoDictaminacion) {
      this.documents_m1 = [];
    }

    //verifica que exista la dictaminacion
    if (!no_of_dicta && !cveOficio) {
      if (fechaPPFF) {
        await this.PUP_DICTA_LOG(
          LST_ID + `Antes de select dsarea: *${user.department}`
        );

        const validDest: any = await this.valideDataRemitente(
          autoriza_remitente.id
        );

        if (validDest == null) {
          this.alert(
            'warning',
            'No se localizaron datos de la persona que autoriza.',
            ''
          );
          this.loadingDic = false;
          return;
        } else {
          vNO_DELEGACION = validDest.delegation1Number;
          vNO_SUBDELEGACION = validDest.subdelegationNumber;
          vNO_DEPARTAMENTO = validDest.departament1Number;

          vCVE_CARGO = await this.cvCargo(autoriza_remitente.id);

          if (vCVE_CARGO == null) {
            this.alert(
              'warning',
              'No se localizaron datos de la persona que autoriza.',
              ''
            );
            this.loadingDic = false;
            return;
          }

          let obj = {
            department: vNO_DEPARTAMENTO,
            subDelegation: vNO_SUBDELEGACION,
            delegation: vNO_DELEGACION,
            stage: ETAPA,
          };

          const CAT_DEPARTAMENTOS: any = await this.getDepartment(obj);
          if (CAT_DEPARTAMENTOS == null) {
            this.alert(
              'warning',
              'No se localizó la dependencia de la persona que autoriza.',
              ''
            );
            this.loadingDic = false;
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

          // console.log((vniveld4 = SIGLA), (vniveld5 = vCVE_CARGO));

          // SIGUIENTE CONSULTA
          let obj2 = {
            vDepend: vdepend,
            vDepDeleg: vdep_deleg,
            stage: ETAPA,
            vLevel: vnivel,
          };
          const CAT_DEPARTAMENTOS2: any = await this.getDepartment2(obj2);

          if (CAT_DEPARTAMENTOS2 == null) {
            this.alert(
              'warning',
              'No se localizó el predecesor de la persona que autoriza.',
              ''
            );
            this.loadingDic = false;
            return;
          } else if (CAT_DEPARTAMENTOS2.length == 0) {
            this.alert(
              'warning',
              'No se encontraron datos del departamento.',
              ''
            );
            this.loadingDic = false;
            return;
          }

          SIGLAp = CAT_DEPARTAMENTOS2.dsarea;
          vnivelp = CAT_DEPARTAMENTOS2.nivel;
          vdependp = CAT_DEPARTAMENTOS2.depend;
          vdep_delegP = CAT_DEPARTAMENTOS2.dep_delegacion;

          await this.PUP_DICTA_LOG(
            LST_ID + `ANTES DE SELECT DSAREA: *${user.department}`
          );

          AR_REMITENTE = CAT_DEPARTAMENTOS2.dsarea;

          await this.PUP_DICTA_LOG(
            LST_ID + `DESPUES DE SELECT DSAREA: *${SIGLA}`
          );

          this.legalForm
            .get('cveOficio')
            .patchValue(
              `${CAT_DEPARTAMENTOS2.vLeveld2}/${
                CAT_DEPARTAMENTOS2.vLeveld3 ?? vniveld3
              }/${vniveld4}`
            );

          const level = Number(vnivel) + 1;

          if (level == 5) {
            const cv = this.legalForm.get('cveOficio').value;
            this.legalForm.get('cveOficio').patchValue(`${cv}/${vniveld5}`);
          }

          let cadena: string = `${
            this.legalForm.get('cveOficio').value
          }/ ? /${year}`;
          cadena = cadena.trim();

          this.legalForm.get('cveOficio').patchValue(cadena);

          if (tipoDictaminacion == 'DESTRUCCION') {
            OFICIO = await this.getOFICIODict(tipoDictaminacion);
          }
        }
      }

      await this.PUP_DICTA_LOG(
        LST_ID + 'Variables sequencia de oficio' + OFICIO
      );

      if (OFICIO) {
        VALOR = OFICIO;
        this.legalForm.get('no_of_dicta').patchValue(VALOR);
        this.formOficio.get('oficio').patchValue(OFICIO);
        this.variablesForm.get('oficio').patchValue(OFICIO);
        await this.PUP_DICTA_LOG(
          LST_ID + `Entrada a PU_P_AGREGA_DICTAMEN(VALOR): *${user.department}`
        );

        this.pubAddDictation(VALOR);
      }
    }

    this.statusDict = 'DICTAMINADO';

    const no_volante = await this.getMaxVolan(noExpediente);

    //this.dictationForm.get('no_volante').patchValue('449572')
    this.dictationForm.get('no_volante').patchValue(no_volante);

    const tipo_volante = await this.getTypeVolan(no_volante);

    //this.dictationForm.get('tipo_volante').patchValue('T')

    this.dictationForm.get('tipo_volante').patchValue(tipo_volante);

    if (tipoDictaminacion == 'DESTRUCCION') {
      DATO = 'S';

      await this.PUP_DICTA_LOG(LST_ID);

      await this.pubButtonAprovRefuse();

      await this.createDictamen();
    }

    this.buttonAprove = false;
    this.isIdent = true;

    if (esPropiedad) {
      this.isDelit = false;
    }

    this.variablesForm.get('clasif').patchValue(' ');
    this.variablesForm.get('clasif2').patchValue(' ');

    Swal.fire('Dictamen creado correctamente', '', 'success').then(() => {
      this.callForm();
    });
  }

  async createDictamen() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const user = this.authService.decodeToken();
    const details = await this.getDetailsUser(user.username.toUpperCase());

    return new Promise((resolve, reject) => {
      const {
        tipoDictaminacion,
        fechaPPFF,
        no_of_dicta,
        cveOficio,
        noExpediente,
        observations,
        esPropiedad,
        autoriza_remitente,
      } = this.legalForm.value;
      const { no_volante } = this.dictationForm.value;

      const body: any = {
        id: no_of_dicta,
        passOfficeArmy: cveOficio,
        expedientNumber: noExpediente,
        typeDict: tipoDictaminacion,
        statusDict: this.statusDict,
        dictDate: new Date(),
        userDict: user.username.toUpperCase(),
        observations: observations,
        delegationDictNumber: Number(details.delegationNumber),
        areaDict: details.departamentNumber,
        instructorDate: fechaPPFF,
        registerNumber: '',
        esDelit: esPropiedad ? 'S' : 'N',
        wheelNumber: Number(no_volante),
        keyArmyNumber: '',
        notifyAssuranceDate: new Date(),
        resolutionDate: new Date(),
        notifyResolutionDate: new Date(),
        folioUniversal: '',
        entryDate: new Date(),
        dictHcDAte: new Date(),
        entryHcDate: new Date(),
      };

      this.dictationServ.create(body).subscribe({
        next: async resp => {
          this.dictantion = resp;
          await this.agregarDictamenXGood();

          const office = {
            officialNumber: this.dictantion.id,
            typeDict: tipoDictaminacion,
            sender: autoriza_remitente.id,
            delegacionRecipientNumber: Number(user.delegacionreg),
          };

          await this.createOficioDictamen(office);
          // await this.generateCveOficio(this.dictantion.id);
          this.cveOficio.nativeElement.focus();

          for (let i = 0; i < this.documents.length; i++) {
            await this.createDocumentDictum(this.documents[i]);
          }
          this.loadingDic = false;
          resolve(true);
        },
        error: () => {
          this.loadingDic = false;
          resolve(true);
        },
      });
    });
  }

  async getDetailsUser(userId: string) {
    return new Promise<any>((resolve, reject) => {
      const params = new FilterParams();
      params.removeAllFilters();
      params.addFilter(
        'user',
        userId == 'SIGEBIADMON' ? userId.toLocaleLowerCase() : userId
      );
      this.userDetail.getInfoUserLogued(params.getParams()).subscribe({
        next: resp => {
          resolve(resp.data[0]);
        },
        error: () => {
          resolve(null);
        },
      });
    });
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
          expedientNumber: this.legalForm.get('noExpediente').value,
          stateNumber: this.goodsValid[i].id,
          key: document.cveDocument,
          typeDictum: this.legalForm.get('tipoDictaminacion').value,
          dateReceipt: elemento2,
          userReceipt: '',
          insertionDate: new Date(SYSDATE5),
          userInsertion: token.username.toUpperCase(),
          numRegister: null,
          officialNumber: this.dictantion.id,
          notificationDate: null,
          secureKey: null,
        };
        this.documentsMServ.create(obj).subscribe({
          next: resp => {
            console.log('CREADO DOC', resp);
          },
          error: error => {
            this.loadingDic = false;
            console.log('ERROR DOC', error.error);
          },
        });
      }
    }
  }

  // async createDocumentDictum(document: any) {
  //   const token = this.authService.decodeToken();
  //   for (let i = 0; i < this.goodsValid.length; i++) {
  //     let obj: any = {
  //       expedientNumber: this.legalForm.get('noExpediente').value,
  //       stateNumber: this.goodsValid[i].id,
  //       key: document.cveDocument,
  //       typeDictum: this.legalForm.get('tipoDictaminacion').value,
  //       dateReceipt: document.date,
  //       userReceipt: '',
  //       insertionDate: document.dae,
  //       userInsertion: token.username.toUpperCase(),
  //       numRegister: null,
  //       officialNumber: this.dictantion.id,
  //       notificationDate: null,
  //       secureKey: null,
  //     };

  //     this.documentsMServ.create(obj).subscribe({
  //       next: resp => {
  //         console.log('CREADO DOC', resp);
  //       },
  //       error: error => {
  //         console.log('ERROR DOC', error.error);
  //       },
  //     });
  //   }
  // }

  // async generateCveOficio(noDictamen: string) {
  //   let token = this.authService.decodeToken();
  //   const year = new Date().getFullYear();
  //   let cveOficio = '';
  //   cveOficio =
  //     token.siglasnivel1 + '/' + token.siglasnivel2 + '/' + token.siglasnivel3;
  //   cveOficio = cveOficio + '/' + noDictamen + '/' + year;
  //   return this.dictaminacionesForm.get('cveOficio').setValue(cveOficio);
  // }

  // CREATE OFICIO DICTAMEN //
  async createOficioDictamen(body: any) {
    this.dictationServ.createOfficialDictation(body).subscribe({
      next: (data: any) => {
        this.loading = false;
      },
      error: error => {
        this.loadingDic = false;
        this.loading = false;
      },
    });
  }

  async agregarDictamenXGood() {
    // console.log('this.dictamenesXBien1', this.dictamenesXBien1);

    let dataBienes: any = this.goodsValid;
    console.log('dataBienesdataBienes', dataBienes);
    for (let i = 0; i < this.goodsValid.length; i++) {
      let obj = {
        ofDictNumber: this.dictantion.id,
        proceedingsNumber: this.legalForm.get('noExpediente').value,
        id: this.goodsValid[i].id,
        typeDict: this.legalForm.get('tipoDictaminacion').value,
        descriptionDict: this.goodsValid[i].description,
        amountDict: this.goodsValid[i].quantity,
      };

      this.createDictamenXGood1(obj);
    }

    //this.onLoadGoodList();
  }

  async getDictaionXGoo1() {
    const { noExpediente } = this.legalForm.value;

    //const params = new FilterParams();
    this.filter2.getValue().removeAllFilters();
    this.filter2
      .getValue()
      .addFilter('proceedingsNumber', noExpediente, SearchFilter.EQ);
    this.filter2
      .getValue()
      .addFilter('ofDictNumber', this.dictNumber, SearchFilter.EQ);

    // params.addFilter('')
    return new Promise((resolve, reject) => {
      this.DictationXGood1Service.getAll(
        this.filter2.getValue().getParams()
      ).subscribe({
        next: resp => {
          resp.data.map((goodx: any) => {
            goodx.id = goodx.id;
            goodx.description = goodx.descriptionDict;
            // goodx.menaje = '';
            goodx.quantity = goodx.amountDict;
            goodx.status = goodx.good.status;
            goodx.extDomProcess = goodx.good.extDomProcess;
            goodx.goodClassNumber = goodx.good.goodClassNumber;
          });

          this.goodsValid = [...resp.data];
          this.totalItems2 = resp.count;

          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  }

  getDicXGood() {
    this.DictationXGood1Service.getAll(
      this.filter2.getValue().getParams()
    ).subscribe({
      next: resp => {
        resp.data.map((goodx: any) => {
          goodx.id = goodx.id;
          goodx.description = goodx.descriptionDict;
          goodx.menaje = '';
          goodx.quantity = goodx.amountDict;
          goodx.status = goodx.good.status;
          goodx.extDomProcess = goodx.good.extDomProcess;
          goodx.goodClassNumber = goodx.good.goodClassNumber;
        });
        this.goodsValid = [...resp.data];
        this.totalItems2 = resp.count;
      },
      error: () => {},
    });
  }

  async createDictamenXGood1(body: any) {
    this.DictationXGood1Service.createDictaXGood1(body).subscribe({
      next: resp => {
        console.log('CREADO', resp);
      },
      error: error => {
        this.loadingDic = false;
        console.log('ERROR', error.error);
      },
    });
  }

  callForm() {
    const { noExpediente } = this.legalForm.value;
    let LV_VALOR: any, TIPO_DIC: any, V_PAQUETE: any, V_ESTATUS: any;
    LV_VALOR = this.dictantion.id; //this.legalForm.get('no_of_dicta').value
    TIPO_DIC = this.legalForm.get('tipoDictaminacion').value;
    V_PAQUETE = this.legalForm.get('tipo').value;
    if (V_PAQUETE == 'P') {
      V_PAQUETE = null;
    } else {
      V_PAQUETE = 0;
    }

    this.globalVars.IMP_OF = 0;

    this.router.navigate(
      [baseMenu + baseMenuDepositaria + DEPOSITARY_ROUTES_2[0].link],
      {
        queryParams: {
          P_VALOR: LV_VALOR,
          TIPO: TIPO_DIC,
          PAQUETE: V_PAQUETE,
          NO_EXP: noExpediente,
          origin: 'FACTJURDICTAMAS',
          origin2: this.origin,
        },
      }
    );

    if (this.globalVars.IMP_OF == 1) {
    }
  }

  async pubButtonAprovRefuse() {
    let CLASIF, BIEN, CUENTA: number, SALIDA: number, LV_DOCU: any, FECHA: any;

    const { fechaPPFF, noExpediente, tipoDictaminacion } = this.legalForm.value;
    const { oficio } = this.variablesForm.value;

    const data: any = await this.goodClass();

    const user = this.authService.decodeToken();

    if (!fechaPPFF) {
      this.onLoadToast('error', `Agregar valor a ${this.label}`);
      return;
    } else {
      if (this.idGoodSelected.goodClassNumber) {
        CLASIF = this.idGoodSelected.goodClassNumber;
        BIEN = this.idGoodSelected.id;

        const CUENTA = await this.countDocument();

        if (CLASIF) {
          if (data) {
            for (let index = 0; index < data.length; index++) {
              const el = data[index];

              const doc = {
                expedientNumber: noExpediente,
                stateNumber: el.no_bien,
                key: el.cve_documento,
                typeDictum: tipoDictaminacion,
                dateReceipt: '',
                userReceipt: user.username.toUpperCase(),
                insertionDate: new Date(),
                userInsertion: user.username.toUpperCase(),
                officialNumber: oficio,
              };

              this.documents_m1.push(doc);

              if (SALIDA > CUENTA) {
                break;
              }
              SALIDA = SALIDA + 1;
            }

            SALIDA = null;
          }
        }

        this.documents.forEach((doc: any) => {
          if (doc.cveDocument) {
            FECHA = doc.date;
            LV_DOCU = doc.cveDocument;

            this.documents_m1.forEach(m1 => {
              if (m1.key == LV_DOCU) {
                m1.dateReceipt = FECHA;
              }
            });
          }
        });
      }
    }
  }

  async countDocument() {
    const { tipoDictaminacion } = this.legalForm.value;
    return new Promise<number>((resolve, reject) => {
      const params = new FilterParams();
      params.addFilter('stateNumber', this.idGoodSelected.id, SearchFilter.EQ);
      params.addFilter('typeDictum', tipoDictaminacion, SearchFilter.EQ);

      this.documentsMServ.getAllDictum(params.getParams()).subscribe({
        next: resp => {
          resolve(resp.count);
        },
        error: () => {
          this.loadingDic = false;
          resolve(0);
        },
      });
    });
  }

  async goodClass() {
    const { noExpediente, tipoDictaminacion } = this.legalForm.value;
    return new Promise((resolve, reject) => {
      const body = {
        clasif: this.idGoodSelected.goodClassNumber,
        bien: this.idGoodSelected.id,
        noExpediente: noExpediente,
        tipoDicta: tipoDictaminacion,
      };
      this.dictationServ.getNoGoodClass(body).subscribe({
        next: resp => {
          console.log(resp);
          resolve(resp.data);
        },
        error: () => {
          this.loadingDic = false;
          resolve(null);
        },
      });
    });
  }

  async getMaxVolan(exp: number) {
    return new Promise<number>((resolve, reject) => {
      this.notServ.getMaxFlyer(exp).subscribe({
        next: resp => {
          resolve(resp.data[0].max);
        },
        error: () => {
          this.loadingDic = false;
          resolve(null);
        },
      });
    });
  }

  async getTypeVolan(volant: number) {
    return new Promise((resolve, reject) => {
      const params = new FilterParams();
      params.addFilter('wheelNumber', volant, SearchFilter.EQ);
      this.notServ.getAllWithFilter(params.getParams()).subscribe({
        next: resp => {
          resolve(resp.data[0].wheelType);
        },
        error: () => {
          this.loadingDic = false;
          resolve(null);
        },
      });
    });
  }

  pubAddDictation(valor: number) {
    this.goodsValid.forEach((data: any) => {
      if (data.goodClassNumber) {
        data.no_of_dicta = valor;
      }
    });
  }

  async getDepartment2(data: any) {
    return new Promise((resolve, reject) => {
      this.departamentService.getInCatDepartaments(data).subscribe({
        next: (resp: any) => {
          let data;
          if (resp.data.length == 2) {
            data = resp.data[1];
          } else {
            data = resp.data[0];
          }

          resolve(data);
          this.loading = false;
        },
        error: error => {
          this.loadingDic = false;
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async getOFICIODict(typeDict: any) {
    return new Promise<number>((resolve, reject) => {
      this.dictationServ.getFactjurdictamasg(typeDict).subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.loading = false;
          resolve(resp.job);
        },
        error: err => {
          this.loading = false;
          this.loadingDic = false;
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
          this.loadingDic = false;
          resolve(null);
        },
      });
    });
  }

  async cvCargo(remitente: string) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${remitente}`;
    return new Promise(resolve => {
      this.segUser.getAllSegUsers(params).subscribe({
        next: resp => {
          resolve(resp.data[0].positionKey);
        },
        error: () => {
          this.loadingDic = false;
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
          const data = resp.data[0];
          resolve(data);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          this.loadingDic = false;
          resolve(null);
        },
      });
    });
  }

  async getFaStageCreda(data: any) {
    return new Promise<number>((resolve, reject) => {
      this.parametersService.getFaStageCreda(data).subscribe({
        next: (resp: any) => {
          this.loading = false;
          resolve(resp.stagecreated);
        },
        error: err => {
          this.loading = false;
          this.loadingDic = false;
          resolve(null);
        },
      });
    });
  }

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
            good: this.goodSelect.id,
            screen: 'FACTJURDICTAMAS',
            NO_EXP: this.legalForm.get('noExpediente').value,
            origin2: this.origin,
          },
        });
      }
    }
  }

  async btnDeleteDictation() {
    const cursorDoc = await this.getDicGood();

    const user = this.authService.decodeToken();

    const { noExpediente, tipoDictaminacion, cveOficio, fecDicta } =
      this.legalForm.value;
    let v_no_expediente: any,
      v_tipo_dicta: any,
      v_no_of_dicta: any,
      v_no_volante: any,
      prueba,
      v_elimina,
      v_usuario,
      v_ban: boolean,
      v_estatus,
      v_estatus_ini,
      v_no_registro,
      v_valid,
      v_exist: string,
      vc_pantalla,
      v_FEC_DICTAMINACION,
      v_FEC_ACTUAL;

    v_no_expediente = noExpediente;
    v_tipo_dicta = tipoDictaminacion;
    v_no_of_dicta = this.dictNumber;
    v_no_volante = this.wheelNumber;
    v_ban = false;
    let stop = false;

    if (!v_no_of_dicta) {
      this.onLoadToast('error', 'No existe dictamen a eliminar');
      return;
    }

    const cadena = cveOficio.indexOf('?');

    if (cadena == -1) {
      v_ban = true;
    }
    // if (cadena != 0 && this.user_dicta == user.username.toUpperCase()) {}

    v_elimina = await this.getVDelete();

    if (
      cadena != -1 &&
      this.user_dicta == user.username.toUpperCase()
      // !cveOficio.includes('?') &&
      // this.user_dicta == user.username.toUpperCase()
    ) {
      null;
    } else {
      if (v_ban) {
        if (v_elimina == 'X') {
          this.onLoadToast(
            'error',
            'EL usuario no está autorizado para eliminar el dictamen cerrado'
          );
          return;
        } else if (v_elimina == 'S') {
          v_valid = await this.getValid();

          if (v_valid == 0) {
            this.onLoadToast(
              'error',
              'El usuario no está autorizado para eliminar el dictamen'
            );
            return;
          }

          v_FEC_DICTAMINACION = this.datePipe.transform(fecDicta, 'MM/yyyy');
          v_FEC_ACTUAL = this.datePipe.transform(new Date(), 'MM/yyyy');
          if (v_FEC_DICTAMINACION != v_FEC_ACTUAL) {
            this.onLoadToast(
              'error',
              'El dictamen a eliminar no fue realizado dentro del mes'
            );
            return;
          }
        }
      }
    }

    if (v_ban && v_elimina == 'S') {
      this.alertQuestion(
        'info',
        'Se borra dictamen cerrado',
        `(Exp.: ${v_no_expediente} Tipo: ${v_tipo_dicta} No. Dict.: ${v_no_of_dicta} )`
      ).then(async resp => {
        if (resp.isConfirmed) {
          stop = false;
          cursorDoc.forEach(async good => {
            if (tipoDictaminacion == 'DESTRUCCION') {
              v_exist = await this.getVExist(
                Number(good.no_bien),
                'DESTRUCCION'
              );
            } else {
              v_exist = await this.getVExist(
                Number(good.no_bien),
                good.identificador
              );
            }

            if (v_exist == 'S') {
              this.onLoadToast(
                'error',
                'Al menos un bien se encuentra en otra fase'
              );
              stop = true;
              return;
            } else if (v_exist == 'XX') {
              v_estatus_ini = await this.getStausIn(Number(good.no_bien));

              if (v_estatus_ini) {
                await this.getUpdateStatus(Number(good.no_bien), v_estatus_ini);
              }
            }
          });

          if (stop) return;

          //Aqui se elimina el dictamen cerrado

          const body: any = {
            vProceedingsNumber: v_no_expediente,
            vTypeDicta: v_tipo_dicta,
            vWheelNumber: v_no_volante,
            vOfNumberDicta: v_no_of_dicta,
          };

          const success = await this.deteleDictation(body);

          if (!success) return;

          Swal.fire(
            'Dictamen ha sido eliminado correctamente',
            '',
            'success'
          ).then(() => {
            //Limpiar todo
            this.clearSearch();
            this.getExp(v_no_expediente);
          });
        }
      });
    } else {
      this.alertQuestion(
        'info',
        'Se borra dictamen',
        `(Exp.: ${v_no_expediente} Tipo: ${v_tipo_dicta} No. Dict.: ${v_no_of_dicta} )`
      ).then(async resp => {
        if (resp.isConfirmed) {
          stop = false;
          cursorDoc.forEach(async good => {
            v_estatus = await this.getVStatus(
              Number(good.no_bien),
              v_tipo_dicta,
              good.identificador,
              good.estatus
            );

            if (v_estatus == 'XXX' && v_ban) {
              this.onLoadToast(
                'error',
                'Al menos un bien se encuentra en otra fase'
              );
              stop = true;
              return;
            }

            if (v_estatus != 'XXX') {
              await this.getUpdateAndDeleteHisto(
                Number(good.no_bien),
                v_estatus
              );
            }
          });

          //Aqui se elimina el dictamen
          if (stop) return;

          const body: any = {
            vProceedingsNumber: v_no_expediente,
            vTypeDicta: v_tipo_dicta,
            vWheelNumber: v_no_volante,
            vOfNumberDicta: v_no_of_dicta,
          };

          const sucess = await this.deteleDictation(body);

          if (!sucess) return;

          Swal.fire('Dictamen ha eliminado correctamente', '', 'success').then(
            () => {
              this.clearSearch();
              this.getExp(v_no_expediente);
            }
          );
        }
      });
    }
  }

  getExp(exp: number) {
    const { NO_EXP } = this.activatedRoute.snapshot.queryParams;
    this.expedientServices.getById(exp ?? NO_EXP).subscribe({
      next: response => {
        // ..Datos del expediente
        this.isDisabledExp = true;
        this.legalForm.get('noExpediente').patchValue(exp ?? NO_EXP);
        this.legalForm.get('criminalCase').setValue(response.criminalCase);
        this.legalForm
          .get('preliminaryInquiry')
          .setValue(response.preliminaryInquiry);

        this.onLoadGoodList();
      },
    });
  }

  async getUpdateAndDeleteHisto(goodId: number, estatus: string) {
    return new Promise<boolean>((resolve, reject) => {
      const body = {
        noBien: goodId,
        vEstatus: estatus,
      };

      this.dictationServ.getUpdateAndDelete(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  }

  async getVStatus(
    goodId: number,
    tipoDic: string,
    identificador: string,
    estatus: string
  ) {
    return new Promise<string>((resolve, reject) => {
      const body = {
        noBien: goodId,
        identificador,
        estatus_dictaminacion: estatus,
        tipo_dictaminacion: tipoDic,
      };

      this.dictationServ.getVEstatus(body).subscribe({
        next: resp => {
          resolve(resp.V_ESTATUS);
        },
        error: () => {
          console.log('aqui nop hay datos');

          resolve('XXX');
        },
      });
    });
  }

  async deteleDictation(body: any) {
    return new Promise<boolean>((resolve, reject) => {
      this.dictationServ.deletePupDeleteDictum(body).subscribe({
        next: resp => {
          console.log(resp);
          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  }

  async getUpdateStatus(goodId: number, estatus: string) {
    return new Promise<boolean>((resolve, reject) => {
      const body = {
        noBien: goodId,
        estatus,
      };

      this.dictationServ.updateVEstatus(body).subscribe({
        next: resp => {
          resolve(true);
        },
        error: () => {
          resolve(false);
        },
      });
    });
  }

  async getStausIn(goodId: number) {
    return new Promise<string>((resolve, reject) => {
      this.dictationServ.getStatusIni(goodId).subscribe({
        next: resp => {
          resolve(resp.V_ESTATUS_INI);
        },
        error: () => {
          resolve(null);
        },
      });
    });
  }

  async getVExist(goodId: number, tipoDic: string) {
    return new Promise<string>((resolve, reject) => {
      const body = {
        noBien: goodId,
        tipoDicta: tipoDic,
      };

      this.dictationServ.getVExist(body).subscribe({
        next: resp => {
          resolve(resp.V_EXIST);
        },
        error: () => {
          resolve('XX');
        },
      });
    });
  }

  async getValid() {
    return new Promise<number>((resolve, reject) => {
      const user = this.authService.decodeToken();

      const body = {
        usuario: user.username.toUpperCase(),
        noDelegacionDictam: this.delegationDictNumber,
      };

      this.dictationServ.getValid(body).subscribe({
        next: resp => {
          resolve(resp.V_VALID);
        },
        error: () => {
          resolve(0);
        },
      });
    });
  }

  async getVDelete() {
    return new Promise<string>((resolve, reject) => {
      const user = this.authService.decodeToken();

      this.dictationServ.getVElimina(user.username.toUpperCase()).subscribe({
        next: resp => {
          resolve(resp.resultado);
        },
        error: () => {
          resolve('X');
        },
      });
    });
  }

  async getDicGood() {
    return new Promise<
      { estatus: string; identificador: string; no_bien: string }[]
    >((resolve, reject) => {
      const { noExpediente } = this.legalForm.value;

      const body = {
        vcProceedingsNumber: noExpediente,
        vcTypeDicta: this.typeDictation,
        vcOfDictaNumber: this.dictNumber,
      };

      this.serviceGood.getDicGood(body).subscribe({
        next: resp => {
          resolve(resp.data);
        },
        error: () => {
          resolve([]);
        },
      });
    });
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

  rowSelectedStatus(good: any) {
    this.di_desc_est = good.estatus
      ? good.estatus.descriptionStatus
      : good.statusDetails.descriptionStatus;
    this.goodSelect = good;
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
    const { tipoDictaminacion, tipo, noExpediente } = this.legalForm.value;

    if (this.dictNumber && noExpediente) {
      let lv_valor;
      let tipo_dict;
      let v_paquete;
      let v_estatus;

      lv_valor = this.dictNumber;
      tipo_dict = tipoDictaminacion;

      if (tipo == 'P') {
        v_paquete = ''; //es del paquete no se dabe si se usara
      } else {
        v_paquete = 0;
      }

      this.router.navigate(
        ['/pages/juridical/depositary/legal-opinions-office'],
        {
          queryParams: {
            origin: 'FACTJURDICTAMAS', //Cambiar
            P_VALOR: lv_valor,
            TIPO: tipo_dict,
            PAQUETE: v_paquete,
            NO_EXP: noExpediente,
            origin3: this.origin,
          },
        }
      );

      this.activeGestion();
    } else {
      this.onLoadToast('error', 'Necesita un número de expediente con oficio');
    }
  }

  activeGestion() {}

  btnRefuse() {
    console.log('btnRechazar');
  }

  listDictums() {
    const expedient = this.legalForm.get('noExpediente').value;
    const volante = this.wheelNumber;
    this.openModalDictums({ noVolante_: volante, noExpediente_: expedient });
  }

  newDictums() {
    this.dictationForm.reset();
    this.formOficio.reset();
    this.variablesForm.reset();
    this.legalForm.get('fechaPPFF').patchValue(null);
    this.legalForm.get('autoriza_remitente').patchValue(null);
    this.legalForm.get('fecDicta').patchValue(new Date());
    this.legalForm.get('cveOficio').patchValue(null);
    this.legalForm.get('observations').patchValue(null);
    this.legalForm.get('esPropiedad').patchValue(null);
    this.documents = [];
    this.documents_m1 = [];
    this.goodsValid = [];

    this.statusDict = '';
    this.buttonAprove = true;
    this.buttonDeleteDisabled = false;

    // this.resetALL();
    // let obj = {
    //   no_clasif_bien: 0,
    // };
    //this.dictaminacionesForm.get('fechaPPFF').setValue('');
    //this.dictaminacionesForm.get('autoriza_remitente').setValue(null);
    //this.dictaminacionesForm.get('autoriza_nombre').setValue('');
    //this.buttonApr = true;
    // this.buttonDeleteDisabled = false;
    // this.onTypesChange(obj);
  }

  openModalDictums(context?: Partial<ListdictumsComponent>) {
    const modalRef = this.modalService.show(ListdictumsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.dataText.subscribe(async (next: any) => {
      console.log('NEXT', next);

      this.onLoadDictationInfo(next.data.id);

      //await this.onLoadDictationInfo(next.data.id, 'id');
      this.goodsValid = [];
      //await this.onLoadGoodList(next.data.id, 'id');

      // await this.checkDictum(next.data.id, 'id');
      // await this.checkDictum_(this.noVolante_, 'all');
    });
  }
}
