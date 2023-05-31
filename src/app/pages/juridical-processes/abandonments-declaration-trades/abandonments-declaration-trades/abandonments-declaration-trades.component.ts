/** BASE IMPORT */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
import { COLUMNS_BIENES, COLUMNS_DOCUMENTS } from './columns';
import { DocsComponent } from './docs/docs.component';
import { EditTextComponent } from './edit-text/edit-text.component';
import {
  IDictationTemp,
  IDictationXGood1Temp,
  IMJobManagementTemp,
  IOficialDictationTemp,
} from './models';
import { TEXTOS } from './textos';
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
  texto1: string = '';

  disabledIMPRIMIR: boolean = false;
  disabledTIPO_OFICIO: boolean = true;
  disbaledAPROBAR: boolean = true;
  disabledENVIAR: boolean = false;

  totalItems: number = 0;
  items = new DefaultSelect<any>();
  lockStatus: boolean = false;
  valTiposAll: boolean;
  loadingText: string = '';

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

  // OFICIO DICTAMEN //
  oficioDictamen: IOfficialDictation;
  statusOfOficio: any = '';
  oficioDictamenUpdate: boolean = false;

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
    private parametersService: ParametersService
  ) {
    super();

    this.dictamen = IDictationTemp;
    this.oficioDictamen = IOficialDictationTemp;
    this.dictamenXGood1 = IDictationXGood1Temp;
    this.m_oficio_gestion = IMJobManagementTemp;
    this.dictamenXGood1Null = IDictationXGood1Temp;

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

    this.settings1.rowClassFunction = (row: any) => {
      if (row.data.est_disponible == 'S') {
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
            this.disabledTIPO_OFICIO = true;
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
    this.prepareForm();
    this.disabledENVIAR = false;
    this.valTiposAll = false;
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => this.onLoadGoodList('all'))
      )
      .subscribe();

    // OBTENEMOS DELEGACIÓN DEL USUARIO //
    const paramsSender = new ListParams();
    paramsSender.text = this.token.decodeToken().preferred_username;
    this.get___Senders(paramsSender);
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

    this.loading = false;
  }

  selectProceedings(event: IUserRowSelectEvent<IGood>) {
    console.log('EVENT', event);
    // let dataGood: any = event.data;
    // let oficeType = this.declarationForm.get('officeType').value;
    // if (oficeType == null || oficeType == '') {
    //   this.alert('warning', 'Debe ingresar el Tipo de Oficio.', '')
    //   return;
    // }

    // if (this.oficioDictamen.statusOf == 'ENVIADO') {
    //   this.alert('warning', 'Este dictamen ya está enviado.', '')
    //   return;
    // }

    // if (dataGood.est_disponible == 'N') {
    //   if (this.dictamen.id == null) {
    //     dataGood.SELECCIONAR = dataGood.SEL_AUX;
    //   } else if (this.dictamen.id != dataGood.no_of_dicta) {
    //     dataGood.SELECCIONAR = dataGood.SEL_AUX;
    //   }
    //   // IF: DICTAMINACIONES.NO_OF_DICTA IS NULL THEN
    //   // : BIENES.SELECCIONAR := : BIENES.SEL_AUX;
    //   // ELSIF: DICTAMINACIONES.NO_OF_DICTA <> NVL(: BIENES.NO_OF_DICTA, -1) THEN
    //   // : BIENES.SELECCIONAR := : BIENES.SEL_AUX;
    //   // END IF;
    //   return;
    // }
    // if (dataGood.SELECCIONAR != dataGood.SEL_AUX ){

    // }

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
    await this.onLoadGoodList('all');
    await this.validDesahogo(data);
    await this.checkDictum(data);
    await this.getExpediente(data.expedientNumber);
    await this.getMOficioGestion(data.wheelNumber);
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
  }

  getSenders(params: ListParams) {
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

  getSenders2(params: ListParams) {
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
      params.addFilter('idCity', lparams.text, SearchFilter.EQ);
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
      params.addFilter('idCity', lparams.text, SearchFilter.EQ);
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
    params['filter.status'] = `$in:ADM,DXV`;

    if (filter != 'all') {
      params['filter.goodClassNumber'] = `$eq:${filter}`;
    }

    this.goodServices.getByExpedientAndParams(params).subscribe({
      next: response => {
        let result = response.data.map(async (item: any) => {
          item['SELECCIONAR'] = 0;
          item['SEL_AUX'] = 0;
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

        console.log('GOODS OBTENIDOS', response);

        this.getStatusGood('ADM');
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
          this.declarationForm
            .get('preliminaryInquiry')
            .setValue(data.preliminaryInquiry);
          this.declarationForm.get('criminalCase').setValue(data.criminalCase);
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
        LIC. JORGE F. GIL RODRÍGUEZ'

        COORDINADOR DE DESTINO DE BIENES MUEBLES'

        Hago referencia al numerario que a continuación se menciona:
        
      `;
      this.formDeclaratoriapageFin.get('page').setValue(text1);
      this.formDeclaratoriapageFin
        .get('fin')
        .setValue(TEXTOS.returnText2_PGR() + '');
    } else {
      let text1 = `  
        LIC. JORGE F. GIL RODRÍGUEZ'

        COORDINADOR DE DESTINO DE BIENES MUEBLES'

        Hago referencia al numerario que a continuación se menciona:
        
      `;
      this.formDeclaratoriapageFin.get('page').setValue(text1);
      // VERIFICAR SI EL TEXTO DEL DEL STATUS PGR SON LOS MISMOS QUE LOS DEMÁS //
      this.formDeclaratoriapageFin
        .get('fin')
        .setValue(TEXTOS.returnText2_PGR() + '');
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
  async checkDictum(data: any) {
    const params = new FilterParams();
    params.addFilter('wheelNumber', data.wheelNumber);
    this.fileUpdateService.getDictation(params.getParams()).subscribe({
      next: data => {
        this.dictamenes = data.data;
        this.dictamen = data.data[0];

        if (this.dictamen.statusDict == null) {
          this.disabledTIPO_OFICIO = true;
          this.disbaledAPROBAR = true;
          this.disabledENVIAR = false;
          this.disabledIMPRIMIR = false;

          this.getCities_(266);
        } else {
          this.disabledTIPO_OFICIO = false;
          this.disbaledAPROBAR = false;
          this.disabledENVIAR = true;
          this.disabledIMPRIMIR = true;
        }
        this.declarationForm
          .get('passOfficeArmy')
          .setValue(data.data[0].passOfficeArmy);
        this.cveoficio_Oficio = data.data[0].passOfficeArmy;
        this.getOficioDictamen(this.dictamen);
        this.getDictationXGood1Service(this.dictamen);
        // this.VtypeGood(this.dictamen);
        console.log('DATA DICTAMENES', data);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        // this.onLoadToast(
        //   'warning',
        //   'DICTÁMENES',
        //   'El volante no tiene dictámenes asignados'
        // );
        const paramsSender: any = new ListParams();
        paramsSender.text = this.token.decodeToken().preferred_username;
        this.getSenders2(paramsSender);
        this.getCities_(266);
        this.dictamenes = [];
        console.log('ERR', error);
      },
    });
  }
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

        if (this.oficioDictamen) {
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
        }
        if (this.oficioDictamen.statusOf == 'ENVIADO') {
          this.lockStatus = false;
        } else {
          this.lockStatus = true;
        }

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
        const paramsSender: any = new ListParams();
        paramsSender.text = this.token.decodeToken().preferred_username;
        this.getSenders2(paramsSender);

        const paramsCity: any = new ListParams();
        paramsCity.text = 266;
        this.getCities_(266);

        // this.alert(
        //   'warning',
        //   'OFICIO DE DICTÁMENES',
        //   'No se encontraron oficio de dictámenes'
        // );
        this.loading = false;
      },
    });
  }

  getCities_(idCity: any) {
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

  generarFolioEscaneo() {
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
      numberProceedings: this.selectedRow.expedientNumber,
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
      flyerNumber: this.selectedRow.wheelNumber,
    };

    this.documentsService.create(obj).subscribe({
      next: (data: any) => {
        console.log('DOCUMENTS', data);
        // :DICTAMINACIONES.FOLIO_UNIVERSAL
        // let txt = data.id + ''
        this.folioEscaneoNg = data.id;
        this.dictamen.folioUniversal = data.id;
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
    // alert('SI');
    this.selectedRow = null;
    const route = `pages/general-processes/scan-request/scan`;
    this.router.navigate([route]);
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

  aprobar() {
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
    console.log('AQUI', this.dictamen);
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

    // if (this.dictamen) {
    if (this.dictamen.id == null) {
      this.loading = false;

      console.log('NEXTO', this.dictamen);

      this.dictamen.typeDict = 'ABANDONO';
      this.tipoOficio = this.declarationForm.get('officeType').value;

      if (this.tipoOficio == 'FGR') {
        this.dictamen.passOfficeArmy = 'DEBM/ABANDONO/FGR' + '/?/' + anioActual;
        this.declarationForm
          .get('passOfficeArmy')
          .setValue(this.dictamen.passOfficeArmy);
      } else if (this.tipoOficio == 'PJF') {
        this.dictamen.passOfficeArmy = 'DEBM/ABANDONO/PJF' + '/?/' + anioActual;
        this.declarationForm
          .get('passOfficeArmy')
          .setValue(this.dictamen.passOfficeArmy);
      } else {
        this.dictamen.passOfficeArmy = 'DEBM/ABANDONO' + '/?/' + anioActual;
        this.declarationForm
          .get('passOfficeArmy')
          .setValue(this.dictamen.passOfficeArmy);
      }

      const today = new Date();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const year = today.getFullYear();
      const SYSDATE = `${month}-${day}-${year}`;

      this.dictamen.statusDict = 'DICTAMINADO';
      this.dictamen.expedientNumber = this.idExpediente;
      this.dictamen.wheelNumber = this.noVolante_;
      this.dictamen.userDict = this.token.decodeToken().preferred_username;
      this.dictamen.delegationDictNumber = this.delegation;
      this.dictamen.areaDict = 914;
      this.dictamen.dictDate = new Date(SYSDATE);
      this.dictDate2 = SYSDATE;
      this.dictamen.instructorDate = new Date(SYSDATE);
      this.dictamen.notifyAssuranceDate = new Date(SYSDATE);
      this.dictamen.resolutionDate = new Date(SYSDATE);
      this.dictamen.notifyResolutionDate = new Date(SYSDATE);

      this.dictationService.create(this.dictamen).subscribe({
        next: (data: any) => {
          this.dictamen.id = data.id;
          console.log('DICTA', data);
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
    }
    // }

    if (
      this.formDeclaratoriapageFin.get('fin').value != null ||
      this.formDeclaratoriapageFin.get('fin').value != ''
    ) {
      let textP = this.formDeclaratoriapageFin.get('fin').value;
      this.oficioDictamen.text2 = textP.substring(1, 4000);
      this.oficioDictamen.text2To = textP.substring(4001, 4000);
      this.oficioDictamen.text3 = textP.substring(8000, 4000);
    }

    console.log('SASD', this.dictamen);

    this.agregarDictamen();
    V_NO_OF_DICTA = this.dictamen.id;
    V_TIPO_DICTA = this.dictamen.typeDict;
    this.formDeclaratoriapageFin
      .get('fin')
      .setValue(
        this.oficioDictamen.text2 +
          this.oficioDictamen.text2To +
          this.oficioDictamen.text3
      );

    // V_NO_OF_DICTA:= : DICTAMINACIONES.NO_OF_DICTA;
    // V_TIPO_DICTA:= : DICTAMINACIONES.TIPO_DICTAMINACION;
    // SET_BLOCK_PROPERTY('DICTAMINACIONES', DEFAULT_WHERE, 'NO_OF_DICTA=' || TO_CHAR(V_NO_OF_DICTA) || ' AND TIPO_DICTAMINACION = ''' || V_TIPO_DICTA || '''');
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
  agregarDictamen() {
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
  imprimir() {
    console.log('AAS', this.oficioDictamen);
    // if (this.dictamen && this.oficioDictamen) {
    if (this.dictamen.id != null) {
      const cadena = this.dictamen.passOfficeArmy;
      const elemento = '?';
      const contieneElemento = cadena.includes(elemento);

      if (contieneElemento == true) {
        this.agregarDictamen();
      }

      const textP_: any = this.formDeclaratoriapageFin.get('fin').value;
      if (textP_ != null) {
        let textP = this.formDeclaratoriapageFin.get('fin').value;
        this.oficioDictamen.text2 = textP.substring(1, 4000);
        this.oficioDictamen.text2To = textP.substring(4001, 4000);
        this.oficioDictamen.text3 = textP.substring(8000, 4000);

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
        this.generar_ofic_dict(this.dictamen); //PUP_OFIC_DICT
        this.disabledENVIAR = true;
        this.formDeclaratoriapageFin
          .get('fin')
          .setValue(
            this.oficioDictamen.text2 +
              this.oficioDictamen.text2To +
              this.oficioDictamen.text3
          );
      }
    } else {
      this.alert('error', 'La declaratoria no ha sido aprobada', '');
    }
    // }
  }

  // PUP_OFIC_DICT
  generar_ofic_dict(data: any) {
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
        console.log('VTYPEGOOD', data);

        if (data.data[0]) {
          this.tipoBien = data.data[0].no_tipo;
        }
      },
      error: error => {
        this.onLoadToast('error', error.error.message, 'tabla: V_TIPO_BIEN');
        console.log(error.error);
      },
    });
  }

  getScreenStatus(good: any) {
    let obj = {
      identifier: good.identifier,
      estatus: good.status,
      vc_pantalla: 'FACTJURABANDONOS',
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

  // CAMBIAR ATRIBUTOS DE LOS CAMPOS DEL CCP1 //
  valInterno: boolean = false;
  ccpChange(event: any) {
    console.log('EVENT', event);
    if (event.target.value == 'INTERNO') {
      this.valInterno = true;
    } else if (event.target.value == 'EXTERNO') {
      this.valInterno = false;
    } else {
      return;
    }
  }
  // CAMBIAR ATRIBUTOS DE LOS CAMPOS DEL CCP2 //
  valInterno2: boolean = false;
  ccpChange2(event: any) {
    console.log('EVENT', event);
    if (event.target.value == 'INTERNO') {
      this.valInterno2 = true;
    } else if (event.target.value == 'EXTERNO') {
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
  async getMOficioGestion(wheelNumber: any) {
    let params = {
      ...this.params,
    };
    params['filter.flyerNumber'] = `$eq:${wheelNumber}`;
    this.mJobManagementService.getAll(params).subscribe({
      next: (resp: any) => {
        // this.updateOficioGestion = true;
        console.log('DATA JOG', resp);

        this.m_oficio_gestion = resp.data[0];
        this.dateCapture2 = this.m_oficio_gestion.insertDate;
        // this.m_oficio_gestion = resp.data[1];
        this.formOficio
          .get('oficio')
          .setValue(
            this.m_oficio_gestion.managementNumber
              ? this.m_oficio_gestion.managementNumber
              : ''
          );
        this.statusOfMOficioGestion = this.m_oficio_gestion.statusOf;
        this.cveManagement = this.m_oficio_gestion.cveManagement;

        this.formOficio
          .get('noVolante')
          .setValue(this.m_oficio_gestion.flyerNumber);
        this.formOficio
          .get('noExpediente')
          .setValue(this.m_oficio_gestion.proceedingsNumber);

        if (this.m_oficio_gestion.managementNumber == null) {
          this.alert(
            'error',
            'Error al obtener numero de oficio',
            'M_OFICIO_GESTION'
          );
          this.m_oficio_gestion.jobType = 'EXTERNO';
          this.m_oficio_gestion.jobBy = 'ABANDONO';
          this.m_oficio_gestion.city = '266';
          this.m_oficio_gestion.refersTo =
            'No se refiere a ningun bien asegurado, decomisado o abandonado';
          this.externoVal = true;
          this.formOficio.get('tipoOficio').setValue('EXTERNO');
          this.formOficio.get('oficioPor').setValue('ABANDONO');
          this.getCities__(266);
        } else {
          this.getDocOficioGestion(this.m_oficio_gestion.managementNumber);
          this.getCopyOficioGestion(this.m_oficio_gestion.managementNumber);
          this.formOficio
            .get('tipoOficio')
            .setValue(this.m_oficio_gestion.jobType);
          this.formOficio
            .get('oficioPor')
            .setValue(this.m_oficio_gestion.jobBy);

          this.getCities__(this.m_oficio_gestion.city);

          if (this.updateOficioGestion == false) {
            this.updateOficioGestion = true;
            this.formOficiopageFin
              .get('fin')
              .setValue(
                this.m_oficio_gestion.text2 + this.m_oficio_gestion.text3
              );
            this.updateOficioGestion = false;
          } else {
            this.formOficiopageFin
              .get('fin')
              .setValue(
                this.m_oficio_gestion.text2 + this.m_oficio_gestion.text3
              );
            this.updateOficioGestion = true;
          }
        }

        let textP = this.formOficiopageFin.get('fin').value;
        if (textP != '') {
          this.m_oficio_gestion.text2 = textP.substring(1, 4000);
          this.m_oficio_gestion.text3 = textP.substring(4001, 4000);
        }

        this.m_oficio_gestion.addressee = null;
        this.formOficio.get('destinatario').setValue(null);

        if (this.m_oficio_gestion.statusOf == 'ENVIADO') {
          this.disabledBTNs = false;
        } else {
          this.disabledBTNs = true;
        }
        this.loading = false;
      },
      error: error => {
        // if (error.error.message == 'No se encontrarón registros.') {
        // this.alert('error', error.error.message, 'tabla: M_OFICIO_GESTION');
        // }

        this.m_oficio_gestion.jobType = 'EXTERNO';
        this.m_oficio_gestion.jobBy = 'ABANDONO';
        this.m_oficio_gestion.city = '266';
        this.m_oficio_gestion.refersTo =
          'No se refiere a ningun bien asegurado, decomisado o abandonado';
        this.externoVal = true;
        this.formOficio.get('tipoOficio').setValue('EXTERNO');
        this.formOficio.get('oficioPor').setValue('ABANDONO');
        this.getCities__(266);

        this.formOficio.get('noVolante').setValue(this.noVolante_);
        this.formOficio.get('noExpediente').setValue(this.idExpediente);

        this.loading = false;
      },
    });
  }

  // DOCUM_OFICIO_GESTION //
  docOficioGesti: any;
  async getDocOficioGestion(managementNumber: any) {
    const params = new ListParams();
    params['filter.managementNumber'] = `$eq:${managementNumber}`;
    const doc_ = this.mJobManagementService
      .getDocOficioGestion(params)
      .subscribe({
        next: (resp: any) => {
          console.log('CORRRECTO', resp);

          this.docOficioGesti = resp.data[0];
          this.getDocsParaDictum(this.docOficioGesti.cveDocument);
          this.loading = false;
          return resp.count;
        },
        error: error => {
          console.log('MAL', error);
          this.loading = false;
          return 0;
        },
      });

    return doc_;
  }

  getDocsParaDictum(data: any) {
    const params = new ListParams();
    params['filter.key'] = `$eq:${data}`;
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

  getCopyOficioGestion(data: any) {}

  btnOficion: boolean = true;
  async oficio() {
    let city = this.formOficio.get('ciudad').value;

    if (this.m_oficio_gestion) {
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

      if (
        this.m_oficio_gestion.cveManagement == null &&
        this.m_oficio_gestion.managementNumber == null
      ) {
        // const nextValMOficioGestio = await this.getMOficioGestion__(1);
        // const _params = new ListParams()
        // _params['limit'] = 1;
        // this.mJobManagementService.getAll(_params).subscribe({
        //   next: resp => {
        let contNext = 9999999;

        // let contNext = parseInt(resp.data[0].managementNumber) + 1
        this.loading = false;

        this.m_oficio_gestion.managementNumber = contNext + '';
        this.m_oficio_gestion.cveManagement = `DCB/DEBM/CJBM/?/2023`;
        this.cveManagement = `DCB/DEBM/CJBM/?/2023`;
        this.m_oficio_gestion.statusOf = 'EN REVISION';
        this.statusOfMOficioGestion = 'EN REVISION';

        const createValMOficioGestio: any = await this.createMOficioGestion__(
          this.m_oficio_gestion
        );

        if (createValMOficioGestio) {
          let obj = {
            flyerNumber: createValMOficioGestio.flyerNumber,
            proceedingsNumber: createValMOficioGestio.proceedingsNumber,
          };
          const nextValMOficioGestio: any = await this.getMOficioGestion__(obj);
          // this.m_oficio_gestion = nextValMOficioGestio;
          this.formOficio
            .get('oficio')
            .setValue(this.m_oficio_gestion.managementNumber);
          // let contNext = parseInt(resp.data[0].managementNumber) + 1
          this.loading = false;
        }
      }

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
      if (textP != '' && this.updateOficioGestion == true) {
        this.m_oficio_gestion.text2 = textP.substring(1, 4000);
        this.m_oficio_gestion.text3 = textP.substring(4001, 4000);
      }
      this.lanzaReporte(this.m_oficio_gestion.managementNumber);
      this.formOficiopageFin
        .get('fin')
        .setValue(this.m_oficio_gestion.text2 + this.m_oficio_gestion.text3);
      let obj = {
        flyerNumber: this.m_oficio_gestion.flyerNumber,
        proceedingsNumber: this.m_oficio_gestion.proceedingsNumber,
        managementNumber: this.m_oficio_gestion.managementNumber,
        text2: this.m_oficio_gestion.text2,
        text3: this.m_oficio_gestion.text3,
      };
      this.updateMOficioGestion__(obj);
    }

    // ------------------------------------------------------------------ //
  }

  createMOficioGestion__(data: any) {
    return new Promise((resolve, reject) => {
      this.mJobManagementService.create(data).subscribe({
        next: (resp: any) => {
          this.loading = false;
          resolve(resp.data[0]);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  getMOficioGestion__(data: any) {
    const params = new ListParams();
    params['filter.flyerNumber'] = `$eq:${data.flyerNumber}`;
    params['filter.proceedingsNumber'] = `$eq:${data.proceedingsNumber}`;
    return new Promise((resolve, reject) => {
      this.mJobManagementService.getAll(params).subscribe({
        next: (resp: any) => {
          this.m_oficio_gestion = resp.data[0];
          this.loading = false;
          resolve(this.m_oficio_gestion);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  updateMOficioGestion__(data: any) {
    return new Promise((resolve, reject) => {
      this.mJobManagementService.update(data).subscribe({
        next: (resp: any) => {
          this.loading = false;
          resolve(resp.data[0]);
        },
        error: err => {
          this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // PUP_LANZA_REPORTE //
  lanzaReporte(managementNumber: any) {
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
  envofi() {
    if (this.m_oficio_gestion) {
      let V_NO_OF_GESTION = this.m_oficio_gestion.managementNumber;
      const textP = this.formOficiopageFin.get('fin').value;

      if (textP != '' && this.updateOficioGestion == true) {
        this.m_oficio_gestion.text2 = textP.substring(1, 4000);
        this.m_oficio_gestion.text3 = textP.substring(4001, 4000);
      }

      if (this.m_oficio_gestion.statusOf == 'ENVIADO') {
        this.actGestion(); //PUP_ACT_GESTION
        this.lanzaReporte(V_NO_OF_GESTION); // PUP_LANZA_REPORTE
      }

      let encontrado = this.m_oficio_gestion.cveManagement.includes('?');

      if (this.m_oficio_gestion.statusOf == 'EN REVISION' && encontrado) {
        this.searchNumber(V_NO_OF_GESTION); //PUP_BUSCA_NUMERO
        this.m_oficio_gestion.statusOf = 'ENVIADO';
        this.statusOfMOficioGestion = 'ENVIADO';
        this.actGestion(); //PUP_ACT_GESTION
        this.iconLock = true;
        this.btnOficion = false;
        // SET_ITEM_PROPERTY('BLK_CONTROL.ENVOFI', ICON_NAME, '../iconos/rt_lock');
        // SET_ITEM_PROPERTY('BLK_CONTROL.OFICIO', ENABLED, PROPERTY_FALSE);
        this.lanzaReporte(V_NO_OF_GESTION); // PUP_LANZA_REPORTE
      }

      V_NO_OF_GESTION = this.m_oficio_gestion.managementNumber;
      this.formOficiopageFin
        .get('fin')
        .setValue(this.m_oficio_gestion.text2 + this.m_oficio_gestion.text3);
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
  actGestion() {
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
      noOfNanagement: 2,
      year: anio,
    };

    estapa2 = await this.getMOficioGestionStage2_(numberManagement);

    //  FA_ETAPACREDA(TRUNC(SYSDATE))
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const SYSDATE = `${month}-${day}-${year}`;

    const FA_ETAPACREDA: any = await this.getFaStageCreda(SYSDATE);
    if (estapa2 == FA_ETAPACREDA) {
      LN_OFICIO = await this.getMOficioGestionlnJob_(obj);
    } else {
      LN_OFICIO = await this.getMOficioGestionmaxLnJob_(obj);
      if (LN_OFICIO == null) {
        this.alert('error', 'Al buscar el número del Oficio...', 'maxLnJob');
        return;
      }
    }

    const ln_oficio = LN_OFICIO; // Reemplaza 123 por el valor de LN_OFICIO
    const ln_oficio_str = ln_oficio.toString(); // Convierte el número a una cadena de caracteres

    // Rellena la cadena de caracteres con ceros a la izquierda hasta que tenga una longitud de 5 caracteres
    const ln_oficio_padded = ln_oficio_str.padStart(5, '0');

    // Remueve los espacios en blanco a la izquierda de la cadena de caracteres
    const ln_oficio_trimmed = ln_oficio_padded.trimStart();

    this.m_oficio_gestion.armedKeyNumber = LN_OFICIO;
    this.cveManagement = `DCB/DEBM/CJBM/${ln_oficio_trimmed}/${anio}`;
    this.m_oficio_gestion.cveManagement = `DCB/DEBM/CJBM/${ln_oficio_trimmed}/${anio}`;
    this.m_oficio_gestion.insertDate = sysdate + '';
    this.dateCapture2 = sysdate + '';
    //   : M_OFICIO_GESTION.NUM_CLAVE_ARMADA := LN_OFICIO;
    //  : M_OFICIO_GESTION.CVE_OF_GESTION := 'DCB/DEBM/CJBM/' || LTRIM(TO_CHAR(LN_OFICIO, '00000')) || '/' || ANIO; --SE MODIFICO POR EL CAMBIO POR NUEVO ESTATUTO		JPH 21 / 10 / 2011
    //  : M_OFICIO_GESTION.FECHA_INSERTO := SYSDATE;
  }

  async getFaStageCreda(data: any) {
    const params = new ListParams();
    params['filter.date'] = `$eq:${data}`;
    return new Promise((resolve, reject) => {
      this.parametersService.getFaStageCreda(params).subscribe({
        next: (resp: any) => {
          this.loading = false;
          resolve(resp.data.stagecreated);
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
          this.onLoadToast('success', 'tabla: M_OFICIO_GESTION', 'stage2');
          resolve(resp.data[0].etapa2);
        },
        error: err => {
          this.onLoadToast('error', 'tabla: M_OFICIO_GESTION', 'stage2');
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

    console.log('V_ELIMINA', V_ELIMINA);
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
              await this.updateNotifications(V_NO_VOLANTE);
            }

            // IF V_VAL_ELIM = 1 THEN
            //   LIP_MENSAJE('No es posible realizar la eliminación del dictamen. ' || SQLERRM, 'S');
            // ELSIF V_VAL_ELIM = 0 THEN
            //   LIP_COMMIT_SILENCIOSO;
            //   LIP_MENSAJE('Dictamen eliminado. ', 'A');
            // END IF;
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
              this.alert('error', error.error.message, 'tabla: BIENES');
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
      this.documentsService.deleteDocumentsDictuXStateM(data).subscribe({
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
        this.onLoadToast(
          'error',
          'Error al eliminar los documentos de los bienes',
          'tabla: DOCUMENTOS_DICTAMEN_X_BIEN_M'
        );
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
              this.onLoadToast(
                'error',
                'Error al eliminar los bienes.',
                'tabla: DICTAMINACION_X_BIEN1'
              );
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
              this.onLoadToast(
                'error',
                'Error al eliminar las copias del Oficio.',
                'tabla: COPIAS_OFICIO_DICTAMEN'
              );
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
          this.onLoadToast(
            'error',
            error.error.message,
            'tabla: COPIAS_OFICIO_DICTAMEN'
          );
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
        this.onLoadToast(
          'error',
          'Error al eliminar los textos del Oficio.',
          'tabla: OFICIO_DICTAMEN_TEXTOS'
        );
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
        this.onLoadToast(
          'error',
          'Error al eliminar el Oficio del Dictamen.',
          'tabla: OFICIO_DICTAMEN'
        );
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
        // this.alert(
        //   'success',
        //   'Datos eliminados correctamente',
        //   'tabla: DICTAMINACIONES'
        // );
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
        this.onLoadToast(
          'error',
          'Error al actualizar el volante.',
          'tabla: NOTIFICACIONES'
        );
        this.loading = false;
      },
    });
  }

  // -------------------------- BOTON BORRAR--------------------------- //

  borrar() {
    if (this.m_oficio_gestion) {
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
        this.alert(
          'warning',
          'La clave está armada, no puede borrar oficio',
          ''
        );
        return;
      }

      V_NO_OF_GESTION = this.m_oficio_gestion.managementNumber;
      V_NO_VOLANTE = this.m_oficio_gestion.flyerNumber;
      console.log('AQUIII', this.m_oficio_gestion);
      this.alertQuestion(
        'info',
        `Se borra oficio (Exp.: ${this.idExpediente} No.oficio: ${V_NO_VOLANTE})?`,
        '¿Deseas continuar?'
      ).then(question => {
        if (question.isConfirmed) {
          // BORRA COPIAS_OFICIO_GESTION
          this.getCopiasOfiGest(V_NO_OF_GESTION);
          // BORRA DOCUM_OFICIO_GESTION //
          this.deleteDocOficioGestion(V_NO_OF_GESTION);
          // BORRA M_OFICIO_GESTION //
          this.deleteMOficioGestion(V_NO_OF_GESTION);
          // UPDATE NOTIFICACIONES
          this.updateNotifications(V_NO_VOLANTE);

          // FALTARIA ESTO
          // GO_ITEM('BLK_NOT.NO_VOLANTE');
          // SET_BLOCK_PROPERTY('BLK_NOT', DEFAULT_WHERE,: BLK_CONTROL.DEF_WHERE_NOT);
        }
      });
    } else {
      this.alert('warning', 'Debe seleccionar una Gestión de Oficio', '');
    }
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
        this.alert('error', 'COPIAS_OFICIO_GESTION', error.error.message);
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
  async deleteDocOficioGestion(managementNumber: any) {
    let obj = {
      managementNumber: managementNumber,
    };
    this.mJobManagementService.deleteDocOficioGestion(obj).subscribe({
      next: (resp: any) => {
        // this.alert('success', "Datos eliminados correctamente", "tabla: DOCUM_OFICIO_GESTION")
        this.loading = false;
      },
      error: error => {
        this.alert('error', error.error.message, 'tabla: DOCUM_OFICIO_GESTION');
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
        // this.alert('success', "Datos eliminados correctamente", "tabla: M_OFICIO_GESTION")
        this.loading = false;
      },
      error: error => {
        this.alert('error', error.error.message, 'tabla: M_OFICIO_GESTION');
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
    console.log('EVENT', event);
    let data = event.target.value;
    this.valEditTextFin = !this.valEditTextFin;
    this.openModal({ dataEdit: data, filterText: filter });
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
      console.log('asda', next);
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
      this.dictDate2 = truncatedDate;
      this.dictamen.dictDate = truncatedDate;

      // ********************************************************** //
      if (ANIO == ANIONEW) {
        let obj1 = {
          expedientNumber: this.dictamen.expedientNumber,
          year: ANIONEW,
          dictationNumber: this.dictamen.id,
        };

        V_TRANS = await this.dictaminacionesConsulta1(obj1);
      } else {
        let obj1 = {
          expedientNumber: this.dictamen.expedientNumber,
          year: ANIO,
          dictationNumber: this.dictamen.id,
        };

        V_TRANS = await this.dictaminacionesConsulta1(obj1);

        // if (V_TRANS == 1) {

        // } else {

        //   let obj2 = {
        //     noExpediente: this.dictamen.expedientNumber,
        //     noDicta: this.dictamen.id,
        //     typeDict: 'ABANDONO',
        //     clave_oficio_armada: `FGR/?/${ANIO}`,
        //     noDelegation: 0,
        //   };
        //   V_TRANS = await this.dictaminacionesConsulta1(obj2);
        // }
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
        };

        V_TRANS = await this.dictaminacionesConsulta2(obj1);
      } else {
        let obj1 = {
          expedientNumber: this.dictamen.expedientNumber,
          year: ANIO,
          dictationNumber: this.dictamen.id,
        };
        V_TRANS = await this.dictaminacionesConsulta2(obj1);
      }
      // ********************************************************** //
      if (V_TRANS == null) {
        V_TRANS = V_RESP;
      }
      // ********************************************************** //
      if (V_TRANS == 1) {
        OFICIO = await this.dictaminacionesConsulta3(ANIONEW);

        // PUP_VALEXISTS_DICT
        let pupExisDict1: string = `DEBM/ABANDONO/PGR/${OFICIO.toString().padStart(
          5,
          '0'
        )}/${ANIONEW}`;
        let obj_1 = {
          typeDict: 'ABANDONO',
          clave_oficio_armada: pupExisDict1,
          noDelegation: 0,
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
          let pupExisDict2: string = `DEBM/ABANDONO/FGR/${OFICIO.toString().padStart(
            5,
            '0'
          )}/${ANIONEW}`;

          let obj_2 = {
            typeDict: 'ABANDONO',
            clave_oficio_armada: pupExisDict2,
            noDelegation: 0,
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
            `DEBM/ABANDONO/FGR/${OFICIO.toString().padStart(5, '0')}/${ANIONEW}`
          );
        this.dictamen.passOfficeArmy = `DEBM/ABANDONO/FGR/${OFICIO.toString().padStart(
          5,
          '0'
        )}/${ANIONEW}`;
        // : DICTAMINACIONES.CLAVE_OFICIO_ARMADA :='DEBM/ABANDONO/FGR/' || LTRIM(TO_CHAR(OFICIO, '00000')) || '/' || ANIONEW;
      } else if (V_TRANS == 2) {
        OFICIO = await this.dictaminacionesConsulta5(ANIONEW);

        let pupExisDict3: string = `DEBM/ABANDONO/PJF/${OFICIO.toString().padStart(
          5,
          '0'
        )}/${ANIONEW}`;
        let obj_3 = {
          typeDict: 'ABANDONO',
          clave_oficio_armada: pupExisDict3,
          noDelegation: 0,
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
            `DEBM/ABANDONO/PJF/${OFICIO.toString().padStart(5, '0')}/${ANIONEW}`
          );
        this.dictamen.passOfficeArmy = `DEBM/ABANDONO/PJF/${OFICIO.toString().padStart(
          5,
          '0'
        )}/${ANIONEW}`;
      } else {
        OFICIO = await this.dictaminacionesConsulta4(ANIONEW);

        let pupExisDict3: string = `DEBM/ABANDONO/PJF/${OFICIO.toString().padStart(
          5,
          '0'
        )}/${ANIONEW}`;
        let obj_3 = {
          typeDict: 'ABANDONO',
          clave_oficio_armada: pupExisDict3,
          noDelegation: 0,
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
            `DEBM/ABANDONO/${OFICIO.toString().padStart(5, '0')}/${ANIONEW}`
          );
        this.dictamen.passOfficeArmy = `DEBM/ABANDONO/${OFICIO.toString().padStart(
          5,
          '0'
        )}/${ANIONEW}`;
      }
      // ********************************************************** //

      this.dictamen.keyArmyNumber = OFICIO;
      this.oficioDictamen.statusOf = 'ENVIADO';
      this.agregarDictamen();
      // LIP_COMMIT_SILENCIOSO;
      this.disabledIMPRIMIR = false;
      this.disbaledAPROBAR = false;
      this.disabledTIPO_OFICIO = false;

      // GO_BLOCK('BIENES');
      // FIRST_RECORD;
      let firstRecordGood = this.data1[0];

      // GO_BLOCK('DICTAMINACION_X_BIEN1');
      // FIRST_RECORD;
      for (let i = 0; i < this.selectedGood.length; i++) {
        const dictamenXGood1: any = await this.getDictaXGood(
          this.selectedGood[i].id,
          'ABANDONO'
        );

        if (dictamenXGood1 != null) {
          if (dictamenXGood1.id != null) {
            let obj = {
              pVcScreem: 'FACTJURABANDONOS',
              pGoodNumber: this.selectedGood[i].id,
            };
            const arrayGoodScreen: any = await this.getGoodScreenSend(obj);

            for (let i = 0; i < arrayGoodScreen.length; i++) {
              if (arrayGoodScreen[i].estatus_final != null) {
                if (arrayGoodScreen[i].typeDict == 'ABANDONO') {
                  // VAL_BN_NSBDDB:= FN_VALBIEN_NSBDDB(: DICTAMINACION_X_BIEN1.NO_BIEN);
                  let VAL_BN_NSBDDB = 1;
                  if (VAL_BN_NSBDDB == 1) {
                    let obj = {
                      id: dictamenXGood1.id,
                      goodId: dictamenXGood1.id,
                      extDomProcess: 'ABANDONO',
                      status: arrayGoodScreen[i].estatus_final,
                    };
                    // UPDATE BIENES //
                    this.updateBienesSendBtn(obj, 1);

                    const historyGood: IHistoryGood = {
                      propertyNum: dictamenXGood1.id,
                      status: arrayGoodScreen[i].estatus_final,
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
                      typeDicta: arrayGoodScreen[i].typeDict,
                    };
                    let V_ETIQUETA: any = await this.getFaFlagDest_(objLabel);
                    let obj = {
                      id: dictamenXGood1.id,
                      goodId: dictamenXGood1.id,
                      extDomProcess: 'ABANDONO',
                      status: arrayGoodScreen[i].estatus_final,
                      labelNumber: V_ETIQUETA,
                    };
                    // UPDATE BIENES //
                    this.updateBienesSendBtn(obj, 2);

                    const historyGood: IHistoryGood = {
                      propertyNum: dictamenXGood1.id,
                      status: arrayGoodScreen[i].estatus_final,
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
                    id: dictamenXGood1.id,
                    goodId: dictamenXGood1.id,
                    extDomProcess: arrayGoodScreen[i].proceso_ext_dom,
                    status: arrayGoodScreen[i].estatus_final,
                  };
                  // UPDATE BIENES //
                  this.updateBienesSendBtn(obj, 3);

                  const historyGood: IHistoryGood = {
                    propertyNum: dictamenXGood1.id,
                    status: arrayGoodScreen[i].estatus_final,
                    changeDate: new Date(),
                    userChange: this.token.decodeToken().preferred_username,
                    statusChangeProgram: 'FACTJURABANDONOS',
                    reasonForChange: 'Automático',
                    registryNum: null,
                    extDomProcess: arrayGoodScreen[i].proceso_ext_dom,
                  };
                  // INSERT HISTORY GOOD
                  this.insertHistoryGood(historyGood);
                }
              }
            }
          }
        }
      }

      //PUP_OFIC_DICT
      this.generar_ofic_dict(this.dictamen);
      this.formDeclaratoriapageFin
        .get('fin')
        .setValue(
          this.oficioDictamen.text2 +
            this.oficioDictamen.text2To +
            this.oficioDictamen.text3
        );
    } else {
      this.alert('info', 'La declaratoria ya ha sido envianda', '');
    }
    // } else {
    //   this.alert('warning', 'Debe seleccionar un dictamen y/o oficio dictamen', '')
    // }
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
          resolve(rep.data);
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
  async dictaminacionesConsulta3(year: any) {
    return new Promise((resolve, reject) => {
      this.dictationService.sendConsulta2(year).subscribe({
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
  async dictaminacionesConsulta4(year: any) {
    return new Promise((resolve, reject) => {
      this.dictationService.sendConsulta1(year).subscribe({
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
  async dictaminacionesConsulta5(year: any) {
    return new Promise((resolve, reject) => {
      this.dictationService.sendConsulta3(year).subscribe({
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
          resolve(data.count);
        },
        error: error => {
          resolve(0);
        },
      });
    });
  }

  async updateBienesSendBtn(body: any, n: any) {
    this.goodServices.updateWithParams(body).subscribe({
      next: (resp: any) => {
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
}
