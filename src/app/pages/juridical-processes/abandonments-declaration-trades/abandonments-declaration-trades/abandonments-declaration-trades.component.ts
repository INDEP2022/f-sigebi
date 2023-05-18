/** BASE IMPORT */
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { IUserAccessAreaRelational } from 'src/app/core/models/ms-users/seg-access-area-relational.model';
import { DocumentsReceptionDataService } from 'src/app/core/services/document-reception/documents-reception-data.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DictationXGood1Service } from 'src/app/core/services/ms-dictation/dictation-x-good1.service';
import { OficialDictationService } from 'src/app/core/services/ms-dictation/oficial-dictation.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import {
  JURIDICAL_FILE_UPDATE_SEARCH_COLUMNS,
  JURIDICAL_FILE_UPDATE_SEARCH_FIELDS,
} from '../../file-data-update/interfaces/columns';
import { IJuridicalFileDataUpdateForm } from '../../file-data-update/interfaces/file-data-update-form';
import { JuridicalFileUpdateService } from '../../file-data-update/services/juridical-file-update.service';
import { JURIDICAL_FILE_DATA_UPDATE_FORM } from '../constants/form-declarations';
import { AbandonmentsDeclarationTradesService } from '../service/abandonments-declaration-trades.service';
import { COLUMNS_BIENES } from './columns';
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
  settings2 = {
    pager: {
      display: false,
    },
    hideSubHeader: true,
    actions: false,
    selectedRowIndex: -1,
    mode: 'external',
    columns: {
      cveDocumento: {
        title: 'No. Bien',
        type: 'number',
      },
      description: {
        title: 'Descripcion',
        type: 'string',
      },
    },
    noDataMessage: 'No se encontrarón registros',
  };
  texto1: string = '';
  disabledIMPRIMIR: boolean;
  public disabledTIPO_OFICIO: boolean = true;
  disbaledAPROBAR: boolean;
  disabledENVIAR: boolean;
  totalItems: number = 0;
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
    private expedientService: ExpedientService
  ) {
    super();
    this.settings1 = {
      ...this.settings,
      actions: false,
      selectMode: 'multi',
      columns: { ...COLUMNS_BIENES },
    };
  }

  get formControls() {
    return this.declarationForm.controls;
  }

  get dictDate() {
    return format(new Date(), 'dd-MM-yyyy');
    return this.declarationForm.controls['dictDate'].value;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loading = false;
    this.disabledIMPRIMIR = false;
    this.disabledTIPO_OFICIO = false;
    this.disbaledAPROBAR = false;
    this.disabledENVIAR = false;

    this.params
      .pipe(
        takeUntil(this.$unSubscribe),
        tap(() => this.onLoadGoodList())
      )
      .subscribe();
    // this.onLoadGoodList();
  }

  private prepareForm() {
    this.loading = false;
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
      folioEscaneo: ['', [Validators.required]], //*
    });

    this.di_status = this.fb.group({
      di_desc_estatus: [''], //*
    });
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

  selectData(data: INotification) {
    this.selectedRow = data;
    this.changeDetectorRef.detectChanges();
    this.declarationForm.get('expedientNumber').setValue(data.expedientNumber);
    this.declarationForm
      .get('preliminaryInquiry')
      .setValue(data.preliminaryInquiry);
    this.declarationForm.get('criminalCase').setValue(data.criminalCase);
    console.log('DATA', data);
    this.loading = true;
    this.onLoadGoodList();
    this.validDesahogo(data);
    this.checkDictum(data);
    this.getExpediente(data.expedientNumber);
  }

  getSenders(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    params.addFilter('assigned', 'S');
    if (lparams?.text.length > 0)
      params.addFilter('user', lparams.text, SearchFilter.LIKE);
    this.hideError();
    this.abandonmentsService.getUsers(params.getParams()).subscribe({
      next: data => {
        this.senders = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.senders = new DefaultSelect();
      },
    });
  }

  getRecipients(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    params.addFilter('assigned', 'S');
    if (lparams?.text.length > 0)
      params.addFilter('user', lparams.text, SearchFilter.LIKE);
    this.hideError();
    this.abandonmentsService.getUsers(params.getParams()).subscribe({
      next: data => {
        this.recipients = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.recipients = new DefaultSelect();
      },
    });
  }

  getCities(lparams: ListParams) {
    const params = new FilterParams();
    params.page = lparams.page;
    params.limit = lparams.limit;
    if (lparams?.text.length > 0)
      params.addFilter('nameCity', lparams.text, SearchFilter.LIKE);
    this.hideError();
    this.abandonmentsService.getCities(params.getParams()).subscribe({
      next: data => {
        this.cities = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.cities = new DefaultSelect();
      },
    });
  }

  onLoadGoodList() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
    };
    // let params = this.params;
    let exp = this.declarationForm.get('expedientNumber').value;
    params['filter.fileNumber'] = exp;
    params['filter.status'] = `$in:ADM,DXV`;
    this.goodServices.getByExpedientAndParams(params).subscribe({
      next: response => {
        console.log('FJ', response);
        // debugger;
        this.data1 = response.data;
        this.totalItems = response.count;
        this.getScreenStatusFinal();
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.log('ERRROR BIEN X EXPEDIENTE', err);
        this.data1 = [];
      },
    });
    this.loading = false;
  }

  // OBTENEMOS SCREEN STATUS FINAL //
  getScreenStatusFinal() {
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
  getExpediente(expedientNumber: any) {
    if (expedientNumber) {
      this.expedientService.getById(expedientNumber).subscribe({
        next: data => {
          this.courtName = data.courtName;
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

  validDesahogo(data: any) {
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
  checkDictum(data: any) {
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

        this.getOficioDictamen(this.dictamen);
        this.getDictationXGood1Service(this.dictamen);
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
  getOficioDictamen(data: any) {
    const params = new ListParams();
    params['filter.officialNumber'] = `$eq:${data.id}`;
    params['filter.typeDict'] = `$eq:${data.typeDict}`;

    this.OficialDictationService.getAll(params).subscribe({
      next: data => {
        this.oficioDictamen = data.data[0];
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
  getDictationXGood1Service(data: any) {
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
        } else {
          this.alertQuestion(
            'info',
            'Se generará un nuevo folio de escaneo para la declaratoria',
            '¿Deseas continuar?'
          ).then(question => {
            if (question.isConfirmed) {
              // this.delete(shift.shiftNumber);
              this.onLoadToast('success', 'Success', '');
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
    //     IF(: OFICIO_DICTAMEN.ESTATUS_OF = 'ENVIADO') AND(: DICTAMINACIONES.CLAVE_OFICIO_ARMADA IS NOT NULL) THEN
    //     IF: DICTAMINACIONES.FOLIO_UNIVERSAL IS NOT NULL THEN
    //       IF LIF_MENSAJE_SI_NO('Se abrirá la pantalla de escaneo para el folio de escaneo de la declaratoria. ¿Deseas continuar?') = 'N' THEN
    //          RAISE FORM_TRIGGER_FAILURE;
    //       END IF;
    //     PUP_LANZA_ESCANEO(: DICTAMINACIONES.FOLIO_UNIVERSAL);
    //     ELSE
    //     LIP_MENSAJE('No existe folio de escaneo a escanear.', 'A');
    //    END IF;
    //     ELSE
    //     LIP_MENSAJE('No se puede escanear para una declaratoria que esté abierta.', 'A');
    // END IF;
    if (this.oficioDictamen && this.dictamen) {
      if (
        this.oficioDictamen.statusOf == 'ENVIADO' &&
        this.dictamen.passOfficeArmy != null
      ) {
        if (this.dictamen.folioUniversal != null) {
          this.alertQuestion(
            'info',
            'Se abrirá la pantalla de escaneo para el folio de escaneo de la declaratoria',
            '¿Deseas continuar?'
          ).then(question => {
            if (question.isConfirmed) {
              this.goNextForm();
              this.onLoadToast('success', 'Enviado a la siguiente forma', '');
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
    this.router.navigateByUrl('/pages/general-processes/scan-request/scan');
  }

  imprimirFolioEscaneo() {
    if (this.dictamen) {
      if (this.dictamen.folioUniversal == null) {
        this.alert('warning', 'No tiene folio de escaneo para imprimir.', '');
      } else {
        let params = {
          pn_folio: '45656',
        };
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
        }
      } else {
        this.alert('error', 'La declaratoria no ha sido aprobada', '');
      }
    }
    //   IF: DICTAMINACIONES.NO_OF_DICTA IS NOT NULL THEN
    //     IF NVL(: DICTAMINACIONES.CLAVE_OFICIO_ARMADA, '?') LIKE '%?%' THEN
    //   PUP_AGREGA_DICTAMEN;
    //     END IF;

    //   IF: OFICIO_DICTAMEN.TEXTOP IS NOT NULL
    //     AND GET_BLOCK_PROPERTY('OFICIO_DICTAMEN', UPDATE_ALLOWED) = 'TRUE' THEN
    //   : OFICIO_DICTAMEN.TEXTO2   := SUBSTR(: OFICIO_DICTAMEN.TEXTOP, 1, 4000);
    //        : OFICIO_DICTAMEN.TEXTO2_A := SUBSTR(: OFICIO_DICTAMEN.TEXTOP, 4001, 4000);
    //        : OFICIO_DICTAMEN.TEXTO3   := SUBSTR(: OFICIO_DICTAMEN.TEXTOP, 8001, 4000);
    //     END IF;

    //   LIP_COMMIT_SILENCIOSO;
    //   --LIP_COMMIT_SILENCIOSO;

    //   IF: OFICIO_DICTAMEN.TEXTOP IS NULL THEN
    //   LIP_MENSAJE('Debe seleccionar el tipo de oficio', 'S');
    //   GO_ITEM('VARIABLES.TIPO_OFICIO');
    //        RAISE FORM_TRIGGER_FAILURE;
    //   ELSE
    //   PUP_OFIC_DICT;
    //   SET_ITEM_PROPERTY('BLK_CONTROL.ENVIAR', ENABLED, PROPERTY_TRUE);
    //   GO_BLOCK('DICTAMINACIONES');
    //   V_NO_OF_DICTA:= : DICTAMINACIONES.NO_OF_DICTA;
    //   V_TIPO_DICTA:= : DICTAMINACIONES.TIPO_DICTAMINACION;
    //   SET_BLOCK_PROPERTY('DICTAMINACIONES', DEFAULT_WHERE, 'NO_OF_DICTA=' || TO_CHAR(V_NO_OF_DICTA) || ' AND TIPO_DICTAMINACION = ''' || V_TIPO_DICTA || '''');
    //   EXECUTE_QUERY(NO_VALIDATE);
    //   SET_BLOCK_PROPERTY('DICTAMINACIONES', DEFAULT_WHERE, '');
    //        : OFICIO_DICTAMEN.TEXTOP := : OFICIO_DICTAMEN.TEXTO2 ||: OFICIO_DICTAMEN.TEXTO2_A ||: OFICIO_DICTAMEN.TEXTO3;
    //     END IF;
    //   ELSE
    //   LIP_MENSAJE('La declaratoria no ha sido aprobada', 'A');
    //  END IF;
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
}
