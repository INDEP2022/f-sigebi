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
import { BehaviorSubject, takeUntil, tap } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IUserRowSelectEvent } from 'src/app/core/interfaces/ng2-smart-table.interface';
import { ICity } from 'src/app/core/models/catalogs/city.model';
import { IGood } from 'src/app/core/models/good/good.model';
import { IDictation } from 'src/app/core/models/ms-dictation/dictation-model';
import { IDictationXGood1 } from 'src/app/core/models/ms-dictation/dictation-x-good1.model';
import { IOfficialDictation } from 'src/app/core/models/ms-dictation/official-dictation.model';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { IMJobManagement } from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { IUserAccessAreaRelational } from 'src/app/core/models/ms-users/seg-access-area-relational.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { OficialDictationService } from 'src/app/core/services/ms-dictation/oficial-dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  JURIDICAL_FILE_UPDATE_SEARCH_COLUMNS,
  JURIDICAL_FILE_UPDATE_SEARCH_FIELDS,
} from '../../file-data-update/interfaces/columns';
import { IJuridicalFileDataUpdateForm } from '../../file-data-update/interfaces/file-data-update-form';
import { JuridicalFileUpdateService } from '../../file-data-update/services/juridical-file-update.service';
import { JURIDICAL_FILE_DATA_UPDATE_FORM } from '../constants/form-declarations';
import { AbandonmentsDeclarationTradesService } from '../service/abandonments-declaration-trades.service';
import { COLUMNS_BIENES, COLUMNS_DOCUMENTS } from './columns';
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
  columnsType = { ...JURIDICAL_FILE_UPDATE_SEARCH_COLUMNS };
  fieldsToSearch = [...JURIDICAL_FILE_UPDATE_SEARCH_FIELDS];
  showTabs: boolean = true;
  senders = new DefaultSelect<IUserAccessAreaRelational>();
  recipients = new DefaultSelect<IUserAccessAreaRelational>();
  cities = new DefaultSelect<ICity>();
  selectedGood: IGood[] = [];
  disabled: boolean = true;
  /** Tabla bienes */
  proceedingSettings = { ...this.settings };
  data1: any = [];
  settings1 = { ...this.settings };
  params: any = new BehaviorSubject<ListParams>(new ListParams());
  data2 = [
    {
      cveDocumento: 25,
      description: 'UNA BOLSA',
    },
  ];
  settings2 = { ...this.settings };
  texto1: string = '';
  disabledIMPRIMIR: boolean;
  public disabledTIPO_OFICIO: boolean = true;
  disbaledAPROBAR: boolean;
  disabledENVIAR: boolean;
  totalItems: number = 0;
  items = new DefaultSelect<any>();
  public lockStatus: boolean = false;
  valTiposAll: boolean;
  loadingText: string = '';
  public formLoading: boolean = false;

  // formLoading: boolean = false;
  folioEscaneoNg: any = '';
  valReadonly: boolean = true;

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
    private mJobManagementService: MJobManagementService
  ) {
    super();
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
          return 'bg-green-to-confirm-verdadero';
        } else {
          return 'bg-green-to-confirm';
        }
      } else {
        if (row.data.est_disponible == 'N') {
          if (row.data.labelNumber == 6) {
            return 'bg-black-unavailable-roj';
          } else {
            return 'bg-black-unavailable';
          }
        }
      }
      return '';
    };
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
    this.prepareForm();
    // this.loading = true;
    this.disabledIMPRIMIR = false;
    this.disabledTIPO_OFICIO = false;
    this.disbaledAPROBAR = false;
    this.disabledENVIAR = false;
    // this.lockStatus = false;
    this.valTiposAll = false;
    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => this.onLoadGoodList('all'))
      )
      .subscribe();
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
    console.log('AQUI', formData);
  }

  idExpediente: any = null;
  async selectData(data: INotification) {
    console.log('JORGEEE');
    this.loading = true;
    this.selectedRow = data;
    this.changeDetectorRef.detectChanges();

    this.formOficio.get('noVolante').setValue(data.wheelNumber);
    this.formOficio.get('noExpediente').setValue(data.expedientNumber);

    this.cveoficio_Oficio = '';
    this.statusOfOficio = '';

    console.log('DATA', data);

    this.idExpediente = data.expedientNumber;
    await this.onLoadGoodList('all');
    await this.validDesahogo(data);
    await this.checkDictum(data);
    await this.getExpediente(data.expedientNumber);
    await this.getMOficioGestion(data.wheelNumber);

    return;
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

  // getSenders(lparams: ListParams) {
  //   const params = new FilterParams();
  //   params.page = lparams.page;
  //   params.limit = lparams.limit;
  //   params.addFilter('assigned', 'S');
  //   if (lparams?.text.length > 0)
  //     params.addFilter('user', lparams.text, SearchFilter.LIKE);
  //   this.hideError();
  //   this.abandonmentsService.getUsers(params.getParams()).subscribe({
  //     next: data => {
  //       this.senders = new DefaultSelect(data.data, data.count);
  //     },
  //     error: () => {
  //       this.senders = new DefaultSelect();
  //     },
  //   });
  // }
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

  getCities(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('idCity', lparams.text, SearchFilter.EQ);
    this.hideError();
    this.abandonmentsService.getCities(params.getParams()).subscribe({
      next: data => {
        console.log('CITY', data);
        this.cities = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.cities = new DefaultSelect();
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

    console.log('FILTER', filter);

    let exp = this.idExpediente;
    params['filter.fileNumber'] = exp;
    params['filter.status'] = `$in:ADM,DXV`;

    if (filter != 'all') {
      params['filter.goodClassNumber'] = `$eq:${filter}`;
    }

    this.goodServices.getByExpedientAndParams(params).subscribe({
      next: response => {
        console.log('FJ', response);
        // debugger;
        let result = response.data.map(async (item: any) => {
          const statusScreen: any = await this.getScreenStatus(item);
          item['est_disponible'] = statusScreen.di_disponible;
          item['no_of_dicta'] = null;

          if (statusScreen.di_disponible == 'S') {
            console.log('GERMAN');
            item['no_of_dicta'] = null;
            // : BIENES.NO_OF_DICTA := NULL;
            const dictamenXGood1: any = await this.getDictaXGood(item);
            item['no_of_dicta'] = dictamenXGood1
              ? dictamenXGood1.ofDictNumber
              : null;
            item['est_disponible'] = 'N';
          }
        });

        Promise.all(result).then((resp: any) => {
          this.data1 = response.data;
          this.totalItems = response.count;
          // this.getScreenStatusFinal();
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
        console.log('ERRROR BIEN X EXPEDIENTE', err);
        this.data1 = [];
      },
    });
    this.loading = false;
  }

  // OBTENEMOS SCREEN STATUS FINAL //
  async getScreenStatusFinal() {
    let obj = {
      vc_pantalla: 'FACTJURABANDONOS',
    };

    this.screenStatusService.getAllFiltroScreenKey(obj).subscribe(
      (response: any) => {
        const { data } = response;
        console.log('SCREEN', data);
      },
      error => {
        console.log('SCREEN', error.error.message);
        // this.onLoadToast(
        //   'info',
        //   '',
        //   'No se encontró Estatus en la tabla Estatus_X_Pantalla'
        // );
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
          console.log('ERR', error);
        },
      });
    }
  }

  // AGREGAMOS LOS TEXTOS INICIO Y FINAL //
  tipoOficio: string = '';
  addText(event: any) {
    this.tipoOficio = event;
    console.log('FORM', this.selectedRow);
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

  // OBTENEMOS DICTAMEN //
  dictamen: IDictation;
  cveoficio_Oficio: any = '';
  async checkDictum(data: any) {
    const params = new FilterParams();
    params.addFilter('wheelNumber', data.wheelNumber);
    this.fileUpdateService.getDictation(params.getParams()).subscribe({
      next: data => {
        this.dictamen = data.data[0];
        if (this.dictamen.statusDict == null) {
          this.disabledTIPO_OFICIO = true;
          this.disbaledAPROBAR = true;
          this.disabledENVIAR = false;
          this.disabledIMPRIMIR = false;
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
        this.VtypeGood(this.dictamen);
        console.log('DATA DICTAMENES', data);
      },
      error: error => {
        this.onLoadToast(
          'warning',
          'DICTÁMENES',
          'No se encontraron Dictámenes'
        );
        console.log('ERR', error);
      },
    });
  }
  // OBTENEMOS OFICIO DICTAMEN //
  oficioDictamen: IOfficialDictation;
  statusOfOficio: any = '';
  async getOficioDictamen(data: any) {
    const params = new ListParams();
    params['filter.officialNumber'] = `$eq:${data.id}`;
    params['filter.typeDict'] = `$eq:${data.typeDict}`;

    this.OficialDictationService.getAll(params).subscribe({
      next: data => {
        this.oficioDictamen = data.data[0];

        this.statusOfOficio = this.oficioDictamen.statusOf;

        if (this.oficioDictamen) {
          if (this.oficioDictamen.recipient != null) {
            const paramsRecipient: any = new ListParams();
            paramsRecipient.text = this.oficioDictamen.recipient;
            this.getRecipients(paramsRecipient);
          }

          if (this.oficioDictamen.sender != null) {
            const paramsSender: any = new ListParams();
            paramsSender.text = this.oficioDictamen.sender;
            this.getRecipients(paramsSender);
          }

          if (this.oficioDictamen.city != null) {
            const paramsCity: any = new ListParams();
            paramsCity.text = this.oficioDictamen.city;
            this.getCities(paramsCity);
          }
        }
        if (this.oficioDictamen.statusOf == 'ENVIADO') {
          this.lockStatus = false;
        } else {
          this.lockStatus = true;
        }

        console.log('DATA OFFICE', data);
      },
      error: error => {
        this.alert(
          'warning',
          'OFICIO DE DICTÁMENES',
          'No se encontraron oficio de dictámenes'
        );
      },
    });
  }
  // OBTENEMOS DICTAMEN X BIEN 1//
  dictamenXGood1: IDictationXGood1;
  async getDictationXGood1Service(data: any) {
    const params = new ListParams();
    params['filter.ofDictNumber'] = `$eq:${data.id}`;
    params['filter.typeDict'] = `$eq:${data.typeDict}`;

    this.DictationXGood1Service.getAll(params).subscribe({
      next: data => {
        this.dictamenXGood1 = data.data[0];
        console.log('DATA DICTXGOOD', data);
      },
      error: error => {
        this.alert(
          'warning',
          'DICTÁMENES POR BIEN1',
          'No se encontraron resultados'
        );
      },
    });
  }

  imgSolicitud() {
    if (this.oficioDictamen && this.dictamen) {
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
                numberDelegationRequested: 1,
                numberSubdelegationRequests: 1,
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
                  this.alert(
                    'success',
                    'El folio universal generado es:' + data.id,
                    ''
                  );
                },
                error: error => {
                  this.alert('warning', 'DOCUMENTS', error.error.message);
                },
              });
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
    }
  }

  generarFolioEscaneo() {
    // {
    //   "natureDocument": "Naturaleza del documento",
    //   "descriptionDocument": "Descripción del documento",
    //   "significantDate": "Fecha significativa",
    //   "scanStatus": "Estatus escaneo",
    //   "fileStatus": "Estatus archivo",
    //   "userRequestsScan": "Usuario solicita escaneo",
    //   "scanRequestDate": "Fecha solicita escaneo",
    //   "userRegistersScan": "Usuario registra escaneo",
    //   "dateRegistrationScan": "Fecha registro escaneo",
    //   "userReceivesFile": "Usuario recibe archivo",
    //   "dateReceivesFile": "Fecha recibe archivo",
    //   "keyTypeDocument": "Clave tipo documento",
    //   "keySeparator": "Clave separador",
    //   "numberProceedings": "Número de expediente",
    //   "sheets": "Hojas",
    //   "numberDelegationRequested": "Número de delegación solicita",
    //   "numberSubdelegationRequests": "Número de subdelegación que solicita",
    //   "numberDepartmentRequest": "Número de departamento que solicita",
    //   "registrationNumber": "Número de registro",
    //   "flyerNumber": "Número de volante",
    //   "userSend": "Usuario que envia",
    //   "areaSends": "Area que envia",
    //   "sendDate": "Fecha de envio",
    //   "sendFilekey": "Clave de archivo que envia",
    //   "userResponsibleFile": "Usuario responsable del archivo",
    //   "mediumId": "Identificador de medio",
    //   "associateUniversalFolio": "Folio universal asociado",
    //   "dateRegistrationScanningHc": "Fecha de registro de escaneo hc",
    //   "dateRequestScanningHc": "Fecha solicita escaneo hc",
    //   "goodNumber": "Número de bien"
    // }
    let body;
    this.documentsService.create(body).subscribe({
      next: data => {
        this.alert('success', 'El folio universal generado es:' + data, '');
        console.log('DOCUMENTS', data);
      },
      error: error => {
        this.alert('warning', 'DOCUMENTS', 'No se encontraron resultados');
      },
    });
    alert('AQUI');
  }

  escanearFolioEscaneo() {
    console.log('FOLIO', this.folioEscaneoNg);
    if (this.oficioDictamen && this.dictamen) {
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
    }
  }

  goNextForm() {
    // alert('SI');
    this.selectedRow = null;
    const route = `pages/general-processes/scan-request/scan`;
    this.router.navigate([route]);
  }

  imprimirFolioEscaneo() {
    if (this.dictamen) {
      if (this.dictamen.folioUniversal == null) {
        this.alert('warning', 'No tiene folio de escaneo para imprimir.', '');
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
    }
  }

  visualizacionFolioEscaneo() {
    if (this.dictamen)
      if (this.dictamen.folioUniversal == null) {
        this.alert('warning', 'No tiene folio de escaneo para visualizar.', '');
      } else {
      }
  }

  aprobar() {
    const year = new Date();
    var añoActual = year.getFullYear();

    let REMITENTE: any = this.declarationForm.get('sender').value;
    let DESTINATARIO: any = this.declarationForm.get('recipient').value;
    let CITY: any = this.declarationForm.get('city').value;

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
    } else if (this.selectedGood.length == 0) {
      this.alert(
        'error',
        'No hay bienes seleccionados para la declaratoria.',
        ''
      );
      return;
    }

    if (this.dictamen) {
      if (this.dictamen.id == null) {
        this.alertInfo(
          'error',
          'No se localizó la secuencia de la declaratoria',
          ''
        );

        this.dictamen.typeDict = 'ABANDONO';
        if (this.tipoOficio == 'FGR') {
          this.dictamen.passOfficeArmy =
            'DEBM/ABANDONO/FGR' + '/?/' + añoActual;
        } else if (this.tipoOficio == 'PJF') {
          this.dictamen.passOfficeArmy =
            'DEBM/ABANDONO/PJF' + '/?/' + añoActual;
        } else {
          this.dictamen.passOfficeArmy = 'DEBM/ABANDONO' + '/?/' + añoActual;
        }

        console.log('SASD', this.dictamen);

        // : DICTAMINACIONES.ESTATUS_DICTAMINACION := 'DICTAMINADO';
        // : DICTAMINACIONES.NO_EXPEDIENTE := : BLK_NOT.NO_EXPEDIENTE;
        // : DICTAMINACIONES.NO_VOLANTE := : BLK_NOT.NO_VOLANTE;
        // : DICTAMINACIONES.USUARIO_DICTAMINA := : TOOLBAR_USUARIO;
        // : DICTAMINACIONES.NO_DELEGACION_DICTAM := : TOOLBAR_NO_DELEGACION;
        // : DICTAMINACIONES.AREA_DICTAMINA := 914; ----JURÍDICO ----
        // : DICTAMINACIONES.FEC_DICTAMINACION := SYSDATE;
        // : DICTAMINACIONES.FECHA_INSTRUCTORA := SYSDATE;
        // : DICTAMINACIONES.FEC_NOTIFICA_ASEGURAMIENTO := SYSDATE;
        // : DICTAMINACIONES.FEC_RESOLUCION := SYSDATE;
        // : DICTAMINACIONES.FEC_NOTIFICARESOLUCION := SYSDATE;
      }
    }

    if (
      this.formDeclaratoriapageFin.get('fin').value != null ||
      this.formDeclaratoriapageFin.get('fin').value != ''
    ) {
      let textP = this.formDeclaratoriapageFin.get('fin').value;
      this.oficioDictamen.text2 = textP.substring(1, 4000);
      this.oficioDictamen.text2To = textP.substring(4001, 4000);
      this.oficioDictamen.text3 = textP.substring(8000, 4000);
    }

    this.agregarDictamen();

    // V_NO_OF_DICTA:= : DICTAMINACIONES.NO_OF_DICTA;
    // V_TIPO_DICTA:= : DICTAMINACIONES.TIPO_DICTAMINACION;
    // SET_BLOCK_PROPERTY('DICTAMINACIONES', DEFAULT_WHERE, 'NO_OF_DICTA=' || TO_CHAR(V_NO_OF_DICTA) || ' AND TIPO_DICTAMINACION = ''' || V_TIPO_DICTA || '''');
  }

  agregarDictamen() {}

  imprimir() {
    console.log('AAS', this.oficioDictamen);
    if (this.dictamen) {
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
        } else {
          this.generar_ofic_dict(this.dictamen);
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
    }
  }

  // PUP_OFIC_DICT
  generar_ofic_dict(data: any) {
    let params = {
      PNOOFICIO: data.id,
      PTIPODIC: data.typeDict,
    };
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
      next: async data => {
        console.log('DATAAAAAAAAAAAAAAAA', data);
        clasif = data.count;

        let result = data.data.map(async (item: any) => {
          // data['tipoSupbtipoDescription'] = item.NO_CLASIF_BIEN + ' - ' + item.DESC_SUBTIPO + ' - ' + item.DESC_SSUBTIPO + ' - ' + item.DESC_SSSUBTIPO, item.NO_CLASIF_BIEN
          item['tipoSupbtipoDescription'] = 'Test';
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
        console.log(error.error);
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
        this.tipoBien = data.data[0].no_tipo;
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
      vc_pantalla: 'FACTJURCONABANDEV',
      processExtSun: good.extDomProcess,
    };

    console.log('re', obj);
    return new Promise((resolve, reject) => {
      this.screenStatusService.getAllFiltro_(obj).subscribe({
        next: (resp: any) => {
          console.log(resp);
          const data = resp.data[0];

          let objScSt = {
            di_disponible: 'S',
          };

          resolve(objScSt);
        },
        error: (error: any) => {
          let objScSt: any = {
            di_disponible: 'N',
          };
          resolve(objScSt);
        },
      });
    });
  }

  getDictaXGood(data: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${data.id}`;
    params['filter.typeDict'] = `$eq:ABANDONO`;
    return new Promise((resolve, reject) => {
      this.DictationXGood1Service.getAll(params).subscribe({
        next: (resp: any) => {
          console.log('DASDASDASDASD', resp);
          const data = resp.data[0];

          resolve(data);
        },
        error: error => {
          resolve(null);
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

  // ACCIÓN DE EDITAR CAMPOS INICIO Y EDIT DEL TAB OFICIO //
  valEditTextIni: boolean = false;
  valEditTextFin: boolean = false;
  // EDIT INICION //
  editTextInicio() {
    // this.valEditTextIni = false;

    if (this.valEditTextIni == false) {
      this.valEditTextIni = true;
    } else {
      this.valEditTextIni = false;
    }
  }
  // EDIT FIN //
  editTextfin() {
    if (this.valEditTextFin == false) {
      this.valEditTextFin = true;
    } else {
      this.valEditTextFin = false;
    }
  }

  // DISABLED CAMPO DESPUÉS DE EDITAR EL CAMPO //
  disabledText() {
    this.valEditTextIni = false;
    this.valEditTextFin = false;
  }

  m_oficio_gestion: IMJobManagement;
  getMOficioGestion(wheelNumber: any) {
    let params = {
      ...this.params,
    };
    params['filter.flyerNumber'] = `$eq:${wheelNumber}`;
    this.mJobManagementService.getAll(params).subscribe({
      next: (resp: any) => {
        console.log('DATA JOG', resp);
      },
      error: error => {
        if (error.error.message == 'No se encontrarón registros.') {
        }
        this.m_oficio_gestion;
        console.log('ERROR JOG', error);
      },
    });
  }
}
