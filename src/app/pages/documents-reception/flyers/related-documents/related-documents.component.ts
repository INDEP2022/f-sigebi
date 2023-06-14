import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  of,
  skip,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { PgrFilesComponent } from 'src/app/@standalone/modals/pgr-files/pgr-files.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { IUserRowSelectEvent } from 'src/app/core/interfaces/ng2-smart-table.interface';
import { IDepartment } from 'src/app/core/models/catalogs/department.model';
import { ILegend } from 'src/app/core/models/catalogs/legend.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { ICopiesJobManagementDto } from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
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
import { MailboxModalTableComponent } from 'src/app/pages/general-processes/work-mailbox/components/mailbox-modal-table/mailbox-modal-table.component';
import { AddCopyComponent } from 'src/app/pages/juridical-processes/abandonments-declaration-trades/abandonments-declaration-trades/add-copy/add-copy.component';
import {
  COLUMNS_DOCUMENTS,
  COLUMNS_GOOD_JOB_MANAGEMENT,
  EXTERNOS_COLUMS_OFICIO,
} from 'src/app/pages/juridical-processes/abandonments-declaration-trades/abandonments-declaration-trades/columns';
import { LegalOpinionsOfficeService } from 'src/app/pages/juridical-processes/depositary/legal-opinions-office/legal-opinions-office/services/legal-opinions-office.service';
import { IJuridicalDocumentManagementParams } from 'src/app/pages/juridical-processes/file-data-update/interfaces/file-data-update-parameters';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import Swal from 'sweetalert2';
import { ERROR_REPORT } from '../related-documents/utils/related-documents.message';
import { FlyersService } from '../services/flyers.service';
import { DocumentsFormComponent } from './documents-form/documents-form.component';
import { ModalPersonaOficinaComponent } from './modal-persona-oficina/modal-persona-oficina.component';
import { RelatedDocumentDesahogo } from './related-document-desahogo';
import {
  IDataGoodsTable,
  RELATED_DOCUMENTS_COLUMNS_GOODS,
  RELATED_FOLIO_COLUMNS,
} from './related-documents-columns';
import {
  MANAGEMENTOFFICESTATUSSEND,
  PARAMETERSALEC,
  TEXT1,
  TEXT1Abandono,
  TEXT2,
} from './related-documents-message';
import { RelateDocumentsResponse } from './related-documents-response';
import { RelatedDocumentsService } from './services/related-documents.service';
import { UploadDictamenFilesModalComponent } from './upload-dictamen-files-modal/upload-dictamen-files-modal.component';

export type IGoodAndAvailable = IGood & { available: boolean };
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
  templateUrl: './related-documents.component.html',
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
  providers: [RelatedDocumentDesahogo],
})
export class RelatedDocumentsComponent
  extends RelateDocumentsResponse
  implements OnInit
{
  @ViewChild('tableGoods') tableGoods: Ng2SmartTableComponent;

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
  // userCopies1 = new DefaultSelect();
  // userCopies2 = new DefaultSelect();
  dataGoodTable: LocalDataSource = new LocalDataSource();
  m_job_management: any = null;
  authUser: any = null;
  isPGR: boolean = false;

  pantalla = (option: boolean) =>
    `${
      option == true
        ? '"Oficio de Gestión por Dictamen"'
        : '"Oficio Gestión Relacionados"'
    }.`;
  pantallaOption: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  docParams = new BehaviorSubject<ListParams>(new ListParams());
  docTotalItems = 0;
  goodParams = new BehaviorSubject<ListParams>(new ListParams());
  goodTotalItems = 0;
  idExpediente: any = null;
  paramsGestionDictamen: IJuridicalDocumentManagementParams = {
    volante: null,
    expediente: null,
    doc: null,
    tipoOf: null,
    sale: '',
    bien: '',
    pGestOk: null,
    pNoTramite: null,
    pDictamen: null,
  };
  se_refiere_a = {
    A: 'Se refiere a todos los bienes',
    B: 'Se refiere a algun(os) bien(es) del expediente',
    C: 'No se refiere a ningún bien asegurado, decomisado o abandonado',
    D: 'd',
  };
  se_refiere_a_Disabled = {
    A: false,
    B: false,
    C: true,
    D: false,
  };
  variables = {
    dictamen: '',
    b: '',
    d: '',
    dictaminacion: '',
    clasif: '',
    clasif2: '',
    delito: '',
    todos: '',
    doc_bien: '',
    proc_doc_dic: '',
  };
  pantallaActual: string = '';
  disabledRadio: boolean = false;
  // oficioGestion: IMJobManagement;
  disabledAddresse: boolean = false;
  dataTableGoods: IGoodAndAvailable[] = [];
  statusOf: string = undefined;
  screenKeyManagement: string = 'FACTADBOFICIOGEST';
  screenKeyRelated: string = '';
  screenKey: string = '';
  selectedGood: IGood[] = [];
  notificationData: INotification;
  loadingGoods: boolean = false;
  ReadOnly: boolean;
  public formLoading: boolean = false;
  today = new DatePipe('en-EN').transform(new Date(), 'dd/MM/yyyy');
  @ViewChild('cveOficio', { static: true }) cveOficio: ElementRef;
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

  dataTableDocuments: any[] = [];

  settingsTableDocuments = {
    ...this.settings,
    actions: {
      edit: false,
      add: false,
      delete: false,
    },
    hideSubHeader: true,
    columns: COLUMNS_DOCUMENTS,
  };

  //m_job_management
  formNotification = new FormGroup({
    /** @descripiton  no_volante*/
    wheelNumber: new FormControl(null),
    /** @descripition no_expediente */
    expedientNumber: new FormControl(null),
    /** @descripition no_registro*/
    registerNumber: new FormControl(null),
    /** @descripition  AVERIGUACION_PREVIA*/
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
    addressee: new FormControl<{
      user: number | string;
      name: string;
      userAndName: string;
    }>(null),
    /** @description remitente */
    sender: new FormControl<{
      id: number | string;
      name: string;
      idName: string;
    }>(null), // remitente
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

  globalVars: IGlobalVars;

  constructor(
    private fb: FormBuilder,
    protected flyerService: FlyersService,
    protected override route: ActivatedRoute,
    private router: Router,
    protected siabService: SiabService,
    protected modalService: BsModalService,
    private globalVarsService: GlobalVarsService,
    protected sanitizer: DomSanitizer,
    protected dictationService: DictationService,
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
    protected usersService: UsersService, // protected goodProcessService: GoodprocessService,
    private expedientService: ExpedientService,

    private relatedDocumentDesahogo: RelatedDocumentDesahogo,
    protected msOfficeManagementService: OfficeManagementService,
    private fileBrowserService: FileBrowserService
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
    if (screen === '2') {
      const columns = RELATED_DOCUMENTS_COLUMNS_GOODS;
      delete columns.improcedente;
    }

    this.settings = {
      ...this.settings,
      actions: false,
      // selectMode: 'multi',
      columns: { ...RELATED_DOCUMENTS_COLUMNS_GOODS },
      rowClassFunction: (row: any) => {
        if (!row.data.available) {
          return 'bg-dark text-white disabled-custom';
        } else {
          return 'bg-success text-white';
        }
      },
    };
  }
  selectedRadio: string;

  disabledChecks() {
    console.log(this.tableGoods);
    const columnas = this.tableGoods.grid.getColumns();
    const columnaSelectRigth = columnas.find(
      columna => columna.id === 'seleccion'
    );
    const columnaImprocedence = columnas.find(
      columna => columna.id === 'improcedente'
    );
    //oculta la columna aclarado
    columnaSelectRigth.hide = true;
    //oculta la columa improcedente
    columnaImprocedence.hide = true;
    // (this.settings.columns as any).seleccion['hide'] = false;
    this.managementForm.get('averiPrevia').disable();
    this.formVariables.get('b').setValue('S');

    this.managementForm.get('improcedente').setValue(true);
    this.managementForm.get('improcedente').disable();

    const { managementNumber } = this.formJobManagement.value;
    const { expedientNumber } = this.formNotification.value;
    /*this.relatedDocumentDesahogo.PUP_CAMBIO_IMPRO(
      true,
      Number(managementNumber),
      Number(expedientNumber)
    );*/

    //const values = (columnas[7]['dataSet']['rows'][0].isSelected = true);
    //console.log(values);

    //onComponentInitFunction: true
    //this.relatedDocumentDesahogo.pup_cambio_impro(this.dataTableGoods);

    // }
    // this.goodFilterParams('Todos');
    // this.managementForm.controls['averiPrevia'].setValue('Todos');
    // setTimeout(() => {
    //   const tabla = document.getElementById('goods');
    //   const types = document.getElementById('typesFilters');
    //   const tbody = tabla.children[0].children[1].children;
    //   for (let index = 0; index < tbody.length; index++) {
    //     const element = tbody[index];
    //     element.children[7].classList.add('not-press');
    //     element.children[8].classList.add('not-press');
    //   }
    //   types.classList.add('not-press');
    // }, 2000);
  }

  enableChecks() {
    const columnas = this.tableGoods.grid.getColumns();
    const columnaSelectRigth = columnas.find(
      columna => columna.id === 'seleccion'
    );

    const columnaImprocedent = columnas.find(
      columna => columna.id === 'improcedente'
    );
    columnaSelectRigth.hide = false;
    columnaImprocedent.hide = false;
    this.managementForm.get('averiPrevia').enable();
    this.formVariables.get('b').setValue('N');

    this.managementForm.get('improcedente').setValue(false);
    this.managementForm.get('improcedente').enable();
    // const tabla = document.getElementById('goods');
    // const types = document.getElementById('typesFilters');
    // if (tabla && types) {
    //   const tbody = tabla.children[0]?.children[1]?.children;
    //   if (tbody) {
    //     for (let index = 0; index < tbody.length; index++) {
    //       const element = tbody[index];
    //       element.children[7]?.classList.remove('not-press');
    //       element.children[8]?.classList.remove('not-press');
    //     }
    //   }
    //   types.classList.remove('not-press');
    // }
  }

  onClickSelect(event: any) {
    event.toggle.subscribe((data: any) => {
      console.log(JSON.stringify(data));
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
      console.log('next', next);

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

  async ngOnInit(): Promise<void> {
    this.globalVarsService
      .getGlobalVars$()
      .subscribe((globalVars: IGlobalVars) => {
        this.globalVars = globalVars;
        console.log(globalVars);
      });
    // console.log("status OF: ", this.oficioGestion.statusOf);
    this.getUserInfo();
    this.setInitVariables();
    this.prepareForm();
    this.route.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        console.log(params);
        this.origin = params['origin'] ?? null;
        this.paramsGestionDictamen.volante = params['volante'] ?? null;
        this.paramsGestionDictamen.expediente = params['expediente'] ?? null;
        this.paramsGestionDictamen.tipoOf = params['tipoOf'] ?? null;
        this.formJobManagement
          .get('jobType')
          .setValue(params['tipoOf'] ?? null);
        this.paramsGestionDictamen.doc = params['doc'] ?? null;
        this.paramsGestionDictamen.pDictamen = params['pDictamen'] ?? null;
        this.paramsGestionDictamen.sale = params['sale'] ?? null;
        this.paramsGestionDictamen.pGestOk = params['pGestOk'] ?? null;
        this.paramsGestionDictamen.pllamo = params['pllamo'] ?? null; // Se agrego

        /*this.origin = params['origin'] ?? null; //no hay
        this.paramsGestionDictamen.volante = params['VOLANTE'] ?? null;
        this.paramsGestionDictamen.expediente = params['EXPEDIENTE'] ?? null;
        this.paramsGestionDictamen.tipoOf = params['TIPO_OF'] ?? null;
        this.paramsGestionDictamen.doc = params['DOC'] ?? null;
        this.paramsGestionDictamen.pDictamen = params['pDictamen'] ?? null;  //no hay
        this.paramsGestionDictamen.sale = params['SALE'] ?? null;
        this.paramsGestionDictamen.pGestOk = params['BIEN'] ?? null;
        this.paramsGestionDictamen.pGestOk = params['PLLAMO'] ?? null;
        this.paramsGestionDictamen.pGestOk = params['P_GEST_OK'] ?? null;
        this.paramsGestionDictamen.pGestOk = params['P_NO_TRAMITE'] ?? null;*/
      });
    this.pantallaActual = this.route.snapshot.paramMap.get('id');
    if (!this.pantallaActual) {
      this.router.navigateByUrl('/pages/');
      return;
    } else {
      if (this.pantallaActual == '2' || this.pantallaActual == '1') {
        this.initForm();
        this.setDataParams();
        this.pantallaOption = this.flyerService.getPantallaOption(
          this.pantallaActual
        );
        this.paramsGestionDictamen.sale = 'C';
        if (this.pantallaOption) {
          this.screenKey = this.screenKeyManagement;
          this.initComponentDictamen();
        } else {
          this.screenKey = this.screenKeyRelated;
        }
      } else {
        this.alertInfo(
          'warning',
          'Opción no disponible',
          'Esta pantalla no existe en el sistema.'
        ).then(() => {
          this.router.navigateByUrl('/pages/');
        });
      }
    }

    this.params.pipe(skip(1), takeUntil(this.$unSubscribe)).subscribe(res => {
      this.goodFilterParams('Todos');
    });

    this.docParams
      .pipe(skip(1), takeUntil(this.$unSubscribe))
      .subscribe(res => {
        this.refreshTableDocuments(res);
      });

    if (this.paramsGestionDictamen.tipoOf == 'INTERNO') {
      this.showDestinatario = true;
    } else {
      this.showDestinatarioInput = true;
    }
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
    this.variables = {
      dictamen: '',
      b: '',
      d: '',
      dictaminacion: '',
      clasif: '',
      clasif2: '',
      delito: '',
      todos: '',
      doc_bien: '',
      proc_doc_dic: '',
    };
    this.notificationData = null;
  }

  setDataParams() {
    let paramsData = this.serviceRelatedDocumentsService.getParams(
      this.pantallaActual
    );
    if (paramsData != false && paramsData) {
      if (this.pantallaActual == '1') {
        // this.paramsGestionDictamen = paramsData;
      } else {
        // console.log(paramsData);
      }
    }
    // console.log(paramsData, this.paramsGestionDictamen);
    this.managementForm
      .get('noVolante')
      .setValue(this.paramsGestionDictamen.volante);
    this.managementForm
      .get('noExpediente')
      .setValue(this.paramsGestionDictamen.expediente);
    this.managementForm
      .get('tipoOficio')
      .setValue(this.paramsGestionDictamen.tipoOf);
    this.managementForm.updateValueAndValidity();
  }

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
    this.getNotificationData();
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
    const wheelNumber = this.getQueryParams('volante');
    const expedient = this.getQueryParams('expediente');
    this.getNotification(wheelNumber, expedient).subscribe({
      next: async res => {
        console.log(res);

        this.formNotification.patchValue(res);
        this.getTypesSelectors();
        this.managementForm.get('noVolante').setValue(res.wheelNumber);
        this.managementForm.get('noExpediente').setValue(res.expedientNumber);
        this.managementForm.get('wheelStatus').setValue(res.wheelStatus);

        try {
          const mJobManagement = await firstValueFrom(
            this.getMJobManagement(res.wheelNumber)
          );
          this.m_job_management = mJobManagement;
          console.log('mjobmanagement ', mJobManagement);
          this.formJobManagement.patchValue({
            ...mJobManagement,
            city: {
              id: mJobManagement.city,
              legendOffice: null,
              idName: mJobManagement.city,
            },
            sender: {
              id: mJobManagement.sender,
              name: null,
              idName: mJobManagement.sender,
            },
            addressee:
              mJobManagement.jobType == 'INTERNO'
                ? {
                    user: mJobManagement.addressee,
                    name: null,
                    userAndName: mJobManagement.addressee,
                  }
                : mJobManagement.addressee,
          });
          console.log(this.formJobManagement.value);
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
                // console.log(res);
                const i = res.data[0];
                this.formJobManagement.get('sender').setValue({
                  id: i.userDetail.id,
                  idName: i.userDetail.id + ' - ' + i.userDetail.name,
                  name: i.userDetail.name,
                });
              },
            });
          }

          if (mJobManagement.addressee && mJobManagement.jobType == 'INTERNO') {
            const params = new ListParams();
            params.limit = 1;
            params['search'] = mJobManagement.addressee;
            this.securityService
              .getAllUsersTracker(params)
              .subscribe((data: any) => {
                const item = data.data[0];
                let result = {
                  user: item.user,
                  name: item.name,
                  userAndName: item.user + ' - ' + item.name,
                };

                this.formJobManagement.get('addressee').setValue(result);
              });
          }

          if (mJobManagement.managementNumber) {
            this.refreshTableGoodsJobManagement();
            this.refreshTableDocuments();
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
          }

          if (this.formJobManagement.value.managementNumber) {
            this.getCopyOficioGestion__(
              this.formJobManagement.value.managementNumber
            );
          }
        } catch (e) {
          this.isCreate = true;
          console.log(e);
        }
        console.log('res', res);
        if (res.expedientNumber) {
          this.refreshTableGoods();
        }
      },
    });
  }

  isLoadingDocuments = false;
  refreshTableDocuments(params: ListParams = new ListParams()) {
    this.isLoadingDocuments = true;
    this.getDocJobManagement().subscribe({
      next: async res => {
        const response = await res.data.map(async item => {
          params['filter.id'] = item.cveDocument;
          const description = await firstValueFrom(
            this.getDocumentForDictation(params).pipe(map(res => res.data[0]))
          );
          return {
            ...item,
            description: description.description,
            key: description.key,
          };
        });
        // debugger;
        this.dataTableDocuments = await Promise.all(response);
        this.isLoadingDocuments = false;
        this.docTotalItems = res.count;
      },
      error: err => {
        this.isLoadingDocuments = false;
        this.docTotalItems = 0;
      },
    });
  }

  refreshTableGoods() {
    const params = new ListParams();

    params['filter.fileNumber'] = this.formNotification.value.expedientNumber;
    this.getGoods1(params);
  }

  async refreshTableGoodsJobManagement() {
    //const params = new ListParams();
    //params['filter.managementNumber'] =
    //this.formJobManagement.value.managementNumber;
    try {
      this.goodParams
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(async data => {
          //this.goodParams.value['filter.managementNumber'] =  this.formJobManagement.value.managementNumber;
          data['filter.managementNumber'] =
            this.formJobManagement.value.managementNumber;
          const goodManagementResult = await this.getGoodsJobManagement(data);
          this.dataTableGoodsJobManagement = goodManagementResult.data;
          this.goodTotalItems = goodManagementResult.count;
        });
    } catch (ex) {
      this.goodTotalItems = 0;
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

  reviewParametersGestion() {
    if (this.paramsGestionDictamen.sale == 'C') {
      // A, B, D
      if (this.se_refiere_a.C == this.managementForm.get('tipoOficio').value) {
        return true;
      } else {
        return false;
      }
    } else if (this.paramsGestionDictamen.sale == 'D') {
      // C
      if (this.se_refiere_a.C == this.managementForm.get('tipoOficio').value) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

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

  changeSender() {
    if (this.managementForm.get('tipoOficio').value == 'EXTERNO') {
      this.managementForm.get('destinatario').disable();
      this.managementForm.get('destinatario').updateValueAndValidity();
      this.disabledAddresse = true;
    } else if (this.managementForm.get('tipoOficio').value == 'INTERNO') {
      this.managementForm.get('destinatario').enable();
      this.managementForm.get('destinatario').updateValueAndValidity();
      this.disabledAddresse = false;
    } else {
      this.managementForm.get('destinatario').enable();
      this.managementForm.get('destinatario').updateValueAndValidity();
      this.disabledAddresse = false;
    }
  }

  changeTextType() {
    let textRespone = this.serviceRelatedDocumentsService.changeTextType(
      this.formJobManagement.get('tipoTexto').value,
      this.managementForm.get('noOficio').value
    );
    this.formJobManagement.get('text1').setValue(textRespone.text1);
    this.formJobManagement.get('text2').setValue(textRespone.text2);
  }

  changeOffice() {
    const elemC = document.getElementById('se_refiere_a_C') as HTMLInputElement;
    elemC.checked = true;
    const elemB = document.getElementById('se_refiere_a_B') as HTMLInputElement;
    elemB.checked = false;
    const elemA = document.getElementById('se_refiere_a_A') as HTMLInputElement;
    elemA.checked = false;

    this.se_refiere_a_Disabled.C = false;
    if (this.paramsGestionDictamen.sale == 'C') {
      this.alertInfo('warning', PARAMETERSALEC, '');
      return;
    }
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
    if (this.paramsGestionDictamen.sale == 'D') {
      this.se_refiere_a_Disabled.C = false;
    } else {
      this.se_refiere_a_Disabled.C = true;
    }
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

  changeImprocedente(event: any) {
    this.onLoadToast(
      'info',
      'se tiene que seleccionar todas las casillas improcedentes',
      ''
    );
    this.dataGood.forEach(element => {
      if (element.disponible) {
        element.improcedente = event.checked;
        element.seleccion = false;
      }
    });
    this.dataGoodTable.load(this.dataGood);
    this.dataGoodTable.refresh();
  }

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

  async getNotificationData() {
    if (
      this.paramsGestionDictamen.volante ||
      this.paramsGestionDictamen.expediente
    ) {
      const params = new FilterParams();
      params.removeAllFilters();
      params.addFilter('wheelNumber', this.paramsGestionDictamen.volante);
      if (this.paramsGestionDictamen.expediente) {
        params.addFilter(
          'expedientNumber',
          this.paramsGestionDictamen.expediente
        );
      }
      await this.flyerService
        .getNotificationByFilter(params.getParams())
        .subscribe({
          next: async res => {
            console.log('prueba', res);
            this.notificationData = res.data[0];
            this.statusOf = res.data[0].wheelStatus;
            this.setDataNotification();

            const noOfice = this.notificationData.officeExternalKey;
            this.isPGR = await this.relatedDocumentDesahogo.isPGRAndElectronic(
              noOfice
            );
            console.log(this.isPGR);
          },
          error: err => {
            console.log(err);
          },
        });
    } else {
      this.alertInfo(
        'warning',
        'No existe el Número de Expediente: ' +
          this.paramsGestionDictamen.expediente +
          ' ni el Número de Volante: ' +
          this.paramsGestionDictamen.volante +
          ' para consultar la información.',
        ''
      );
    }
  }

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
    params.addFilter('nameCity', paramsData['search'], SearchFilter.LIKE);
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
          console.log('Error Cargando la cidad', error.error.message);
          //this.onLoadToast('error', 'Error', error.error.message);
          subscription.unsubscribe();
        },
      });
  }

  /**
   * Obtener el listado de Remitente
   * @param params Parametos de busqueda de tipo @ListParams
   * @returns
   */
  getSenderByDetail(params: ListParams) {
    params.take = 20;
    params['order'] = 'DESC';
    let subscription = this.flyerService.getSenderUser(params).subscribe({
      next: data => {
        // console.log(data);
        const senders = data.data.map(i => {
          // i.userDetail.name =
          //   '#' + i.userDetail.id + ' -- ' + i.userDetail.name;

          // return i.userDetail;
          return {
            id: i.userDetail.id,
            idName: i.userDetail.id + ' -- ' + i.userDetail.name,
            name: i.userDetail.name,
          };
        });
        console.log(senders);
        this.senders = new DefaultSelect(senders, data.count);
        subscription.unsubscribe();
      },
      error: error => {
        this.senders = new DefaultSelect();
        this.onLoadToast('error', 'Error', error.error.message);
        subscription.unsubscribe();
      },
    });
  }

  send(): any {
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
    let params = {
      PARAMFORM: 'NO',
      DESTYPE: this.screenKey,
      NO_OF_GES: this.managementForm.controls['numero'].value,
      TIPO_OF: this.managementForm.controls['tipoOficio'].value,
      VOLANTE: this.managementForm.controls['noVolante'].value,
      EXP: this.managementForm.controls['noExpediente'].value,
      ESTAT_DIC: 'NO',
    };
    if (this.managementForm.get('tipoOficio').value == 'INTERNO') {
      this.siabService
        // .fetchReport('RGERJURDECLARABAND', params)
        .fetchReportBlank('blank')
        .subscribe(response => {
          if (response !== null) {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          } else {
            this.alert('warning', ERROR_REPORT, '');
          }
        });
    } else if (this.managementForm.get('tipoOficio').value == 'EXTERNO') {
      this.siabService
        // .fetchReport('RGEROFGESTION_EXT', params)
        .fetchReportBlank('blank')
        .subscribe(response => {
          if (response !== null) {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              }, //pasar datos por aca
              class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
              ignoreBackdropClick: true, //ignora el click fuera del modal
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          } else {
            this.alert('warning', ERROR_REPORT, '');
          }
        });
    }
  }

  async openModal(context?: Partial<DocumentsFormComponent>) {
    if (this.pantallaActual == '2') {
      await this.onClickBtnDocuments();
      return;
    }

    if (this.variables.proc_doc_dic == 'S') {
      this.alert('info', 'Info', 'Los Documentos y Bienes ya fueron agregados');
      return;
    }

    await this.pupGoodDoc();
  }

  async pupGoodDoc() {
    const user = this.authService.decodeToken().preferred_username;
    const doc = this.getQueryParams('doc');
    if (doc == 'N') {
      this.alert('warning', 'Este oficio no lleva Documentos', '');
      return;
    }

    const status = this.formJobManagement.get('statusOf')?.value;
    if (status == 'ENVIADO') {
      this.alert(
        'warning',
        'El Oficio ya esta enviado, no puede ser actualizado',
        ''
      );
      return;
    }

    // ! NO ESTA PASANDO ESTA VALIDACION
    // if (!this.variables.dictaminacion) {
    //   this.alert('error', 'Debe especificar el tipo de Dictaminación', '');
    //   return;
    // }
    // debugger;
    /* BIENES */
    //console.log(this.dataTableGoodsJobManagement);
    const bien = this.getQueryParams('bien');
    //console.log(this.formJobManagement);
    const { managementNumber, cveManagement } = this.m_job_management;
    const { refersTo } = this.formJobManagement.controls;
    const goodJobs = this.dataTableGoodsJobManagement.values;
    if (bien == 'S' && doc == 'S') {
      console.log('paso');
      if (!managementNumber && !cveManagement) {
        if (refersTo.value == this.se_refiere_a.A) {
          this.pupAddGood();
          console.log('Agrega bien');
        }
        if (refersTo.value == this.se_refiere_a.B) {
          this.pupAddAnyGood();
          console.log('Agrega algunos bienes');
        }
      }

      if (managementNumber && cveManagement) {
        console.log('cond 2');
        const count = await this.getGoodOMCount();
        if (refersTo.value == this.se_refiere_a.A && count == 0) {
          this.pupAddGood();
          console.log('3');
        }
        if (refersTo.value == this.se_refiere_a.B && count == 0) {
          this.pupAddAnyGood();
          console.log('3');
        }
      }

      if (
        (cveManagement || !cveManagement) &&
        refersTo.value == this.se_refiere_a.A
      ) {
        console.log('cond 3');
        this.se_refiere_a_Disabled.B = true;
        this.se_refiere_a_Disabled.C = true;
      }

      if (
        (cveManagement || !cveManagement) &&
        refersTo.value == this.se_refiere_a.B
      ) {
        console.log('cond 4');
        this.se_refiere_a_Disabled.A = true;
        this.se_refiere_a_Disabled.C = true;
      }
    }

    /* DOCUMENTOS */
    this.variables.clasif = null;
    const bienes_oficio = this.dataTableGoodsJobManagement.values;

    if (
      bien == 'S' &&
      doc == 'S' &&
      this.variables.dictaminacion != 'DEVOLUCION'
    ) {
      if (refersTo.value == 'D' || refersTo.value == this.se_refiere_a.D) {
        this.alert(
          'error',
          'Error',
          'Para este oficio es necesario tener bienes'
        );
        return;
      } else {
        if (goodJobs.length > 0) {
          console.log(this.dataTableGoodsJobManagement);
        }
      }
    }

    if (
      bien == 'S' &&
      doc == 'S' &&
      this.variables.dictaminacion == 'DEVOLUCION'
    ) {
      if (refersTo.value == 'D' || this.se_refiere_a.D) {
        this.alert('error', 'Para este oficio es necesario tener bienes', '');
        return;
      } else {
        // DOCUMENTOS_PARA_DICTAMEN
        alert('go block');
      }
    }

    if (bien == 'N' && doc == 'S') {
      // DOCUMENTOS_PARA_DICTAMEN
      alert('go block');
    }

    this.variables.d = 'N';
    this.variables.proc_doc_dic = 'S';
  }

  getGoodOMCount() {
    const params = new FilterParams();
    params.addFilter(
      'managementNumber',
      this.m_job_management.managementNumber
    );
    return firstValueFrom(
      this.serviceOficces.getAllFiltered(params.getParams()).pipe(
        catchError(() => of({ count: 0 })),
        map(res => res.count)
      )
    );
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
    this.managementForm.get('cveGestion').setValue(cveOficio);
  }

  getFromSelect(params: ListParams) {
    this.securityService.getAllUsersTracker(params).subscribe(
      (data: any) => {
        let result = data.data.map((item: any) => {
          // item['userAndName'] = item.user + ' - ' + item.name;
          return {
            user: item.user,
            name: item.name,
            userAndName: item.user + ' - ' + item.name,
          };
        });
        // Promise.all(result).then((resp: any) => {
        this.select = new DefaultSelect(result, data.count);
        //   this.loading = false;
        // });
      },
      error => {
        this.select = new DefaultSelect();
      }
    );
  }

  openForm(legend?: ILegend) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      legend,
      callback: (next: boolean, datos: any) => {
        if (next) {
          this.seteaTabla(datos);
        }
      },
    };
    this.modalService.show(ModalPersonaOficinaComponent, modalConfig);
  }

  seteaTabla(datos: any) {
    let dato: ICopiesJobManagementDto = JSON.parse(JSON.stringify(datos));

    let obj = {
      managementNumber: this.managementForm.get('numero').value,
      addresseeCopy: 0,
      delDestinationCopyNumber: 0,
      personExtInt: dato.personExtInt,
      nomPersonExt: dato.nomPersonExt,
      recordNumber: this.managementForm.get('numero').value,
    };

    this.serviceOficces.createCopiesJobManagement(obj).subscribe({
      next: resp => {
        console.log('resp  =>  ' + resp);
        this.refreshTabla();
      },
      error: errror => {
        this.onLoadToast('error', 'Error', errror.error.message);
      },
    });
    this.refreshTabla();
    console.log(
      'this.filtroPersonaExt => ' + JSON.stringify(this.filtroPersonaExt)
    );
  }

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

  async showDeleteAlert(legend?: any) {
    //ILegend
    //Desea eliminar el oficio con el expediente ${proceedingsNumber} y No. Oficio ${managementNumber}
    if (this.pantallaActual == '1') {
      const {
        noVolante, //no_volante
        wheelStatus, //status
      } = this.managementForm.value;
      const {
        managementNumber, //no_of_gestion
        flyerNumber, //no_volante
        statusOf, //status_of
        cveManagement, //cve_of_gestion
        proceedingsNumber, //no_expediente
        insertUser, //usuario insert
        insertDate, //fecha inserto
      } = this.m_job_management;

      if (managementNumber == null) {
        this.onLoadToast('info', 'No se tiene oficio', '');
        return;
      }

      if (wheelStatus == 'ENVIADO') {
        this.onLoadToast(
          'info',
          'El oficio ya esta enviado no puede borrar',
          ''
        );
        return;
      }

      /*if (cveManagement.includes('?') == false) {
        this.onLoadToast(
          'info',
          'La clave está armada, no puede borrar oficio',
          ''
        );
        return;
      }
      //username
      if (
        insertUser.toLowerCase() !==
        this.authUser.preferred_username.toLowerCase()
      ) {
        const ATJR: any = await this.userHavePermission();
        console.log(ATJR);
        if (Number(ATJR[0]) == 0) {
          this.onLoadToast(
            'error',
            'Error',
            'El Usuario no está autorizado para eliminar el Oficio'
          );
          return;
        }
      } else {
        this.onLoadToast(
          'error',
          'Error',
          'Usuario inválido para borrar oficio'
        );
        return;
      }*/

      this.alertQuestion(
        'warning',
        'Eliminar',
        `Desea eliminar el oficio con el expediente ${proceedingsNumber} y No. Oficio ${managementNumber}`
      ).then(question => {
        if (question.isConfirmed) {
          if (this.pantallaActual == '1') {
            this.deleteOfficeDesahogo(managementNumber, noVolante, insertDate);
            //Swal.fire('Borrado', '', 'success');
          }
        }
      });
    } else {
      this.onClickBtnErase();
    }
  }

  async deleteOfficeDesahogo(
    managementNumber: number | string,
    noVolante: number | string,
    insertDate: string //m_job_management date insert
  ) {
    //console.log(this.dataTableGoodsJobManagement);
    //LOOP BIENES_OFICIO_ESTATUS

    const body: any = {
      managementNumber: managementNumber,
      insertDate: insertDate,
      screen: 'FACTADBOFICIOGEST',
      dictum: managementNumber,
    };

    return;
    const management = managementNumber;
    const volante = noVolante;
    //se elimina bienes_officio_gestion
    const promises = [
      this.mJobManagementService.deleteGoodsJobManagement1(management),
      this.mJobManagementService.deleteDocumentJobManagement2(management),
      this.officeManagementSerivice.removeMOfficeManagement(management),
      this.mJobManagementService.deleteCopiesJobManagement4(management),
      this.updateIfHaveDictamen(volante),
    ];
    await Promise.all(promises);

    this.se_refiere_a_Disabled.A = true;
    this.se_refiere_a_Disabled.B = true;

    if (this.paramsGestionDictamen.sale == 'D') {
      this.se_refiere_a_Disabled.C = true;
    } else {
      this.se_refiere_a_Disabled.C = false;
    }

    Swal.fire('Borrado', '', 'success');
    this.refreshTabla();
  }

  changeCopiesType(event: any, ccp: number) {
    console.log(event.target.value, ccp);
    if (ccp == 1) {
      console.log('CCP1');
      this.managementForm.get('ccp_addressee').reset();
      this.managementForm.get('ccp_TiPerson').reset();
      if (event.target.value == 'I') {
        this.managementForm.get('ccp_addressee').enable();
        this.managementForm.get('ccp_TiPerson').disable();
      } else if (event.target.value == 'E') {
        this.managementForm.get('ccp_addressee').disable();
        this.managementForm.get('ccp_TiPerson').enable();
      }
    } else {
      console.log('CCP2');
      this.managementForm.get('ccp_addressee_1').reset();
      this.managementForm.get('ccp_TiPerson_1').reset();
      if (event.target.value == 'I') {
        this.managementForm.get('ccp_addressee_1').enable();
        this.managementForm.get('ccp_TiPerson_1').disable();
      } else if (event.target.value == 'E') {
        this.managementForm.get('ccp_addressee_1').disable();
        this.managementForm.get('ccp_TiPerson_1').enable();
      }
    }
  }

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
    this.dictationService.typeDictamination = type;
    //this.dictationService.numberClassifyGood = this.formJobManagement.value.managementNumber ||  cveDocument;
    this.dictationService.crime = this.formVariables.get('b').value;
    this.selectVariable = filter;
    this.goodFilterParams(filter);
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

  selectProceedings(event: IUserRowSelectEvent<IGood>) {
    this.getStatusGood(event.data.status);
    this.selectedGood = event.selected;
    this.dictationService.goodNumber = event.data.id;
  }

  isDisabledBtnDocs = false;
  async onClickBtnPrint() {
    if (this.pantallaActual == '2') {
      await this.printRelationScreen();
    }
  }

  async printRelationScreen() {
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
      if (!values.addressee?.user) {
        this.alert('warning', '', 'Debe especificar el DESTINATARIO');
        return;
      }
    }

    if (values.jobType == 'EXTERNO') {
      if (!values.addressee) {
        this.alert('warning', '', 'Debe especificar el DESTINATARIO EXTERNO');
        return;
      }
    }

    if (!values.city) {
      this.alert('warning', '', 'Debe especificar la CIUDAD');
      return;
    }

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

      // const year = new Date().getFullYear();
      // const month = new Date().getMonth() + 1;
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
        this.pupAddGood();
      }

      if (checkText == this.se_refiere_a.B) {
        this.pupAddAnyGood();
      }
      this.commit();
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
        this.pupAddGood();
      }

      if (checkText == this.se_refiere_a.B && counter == 0) {
        this.pupAddAnyGood();
      }
      this.commit();
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
      if (count > 0) {
        this.isDisabledBtnDocs = true;
      }
    }
    // this.
    //TODO:  GO_BLOCK('NOTIFICACIONES');
    // EXECUTE_QUERY(NO_VALIDATE);
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

  sendDictamen() {
    // let config: ModalOptions = {
    //   initialState: {
    //     documento: {
    //       urlDoc: '',
    //       type: 'pdf',
    //     },
    //     callback: (data: any) => {},
    //   }, //pasar datos por aca
    //   class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
    //   ignoreBackdropClick: true, //ignora el click fuera del modal
    // };
    // this.modalService.show(UploadDictamenFilesModalComponent, config);
    if (this.pantallaActual == '1') {
      // Gestion Send button
      if (
        this.formJobManagement.value.statusOf == 'ENVIADO' &&
        !this.formJobManagement.value.cveManagement.includes('?')
      ) {
        console.log('PRIMER CONDICION');

        // Primer condicion al enviar
        this.firstConditionSend();
      } else {
        console.log('SEGUNDA CONDICION');

        // Segunda condicion al enviar
        this.secondConditionSend();
      }
    } else {
      this.onClickBtnSend();
    }
  }

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

  firstConditionSend() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('natureDocument', this.formJobManagement.value.jobType);
    params.addFilter(
      'documentNumber',
      this.formJobManagement.value.managementNumber
    );
    this.svLegalOpinionsOfficeService
      .getElectronicFirmData(params.getParams())
      .subscribe({
        next: async data => {
          console.log('FIRMA ELECTRONICA', data);
          if (data.count > 0) {
            // Valida FOLIO_UNIVERSAL
            let _nUniversalFolio = await firstValueFrom(
              this.sendFunction_nUniversalFolio(params)
            );
            if (_nUniversalFolio) {
              if (_nUniversalFolio.n_folio_universal) {
                // Se llama PUP_CONSULTA_PDF_BD_SSF3
                this._PUP_CONSULTA_PDF_BD_SSF3();
                this._end_firmProcess(); // Termina el proceso
              } else {
                this.onLoadToast(
                  'error',
                  'No se encontró el folio universal',
                  ''
                );
              }
            } else {
              this.onLoadToast(
                'error',
                'Error al buscar el folio universal del documento',
                ''
              );
            }
          }
        },
        error: async error => {
          console.log(error);
          if (error.status == 400) {
            // se llama PUP_GENERA_XML
            this._PUP_GENERA_XML();
          } else {
            // this.onLoadToast(
            //   'error',
            //   'Se tiene problemas al mostrar el reporte',
            //   ''
            // );
            let paramsReport = {
              proceedingsNumber: this.notificationData.expedientNumber,
              steeringWheelNumber: this.notificationData.wheelNumber,
              ofManagementKey: this.formJobManagement.value.cveManagement,
            };
            // se llama PUP_LANZA_REPORTE
            const _launchReport = await this._PUP_LANZA_REPORTE(paramsReport);
            //  = {
            //   no_exp: 0,
            //   correo: null,
            //   oficios: null,
            // };
            console.log(_launchReport);
            let reportCondition = this._conditions_Report();
            this.runReport(reportCondition.nameReport, reportCondition.params);
            if (_launchReport.no_exp > 0) {
              let _getVOficTrans = await firstValueFrom(
                this.sendFunction_getVOficTrans(params)
              );
              if (_getVOficTrans) {
                // _getVOficTrans.v_ofic_trans RESPUESTA
                if (_getVOficTrans.v_ofic_trans) {
                  if (
                    this.formJobManagement.value.statusOf != 'EN REVISION' &&
                    !this.formJobManagement.value.cveManagement.includes('?')
                  ) {
                    // EN REVISION POR RUBEN
                    // Subir el PDF a la ruta de documentos y reemplazarlo por el anterior
                  }
                }
              }
            }
            this._end_firmProcess(); // Termina el proceso
          }
        },
      });
  }

  enabledPrintAndBlockSend() {
    this.blockSend = true;
  }

  _PUP_GENERA_XML() {
    let reportCondition = this._conditions_Report();
    this.openModalFirm(reportCondition.nameReport, reportCondition.params);
  }

  openModalFirm(nameReport: string = 'RGEROFGESTION', params: any = null) {
    this.hideError(true);
    let nameFile = this.formJobManagement
      .get('cveManagement')
      .value.replaceAll('/', '-')
      .replaceAll('?', '0')
      .replaceAll(' ', '');
    let paramsData = new ListParams();
    paramsData = {
      ...params,
      nombreReporte: nameReport + '.jasper',
    };
    this.svLegalOpinionsOfficeService.getXMLReportToFirm(paramsData).subscribe({
      next: (response: any) => {
        console.log(response);
        if (!response) {
          this.onLoadToast(
            'warning',
            'Ocurrió un error al cargar el XML con el nombre: ' + nameFile,
            ''
          );
          return;
        }
        const formData = new FormData();
        const file = new File([response], nameFile + '.xml', {
          type: 'text/xml',
        });
        formData.append('file', file);
        this.startFirmComponent({
          nameFileDictation: nameFile,
          natureDocumentDictation: this.formJobManagement.value.jobType,
          numberDictation: this.formJobManagement.value.managementNumber,
          typeDocumentDictation: this.formJobManagement.value.statusOf
            ? this.formJobManagement.value.statusOf
            : 'ENVIADO',
          fileDocumentDictation: formData.get('file'), // DOCUMENTO XML GENERADO
        });
      },
      error: error => {
        console.log(error);
        if (error.status == 200) {
          let response = error.error.text;
          if (!response) {
            this.onLoadToast(
              'warning',
              'Ocurrió un error al cargar el XML con el nombre: ' + nameFile,
              ''
            );
            return;
          }
          if (!response.includes('xml')) {
            this.onLoadToast(
              'warning',
              'Ocurrió un error al cargar el XML con el nombre: ' + nameFile,
              ''
            );
            return;
          }
          const formData = new FormData();
          const file = new File([response], nameFile + '.xml', {
            type: 'text/xml',
          });
          formData.append('file', file);
          // this.startFirmComponent({
          //   nameFileDictation: nameFile,
          //   ...params,
          //   fileDocumentDictation: formData.get('file'), // DOCUMENTO XML GENERADO
          // });
          this.startFirmComponent({
            nameFileDictation: nameFile,
            natureDocumentDictation: this.formJobManagement.value.jobType,
            numberDictation: this.formJobManagement.value.managementNumber,
            typeDocumentDictation: this.formJobManagement.value.statusOf
              ? this.formJobManagement.value.statusOf
              : 'ENVIADO',
            fileDocumentDictation: formData.get('file'), // DOCUMENTO XML GENERADO
          });
        } else {
          this.onLoadToast(
            'warning',
            'Ocurrió un error al CREAR el XML con el nombre: ' + nameFile,
            ''
          );
        }
      },
    });
  }

  startFirmComponent(context?: Partial<UploadDictamenFilesModalComponent>) {
    const modalRef = this.modalService.show(UploadDictamenFilesModalComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.responseFirm.subscribe((next: any) => {
      console.log('next', next);
      // CONTINUAR DESPUÉS DE FIRMADO
      const params = new FilterParams();
      params.removeAllFilters();
      params.addFilter('natureDocument', this.formJobManagement.value.jobType);
      params.addFilter(
        'documentNumber',
        this.formJobManagement.value.managementNumber
      );
      params.addFilter('documentType', this.formJobManagement.value.statusOf);
      this.svLegalOpinionsOfficeService
        .getElectronicFirmData(params.getParams())
        .subscribe({
          next: resp => {
            console.log(resp);
            if (resp.count > 0) {
              this.blockSend = true;
              // Update M_OFICIO_DICTAMEN
              this._end_firmProcess();
            }
          },
          error: error => {
            console.log(error);
            // if (error.status == 400) {
            // }
            // Regresar clave_armada, regresar fecha oficio y fecha de oficio
            // Update a M Oficio Dictamen
            this.alertInfo(
              'warning',
              'No se encontró el archivo firmado. El documento no ha sido enviado',
              ''
            );
          },
        });
      // this.openModalFirm(nameReport, params);
      // this._end_firmProcess(); // Termina el proceso
    });
  }

  deleteTempDictation() {
    // DELETE TMP_DICTAMINACIONES
    // let body: any = {};
    // this.svLegalOpinionsOfficeService.deleteTmpDictation(body).subscribe({
    //   next: data => {
    //     console.log('DELETE TMP_DICTAMINACIONES', data);
    //   },
    //   error: error => {
    //     console.log(error);
    //   },
    // });
  }

  async _PUP_GENERA_PDF() {
    const userInfo = await this.getUserInfo();

    let reportCondition = this._conditions_Report();
    this.siabService
      .fetchReport(reportCondition.nameReport, reportCondition.params)
      .subscribe(response => {
        console.log(response);
        if (response !== null) {
          const blob = new Blob([response], { type: 'application/pdf' });
          let nameFile = this.formJobManagement.value.cveManagement.replaceAll(
            '/',
            '-'
          );
          const document = {
            numberProceedings: this.paramsGestionDictamen.expediente,
            keySeparator: '60',
            keyTypeDocument: 'ENTRE',
            natureDocument: 'ORIGINAL',
            descriptionDocument: `OFICIO DE ACLARACION ${this.formJobManagement.value.jobType} ${this.formJobManagement.value.cveManagement}`, // Clave de Oficio Armada
            significantDate: format(new Date(), 'MM-yyyy'),
            scanStatus: 'ESCANEADO',
            userRequestsScan:
              userInfo.user == 'SIGEBIADMON'
                ? userInfo.user.toLocaleLowerCase()
                : userInfo.user,
            scanRequestDate: new Date(),
            numberDelegationRequested: userInfo.delegationNumber,
            numberSubdelegationRequests: userInfo.subdelegationNumber,
            numberDepartmentRequest: userInfo.departamentNumber,
            flyerNumber: this.notificationData.wheelNumber,
          };

          this.getDocumentsCount().subscribe(count => {
            if (count == 0) {
              // ACTUALIZAR REGISTRO PARA EL DOCUMENTO
              this.createDocument(document)
                .pipe(
                  tap(_document => {
                    // this.formScan.get('scanningFoli').setValue(_document.id);
                  }),
                  // switchMap(_document => {
                  //   // let obj: any = {
                  //   //   id: this.dictationData.id,
                  //   //   typeDict: this.dictationData.typeDict,
                  //   //   folioUniversal: _document.id,
                  //   // };
                  //   // return this.svLegalOpinionsOfficeService
                  //   //   .updateDictations(obj)
                  //   //   .pipe(map(() => _document));
                  // }),
                  switchMap(async _document =>
                    this.uploadPdfEmitter(blob, nameFile + '.pdf', _document.id)
                  )
                )
                .subscribe();
            } else {
              // // INSERTAR REGISTRO PARA EL DOCUMENTO
              // this.createDocument(document)
              //   .pipe(
              //     tap(_document => {
              //       // this.formScan.get('scanningFoli').setValue(_document.id);
              //     }),
              //     // switchMap(_document => {
              //     //   // let obj: any = {
              //     //   //   id: this.dictationData.id,
              //     //   //   typeDict: this.dictationData.typeDict,
              //     //   //   folioUniversal: _document.id,
              //     //   // };
              //     //   // return this.svLegalOpinionsOfficeService
              //     //   //   .updateDictations(obj)
              //     //   //   .pipe(map(() => _document));
              //     // }),
              //     switchMap(async _document =>
              //       this.uploadPdfEmitter(blob, nameFile + '.pdf', _document.id)
              //     )
              //   )
              //   .subscribe();
            }
          });
        } else {
          this.alert('warning', 'Reporte no disponible por el momento', '');
        }
      });
  }

  createDocument(document: IDocuments) {
    return this.documentsService.create(document).pipe(
      tap(_document => {
        // END PROCESS
      }),
      catchError(error => {
        this.onLoadToast(
          'error',
          'Ocurrió un error al guardar el reporte PDF',
          ''
        );
        return throwError(() => error);
      })
    );
  }

  updateDocument(document: IDocuments) {
    return this.documentsService.create(document).pipe(
      tap(_document => {
        // END PROCESS
      }),
      catchError(error => {
        this.onLoadToast(
          'error',
          'Ocurrió un error al guardar el reporte PDF',
          ''
        );
        return throwError(() => error);
      })
    );
  }

  getDocumentsCount() {
    const params = new FilterParams();
    params.addFilter('scanStatus', 'ESCANEADO');
    params.addFilter('flyerNumber', this.formJobManagement.value.flyerNumber);
    params.addFilter(
      'numberProceedings',
      this.paramsGestionDictamen.expediente
    );
    console.log(params);
    this.hideError();
    return this.documentsService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        if (error.status < 500) {
          return of({ count: 0 });
        }
        this.onLoadToast(
          'error',
          'Ocurrió un error al validar al obtener los documentos',
          error.error.message
        );
        return throwError(() => error);
      }),
      map(response => response.count)
    );
  }

  uploadPdfEmitter(
    blobFile: Blob,
    nameAndExtension: string,
    folioUniversal: string | number
  ) {
    console.log(
      'DOCUMENT PDF UPLOAD ',
      blobFile,
      nameAndExtension,
      folioUniversal
    );
    // UPLOAD PDF TO DOCUMENTS
    let filePdf = new File([blobFile], nameAndExtension);
    this.fileBrowserService
      .uploadFileByFolio(folioUniversal, filePdf)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al subir el reporte'
          );
        },
        complete: async () => {
          console.log('COMPLETADO SUBIR PDF');
        },
      });
  }

  deletePDF(nameAndExtension: string, folioUniversal: string | number) {
    // DELETE PDF TO DOCUMENTS
    this.fileBrowserService
      .deleteByFolioAndFilename(folioUniversal, nameAndExtension)
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: error => {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrió un error al eliminar el reporte anterior'
          );
        },
        complete: async () => {
          console.log('COMPLETADO SUBIR PDF');
        },
      });
  }

  // createDocument(document: IDocuments) {
  //   return this.documentsService.create(document).pipe(
  //     tap(_document => {
  //       // END PROCESS
  //     }),
  //     catchError(error => {
  //       this.onLoadToast(
  //         'error',
  //         'Error',
  //         'Ocurrió un error al generar el reporte PDF'
  //       );
  //       return throwError(() => error);
  //     })
  //   );
  // }

  async _PUP_LANZA_REPORTE(params: any) {
    return await firstValueFrom(this.sendFunction_pupLaunchReport(params));
    // this.dictationService.sendFunction_pupLaunchReport();
  }

  _conditions_Report() {
    let nameReport: string = '';
    if (
      this.formJobManagement.value.jobType == 'INTERNO' &&
      this.paramsGestionDictamen.pllamo != 'ABANDONO'
    ) {
      nameReport = 'RGEROFGESTION';
    }
    if (
      this.formJobManagement.value.jobType == 'EXTERNO' &&
      this.paramsGestionDictamen.pllamo != 'ABANDONO'
    ) {
      nameReport = 'RGEROFGESTION_EXT';
    }
    if (
      this.formJobManagement.value.jobType == 'EXTERNO' &&
      this.paramsGestionDictamen.pllamo == 'ABANDONO'
    ) {
      nameReport = 'RGENABANSUB';
    }
    // Parametros de la forma
    let params: any = {
      NO_OF_GES: this.formJobManagement.value.managementNumber, // NO_OF_GES
      TIPO_OF: this.formJobManagement.value.jobType, // TIPO_OF
      VOLANTE: this.notificationData.wheelNumber, // VOLANTE
      EXP: this.notificationData.expedientNumber, // EXPEDIENTE
      ESTAT_DIC: this.formJobManagement.value.statusOf, // ESTATUS DEL OFICIO
    };
    return { nameReport: nameReport, params: params };
    // this.runReport(nameReport, params);
  }

  _PUP_CONSULTA_PDF_BD_SSF3() {
    // Abrir apartado de documentos e imagenes
    this.getDocumentsByFlyer(this.notificationData.wheelNumber);
  }

  /**
   * Apartado para llamar los documentos relacionados al volante y al folio universal
   * se llama primero la funcion @getDocumentsByFlyer
   * @param flyerNum Numero de volante
   */

  openDocumentsModal(flyerNum: string | number, title: string) {
    const params = new FilterParams();
    params.addFilter('flyerNumber', flyerNum);
    const $params = new BehaviorSubject(params);
    const $obs = this.documentsService.getAllFilter;
    const service = this.documentsService;
    const columns = RELATED_FOLIO_COLUMNS;
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        $obs,
        service,
        columns,
        title,
        $params,
        showConfirmButton: true,
      },
    };
    return this.modalService.show(
      MailboxModalTableComponent<IDocuments>,
      config
    );
  }

  getDocumentsByFlyer(flyerNum: string | number) {
    const title = 'Folios relacionados al Volante';
    const modalRef = this.openDocumentsModal(flyerNum, title);
    modalRef.content.selected
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(document => this.getPicturesFromFolio(document));
  }

  getPicturesFromFolio(document: IDocuments) {
    let folio = document.id;
    if (document.associateUniversalFolio) {
      folio = document.associateUniversalFolio;
    }
    const config = {
      ...MODAL_CONFIG,
      ignoreBackdropClick: false,
      initialState: {
        folio,
      },
    };
    this.modalService.show(DocumentsViewerByFolioComponent, config);
  }

  async secondConditionSend() {
    this.variablesSend.ESTATUS_OF = this.formJobManagement.value.statusOf;
    this.variablesSend.CVE_OF_GESTION =
      this.formJobManagement.value.cveManagement;
    this.variablesSend.FECHA_INSERTO = this.formJobManagement.value.insertDate;
    if (!this.formJobManagement.value.jobType) {
      this.alertInfo('warning', 'Debe especificar el TIPO OFICIO', '');
      return;
    }
    if (!this.formJobManagement.value.sender) {
      this.alertInfo('warning', 'Debe especificar el REMITENTE', '');
      return;
    }
    if (this.formJobManagement.value.jobType == 'INTERNO') {
      this.alertInfo('warning', 'Debe especificar el DESTINATARIO', '');
      return;
    }
    if (this.formJobManagement.value.jobType == 'EXTERNO') {
      if (!this.formJobManagement.value.addressee) {
        this.alertInfo(
          'warning',
          'Debe especificar al DESTINATARIO EXTERNO',
          ''
        );
        return;
      }
    }
    if (!this.formJobManagement.value.city) {
      this.alertInfo('warning', 'Debe especificar la CIUDAD', '');
      return;
    }
    if (
      this.formJobManagement.value.statusOf == 'EN REVISION' ||
      !this.formJobManagement.value.statusOf
    ) {
      if (!this.variablesSend.V_JUSTIFICACION) {
        this.alertInfo(
          'warning',
          'Es necesario contar con una justificación para poder cerrar el oficio',
          ''
        );
        return;
      }
      console.log('CONSULTAR ACTNOM');

      // CONSULTAR ACTNOM
      const _actnom = await firstValueFrom(
        this.sendFunction_pupLaunchReport(
          this.formJobManagement.value.managementNumber
        )
      );
      if (_actnom.actnom == 1) {
        this.alertInfo(
          'info',
          'SE ACTUALIZARÁ LA NOMENCLATURA CONFORME AL NUEVO ESTATUTO YA QUE FUE ELABORADO ANTES DE LA PUBLICACION DE ESTÉ',
          ''
        ).then(() => {
          // Se llama PUF_GENERA_CLAVE para crear clave
          // this.formJobManagement.get('cveManagemen').setValue();
          // REVISANDO CON EDWIN
        });
      }

      const _valida_ext_dom = await this._PUP_VALIDA_EXT_DOM();

      if (_valida_ext_dom) {
        if (_valida_ext_dom.n_count > 0) {
          if (_valida_ext_dom.pllamo) {
            this.paramsGestionDictamen.pllamo = _valida_ext_dom.pllamo;
          }
        }
      }

      if (
        this.paramsGestionDictamen.pllamo == 'ABANDONO' ||
        this.paramsGestionDictamen.pllamo == 'EXT_DOM'
      ) {
        const userInfo = await this.getUserInfo();
        let objSearchKeyParams: any = {
          cveOfGestion: this.formJobManagement.value.cveManagement,
          toolbarNoDelegacion: userInfo.delegationNumber,
        };
        const _busca_numero = await this._PUP_BUSCA_NUMERO(objSearchKeyParams);
        if (this.formJobManagement.value.managementNumber == null) {
          // this.formJobManagement.value.managementNumber = _busca_numero.;
          // BUSCA NUMERO REVISAR RESPUESTA
          //         {
          //   "LN_OFICIO": "7",
          //   "numberOfGestion": 390475,
          //   "cveOfGestion": "DCCM/DECBMI/ESC/0681/2023",
          //   "InsertDate": "2023-06-12T22:35:01-06:00"
          // }
          this.formJobManagement.value.managementNumber = this.formJobManagement
            .value.managementNumber
            ? this.formJobManagement.value.managementNumber
            : _busca_numero.LN_OFICIO; // LN_OFICIO
          this.formJobManagement.value.cveManagement =
            _busca_numero.cveOfGestion; // cveOfGestion
          this.formJobManagement.value.insertDate = format(
            _busca_numero.insertDate,
            'yyyy/MM/dd'
          ); // InsertDate
          // this.variablesSend.ESTATUS_OF = this.formJobManagement.value.statusOf;
          // this.variablesSend.CVE_OF_GESTION =
          //   this.formJobManagement.value.cveManagement;
          // this.variablesSend.FECHA_INSERTO =
          //   this.formJobManagement.value.insertDate;
        }
        const _cambia_estatus = await this._PUP_CAMBIA_ESTATUS();
        // Llamar las globales y obtener gnu_activa_gestion
        let paramsActGestion = {
          pGestOk: this.paramsGestionDictamen.pGestOk,
          gnuActivaManagement: 1,
          pCall: this.paramsGestionDictamen.pllamo,
          pNoProcess: this.paramsGestionDictamen.pNoTramite,
          noFlyer: this.notificationData.wheelNumber,
        };
        const _act_gestion = await this._PUP_ACT_GESTION(paramsActGestion);
        if (_act_gestion.status != 200) {
          this.onLoadToast('error', _act_gestion.message, '');
          return;
        }
        if (this.paramsGestionDictamen.pllamo == 'ABANDONO') {
          let reportCondition = this._conditions_Report();
          this.variablesSend.ESTATUS_OF = this.formJobManagement.value.statusOf;
          this.variablesSend.CVE_OF_GESTION =
            this.formJobManagement.value.cveManagement;
          this.variablesSend.FECHA_INSERTO =
            this.formJobManagement.value.insertDate;
          this.formJobManagement.value.statusOf = 'ENVIADO';
          // this.runReport(reportCondition.nameReport, reportCondition.params);
          // const _abandono = await this._PUP_ABANDONO();
        }
        this.enabledPrintAndBlockSend();
        this.formJobManagement.value.statusOf = 'ENVIADO';
        // Save M_OFICIO_GESTION
        this._end_firmProcess(); // Termina el proceso
      } else {
        if (
          this.formJobManagement.value.sender ==
          this.authUser.preferred_username
        ) {
          const params = new FilterParams();
          params.removeAllFilters();
          params.addFilter(
            'natureDocument',
            this.formJobManagement.value.jobType
          );
          params.addFilter(
            'documentNumber',
            this.formJobManagement.value.managementNumber
          );
          params.addFilter(
            'documentType',
            this.formJobManagement.value.statusOf
          );
          this.svLegalOpinionsOfficeService
            .getElectronicFirmData(params.getParams())
            .subscribe({
              next: data => {
                console.log('FIRMA ELECTRONICA', data);
                if (data.count > 0) {
                  this.alertInfo(
                    'info',
                    'Se realizó la firma del dictamen',
                    ''
                  ).then(async () => {
                    const _cambia_estatus = await this._PUP_CAMBIA_ESTATUS();
                    // Llamar las globales y obtener gnu_activa_gestion
                    let paramsActGestion = {
                      pGestOk: this.paramsGestionDictamen.pGestOk,
                      gnuActivaManagement: this.globalVars.gnuActivaGestion, // Variable Global
                      pCall: this.paramsGestionDictamen.pllamo,
                      pNoProcess: this.paramsGestionDictamen.pNoTramite,
                      noFlyer: this.notificationData.wheelNumber,
                    };
                    const _act_gestion = await this._PUP_ACT_GESTION(
                      paramsActGestion
                    );

                    if (_act_gestion.status != 200) {
                      this.onLoadToast('error', _act_gestion.message, '');
                      return;
                    }
                    this.formJobManagement.value.statusOf = 'ENVIADO';
                    // se llama PUP_GENERA_PDF
                    this._PUP_GENERA_PDF();
                    this.enabledPrintAndBlockSend();
                    // Save M_OFICIO_GESTION
                    this._end_firmProcess(); // Termina el proceso
                  });
                }
              },
              error: async error => {
                console.log(error);
                if (error.status == 400) {
                  // se llama PUP_GENERA_XML
                  this._PUP_GENERA_XML();

                  this.alertInfo(
                    'info',
                    'Se realizó la firma del dictamen',
                    ''
                  ).then(async () => {
                    // Llamar las globales y obtener gnu_activa_gestion
                    let paramsActGestion = {
                      pGestOk: this.paramsGestionDictamen.pGestOk,
                      gnuActivaManagement: this.globalVars.gnuActivaGestion, // Variable Global
                      pCall: this.paramsGestionDictamen.pllamo,
                      pNoProcess: this.paramsGestionDictamen.pNoTramite,
                      noFlyer: this.notificationData.wheelNumber,
                    };
                    const _act_gestion = await this._PUP_ACT_GESTION(
                      paramsActGestion
                    );

                    if (_act_gestion.status != 200) {
                      this.onLoadToast('error', _act_gestion.message, '');
                      return;
                    }
                    this.formJobManagement.value.statusOf = 'ENVIADO';
                    // se llama PUP_GENERA_PDF
                    this._PUP_GENERA_PDF();
                    this.enabledPrintAndBlockSend();
                    // Save M_OFICIO_GESTION
                    this._end_firmProcess(); // Termina el proceso
                  });
                } else {
                  this.onLoadToast(
                    'error',
                    'Se tiene problemas al mostrar el reporte',
                    ''
                  );
                }
              },
            });
        }
      }
    } else {
      this._end_firmProcess(); // Termina el proceso
    }
  }

  errorFirm() {
    this.formJobManagement
      .get('statusOf')
      .setValue(this.variablesSend.ESTATUS_OF);
    this.formJobManagement
      .get('cveManagement')
      .setValue(this.variablesSend.CVE_OF_GESTION);
    this.formJobManagement
      .get('insertDate')
      .setValue(this.variablesSend.FECHA_INSERTO);
    this.blockSend = false;
  }

  getEstPreviousHistory(body: any) {
    return new Promise((resolve, reject) => {
      this.goodHistoryService.getPreviousHistoryGood(body).subscribe({
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

  getEstPreviousHistory2(body: any) {
    return new Promise((resolve, reject) => {
      this.goodHistoryService.getPreviousHistoryGood2(body).subscribe({
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

  goBack() {
    this.router.navigate(['/pages/juridical/file-data-update'], {
      queryParams: { wheelNumber: this.formJobManagement.value.flyerNumber },
    });
  }

  updateGood(good: any) {
    return new Promise((resolve, reject) => {
      this.goodServices.update(good).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject('no se pudo actualizar los bienes');
          this.onLoadToast('error', 'No se pudo actualizar los bienes', '');
        },
      });
    });
  }

  fgrResponses() {
    const notifications = this.formNotification.value;
    if (!notifications.wheelNumber) {
      this.onLoadToast(
        'info',
        'Error',
        'El dictamen no cuenta con un numero de volante'
      );
      return;
    }
    let config = {
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        pgrOffice: notifications.officeExternalKey,
      },
      ignoreBackdropClick: true,
    };
    this.modalService.show(PgrFilesComponent, config);
  }

  getGoodOfficeManagements(page: number, limit: number) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.managementNumber'] =
        this.formJobManagement.value.managementNumber;
      params.limit = limit;
      params.page = page;
      // debugger;
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

  validateGDateToUpdateGoodStatus(body: any) {
    return new Promise((resolve, reject) => {
      this.goodHistoryService.validateDateToUpdateStatus(body).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: error => {
          reject('error');
          this.onLoadToast(
            'error',
            'Error en la validacion',
            'No se pudo validar las fechas'
          );
        },
      });
    });
  }

  setMonthsAndDay(month: number) {
    let result = month.toString();
    if (month === 1) {
      result = '01';
    } else if (month === 2) {
      result = '02';
    } else if (month === 3) {
      result = '03';
    } else if (month === 4) {
      result = '04';
    } else if (month === 5) {
      result = '05';
    } else if (month === 6) {
      result = '06';
    } else if (month === 7) {
      result = '07';
    } else if (month === 8) {
      result = '08';
    } else if (month === 9) {
      result = '09';
    }

    return result;
  }
  convertdateNumeric(date: Date) {
    return (
      date.getFullYear() +
      '-' +
      this.setMonthsAndDay(date.getMonth()) +
      '-' +
      date.getDate()
    );
  }
  async _PUP_VALIDA_EXT_DOM() {
    return await firstValueFrom(
      this.sendFunction_pupValidExtDom(this.notificationData.wheelNumber)
    );
  }

  async _PUP_BUSCA_NUMERO(obj: any) {
    return await firstValueFrom(this.sendFunction_findOffficeNu(obj));
  }

  _PUP_CAMBIA_ESTATUS() {}

  async _PUP_ACT_GESTION(obj: any) {
    return await firstValueFrom(this.sendFunction_ObtainKeyOffice(obj));
  }

  _PUP_ABANDONO() {}

  _PUF_GENERA_CLAVE() {}

  async _end_firmProcess() {
    let LV_TRAMITE = await this._GESTION_TRAMITE_TIPO_TRAMITE();
    console.log(LV_TRAMITE);
    if (LV_TRAMITE) {
      if (LV_TRAMITE.typeManagement == 3) {
        this._PGR_IMAGENES_LV_PGRIMAG();
      }
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

  async updateIfHaveDictamen(no_volante: number | string) {
    const existDictamen: any = await this.dictationCount(no_volante);
    //actuliza si no tiene dictamenes
    if (existDictamen.count == 0) {
      const notifBody: any = { dictumKey: null };
      this.notificationService.update(Number(no_volante), notifBody);
    }
  }

  runReport(nameReport: string = '', params: any) {
    this.siabService.fetchReport(nameReport, params).subscribe(response => {
      console.log(response);
      if (response !== null) {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        let config = {
          initialState: {
            documento: {
              urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
              type: 'pdf',
            },
            callback: (data: any) => {},
          }, //pasar datos por aca
          class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
          ignoreBackdropClick: true, //ignora el click fuera del modal
        };
        this.modalService.show(PreviewDocumentsComponent, config);
      } else {
        this.alert('warning', ERROR_REPORT, '');
      }
    });
  }
}
