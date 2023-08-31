/** BASE IMPORT */
import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subscription, takeUntil, tap } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IUserRowSelectEvent } from 'src/app/core/interfaces/ng2-smart-table.interface';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { IGood } from 'src/app/core/models/good/good.model';
import {
  IDictation,
  IDictationCopies,
} from 'src/app/core/models/ms-dictation/dictation-model';
import { IDictationXGood1 } from 'src/app/core/models/ms-dictation/dictation-x-good1.model';
import { IOfficialDictation } from 'src/app/core/models/ms-dictation/official-dictation.model';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import {
  DictumData,
  INotification,
} from 'src/app/core/models/ms-notification/notification.model';
import { ICopiesJobManagementDto } from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import { IMJobManagement } from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { IUserAccessAreaRelational } from 'src/app/core/models/ms-users/seg-access-area-relational.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { DictationService } from 'src/app/core/services/ms-dictation/dictation.service';
import { OficialDictationService } from 'src/app/core/services/ms-dictation/oficial-dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { JobDictumTextsService } from 'src/app/core/services/ms-office-management/job-dictum-texts.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { HistoricalProcedureManagementService } from 'src/app/core/services/ms-procedure-management/historical-procedure-management.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  JURIDICAL_FILE_UPDATE_SEARCH_COLUMNS,
  JURIDICAL_FILE_UPDATE_SEARCH_FIELDS,
} from '../../file-data-update/interfaces/columns';
import { IJuridicalFileDataUpdateForm } from '../../file-data-update/interfaces/file-data-update-form';
import { FileUpdateCommunicationService } from '../../file-data-update/services/file-update-communication.service';
import { JuridicalFileUpdateService } from '../../file-data-update/services/juridical-file-update.service';
import { JURIDICAL_FILE_DATA_UPDATE_FORM } from '../constants/form-declarations';
import { AbandonmentsDeclarationTradesService } from '../service/abandonments-declaration-trades.service';
import { AddCopyComponent } from './add-copy/add-copy.component';
import {
  COLUMNS_BIENES,
  COLUMNS_DOCUMENTS,
  EXTERNOS_COLUMS_OFICIO,
} from './columns';
import { DocsComponent } from './docs/docs.component';
import { EditTextComponent } from './edit-text/edit-text.component';
import { ListdictumsComponent } from './listdictums/listdictums.component';
import { ListoficiosComponent } from './listoficios/listoficios.component';
import {
  Documents,
  IDictationTemp,
  IDictationXGood1Temp,
  IMJobManagementTemp,
  IOficialDictationTemp,
} from './models';
import { TEXTOS } from './textos';
import { UpdateCopyComponent } from './update-copy/update-copy.component';
/** ROUTING MODULE */
@Component({
  selector: 'app-abandonments-declaration-trades',
  templateUrl: './abandonments-declaration-trades.component.html',
  styleUrls: ['./abandonments-declaration-trades.component.scss'],
})
export class AbandonmentsDeclarationTradesComponent
  extends BasePage
  implements OnInit, OnDestroy
{
  public optionsTipoVolante = [
    { value: 'Administrativo', label: 'Administrativo' },
    { value: 'Procesal', label: 'Procesal' },
    { value: 'Admin. Trans', label: 'Admin. Trans' },
    { value: 'Transferente', label: 'Transferente' },
  ];
  public form: FormGroup;
  public formOficio: FormGroup;
  public formFolioEscaneo: FormGroup;
  public formCcpOficio: FormGroup;
  public formDeclaratoria: FormGroup;
  public formDeclaratoriaTabla: FormGroup;
  public formOficiopageFin: FormGroup;
  public formDeclaratoriapageFin: FormGroup;
  public di_status: FormGroup;
  declarationForm = this.fb.group(JURIDICAL_FILE_DATA_UPDATE_FORM);
  searchMode: boolean = false;
  confirmSearch: boolean = false;
  formData: Partial<IJuridicalFileDataUpdateForm> = null;
  selectedRow: INotification;
  change_Dict: any;
  columnsType = { ...JURIDICAL_FILE_UPDATE_SEARCH_COLUMNS };
  fieldsToSearch = [...JURIDICAL_FILE_UPDATE_SEARCH_FIELDS];
  showTabs: boolean = true;
  senders = new DefaultSelect<IUserAccessAreaRelational>();
  recipients = new DefaultSelect<IUserAccessAreaRelational>();
  cities = new DefaultSelect<ICity>();
  cities2 = new DefaultSelect<ICity>();
  selectedGood: IGood[] = [];
  disabled: boolean = true;
  /** Tabla bienes */
  proceedingSettings = { ...this.settings };
  data1: any = [];
  settings1 = { ...this.settings };
  params: any = new BehaviorSubject<ListParams>(new ListParams());
  data2: any = [];
  settings2 = { ...this.settings };
  settings3 = { ...this.settings };
  texto1: string = '';

  disabledIMPRIMIR: boolean = false;
  disabledTIPO_OFICIO: boolean = false;
  disbaledAPROBAR: boolean = true;
  disabledENVIAR: boolean = false;

  totalItems: number = 0;
  items = new DefaultSelect<any>();
  items2 = new DefaultSelect<any>();
  lockStatus: boolean = true;
  valTiposAll: boolean;
  loadingText: string = '';
  EXTERNO: string = 'EXTERNO';
  ABANDONO: string = 'ABANDONO';
  public formLoading: boolean = false;

  // formLoading: boolean = false;
  folioEscaneoNg: any = '';
  valReadonly: boolean = true;
  V_VAL_ELIM: number = 0;
  delegacionreg: any;
  disabledTabs: boolean = false;
  disabledDocs: boolean = true;
  dictDate2: any = '';
  datosRecibidos: DictumData;
  private subscription: Subscription;

  // DICTAMEN //
  dictamen: IDictation;
  cveoficio_Oficio: any = '';
  dictamenes: any = [];
  dictamenNull: any;
  disabledListDictums: boolean = false;

  // OFICIO DICTAMEN //
  oficioDictamen: IOfficialDictation;
  statusOfOficio: any = '';
  oficioDictamenUpdate: boolean = false;
  oficioDictamenNull: any;

  // DICTAMEN X BIEN 1 //
  dictamenXGood1: IDictationXGood1;
  dictamenesXBien1: any[] = [];
  dictamenXGood1Null: any;

  // ID VOLANTE Y ID EXPEDIENTE //
  idExpediente: any = null;
  noVolante_: any = null;

  // M_OFICIO_GESTION //
  m_oficio_gestion: IMJobManagement;
  updateOficioGestion: boolean = false;
  statusOfMOficioGestion: string = '';
  cveManagement: string = '';
  disabledBTNs: boolean = false;
  externoVal: boolean = false;
  dateCapture2: string = '';
  selectedItem: string = '';
  myForm: FormGroup;

  filtroPersonaExt: ICopiesJobManagementDto[] = [];
  copyOficio: any[] = [];
  SiglasNivel2: any = '';
  constructor(
    private documentsService: DocumentsService,
    private DictationXGood1Service: DictationXGood1Service,
    private OficialDictationService: OficialDictationService,
    private screenStatusService: ScreenStatusService,
    private fb: FormBuilder,
    private abandonmentsService: AbandonmentsDeclarationTradesService,
    public fileUpdateService: JuridicalFileUpdateService,
    private changeDetectorRef: ChangeDetectorRef,
    private docDataService: DocumentsReceptionDataService,
    private readonly goodServices: GoodService,
    private router: Router,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private expedientService: ExpedientService,
    private activateRoute: ActivatedRoute,
    private token: AuthService,
    private goodprocessService: GoodprocessService,
    private securityService: SecurityService,
    private mJobManagementService: MJobManagementService,
    private historicalProcedureManagementService: HistoricalProcedureManagementService,
    private goodsJobManagementService: GoodsJobManagementService,
    private dictationService: DictationService,
    private jobDictumTextsService: JobDictumTextsService,
    private notificationService: NotificationService,
    private delegationService: DelegationService,
    private statusGoodService: StatusGoodService,
    private fileUpdateCommunicationService: FileUpdateCommunicationService,
    private readonly historyGoodService: HistoryGoodService,
    private parametersService: ParametersService,
    private renderer: Renderer2,
    private datePipe: DatePipe
  ) {
    super();

    this.dictamen = IDictationTemp;
    this.oficioDictamen = IOficialDictationTemp;
    this.dictamenXGood1 = IDictationXGood1Temp;
    this.m_oficio_gestion = IMJobManagementTemp;
    this.dictamenXGood1Null = IDictationXGood1Temp;
    this.dictamenNull = IDictationTemp;
    this.oficioDictamenNull = IOficialDictationTemp;

    this.settings1 = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: { ...COLUMNS_BIENES },
    };

    this.settings2 = {
      ...this.settings,
      actions: false,
      // selectMode: 'multi',
      columns: { ...COLUMNS_DOCUMENTS },
    };

    this.settings.columns = EXTERNOS_COLUMS_OFICIO;

    this.settings3 = {
      ...this.settings,
      actions: {
        edit: false,
        add: false,
        delete: true,
      },
      hideSubHeader: false,
      columns: { ...EXTERNOS_COLUMS_OFICIO },
    };
    // this.settings3.

    // this.settings = {
    //   ...this.settings,
    //   hideSubHeader: false,
    //   actions: {
    //     columnTitle: 'Acciones',
    //     edit: false,
    //     delete: true,
    //     add: false,
    //     position: 'left',
    //   },
    // };

    this.settings1.rowClassFunction = (row: any) => {
      if (row.data.est_disponible == 'S') {
        row.isSelected = false;
        if (row.data.labelNumber == 6) {
          row.data.est_disponible = 'N';
          row.data.SELECCIONAR = 1;
          row.data.SEL_AUX = 1;
          return 'bg-green-to-confirm-verdadero';
        } else {
          row.data.SELECCIONAR = 0;
          row.data.SEL_AUX = 0;
          return 'bg-green-to-confirm';
        }
      } else {
        if (row.data.est_disponible == 'N') {
          row.isSelectable = false;
          if (row.data.labelNumber == 6) {
            row.data.SELECCIONAR = 1;
            row.data.SEL_AUX = 1;
            return 'bg-black-unavailable-roj';
          } else {
            row.data.SELECCIONAR = 1;
            row.data.SEL_AUX = 1;
            return 'bg-black-unavailable';
          }
        }
      }
      return '';
    };

    this.subscription =
      this.fileUpdateCommunicationService.datosEnviados$.subscribe(
        (datos: any) => {
          this.datosRecibidos = datos;
          console.log('DictumKey', this.datosRecibidos);
          if (this.datosRecibidos.id == 20) {
            this.disabledTabs = true;
            // this.disabledTIPO_OFICIO = true;
            this.disbaledAPROBAR = true;
          } else {
            this.disabledTabs = false;
          }
        }
      );
  }

  get formControls() {
    return this.declarationForm.controls;
  }

  get dictDate() {
    return format(new Date(), 'dd-MM-yyyy');
    return this.declarationForm.controls['dictDate'].value;
  }

  get dateCapture() {
    return format(new Date(), 'dd-MM-yyyy');
  }

  ngOnInit(): void {
    console.log('AQUI', this.dictamen);
    this.selectedItem = 'AQUUIII ESTOY';
    this.prepareForm();
    this.disabledENVIAR = false;
    this.valTiposAll = false;
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => this.onLoadGoodList('all'))
      )
      .subscribe();

    this.SiglasNivel2 = this.token.decodeToken().siglasnivel2;
    // OBTENEMOS DELEGACIÓN DEL USUARIO //
    const paramsSender = new ListParams();
    paramsSender.text = this.token.decodeToken().preferred_username;
    this.get___Senders(paramsSender);

    if (localStorage.getItem('abandonosData')) {
      let aaa = localStorage.getItem('abandonosData');
      const user = aaa;
      console.log('AAA', user);
      // this.selectData(user)
      this.loading = true;
    }
  }

  btnDictums: boolean = false;
  changeTab(filter: any) {
    console.log('AAQQ', filter);
    if (filter == 2) {
      this.btnDictums = true;
    } else {
      this.btnDictums = false;
    }
  }

  recibirDatos(event: any) {
    this.datosRecibidos = event;
    console.log('EVENTO DICTUM', this.datosRecibidos);
  }

  private prepareForm() {
    this.form = this.fb.group({
      noExpediente: [''],
      noVolante: ['', [Validators.required]], //*
      tipoVolante: ['', [Validators.required]], //*
      fechaRecepcion: ['', [Validators.required]], //*
      consecutivoDiario: ['', [Validators.required]], //*
      actaCircunst: [''],
      averigPrevia: [''],
      causaPenal: [''],
      noAmparo: [''],
      tocaPenal: [''],
      noOficio: ['', [Validators.required]], //*
      fechaOficio: ['', [Validators.required]], //*
      descripcionAsunto: ['', [Validators.required]], //*
      remitente: ['', [Validators.required]], //*
      // idAsunto: [''],
      asunto: [''],
      // idDesahogoAsunto: [''],
      desahogoAsunto: ['', [Validators.required]], //*
      // idCiudad: [''],
      ciudad: ['', [Validators.required]], //*
      // idEntidadFederativa: [''],
      entidadFederativa: ['', [Validators.required]], //*
      claveUnica: ['', [Validators.required]], //*
      transferente: ['', [Validators.required]], //*
      emisora: ['', [Validators.required]], //*
      autoridad: ['', [Validators.required]], //*
      autoridadEmisora: [''],
      ministerioPublico: [''],
      juzgado: ['', [Validators.required]], //*
      indiciado: ['', [Validators.required]],
      delito: [''],
      solicitante: ['', [Validators.required]], //*
      contribuyente: ['', [Validators.required]], //*
      viaRecepcion: ['', [Validators.required]], //*
      areaDestino: ['', [Validators.required]], //*
      destinatario: ['', [Validators.required]], //*
      justificacionConocimiento: [''],
      reaccionacionConocimiento: [''],
    });
    this.formDeclaratoria = this.fb.group({
      noExpediente: ['', [Validators.required]], //*
      averiPrevia: ['', [Validators.required]], //*
      causaPenal: ['', [Validators.required]], //*
      tipoOficio: ['', [Validators.required]], //*
      remitente: ['', [Validators.required]],
      destinatario: ['', [Validators.required]],
      cveOficio: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
    });
    this.formDeclaratoriaTabla = this.fb.group({
      noExpediente: ['', [Validators.required]], //*
      averiPrevia: ['', [Validators.required]], //*
    });
    this.formDeclaratoriapageFin = this.fb.group({
      page: ['', [Validators.required]], //*
      fin: ['', [Validators.required]], //*
    });
    this.formOficiopageFin = this.fb.group({
      page: ['', [Validators.required]], //*
      fin: ['', [Validators.required]], //*
    });

    this.formOficio = this.fb.group({
      tipoOficio: [''],
      remitente: [''],
      destinatario: [''],
      ciudad: [''],
      oficioPor: [''],
      noVolante: ['', [Validators.required]], //*
      noExpediente: ['', [Validators.required]], //*
      cveOficio: ['', [Validators.required]], //*
      oficio: [''],
      fechaCaptura: ['', [Validators.required]], //*
      estatus: ['', [Validators.required]], //*
    });

    this.formCcpOficio = this.fb.group({
      ccp: [null, [Validators.minLength(1)]], //*
      usuario: ['', [Validators.minLength(1)]], //*
      nombreUsuario: '',
      ccp2: [null, [Validators.minLength(1)]], //*
      usuario2: ['', [Validators.minLength(1)]], //*
      nombreUsuario2: '',
    });
    this.formFolioEscaneo = this.fb.group({
      folioEscaneo: [this.folioEscaneoNg, [Validators.required]], //*
    });

    this.di_status = this.fb.group({
      di_desc_estatus: [''], //*
    });

    this.myForm = this.fb.group({
      name: ['HOLAAAA', Validators.required],
    });

    this.loading = false;
  }

  selectProceedings(event: IUserRowSelectEvent<IGood>) {
    console.log('EVENT', event);

    this.getStatusGood(event.data.status);
    this.selectedGood = event.selected;
  }

  mostrarInfo(form: FormGroup): any {
    // console.log(form.value);
  }

  mostrarInfoOficio(allFormsOficio: any): any {
    // console.log(allFormsOficio);
  }

  mostrarInfoDeclaratoria(formDeclaratoria: FormGroup): any {
    // console.log(formDeclaratoria.value);
  }

  oficioRelacionado(event: any) {
    // console.log('Oficio Relacionado', event);
  }

  capturaCopias(event: any) {
    // console.log('Captura copias', event);
  }

  checkSearchMode(searchMode: boolean) {
    this.searchMode = searchMode;
    this.changeDetectorRef.detectChanges();
  }

  confirm(confirm: boolean) {
    this.confirmSearch = confirm;
    this.changeDetectorRef.detectChanges();
  }

  search(formData: Partial<IJuridicalFileDataUpdateForm>) {
    this.formData = formData;
    this.changeDetectorRef.detectChanges();
    this.formData = null;
    // console.log('AQUI', formData);
  }

  async selectData(data: INotification) {
    this.disabledTabs = false;
    this.resetForms();
    this.loading = true;
    this.selectedRow = data;
    this.disabledENVIAR = false;
    this.changeDetectorRef.detectChanges();

    this.oficioDictamenUpdate = false;
    this.disabledBTNs = false;
    console.log('DATA SELECCIONADA', data);

    this.idExpediente = data.expedientNumber;
    this.noVolante_ = data.wheelNumber;

    // VALIDAR QUE EL DICTUMKEY SEA IGUAL A DECLARATORIA DE ABANDONO
    if (this.selectedRow.dictumKey == 'DECLARATORIA DE ABANDONO') {
      this.disabledTabs = true;
    } else {
      this.disabledTabs = false;
    }
    this.formOficiopageFin.get('fin').setValue('');
    this.declarationForm
      .get('preliminaryInquiry')
      .setValue(data.preliminaryInquiry);
    this.declarationForm.get('criminalCase').setValue(data.criminalCase);
    await this.onLoadGoodList('all');
    await this.validDesahogo(data);

    if (localStorage.getItem('abandonosDictamen')) {
      let aaa = localStorage.getItem('abandonosDictamen');
      const user = aaa;
      console.log('AAAAAAAAAA', user);
      await this.checkDictum(user, 'id');
      localStorage.removeItem('abandonosDictamen');
      // this.selectData(user)
      this.loading = true;
    } else {
      await this.checkDictum(data.wheelNumber, 'all');
    }

    // await this.checkDictum(data.wheelNumber, 'all');
    // await this.checkDictum_(data.wheelNumber, 'all');
    await this.getExpediente(data.expedientNumber);
    await this.getMOficioGestion(data.wheelNumber, 1);
  }

  // LIMPIAMOS CAMPOS AL SELECCIONAR UN NUEVO VOLANTE
  resetForms() {
    this.declarationForm.get('sender').setValue(null);
    this.declarationForm.get('recipient').setValue(null);
    this.declarationForm.get('city').setValue(null);
    this.declarationForm.get('passOfficeArmy').setValue('');
    this.declarationForm.get('officeType').setValue(null);
    this.di_status.get('di_desc_estatus').setValue('');
    this.formOficio.get('noVolante').setValue('');
    this.formOficio.get('noExpediente').setValue('');
    this.idExpediente = null;
    this.noVolante_ = null;

    this.courtName = '';
    this.dateCapture2 = '';
    this.cveoficio_Oficio = '';
    this.statusOfOficio = '';
    this.statusOfMOficioGestion = '';
    this.cveManagement = '';
    this.no_OficioGestion = '';

    this.formOficiopageFin.get('page').setValue('');
    this.formOficiopageFin.get('fin').setValue('');
    this.formOficio.get('destinatario').setValue('');
    this.formOficio.get('remitente').setValue('');

    this.declarationForm.get('preliminaryInquiry').setValue('');
    this.declarationForm.get('criminalCase').setValue('');
    this.formCcpOficio.get('ccp2').setValue(null);
    this.formCcpOficio.get('ccp').setValue(null);
    this.formCcpOficio.get('nombreUsuario2').setValue(null);
    this.formCcpOficio.get('nombreUsuario').setValue(null);
    this.copyOficio = [];
  }

  async getSenders(params: ListParams) {
    this.securityService.getAllUsersTracker(params).subscribe(
      (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });
        Promise.all(result).then((resp: any) => {
          this.senders = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        this.senders = new DefaultSelect();
      }
    );
  }

  async getSenders2(params: ListParams) {
    params['filter.user'] = `$eq:${params.text}`;
    this.securityService.getAllUsersTracker(params).subscribe(
      (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });
        Promise.all(result).then((resp: any) => {
          this.declarationForm.get('sender').setValue(data.data[0]);
          // this.senders = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        this.senders = new DefaultSelect();
      }
    );
  }

  delegation: any;
  subdelegation: any;
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
        this.senders = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.senders = new DefaultSelect();
      },
    });
  }

  getRecipients(params: ListParams) {
    this.securityService.getAllUsersTracker(params).subscribe(
      (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });
        Promise.all(result).then((resp: any) => {
          this.recipients = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        this.recipients = new DefaultSelect();
      }
    );
  }
  // getRecipients(lparams: ListParams) {
  //   const params = new FilterParams();
  //   params.page = lparams.page;
  //   params.limit = lparams.limit;
  //   params.addFilter('assigned', 'S');
  //   if (lparams?.text.length > 0)
  //     params.addFilter('user', lparams.text, SearchFilter.LIKE);
  //   this.hideError();
  //   this.abandonmentsService.getUsers(params.getParams()).subscribe({
  //     next: data => {
  //       this.recipients = new DefaultSelect(data.data, data.count);
  //     },
  //     error: () => {
  //       this.recipients = new DefaultSelect();
  //     },
  //   });
  // }

  getRecipients2(params: ListParams) {
    params['filter.user'] = `$eq:${params.text}`;
    this.securityService.getAllUsersTracker(params).subscribe(
      (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });

        Promise.all(result).then((resp: any) => {
          this.declarationForm.get('recipient').setValue(data.data[0]);

          // this.recipients = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        this.recipients = new DefaultSelect();
      }
    );
  }

  getCities(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('idCity', lparams.text, SearchFilter.EQ);
      } else {
        console.log('NO');
        params.addFilter('legendOffice', lparams.text, SearchFilter.ILIKE);
      }

    // this.hideError();
    this.abandonmentsService.getCities(params.getParams()).subscribe({
      next: data => {
        // console.log('CITY', data);
        this.cities = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.cities = new DefaultSelect();
      },
    });
  }

  getCities2(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('idCity', lparams.text, SearchFilter.EQ);
      } else {
        console.log('NO');
        params.addFilter('legendOffice', lparams.text, SearchFilter.ILIKE);
      }
    // this.hideError();
    this.abandonmentsService.getCities(params.getParams()).subscribe({
      next: data => {
        // console.log('CITY', data);
        this.cities2 = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.cities2 = new DefaultSelect();
      },
    });
  }

  // OBTENER BIENES //
  async onLoadGoodList(filter: any) {
    this.formLoading = true;
    // this.loadingText = 'Cargando';
    let params = {
      ...this.params.getValue(),
    };

    console.log('FILTER GOODS', filter);

    let exp = this.idExpediente;
    params['filter.fileNumber'] = exp;
    params['filter.status'] = `$in:ADM,DXV,PRP,CPV,DEP`;

    if (filter != 'all') {
      params['filter.goodClassNumber'] = `$eq:${filter}`;
    }

    this.goodServices.getByExpedientAndParams__(params).subscribe({
      next: async (response: any) => {
        // let arr = []
        // for (let i = 0; i < response.data.length; i++) {
        //   if (response.data[i].id != null) {
        //     arr.push(response.data[i].id)
        //   }
        // }
        // let obj: any = {
        //   status: "ADM",
        //   identifier: "ASEG",
        //   vcScreen: "FACTJURABANDONOS",
        //   extDomProcess: "ASEGURADO",
        //   arrayGoodNumber: arr
        // }

        // const statusScreen: any = await this.getScreenStatus____(obj);

        // for (let e = 0; e < statusScreen.length; e++) {

        // }
        let result = response.data.map(async (item: any) => {
          item['SELECCIONAR'] = 0;
          item['SEL_AUX'] = 0;
          item['est_disponible'] = 'N';
          const statusScreen: any = await this.getScreenStatus(item);

          item['est_disponible'] = statusScreen.di_disponible;
          item['no_of_dicta'] = null;

          if (item.est_disponible == 'S') {
            // : BIENES.NO_OF_DICTA := NULL;
            item['no_of_dicta'] = null;
            const dictamenXGood1: any = await this.getDictaXGood(
              item.id,
              'ABANDONO'
            );

            item['no_of_dicta'] =
              dictamenXGood1 != null ? dictamenXGood1.ofDictNumber : null;

            if (dictamenXGood1 != null) {
              item['est_disponible'] = 'N';
            }
          }
        });

        // console.log('GOODS OBTENIDOS', statusScreen);

        this.getStatusGood(response.data[0].status);
        Promise.all(result).then((resp: any) => {
          this.data1 = response.data;
          this.totalItems = response.count;
          this.formLoading = false;
          this.loading = false;
        });

        //     IF: BIENES.EST_DISPONIBLE = 'S' THEN
        //     : BIENES.NO_OF_DICTA := NULL;
        //      FOR REG IN(SELECT NO_OF_DICTA
        //                    FROM DICTAMINACION_X_BIEN1
        //                   WHERE NO_BIEN = : BIENES.NO_BIEN
        //                     AND TIPO_DICTAMINACION = 'ABANDONO')
        //     LOOP
        //     : BIENES.NO_OF_DICTA := REG.NO_OF_DICTA;
        //        : BIENES.EST_DISPONIBLE := 'N';
        //     EXIT;
        //      END LOOP;
        //  END IF;
      },
      error: err => {
        this.loading = false;
        this.formLoading = false;
        console.log('ERRROR BIEN X EXPEDIENTE', err.error.message);
        this.data1 = [];
      },
    });
    this.loading = false;
  }

  // OBTENEMOS SCREEN STATUS FINAL //
  async getScreenStatusFinal(data: any) {
    let obj = {
      estatus: data,
      vc_pantalla: 'FACTJURABANDONOS',
    };

    this.screenStatusService.getAllFiltro(obj).subscribe(
      (response: any) => {
        const { data } = response;
        this.di_status.get('di_desc_estatus').setValue(data);
        console.log('SCREEN', data);
      },
      error => {
        console.log('SCREEN', error.error.message);
      }
    );
  }

  getStatusGood(data: any) {
    const params = new ListParams();
    params['filter.status'] = `$eq:${data}`;

    this.statusGoodService.getAll(params).subscribe(
      (response: any) => {
        const { data } = response;
        this.di_status.get('di_desc_estatus').setValue(data[0].description);
        console.log('SCREEN', data);
      },
      error => {
        console.log('SCREEN', error.error.message);
      }
    );
  }

  // OBTENER DATOS DE EXPEDIENTE //
  courtName: string = '';
  expedientData: IExpedient;
  async getExpediente(expedientNumber: any) {
    if (expedientNumber) {
      this.expedientService.getById(expedientNumber).subscribe({
        next: data => {
          this.courtName = data.courtName;
          this.declarationForm.get('expedientNumber').setValue(expedientNumber);
          this.expedientData = data;
          this.filtroTipos(data);
          console.log('EXPEDIENTE', data);
        },
        error: error => {
          // this.onLoadToast('warning', 'EXPEDIENTE', 'No se encontró data de expediente')
          console.log('ERROR EXPEDIENTE', error.error.message);
        },
      });
    }
  }

  // AGREGAMOS LOS TEXTOS INICIO Y FINAL //
  tipoOficio: string = '';
  addText(event: any) {
    this.tipoOficio = event;
    // console.log('FORM', this.selectedRow);
    let expediente = null;
    let AUX_CAUSA = null;
    let AUX_PREVIA = null;
    let AUX_JUZGADO = null;
    if (this.selectedRow) {
      expediente = this.selectedRow.expedientNumber
        ? this.selectedRow.expedientNumber
        : '';
      AUX_CAUSA = `causa penal ${
        this.selectedRow.criminalCase ? this.selectedRow.criminalCase : ''
      }`;
      AUX_PREVIA = `averiguación previa ${
        this.selectedRow.preliminaryInquiry
          ? this.selectedRow.preliminaryInquiry
          : ''
      }`;
      AUX_JUZGADO = `juzgado ${this.courtName}`;
    }

    if (event == 'DAN') {
      let text1 = `Vistos para resolver la declaratoria de abandono de las constancias que integran el expediente administrativo número ${expediente} del Sistema Integral para la Administración de Bienes, que se lleva en este Servicio de Administración y Enajenación de Bienes, relativo a los bienes afectos a la ${AUX_CAUSA} ${AUX_PREVIA} ${AUX_JUZGADO}:`;

      this.formDeclaratoriapageFin.get('page').setValue(text1);
      this.formDeclaratoriapageFin
        .get('fin')
        .setValue(TEXTOS.returnText2_DAN() + TEXTOS.returnText2_A_DAN());
    } else if (event == 'DAB') {
      let text1 = `Vistos para resolver la declaratoria de abandono de las constancias que integran el expediente administrativo número ${expediente} del Sistema Integral para la Administración de Bienes, que se lleva en este Servicio de Administración y Enajenación de Bienes, relativo a los bienes afectos a la ${AUX_CAUSA} ${AUX_PREVIA} ${AUX_JUZGADO}:`;

      this.formDeclaratoriapageFin.get('page').setValue(text1);
      this.formDeclaratoriapageFin
        .get('fin')
        .setValue(TEXTOS.returnText2_DAB() + TEXTOS.returnText2_A_DAB());
    } else if (event == 'PGR') {
      let text1 = `  
        LIC. JORGE F. GIL RODRÍGUEZ

        COORDINADOR DE DESTINO DE BIENES MUEBLES

        Hago referencia al numerario que a continuación se menciona:
        
      `;
      this.formDeclaratoriapageFin.get('page').setValue(text1);
      let averig =
        this.selectedRow.preliminaryInquiry == null
          ? ''
          : this.selectedRow.preliminaryInquiry;
      this.formDeclaratoriapageFin
        .get('fin')
        .setValue(TEXTOS.returnText2_PGR(averig) + '');
    } else {
      let text1 = `  
        LIC. JORGE F. GIL RODRÍGUEZ

        COORDINADOR DE DESTINO DE BIENES MUEBLES

        Hago referencia al numerario que a continuación se menciona:
        
      `;
      this.formDeclaratoriapageFin.get('page').setValue(text1);
      // VERIFICAR SI EL TEXTO DEL DEL STATUS PGR SON LOS MISMOS QUE LOS DEMÁS //
      let averig =
        this.selectedRow.preliminaryInquiry == null
          ? ''
          : this.selectedRow.preliminaryInquiry;
      this.formDeclaratoriapageFin
        .get('fin')
        .setValue(TEXTOS.returnText2_PGR(averig) + '');
    }
  }

  async validDesahogo(data: any) {
    if (data.affairKey == 25) {
      if (data.dictumKey == 'CONOCIMIENTO') {
        this.alert(
          'error',
          'El desahogo del asunto no permite realizar Declaración u Oficio',
          ''
        );
      }
    }
  }

  // OBTENEMOS DICTAMEN - DICTAMINACIONES//
  dictDate3: any = '';
  disabledDictum: boolean = true;
  async checkDictum(data: any, filter: any) {
    const params = new FilterParams();
    if (filter == 'all') {
      params.addFilter('wheelNumber', data, SearchFilter.EQ);
    } else {
      params.addFilter('id', data, SearchFilter.EQ);
      params.addFilter('typeDict', 'ABANDONO', SearchFilter.EQ);
    }
    this.fileUpdateService.getDictation(params.getParams()).subscribe({
      next: (data: any) => {
        this.dictamen = data.data[0];
        this.disabledListDictums = true;
        console.log('DATA DICTAMENES', data);
        this.dictamenes = data.data;
        // if (this.dictamen.statusDict == null) {
        //   this.disabledTIPO_OFICIO = true;
        //   this.disbaledAPROBAR = true;
        //   this.disabledENVIAR = false;
        //   this.disabledIMPRIMIR = false;

        //   this.getCities_(266);
        // } else {
        this.disabledTIPO_OFICIO = false;
        this.disbaledAPROBAR = false;
        this.disabledENVIAR = true;
        this.disabledIMPRIMIR = true;
        this.disabledDictum = false;
        // }
        this.dictDate3 = this.datePipe.transform(
          this.dictamen.dictDate,
          'dd/MM/yyyy'
        );

        this.folioEscaneoNg = this.dictamen.folioUniversal;
        this.declarationForm
          .get('passOfficeArmy')
          .setValue(this.dictamen.passOfficeArmy);
        this.cveoficio_Oficio = this.dictamen.passOfficeArmy;
        this.getOficioDictamen(this.dictamen);
        this.getDictationXGood1Service(this.dictamen);

        this.loading = false;
      },
      error: error => {
        this.lockStatus = true;
        this.loading = false;
        this.dictDate3 = '';
        this.disabledENVIAR = false;
        this.formDeclaratoriapageFin.get('page').setValue('');
        this.formDeclaratoriapageFin.get('fin').setValue('');
        this.disabledListDictums = false;
        this.disabledDictum = true;
        this.disabledTIPO_OFICIO = true;
        this.disbaledAPROBAR = false;
        this.declarationForm.get('recipient').setValue(null);
        const paramsSender: any = new ListParams();
        paramsSender.text = this.token.decodeToken().preferred_username;
        this.getSenders2(paramsSender);
        this.getCities_(266);
        this.dictamenes = [];
        console.log('ERR', error);
      },
    });
  }

  dictamenesTEST: any = [];

  // OBTENEMOS OFICIO DICTAMEN //
  async getOficioDictamen(data: any) {
    const params = new ListParams();
    params['filter.officialNumber'] = `$eq:${data.id}`;
    params['filter.typeDict'] = `$eq:${data.typeDict}`;

    this.OficialDictationService.getAll(params).subscribe({
      next: data => {
        console.log('OFICIO,', data);
        this.oficioDictamen = data.data[0];

        this.statusOfOficio = this.oficioDictamen.statusOf;

        // if (this.oficioDictamen) {
        if (this.oficioDictamen.recipient != null) {
          const paramsRecipient: any = new ListParams();
          paramsRecipient.text = this.oficioDictamen.recipient;
          this.getRecipients2(paramsRecipient);
        }

        if (this.oficioDictamen.sender != null) {
          const paramsSender: any = new ListParams();
          paramsSender.text = this.oficioDictamen.sender;
          this.getSenders2(paramsSender);
        }

        if (this.oficioDictamen.city != null) {
          const paramsCity: any = new ListParams();
          paramsCity.text = this.oficioDictamen.city;
          this.getCities_(this.oficioDictamen.city);
        }
        // }
        if (this.oficioDictamen.statusOf == 'ENVIADO') {
          this.lockStatus = false;
        } else {
          this.lockStatus = true;
        }

        this.formDeclaratoriapageFin
          .get('page')
          .setValue(this.oficioDictamen.text1);
        if (this.dictamen.statusDict == null) {
        } else {
          if (this.oficioDictamenUpdate == false) {
            this.oficioDictamenUpdate = true;
            this.formDeclaratoriapageFin
              .get('fin')
              .setValue(
                this.oficioDictamen.text2 +
                  this.oficioDictamen.text2To +
                  this.oficioDictamen.text3
              );
            // : OFICIO_DICTAMEN.TEXTOP := : OFICIO_DICTAMEN.TEXTO2 ||: OFICIO_DICTAMEN.TEXTO2_A ||: OFICIO_DICTAMEN.TEXTO3;
            this.oficioDictamenUpdate = false;
          } else {
            this.formDeclaratoriapageFin
              .get('fin')
              .setValue(
                this.oficioDictamen.text2 +
                  this.oficioDictamen.text2To +
                  this.oficioDictamen.text3
              );
          }
        }

        console.log('DATA OFFICE', data);
        this.loading = false;
      },
      error: error => {
        this.lockStatus = true;
        const paramsSender: any = new ListParams();
        paramsSender.text = this.token.decodeToken().preferred_username;
        this.getSenders2(paramsSender);

        const paramsCity: any = new ListParams();
        paramsCity.text = 266;
        this.getCities_(266);

        this.formDeclaratoriapageFin.get('page').setValue('');
        this.formDeclaratoriapageFin.get('fin').setValue('');
        // this.alert(
        //   'warning',
        //   'OFICIO DE DICTÁMENES',
        //   'No se encontraron oficio de dictámenes'
        // );
        this.loading = false;
      },
    });
  }

  async getCities_(idCity: any) {
    const params = new FilterParams();
    // params.page = lparams.page;
    // params.limit = lparams.limit;
    // if (lparams?.text.length > 0)
    params.addFilter('idCity', idCity, SearchFilter.EQ);
    // this.hideError();

    this.abandonmentsService.getCities(params.getParams()).subscribe({
      next: (data: any) => {
        console.log('CITY', data);
        this.declarationForm.get('city').setValue(data.data[0]);
      },
      error: () => {
        this.cities = new DefaultSelect();
      },
    });
  }

  getCities__(idCity: any) {
    const params = new FilterParams();
    // params.page = lparams.page;
    // params.limit = lparams.limit;
    // if (lparams?.text.length > 0)
    params.addFilter('idCity', idCity, SearchFilter.EQ);
    this.hideError();

    this.abandonmentsService.getCities(params.getParams()).subscribe({
      next: (data: any) => {
        console.log('CITY', data);
        this.formOficio.get('ciudad').setValue(data.data[0]);
      },
      error: () => {
        this.cities = new DefaultSelect();
      },
    });
  }

  // OBTENEMOS DICTAMEN X BIEN 1//
  async getDictationXGood1Service(data: any) {
    const params = new ListParams();
    params['filter.ofDictNumber'] = `$eq:${data.id}`;
    params['filter.typeDict'] = `$eq:${data.typeDict}`;

    this.DictationXGood1Service.getAll(params).subscribe({
      next: (data: any) => {
        this.dictamenesXBien1 = data.data;
        this.dictamenXGood1 = data.data[0];
        console.log('DATA DICTXGOOD', data);
        this.loading = false;
      },
      error: error => {
        // this.alert(
        //   'warning',
        //   'DICTÁMENES POR BIEN',
        //   'No se encontraron resultados'
        // );
        this.loading = false;
      },
    });
  }

  imgSolicitud() {
    console.log('OK', this.oficioDictamen);

    // if (this.oficioDictamen && this.dictamen) {
    if (
      this.oficioDictamen.statusOf == 'ENVIADO' &&
      this.dictamen.passOfficeArmy != null
    ) {
      if (this.dictamen.folioUniversal != null) {
        this.alert('warning', 'El acta ya tiene folio de escaneo', '');
        return;
      } else {
        this.alertQuestion(
          'info',
          'Se generará un nuevo folio de escaneo para la declaratoria',
          '¿Deseas continuar?'
        ).then(question => {
          if (question.isConfirmed) {
            this.generarFolioEscaneo();
          }
        });
      }
    } else {
      this.alert(
        'warning',
        'No se puede generar el folio de escaneo en una declaratoria abierta',
        ''
      );
    }
    // } else {
    // this.alert(
    //   'info',
    //   'Debe seleccionar un dictamen y/o un oficio de dictamen',
    //   ''
    // );
    // }
  }

  // UPDATE DICTAMEN //
  async updateDictamen(body: any) {
    this.dictationService.update(body).subscribe({
      next: (data: any) => {
        console.log('SII1', data);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  // UPDATE OFICIO DICTAMEN //
  async updateOficioDictamen(body: any) {
    console.log('SSI2:', body);
    this.dictationService.updateOfficialDictation(body).subscribe({
      next: (data: any) => {
        console.log('SII2', data);
        this.loading = false;
      },
      error: error => {
        console.log('SII2', error);
        this.loading = false;
      },
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

  async generarFolioEscaneo() {
    const sysdate = new Date();
    var mes: any = sysdate.getMonth(); // Obtener el mes (0-11)
    var anio = sysdate.getFullYear(); // Obtener el año (yyyy)
    if (mes < 9) {
      mes = '0' + (mes + 1);
    } else {
      mes = mes + 1;
    }

    let obj: any = {
      natureDocument: 'ORIGINAL',
      associateUniversalFolio: null,
      numberProceedings: this.idExpediente,
      keyTypeDocument: 'ENTRE',
      keySeparator: 60,
      descriptionDocument: 'DICTAMEN',
      significantDate: `${mes}/${anio}`,
      scanStatus: 'SOLICITADO',
      userRequestsScan: this.token.decodeToken().preferred_username,
      scanRequestDate: sysdate,
      numberDelegationRequested: this.delegation,
      numberSubdelegationRequests: this.subdelegation,
      numberDepartmentRequest: this.token.decodeToken().department,
      flyerNumber: this.noVolante_,
    };

    this.documentsService.create(obj).subscribe({
      next: (data: any) => {
        console.log('DOCUMENTS', data);
        // :DICTAMINACIONES.FOLIO_UNIVERSAL
        // let txt = data.id + ''
        this.folioEscaneoNg = data.id;
        this.dictamen.folioUniversal = data.id;
        this.updateDictamen(this.dictamen);
        // this.formFolioEscaneo.get('folioEscaneo').setValue(txt)
        this.alert('success', 'El folio universal generado es:' + data.id, '');
        this.loading = false;
      },
      error: error => {
        this.alert('warning', 'DOCUMENTS', error.error.message);
        this.loading = false;
      },
    });
  }

  escanearFolioEscaneo() {
    console.log('FOLIO', this.folioEscaneoNg);
    // if (this.oficioDictamen && this.dictamen) {
    if (
      this.oficioDictamen.statusOf == 'ENVIADO' &&
      this.dictamen.passOfficeArmy != null
    ) {
      if (this.folioEscaneoNg != '') {
        this.alertQuestion(
          'info',
          'Se abrirá la pantalla de escaneo para el folio de escaneo de la declaratoria',
          '¿Deseas continuar?',
          'Continuar'
        ).then(question => {
          if (question.isConfirmed) {
            // this.onLoadToast('success', 'Enviado a la siguiente forma', '');

            this.goNextForm();
          }
        });
      } else {
        this.alert('error', 'No existe folio de escaneo a escanear', '');
      }
    } else {
      this.alert(
        'error',
        'No se puede escanear para una declaratoria que esté abierta',
        ''
      );
    }
    // } else {
    //   this.alert(
    //     'info',
    //     'Debe seleccionar un dictamen y/o un oficio de dictamen',
    //     ''
    //   );
    // }
  }

  goNextForm() {
    localStorage.setItem('abandonosData', this.noVolante_);
    localStorage.setItem('abandonosDictamen', this.dictamen.id + '');
    // alert('SI');
    // const route = `pages/general-processes/scan-request/scan`;
    this.router.navigate([`/pages/general-processes/scan-documents`], {
      queryParams: { origin: 'FACTJURABANDONOS', folio: this.folioEscaneoNg },
    });
    // this.router.navigate([route]);
  }

  imprimirFolioEscaneo() {
    // if (this.dictamen) {
    if (this.dictamen.folioUniversal == null) {
      this.alert('warning', 'No tiene folio de escaneo para imprimir.', '');
      return;
    } else {
      let params = {
        pn_folio: this.dictamen.folioUniversal,
      };
      // let params = {
      //   pn_folio: 3429518,
      // };
      this.siabService
        .fetchReport('RGERGENSOLICDIGIT', params)
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
            this.onLoadToast('success', '', 'Reporte generado');
            this.modalService.show(PreviewDocumentsComponent, config);
          }
        });
    }
    // } else {
    //   this.alert(
    //     'info',
    //     'Debe seleccionar un dictamen y/o un oficio de dictamen',
    //     ''
    //   );
    // }
  }

  visualizacionFolioEscaneo() {
    // if (this.dictamen) {
    if (this.dictamen.folioUniversal == null) {
      this.alert('warning', 'No tiene folio de escaneo para visualizar.', '');
      return;
    } else {
      this.goNextForm();
    }
    // } else {
    //   this.alert(
    //     'info',
    //     'Debe seleccionar un dictamen y/o un oficio de dictamen',
    //     ''
    //   );
    // }
  }

  async aprobar() {
    const dateActual = new Date();
    var anioActual = dateActual.getFullYear();
    var mesActual = dateActual.getMonth() + 1;
    var diaActual = dateActual.getDate();
    var fechaActual: any = diaActual + '-' + mesActual + '-' + anioActual;

    let REMITENTE: any = this.declarationForm.get('sender').value;
    let DESTINATARIO: any = this.declarationForm.get('recipient').value;
    let CITY: any = this.declarationForm.get('city').value;
    let V_NO_OF_DICTA: any = null;
    let V_TIPO_DICTA: any = null;
    let goods: any = this.selectedGood;
    let contador = 0;
    this.dictamen;
    this.disabledENVIAR = true;

    if (REMITENTE == null || REMITENTE == '') {
      this.alert('error', 'Debe especificar quien autoriza declaratoria', '');
      return;
    } else if (DESTINATARIO == null || DESTINATARIO == '') {
      this.alert('error', 'Debe especificar el destinatario', '');
      return;
    } else if (CITY == null || CITY == '') {
      this.alert('error', 'Debe especificar la ciudad', '');
      return;
    } else if (this.data1.length == 0) {
      this.alert('warning', 'No se tienen bienes a dictaminar.', '');
      return;
    } else if (goods.length == 0) {
      this.alert(
        'warning',
        'No hay bienes seleccionados para la declaratoria.',
        ''
      );
      return;
    } else if (goods.length > 0) {
      for (let i = 0; i < goods.length; i++) {
        if (goods[i].est_disponible == 'S') {
          contador = contador + 1;
        } else {
          console.log('HOLAAA', goods[i]);
        }
      }

      if (contador == 0) {
        this.alert(
          'error',
          'No hay bienes seleccionados para la declaratoria.',
          ''
        );
        return;
      }
    }

    if (this.dictamen.id == null) {
      this.loading = false;

      this.dictamen.typeDict = 'ABANDONO';
      // this.tipoOficio = this.declarationForm.get('officeType').value;

      if (this.tipoOficio == 'FGR') {
        this.dictamen.passOfficeArmy =
          this.SiglasNivel2 + '/ABANDONO/FGR' + '/?/' + anioActual;
        this.declarationForm
          .get('passOfficeArmy')
          .setValue(this.dictamen.passOfficeArmy);
      } else if (this.tipoOficio == 'PJF') {
        this.dictamen.passOfficeArmy =
          this.SiglasNivel2 + '/ABANDONO/PJF' + '/?/' + anioActual;
        this.declarationForm
          .get('passOfficeArmy')
          .setValue(this.dictamen.passOfficeArmy);
      } else {
        this.dictamen.passOfficeArmy =
          this.SiglasNivel2 + '/ABANDONO' + '/?/' + anioActual;
        this.declarationForm
          .get('passOfficeArmy')
          .setValue(this.dictamen.passOfficeArmy);
      }

      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const year = today.getFullYear();
      const SYSDATE = `${year}-${month}-${day}`;

      console.log('SYSDATE', SYSDATE);
      this.dictDate3 = SYSDATE;
      this.dictamen.statusDict = 'DICTAMINADO';
      this.dictamen.expedientNumber = this.idExpediente;
      this.dictamen.wheelNumber = this.noVolante_;
      this.dictamen.userDict = this.token.decodeToken().preferred_username;
      this.dictamen.delegationDictNumber = this.delegation;
      this.dictamen.areaDict = 914;
      this.dictamen.dictDate = new Date(SYSDATE);
      this.dictamen.instructorDate = new Date(SYSDATE);
      this.dictamen.notifyAssuranceDate = new Date(SYSDATE);
      this.dictamen.resolutionDate = new Date(SYSDATE);
      this.dictamen.notifyResolutionDate = new Date(SYSDATE);

      // let obj: any = {
      //   passOfficeArmy: this.dictamen.passOfficeArmy,
      //   expedientNumber: this.dictamen.expedientNumber,
      //   typeDict: this.dictamen.typeDict,
      //   statusDict: this.dictamen.statusDict,
      //   dictDate: this.dictamen.dictDate,
      //   userDict: this.dictamen.userDict,
      //   observations: this.dictamen.observations,
      //   delegationDictNumber: this.dictamen.delegationDictNumber,
      //   areaDict: this.dictamen.areaDict,
      //   instructorDate: this.dictamen.instructorDate,
      //   registerNumber: this.dictamen.registerNumber,
      //   esDelit: this.dictamen.esDelit,
      //   wheelNumber: this.dictamen.wheelNumber,
      //   keyArmyNumber: this.dictamen.keyArmyNumber,
      //   notifyAssuranceDate: this.dictamen.notifyAssuranceDate,
      //   resolutionDate: this.dictamen.resolutionDate,
      //   notifyResolutionDate: this.dictamen.notifyResolutionDate,
      //   folioUniversal: this.dictamen.folioUniversal,
      //   entryDate: this.dictamen.entryDate,
      //   dictHcDAte: this.dictamen.dictHcDAte,
      //   entryHcDate: this.dictamen.entryHcDate,
      // }
      console.log('NEXTO', this.dictamen);
      this.dictationService.create(this.dictamen).subscribe({
        next: async (data: any) => {
          this.dictamen.id = data.id;

          if (
            this.formDeclaratoriapageFin.get('fin').value != null ||
            this.formDeclaratoriapageFin.get('fin').value != ''
          ) {
            let textP = this.formDeclaratoriapageFin.get('fin').value;
            this.oficioDictamen.text2 = textP.substring(0, 3999);
            this.oficioDictamen.text2To = textP.substring(4000, 7999);
            this.oficioDictamen.text3 = textP.substring(8000, 11999);
          }

          console.log('SASD', this.dictamen);
          this.oficioDictamen.sender = REMITENTE.user;
          this.oficioDictamen.recipient = DESTINATARIO.user;
          this.oficioDictamen.city = CITY.idCity;
          this.oficioDictamen.typeDict = this.dictamen.typeDict;
          this.oficioDictamen.officialNumber = this.dictamen.id;
          this.oficioDictamen.text1 =
            this.formDeclaratoriapageFin.get('page').value;
          this.oficioDictamen.delegacionRecipientNumber = REMITENTE.de;

          V_NO_OF_DICTA = this.dictamen.id;
          V_TIPO_DICTA = this.dictamen.typeDict;
          await this.agregarDictamen();
          await this.createOficioDictamen(this.oficioDictamen);
          this.formDeclaratoriapageFin
            .get('fin')
            .setValue(
              this.oficioDictamen.text2 +
                this.oficioDictamen.text2To +
                this.oficioDictamen.text3
            );
          await this.updateNotificationsAprobar(this.noVolante_);
          await this.checkDictum(this.dictamen.id, 'id');
          // await this.checkDictum_(this.noVolante_, 'all');

          // V_NO_OF_DICTA:= : DICTAMINACIONES.NO_OF_DICTA;
          // V_TIPO_DICTA:= : DICTAMINACIONES.TIPO_DICTAMINACION;
          // SET_BLOCK_PROPERTY('DICTAMINACIONES', DEFAULT_WHERE, 'NO_OF_DICTA=' || TO_CHAR(V_NO_OF_DICTA) || ' AND TIPO_DICTAMINACION = ''' || V_TIPO_DICTA || '''');
        },
        error: error => {
          this.loading = false;
          this.alert(
            'error',
            'No se localizó la secuencia de la declaratoria',
            ''
          );
          return;
        },
      });
    } else {
      if (
        this.formDeclaratoriapageFin.get('fin').value != null ||
        this.formDeclaratoriapageFin.get('fin').value != ''
      ) {
        let textP = this.formDeclaratoriapageFin.get('fin').value;
        this.oficioDictamen.text2 = textP.substring(0, 3999);
        this.oficioDictamen.text2To = textP.substring(4000, 7999);
        this.oficioDictamen.text3 = textP.substring(8000, 11999);
      }

      console.log('SASD', this.dictamen);
      this.oficioDictamen.sender = REMITENTE.user;
      this.oficioDictamen.recipient = DESTINATARIO.user;
      this.oficioDictamen.city = CITY.idCity;
      this.oficioDictamen.typeDict = this.dictamen.typeDict;
      this.oficioDictamen.officialNumber = this.dictamen.id;
      this.oficioDictamen.text1 =
        this.formDeclaratoriapageFin.get('page').value;
      V_NO_OF_DICTA = this.dictamen.id;
      V_TIPO_DICTA = this.dictamen.typeDict;
      await this.agregarDictamen();
      await this.updateOficioDictamen(this.oficioDictamen);
      this.formDeclaratoriapageFin
        .get('fin')
        .setValue(
          this.oficioDictamen.text2 +
            this.oficioDictamen.text2To +
            this.oficioDictamen.text3
        );
      await this.checkDictum(this.dictamen.id, 'id');
      // await this.checkDictum_(this.noVolante_, 'all');
      // V_NO_OF_DICTA:= : DICTAMINACIONES.NO_OF_DICTA;
      // V_TIPO_DICTA:= : DICTAMINACIONES.TIPO_DICTAMINACION;
      // SET_BLOCK_PROPERTY('DICTAMINACIONES', DEFAULT_WHERE, 'NO_OF_DICTA=' || TO_CHAR(V_NO_OF_DICTA) || ' AND TIPO_DICTAMINACION = ''' || V_TIPO_DICTA || '''');
    }
    this.disabledENVIAR = true;
  }

  async getNextObject(data: any) {
    return new Promise((resolve, reject) => {
      const params = new FilterParams();
      params.limit = 1;
      this.fileUpdateService.getDictation(params.getParams()).subscribe({
        next: (data: any) => {
          console.log('NEXT: ', data);
          this.loading = false;
          const aNext = parseInt(data.data[0].id) + 1;
          resolve(aNext);
        },
        error: error => {
          this.loading = false;
          console.log('ERR', error);
          resolve(null);
        },
      });
    });
  }

  // PUP_AGREGA_DICTAMEN
  async agregarDictamen() {
    // console.log('this.dictamenesXBien1', this.dictamenesXBien1);

    let dataBienes: any = this.selectedGood;
    for (let i = 0; i < this.selectedGood.length; i++) {
      if (dataBienes[i].est_disponible == 'S') {
        let obj = {
          ofDictNumber: this.dictamen.id,
          proceedingsNumber: this.idExpediente,
          id: this.selectedGood[i].id,
          typeDict: 'ABANDONO',
          descriptionDict: this.selectedGood[i].description,
          amountDict: this.selectedGood[i].quantity,
        };

        console.log('OBJ CREATE', obj);
        this.createDictamenXGood1(obj);
      }
      // this.dictamenXGood1.proceedingsNumber = this.idExpediente;
      // this.dictamenXGood1.amountDict = dataBienes.quantity;
      // this.dictamenXGood1.id = dataBienes.id;
      // this.dictamenXGood1.descriptionDict = dataBienes.description;
    }
    // if (dataBienes.SELECCIONAR != dataBienes.SEL_AUX) {
    //   if (dataBienes.SELECCIONAR == 1) {
    //     // GO_BLOCK('DICTAMINACION_X_BIEN1');
    //     // LAST_RECORD; --
    //     // --SI EL NO BIEN NO ES NULO CREA REGISTRO
    //     // IF: DICTAMINACION_X_BIEN1.NO_BIEN IS NOT NULL THEN
    //     // CREATE_RECORD;
    //     // END IF;
    //     const LAST_RECORD =
    //       this.dictamenesXBien1[this.dictamenesXBien1.length - 1];
    //     if (LAST_RECORD.id != null) {
    //       this.dictamenesXBien1.push(this.dictamenXGood1Null);
    //       // CREATE_RECORD;
    //     }

    //     this.dictamenXGood1.proceedingsNumber = this.idExpediente;
    //     this.dictamenXGood1.amountDict = dataBienes.quantity;
    //     this.dictamenXGood1.id = dataBienes.id;
    //     this.dictamenXGood1.descriptionDict = dataBienes.description;
    //   } else {
    //     const FIRST_RECORD = this.dictamenesXBien1[0];

    //     if (FIRST_RECORD.id != null) {
    //       let arr = [];
    //       for (let i = 0; i < this.dictamenesXBien1.length; i++) {
    //         if (FIRST_RECORD.id == dataBienes.id) {
    //           // DELETE_RECORD;
    //         } else {
    //           arr.push(this.dictamenesXBien1[i]);
    //         }
    //       }
    //       this.dictamenesXBien1 = arr;
    //     }
    //   }
    // }

    this.onLoadGoodList('all');
    this.disabledENVIAR = true;
    this.disabledIMPRIMIR = true;
    this.disbaledAPROBAR = false;
    this.disabledTIPO_OFICIO = false;

    // console.log('this.dictamenesXBien1222', this.dictamenesXBien1);
    // SET_ITEM_PROPERTY('BLK_CONTROL.ENVIAR', ENABLED, PROPERTY_TRUE);
    // SET_ITEM_PROPERTY('BLK_CONTROL.IMPRIMIR', ENABLED, PROPERTY_TRUE);
    // SET_ITEM_PROPERTY('BLK_CONTROL.APROBAR', ENABLED, PROPERTY_FALSE);
    // SET_ITEM_PROPERTY('BLK_CONTROL.TIPO_OFICIO', ENABLED, PROPERTY_FALSE);
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
  async imprimir() {
    console.log('AAS', this.oficioDictamen);
    // if (this.dictamen && this.oficioDictamen) {
    if (this.dictamen.id != null) {
      if (this.oficioDictamen.statusOf == 'ENVIADO') {
        await this.generar_ofic_dict(this.dictamen);
      } else {
        const cadena = this.dictamen.passOfficeArmy;
        const elemento = '?';
        const contieneElemento = cadena.includes(elemento);

        if (contieneElemento == true) {
          await this.agregarDictamen();
        }

        const textP_: any = this.formDeclaratoriapageFin.get('fin').value;
        if (textP_ != null) {
          let textP = this.formDeclaratoriapageFin.get('fin').value;
          this.oficioDictamen.text2 = textP.substring(0, 3999);
          this.oficioDictamen.text2To = textP.substring(4000, 7999);
          this.oficioDictamen.text3 = textP.substring(8000, 11999);

          //   IF: OFICIO_DICTAMEN.TEXTOP IS NOT NULL
          //     AND GET_BLOCK_PROPERTY('OFICIO_DICTAMEN', UPDATE_ALLOWED) = 'TRUE' THEN
          //   : OFICIO_DICTAMEN.TEXTO2   := SUBSTR(: OFICIO_DICTAMEN.TEXTOP, 1, 4000);
          //        : OFICIO_DICTAMEN.TEXTO2_A := SUBSTR(: OFICIO_DICTAMEN.TEXTOP, 4001, 4000);
          //        : OFICIO_DICTAMEN.TEXTO3   := SUBSTR(: OFICIO_DICTAMEN.TEXTOP, 8001, 4000);
          //     END IF;
        }

        if (textP_ == null || textP_ == '') {
          this.alert('error', 'Debe seleccionar el tipo de oficio', '');
          return;
        } else {
          this.oficioDictamen.text1 =
            this.formDeclaratoriapageFin.get('page').value;
          await this.updateOficioDictamen(this.oficioDictamen);
          this.formDeclaratoriapageFin
            .get('fin')
            .setValue(
              this.oficioDictamen.text2 +
                this.oficioDictamen.text2To +
                this.oficioDictamen.text3
            );
          await this.generar_ofic_dict(this.dictamen); //PUP_OFIC_DICT
          this.disabledENVIAR = true;
        }
      }
    } else {
      this.alert('error', 'La declaratoria no ha sido aprobada', '');
    }
    // }
  }

  // PUP_OFIC_DICT
  async generar_ofic_dict(data: any) {
    let params = {
      PNOOFICIO: data.id,
      PTIPODIC: data.typeDict,
    };
    console.log('PARAMS PUP_OFIC_DICT', params);
    this.siabService.fetchReport('RGENABANDEC', params).subscribe(response => {
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
        this.onLoadToast('success', '', 'Reporte generado');
        this.modalService.show(PreviewDocumentsComponent, config);
      }
    });
  }

  getDataFormOficio(formOficio: FormGroup): any {
    this.formOficio = formOficio;
  }

  getFromSelect(params: ListParams) {
    this.securityService.getAllUsersTracker(params).subscribe(
      (data: any) => {
        console.log('a', data.data);
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });
        Promise.all(result).then((resp: any) => {
          this.items = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        this.items = new DefaultSelect();
      }
    );
  }

  getFromSelect2(params: ListParams) {
    this.securityService.getAllUsersTracker(params).subscribe(
      (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });
        Promise.all(result).then((resp: any) => {
          this.items2 = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        this.items2 = new DefaultSelect();
      }
    );
  }

  tiposData: any = [];
  filtroTipos(params: any) {
    this.valTiposAll === true;
    let body = {
      no_expediente: params.id,
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
          await this.countTipos(params.id);
        }
      },
      error: error => {
        if (params.id) {
          this.countTipos(params.id);
        }
        console.log('NIAS', error.error);
      },
    });
  }

  async countTipos(params: any) {
    let body = {
      no_expediente: params,
      vc_pantalla: 'FACTJURABANDONOS',
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

  // GET DATA TIPO DE OFICIO //
  // PUP_TIPO_BIEN
  tipoBien: number = null;
  async VtypeGood(dictamen: any) {
    // console.log('PARAMS ID', params);
    let body = {
      noOfDicata: dictamen.id,
      typeRuling: dictamen.typeDict,
    };
    this.tipoBien = 0;
    this.goodprocessService.getQueryVtypeGood(body).subscribe({
      next: (data: any) => {
        // console.log('VTYPEGOOD', data);

        if (data.data[0]) {
          this.tipoBien = data.data[0].no_tipo;
        }
      },
      error: error => {
        // this.onLoadToast('error', error.error.message, 'tabla: V_TIPO_BIEN');
        console.log(error.error);
      },
    });
  }
  getScreenStatus____(good: any) {
    // console.log('re', obj);
    return new Promise((resolve, reject) => {
      this.goodServices.getMassiveSearch(good).subscribe({
        next: (resp: any) => {
          resolve(resp.data);
          this.loading = false;
        },
        error: (error: any) => {
          // console.log('SCREEN ERROR', error.error.message);
          let objScSt: any = {
            di_disponible: 'N',
          };
          resolve([]);
          this.loading = false;
        },
      });
    });
  }

  getScreenStatus(good: any) {
    let obj = {
      identifier: good.identifier,
      estatus: good.status,
      vc_pantalla: 'FACTJURABANDONOS',
      processExtSun: good.extDomProcess,
    };

    // console.log('re', obj);
    return new Promise((resolve, reject) => {
      this.screenStatusService.getAllFiltro_(obj).subscribe({
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

  // DICTAMINACION_X_BIEN1
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

  // DICTAMINACION_X_BIEN1__
  getDictaXGood1Send(id: any, type: string) {
    const params = new ListParams();
    params['filter.ofDictNumber'] = `$eq:${id}`;
    params['filter.typeDict'] = `$eq:${type}`;
    return new Promise((resolve, reject) => {
      this.DictationXGood1Service.getAll(params).subscribe({
        next: (resp: any) => {
          console.log('DICTAMINACION X BIEN', resp.data);
          const data = resp.data;
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

  // CAMBIAR ATRIBUTOS DE LOS CAMPOS DEL CCP1 //
  valInterno: boolean = true;
  ccpChange(event: any) {
    console.log('EVENT', event);
    if (event == 'INTERNO') {
      this.valInterno = true;
    } else if (event == 'EXTERNO') {
      this.valInterno = false;
    } else {
      return;
    }
  }
  // CAMBIAR ATRIBUTOS DE LOS CAMPOS DEL CCP2 //
  valInterno2: boolean = true;
  ccpChange2(event: any) {
    console.log('EVENT', event);
    if (event == 'INTERNO') {
      this.valInterno2 = true;
    } else if (event == 'EXTERNO') {
      this.valInterno2 = false;
    } else {
      return;
    }
  }

  // DISABLED CAMPO DESPUÉS DE EDITAR EL CAMPO //
  disabledText() {
    this.valEditTextIni = false;
    this.valEditTextFin = false;
  }

  // M_OFICIO_GESTION //
  disabledMOficGest: boolean = true;
  async getMOficioGestion(dataFilter: any, filter: any) {
    let params = {
      ...this.params,
    };
    if (filter == 1) {
      params['filter.flyerNumber'] = `$eq:${dataFilter}`;
    } else {
      params['filter.managementNumber'] = `$eq:${dataFilter}`;
    }

    this.mJobManagementService.getAll(params).subscribe({
      next: async (resp: any) => {
        // this.updateOficioGestion = true;
        console.log('DATA JOG', resp);

        this.m_oficio_gestion = resp.data[0];
        this.dateCapture2 = this.datePipe.transform(
          this.m_oficio_gestion.insertDate,
          'dd/MM/yyyy'
        );
        // this.m_oficio_gestion = resp.data[1];
        this.no_OficioGestion = this.m_oficio_gestion.managementNumber;

        this.statusOfMOficioGestion = this.m_oficio_gestion.statusOf;
        this.cveManagement = this.m_oficio_gestion.cveManagement;

        this.formOficio
          .get('noVolante')
          .setValue(this.m_oficio_gestion.flyerNumber);
        this.formOficio
          .get('noExpediente')
          .setValue(this.m_oficio_gestion.proceedingsNumber);

        // if (this.m_oficio_gestion.managementNumber == null) {
        //   this.m_oficio_gestion.jobType = 'EXTERNO';
        //   this.m_oficio_gestion.jobBy = 'ABANDONO';
        //   this.m_oficio_gestion.city = '266';
        //   this.m_oficio_gestion.refersTo =
        //     'No se refiere a ningun bien asegurado, decomisado o abandonado';
        //   this.externoVal = true;
        this.formOficio.get('tipoOficio').setValue('EXTERNO');
        this.formOficio.get('oficioPor').setValue('ABANDONO');
        //   this.getCities__(266);
        // } else {

        // OBTENEMOS DOCUMENTOS
        await this.getDocOficioGestion(this.m_oficio_gestion.managementNumber);
        await this.getCopyOficioGestion__(
          this.m_oficio_gestion.managementNumber
        );
        // await this.getCopyOficioGestion(this.m_oficio_gestion.managementNumber);
        this.formOficiopageFin
          .get('page')
          .setValue(this.m_oficio_gestion.text1);
        this.formOficio
          .get('tipoOficio')
          .setValue(this.m_oficio_gestion.jobType);
        this.formOficio.get('oficioPor').setValue(this.m_oficio_gestion.jobBy);
        this.getCities__(this.m_oficio_gestion.city);

        // if (this.updateOficioGestion == false) {
        //   this.updateOficioGestion = true;
        //   this.formOficiopageFin
        //     .get('fin')
        //     .setValue(
        //       this.m_oficio_gestion.text2 + this.m_oficio_gestion.text3
        //     );
        //   this.updateOficioGestion = false;
        // } else {
        let test2 =
          this.m_oficio_gestion.text2 == null
            ? ''
            : this.m_oficio_gestion.text2;
        let test3 =
          this.m_oficio_gestion.text3 == null
            ? ''
            : this.m_oficio_gestion.text3;
        this.formOficiopageFin.get('fin').setValue(test2 + test3);
        //   this.updateOficioGestion = true;
        // }

        // }

        let textP = this.formOficiopageFin.get('fin').value;
        if (textP != '') {
          if (textP.length > 0) {
            this.m_oficio_gestion.text2 = textP.substring(0, 3999);
            this.m_oficio_gestion.text3 = textP.substring(4000, 7999);
          }
          this.m_oficio_gestion.text2 = textP.substring(0, 3999);
          this.m_oficio_gestion.text3 = null;
        }

        if (this.m_oficio_gestion.sender != null) {
          const paramsSender: any = new ListParams();
          paramsSender.text = this.m_oficio_gestion.sender;
          this.getSenders2OficioGestion(paramsSender);
        }

        if (this.m_oficio_gestion.city != null) {
          const paramsCity: any = new ListParams();
          paramsCity.text = this.m_oficio_gestion.city;
          this.getCitiesOficioGestion(this.m_oficio_gestion.city);
        }

        if (this.m_oficio_gestion.jobType == 'EXTERNO') {
          this.externoVal = true;
          this.m_oficio_gestion.managementNumber;
          this.formOficio
            .get('destinatario')
            .setValue(this.m_oficio_gestion.nomPersExt);
        } else {
          // CONDICIONAL PARA SABER SI EL TIPO DE OFICIO ES EXTERNO O NO.

          this.externoVal = false;
          if (this.m_oficio_gestion.nomPersExt != null) {
            const paramsRecipient: any = new ListParams();
            paramsRecipient.text = this.oficioDictamen.recipient;
            this.getRecipients2OficioGestion(paramsRecipient);
          }
        }

        if (this.m_oficio_gestion.statusOf == 'ENVIADO') {
          this.disabledMOficGest = false;
        } else {
          this.disabledMOficGest = true;
        }

        this.loading = false;
      },
      error: error => {
        // if (error.error.message == 'No se encontrarón registros.') {
        // this.alert('error', error.error.message, 'tabla: M_OFICIO_GESTION');
        // }
        this.m_oficio_gestion = {
          flyerNumber: null,
          proceedingsNumber: null,
          cveManagement: null,
          managementNumber: null,
          sender: null,
          delRemNumber: null,
          depRemNumber: null,
          addressee: null,
          city: null,
          text1: null,
          text2: null,
          statusOf: null,
          insertUser: null,
          areaUser: null,
          deleUser: null,
          insertDate: null,
          jobType: null,
          nomPersExt: null,
          refersTo: null,
          jobBy: null,
          recordNumber: null,
          armedKeyNumber: null,
          desSenderpa: null,
          text3: null,
          insertHcDate: null,
          projectDate: null,
          description: null,
          problematiclegal: null,
          cveChargeRem: null,
          justification: null,
        };

        this.disabledDocs = true;
        this.disabledMOficGest = true;
        this.disabledMOficGest = true;
        this.btnOficion = true;
        this.data2 = [];
        this.no_OficioGestion = '';
        this.formOficio.get('oficio').setValue('');
        this.formOficiopageFin.get('page').setValue('');
        this.formOficiopageFin.get('fin').setValue('');
        this.formOficio.get('remitente').setValue(null);
        this.formOficio.get('destinatario').setValue('');
        this.cveManagement = '';
        this.dateCapture2 = '';
        this.statusOfMOficioGestion = '';
        this.formCcpOficio.get('ccp').setValue(null);
        this.formCcpOficio.get('ccp2').setValue(null);
        this.formCcpOficio.get('nombreUsuario').setValue(null);
        this.formCcpOficio.get('nombreUsuario2').setValue(null);
        this.getCities__(266);

        this.disabledMOficGest = true;
        this.m_oficio_gestion.jobType = 'EXTERNO';
        this.m_oficio_gestion.jobBy = 'ABANDONO';
        this.m_oficio_gestion.city = '266';
        this.m_oficio_gestion.refersTo =
          'No se refiere a ningun bien asegurado, decomisado o abandonado';
        this.externoVal = true;
        this.formOficio.get('tipoOficio').setValue('EXTERNO');
        this.formOficio.get('oficioPor').setValue('ABANDONO');
        this.getCities__(266);
        this.formOficio.get('destinatario').setValue('');
        this.formOficio.get('remitente').setValue(null);
        this.no_OficioGestion = '';
        this.formOficio.get('noVolante').setValue(this.noVolante_);
        this.formOficio.get('noExpediente').setValue(this.idExpediente);
        this.cveManagement = '';
        this.dateCapture2 = '';
        this.statusOfMOficioGestion = '';
        this.disabledBTNs = true;
        this.formCcpOficio.get('ccp').setValue(null);
        this.formCcpOficio.get('nombreUsuario').setValue(null);
        this.formCcpOficio.get('ccp2').setValue(null);
        this.formCcpOficio.get('nombreUsuario2').setValue(null);
        this.formOficiopageFin.get('page').setValue('');
        this.formOficiopageFin.get('fin').setValue('');
        this.loading = false;
      },
    });
  }

  getRecipients2OficioGestion(params: ListParams) {
    params['filter.user'] = `$eq:${params.text}`;
    this.securityService.getAllUsersTracker(params).subscribe(
      (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });

        Promise.all(result).then((resp: any) => {
          this.formOficio.get('remitente').setValue(data.data[0]);

          // this.recipients = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        this.recipients = new DefaultSelect();
      }
    );
  }

  getCitiesOficioGestion(idCity: any) {
    const params = new FilterParams();
    // params.page = lparams.page;
    // params.limit = lparams.limit;
    // if (lparams?.text.length > 0)
    params.addFilter('idCity', idCity, SearchFilter.EQ);
    // this.hideError();

    this.abandonmentsService.getCities(params.getParams()).subscribe({
      next: (data: any) => {
        console.log('CITY', data);
        this.formOficio.get('ciudad').setValue(data.data[0]);
      },
      error: () => {
        this.cities = new DefaultSelect();
      },
    });
  }

  getSenders2OficioGestion(params: ListParams) {
    params['filter.user'] = `$eq:${params.text}`;
    this.securityService.getAllUsersTracker(params).subscribe(
      (data: any) => {
        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });
        Promise.all(result).then((resp: any) => {
          this.formOficio.get('remitente').setValue(data.data[0]);
          // this.senders = new DefaultSelect(data.data, data.count);
          this.loading = false;
        });
      },
      error => {
        this.senders = new DefaultSelect();
      }
    );
  }

  // DOCUM_OFICIO_GESTION //
  docOficioGesti: any;
  async getDocOficioGestion(managementNumber: any) {
    const params = new ListParams();
    params['filter.managementNumber'] = `$eq:${managementNumber}`;
    this.mJobManagementService.getDocOficioGestion(params).subscribe({
      next: async (resp: any) => {
        console.log('CORRRECTO', resp);
        let arr: any = [];
        let result = resp.data.map(async (item: any) => {
          const docsss = await this.docsssDicOficM(item.cveDocument);
          arr.push(docsss);
        });

        this.docOficioGesti = resp.data[0];
        this.data2 = arr;
        this.loading = false;
      },
      error: error => {
        console.log('MAL', error);
        this.loading = false;
      },
    });
  }
  async docsssDicOficM(cveDocument: any) {
    for (let i = 0; i < Documents.length; i++) {
      if (cveDocument == Documents[i].key) {
        return Documents[i];
      }
    }
  }

  getDocsParaDictum() {
    const params = new ListParams();
    params['filter.key'] = `$in:25,26,27,28`;
    this.documentsService.getDocParaDictum(params).subscribe({
      next: (resp: any) => {
        this.data2 = resp.data;
        this.loading = false;
      },
      error: error => {
        console.log('error DOCS PARA DICTUM', error.error.message);
        this.loading = false;
      },
    });
  }
  updateCopyOficeManag(data: any, id: any) {
    return new Promise((resolve, reject) => {
      this.mJobManagementService.updateCopyOficeManag(data, id).subscribe({
        next: (resp: any) => {
          console.log('COPYYYY', resp);
          this.loading = false;
          resolve(resp);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  getCopyOficioGestion(data: any) {
    const params = new ListParams();
    params['filter.managementNumber'] = `$eq:${data}`;
    return new Promise((resolve, reject) => {
      this.mJobManagementService.getCopyOficeManag(data).subscribe({
        next: async (resp: any) => {
          // this.copyOficio = resp.data;
          // if (resp.data.length >= 2) {
          //   if (
          //     resp.data[0].managementNumber ==
          //     this.m_oficio_gestion.managementNumber
          //   ) {
          //     if (resp.data[0].personExtInt == 'E') {
          //       this.valInterno = false;
          //       this.formCcpOficio.get('ccp').setValue('EXTERNO');
          //       this.formCcpOficio
          //         .get('nombreUsuario')
          //         .setValue(resp.data[0].nomPersonExt);
          //     } else if (resp.data[0].personExtInt == 'I') {
          //       this.formCcpOficio.get('ccp').setValue('INTERNO');
          //       this.valInterno = false;
          //       const paramsSender: any = new ListParams();
          //       paramsSender.text = resp.data[0].addresseeCopy;

          //       await this.getSenders2OfiM(paramsSender);
          //     }
          //   }

          //   if (
          //     resp.data[1].managementNumber ==
          //     this.m_oficio_gestion.managementNumber
          //   ) {
          //     if (resp.data[1].personExtInt == 'E') {
          //       this.valInterno2 = false;
          //       this.formCcpOficio.get('ccp2').setValue('EXTERNO');
          //       this.formCcpOficio
          //         .get('nombreUsuario2')
          //         .setValue(resp.data[1].nomPersonExt);
          //     } else if (resp.data[1].personExtInt == 'I') {
          //       this.formCcpOficio.get('ccp2').setValue('INTERNO');
          //       this.valInterno2 = false;
          //       const paramsSender: any = new ListParams();
          //       paramsSender.text = resp.data[1].addresseeCopy;
          //       await this.getSenders2OfiM2(paramsSender);
          //     }
          //   }
          // } else if (resp.data.length == 1) {
          //   /// EN CASO DE QUE TRAIGA 1
          //   if (
          //     resp.data[0].managementNumber ==
          //     this.m_oficio_gestion.managementNumber
          //   ) {
          //     if (resp.data[0].personExtInt == 'E') {
          //       this.valInterno = false;
          //       this.formCcpOficio.get('ccp').setValue('EXTERNO');
          //       this.formCcpOficio
          //         .get('nombreUsuario')
          //         .setValue(resp.data[0].nomPersonExt);
          //     } else if (resp.data[0].personExtInt == 'I') {
          //       this.formCcpOficio.get('ccp').setValue('INTERNO');
          //       this.valInterno = true;
          //       const paramsSender: any = new ListParams();
          //       paramsSender.text = resp.data[0].addresseeCopy;
          //       this.getSenders2OfiM(paramsSender);
          //     }
          //   }
          // }

          console.log('COPYYYY', resp);
          this.loading = false;
          resolve(resp);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  no_OficioGestion: string = '';
  btnOficion: boolean = true;

  async oficio() {
    console.log(
      'this.m_oficio_gestion.statusOf',
      this.m_oficio_gestion.statusOf
    );
    if (this.m_oficio_gestion.statusOf != 'ENVIADO') {
      let sender = this.formOficio.get('remitente').value;
      if (sender == null || sender == '') {
        this.alert('warning', 'Debe especificar el Remitente', '');
        return;
      }
      let dest = this.formOficio.get('destinatario').value;
      if (dest == null || dest == '') {
        this.alert('warning', 'Debe especificar el Destinatario', '');
        return;
      }
      let city = this.formOficio.get('ciudad').value;
      if (city == null || city == '') {
        this.alert('warning', 'Debe especificar la Ciudad', '');
        return;
      }

      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const year = today.getFullYear();
      const SYSDATE = `${year}-${month}-${day}`;

      this.dateCapture2 = SYSDATE;
      this.m_oficio_gestion.insertDate = SYSDATE;

      if (
        this.m_oficio_gestion.cveManagement == null &&
        this.m_oficio_gestion.managementNumber == null
      ) {
        // const nextValMOficioGestio = await this.getMOficioGestion__(1);
        // const _params = new ListParams()
        // _params['limit'] = 1;
        // this.mJobManagementService.getAll(_params).subscribe({
        //   next: resp => {
        // let contNext = parseInt(resp.data[0].managementNumber) + 1
        const textP = this.formOficiopageFin.get('fin').value;
        if (textP != '' || textP != null) {
          if (textP.length > 3999) {
            this.m_oficio_gestion.text2 = textP.substring(0, 3999);
            this.m_oficio_gestion.text3 = textP.substring(4000, 7999);
          }
          this.m_oficio_gestion.text2 = textP;
          this.m_oficio_gestion.text3 = null;
        }

        const sysdate = new Date();
        var anio = sysdate.getFullYear();
        this.loading = false;
        this.m_oficio_gestion.cveManagement = `DCB/${this.SiglasNivel2}/CJBM/?/${anio}`;
        this.cveManagement = `DCB/${this.SiglasNivel2}/CJBM/?/${anio}`;
        this.m_oficio_gestion.statusOf = 'EN REVISION';
        this.statusOfMOficioGestion = 'EN REVISION';
        this.m_oficio_gestion.flyerNumber = this.noVolante_;
        this.m_oficio_gestion.proceedingsNumber = this.idExpediente;
        // this.m_oficio_gestion.insertDate;
        let typeO = this.formOficio.get('tipoOficio').value;
        this.m_oficio_gestion.text1 = this.formOficiopageFin.get('page').value;

        let sender2 = this.formOficio.get('remitente').value;
        console.log('sender2', sender2);
        let useerrrr = sender2.user;
        let obj: any = {
          flyerNumber: this.noVolante_,
          proceedingsNumber: this.idExpediente,
          cveManagement: this.m_oficio_gestion.cveManagement,
          sender: useerrrr,
          nomPersExt: typeO == 'EXTERNO' ? dest : dest.user,
          city: city.idCity,
          statusOf: 'EN REVISION',
          jobBy: 'ABANDONO',
          jobType: typeO,
          insertDate: SYSDATE,
          text1: this.m_oficio_gestion.text1,
          insertUser: this.token.decodeToken().preferred_username,
          text2: this.m_oficio_gestion.text2,
          deleUser: this.delegation,
        };
        this.mJobManagementService.create(obj).subscribe({
          next: async (resp: any) => {
            console.log(resp);
            resp.data;

            // let obj = {
            //   flyerNumber: this.noVolante_,
            //   proceedingsNumber: this.idExpediente,
            // };
            // const nextValMOficioGestio: any = await this.getMOficioGestion__(obj);

            const params = new ListParams();
            params['filter.flyerNumber'] = `$eq:${this.noVolante_}`;
            params['filter.proceedingsNumber'] = `$eq:${this.idExpediente}`;

            this.mJobManagementService.getAll(params).subscribe({
              next: async (resp: any) => {
                this.m_oficio_gestion = resp.data[0];
                console.log('nextValMOficioGestio', resp);
                this.no_OficioGestion = resp.data[0].managementNumber;

                // ---------- CREATE COPIAS_OFICIO_GESTION ---------- //
                console.log('this.copyOficio', this.copyOficio);
                if (this.copyOficio.length > 0) {
                  for (let i = 0; i < this.copyOficio.length; i++) {
                    // if (this.copyOficio[i]) {
                    let obj: any = {
                      managementNumber: this.no_OficioGestion,
                      addresseeCopy: this.copyOficio[i].addresseeCopy,
                      delDestinationCopyNumber: null,
                      recordNumber: null,
                      personExtInt: this.copyOficio[i].personExtInt,
                      nomPersonExt: this.copyOficio[i].nomPersonExt,
                    };
                    // }

                    this.createCopyOficiManagement(obj);
                  }
                }

                // ---------- CREATE COPIAS_OFICIO_GESTION ---------- //

                if (this.m_oficio_gestion.cveManagement != null) {
                  const docs_: any = await this.getDocOficioGestion(
                    resp.data[0].managementNumber
                  );
                  console.log('DOCS_', docs_);
                  if (docs_ != 0) {
                    this.disabledDocs = false;
                  } else {
                    this.disabledDocs = false;
                  }
                }
                const textP = this.formOficiopageFin.get('fin').value;

                if (textP != '' && this.updateOficioGestion == true) {
                  if (textP.length > 4000) {
                    this.m_oficio_gestion.text2 = textP.substring(0, 3999);
                    this.m_oficio_gestion.text3 = textP.substring(4000, 7999);
                  }
                  this.m_oficio_gestion.text2 = textP;
                  this.m_oficio_gestion.text3 = null;
                }

                // CREAMOS DOCUMENTOS PARA M OFICIO GESTION //
                for (let i = 0; i < this.data2.length; i++) {
                  let obj = {
                    managementNumber: this.no_OficioGestion,
                    cveDocument: this.data2[i].key,
                    rulingType: 'ABANDONO',
                  };

                  this.createDocumentOficiManagement(obj);
                }

                await this.lanzaReporte(this.m_oficio_gestion.managementNumber);
                let test2 =
                  this.m_oficio_gestion.text2 == null
                    ? ''
                    : this.m_oficio_gestion.text2;
                let test3 =
                  this.m_oficio_gestion.text3 == null
                    ? ''
                    : this.m_oficio_gestion.text3;
                this.formOficiopageFin.get('fin').setValue(test2 + test3);

                let obj1 = {
                  flyerNumber: this.m_oficio_gestion.flyerNumber,
                  proceedingsNumber: this.m_oficio_gestion.proceedingsNumber,
                  managementNumber: this.m_oficio_gestion.managementNumber,
                  text2: this.m_oficio_gestion.text2,
                  text3: this.m_oficio_gestion.text3,
                };
                await this.updateMOficioGestion__(this.m_oficio_gestion);

                await this.getMOficioGestion(
                  this.m_oficio_gestion.managementNumber,
                  2
                );
                // this.formOficio.get('oficio').setValue(this.m_oficio_gestion.managementNumber);
                this.loading = false;
              },
              error: err => {
                this.loading = false;
              },
            });
          },
          error: err => {
            this.alert('error', 'OFICIO GESTION', '');
            this.loading = false;
          },
        });
      } else {
        if (this.m_oficio_gestion.cveManagement != null) {
          const docs_: any = await this.getDocOficioGestion(
            this.m_oficio_gestion.managementNumber
          );
          console.log('DOCS_', docs_);
          if (docs_ != 0) {
            this.disabledDocs = false;
          } else {
            this.disabledDocs = false;
          }
        }

        const textP = this.formOficiopageFin.get('fin').value;
        if (textP != '') {
          if (textP.length > 3999) {
            this.m_oficio_gestion.text2 = textP.substring(0, 3999);
            this.m_oficio_gestion.text3 = textP.substring(4000, 7999);
          }
          this.m_oficio_gestion.text2 = textP;
          this.m_oficio_gestion.text3 = null;
        }

        for (let i = 0; i < this.data2.length; i++) {
          let obj = {
            managementNumber: this.no_OficioGestion,
            cveDocument: this.data2[i].key,
            rulingType: 'ABANDONO',
          };
          this.createDocumentOficiManagement(obj);
        }
        let sender2 = this.formOficio.get('remitente').value;
        console.log('sender2', sender2);
        let useerrrr = sender2.user;
        this.m_oficio_gestion.sender = useerrrr;
        // await this.getCopyOficioGestion(this.m_oficio_gestion.managementNumber);
        await this.lanzaReporte(this.m_oficio_gestion.managementNumber);
        this.formOficiopageFin
          .get('fin')
          .setValue(this.m_oficio_gestion.text2 + this.m_oficio_gestion.text3);
        this.m_oficio_gestion.text1 = this.formOficiopageFin.get('page').value;
        this.m_oficio_gestion.nomPersExt =
          this.formOficio.get('destinatario').value;
        await this.updateMOficioGestion__(this.m_oficio_gestion);
        await this.getMOficioGestion(this.m_oficio_gestion.managementNumber, 2);
      }
    } else {
      this.lanzaReporte(this.m_oficio_gestion.managementNumber);
    }

    // ------------------------------------------------------------------ //
  }

  // CREATE document-job-management
  createDocumentOficiManagement(data: any) {
    return new Promise((resolve, reject) => {
      this.mJobManagementService.createDocumentOficeManag(data).subscribe({
        next: (resp: any) => {
          this.loading = false;
          resolve(resp);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // CREATE COPIAS_OFICIO_GESTION
  createCopyOficiManagement(data: any) {
    return new Promise((resolve, reject) => {
      this.mJobManagementService.createCopyOficeManag(data).subscribe({
        next: (resp: any) => {
          this.loading = false;
          resolve(resp);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }
  async createMOficioGestion__(data: any) {
    return new Promise((resolve, reject) => {
      this.mJobManagementService.create(data).subscribe({
        next: (resp: any) => {
          this.loading = false;
          resolve(resp);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async getMOficioGestion__(data: any) {
    const params = new ListParams();
    params['filter.flyerNumber'] = `$eq:${data.flyerNumber}`;
    params['filter.proceedingsNumber'] = `$eq:${data.proceedingsNumber}`;
    return new Promise((resolve, reject) => {
      this.mJobManagementService.getAll(params).subscribe({
        next: (resp: any) => {
          const a = resp.data[0];
          this.loading = false;
          resolve(a);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async updateMOficioGestion__(data: any) {
    return new Promise((resolve, reject) => {
      this.mJobManagementService.update(data).subscribe({
        next: (resp: any) => {
          resolve(resp.data);
          this.loading = false;
        },
        error: err => {
          resolve(null);
          this.loading = false;
        },
      });
    });
  }

  // PUP_LANZA_REPORTE //
  async lanzaReporte(managementNumber: any) {
    // ADD_PARAMETER(PL_ID, 'PARAMFORM', TEXT_PARAMETER, 'NO');
    // ADD_PARAMETER(PL_ID, 'NO_OF_GES', TEXT_PARAMETER, TO_CHAR(: M_OFICIO_GESTION.NO_OF_GESTION));
    // ADD_PARAMETER(PL_ID, 'TIPO_OF', TEXT_PARAMETER, (: M_OFICIO_GESTION.TIPO_OFICIO));
    // ADD_PARAMETER(PL_ID, 'VOLANTE', TEXT_PARAMETER, TO_CHAR(: BLK_NOT.NO_VOLANTE));
    // ADD_PARAMETER(PL_ID, 'EXP', TEXT_PARAMETER, TO_CHAR(: BLK_NOT.NO_EXPEDIENTE));

    let params = {
      no_of_ges: managementNumber,
    };

    this.siabService
      .fetchReport('RGEROFGESTION_EXT', params)
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
          this.onLoadToast('success', '', 'Reporte generado');
          this.modalService.show(PreviewDocumentsComponent, config);
        }
      });
  }

  iconLock: boolean = false;
  disabledBtnDelete: boolean = true;
  async envofi() {
    if (this.m_oficio_gestion) {
      let V_NO_OF_GESTION = this.m_oficio_gestion.managementNumber;
      const textP = this.formOficiopageFin.get('fin').value;

      if (textP != '' && this.updateOficioGestion == true) {
        if (textP.length > 4000) {
          this.m_oficio_gestion.text2 = textP.substring(0, 3999);
          this.m_oficio_gestion.text3 = textP.substring(4000, 7999);
        }
        this.m_oficio_gestion.text2 = textP.substring(0, 3999);
        this.m_oficio_gestion.text3 = null;
      }

      console.log(
        'this.m_oficio_gestion.text3 111',
        this.m_oficio_gestion.text3
      );
      if (this.m_oficio_gestion.statusOf == 'ENVIADO') {
        this.actGestion(); //PUP_ACT_GESTION
        this.lanzaReporte(V_NO_OF_GESTION); // PUP_LANZA_REPORTE
      }

      let encontrado = this.m_oficio_gestion.cveManagement.includes('?');
      console.log(encontrado);
      console.log(this.m_oficio_gestion.statusOf);
      if (
        this.m_oficio_gestion.statusOf == 'EN REVISION' &&
        encontrado == true
      ) {
        await this.searchNumber(V_NO_OF_GESTION); //PUP_BUSCA_NUMERO
        this.m_oficio_gestion.statusOf = 'ENVIADO';
        this.statusOfMOficioGestion = 'ENVIADO';
        await this.actGestion(); //PUP_ACT_GESTION
        this.iconLock = true;
        this.disabledBtnDelete = false;
        this.btnOficion = true;
        // SET_ITEM_PROPERTY('BLK_CONTROL.ENVOFI', ICON_NAME, '../iconos/rt_lock');
        // SET_ITEM_PROPERTY('BLK_CONTROL.OFICIO', ENABLED, PROPERTY_FALSE);
        await this.lanzaReporte(V_NO_OF_GESTION); // PUP_LANZA_REPORTE
      }

      V_NO_OF_GESTION = this.m_oficio_gestion.managementNumber;
      let test2 =
        this.m_oficio_gestion.text2 == null
          ? null
          : this.m_oficio_gestion.text2;
      let test3 =
        this.m_oficio_gestion.text3 == null
          ? null
          : this.m_oficio_gestion.text3;
      this.formOficiopageFin.get('fin').setValue(test2 + test3);
      // this.formOficiopageFin.get('fin').setValue(this.m_oficio_gestion.text2 + this.m_oficio_gestion.text3);
      console.log(
        'this.m_oficio_gestion.text3 2222',
        this.m_oficio_gestion.text3
      );
      await this.updateMOficioGestion__(this.m_oficio_gestion);
      await this.getMOficioGestion(this.m_oficio_gestion.managementNumber, 2);

      //     GO_BLOCK('M_OFICIO_GESTION');
      //     V_NO_OF_GESTION:= : M_OFICIO_GESTION.NO_OF_GESTION;
      //     CLEAR_BLOCK(NO_VALIDATE);
      //     SET_BLOCK_PROPERTY('M_OFICIO_GESTION', DEFAULT_WHERE, 'NO_OF_GESTION = ' || TO_CHAR(V_NO_OF_GESTION));
      //     EXECUTE_QUERY;
      //     SET_BLOCK_PROPERTY('M_OFICIO_GESTION', DEFAULT_WHERE, '');
      //  : M_OFICIO_GESTION.TEXTOP := : M_OFICIO_GESTION.TEXTO2 ||: M_OFICIO_GESTION.TEXTO3;
    }
  }

  // PUP_ACT_GESTION
  async actGestion() {
    const VAR1 = 'FNI';
    const VAR2 = 'AB';

    // AVERIGUAR P_NO_TRAMITE
    let body: any = {
      pNoTramite: null,
      noVolante: this.noVolante_,
      estatusTramite: VAR1,
      estatusTramite2: VAR2,
    };
    this.historicalProcedureManagementService.updateWithBody(body).subscribe({
      next: resp => {
        this.loading = false;
        // this.onLoadToast('success', 'tabla: GESTION_TRAMITE');
      },
      error: err => {
        // this.onLoadToast('error', 'tabla: GESTION_TRAMITE');
        this.loading = false;
      },
    });
    // UPDATE GESTION_TRAMITE
    // SET USR_A_TURNAR = USR_TURNADO, ESTATUS_TRAMITE = VAR1
    // WHERE(NO_TRAMITE = :PARAMETER.P_NO_TRAMITE OR NO_VOLANTE = : BLK_NOT.NO_VOLANTE) AND SUBSTR(ESTATUS_TRAMITE, 1, 2) = 'VAR2';
  }

  // PUP_BUSCA_NUMERO
  async searchNumber(numberManagement: any) {
    const sysdate = new Date();
    var anio = sysdate.getFullYear();
    let estapa2: any;
    let LN_OFICIO: any;

    // this.delegacionreg
    let obj = {
      noOfNanagement: this.delegation,
      year: anio,
    };

    estapa2 = await this.getMOficioGestionStage2_(numberManagement);
    console.log('estapa2', estapa2);
    //  FA_ETAPACREDA(TRUNC(SYSDATE))
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const SYSDATE = `${day}/${month}/${year}`;
    const SYSDATE2 = `${month}/${day}/${year}`;
    const FA_ETAPACREDA: any = await this.getFaStageCreda(SYSDATE2);
    console.log('estapa2', FA_ETAPACREDA);
    if (estapa2 == FA_ETAPACREDA) {
      LN_OFICIO = await this.getMOficioGestionlnJob_(obj);
    } else {
      LN_OFICIO = await this.getMOficioGestionmaxLnJob_(obj);
      if (LN_OFICIO == null) {
        this.alert('error', 'Al buscar el número del Oficio...', '');
        return;
      }
    }

    // if (this.dictamenes.length > 0) {
    //   let arr = [];

    //   console.log('aa', this.dictamenes);

    //   for (let i = 0; i < this.dictamenes.length; i++) {
    //     if (this.dictamenes[i].passOfficeArmy) {
    //       const cadena = this.dictamenes[i].passOfficeArmy;
    //       const elemento = '?';
    //       const contieneElemento = cadena.includes(elemento);
    //       console.log('contieneElemento', contieneElemento);
    //       if (contieneElemento != true) {
    //         arr.push(this.dictamenes[i]);
    //       }
    //     }
    //   }

    //   console.log('ARRA', arr);
    //   if (arr.length > 0) {
    //     LN_OFICIO = arr.reduce(
    //       (max: any, obj: any) =>
    //         obj.keyArmyNumber > max.keyArmyNumber ? obj : max,
    //       this.dictamenes[0]
    //     );
    //     console.log('OFICIO_', LN_OFICIO);

    //     LN_OFICIO = parseInt(LN_OFICIO.keyArmyNumber) + 1;
    //   }
    // }

    const ln_oficio = LN_OFICIO; // Reemplaza 123 por el valor de LN_OFICIO
    const ln_oficio_str = ln_oficio.toString(); // Convierte el número a una cadena de caracteres

    // Rellena la cadena de caracteres con ceros a la izquierda hasta que tenga una longitud de 5 caracteres
    const ln_oficio_padded = ln_oficio_str.padStart(5, '0');

    // Remueve los espacios en blanco a la izquierda de la cadena de caracteres
    const ln_oficio_trimmed = ln_oficio_padded.trimStart();

    this.m_oficio_gestion.armedKeyNumber = LN_OFICIO;
    this.cveManagement = `DCB/${this.SiglasNivel2}/CJBM/${ln_oficio_trimmed}/${anio}`;
    this.m_oficio_gestion.cveManagement = `DCB/${this.SiglasNivel2}/CJBM/${ln_oficio_trimmed}/${anio}`;
    this.m_oficio_gestion.insertDate = SYSDATE;
    this.dateCapture2 = SYSDATE;
    console.log('this.m_oficio_gestion', this.m_oficio_gestion);
    this.updateMOficioGestion__(this.m_oficio_gestion);
    //   : M_OFICIO_GESTION.NUM_CLAVE_ARMADA := LN_OFICIO;
    //  : M_OFICIO_GESTION.CVE_OF_GESTION := 'DCB/DEBM/CJBM/' || LTRIM(TO_CHAR(LN_OFICIO, '00000')) || '/' || ANIO; --SE MODIFICO POR EL CAMBIO POR NUEVO ESTATUTO		JPH 21 / 10 / 2011
    //  : M_OFICIO_GESTION.FECHA_INSERTO := SYSDATE;
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

  async getMOficioGestionStage2_(numberManagement: any) {
    let obj = {
      numberManagement: numberManagement,
    };
    return new Promise((resolve, reject) => {
      this.mJobManagementService.getMOficioGestionStage2(obj).subscribe({
        next: (resp: any) => {
          this.loading = false;
          // this.onLoadToast('success', 'tabla: M_OFICIO_GESTION', 'stage2');
          resolve(resp.data[0].etapa2);
        },
        error: err => {
          // this.onLoadToast('error', 'tabla: M_OFICIO_GESTION', 'stage2');
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async getMOficioGestionlnJob_(obj: any) {
    return new Promise((resolve, reject) => {
      this.mJobManagementService.getMOficioGestionlnJob(obj).subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.loading = false;
          // this.onLoadToast('success', 'tabla: M_OFICIO_GESTION', 'lnJob');
          resolve(resp.data[0].ln_oficio);
        },
        error: err => {
          // this.onLoadToast('error', 'tabla: M_OFICIO_GESTION', 'lnJob');
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async getMOficioGestionmaxLnJob_(obj: any) {
    return new Promise((resolve, reject) => {
      this.mJobManagementService.getMOficioGestionmaxLnJob(obj).subscribe({
        next: (resp: any) => {
          this.loading = false;
          // this.onLoadToast('success', 'tabla: M_OFICIO_GESTION', 'maxLnJob');
          resolve(resp.data[0].ln_oficio);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  async eliminar() {
    // if (this.dictamen && this.oficioDictamen) {
    let V_TIPO_DICTA = this.dictamen.typeDict;
    let V_NO_OF_DICTA = this.dictamen.id;
    let V_NO_VOLANTE = this.noVolante_;
    let V_ELIMINA: any = 'S';
    const toolbar_user = this.token.decodeToken().preferred_username;
    const cadena = this.dictamen.passOfficeArmy
      ? this.dictamen.passOfficeArmy.indexOf('?')
      : 0;
    let V_VAL_ELIM: number;

    V_VAL_ELIM = 0;

    if (cadena != 0 && this.dictamen.userDict == toolbar_user) {
      null;
    } else if (cadena == 0) {
      V_ELIMINA = await this.getRTdictaAarusr(toolbar_user);

      if (V_ELIMINA == 'X') {
        this.alert(
          'error',
          'El Usuario no está autorizado para eliminar el dictamen',
          ''
        );
      }
    }

    if (this.dictamen.id == null) {
      this.alert('error', 'No se tiene declaratoria a eliminar', '');
      return;
    }

    this.alertQuestion('question', 'Se borra la declaratoria?', '').then(
      async question => {
        if (question.isConfirmed) {
          V_TIPO_DICTA = this.dictamen.typeDict;
          V_NO_OF_DICTA = this.dictamen.id;
          V_NO_VOLANTE = this.noVolante_;

          if (this.oficioDictamen.statusOf == 'ENVIADO' && V_ELIMINA != 'S') {
            this.alert(
              'error',
              'La declaratoria ya ha sido enviada o no se tienen permisos para eliminar',
              ''
            );
            return;
          } else {
            // UPDATE BIENES //
            await this.updateGoodFunct(V_NO_OF_DICTA, V_TIPO_DICTA);
            // DELETE DOCUMENTOS_DICTAMEN_X_BIEN_M
            for (let i = 0; i < this.selectedGood.length; i++) {
              let obj = {
                expedientNumber: this.idExpediente,
                stateNumber: this.selectedGood[i].id,
              };
              const getDocs: any = await this.getDeleteDocsDictXGoodM(obj);
              if (getDocs != null) {
                for (let e = 0; e < getDocs.length; e++) {
                  let obj1 = {
                    expedientNumber: getDocs[e].expedientNumber,
                    stateNumber: getDocs[e].stateNumber,
                    key: getDocs[e].key,
                    typeDictum: getDocs[e].typeDictum,
                  };
                  await this.deleteDocsDictXGoodM(obj1);
                }
              }
            }
            // DELETE DICTAMINACION_X_BIEN1
            await this.deleteDictaXGood1(V_NO_OF_DICTA, V_TIPO_DICTA);
            // DELETE COPIAS_OFICIO_DICTAMEN
            await this.deleteCopyOficioDictamen(V_NO_OF_DICTA, V_TIPO_DICTA);
            // DELETE OFICIO_DICTAMEN_TEXTOS
            await this.deleteOficioDictamenTextos(V_NO_OF_DICTA, V_TIPO_DICTA);
            // DELETE OFICIO_DICTAMEN
            await this.deleteOficioDictamen(V_NO_OF_DICTA, V_TIPO_DICTA);
            // DELETE DICTAMINACIONES
            await this.deleteDictamen(V_NO_OF_DICTA, V_TIPO_DICTA);

            if (
              this.selectedRow.affairKey == '24' ||
              this.selectedRow.affairKey == '25'
            ) {
              // UPDATE NOTIFICACIONES
              if (this.dictamenes.length == 1) {
                await this.updateNotifications(V_NO_VOLANTE);
              }
            }

            // IF V_VAL_ELIM = 1 THEN
            //   LIP_MENSAJE('No es posible realizar la eliminación del dictamen. ' || SQLERRM, 'S');
            // ELSIF V_VAL_ELIM = 0 THEN
            //   LIP_COMMIT_SILENCIOSO;
            //   LIP_MENSAJE('Dictamen eliminado. ', 'A');
            // END IF;

            // LIMPIAMOS CAMPOS - EJECUTAR UNA REDIRECCIÓN A NO_VOLANTE //
            await this.checkDictum(this.noVolante_, 'all');
            // await this.checkDictum_(this.noVolante_, 'all');
            await this.onLoadGoodList('all');
            this.disbaledAPROBAR = true;
            this.declarationForm.get('recipient').setValue(null);
            this.declarationForm.get('passOfficeArmy').setValue('');
            this.disabledTIPO_OFICIO = true;
            this.declarationForm.get('officeType').setValue(null);
            this.formFolioEscaneo.get('folioEscaneo').setValue('');
            this.folioEscaneoNg = '';
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
            const paramsSender: any = new ListParams();
            paramsSender.text = this.token.decodeToken().preferred_username;
            this.getSenders2(paramsSender);
            this.getCities_(266);
          }
        }
      }
    );
    // }
  }

  async getRTdictaAarusr(toolbar_user: any) {
    return new Promise((resolve, reject) => {
      const params = new ListParams();
      params['filter.user'] = `$eq:${toolbar_user}`;
      params['filter.reading'] = `$eq:S`;
      params['filter.writing'] = `$eq:S`;
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

  // UPDATE BIENES //
  async updateGoodFunct(V_NO_OF_DICTA: any, V_TIPO_DICTA: any) {
    const dictGood1: any = await this.getDictaXGood_(
      V_NO_OF_DICTA,
      V_TIPO_DICTA
    );
    if (dictGood1) {
      console.log('DELETE DICTAMINACION_X_BIEN1', dictGood1);
      for (let i = 0; i < dictGood1.length; i++) {
        console.log('JRO', dictGood1[i]);
        if (dictGood1[i].id != null) {
          let obj = {
            id: dictGood1[i].id,
            goodId: dictGood1[i].id,
            extDomProcess: 'ASEGURADO',
          };
          this.goodServices.updateWithParams(obj).subscribe({
            next: (resp: any) => {
              // this.alert(
              //   'success',
              //   'Datos actualizados correctamente',
              //   'tabla: BIENES'
              // );
              this.loading = false;
            },
            error: error => {
              this.V_VAL_ELIM = 1;
              // this.alert('error', error.error.message, 'tabla: BIENES');
              this.loading = false;
            },
          });
        }
      }
    }
  }
  // DICTAMINACION_X_BIEN1
  async getDictaXGood_(ofDictNumber: any, type: string) {
    const params = new ListParams();
    params['filter.ofDictNumber'] = `$eq:${ofDictNumber}`;
    params['filter.typeDict'] = `$eq:${type}`;
    return new Promise((resolve, reject) => {
      this.DictationXGood1Service.getAll(params).subscribe({
        next: (resp: any) => {
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

  async getDeleteDocsDictXGoodM(data: any) {
    const params = new ListParams();
    params['filter.stateNumber'] = `$eq:${data.stateNumber}`;
    params['filter.expedientNumber'] = `$eq:${data.expedientNumber}`;
    return new Promise((resolve, reject) => {
      this.documentsService.getDeleteDocumentsDictuXStateM(params).subscribe({
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

  // DELETE DOCUMENTOS_DICTAMEN_X_BIEN_M -- (SIN ENDPOINT PARA ELIMINAR) //
  async deleteDocsDictXGoodM(data: any) {
    this.documentsService.deleteDocumentsDictuXStateM(data).subscribe({
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
        this.V_VAL_ELIM = 1;
        // this.onLoadToast(
        //   'error',
        //   'Error al eliminar los documentos de los bienes',
        //   'tabla: DOCUMENTOS_DICTAMEN_X_BIEN_M'
        // );
      },
    });
  }
  // DELETE DICTAMINACION_X_BIEN1
  async deleteDictaXGood1(ofDictNumber: any, type: string) {
    const dictGood1: any = await this.getDictaXGood_(ofDictNumber, type);

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
              this.V_VAL_ELIM = 1;
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
              this.V_VAL_ELIM = 1;
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
          // this.onLoadToast(
          //   'error',
          //   error.error.message,
          //   'tabla: COPIAS_OFICIO_DICTAMEN'
          // );
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
        this.V_VAL_ELIM = 1;
        // this.onLoadToast(
        //   'error',
        //   'Error al eliminar los textos del Oficio.',
        //   'tabla: OFICIO_DICTAMEN_TEXTOS'
        // );
        this.loading = false;
      },
    });
  }
  // DELETE OFICIO_DICTAMEN
  async deleteOficioDictamen(ofDictNumber: any, type: string) {
    const body = {
      officialNumber: ofDictNumber,
      typeDict: type,
    };
    console.log('DELETE OFICIO_DICTAMEN', body);

    this.OficialDictationService.remove(body).subscribe({
      next: (resp: any) => {
        // this.alert(
        //   'success',
        //   'Datos eliminados correctamente',
        //   'tabla: OFICIO_DICTAMEN'
        // );
        this.loading = false;
      },
      error: error => {
        this.V_VAL_ELIM = 1;
        // this.onLoadToast(
        //   'error',
        //   'Error al eliminar el Oficio del Dictamen.',
        //   'tabla: OFICIO_DICTAMEN'
        // );
        this.loading = false;
      },
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
        this.alert('success', 'Se eliminó correctamente el dictamen', '');
        this.loading = false;
      },
      error: error => {
        this.V_VAL_ELIM = 1;
        this.onLoadToast(
          'error',
          'Error al eliminar el Dictamen.',
          'tabla: DICTAMINACIONES'
        );
        this.loading = false;
      },
    });
  }
  // UPDATE NOTIFICACIONES
  async updateNotifications(noVolante: any) {
    const body: any = {
      dictumKey: null,
    };
    console.log('UPDATE NOTIFICACIONES', body);

    this.notificationService.updateWithBody(noVolante, body).subscribe({
      next: (resp: any) => {
        // this.alert(
        //   'success',
        //   'Datos actualizados correctamente',
        //   'tabla: NOTIFICACIONES'
        // );
        this.loading = false;
      },
      error: error => {
        this.V_VAL_ELIM = 1;
        // this.onLoadToast(
        //   'error',
        //   'Error al actualizar el volante.',
        //   'tabla: NOTIFICACIONES'
        // );
        this.loading = false;
      },
    });
  }

  // UPDATE NOTIFICACIONES
  async updateNotificationsAprobar(noVolante: any) {
    const body: any = {
      dictumKey: 'DECLARATORIA DE ABANDONO',
    };
    console.log('UPDATE NOTIFICACIONES', body);

    this.notificationService.updateWithBody(noVolante, body).subscribe({
      next: (resp: any) => {
        // this.alert(
        //   'success',
        //   'Datos actualizados correctamente',
        //   'tabla: NOTIFICACIONES'
        // );
        this.loading = false;
      },
      error: error => {
        this.V_VAL_ELIM = 1;
        // this.onLoadToast(
        //   'error',
        //   'Error al actualizar el volante.',
        //   'tabla: NOTIFICACIONES'
        // );
        this.loading = false;
      },
    });
  }

  // -------------------------- BOTON BORRAR--------------------------- //

  async borrar() {
    // if (this.m_oficio_gestion) {

    let V_NO_OF_GESTION = this.m_oficio_gestion.managementNumber;
    let V_NO_VOLANTE = this.m_oficio_gestion.flyerNumber;

    if (this.m_oficio_gestion.managementNumber == null) {
      this.alert('warning', 'No se tiene oficio', '');
      return;
    }

    if (this.m_oficio_gestion.statusOf == 'ENVIADO') {
      this.alert('warning', 'El oficio ya esta enviado no puede borrar', '');
      return;
    }

    const TOOLBAR_USUARIO = this.token.decodeToken().preferred_username;
    console.log(this.m_oficio_gestion.insertUser, 'USER', TOOLBAR_USUARIO);
    if (this.m_oficio_gestion.insertUser != TOOLBAR_USUARIO) {
      this.alert('warning', 'Usuario inválido para borrar oficio', '');
      return;
    }

    var posicion = this.m_oficio_gestion.cveManagement.indexOf('?');

    if (posicion == 0) {
      this.alert('warning', 'La clave está armada, no puede borrar oficio', '');
      return;
    }

    V_NO_OF_GESTION = this.m_oficio_gestion.managementNumber;
    V_NO_VOLANTE = this.m_oficio_gestion.flyerNumber;
    console.log('AQUIII', this.m_oficio_gestion);
    this.alertQuestion(
      'info',
      `Se borra oficio (Exp.: ${this.idExpediente} No.oficio: ${V_NO_VOLANTE})?`,
      '¿Deseas continuar?'
    ).then(async question => {
      if (question.isConfirmed) {
        // BORRA COPIAS_OFICIO_GESTION
        this.getCopiasOfiGest(V_NO_OF_GESTION);

        // ---------- BORRA DOCUM_OFICIO_GESTION ---------- //
        for (let i = 0; i < this.data2.length; i++) {
          this.deleteDocOficioGestion(V_NO_OF_GESTION, this.data2[i].key);
        }
        // ------------------------------------------------ //

        // BORRA M_OFICIO_GESTION //
        this.deleteMOficioGestion(V_NO_OF_GESTION);
        // UPDATE NOTIFICACIONES
        // if (this.dictamenes.length == 1) {
        //   await this.updateNotifications(V_NO_VOLANTE);
        // }
        // this.updateNotifications(V_NO_VOLANTE);

        this.m_oficio_gestion = {
          flyerNumber: null,
          proceedingsNumber: null,
          cveManagement: null,
          managementNumber: null,
          sender: null,
          delRemNumber: null,
          depRemNumber: null,
          addressee: null,
          city: null,
          text1: null,
          text2: null,
          statusOf: null,
          insertUser: null,
          areaUser: null,
          deleUser: null,
          insertDate: null,
          jobType: null,
          nomPersExt: null,
          refersTo: null,
          jobBy: null,
          recordNumber: null,
          armedKeyNumber: null,
          desSenderpa: null,
          text3: null,
          insertHcDate: null,
          projectDate: null,
          description: null,
          problematiclegal: null,
          cveChargeRem: null,
          justification: null,
        };
        this.formCcpOficio.get('ccp').setValue(null);
        this.formCcpOficio.get('nombreUsuario').setValue(null);
        this.formCcpOficio.get('ccp2').setValue(null);
        this.formCcpOficio.get('nombreUsuario2').setValue(null);
        this.formOficiopageFin.get('page').setValue('');
        this.formOficiopageFin.get('fin').setValue('');
        this.data2 = [];
        this.disabledMOficGest = true;
        this.btnOficion = true;
        this.lockStatus = true;
        this.disabledDocs = true;
        this.disabledMOficGest = true;
        this.disabledMOficGest = true;
        this.btnOficion = true;
        this.data2 = [];
        this.no_OficioGestion = '';
        this.formOficio.get('oficio').setValue('');
        this.formOficiopageFin.get('page').setValue('');
        this.formOficiopageFin.get('fin').setValue('');
        this.formOficio.get('remitente').setValue(null);
        this.formOficio.get('destinatario').setValue('');
        this.cveManagement = '';
        this.dateCapture2 = '';
        this.statusOfMOficioGestion = '';
        this.formCcpOficio.get('ccp').setValue(null);
        this.formCcpOficio.get('ccp2').setValue(null);
        this.formCcpOficio.get('nombreUsuario').setValue(null);
        this.formCcpOficio.get('nombreUsuario2').setValue(null);
        this.getCities__(266);

        this.disabledDocs = true;
        this.disabledMOficGest = true;
        this.disabledMOficGest = true;
        this.btnOficion = true;
        this.data2 = [];
        this.no_OficioGestion = '';
        this.formOficio.get('oficio').setValue('');
        this.formOficiopageFin.get('page').setValue('');
        this.formOficiopageFin.get('fin').setValue('');
        this.formOficio.get('remitente').setValue(null);
        this.formOficio.get('destinatario').setValue('');
        this.cveManagement = '';
        this.dateCapture2 = '';
        this.statusOfMOficioGestion = '';
        this.formCcpOficio.get('ccp').setValue(null);
        this.formCcpOficio.get('ccp2').setValue(null);
        this.formCcpOficio.get('nombreUsuario').setValue(null);
        this.formCcpOficio.get('nombreUsuario2').setValue(null);
        this.copyOficio = [];
        this.getCities__(266);

        await this.getMOficioGestion(this.noVolante_, 1);
        // FALTARIA ESTO
        // GO_ITEM('BLK_NOT.NO_VOLANTE');
        // SET_BLOCK_PROPERTY('BLK_NOT', DEFAULT_WHERE,: BLK_CONTROL.DEF_WHERE_NOT);
      }
    });
    // } else {
    //   this.alert('warning', 'Debe seleccionar una Gestión de Oficio', '');
    // }
  }

  // PRIMERO BUSCAMOS EL ID FILTRÁNDOLO CON EL NÚMERO DE LA GESTIÓN, LUEGO PROCEDEREMOS A ELIMINAR //
  getCopiasOfiGest(managementNumber: any) {
    this.loading = true;
    const params = new ListParams();
    params['filter.managementNumber'] = `$eq:${managementNumber}`;

    this.goodsJobManagementService.getCopiesJobManagement(params).subscribe({
      next: (data: any) => {
        let result = data.data.map(async (item: any) => {
          await this.deleteCopiasOfiGest(item.id);
        });

        Promise.all(result).then((resp: any) => {
          // this.alert(
          //   'success',
          //   'COPIAS_OFICIO_GESTION',
          //   'Datos eliminados correctamente'
          // );
          this.loading = false;
        });

        this.loading = false;
      },
      error: error => {
        // this.alert('error', 'COPIAS_OFICIO_GESTION', error.error.message);
        this.loading = false;
      },
    });
  }

  // BORRA COPIAS_OFICIO_GESTION //
  deleteCopiasOfiGest(id: any) {
    return new Promise((resolve, reject) => {
      this.goodsJobManagementService.deleteCopiesJobManagement(id).subscribe({
        next: (resp: any) => {
          this.loading = false;
          resolve(true);
        },
        error: (error: any) => {
          this.loading = false;
          resolve(false);
        },
      });
    });
  }

  // BORRA DOCUM_OFICIO_GESTION //
  async deleteDocOficioGestion(managementNumber: any, cveD: any) {
    let obj = {
      managementNumber: managementNumber,
      cveDocument: cveD,
    };
    this.mJobManagementService.deleteDocOficioGestion(obj).subscribe({
      next: (resp: any) => {
        // this.alert('success', "Datos eliminados correctamente", "tabla: DOCUM_OFICIO_GESTION")
        this.loading = false;
      },
      error: error => {
        // this.alert('error', error.error.message, 'tabla: DOCUM_OFICIO_GESTION');
        this.loading = false;
      },
    });
  }

  // BORRA M_OFICIO_GESTION //
  async deleteMOficioGestion(managementNumber: any) {
    let obj = {
      managementNumber: managementNumber,
      flyerNumber: this.noVolante_,
    };
    this.mJobManagementService.deleteMJobGestion(obj).subscribe({
      next: (resp: any) => {
        this.alert(
          'success',
          'Datos eliminados correctamente',
          'tabla: M_OFICIO_GESTION'
        );
        this.loading = false;
      },
      error: error => {
        // this.alert('error', error.error.message, 'tabla: M_OFICIO_GESTION');
        this.loading = false;
      },
    });
  }

  // ACCIÓN DE EDITAR CAMPOS INICIO Y EDIT DEL TAB OFICIO //
  valEditTextIni: boolean = false;
  valEditTextFin: boolean = false;
  // EDIT INICION //

  editTextInicio() {
    this.valEditTextIni = !this.valEditTextIni;
  }
  // EDIT TEXT MODAL //
  editText(event: any, filter: string) {
    // console.log('EVENT', event);
    let data = event.target.value;
    this.valEditTextFin = !this.valEditTextFin;
    this.openModal({
      dataEdit: data,
      filterText: filter,
      disabledDictum: this.lockStatus,
    });
  }

  openModal(context?: Partial<EditTextComponent>) {
    const modalRef = this.modalService.show(EditTextComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.dataText.subscribe((next: any) => {
      if (next.filterText == 'declaratoriaFin') {
        this.formDeclaratoriapageFin.get('fin').setValue(next.data);
      } else if (next.filterText == 'declaratoriaInicio') {
        this.formDeclaratoriapageFin.get('page').setValue(next.data);
      } else if (next.filterText == 'OficioInicio') {
        this.formOficiopageFin.get('page').setValue(next.data);
      } else if (next.filterText == 'OficioFin') {
        this.formOficiopageFin.get('fin').setValue(next.data);
      }
    });
  }

  docAct() {
    if (this.m_oficio_gestion) {
      if (this.m_oficio_gestion.statusOf == 'ENVIADO') {
        this.alert(
          'warning',
          'El oficio ya esta enviado no pude ser actualizado',
          ''
        );
        return;
      }

      // this.getDocsParaDictum(this.docOficioGesti.cveDocument)
      this.data2 = [];
      this.openModalDoc();
    }
  }

  openModalDoc(context?: Partial<DocsComponent>) {
    const modalRef = this.modalService.show(DocsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.dataDocs.subscribe((next: any) => {
      // console.log('asda', next);
      this.data2 = next;
    });
  }

  async enviarD() {
    // if (this.oficioDictamen && this.dictamen) {
    let V_NO_OF_DICTA = this.dictamen.id;
    let V_TIPO_DICTA = this.dictamen.typeDict;
    let ANIO: string;
    let ANIONEW: string;
    let V_TRANS: any;
    let V_RESP: any;
    let OFICIO: any;
    const cadena = this.dictamen.passOfficeArmy;
    const elemento = '?';
    const contieneElemento = cadena.includes(elemento);
    if (this.oficioDictamen.statusOf == null && contieneElemento == true) {
      let sender: any = this.declarationForm.get('sender').value;
      if (sender == null || sender == '') {
        this.alert(
          'warning',
          'Debe especificar quien autoriza la declaratoria',
          ''
        );
        return;
      }

      let destinatario: any = this.declarationForm.get('recipient').value;
      if (destinatario == null || destinatario == '') {
        this.alert('warning', 'Debe especificar el destinatario', '');
        return;
      }

      let delegacionregUser = this.delegation;
      if (this.dictamen.delegationDictNumber != delegacionregUser) {
        this.alert(
          'warning',
          'No puede dar candado una Coordinación diferente a la que ingreso la declaratoria.',
          ''
        );
        return;
      }

      V_NO_OF_DICTA = this.dictamen.id;
      V_TIPO_DICTA = this.dictamen.typeDict;

      let clave_oficio_armada = this.dictamen.passOfficeArmy;
      ANIO = clave_oficio_armada.substring(
        clave_oficio_armada.lastIndexOf('/') + 1,
        clave_oficio_armada.length
      );
      ANIONEW = new Date().getFullYear().toString();
      // ANIO:= SUBSTR(: DICTAMINACIONES.CLAVE_OFICIO_ARMADA, INSTR(: DICTAMINACIONES.CLAVE_OFICIO_ARMADA, '/', -1) + 1, LENGTH(: DICTAMINACIONES.CLAVE_OFICIO_ARMADA) - INSTR(: DICTAMINACIONES.CLAVE_OFICIO_ARMADA, '/', -1));
      // ANIONEW:= TO_CHAR(SYSDATE, 'YYYY');

      //   SET_BLOCK_PROPERTY('DICTAMINACIONES', UPDATE_ALLOWED, PROPERTY_TRUE);
      //   GO_BLOCK('DICTAMINACIONES');
      //   SET_BLOCK_PROPERTY('DICTAMINACIONES', DEFAULT_WHERE, 'NO_OF_DICTA=' || TO_CHAR(V_NO_OF_DICTA) || ' AND TIPO_DICTAMINACION = ''' || V_TIPO_DICTA || '''');
      //   EXECUTE_QUERY(NO_VALIDATE);
      //   SET_BLOCK_PROPERTY('DICTAMINACIONES', DEFAULT_WHERE, '');
      // : OFICIO_DICTAMEN.TEXTOP := : OFICIO_DICTAMEN.TEXTO2 ||: OFICIO_DICTAMEN.TEXTO2_A ||: OFICIO_DICTAMEN.TEXTO3;
      // : DICTAMINACIONES.FEC_DICTAMINACION := TRUNC(SYSDATE);
      this.formDeclaratoriapageFin
        .get('fin')
        .setValue(
          this.oficioDictamen.text2 +
            this.oficioDictamen.text2To +
            this.oficioDictamen.text3
        );

      const now = new Date(); // Obtiene la fecha y hora actual
      const truncatedDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const year = today.getFullYear();
      const SYSDATE = `${year}-${month}-${day}`;

      this.dictDate3 = SYSDATE;
      this.dictamen.dictDate = new Date(SYSDATE);

      console.log('ANIO', ANIO);
      console.log('ANIONEW', ANIONEW);
      // ********************************************************** //
      if (ANIO == ANIONEW) {
        let obj1 = {
          expedientNumber: this.dictamen.expedientNumber,
          year: ANIONEW,
          dictationNumber: this.dictamen.id,
          delegationDictamNumber: 0,
        };

        console.log('obj', obj1);

        V_TRANS = await this.dictaminacionesConsulta1(obj1);

        console.log('V_TRANS1', V_TRANS);
      } else {
        let obj1 = {
          expedientNumber: this.dictamen.expedientNumber,
          year: ANIO,
          dictationNumber: this.dictamen.id,
          delegationDictamNumber: 0,
        };
        console.log('obj1', obj1);
        V_TRANS = await this.dictaminacionesConsulta1(obj1);
        console.log('V_TRANS2', V_TRANS);
      }
      // ********************************************************** //
      if (V_TRANS == null) {
        V_TRANS = 0;
      }
      V_RESP = V_TRANS;
      // ********************************************************** //
      if (ANIO == ANIONEW) {
        let obj1 = {
          expedientNumber: this.dictamen.expedientNumber,
          year: ANIONEW,
          dictationNumber: this.dictamen.id,
          delegationDictamNumber: 0,
        };
        V_TRANS = await this.dictaminacionesConsulta2(obj1);
        console.log('V_TRANS111', V_TRANS);
      } else {
        let obj1 = {
          expedientNumber: this.dictamen.expedientNumber,
          year: ANIO,
          dictationNumber: this.dictamen.id,
          delegationDictamNumber: 0,
        };
        V_TRANS = await this.dictaminacionesConsulta2(obj1);
        console.log();
      }
      // ********************************************************** //
      if (V_TRANS == null) {
        V_TRANS = V_RESP;
      }
      // ********************************************************** //
      if (V_TRANS == 1) {
        console.log('SIIII1');
        OFICIO = await this.dictaminacionesConsulta3(ANIONEW, 0);
        console.log('SIIII1 OFICIO', OFICIO);
        // PUP_VALEXISTS_DICT
        let pupExisDict1: string = `${
          this.SiglasNivel2
        }/ABANDONO/PGR/${OFICIO.toString().padStart(5, '0')}/${ANIONEW}`;
        let obj_1 = {
          typeDict: 'ABANDONO',
          clave_oficio_armada: pupExisDict1,
          noDelegation: this.delegation,
        };

        let V_EXIST_DICTA: any;
        V_EXIST_DICTA = await this.getValexisDict(obj_1);

        if (V_EXIST_DICTA > 0) {
          this.alert(
            'error',
            'La Clave del Dictamen ya existe, volver a intentar.',
            ''
          );
          return;
        } else {
          let pupExisDict2: string = `${
            this.SiglasNivel2
          }/ABANDONO/FGR/${OFICIO.toString().padStart(5, '0')}/${ANIONEW}`;

          let obj_2 = {
            typeDict: 'ABANDONO',
            clave_oficio_armada: pupExisDict2,
            noDelegation: this.delegation,
          };

          V_EXIST_DICTA = await this.getValexisDict(obj_2);
          if (V_EXIST_DICTA > 0) {
            this.alert(
              'error',
              'La Clave del Dictamen ya existe, volver a intentar.',
              ''
            );
          }
        }

        this.declarationForm
          .get('passOfficeArmy')
          .setValue(
            `${this.SiglasNivel2}/ABANDONO/FGR/${OFICIO.toString().padStart(
              5,
              '0'
            )}/${ANIONEW}`
          );
        this.dictamen.passOfficeArmy = `${
          this.SiglasNivel2
        }/ABANDONO/FGR/${OFICIO.toString().padStart(5, '0')}/${ANIONEW}`;

        // : DICTAMINACIONES.CLAVE_OFICIO_ARMADA :='DEBM/ABANDONO/FGR/' || LTRIM(TO_CHAR(OFICIO, '00000')) || '/' || ANIONEW;
      } else if (V_TRANS == 2) {
        console.log('SIIII2');

        OFICIO = await this.dictaminacionesConsulta5(ANIONEW, 0);
        console.log('SIIII2 OFICIO', OFICIO);
        let pupExisDict3: string = `${
          this.SiglasNivel2
        }/ABANDONO/PJF/${OFICIO.toString().padStart(5, '0')}/${ANIONEW}`;
        let obj_3 = {
          typeDict: 'ABANDONO',
          clave_oficio_armada: pupExisDict3,
          noDelegation: this.delegation,
        };
        let V_EXIST_DICTA: any;
        V_EXIST_DICTA = await this.getValexisDict(obj_3);

        if (V_EXIST_DICTA > 0) {
          this.alert(
            'error',
            'La Clave del Dictamen ya existe, volver a intentar.',
            ''
          );
          return;
        }

        this.declarationForm
          .get('passOfficeArmy')
          .setValue(
            `${this.SiglasNivel2}/ABANDONO/PJF/${OFICIO.toString().padStart(
              5,
              '0'
            )}/${ANIONEW}`
          );
        this.dictamen.passOfficeArmy = `${
          this.SiglasNivel2
        }/ABANDONO/PJF/${OFICIO.toString().padStart(5, '0')}/${ANIONEW}`;
      } else {
        console.log('SIIII3');
        OFICIO = await this.dictaminacionesConsulta4(ANIONEW, 0);
        console.log('SIIII3 OFICIO', OFICIO);
        let pupExisDict3: string = `${
          this.SiglasNivel2
        }/ABANDONO/PJF/${OFICIO.toString().padStart(5, '0')}/${ANIONEW}`;
        let obj_3 = {
          typeDict: 'ABANDONO',
          clave_oficio_armada: pupExisDict3,
          noDelegation: this.delegation,
        };
        let V_EXIST_DICTA: any;
        V_EXIST_DICTA = await this.getValexisDict(obj_3);
        console.log('SIIII3 V_EXIST_DICTA', V_EXIST_DICTA);
        if (V_EXIST_DICTA > 0) {
          this.alert(
            'error',
            'La Clave del Dictamen ya existe, volver a intentar.',
            ''
          );
          return;
        }

        this.declarationForm
          .get('passOfficeArmy')
          .setValue(
            `${this.SiglasNivel2}/ABANDONO/${OFICIO.toString().padStart(
              5,
              '0'
            )}/${ANIONEW}`
          );
        this.dictamen.passOfficeArmy = `${
          this.SiglasNivel2
        }/ABANDONO/${OFICIO.toString().padStart(5, '0')}/${ANIONEW}`;
      }
      // ********************************************************** //

      this.dictamen.keyArmyNumber = OFICIO;
      this.oficioDictamen.statusOf = 'ENVIADO';
      this.oficioDictamen.text1 =
        this.formDeclaratoriapageFin.get('page').value;

      await this.updateDictamen(this.dictamen);
      await this.updateOficioDictamen(this.oficioDictamen);

      await this.agregarDictamen();
      // LIP_COMMIT_SILENCIOSO;
      this.disabledIMPRIMIR = true;
      this.disbaledAPROBAR = false;
      this.disabledTIPO_OFICIO = false;

      // GO_BLOCK('BIENES');
      // FIRST_RECORD;

      // GO_BLOCK('DICTAMINACION_X_BIEN1');
      // FIRST_RECORD;
      // for (let i = 0; i < this.selectedGood.length; i++) {
      // let result = this.selectedGood.map(async item => {

      const dictamenXGood1: any = await this.getDictaXGood1Send(
        this.dictamen.id,
        'ABANDONO'
      );
      console.log('dictamenXGood1', dictamenXGood1);
      if (dictamenXGood1 != null) {
        let result = dictamenXGood1.map(async (item: any) => {
          if (item.id != null) {
            let obj = {
              pVcScreem: 'FACTJURABANDONOS',
              pGoodNumber: item.id,
            };

            const arrayGoodScreen: any = await this.getGoodScreenSend(obj);
            console.log('arrayGoodScreen', arrayGoodScreen);
            // for (let i = 0; i < arrayGoodScreen.length; i++) {

            if (arrayGoodScreen.estatus_final != null) {
              console.log(
                'AQUI ',
                arrayGoodScreen.tipo_dictaminacion + '   ABANDONO'
              );
              if (arrayGoodScreen.tipo_dictaminacion == 'ABANDONO') {
                console.log('AQUI ESTOY');
                // VAL_BN_NSBDDB:= FN_VALBIEN_NSBDDB(: DICTAMINACION_X_BIEN1.NO_BIEN);
                let VAL_BN_NSBDDB = 1;
                if (VAL_BN_NSBDDB == 1) {
                  let obj = {
                    id: item.id,
                    goodId: item.id,
                    extDomProcess: 'ABANDONO',
                    status: arrayGoodScreen.estatus_final,
                  };
                  // UPDATE BIENES //
                  this.updateBienesSendBtn(obj, 1);

                  const historyGood: IHistoryGood = {
                    propertyNum: item.id,
                    status: arrayGoodScreen.estatus_final,
                    changeDate: new Date(),
                    userChange: this.token.decodeToken().preferred_username,
                    statusChangeProgram: 'FACTJURABANDONOS',
                    reasonForChange: 'Automático',
                    registryNum: null,
                    extDomProcess: 'ABANDONO',
                  };
                  // INSERT HISTORY GOOD
                  this.insertHistoryGood(historyGood);
                } else {
                  // V_ETIQUETA:= FA_ETIQUETA_DEST(REG.TIPO_DICTAMINACION);
                  let objLabel = {
                    typeDicta: arrayGoodScreen.tipo_dictaminacion,
                  };
                  let V_ETIQUETA: any = await this.getFaFlagDest_(objLabel);
                  let obj = {
                    id: item.id,
                    goodId: item.id,
                    extDomProcess: 'ABANDONO',
                    status: arrayGoodScreen.estatus_final,
                    labelNumber: V_ETIQUETA,
                  };
                  // UPDATE BIENES //
                  this.updateBienesSendBtn(obj, 2);

                  const historyGood: IHistoryGood = {
                    propertyNum: item.id,
                    status: arrayGoodScreen.estatus_final,
                    changeDate: new Date(),
                    userChange: this.token.decodeToken().preferred_username,
                    statusChangeProgram: 'FACTJURABANDONOS',
                    reasonForChange: 'Automático',
                    registryNum: null,
                    extDomProcess: 'ABANDONO',
                  };
                  // INSERT HISTORY GOOD
                  this.insertHistoryGood(historyGood);
                }
              } else {
                let obj = {
                  id: item.id,
                  goodId: item.id,
                  extDomProcess: arrayGoodScreen.proceso_ext_dom,
                  status: arrayGoodScreen.estatus_final,
                };
                console.log('UPDATE BIENES', obj);
                // UPDATE BIENES //
                this.updateBienesSendBtn(obj, 3);

                const historyGood: IHistoryGood = {
                  propertyNum: item.id,
                  status: arrayGoodScreen.estatus_final,
                  changeDate: new Date(),
                  userChange: this.token.decodeToken().preferred_username,
                  statusChangeProgram: 'FACTJURABANDONOS',
                  reasonForChange: 'Automático',
                  registryNum: null,
                  extDomProcess: arrayGoodScreen.proceso_ext_dom,
                };
                // INSERT HISTORY GOOD
                this.insertHistoryGood(historyGood);
              }
            }
            // }
          }
        });

        Promise.all(result).then(async (resp: any) => {
          await this.onLoadGoodList('all');
          await this.generar_ofic_dict(this.dictamen);
          this.formDeclaratoriapageFin
            .get('fin')
            .setValue(
              this.oficioDictamen.text2 +
                this.oficioDictamen.text2To +
                this.oficioDictamen.text3
            );
          this.loading = false;
        });
      }
      // });

      this.lockStatus = false;
      //PUP_OFIC_DICT
    } else {
      this.alert('info', 'La declaratoria ya ha sido enviada', '');
    }
    // } else {
    //   this.alert('warning', 'Debe seleccionar un dictamen y/o oficio dictamen', '')
    // }
  }

  async obtenerMaximo(array: any) {
    return array.reduce(
      (max: any, obj: any) =>
        obj.keyArmyNumber > max.keyArmyNumber ? obj : max,
      array[0]
    );
  }

  getFaFlagDest_(objLabel: any) {
    return new Promise((resolve, reject) => {
      this.dictationService.getFaFlagDest(objLabel).subscribe({
        next: (rep: any) => {
          if (rep.data) {
            resolve(rep.data[0].flag);
          } else {
            resolve(rep.data[0]);
          }

          this.loading = false;
        },
        error: error => {
          console.log('ERR', error.error.message);
          resolve(null);
          this.loading = false;
        },
      });
    });
  }
  getGoodScreenSend(data: any) {
    return new Promise((resolve, reject) => {
      this.goodprocessService.getGoodScreenSend(data).subscribe({
        next: (rep: any) => {
          resolve(rep.data[0]);
          this.loading = false;
        },
        error: error => {
          console.log('ERR', error.error.message);
          resolve(null);
          this.loading = false;
        },
      });
    });
  }

  // CONSULTA 1 - DICTAMINACIONES //
  async dictaminacionesConsulta1(data: any) {
    return new Promise((resolve, reject) => {
      this.dictationService.sendGetOfficeByYear(data).subscribe({
        next: (data: any) => {
          resolve(data.exists);
          this.loading = false;
        },
        error: error => {
          console.log('ERR', error.error.message);
          resolve(null);
          this.loading = false;
        },
      });
    });
  }

  // CONSULTA 2 - DICTAMINACIONES // ESPERANDO POR ENDPOINT
  async dictaminacionesConsulta2(data: any) {
    return new Promise((resolve, reject) => {
      this.dictationService.sendGetOfficeByYear2(data).subscribe({
        next: data => {
          // this.dictamenes = data.data;
          this.loading = false;
          resolve(data.exists);
        },
        error: error => {
          this.loading = false;
          console.log('ERR', error);
          resolve(null);
        },
      });
    });
  }

  // CONSULTA 3 - DICTAMINACIONES //
  async dictaminacionesConsulta3(year: any, delegation: any) {
    return new Promise((resolve, reject) => {
      this.dictationService.sendConsulta2(year, delegation).subscribe({
        next: (data: any) => {
          resolve(data.office);
          this.loading = false;
        },
        error: error => {
          console.log('ERR', error.error.message);
          resolve(1);
          this.loading = false;
        },
      });
    });
  }

  // CONSULTA 4 - DICTAMINACIONES //
  async dictaminacionesConsulta4(year: any, delegation: any) {
    return new Promise((resolve, reject) => {
      this.dictationService.sendConsulta1(year, delegation).subscribe({
        next: (data: any) => {
          this.loading = false;
          resolve(data.office);
        },
        error: error => {
          this.loading = false;
          console.log('ERR', error);
          resolve(1);
        },
      });
    });
  }

  // CONSULTA 5 - DICTAMINACIONES //
  async dictaminacionesConsulta5(year: any, delegation: any) {
    return new Promise((resolve, reject) => {
      this.dictationService.sendConsulta3(year, delegation).subscribe({
        next: (data: any) => {
          resolve(data.office);
          this.loading = false;
        },
        error: error => {
          console.log('ERR', error.error.message);
          resolve(1);
          this.loading = false;
        },
      });
    });
  }

  // DICTAMINACION_X_BIEN1
  getDictaXGood1_(id: any, type: string) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    params['filter.typeDict'] = `$eq:${type}`;
    return new Promise((resolve, reject) => {
      this.DictationXGood1Service.getAll(params).subscribe({
        next: (resp: any) => {
          const data = resp.data[0];
          this.dictamenesXBien1 = resp.data;
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

  // PUP_VALEXISTS_DICT
  async getValexisDict(data: any) {
    return new Promise((resolve, reject) => {
      const params = new FilterParams();
      params.addFilter('typeDict', data.typeDict, SearchFilter.EQ);
      params.addFilter(
        'passOfficeArmy',
        data.clave_oficio_armada,
        SearchFilter.ILIKE
      );
      params.addFilter(
        'delegationDictNumber',
        data.noDelegation,
        SearchFilter.EQ
      );
      this.fileUpdateService.getDictation(params.getParams()).subscribe({
        next: data => {
          console.log(data, 'WILL');
          resolve(data.count);
        },
        error: error => {
          resolve(0);
        },
      });
    });
  }

  async updateBienesSendBtn(body: any, n: any) {
    console.log('BODY UPDATE', body);
    this.goodServices.updateWithParams(body).subscribe({
      next: (resp: any) => {
        console.log('UPDATE111', resp);
        this.loading = false;
      },
      error: error => {
        this.V_VAL_ELIM = 1;
        if (n == 1) {
          this.onLoadToast(
            'error',
            'ERROR AL ACTUALIZAR ESTATUS DEL BIEN PROVENIENTE DEL NSBDDB:',
            ''
          );
        } else if (n == 2) {
          this.onLoadToast(
            'error',
            'ERROR AL ACTUALIZAR ESTATUS DEL BIEN:',
            ''
          );
        } else if (n == 3) {
          this.onLoadToast(
            'error',
            'ERROR 2 AL ACTUALIZAR ESTATUS DEL BIEN:',
            ''
          );
        }
        this.loading = false;
      },
    });
  }

  async insertHistoryGood(data: any) {
    this.historyGoodService.create(data).subscribe({
      next: response => {
        console.log('BIEN', response);
      },
      error: error => {
        console.log('error', error.error.message, 'Inserción HistoryGood');
        this.loading = false;
      },
    });
  }

  listDictums() {
    this.openModalDictums({ noVolante_: this.noVolante_ });
  }

  openModalDictums(context?: Partial<ListdictumsComponent>) {
    const modalRef = this.modalService.show(ListdictumsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.dataText.subscribe(async (next: any) => {
      console.log('NEXT', next);
      await this.checkDictum(next.data.id, 'id');
      // await this.checkDictum_(this.noVolante_, 'all');
    });
  }

  async newDictums() {
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
    this.lockStatus = true;
    this.disabledDictum = true;
    this.disabledTIPO_OFICIO = true;
    this.disbaledAPROBAR = true;
    this.disabledENVIAR = false;
    this.folioEscaneoNg = '';
    this.dictDate3 = '';
    this.formFolioEscaneo.get('folioEscaneo').setValue('');
    this.declarationForm.get('passOfficeArmy').setValue('');
    this.declarationForm.get('recipient').setValue(null);
    this.formDeclaratoriapageFin.get('page').setValue('');
    this.formDeclaratoriapageFin.get('fin').setValue('');

    const paramsSender: any = new ListParams();
    paramsSender.text = this.token.decodeToken().preferred_username;
    await this.getSenders2(paramsSender);
    await this.getCities_(266);
    this.loading = false;
    console.log('AQUIIIIIIII', this.dictamen);
  }

  async newMOficioG() {
    this.m_oficio_gestion = {
      flyerNumber: null,
      proceedingsNumber: null,
      cveManagement: null,
      managementNumber: null,
      sender: null,
      delRemNumber: null,
      depRemNumber: null,
      addressee: null,
      city: null,
      text1: null,
      text2: null,
      statusOf: null,
      insertUser: null,
      areaUser: null,
      deleUser: null,
      insertDate: null,
      jobType: null,
      nomPersExt: null,
      refersTo: null,
      jobBy: null,
      recordNumber: null,
      armedKeyNumber: null,
      desSenderpa: null,
      text3: null,
      insertHcDate: null,
      projectDate: null,
      description: null,
      problematiclegal: null,
      cveChargeRem: null,
      justification: null,
    };

    this.disabledBtnDelete = true;
    this.disabledDocs = true;
    this.disabledMOficGest = true;
    this.disabledMOficGest = true;
    this.btnOficion = true;
    this.data2 = [];
    this.copyOficio = [];
    this.no_OficioGestion = '';
    this.formOficio.get('oficio').setValue('');
    this.formOficiopageFin.get('page').setValue('');
    this.formOficiopageFin.get('fin').setValue('');
    this.formOficio.get('remitente').setValue(null);
    this.formOficio.get('destinatario').setValue('');
    this.cveManagement = '';
    this.dateCapture2 = '';
    this.statusOfMOficioGestion = '';
    this.formCcpOficio.get('ccp').setValue(null);
    this.formCcpOficio.get('ccp2').setValue(null);
    this.formCcpOficio.get('nombreUsuario').setValue(null);
    this.formCcpOficio.get('nombreUsuario2').setValue(null);
    this.getCities__(266);
  }

  listMOficiosG() {
    this.openModalOficios({ noVolante_: this.noVolante_ });
  }

  openModalOficios(context?: Partial<ListoficiosComponent>) {
    const modalRef = this.modalService.show(ListoficiosComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.dataText.subscribe(async (next: any) => {
      console.log('NEXT', next);
      await this.getMOficioGestion(next.data.managementNumber, 2);
      // await this.checkDictum_(this.noVolante_, 'all');
    });
  }

  usuariosCCP(obj: any) {
    return {
      id: obj.id,
      managementNumber: obj.managementNumber,
      addresseeCopy: obj.addresseeCopy,
      delDestinationCopyNumber: obj.delDestinationCopyNumber,
      nomPersonExt: obj.nomPersonExt,
      personExtInt: obj.personExtInt == 'I' ? 'INTERNO' : 'EXTERNO',
      recordNumber: obj.recordNumber,
      userOrPerson: obj.userOrPerson,
    };
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
          this.loading = false;
        });

        console.log('COPYYYY', resp);
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

  async getSenders2OfiM(params: ListParams) {
    params['filter.user'] = `$eq:${params.text}`;
    this.securityService.getAllUsersTracker(params).subscribe(
      async (data: any) => {
        console.log('COPYY3', data);

        let result = data.data.map(async (item: any) => {
          item['userAndName'] = item.user + ' - ' + item.name;
        });

        this.formCcpOficio
          .get('nombreUsuario')
          .setValue(data.data[0].userAndName);

        this.loading = false;
        // });
      },
      error => {
        this.senders = new DefaultSelect();
      }
    );
  }
  showDeleteAlert(event: any) {
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
  // CREAR C.P.P. //
  openModalCopy(data: boolean) {
    this.openForm({
      dataEdit: data,
      managementNumber: this.m_oficio_gestion.managementNumber,
    });
  }
  openForm(context?: Partial<AddCopyComponent>) {
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
      this.getCopyOficioGestion__(this.m_oficio_gestion.managementNumber);
    });
  }

  openModalCopyUpdate(data: any) {
    console.log(data);
    this.openFormUpdate({ dataEdit: data }, data);
  }
  openFormUpdate(context?: Partial<UpdateCopyComponent>, data?: any) {
    const modalRef = this.modalService.show(UpdateCopyComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.dataCopy.subscribe((next: any) => {
      console.log('next', next);
      console.log('NEXX', data);

      for (let i = 0; i < this.copyOficio.length; i++) {
        if (next.id == undefined) {
        } else {
        }
      }
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
  }
}
