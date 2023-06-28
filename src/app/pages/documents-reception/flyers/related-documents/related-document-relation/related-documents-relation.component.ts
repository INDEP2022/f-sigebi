import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, firstValueFrom, map, skip, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { ICopiesJobManagementDto } from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import {
  IMJobManagement,
  IRSender,
} from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { OfficeManagementService } from 'src/app/core/services/office-management/officeManagement.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { AddCopyComponent } from 'src/app/pages/juridical-processes/abandonments-declaration-trades/abandonments-declaration-trades/add-copy/add-copy.component';
import {
  COLUMNS_DOCUMENTS,
  COLUMNS_GOOD_JOB_MANAGEMENT,
  EXTERNOS_COLUMS_OFICIO,
} from 'src/app/pages/juridical-processes/abandonments-declaration-trades/abandonments-declaration-trades/columns';
import { LegalOpinionsOfficeService } from 'src/app/pages/juridical-processes/depositary/legal-opinions-office/legal-opinions-office/services/legal-opinions-office.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { FlyersService } from '../../services/flyers.service';
import {
  IDataGoodsTable,
  RELATED_DOCUMENTS_COLUMNS_GOODS,
} from '../related-documents-columns';
import {
  MANAGEMENTOFFICESTATUSSEND,
  TEXT1,
  TEXT1Abandono,
  TEXT2,
} from '../related-documents-message';
import { RelatedDocumentsService } from '../services/related-documents.service';
import { RelateDocumentsResponseRelation } from './related-documents-response-relation';

export type IGoodAndAvailable = IGood & {
  available: boolean;
  selected: boolean;
};

export type IDocumentJobManagement = {
  cveDocument: string;
  goodNumber: any;
  managementNumber: string;
  recordNumber: string;
  rulingType: string;
  description?: string;
};
export interface IGoodJobManagement {
  managementNumber: string;
  goodNumber: number;
  recordNumber: string;
  classify: string | number;
  goods: string;
  good: IGood;
}
@Component({
  selector: 'app-related-documents',
  templateUrl: './related-documents-relation.component.html',
  styles: [
    `
      :host ::ng-deep form-radio .form-group {
        margin: 0;
        padding-bottom: 0;
        padding-top: 0;
      }
      .disabled[disabled] {
        color: red;
      }
      .disabled-input {
        color: #939393;
        pointer-events: none;
      }
      #bienesJuridicos table:not(.normal-hover) tbody tr:hover {
        color: black !important;
        font-weight: bold;
      }
    `,
  ],
})
export class RelatedDocumentsRelationComponent
  extends RelateDocumentsResponseRelation
  implements OnInit
{
  @ViewChild('tableGoods') tableGoods: Ng2SmartTableComponent;
  @ViewChild('tableDocs') tableDocs: Ng2SmartTableComponent;

  dataTableGoodsMap = new Map<number, IGoodAndAvailable>();
  dataGoodsSelected = new Map<number, IGoodAndAvailable>();

  isDisabledBtnDocs = false;
  isDisabledBtnPrint = false;
  // Send variables
  blockSend: boolean = false;
  variablesSend = {
    ESTATUS_OF: '',
    CVE_OF_GESTION: '',
    FECHA_INSERTO: '',
    V_JUSTIFICACION: '',
  };
  disabled: boolean = true;
  filtroPersonaExt: ICopiesJobManagementDto[] = [];
  filterParams2 = new BehaviorSubject<FilterParams>(new FilterParams());
  nrSelecttypePerson: string | number;
  nrSelecttypePerson_I: string | number;
  managementForm: FormGroup;
  typeClasify: any;
  select = new DefaultSelect();
  justificacion = new DefaultSelect();
  goodTypes = new DefaultSelect();
  cities = new DefaultSelect();
  senders = new DefaultSelect();
  ClasifSubTypeGoods = new DefaultSelect();
  dataGoodFilter: IGood[] = [];
  dataGood: IDataGoodsTable[] = [];
  origin: string = '';
  valTiposAll: boolean;
  tiposData: any = [];
  tiposDatosSelect = new DefaultSelect();
  dataGoodTable: LocalDataSource = new LocalDataSource();
  m_job_management: any = null;
  authUser: any = null;
  // pantalla = (option: boolean) =>
  //   `${
  //     option == true
  //       ? '"Oficio de Gestión por Dictamen"'
  //       : '"Oficio Gestión Relacionados"'
  //   }.`;
  pantallaOption: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  idExpediente: any = null;
  // paramsGestionDictamen: IJuridicalDocumentManagementParams = {
  //   volante: null,
  //   expediente: null,
  //   doc: null,
  //   tipoOf: null,
  //   sale: '',
  //   bien: '',
  //   pGestOk: null,
  //   pNoTramite: null,
  //   pDictamen: null,
  // };
  se_refiere_a = {
    A: 'Se refiere a todos los bienes',
    B: 'Se refiere a algun(os) bien(es) del expediente',
    C: 'No se refiere a ningún bien asegurado, decomisado o abandonado',
    D: 'd',
  };
  se_refiere_a_Disabled = {
    A: false,
    B: false,
    C: false,
    D: false,
  };
  // variables = {
  //   dictamen: '',
  //   b: '',
  //   d: '',
  //   dictaminacion: '',
  //   clasif: '',
  //   clasif2: '',
  //   delito: '',
  //   todos: '',
  //   doc_bien: '',
  //   proc_doc_dic: '',
  // };
  // pantallaActual: string = '';
  disabledRadio: boolean = false;
  // oficioGestion: IMJobManagement;
  disabledAddresse: boolean = false;
  dataTableGoods: IGoodAndAvailable[] = [];
  statusOf: string = undefined;
  screenKeyManagement: string = 'FACTADBOFICIOGEST';
  screenKeyRelated: string = '';
  screenKey: string = '';
  selectedGood: IGoodAndAvailable;
  notificationData: INotification;
  loadingGoods: boolean = false;
  ReadOnly: boolean;
  public formLoading: boolean = false;
  today = new DatePipe('en-EN').transform(new Date(), 'dd/MM/yyyy');
  // @ViewChild('cveOficio', { static: true }) cveOficio: ElementRef;
  disabledTypes: boolean = false;
  showDestinatario: boolean = false;
  showDestinatarioInput: boolean = false;

  settings3 = { ...this.settings, hideSubHeader: true };
  copyOficio: any[] = [];
  //Good Job Mananagemet
  dataTableGoodsJobManagement: IGoodJobManagement[] = [];

  settingsGoodsJobManagement = {
    ...this.settings,
    actions: {
      edit: false,
      add: false,
      delete: false,
    },
    hideSubHeader: true,
    columns: COLUMNS_GOOD_JOB_MANAGEMENT,
  };

  dataTableDocuments: IDocumentJobManagement[] = [];

  settingsTableDocuments = {
    ...this.settings,
    actions: {
      edit: false,
      add: false,
      delete: true,
    },
    hideSubHeader: true,
    columns: COLUMNS_DOCUMENTS,
  };

  //m_job_management
  formNotification = new FormGroup({
    /** @description  no_volante*/
    wheelNumber: new FormControl(null),
    /** @description no_expediente */
    expedientNumber: new FormControl(null),
    /** @description no_registro*/
    registerNumber: new FormControl(null),
    /** @description  AVERIGUACION_PREVIA*/
    preliminaryInquiry: new FormControl(null),
    /** @description causa_penal*/
    criminalCase: new FormControl(null),
    /** @description tipo_volante */
    wheelType: new FormControl(null),
    /** @description tipo_oficio */
    officeExternalKey: new FormControl(null),
  });

  formJobManagement = new FormGroup({
    /** @description no_volante */
    flyerNumber: new FormControl(''),
    /** @description tipo_oficio */
    jobType: new FormControl(''),
    /** @description no_of_gestion */
    managementNumber: new FormControl(''),
    /** @description  destinatario*/
    addressee: new FormControl<IRSender>(null),
    /** @description remitente */
    sender: new FormControl<IRSender>(null), // remitente
    /** @descripiton  cve_cargo_rem*/
    cveChargeRem: new FormControl(''),
    /**@description DES_REMITENTE_PA */
    desSenderpa: new FormControl(
      'Con fundamento en el artículo 24 del Reglamento Interior del Servicio de Administración de Bienes Asegurados, el Jefe de Departamento de dictaminación de expedientes de bienes asegurados del cuarto transitorio, firma en ausencia de la Directora Jurídica Consultiva.'
    ),
    /** @description NO_DEL_REM */
    delRemNumber: new FormControl(''),
    /** @description NO_DEP_REM */
    depRemNumber: new FormControl(''),
    /** @description oficio_por */
    jobBy: new FormControl(''),
    /** @description cve_of_gestion */
    cveManagement: new FormControl(''),
    city: new FormControl<{
      id: number | string;
      legendOffice: string;
      idName: string;
    }>(null), // ciudad,
    /** @description estatus_of */
    statusOf: new FormControl(''),
    /**@description se_refiere_a */
    refersTo: new FormControl(''),
    /** @Description texto1 */
    text1: new FormControl(''),
    /** @Description texto2 */
    text2: new FormControl(''),
    /** @Description texto3 */
    text3: new FormControl(''),
    /** @description usuaro_insert */
    insertUser: new FormControl(''),
    /**@description  fecha_inserto*/
    insertDate: new FormControl(''),
    /**@description num_clave_armada */
    armedKeyNumber: new FormControl(''),
    tipoTexto: new FormControl(''),
    /**@descripcion no_expediente */
    proceedingsNumber: new FormControl(''),
    /**@description nom_pers_ext*/
    nomPersExt: new FormControl(''),
  });

  formVariables = new FormGroup({
    b: new FormControl(''),
    d: new FormControl(''),
    dictamen: new FormControl(''),
    classify: new FormControl(''),
    classify2: new FormControl(''),
    crime: new FormControl(''),
  });

  selectVariable: any;
  checkRefiere: any;
  checkSelectTable: boolean = false;

  constructor(
    private fb: FormBuilder,
    protected flyerService: FlyersService,
    protected override route: ActivatedRoute,
    private router: Router,
    protected siabService: SiabService,
    protected modalService: BsModalService,
    protected sanitizer: DomSanitizer,
    private dictationService: DictationService,
    private serviceRelatedDocumentsService: RelatedDocumentsService,
    protected securityService: SecurityService,
    protected serviceOficces: GoodsJobManagementService,
    protected readonly authService: AuthService,
    private applicationGoodsQueryService: ApplicationGoodsQueryService,
    protected svLegalOpinionsOfficeService: LegalOpinionsOfficeService,
    protected readonly goodServices: GoodService,
    private statusGoodService: StatusGoodService,
    private screenStatusService: ScreenStatusService,
    private DictationXGood1Service: DictationXGood1Service,
    protected goodprocessService: GoodprocessService,
    private massiveGoodService: MassiveGoodService,
    protected notificationService: NotificationService,
    protected mJobManagementService: MJobManagementService,
    protected msProcedureManagementService: ProcedureManagementService,
    protected parametersService: ParametersService,
    protected departmentService: DepartamentService,
    private segAccessAreasService: SegAcessXAreasService,
    private officeManagementSerivice: OfficeManagementService,
    private goodHistoryService: HistoryGoodService, // protected abstract svLegalOpinionsOfficeService: LegalOpinionsOfficeService;
    protected documentsService: DocumentsService,
    protected usersService: UsersService // protected goodProcessService: GoodprocessService, // private expedientService: ExpedientService
  ) {
    super();
    // console.log(authService.decodeToken());
    this.authUser = authService.decodeToken();
    console.log('USER DATA', this.authUser);
    this.settings3 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: false,
        add: false,
        delete: true,
      },
      hideSubHeader: true,
      columns: { ...EXTERNOS_COLUMS_OFICIO },
    };

    RELATED_DOCUMENTS_COLUMNS_GOODS.seleccion = {
      ...RELATED_DOCUMENTS_COLUMNS_GOODS.seleccion,
      onComponentInitFunction: this.onClickSelect,
    };
    RELATED_DOCUMENTS_COLUMNS_GOODS.improcedente = {
      ...RELATED_DOCUMENTS_COLUMNS_GOODS.improcedente,
      onComponentInitFunction: this.onClickImprocedente,
    };
    const screen = this.route.snapshot.paramMap.get('id');
    // if (screen === '2') {
    //   const columns = RELATED_DOCUMENTS_COLUMNS_GOODS;
    //   delete columns.improcedente;
    // }

    // this.settings = {
    //   ...this.settings,
    //   actions: false,
    //   // selectMode: 'multi',
    //   columns: { ...RELATED_DOCUMENTS_COLUMNS_GOODS },
    //   rowClassFunction: (row: any) => {
    //     if (!row.data.available) {
    //       return 'bg-dark text-white disabled-custom';
    //     } else {
    //       return 'bg-success text-white';
    //     }
    //   },
    // };
  }
  selectedRadio: string;

  changeSelection(event: any, id: number) {
    const good = this.dataTableGoodsMap.get(id);
    if (event.target.checked) {
      this.dataGoodsSelected.set(id, good);
    } else {
      this.dataGoodsSelected.delete(id);
    }
  }

  isHideSelection = true;
  disabledChecks() {
    // console.log(this.tableGoods);
    // const columnas = this.tableGoods.grid.getColumns();
    // const columnaOpciones = columnas.find(
    //   columna => columna.id === 'seleccion'
    // );
    // columnaOpciones.hide = true;
    // console.log(this.settings);
    // this.managementForm.get('averiPrevia').disable();
    this.isHideSelection = true;
    this.formVariables.get('b').setValue('S');
    this.formVariables.get('classify').setValue(null);
    this.formVariables.get('classify2').setValue(null);
    this.dataTableGoodsJobManagement = [];
    this.dataTableDocuments = [];
  }

  enableChecks() {
    // const columnas = this.tableGoods.grid.getColumns();
    // const columnaOpciones = columnas.find(
    //   columna => columna.id === 'seleccion'
    // );
    // columnaOpciones.hide = false;
    // this.managementForm.get('averiPrevia').enable();
    this.isHideSelection = false;
    this.formVariables.get('b').setValue('S');
    this.formVariables.get('classify').setValue(null);
    this.formVariables.get('classify2').setValue(null);
    this.dataTableGoodsJobManagement = [];
    this.dataTableDocuments = [];
  }

  onClickSelect(event: any) {
    event.toggle.subscribe((data: any) => {
      console.log(data);
      data.row.seleccion = data.toggle;
    });
  }

  openModalCopy(data: boolean) {
    this.openFormCcp({
      dataEdit: data,
      managementNumber: this.formJobManagement.value.managementNumber,
    });
  }

  openFormCcp(context?: Partial<AddCopyComponent>) {
    const modalRef = this.modalService.show(AddCopyComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.dataCopy.subscribe((next: any) => {
      // console.log('next', next);

      if (next.typePerson_I == 'I') {
        let array = this.copyOficio;
        let arr = [];

        let obj: any = {
          managementNumber: null,
          addresseeCopy: next.senderUser_I,
          delDestinationCopyNumber: null,
          nomPersonExt: null,
          personExtInt: 'I',
          recordNumber: null,
          personExtInt_: 'INTERNO',
          userOrPerson: next.senderUser_I + ' - ' + next.personaExt_I,
        };

        arr.push(obj);
        for (let i = 0; i < array.length; i++) {
          arr.push(array[i]);
        }
        this.copyOficio = arr;
      } else if (next.typePerson_I == 'E') {
        let array = this.copyOficio;
        let arr = [];

        let obj: any = {
          managementNumber: null,
          addresseeCopy: null,
          delDestinationCopyNumber: null,
          nomPersonExt: next.personaExt_I,
          personExtInt: 'E',
          personExtInt_: 'EXTERNO',
          recordNumber: null,
          userOrPerson: next.personaExt_I,
        };

        arr.push(obj);
        for (let i = 0; i < array.length; i++) {
          arr.push(array[i]);
        }
        this.copyOficio = arr;
      }
    });
    modalRef.content.refresh.subscribe((next: any) => {
      this.getCopyOficioGestion__(
        this.formJobManagement.value.managementNumber
      );
    });
  }

  getCopyOficioGestion__(data: any) {
    const params = new ListParams();
    params['filter.managementNumber'] = `$eq:${data}`;
    // return new Promise((resolve, reject) => {
    this.mJobManagementService.getCopyOficeManag(data).subscribe({
      next: async (resp: any) => {
        // this.filtroPersonaExt = resp.data;
        let result = resp.data.map(async (data: any) => {
          if (data.personExtInt == 'I') {
            data['personExtInt_'] = 'INTERNO';
            data['userOrPerson'] = await this.getSenders2OfiM2___(
              data.addresseeCopy
            );
          } else if (data.personExtInt == 'E') {
            data['personExtInt_'] = 'EXTERNO';
            data['userOrPerson'] = data.nomPersonExt;
          }
          // this.usuariosCCP(data)
        });

        Promise.all(result).then((data: any) => {
          this.filtroPersonaExt = resp.data;
          this.copyOficio = resp.data;
          console.log('El usuario tiene', resp.count);
          this.loading = false;
        });
        this.loading = false;
        // resolve(resp);
      },
      error: err => {
        this.loading = false;
        // resolve(null);
      },
    });
    // });
  }

  async getSenders2OfiM2___(user: any) {
    const params = new ListParams();
    params['filter.user'] = `$eq:${user}`;
    return new Promise((resolve, reject) => {
      this.securityService.getAllUsersTracker(params).subscribe(
        (data: any) => {
          // this.formCcpOficio.get('nombreUsuario2').setValue(data.data[0]);
          console.log('COPYY2', data);
          let result = data.data.map(async (item: any) => {
            item['userAndName'] = item.user + ' - ' + item.name;
          });

          resolve(data.data[0].userAndName);

          this.loading = false;
        },
        error => {
          resolve(null);
          this.senders = new DefaultSelect();
        }
      );
    });
  }

  showDeleteAlertCcp(event: any) {
    console.log(event.id);
    if (this.formJobManagement.value.statusOf == 'ENVIADO') {
      return;
    }
    this.alertQuestion('question', 'Se borra el remitente?', '').then(
      async question => {
        if (question.isConfirmed) {
          if (event.id == undefined) {
            let arr = [];
            for (let i = 0; i < this.copyOficio.length; i++) {
              if (this.copyOficio[i] != event) {
                arr.push(this.copyOficio[i]);
              }
            }
            this.onLoadToast('success', 'Se eliminó correctamente', '');
            this.copyOficio = arr;
          } else {
            this.mJobManagementService
              .deleteCopyOficeManag(event.id)
              .subscribe({
                next: value => {
                  let arr = [];

                  for (let i = 0; i < this.copyOficio.length; i++) {
                    if (this.copyOficio[i].id != event.id) {
                      arr.push(this.copyOficio[i]);
                    }
                  }

                  this.copyOficio = arr;
                  this.onLoadToast('success', 'Se eliminó correctamente', '');
                },
                error: err => {},
              });
          }
        }
      }
    );
  }

  onClickImprocedente(event: any) {
    // console.log(event);
    event.toggle.subscribe((data: any) => {
      // console.log(data);
      data.row.improcedente = data.toggle;
    });
  }

  ngOnInit(): void {
    // console.log("status OF: ", this.oficioGestion.statusOf);
    this.getUserInfo();
    this.setInitVariables();
    this.prepareForm();
    // this.route.queryParams
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe((params: any) => {
    //     console.log(params);
    //     this.origin = params['origin'] ?? null;
    // this.paramsGestionDictamen.volante = params['VOLANTE'] ?? null;
    // this.paramsGestionDictamen.expediente = params['EXPEDIENTE'] ?? null;
    // this.paramsGestionDictamen.tipoOf = params['tipoOf'] ?? null;
    // this.formJobManagement
    //   .get('jobType')
    //   .setValue(params['tipoOf'] ?? null);
    // this.paramsGestionDictamen.doc = params['doc'] ?? null;
    // this.paramsGestionDictamen.pDictamen = params['pDictamen'] ?? null;
    // this.paramsGestionDictamen.sale = params['sale'] ?? null;
    // this.paramsGestionDictamen.pGestOk = params['P_GEST_OK'] ?? null;
    // this.paramsGestionDictamen.pllamo = params['PLLAMO'] ?? null; // Se agrego
    // });
    const pantallaActual = this.route.snapshot.paramMap.get('id');
    if (!pantallaActual) {
      this.router.navigateByUrl('/pages/');
      return;
    } else {
      // if (this.pantallaActual == '2' || this.pantallaActual == '1') {
      this.initForm();
      // this.setDataParams();
      // this.pantallaOption = this.flyerService.getPantallaOption(
      //   this.pantallaActual
      // );
      // this.paramsGestionDictamen.sale = 'C';
      if (this.pantallaOption) {
        this.screenKey = this.screenKeyManagement;
        this.initComponentDictamen();
      } else {
        this.screenKey = this.screenKeyRelated;
      }
      // }
      //  else {
      //   this.alertInfo(
      //     'warning',
      //     'Opción no disponible',
      //     'Esta pantalla no existe en el sistema.'
      //   ).then(() => {
      //     this.router.navigateByUrl('/pages/');
      //   });
      // }
    }
    // this.getTypesSelectors();
    this.params.pipe(skip(1), takeUntil(this.$unSubscribe)).subscribe(res => {
      this.goodFilterParams('Todos');
    });
    /*this.params
      .pipe(
        skip(1),
        takeUntil(this.$unSubscribe),
        tap(() => {
          this.getTypesSelectors();
          this.onLoadGoodList('Todos');
        })
      )
      .subscribe(res => {
        this.getGoods1(res);
      });*/
    // if (this.paramsGestionDictamen.tipoOf == 'INTERNO') {
    //   this.showDestinatario = true;
    // } else {
    //   this.showDestinatarioInput = true;
    // }
  }

  setInitVariables() {
    // this.paramsGestionDictamen = {
    //   expediente: 32440,
    //   volante: 1558043,
    //   pDictamen: '10',
    //   pNoTramite: 1044254,
    //   tipoOf: 'INTERNO',
    //   bien: 'N',
    //   sale: 'D',
    //   doc: 'N',
    //   pGestOk: null,
    // };
    // {
    //   volante: 1557802,
    //   expediente: 619252,
    //   doc: null,
    //   tipoOf: null,
    //   sale: '',
    //   bien: '',
    //   pGestOk: null,
    //   pNoTramite: null,
    //   pDictamen: null,
    // };
    // this.variables = {
    //   dictamen: '',
    //   b: '',
    //   d: '',
    //   dictaminacion: '',
    //   clasif: '',
    //   clasif2: '',
    //   delito: '',
    //   todos: '',
    //   doc_bien: '',
    //   proc_doc_dic: '',
    // };
    this.notificationData = null;
  }

  // setDataParams() {
  //   let paramsData = this.serviceRelatedDocumentsService.getParams(
  //     this.pantallaActual
  //   );
  //   if (paramsData != false && paramsData) {
  //     if (this.pantallaActual == '1') {
  //       // this.paramsGestionDictamen = paramsData;
  //     } else {
  //       // console.log(paramsData);
  //     }
  //   }
  //   // console.log(paramsData, this.paramsGestionDictamen);
  //   this.managementForm
  //     .get('noVolante')
  //     .setValue(this.paramsGestionDictamen.volante);
  //   this.managementForm
  //     .get('noExpediente')
  //     .setValue(this.paramsGestionDictamen.expediente);
  //   this.managementForm
  //     .get('tipoOficio')
  //     .setValue(this.paramsGestionDictamen.tipoOf);
  //   this.managementForm.updateValueAndValidity();
  // }

  prepareForm() {
    this.managementForm = this.fb.group({
      ccp_person_1: [{ value: '', disabled: false }],
      ccp_TiPerson_1: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      ccp_addressee_1: [
        { value: null, disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ], // SELECT
      ccp_person: [{ value: '', disabled: false }],
      ccp_addressee: [
        { value: null, disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      ccp_TiPerson: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      noVolante: [
        null,
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ],
      ],
      noExpediente: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.maxLength(11),
        ],
      ],
      tipoOficio: [null, [Validators.required]],
      relacionado: [
        { value: '', disabled: true },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(15)],
      ],
      numero: [{ value: '', disabled: true }, [Validators.maxLength(40)]],
      cveGestion: [null],
      noRemitente: [null],
      remitente: [null],
      noDestinatario: [null],
      destinatario: [null],
      destinatarioInput: [null],
      noCiudad: [null],
      ciudad: [null],
      claveOficio: [null],
      checkText: [null],
      parrafoInicial: [null, Validators.pattern(STRING_PATTERN)],
      tipoTexto: [null],
      justificacion: [null, Validators.pattern(STRING_PATTERN)],
      justificacionDetalle: [null],
      noOficio: [null],
      subtipo: [null],
      goodTypes: [null],
      improcedente: [false],
      di_desc_estatus: [''],
      // indPDoctos: [null],
      noBienes: [null],
      // bienes: [null],
      noBienes2: [null],
      // bienes2: [null],
      noDocumento: [null],
      // documento: [null],
      noDocumento2: [null],
      // documento2: [null],
      parrafoFinal: [null, Validators.pattern(STRING_PATTERN)],
      text3: [null, Validators.pattern(STRING_PATTERN)],
      // parrafoAusencia: [null, Validators.pattern(STRING_PATTERN)],
      fechaAcuse: [{ value: '', disabled: true }],
      ccp: [null],
      ccp2: [null],
      ccp3: [null],
      ccp4: [null],
      ccp5: [null],
      averiPrevia: ['', [Validators.required]], //*
      ccp6: [null],
      wheelStatus: [null],
    });
  }

  initComponentDictamen() {
    this.ReadOnly = true;
    // this.getNotificationData();
    // if (
    //   this.managementForm.get('numero').value ||
    //   this.managementForm.get('numero').value == '0' ||
    //   this.managementForm.get('numero').value == 0
    // ) {
    //   this.validOficioGestion();
    // } else {
    //   this.alert(
    //     'warning',
    //     'No existe un valor para Número de Gestión',
    //     'Sin valor'
    //   );
    // }
  }

  initForm() {
    const wheelNumber = this.getQueryParams('VOLANTE');
    const expedient = this.getQueryParams('EXPEDIENTE');

    this.formJobManagement.get('proceedingsNumber').setValue(expedient);
    this.formJobManagement
      .get('insertDate')
      .setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en-US'));
    this.getNotification(wheelNumber, expedient).subscribe({
      next: async res => {
        this.formJobManagement
          .get('flyerNumber')
          .setValue(res.wheelNumber as any);
        this.formJobManagement
          .get('flyerNumber')
          .setValue(res.wheelNumber as any);

        this.formNotification.patchValue(res);
        this.getTypesSelectors();
        this.managementForm.get('noVolante').setValue(res.wheelNumber);
        this.managementForm.get('noExpediente').setValue(res.expedientNumber);
        this.managementForm.get('wheelStatus').setValue(res.wheelStatus);
        try {
          await firstValueFrom(this.getMJobManagement(res.wheelNumber));
        } catch (e) {
          this.isCreate = true;
          if (this.formNotification.value.expedientNumber) {
            // console.log('refreshTableGoods');
            this.refreshTableGoods();
          }
        }
        // this.loadInfo(mJobManagement);
        // console.log('res', res);
        // if (res.expedientNumber) {
        //   this.refreshTableGoods();
        // }
      },
    });
  }

  isDisabledBtnCcp = false;
  async loadInfo(mJobManagement: IMJobManagement) {
    console.log('res', this.formNotification.value.expedientNumber);
    if (mJobManagement) {
      try {
        this.m_job_management = mJobManagement;
        this.formJobManagement.patchValue({
          ...mJobManagement,
          city: {
            id: mJobManagement.city,
            legendOffice: null,
            idName: mJobManagement.city,
          },
          sender: {
            usuario: mJobManagement.sender,
            nombre: null,
            userAndName: mJobManagement.sender,
          } as any,
          addressee:
            mJobManagement.jobType == 'INTERNO' || mJobManagement?.addressee
              ? ({
                  usuario: mJobManagement.addressee,
                  nombre: null,
                  userAndName: mJobManagement.addressee as any,
                } as any)
              : null,
        });
        if (this.formJobManagement.value.statusOf === 'ENVIADO') {
          console.log('ENVIADO');
          this.isDisabledBtnCcp = true;
          // this.settings3.actions.delete = false;
          this.isDisabledBtnDocs = true;
          this.formJobManagement.disable();
        }
        if (mJobManagement.city) {
          this.getCity(mJobManagement.city).subscribe({
            next: res => {
              this.formJobManagement.get('city').setValue({
                id: res.idCity,
                legendOffice: res.legendOffice,
                idName: res.idCity + ' - ' + res.legendOffice,
              });
            },
          });
        }

        if (mJobManagement.sender) {
          const params = new ListParams();
          params.limit = 1;
          params['search'] = mJobManagement.sender;
          this.flyerService.getSenderUser(params).subscribe({
            next: res => {
              const i = res.data[0];
              this.formJobManagement.get('sender').setValue({
                usuario: i.userDetail.id,
                userAndName: i.userDetail.id + ' - ' + i.userDetail.name,
                name: i.userDetail.name,
              } as any);
            },
          });
        }

        if (mJobManagement.addressee && mJobManagement.jobType == 'INTERNO') {
          const params = new ListParams();
          params.limit = 1;
          params['search'] = mJobManagement.addressee;
          this.mJobManagementService.getRegAddressee(params).subscribe(
            data => {
              let res = data.data[0];
              this.formJobManagement.get('addressee').setValue({
                ...res,
                userAndName: res.usuario + ' - ' + res.nombre,
              } as any);
            },
            () => {}
          );
        }

        if (mJobManagement.managementNumber) {
          this.refreshTableGoodsJobManagement();
          this.refreshTableDocuments();
          this.refreshTableCopies();
        }

        if (mJobManagement.statusOf == 'ENVIADO') {
          this.formJobManagement.disable();
        }
        if (mJobManagement.refersTo == this.se_refiere_a.A) {
          this.se_refiere_a_Disabled.B = true;
          this.se_refiere_a_Disabled.C = true;
          this.disabledChecks();
        }
        if (mJobManagement.refersTo == this.se_refiere_a.B) {
          this.se_refiere_a_Disabled.A = true;
          this.se_refiere_a_Disabled.C = true;
          this.enableChecks();
        }
        if (mJobManagement.refersTo == this.se_refiere_a.C) {
          this.formVariables.get('b').setValue('N');
          this.se_refiere_a_Disabled.A = true;
          this.se_refiere_a_Disabled.B = true;
        }
      } catch (e) {
        this.isCreate = true;
        console.log(e);
      }
    }
    if (this.formNotification.value.expedientNumber) {
      console.log('refreshTableGoods');
      this.refreshTableGoods();
    }
  }

  isLoadingDocuments = false;
  refreshTableDocuments() {
    this.isLoadingDocuments = true;
    this.getDocJobManagement().subscribe({
      next: async res => {
        console.log('getDocJobManagement', res);
        const response = await res.data.map(async item => {
          const params = new ListParams();
          params['filter.id'] = item.cveDocument;
          params.limit = 1;
          params.page = 1;
          const description = await firstValueFrom(
            this.getDocumentForDictation(params).pipe(map(res => res.data[0]))
          );
          return {
            ...item,
            description: description.description,
            key: description.key,
          };
        });
        this.isDisabledBtnDocs = true;
        this.settingsTableDocuments.actions = {
          edit: false,
          add: false,
          delete: false,
        };
        this.tableDocs.initGrid();

        // this.tableDocs.settings = {
        //   action: {
        //     edit: false,
        //     add: false,
        //     delete: false,
        //   },
        // };
        // this.tableDocs.
        this.dataTableDocuments = await Promise.all(response);
        this.isLoadingDocuments = false;
      },
      error: () => {
        this.isLoadingDocuments = false;
      },
    });
  }

  refreshTableCopies() {
    this.getCopyOficioGestion__(this.formJobManagement.value.managementNumber);
  }

  refreshTableGoods() {
    const params = new ListParams();

    params['filter.fileNumber'] = this.formNotification.value.expedientNumber;
    this.getGoods1(params);
  }

  async refreshTableGoodsJobManagement() {
    const params = new ListParams();
    params['filter.managementNumber'] =
      this.formJobManagement.value.managementNumber;
    params.limit = 100000000;
    try {
      this.dataTableGoodsJobManagement = (
        await this.getGoodsJobManagement(params)
      ).data;
    } catch (ex) {
      console.log(ex);
    }
  }

  getQueryParams(name: string) {
    return this.route.snapshot.queryParamMap.get(name);
  }

  // async validOficioGestion() {
  //   const params = new FilterParams();
  //   params.addFilter(
  //     'managementNumber',
  //     this.managementForm.get('numero').value
  //   );
  //   params.addFilter('jobBy', 'POR DICTAMEN');
  //   await this.flyerService.getMOficioGestion(params.getParams()).subscribe({
  //     next: res => {
  //       console.log('Dicataminacion', res.data[0]);
  //       if (res.count == 0) {
  //         // this.getDictationByWheel();
  //       } else {
  //         this.oficioGestion = res.data[0];
  //         this.statusOf = res.data[0].statusOf;
  //         this.setDataOficioGestion();
  //         // Se tiene el registro
  //         this.initFormFromImages();
  //       }
  //     },
  //     error: err => {
  //       console.log(err);
  //       // this.getDictationByWheel();
  //     },
  //   });
  // }

  // setDataOficioGestion() {
  //   this.managementForm.get('tipoOficio').setValue(this.oficioGestion.jobType);
  //   // console.log('asfasfasfasfa', this.oficioGestion);
  //   // this.managementForm.get('statusOf').setValue(this.oficioGestion.statusOf);
  //   this.managementForm.get('relacionado').setValue(this.oficioGestion.jobBy);
  //   this.managementForm
  //     .get('numero')
  //     .setValue(this.oficioGestion.managementNumber);
  //   this.managementForm
  //     .get('cveGestion')
  //     .setValue(this.oficioGestion.cveManagement);
  //   // Set remitente, destinatario y ciudad
  //   this.managementForm
  //     .get('parrafoInicial')
  //     .setValue(this.oficioGestion.text1);
  //   this.managementForm.get('parrafoFinal').setValue(this.oficioGestion.text2);
  //   this.managementForm.get('text3').setValue(this.oficioGestion.text3);
  //   this.managementForm
  //     .get('justificacionDetalle')
  //     .setValue(this.oficioGestion.justification);
  //   this.managementForm
  //     .get('justificacion')
  //     .setValue(this.oficioGestion.justification);
  // }

  // reviewParametersGestion() {
  //   if (this.paramsGestionDictamen.sale == 'C') {
  //     // A, B, D
  //     if (this.se_refiere_a.C == this.managementForm.get('tipoOficio').value) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else if (this.paramsGestionDictamen.sale == 'D') {
  //     // C
  //     if (this.se_refiere_a.C == this.managementForm.get('tipoOficio').value) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return true;
  //   }
  // }

  async getDictationByWheel() {
    if (
      this.managementForm.get('noVolante').invalid ||
      this.managementForm.get('noExpediente').invalid
    ) {
      return;
    }
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('wheelNumber', this.managementForm.get('noVolante').value);
    params.addFilter(
      'expedientNumber',
      this.managementForm.get('noExpediente').value
    );
    await this.flyerService
      .getNotificationByFilter(params.getParams())
      .subscribe({
        next: res => {
          console.log(res);
        },
        error: err => {
          console.log(err);
        },
      });
  }

  initFormFromImages() {
    // SET VARIABLES
    console.log('set vars');
  }

  validOficioEXTERNO() {
    if (
      this.managementForm.get('tipoOficio').value == 'EXTERNO' // &&
      // this.paramsGestionDictamen.pllamo != 'ABANDONO'
    ) {
      this.managementForm
        .get('parrafoInicial')
        .setValue(TEXT1(this.managementForm.get('noOficio').value));
      this.managementForm.get('parrafoFinal').setValue(TEXT2);
    } else if (
      this.managementForm.get('tipoOficio').value == 'EXTERNO' // &&
      // this.paramsGestionDictamen.pllamo == 'ABANDONO'
    ) {
      this.managementForm.get('parrafoInicial').setValue(TEXT1Abandono);
      this.managementForm.get('parrafoFinal').setValue('SASASASASAS');
    } else {
      this.disabledRadio = true;
    }
  }

  changeSender(sender: IRSender) {
    console.log({ sender });
    // if (this.managementForm.get('tipoOficio').value == 'EXTERNO') {
    //   this.managementForm.get('destinatario').disable();
    //   this.managementForm.get('destinatario').updateValueAndValidity();
    //   this.disabledAddresse = true;
    // } else if (this.managementForm.get('tipoOficio').value == 'INTERNO') {
    //   this.managementForm.get('destinatario').enable();
    //   this.managementForm.get('destinatario').updateValueAndValidity();
    //   this.disabledAddresse = false;
    // } else {
    //   this.managementForm.get('destinatario').enable();
    //   this.managementForm.get('destinatario').updateValueAndValidity();
    //   this.disabledAddresse = false;
    // }
    //     select usu.usuario,
    //        usu.nombre,
    //        AXA.NO_DELEGACION,
    //        AXA.NO_SUBDELEGACION,
    //        AXA.NO_DEPARTAMENTO
    // from seg_usuarios usu,
    //      seg_acceso_x_areas  axa
    // where usu.usuario   = axa.usuario
    this.formJobManagement.get('delRemNumber').setValue(sender.no_delegacion);
    // this.formJobManagement.value.
    this.formJobManagement.get('depRemNumber').setValue(sender.no_departamento);
    //TODO: lov remitente
  }

  changeTextType() {
    let textRespone = this.serviceRelatedDocumentsService.changeTextType(
      this.formJobManagement.get('tipoTexto').value,
      this.managementForm.get('noOficio').value
    );
    this.formJobManagement.get('text1').setValue(textRespone.text1);
    this.formJobManagement.get('text3').setValue(textRespone.text2);
  }

  changeOffice() {
    const elemC = document.getElementById('se_refiere_a_C') as HTMLInputElement;
    elemC.checked = true;
    const elemB = document.getElementById('se_refiere_a_B') as HTMLInputElement;
    elemB.checked = false;
    const elemA = document.getElementById('se_refiere_a_A') as HTMLInputElement;
    elemA.checked = false;

    this.se_refiere_a_Disabled.C = false;
    // if (this.paramsGestionDictamen.sale == 'C') {
    //   this.alertInfo('warning', PARAMETERSALEC, '');
    //   return;
    // }
    if (this.formJobManagement.value?.statusOf == 'ENVIADO') {
      this.alertInfo('warning', MANAGEMENTOFFICESTATUSSEND, '');
      return;
    }
    if (this.formJobManagement.value?.managementNumber) {
      // /api/v1/m-job-management por numero de gestion
      // ### si tiene registros se eliminan  --- y se hace LIP_COMMIT_SILENCIOSO;
      // this.getGoodsJobManagement();
      // /api/v1/document-job-management por numero de gestion
      // ### si tiene registros se eliminan  --- y se hace LIP_COMMIT_SILENCIOSO;  ---  y setea VARIABLES.D en S
      ///
      /// se refiere a --- activa opcion A y B
      ///
      this.se_refiere_a_Disabled.A = false;
      this.se_refiere_a_Disabled.B = false;
    }
    // if (this.paramsGestionDictamen.sale == 'D') {
    //   this.se_refiere_a_Disabled.C = false;
    // } else {
    //   this.se_refiere_a_Disabled.C = true;
    // }
    // y setea VARIABLES.B en N
  }

  // async getGoodsJobManagement() {
  //   if (this.formJobManagement.value.managementNumber) {
  //     const params = new FilterParams();
  //     params.removeAllFilters();
  //     params.addFilter(
  //       'managementNumber',
  //       this.formJobManagement.value.managementNumber
  //     );
  //     await this.flyerService.getMOficioGestion(params.getParams()).subscribe({
  //       next: res => {
  //         console.log(res);
  //         if (res.count != 0) {
  //           this.managementForm.get('tipoOficio').setValue('D');
  //         }
  //         this.getDocumentsJobManagement();
  //       },
  //       error: err => {
  //         console.log(err);
  //         this.getDocumentsJobManagement();
  //       },
  //     });
  //   } else {
  //     this.alertInfo(
  //       'warning',
  //       'No existe el Número de Gestión: ' +
  //         this.formJobManagement.value.managementNumber,
  //       ''
  //     );
  //   }
  // }

  async getDocumentsJobManagement() {
    // if (this.oficioGestion.managementNumber) {
    //   const params = new FilterParams();
    //   params.removeAllFilters();
    //   params.addFilter('managementNumber', this.oficioGestion.managementNumber);
    //   await this.flyerService
    //     .getGoodsJobManagement(params.getParams())
    //     .subscribe({
    //       next: res => {
    //         console.log(res);
    //         if (res.count != 0) {
    //           this.variables.d = 'S';
    //         }
    //         this.getGoods();
    //       },
    //       error: err => {
    //         this.getGoods();
    //         console.log(err);
    //       },
    //     });
    // } else {
    //   this.alertInfo(
    //     'warning',
    //     'No existe el Número de Gestión: ' +
    //     this.oficioGestion.managementNumber,
    //     ''
    //   );
    // }
  }

  // INCIDENCIAS 675 Y 681 --- INTEGRADO
  async getGoods() {
    this.loadingGoods = true;
    this.dataGood = [];
    let objBody: any = {
      screenKey: this.screenKey,
    };
    // Validar con tipos de notificaciones
    if (
      this.managementForm.get('goodTypes').value == '' ||
      this.managementForm.get('goodTypes').value == 'null' ||
      this.managementForm.get('goodTypes').value == null
    ) {
      // Por expediente
      objBody['fileNumber'] = this.notificationData.expedientNumber;
    } else {
      // Por número de clasificación
      objBody['clasifGoodNumber'] = this.managementForm.get('goodTypes').value;
    }
    await this.flyerService
      .getGoodSearchGoodByFileAndClasif(
        objBody,
        objBody,
        objBody['fileNumber'] ? 'file' : ''
      )
      .subscribe({
        next: res => {
          console.log(res);
          // this.dataGood = res.data;
          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index];
            if (element) {
              this.dataGood.push({
                goodId: element.goodId,
                description: element.description,
                quantity: element.quantity,
                identifier: element.identifier,
                status: element.status,
                desEstatus: '',
                seleccion: false,
                improcedente: false,
                disponible: true,
              });
            }
          }
          this.reviewGoodData(this.dataGood[0], 0, res.count);
        },
        error: err => {
          console.log(err);
        },
      });
  }

  reviewGoodData(dataGoodRes: IDataGoodsTable, count: number, total: number) {
    // this.getGoodStatusDescription(dataGoodRes, count, total);
  }

  // AGREGAR UN FOR PARA LOS BIENES
  // async getGoodStatusDescription(
  //   dataGoodRes: IDataGoodsTable,
  //   count: number,
  //   total: number
  // ) {
  //   const params = new ListParams();
  //   params['filter.status'] = '$eq:' + dataGoodRes.status;
  //   console.log(params, this.dataGood);
  //   await this.flyerService.getGoodStatusDescription(params).subscribe({
  //     next: res => {
  //       // console.log("Respuesta: ", res.count);
  //       // console.log('params, ', this.dataGood);
  //       this.dataGood[count].desEstatus = res.data[0].description;
  //       this.totalItems = res.count;
  //       this.getAvailableGood(this.dataGood[count], count, total);
  //     },
  //     error: err => {
  //       console.log(err);
  //       console.log('params, ', this.dataGood);
  //       this.dataGood[count].desEstatus = 'Error al cargar la descripción.';
  //       this.getAvailableGood(this.dataGood[count], count, total);
  //     },
  //   });
  // }

  // changeImprocedenteDisabled(event: any) {
  //   this.dataGood.forEach(element => {});
  //   this.dataGoodTable.load(this.dataGood);
  //   this.dataGoodTable.refresh();
  // }

  // changeImprocedente(event: any) {
  //   this.dataGood.forEach(element => {
  //     if (element.disponible) {
  //       element.improcedente = event.checked;
  //       element.seleccion = false;
  //     }
  //   });
  //   this.dataGoodTable.load(this.dataGood);
  //   this.dataGoodTable.refresh();
  // }

  async getAvailableGood(
    dataGoodRes: IDataGoodsTable,
    count: number,
    total: number
  ) {
    if (this.formJobManagement.value.managementNumber) {
      await this.flyerService
        .getGoodsJobManagementByIds({
          goodNumber: dataGoodRes.goodId,
          managementNumber: this.formJobManagement.value.managementNumber,
        })
        .subscribe({
          next: res => {
            console.log(res);
            if (res.count > 0) {
              this.dataGood[count].disponible = false;
            }
            this.validStatusGood(this.dataGood[count], count, total);
          },
          error: err => {
            console.log(err);
            this.dataGood[count].disponible = true;
            this.validStatusGood(this.dataGood[count], count, total);
          },
        });
    } else {
      this.dataGood[count].disponible = true;
      this.validStatusGood(this.dataGood[count], count, total);
    }
  }

  async validStatusGood(
    dataGoodRes: IDataGoodsTable,
    count: number,
    total: number
  ) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('goodNumber', dataGoodRes.goodId);
    await this.flyerService
      .getGoodExtensionsFields(params.getFilterParams())
      .subscribe({
        next: res => {
          console.log(res);
          if (res.data[0].managementJob == '1') {
            this.dataGood[count].seleccion = true;
            this.dataGood[count].improcedente = false;
          } else if (res.data[0].managementJob == '2') {
            this.dataGood[count].seleccion = false;
            this.dataGood[count].improcedente = true;
          } else {
            this.dataGood[count].seleccion = false;
            this.dataGood[count].improcedente = false;
          }
          count++;
          if (total > count) {
            this.reviewGoodData(this.dataGood[count], count, total);
          } else if (total == count) {
            this.dataGoodTable.load(this.dataGood);
            this.dataGoodTable.refresh();
            this.loadingGoods = false;
          }
        },
        error: err => {
          console.log(err);
          this.dataGood[count].seleccion = false;
          this.dataGood[count].improcedente = false;
          count++;
          if (total > count) {
            this.reviewGoodData(this.dataGood[count], count, total);
          } else if (total == count) {
            this.dataGoodTable.load(this.dataGood);
            this.dataGoodTable.refresh();
            this.loadingGoods = false;
          }
        },
      });
  }

  // async getNotificationData() {
  //   if (
  //     this.paramsGestionDictamen.volante ||
  //     this.paramsGestionDictamen.expediente
  //   ) {
  //     const params = new FilterParams();
  //     params.removeAllFilters();
  //     params.addFilter('wheelNumber', this.paramsGestionDictamen.volante);
  //     if (this.paramsGestionDictamen.expediente) {
  //       params.addFilter(
  //         'expedientNumber',
  //         this.paramsGestionDictamen.expediente
  //       );
  //     }
  //     await this.flyerService
  //       .getNotificationByFilter(params.getParams())
  //       .subscribe({
  //         next: res => {
  //           console.log('prueba', res);
  //           this.notificationData = res.data[0];
  //           this.statusOf = res.data[0].wheelStatus;
  //           this.setDataNotification();
  //         },
  //         error: err => {
  //           console.log(err);
  //         },
  //       });
  //   } else {
  //     this.alertInfo(
  //       'warning',
  //       'No existe el Número de Expediente: ' +
  //         this.paramsGestionDictamen.expediente +
  //         ' ni el Número de Volante: ' +
  //         this.paramsGestionDictamen.volante +
  //         ' para consultar la información.',
  //       ''
  //     );
  //   }
  // }

  setDataNotification() {
    this.managementForm
      .get('noOficio')
      .setValue(this.notificationData.officeExternalKey);
    this.managementForm
      .get('fechaAcuse')
      .setValue(this.notificationData.desKnowingDate);
    this.getGoods();
  }

  /**
   * Data Selects
   */

  // INCIDENCIA 726 ---   ### CARGAR SUBTIPOS
  /**
   * Obtener el listado de Clasif --- Sub Tipo --- Ssub tipo --- Sssubtipo
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  async getClasifSubTypeGoods(paramss: ListParams) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('clasifGood', paramss['search'], SearchFilter.LIKE);
    await this.flyerService
      .getClasifSubTypeGoods(this.notificationData.expedientNumber)
      .subscribe({
        next: res => {
          this.goodTypes = new DefaultSelect(
            res.data.map(i => {
              i.clasifGood =
                i.clasifGoodNumber +
                ' -- ' +
                i.subtypeDesc +
                ' -- ' +
                i.ssubtypeDesc +
                ' -- ' +
                i.sssubtypeDesc;
              return i;
            })
          );
        },
        error: err => {
          console.log(err);
          this.goodTypes = new DefaultSelect();
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al consultar los subtipos'
          );
        },
      });
  }

  /**
   * INCIDENCIA 581 --- CORRECTO
   * @returns
   */
  getJustification(paramsData: ListParams) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('type', 3, SearchFilter.NOT);
    params.addFilter('clarifications', paramsData['search'], SearchFilter.LIKE);
    let subscription = this.flyerService
      .getJustificacion(params.getFilterParams())
      .subscribe({
        next: data => {
          console.log(data);
          this.justificacion = new DefaultSelect(
            data.data.map(i => {
              i.clarifications = i.id + ' -- ' + i.clarifications;
              return i;
            }),
            data.count
          );
          subscription.unsubscribe();
        },
        error: err => {
          this.justificacion = new DefaultSelect();
          console.log(err);
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al consultar las Justificaciones'
          );
          subscription.unsubscribe();
        },
      });
  }

  /**
   * Obtener el listado de Ciudad de acuerdo a los criterios de búsqueda
   * @param paramsData Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getCityByDetail(paramsData: ListParams) {
    const params = new FilterParams();
    params.removeAllFilters();
    if (paramsData['search']) {
      params.addFilter('nameCity', paramsData['search'], SearchFilter.LIKE);
    }
    let subscription = this.flyerService
      .getCityBySearch(params.getFilterParams())
      .subscribe({
        next: data => {
          const result = data.data.map(i => {
            i.nameCity = i.idCity + ' -- ' + i.legendOffice;
            return {
              id: i.idCity,
              legendOffice: i.legendOffice,
              idName: i.idCity + ' -- ' + i.legendOffice,
            };
          });
          this.cities = new DefaultSelect(result, data.count);
          subscription.unsubscribe();
        },
        error: error => {
          this.cities = new DefaultSelect();
          this.onLoadToast('error', 'Error', error.error.message);
          subscription.unsubscribe();
        },
      });
  }

  isLoadingSender = false;
  /**
   * Obtener el listado de Remitente
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  async getSenderByDetail(params: ListParams) {
    // this.isLoadingSender = true;
    params.take = 20;
    params['order'] = 'DESC';
    const delegationNumber = (await this.getUserInfo()).delegationNumber as any;
    params['no_delegacion'] = delegationNumber;
    params['search'] = params['search'] ? params['search'] : '';
    this.mJobManagementService.getRegSender(params).subscribe({
      next: data => {
        console.log(data);
        let result = data.data.map(item => {
          return {
            ...item,
            userAndName: item.usuario + ' - ' + item.nombre,
          };
        });
        this.senders = new DefaultSelect(result, data.count);
        this.isLoadingSender = false;
      },
      error: err => {
        console.log(err);
        this.select = new DefaultSelect([], 0);
        this.isLoadingSender = false;
      },
    });
  }

  // send(): any {
  //   let token = this.authService.decodeToken();
  //   const pNumber = Number(token.department);
  //   this.applicationGoodsQueryService.getDictamenSeq(pNumber).subscribe({
  //     next: (response: any) => {
  //       this.generateCveOficio(response.dictamenDelregSeq);
  //       // document.getElementById('cveOficio').focus();
  //       // this.cveOficio.nativeElement.focus();
  //       // setTimeout(
  //       //   () =>
  //       //     this.alert(
  //       //       'success',
  //       //       '',
  //       //       'Clave de oficio generada correctamente.'
  //       //     ),
  //       //   1000
  //       // );
  //     },
  //   });
  //   let params = {
  //     PARAMFORM: 'NO',
  //     DESTYPE: this.screenKey,
  //     NO_OF_GES: this.managementForm.controls['numero'].value,
  //     TIPO_OF: this.managementForm.controls['tipoOficio'].value,
  //     VOLANTE: this.managementForm.controls['noVolante'].value,
  //     EXP: this.managementForm.controls['noExpediente'].value,
  //     ESTAT_DIC: 'NO',
  //   };
  //   if (this.managementForm.get('tipoOficio').value == 'INTERNO') {
  //     this.siabService
  //       // .fetchReport('RGERJURDECLARABAND', params)
  //       .fetchReportBlank('blank')
  //       .subscribe(response => {
  //         if (response !== null) {
  //           const blob = new Blob([response], { type: 'application/pdf' });
  //           const url = URL.createObjectURL(blob);
  //           let config = {
  //             initialState: {
  //               documento: {
  //                 urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
  //                 type: 'pdf',
  //               },
  //               callback: (data: any) => {},
  //             }, //pasar datos por aca
  //             class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
  //             ignoreBackdropClick: true, //ignora el click fuera del modal
  //           };
  //           this.modalService.show(PreviewDocumentsComponent, config);
  //         } else {
  //           this.alert('warning', ERROR_REPORT, '');
  //         }
  //       });
  //   } else if (this.managementForm.get('tipoOficio').value == 'EXTERNO') {
  //     this.siabService
  //       // .fetchReport('RGEROFGESTION_EXT', params)
  //       .fetchReportBlank('blank')
  //       .subscribe(response => {
  //         if (response !== null) {
  //           const blob = new Blob([response], { type: 'application/pdf' });
  //           const url = URL.createObjectURL(blob);
  //           let config = {
  //             initialState: {
  //               documento: {
  //                 urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
  //                 type: 'pdf',
  //               },
  //               callback: (data: any) => {},
  //             }, //pasar datos por aca
  //             class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
  //             ignoreBackdropClick: true, //ignora el click fuera del modal
  //           };
  //           this.modalService.show(PreviewDocumentsComponent, config);
  //         } else {
  //           this.alert('warning', ERROR_REPORT, '');
  //         }
  //       });
  //   }
  // }

  // async openModal(context?: Partial<DocumentsFormComponent>) {
  // if (this.pantallaActual == '2') {
  // await this.onClickBtnDocuments();
  //   return;
  // }
  // if (!this.selectVariable) {
  //   this.onLoadToast(
  //     'error',
  //     'Error',
  //     `Especifique el tipo de Dictaminación S `
  //   );
  //   return;
  // }
  // this.expedientService.getNextVal().subscribe({
  //   next: data => {
  //     this.variablesSend.CVE_OF_GESTION = data.nextval;
  //     if (
  //       this.managementForm.get('tipoOficio').value ==
  //       'Se refiere a todos los bienes'
  //     ) {
  //       /* await PUP_AGREGA_BIENES();
  //        await LIP_COMMIT_SILENCIOSO();*/
  //     }
  //     if (
  //       this.managementForm.get('tipoOficio').value ===
  //       'Se refiere a algun (os) bien (es) del expediente'
  //     ) {
  //       /* await PUP_AGREGA_ALGUNOS_BIENES();
  //        await LIP_COMMIT_SILENCIOSO();*/
  //     }
  //   },
  // });
  // if (!this.checkSelectTable) {
  //   this.onLoadToast('error', 'Error', `Seleccione Un Registro de La Tabla `);
  //   return;
  // }
  // if (this.formJobManagement.value.cveManagement !== null) {
  //   /*SELECT COUNT(0) into contador
  //   from BIENES_OFICIO_GESTION
  //   where no_of_gestion = : M_OFICIO_GESTION.no_of_gestion;
  //   if (this.managementForm.get('tipoOficio').value == 'Se refiere a todos los bienes') {
  //     this.variables.clasif = this.variables.clasif || this.formJobManagement.value....
  //      : VARIABLES.CLASIF := : VARIABLES.CLASIF || TO_CHAR(: BIENES_OFICIO_GESTION.CLASIF);
  //     /*PUP_AGREGA_BIENES;
  //     LIP_COMMIT_SILENCIOSO;
  //   }*/
  // }
  // const modalRef = this.modalService.show(DocumentsFormComponent, {
  //   initialState: context,
  //   class: 'modal-lg modal-dialog-centered',
  //   ignoreBackdropClick: true,
  // });
  // }

  // generateCveOficio(noDictamen: string) {
  //   let token = this.authService.decodeToken();
  //   const year = new Date().getFullYear();
  //   let cveOficio = '';
  //   cveOficio =
  //     token.siglasnivel1 + '/' + token.siglasnivel2 + '/' + token.siglasnivel3;
  //   // if (token.siglasnivel4 !== null) {
  //   //   cveOficio = cveOficio + '/' + token.siglasnivel4;
  //   // }
  //   cveOficio = cveOficio + '/' + noDictamen + '/' + year;
  //   this.managementForm.get('cveGestion').setValue(cveOficio);
  // }

  async getFromSelect(params: ListParams) {
    const senderUser = this.formJobManagement.value.sender.usuario;
    params['remitente'] = senderUser;
    this.mJobManagementService.getRegAddressee(params).subscribe(
      data => {
        // console.log({ addressee: data });
        let result = data.data.map(item => {
          return {
            ...item,
            userAndName: item.usuario + ' - ' + item.nombre,
          };
        });
        this.select = new DefaultSelect(result, data.count);
      },
      () => {
        this.select = new DefaultSelect();
      }
    );
  }

  // openForm(legend?: ILegend) {
  //   const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
  //   modalConfig.initialState = {
  //     legend,
  //     callback: (next: boolean, datos: any) => {
  //       if (next) {
  //         this.seteaTabla(datos);
  //       }
  //     },
  //   };
  //   this.modalService.show(ModalPersonaOficinaComponent, modalConfig);
  // }

  // seteaTabla(datos: any) {
  //   let dato: ICopiesJobManagementDto = JSON.parse(JSON.stringify(datos));

  //   let obj = {
  //     managementNumber: this.managementForm.get('numero').value,
  //     addresseeCopy: 0,
  //     delDestinationCopyNumber: 0,
  //     personExtInt: dato.personExtInt,
  //     nomPersonExt: dato.nomPersonExt,
  //     recordNumber: this.managementForm.get('numero').value,
  //   };

  //   this.serviceOficces.createCopiesJobManagement(obj).subscribe({
  //     next: resp => {
  //       console.log('resp  =>  ' + resp);
  //       this.refreshTabla();
  //     },
  //     error: errror => {
  //       this.onLoadToast('error', 'Error', errror.error.message);
  //     },
  //   });
  //   this.refreshTabla();
  //   console.log(
  //     'this.filtroPersonaExt => ' + JSON.stringify(this.filtroPersonaExt)
  //   );
  // }

  refreshTabla() {
    this.filterParams2
      .getValue()
      .addFilter('numero', this.managementForm.value.numero, SearchFilter.EQ);

    this.getPersonaExt_Int(this.filterParams2.getValue().getParams());
  }

  getPersonaExt_Int(params: _Params) {
    this.serviceOficces.getPersonaExt_Int(params).subscribe({
      next: resp => {
        this.filtroPersonaExt = resp.data;
        this.nrSelecttypePerson = resp.data[0].personExtInt;
        this.nrSelecttypePerson_I = resp.data[1].personExtInt;
      },
      error: errror => {
        this.onLoadToast('error', 'Error', errror.error.message);
      },
    });
  }

  // async showDeleteAlert(legend?: any) {
  //   //ILegend
  //   //Desea eliminar el oficio con el expediente ${proceedingsNumber} y No. Oficio ${managementNumber}
  //   if (this.pantallaActual == '1') {
  //     const {
  //       noVolante, //no_volante
  //       wheelStatus, //status
  //     } = this.managementForm.value;
  //     const {
  //       managementNumber, //no_of_gestion
  //       flyerNumber, //no_volante
  //       statusOf, //status_of
  //       cveManagement, //cve_of_gestion
  //       proceedingsNumber, //no_expediente
  //       insertUser, //usuario insert
  //       insertDate, //fecha inserto
  //     } = this.m_job_management;

  //     if (managementNumber == null) {
  //       this.onLoadToast('info', 'No se tiene oficio', '');
  //       return;
  //     }

  //     if (wheelStatus == 'ENVIADO') {
  //       this.onLoadToast(
  //         'info',
  //         'El oficio ya esta enviado no puede borrar',
  //         ''
  //       );
  //       return;
  //     }

  //     if (cveManagement.includes('?') == false) {
  //       this.onLoadToast(
  //         'info',
  //         'La clave está armada, no puede borrar oficio',
  //         ''
  //       );
  //       return;
  //     }

  //     if (insertUser != this.authUser.username) {
  //       const ATJR: any = await this.userHavePermission();
  //       console.log(ATJR);
  //       if (Number(ATJR[0]) == 0) {
  //         this.onLoadToast(
  //           'error',
  //           'Error',
  //           'El Usuario no está autorizado para eliminar el Oficio'
  //         );
  //         return;
  //       }
  //     } else {
  //       this.onLoadToast(
  //         'error',
  //         'Error',
  //         'Usuario inválido para borrar oficio'
  //       );
  //       return;
  //     }

  //     this.alertQuestion(
  //       'warning',
  //       'Eliminar',
  //       `Desea eliminar el oficio con el expediente ${proceedingsNumber} y No. Oficio ${managementNumber}`
  //     ).then(question => {
  //       if (question.isConfirmed) {
  //         if (this.pantallaActual == '1') {
  //           this.deleteOfficeDesahogo(managementNumber, noVolante, insertDate);
  //           //Swal.fire('Borrado', '', 'success');
  //         } else {
  //           this.deleteOfficeRelacionado(managementNumber, noVolante);
  //         }
  //       }
  //     });
  //   } else {
  //     this.onClickBtnDelete();
  //   }
  // }

  // async deleteOfficeDesahogo(
  //   managementNumber: number | string,
  //   noVolante: number | string,
  //   insertDate: string //m_job_management date insert
  // ) {
  //   //console.log(this.dataTableGoodsJobManagement);
  //   //LOOP BIENES_OFICIO_ESTATUS
  //   let limit = 10;
  //   let page = 1;
  //   let quantity = 10;
  //   let goodOfficeManagement: any = null;
  //   let exit = false;
  //   const getData = async () => {
  //     do {
  //       goodOfficeManagement = await this.getGoodOfficeManagements(page, limit);
  //       goodOfficeManagement.data.map(async (item: any) => {
  //         const INSERT_DATE = insertDate;
  //         const body: any = {
  //           insertDate: INSERT_DATE,
  //           goodNum: item.goodNumber.id,
  //           processExtDom: item.goodNumber.extDomProcess,
  //           screen: 'FACTADBOFICIOGEST',
  //           dictum: managementNumber,
  //           status: item.goodNumber.status,
  //         };
  //         const validation = await this.validateGDateToUpdateGoodStatus(body);
  //       });

  //       if (quantity < goodOfficeManagement.count) {
  //         page = page + 1;
  //         quantity = quantity + 10;
  //       } else {
  //         exit = true;
  //       }
  //     } while (exit == false);
  //   };
  //   //const res = await getData();

  //   const management = managementNumber;
  //   const volante = noVolante;
  //   //se elimina bienes_officio_gestion
  //   this.officeManagementSerivice
  //     .removeGoodOfficeManagement(managementNumber)
  //     .subscribe({
  //       next: resp => {
  //         //se elimina COPIAS_OFICIO_GESION
  //         this.officeManagementSerivice
  //           .removeCopiesManagement(managementNumber)
  //           .subscribe({
  //             next: resp => {
  //               //se elimina DOCUM_OFICIO_GESTION
  //               this.officeManagementSerivice
  //                 .removeDocumOfficeManagement(managementNumber)
  //                 .subscribe({
  //                   next: resp => {
  //                     //se elimina M_OFICIO_GESTION
  //                     this.officeManagementSerivice
  //                       .removeMOfficeManagement(managementNumber)
  //                       .subscribe({
  //                         next: async () => {
  //                           //selecciona los dictamenes segun el no_volante
  //                           const existDictamen: any =
  //                             await this.dictationCount(noVolante);
  //                           //actuliza si no tiene dictamenes
  //                           if (existDictamen.count == 0) {
  //                             const notifBody: any = { dictumKey: null };
  //                             this.notificationService
  //                               .update(Number(noVolante), notifBody)
  //                               .subscribe({
  //                                 next: resp => {
  //                                   Swal.fire('Borrado', '', 'success');
  //                                   console.log('resp  =>  ' + resp);
  //                                   this.refreshTabla();
  //                                 },
  //                                 error: (error: {
  //                                   error: { message: string };
  //                                 }) => {
  //                                   this.onLoadToast(
  //                                     'error',
  //                                     'Error al actualizar',
  //                                     error.error.message
  //                                   );
  //                                 },
  //                               });
  //                           } else {
  //                             Swal.fire('Borrado', '', 'success');
  //                             this.refreshTabla();
  //                           }
  //                         },
  //                         error: (error: { error: { message: string } }) => {
  //                           this.onLoadToast(
  //                             'error',
  //                             'Error',
  //                             error.error.message
  //                           );
  //                         },
  //                       });
  //                   },
  //                   error: error => {
  //                     this.onLoadToast('error', 'Error', error.error.message);
  //                   },
  //                 });
  //             },
  //             error: (errror: { error: { message: string } }) => {
  //               this.onLoadToast('error', 'Error', errror.error.message);
  //             },
  //           });
  //       },
  //       error: error => {
  //         this.onLoadToast('error', 'Error al eliminar', error.error.message);
  //       },
  //     });

  //   /*
  //   //actualiza cve_dictamen
  //   const notifBody:any = {dictumKey: null}
  //   this.notificationService.update(Number(noVolante),notifBody).subscribe({
  //     next: resp => {

  //     }
  //   })
  //   */
  // }

  // deleteOfficeRelacionado(
  //   managementNumber: number | string,
  //   noVolante: number | string
  // ) {
  //   const management = managementNumber;
  //   const volante = noVolante;
  //   //se elimina bienes_officio_gestion
  //   this.officeManagementSerivice
  //     .removeGoodOfficeManagement(managementNumber)
  //     .subscribe({
  //       next: resp => {
  //         //se elimina COPIAS_OFICIO_GESION
  //         this.officeManagementSerivice
  //           .removeCopiesManagement(managementNumber)
  //           .subscribe({
  //             next: resp => {
  //               //se elimina DOCUM_OFICIO_GESTION
  //               this.officeManagementSerivice
  //                 .removeDocumOfficeManagement(managementNumber)
  //                 .subscribe({
  //                   next: resp => {
  //                     //se elimina M_OFICIO_GESTION
  //                     this.officeManagementSerivice
  //                       .removeMOfficeManagement(managementNumber)
  //                       .subscribe({
  //                         next: async () => {
  //                           //actualiza los dictamenes en notificaciones
  //                           const notifBody: any = { dictumKey: null };
  //                           this.notificationService
  //                             .update(Number(noVolante), notifBody)
  //                             .subscribe({
  //                               next: resp => {
  //                                 Swal.fire('Borrado', '', 'success');
  //                                 console.log('resp  =>  ' + resp);
  //                                 this.refreshTabla();
  //                               },
  //                               error: (error: {
  //                                 error: { message: string };
  //                               }) => {
  //                                 this.onLoadToast(
  //                                   'error',
  //                                   'Error al actualizar',
  //                                   error.error.message
  //                                 );
  //                               },
  //                             });
  //                         },
  //                         error: (error: { error: { message: string } }) => {
  //                           this.onLoadToast(
  //                             'error',
  //                             'Error',
  //                             error.error.message
  //                           );
  //                         },
  //                       });
  //                   },
  //                   error: error => {
  //                     this.onLoadToast('error', 'Error', error.error.message);
  //                   },
  //                 });
  //             },
  //             error: (errror: { error: { message: string } }) => {
  //               this.onLoadToast('error', 'Error', errror.error.message);
  //             },
  //           });
  //       },
  //       error: error => {
  //         this.onLoadToast('error', 'Error al eliminar', error.error.message);
  //       },
  //     });
  // }

  // changeCopiesType(event: any, ccp: number) {
  //   console.log(event.target.value, ccp);
  //   if (ccp == 1) {
  //     console.log('CCP1');
  //     this.managementForm.get('ccp_addressee').reset();
  //     this.managementForm.get('ccp_TiPerson').reset();
  //     if (event.target.value == 'I') {
  //       this.managementForm.get('ccp_addressee').enable();
  //       this.managementForm.get('ccp_TiPerson').disable();
  //     } else if (event.target.value == 'E') {
  //       this.managementForm.get('ccp_addressee').disable();
  //       this.managementForm.get('ccp_TiPerson').enable();
  //     }
  //   } else {
  //     console.log('CCP2');
  //     this.managementForm.get('ccp_addressee_1').reset();
  //     this.managementForm.get('ccp_TiPerson_1').reset();
  //     if (event.target.value == 'I') {
  //       this.managementForm.get('ccp_addressee_1').enable();
  //       this.managementForm.get('ccp_TiPerson_1').disable();
  //     } else if (event.target.value == 'E') {
  //       this.managementForm.get('ccp_addressee_1').disable();
  //       this.managementForm.get('ccp_TiPerson_1').enable();
  //     }
  //   }
  // }

  // getUsersCopies(
  //   paramsData: ListParams,
  //   ccp: number,
  //   getByValue: boolean = false
  // ) {
  //   const params: any = new FilterParams();
  //   if (paramsData['search'] == undefined) {
  //     paramsData['search'] = '';
  //   }
  //   params.removeAllFilters();
  //   if (getByValue) {
  //     params.addFilter(
  //       'id',
  //       this.managementForm.get('ccp_addressee' + (ccp == 1 ? '' : '_1')).value
  //     );
  //   } else {
  //     params.search = paramsData['search'];
  //     // params.addFilter('name', paramsData['search'], SearchFilter.LIKE);
  //   }
  //   params['sortBy'] = 'name:ASC';
  //   let subscription = this.svLegalOpinionsOfficeService
  //     .getIssuingUserByDetail(params.getParams())
  //     .subscribe({
  //       next: data => {
  //         let tempDataUser = new DefaultSelect(
  //           data.data.map(i => {
  //             i.name = i.id + ' -- ' + i.name;
  //             return i;
  //           }),
  //           data.count
  //         );
  //         if (ccp == 1) {
  //           this.userCopies1 = tempDataUser;
  //         } else {
  //           this.userCopies2 = tempDataUser;
  //         }
  //         console.log(data, this.userCopies1);
  //         subscription.unsubscribe();
  //       },
  //       error: error => {
  //         if (ccp == 1) {
  //           this.userCopies1 = new DefaultSelect();
  //         } else {
  //           this.userCopies2 = new DefaultSelect();
  //         }
  //         subscription.unsubscribe();
  //       },
  //     });
  // }
  // getUsersCopies(
  //   paramsData: ListParams,
  //   ccp: number,
  //   getByValue: boolean = false
  // ) {
  //   const params: any = new FilterParams();
  //   if (paramsData['search'] == undefined) {
  //     paramsData['search'] = '';
  //   }
  //   params.removeAllFilters();
  //   if (getByValue) {
  //     params.addFilter(
  //       'id',
  //       this.managementForm.get('ccp_addressee' + (ccp == 1 ? '' : '_1')).value
  //     );
  //   } else {
  //     params.search = paramsData['search'];
  //     // params.addFilter('name', paramsData['search'], SearchFilter.LIKE);
  //   }
  //   params['sortBy'] = 'name:ASC';
  //   let subscription = this.svLegalOpinionsOfficeService
  //     .getIssuingUserByDetail(params.getParams())
  //     .subscribe({
  //       next: data => {
  //         let tempDataUser = new DefaultSelect(
  //           data.data.map(i => {
  //             i.name = i.id + ' -- ' + i.name;
  //             return i;
  //           }),
  //           data.count
  //         );
  //         if (ccp == 1) {
  //           this.userCopies1 = tempDataUser;
  //         } else {
  //           this.userCopies2 = tempDataUser;
  //         }
  //         console.log(data, this.userCopies1);
  //         subscription.unsubscribe();
  //       },
  //       error: error => {
  //         if (ccp == 1) {
  //           this.userCopies1 = new DefaultSelect();
  //         } else {
  //           this.userCopies2 = new DefaultSelect();
  //         }
  //         subscription.unsubscribe();
  //       },
  //     });
  // }

  //OBTENER TIPOS, SUBTIPOS DESCRIPCION

  getTypesSelectors(event?: any) {
    const expedient = this.formNotification.value.expedientNumber;
    console.log(expedient);
    this.massiveGoodService.chargeGoodsByExpedient(expedient).subscribe({
      next: resp => {
        const all = {
          no_clasif_bien: 'Todos',
          desc_subtipo: '0',
          desc_ssubtipo: 'TODOS',
          desc_sssubtipo: '0',
        };

        resp.data.unshift(all);
        resp.data.map(async (item: any) => {
          item['tipoSupbtipoDescription'] =
            item.no_clasif_bien +
            ' - ' +
            item.desc_subtipo +
            ' - ' +
            item.desc_ssubtipo +
            ' - ' +
            item.desc_sssubtipo;
        });
        resp.data.unshift();
        resp.data[0].tipoSupbtipoDescription =
          resp.data[0].tipoSupbtipoDescription.substring(0, 24);
        this.tiposDatosSelect = new DefaultSelect(resp.data, resp.count);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  typeSelected(type: any) {
    const filter = type.no_clasif_bien;
    console.log('FILTRO DICTAMINACION', filter);
    this.selectVariable = filter;
    this.goodFilterParams(filter);
  }

  selectDictation(event: any) {
    this.formVariables.get('crime').setValue('S');
  }

  goodFilterParams(filter: string) {
    let params = {
      ...this.params.getValue(),
    };
    // params['filter.fileNumber'] = this.paramsGestionDictamen.expediente;
    params['filter.fileNumber'] = this.formNotification.value.expedientNumber;
    if (filter != 'Todos') {
      params['filter.goodClassNumber'] = `$eq:${filter}`;
    }
    this.getGoods1(params);
  }
  // OBTENER BIENES //
  // async onLoadGoodList(filter: any) {
  //   this.formLoading = true;
  //   // this.loadingText = 'Cargando';
  //   let params = {
  //     ...this.params.getValue(),
  //   };
  // async onLoadGoodList(filter: any) {
  //   this.formLoading = true;
  //   // this.loadingText = 'Cargando';
  //   let params = {
  //     ...this.params.getValue(),
  //   };

  //   console.log('FILTER GOODS', filter);

  //   params['filter.fileNumber'] = this.paramsGestionDictamen.expediente;
  //   params['filter.status'] = `$in:ADM,DXV,PRP,CPV,DEP`;

  //   if (filter != 'Todos') {
  //     params['filter.goodClassNumber'] = `$eq:${filter}`;
  //   }
  //   debugger;
  //   //this.filtroTipos(this.paramsGestionDictamen.expediente);
  //   this.goodServices.getByExpedientAndParams(params).subscribe({
  //     next: response => {
  //       console.log(response);
  //       let result = response.data.map(async (item: any) => {
  //         // item['SELECCIONAR'] = 0;
  //         // item['SEL_AUX'] = 0;
  //         // const statusScreen: any = await this.getScreenStatus(item);
  //         // item['est_disponible'] = statusScreen.di_disponible;
  //         // item['no_of_dicta'] = null;
  //         // if (item.est_disponible == 'S') {
  //         //   // : BIENES.NO_OF_DICTA := NULL;
  //         //   item['no_of_dicta'] = null;
  //         //   const dictamenXGood1: any = await this.getDictaXGood(
  //         //     item.id,
  //         //     'ABANDONO'
  //         //   );
  //         //   item['no_of_dicta'] =
  //         //     dictamenXGood1 != null ? dictamenXGood1.ofDictNumber : null;
  //         //   if (dictamenXGood1 != null) {
  //         //     item['est_disponible'] = 'N';
  //         //   }
  //         // }
  //       });

  //       console.log('GOODS OBTENIDOS', response);

  //       this.getStatusGood(response.data[0].status);
  //       Promise.all(result).then((resp: any) => {
  //         this.data1 = response.data;
  //         this.totalItems = response.count;
  //         this.formLoading = false;
  //         this.loading = false;
  //       });

  //       //     IF: BIENES.EST_DISPONIBLE = 'S' THEN
  //       //     : BIENES.NO_OF_DICTA := NULL;
  //       //      FOR REG IN(SELECT NO_OF_DICTA
  //       //                    FROM DICTAMINACION_X_BIEN1
  //       //                   WHERE NO_BIEN = : BIENES.NO_BIEN
  //       //                     AND TIPO_DICTAMINACION = 'ABANDONO')
  //       //     LOOP
  //       //     : BIENES.NO_OF_DICTA := REG.NO_OF_DICTA;
  //       //        : BIENES.EST_DISPONIBLE := 'N';
  //       //     EXIT;
  //       //      END LOOP;
  //       //  END IF;
  //     },
  //     error: err => {
  //       this.loading = false;
  //       this.formLoading = false;
  //       console.log('ERRROR BIEN X EXPEDIENTE', err.error.message);
  //       this.data1 = [];
  //     },
  //   });
  //   this.loading = false;
  // }
  //       //     IF: BIENES.EST_DISPONIBLE = 'S' THEN
  //       //     : BIENES.NO_OF_DICTA := NULL;
  //       //      FOR REG IN(SELECT NO_OF_DICTA
  //       //                    FROM DICTAMINACION_X_BIEN1
  //       //                   WHERE NO_BIEN = : BIENES.NO_BIEN
  //       //                     AND TIPO_DICTAMINACION = 'ABANDONO')
  //       //     LOOP
  //       //     : BIENES.NO_OF_DICTA := REG.NO_OF_DICTA;
  //       //        : BIENES.EST_DISPONIBLE := 'N';
  //       //     EXIT;
  //       //      END LOOP;
  //       //  END IF;
  //     },
  //     error: err => {
  //       this.loading = false;
  //       this.formLoading = false;
  //       console.log('ERRROR BIEN X EXPEDIENTE', err.error.message);
  //       this.data1 = [];
  //     },
  //   });
  //   this.loading = false;
  // }

  getStatusGood(data: any) {
    const params = new ListParams();
    params['filter.status'] = `$eq:${data}`;

    this.statusGoodService.getAll(params).subscribe(
      (response: any) => {
        const { data } = response;
        this.managementForm
          .get('di_desc_estatus')
          .setValue(data[0].description);
        console.log('SCREEN', JSON.stringify(data));
        this.checkSelectTable = true;
      },
      error => {
        console.log('SCREEN', error.error.message);
      }
    );
  }

  filtroTipos(params: any) {
    this.valTiposAll === true;
    let body = {
      no_expediente: params,
      vc_pantalla: 'FACTJURABANDONOS',
    };
    let clasif: number;
    this.goodprocessService.getExpedientePostQuery(body).subscribe({
      next: async (data: any) => {
        clasif = data.count;
        // console.log('DATAAAAAAAAAAAAAAAA', data);

        let result = data.data.map(async (item: any) => {
          item['tipoSupbtipoDescription'] =
            item.no_clasif_bien +
            ' - ' +
            item.desc_subtipo +
            ' - ' +
            item.desc_ssubtipo +
            ' - ' +
            item.desc_sssubtipo;
        });

        Promise.all(result).then((resp: any) => {
          this.tiposData = data.data;
          this.loading = false;
        });
        if (params.id) {
          // await this.countTipos(params.id);
        }
      },
      error: error => {
        if (params.id) {
          // this.countTipos(params.id);
        }
        console.log('NIAS', error.error);
      },
    });
  }

  async countTipos(params: any) {
    let body = {
      no_expediente: params,
      vc_pantalla: 'FACTADBOFICIOGEST',
    };
    this.goodprocessService.getCountBienStaScreen(body).subscribe({
      next: data => {
        if (data.clasif > 0) {
          this.valTiposAll = true;
        } else {
          this.valTiposAll = false;
        }
      },
      error: error => {
        console.log(error.error);
      },
    });
  }

  getScreenStatus(good: any) {
    let obj = {
      identifier: good.identifier,
      estatus: good.status,
      vc_pantalla: 'FACTADBOFICIOGEST',
      processExtSun: good.extDomProcess,
    };

    console.log('re', obj);
    return new Promise((resolve, reject) => {
      this.screenStatusService.getAllFiltro_(obj).subscribe({
        next: (resp: any) => {
          console.log('ESCR', resp);
          const data = resp.data[0];

          let objScSt = {
            di_disponible: 'S',
          };

          resolve(objScSt);
          this.loading = false;
        },
        error: (error: any) => {
          console.log('SCREEN ERROR', error.error.message);
          let objScSt: any = {
            di_disponible: 'N',
          };
          resolve(objScSt);
          this.loading = false;
        },
      });
    });
  }

  getDictaXGood(id: any, type: string) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    params['filter.typeDict'] = `$eq:${type}`;
    return new Promise((resolve, reject) => {
      this.DictationXGood1Service.getAll(params).subscribe({
        next: (resp: any) => {
          console.log('DICTAMINACION X BIEN', resp.data);
          const data = resp.data[0];
          resolve(data);
          this.loading = false;
        },
        error: error => {
          console.log('ERROR DICTAMINACION X BIEN', error.error.message);
          resolve(null);
          this.loading = false;
        },
      });
    });
  }

  selectProceedings(event: IGoodAndAvailable) {
    this.getStatusGood(event.status);
    this.selectedGood = event;
    this.dictationService.goodNumber = event.id;
  }

  async onClickBtnPrint() {
    console.log('PRINT RELATION SCREEN');
    let values = this.formJobManagement.value;
    if (values.statusOf == 'ENVIADO') {
      this.alert(
        'warning',
        '',
        'El oficio ya fue enviado ... mande a imprimir en el candado'
      );
      return;
    }

    if (!values.jobType) {
      this.alert('warning', '', 'Debe especificar el TIPO OFICIO');
      return;
    }

    if (!values.sender) {
      this.alert('warning', '', 'Debe especificar el REMITENTE');
      return;
    }

    if (values.jobType == 'INTERNO') {
      if (!values.addressee?.usuario) {
        this.alert('warning', '', 'Debe especificar el DESTINATARIO');
        return;
      }
    }

    if (values.jobType == 'EXTERNO') {
      if (!values.nomPersExt) {
        this.alert('warning', '', 'Debe especificar el DESTINATARIO EXTERNO');
        return;
      }
    }

    if (!values.city) {
      this.alert('warning', '', 'Debe especificar la CIUDAD');
      return;
    }

    this.isDisabledBtnPrint = true;

    try {
      const etapaCreda = await this.getFaStageCreda(new Date());
      const checkText = this.formJobManagement.get('refersTo').value;
      this.checkRefiere = checkText;
      if (!values.cveManagement && values.managementNumber) {
        const department = (await this.getDSAreaInDeparment(
          etapaCreda
        )) as IDepartment;

        const department2 = (await this.getDSAreaForOfficeInDepartment(
          etapaCreda
        )) as IDepartment;

        const key = await this.pupGeneratorKey();

        this.formJobManagement.get('cveManagement').setValue(key);
        this.formJobManagement.get('statusOf').setValue('EN REVISION');
      }

      if (!values.cveManagement && !values.managementNumber) {
        const department = (await this.getDSAreaInDeparment(
          etapaCreda
        )) as IDepartment;

        const department2 = (await this.getDSAreaForOfficeInDepartment(
          etapaCreda
        )) as IDepartment;

        // const year = new Date().getFullYear();
        // const month = new Date().getMonth() + 1;
        const key = await this.pupGeneratorKey();
        this.formJobManagement.get('cveManagement').setValue(key);
        this.formJobManagement.get('statusOf').setValue('EN REVISION');

        if (checkText == this.se_refiere_a.A) {
          await this.pupAddGood();
        }

        if (checkText == this.se_refiere_a.B) {
          this.pupAddAnyGood();
        }
        await this.commit();
      }

      if (
        this.formJobManagement.value.cveManagement &&
        this.formJobManagement.value.managementNumber
      ) {
        const params = new ListParams();
        params['filter.managementNumber'] =
          this.formJobManagement.value.managementNumber;
        const counter = await this.getGoodsJobManagementCount(params);

        if (checkText == this.se_refiere_a.A && counter == 0) {
          await this.pupAddGood();
        }

        if (checkText == this.se_refiere_a.B && counter == 0) {
          this.pupAddAnyGood();
        }
        await this.commit();
      }

      this.pupShowReport();
      values = this.formJobManagement.value;
      if (values.cveManagement && values.refersTo == this.se_refiere_a.A) {
        // this.enableOrDisabledRadioRefersTo('B', false);
        this.se_refiere_a_Disabled.B = true;
        this.se_refiere_a_Disabled.C = true;
        // this.enableOrDisabledRadioRefersTo('C', false);
      }

      if (values.cveManagement && values.refersTo == this.se_refiere_a.B) {
        this.se_refiere_a_Disabled.A = true;
        this.se_refiere_a_Disabled.C = true;
        // this.enableOrDisabledRadioRefersTo('A', false);
        // this.enableOrDisabledRadioRefersTo('C', false);
      }

      if (values.cveManagement) {
        const params = new ListParams();
        params['filter.managementNumber'] =
          this.formJobManagement.value.managementNumber;
        const count = await this.getDocJobManagementCount(params);
        console.log('COUNT DOCUMENTS', count);
        if (count > 0) {
          // debugger;
          this.isDisabledBtnDocs = true;
        }
      }
      this.isDisabledBtnPrint = false;
    } catch (error) {
      console.error(error);
      this.isDisabledBtnPrint = false;
    }
  }

  deleteDocument(event: IDocumentJobManagement) {
    const docIndex = this.dataTableDocuments.findIndex(
      x => x.cveDocument == event.cveDocument
    );
    this.dataTableDocuments.splice(docIndex, 1);
    this.dataTableDocuments = [...this.dataTableDocuments];
    // this.dataTableDocuments.splice(index, 1);
  }

  userHavePermission() {
    //private useR: SegAcessXAreasService
    return new Promise((resolve, reject) => {
      const body: any = {
        delegacionNo: this.authUser.department,
        user: this.authUser.username,
      };
      this.segAccessAreasService.userHavePermissions(body).subscribe({
        next: resp => {
          resolve(resp.data);
        },
        error: error => {
          reject('error while trying to answert permissions');
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio un error al consultar los permisos del usuario'
          );
        },
      });
    });
  }

  async getDSAreaInDeparment(etapaCreda: string | number) {
    const params = new ListParams();
    const auth = await this.getUserInfo();
    params['filter.id'] = auth.department;
    params['filter.numDelegation'] = auth.delegationNumber;
    params['filter.numSubDelegation'] = auth.subdelegationNumber;
    params['filter.phaseEdo'] = etapaCreda;

    return (await this.getDepartment(params, true)) as IDepartment;
  }

  async getDSAreaForOfficeInDepartment(etapaCreda: string | number) {
    const params = new ListParams();
    params['filter.numDelegation'] = this.formJobManagement.value.delRemNumber;
    params['filter.id'] = this.formJobManagement.value.depRemNumber;
    params['filter.phaseEdo'] = etapaCreda;

    return (await this.getDepartment(params, true)) as IDepartment;
  }

  // sendDictamen() {
  //   // let config: ModalOptions = {
  //   //   initialState: {
  //   //     documento: {
  //   //       urlDoc: '',
  //   //       type: 'pdf',
  //   //     },
  //   //     callback: (data: any) => {},
  //   //   }, //pasar datos por aca
  //   //   class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
  //   //   ignoreBackdropClick: true, //ignora el click fuera del modal
  //   // };
  //   // this.modalService.show(UploadDictamenFilesModalComponent, config);
  //   if (this.pantallaActual == '1') {
  //     // Gestion Send button
  //     if (
  //       this.formJobManagement.value.statusOf == 'ENVIADO' &&
  //       !this.formJobManagement.value.cveManagement.includes('?')
  //     ) {
  //       // Primer condicion al enviar
  //       this.firstConditionSend();
  //     } else {
  //       // Segunda condicion al enviar
  //       this.secondConditionSend();
  //     }
  //   } else {
  //     this.onClickBtnSend();
  //   }
  // }

  dictationCount(wheelNumber: string | number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.wheelNumber'] = `$eq:${wheelNumber}`;
      this.dictationService.getAll().subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          console.log(error);
        },
      });
    });
  }

  getProcessExtDom(noBien: number | string) {
    return new Promise((resolve, reject) => {
      this.goodHistoryService.getPrexdoAnterior(noBien).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          console.log(error);
          resolve(null);
        },
      });
    });
  }

  getChangeDate(noBien: number | string) {
    return new Promise((resolve, reject) => {
      this.goodHistoryService.getChangeDateHistory(noBien).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          console.log(error);
          resolve(null);
        },
      });
    });
  }

  // firstConditionSend() {
  //   const params = new FilterParams();
  //   params.removeAllFilters();
  //   params.addFilter('natureDocument', this.formJobManagement.value.jobType);
  //   params.addFilter(
  //     'documentNumber',
  //     this.formJobManagement.value.managementNumber
  //   );
  //   this.svLegalOpinionsOfficeService
  //     .getElectronicFirmData(params.getParams())
  //     .subscribe({
  //       next: data => {
  //         console.log('FIRMA ELECTRONICA', data);
  //         if (data.count > 0) {
  //           // Valida FOLIO_UNIVERSAL
  //           // Se llama PUP_CONSULTA_PDF_BD_SSF3
  //           this._PUP_CONSULTA_PDF_BD_SSF3();
  //           this._end_firmProcess(); // Termina el proceso
  //         }
  //       },
  //       error: error => {
  //         console.log(error);
  //         if (error.status == 400) {
  //           // se llama PUP_LANZA_REPORTE
  //           this._PUP_LANZA_REPORTE();
  //           // se llama PUP_GENERA_XML
  //           this._PUP_GENERA_XML();
  //         } else {
  //           this.onLoadToast(
  //             'error',
  //             'Se tiene problemas al mostrar el reporte',
  //             ''
  //           );
  //           this._end_firmProcess(); // Termina el proceso
  //         }
  //       },
  //     });
  // }

  enabledPrintAndBlockSend() {
    this.blockSend = true;
  }

  // _PUP_GENERA_XML() {
  //   this._end_firmProcess(); // Termina el proceso
  // }

  // _PUP_GENERA_PDF() {}

  // _PUP_LANZA_REPORTE() {}

  // _PUP_CONSULTA_PDF_BD_SSF3() {}

  // async secondConditionSend() {
  //   this.variablesSend.ESTATUS_OF = this.formJobManagement.value.statusOf;
  //   this.variablesSend.CVE_OF_GESTION =
  //     this.formJobManagement.value.cveManagement;
  //   //this.variablesSend.FECHA_INSERTO = this.formJobManagement.value.insertDate;
  //   if (!this.formJobManagement.value.jobType) {
  //     this.alertInfo('warning', 'Debe especificar el TIPO OFICIO', '');
  //     return;
  //   }
  //   if (!this.formJobManagement.value.sender) {
  //     this.alertInfo('warning', 'Debe especificar el REMITENTE', '');
  //     return;
  //   }
  //   if (this.formJobManagement.value.jobType == 'INTERNO') {
  //     this.alertInfo('warning', 'Debe especificar el DESTINATARIO', '');
  //     return;
  //   }
  //   if (this.formJobManagement.value.jobType == 'EXTERNO') {
  //     this.alertInfo('warning', 'Debe especificar al DESTINATARIO EXTERNO', '');
  //     return;
  //   }
  //   if (!this.formJobManagement.value.city) {
  //     this.alertInfo('warning', 'Debe especificar la CIUDAD', '');
  //     return;
  //   }
  //   if (
  //     this.formJobManagement.value.statusOf == 'EN REVISION' &&
  //     !this.formJobManagement.value.statusOf
  //   ) {
  //     if (!this.variablesSend.V_JUSTIFICACION) {
  //       this.alertInfo(
  //         'warning',
  //         'Es necesario contar con una justificación para poder cerrar el oficio',
  //         ''
  //       );
  //       return;
  //     }
  //     // CONSULTAR ACTNOM
  //     let actnom = 0;
  //     if (actnom == 1) {
  //       this.alertInfo(
  //         'info',
  //         'SE ACTUALIZARÁ LA NOMENCLATURA CONFORME AL NUEVO ESTATUTO YA QUE FUE ELABORADO ANTES DE LA PUBLICACION DE ESTÉ',
  //         ''
  //       ).then(() => {
  //         // Se llama PUF_GENERA_CLAVE para crear clave
  //         // this.formJobManagement.get('cveManagemen').setValue();
  //       });
  //     }

  //     const _valida_ext_dom = await this._PUP_VALIDA_EXT_DOM();

  //     if (_valida_ext_dom) {
  //       if (
  //         this.paramsGestionDictamen.pllamo == 'ABANDONO' ||
  //         this.paramsGestionDictamen.pllamo == 'EXT_DOM'
  //       ) {
  //         const _busca_numero = await this._PUP_BUSCA_NUMERO();
  //         const _cambia_estatus = await this._PUP_CAMBIA_ESTATUS();
  //         const _act_gestion = await this._PUP_ACT_GESTION();
  //         if (this.paramsGestionDictamen.pllamo == 'ABANDONO') {
  //           const _abandono = await this._PUP_ABANDONO();
  //         }
  //         this.enabledPrintAndBlockSend();
  //         this.formJobManagement.value.statusOf = 'ENVIADO';
  //         // Save M_OFICIO_GESTION
  //         this._end_firmProcess(); // Termina el proceso
  //       } else {
  //         if (
  //           this.formJobManagement.value.sender ==
  //           this.authUser.preferred_username
  //         ) {
  //           const params = new FilterParams();
  //           params.removeAllFilters();
  //           params.addFilter(
  //             'natureDocument',
  //             this.formJobManagement.value.jobType
  //           );
  //           params.addFilter(
  //             'documentNumber',
  //             this.formJobManagement.value.managementNumber
  //           );
  //           params.addFilter(
  //             'documentType',
  //             this.formJobManagement.value.statusOf
  //           );
  //           this.svLegalOpinionsOfficeService
  //             .getElectronicFirmData(params.getParams())
  //             .subscribe({
  //               next: data => {
  //                 console.log('FIRMA ELECTRONICA', data);
  //                 if (data.count > 0) {
  //                   this.alertInfo(
  //                     'info',
  //                     'Se realizó la firma del dictamen',
  //                     ''
  //                   ).then(async () => {
  //                     const _cambia_estatus = await this._PUP_CAMBIA_ESTATUS();
  //                     const _act_gestion = await this._PUP_ACT_GESTION();

  //                     this.formJobManagement.value.statusOf = 'ENVIADO';
  //                     // se llama PUP_GENERA_PDF
  //                     this._PUP_GENERA_PDF();
  //                     this.enabledPrintAndBlockSend();
  //                     // Save M_OFICIO_GESTION
  //                     this._end_firmProcess(); // Termina el proceso
  //                   });
  //                 }
  //               },
  //               error: async error => {
  //                 console.log(error);
  //                 if (error.status == 400) {
  //                   // se llama PUP_GENERA_XML
  //                   this._PUP_GENERA_XML();

  //                   this.alertInfo(
  //                     'info',
  //                     'Se realizó la firma del dictamen',
  //                     ''
  //                   ).then(async () => {
  //                     const _act_gestion = await this._PUP_ACT_GESTION();

  //                     this.formJobManagement.value.statusOf = 'ENVIADO';
  //                     // se llama PUP_GENERA_PDF
  //                     this._PUP_GENERA_PDF();
  //                     this.enabledPrintAndBlockSend();
  //                     // Save M_OFICIO_GESTION
  //                     this._end_firmProcess(); // Termina el proceso
  //                   });
  //                 } else {
  //                   this.onLoadToast(
  //                     'error',
  //                     'Se tiene problemas al mostrar el reporte',
  //                     ''
  //                   );
  //                 }
  //               },
  //             });
  //         }
  //       }
  //     }
  //   } else {
  //     this._end_firmProcess(); // Termina el proceso
  //   }
  // }

  // getEstPreviousHistory(body: any) {
  //   return new Promise((resolve, reject) => {
  //     this.goodHistoryService.getPreviousHistoryGood(body).subscribe({
  //       next: resp => {
  //         resolve(resp);
  //       },
  //       error: error => {
  //         console.log(error);
  //         resolve(null);
  //       },
  //     });
  //   });
  // }

  // getEstPreviousHistory2(body: any) {
  //   return new Promise((resolve, reject) => {
  //     this.goodHistoryService.getPreviousHistoryGood2(body).subscribe({
  //       next: resp => {
  //         resolve(resp);
  //       },
  //       error: error => {
  //         console.log(error);
  //         resolve(null);
  //       },
  //     });
  //   });
  // }

  goBack() {
    this.router.navigate(['/pages/juridical/file-data-update'], {
      queryParams: { wheelNumber: this.formNotification.value.wheelNumber },
    });
  }

  // updateGood(good: any) {
  //   return new Promise((resolve, reject) => {
  //     this.goodServices.update(good).subscribe({
  //       next: resp => {
  //         resolve(resp);
  //       },
  //       error: error => {
  //         reject('no se pudo actualizar los bienes');
  //         this.onLoadToast('error', 'No se pudo actualizar los bienes', '');
  //       },
  //     });
  //   });
  // }

  // fgrResponses() {
  //   const notifications = this.formNotification.value;
  //   if (!notifications.wheelNumber) {
  //     this.onLoadToast(
  //       'info',
  //       'Error',
  //       'El dictamen no cuenta con un numero de volante'
  //     );
  //     return;
  //   }
  //   let config = {
  //     class: 'modal-lg modal-dialog-centered',
  //     initialState: {
  //       pgrOffice: notifications.officeExternalKey,
  //     },
  //     ignoreBackdropClick: true,
  //   };
  //   this.modalService.show(PgrFilesComponent, config);
  // }

  getGoodOfficeManagements(page: number, limit: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.managementNumber'] =
        this.formJobManagement.value.managementNumber;
      params.limit = limit;
      params.page = page;
      this.serviceOficces.getGoodsJobManagement(params).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  // validateGDateToUpdateGoodStatus(body: any) {
  //   return new Promise((resolve, reject) => {
  //     this.goodHistoryService.validateDateToUpdateStatus(body).subscribe({
  //       next: resp => {
  //         resolve(resp);
  //       },
  //       error: error => {
  //         reject('error');
  //         this.onLoadToast(
  //           'error',
  //           'Error en la validacion',
  //           'No se pudo validar las fechas'
  //         );
  //       },
  //     });
  //   });
  // }

  // setMonthsAndDay(month: number) {
  //   let result = month.toString();
  //   if (month === 1) {
  //     result = '01';
  //   } else if (month === 2) {
  //     result = '02';
  //   } else if (month === 3) {
  //     result = '03';
  //   } else if (month === 4) {
  //     result = '04';
  //   } else if (month === 5) {
  //     result = '05';
  //   } else if (month === 6) {
  //     result = '06';
  //   } else if (month === 7) {
  //     result = '07';
  //   } else if (month === 8) {
  //     result = '08';
  //   } else if (month === 9) {
  //     result = '09';
  //   }

  //   return result;
  // }
  // convertdateNumeric(date: Date) {
  //   return (
  //     date.getFullYear() +
  //     '-' +
  //     this.setMonthsAndDay(date.getMonth()) +
  //     '-' +
  //     date.getDate()
  //   );
  // }
  // _PUP_VALIDA_EXT_DOM() {
  //   return true;
  // }

  // _PUP_BUSCA_NUMERO() {}

  // _PUP_CAMBIA_ESTATUS() {}

  // _PUP_ACT_GESTION() {}

  // _PUP_ABANDONO() {}

  async _end_firmProcess() {
    let LV_TRAMITE = await this._GESTION_TRAMITE_TIPO_TRAMITE();
    if (LV_TRAMITE.typeManagement == 3) {
      this._PGR_IMAGENES_LV_PGRIMAG();
    }
  }

  async _GESTION_TRAMITE_TIPO_TRAMITE() {
    const params = new ListParams();
    params.page = 1;
    params.limit = 1;
    params['filter.officeNumber'] =
      this.formJobManagement.value.managementNumber;
    params['filter.expedient'] = this.managementForm.get('noExpediente').value;
    params['filter.flierNumber'] = this.managementForm.get('noVolante').value;
    return await firstValueFrom(this.getJobManagement(params));
    // return 0;
  }

  _PGR_IMAGENES_LV_PGRIMAG() {
    // LV_PGRIMAG == 0
    let LV_PGRIMAG = 0;
    if (LV_PGRIMAG == 0) {
      this._PUP_ENVIA_PGR();
    } else {
      this.onLoadToast(
        'info',
        'EL OFICIO DE ACLARACION YA HA SIDO ENVIADO A PGR',
        ''
      );
    }
  }

  _PUP_ENVIA_PGR() {}

  // changeSender(sender) {
  //   console.log({sender});
}
