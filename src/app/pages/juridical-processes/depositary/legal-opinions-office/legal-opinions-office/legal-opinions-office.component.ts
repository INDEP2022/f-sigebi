import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { isArray } from 'ngx-bootstrap/chronos';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  map,
  switchMap,
  takeUntil,
  tap,
  throwError,
} from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { ICopiesOfficialOpinion } from 'src/app/core/models/ms-dictation/copies-official-opinion.model';
import {
  ICopiesOfficeSendDictation,
  IDictation,
  IInitFormLegalOpinionOfficeBody,
  ITmpDictationCreate,
  ITmpExpDesahogoB,
} from 'src/app/core/models/ms-dictation/dictation-model';
import { IDictationXGood1 } from 'src/app/core/models/ms-dictation/dictation-x-good1.model';
import { IOfficialDictation } from 'src/app/core/models/ms-dictation/official-dictation.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IValidaCambioEstatus } from 'src/app/core/models/ms-good/good';
import { IJobDictumTexts } from 'src/app/core/models/ms-officemanagement/job-dictum-texts.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { FileBrowserService } from 'src/app/core/services/ms-ldocuments/file-browser.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AddCopyComponent } from '../../../abandonments-declaration-trades/abandonments-declaration-trades/add-copy/add-copy.component';
import { LegalOpinionsOfficeFirmModalComponent } from '../legal-opinions-office-firm-modal/legal-opinions-office-firm-modal.component';
import { ModalScanningFoilTableComponent } from '../modal-scanning-foil/modal-scanning-foil.component';
import {
  CCP_COLUMS_OFICIO,
  COLUMNS,
  officeTypeOption,
  RELATED_FOLIO_COLUMNS,
} from './columns';
import { LegalOpinionsOfficeService } from './services/legal-opinions-office.service';

export interface IParamsLegalOpinionsOffice {
  PAQUETE: string;
  P_GEST_OK: string;
  CLAVE_OFICIO_ARMADA: string;
  P_NO_TRAMITE: string;
  TIPO: string;
  P_VALOR: string;
  TIPO_VO: string;
  NO_EXP: string;
  CONSULTA: string;
}
@Component({
  selector: 'app-legal-opinions-office',
  templateUrl: './legal-opinions-office.component.html',
  styles: [
    `
      /* span.see-more.btn-link {
        color: red !important;
      } */
    `,
  ],
})
export class LegalOpinionsOfficeComponent extends BasePage implements OnInit {
  form: FormGroup;
  formScan: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  cityData = new DefaultSelect();
  issuingUser = new DefaultSelect();
  addressee = new DefaultSelect();
  userCopies1 = new DefaultSelect();
  userCopies2 = new DefaultSelect();
  expedientData: IExpedient;
  dictationData: IDictation;
  officeDictationData: IOfficialDictation;
  officeCopiesDictationData: ICopiesOfficialOpinion[] = [];
  tmpOfficeCopiesDictationData: ICopiesOfficialOpinion[] = [];
  officeTextDictationData: IJobDictumTexts;
  addresseeDataSelect: any;
  paramsScreen: IParamsLegalOpinionsOffice = {
    PAQUETE: '', // PAQUETE
    P_GEST_OK: '', // P_GEST_OK
    CLAVE_OFICIO_ARMADA: '', // CLAVE_OFICIO_ARMADA
    P_NO_TRAMITE: '', // NO_TRAMITE
    TIPO: '', // TIPO_DICTAMEN
    P_VALOR: '', // NO_OF_DICTA
    TIPO_VO: '',
    NO_EXP: '',
    CONSULTA: '',
  };
  officeTypeOption: any[] = officeTypeOption;
  origin: string = '';
  origin3: string = '';
  TIPO_VO: string = '';
  NO_EXP: string = '';
  CONSULTA: string = '';
  moreInfo1: boolean = false;
  moreInfo2: boolean = false;
  moreInfo3: boolean = false;
  variables = {
    fecha: '',
    identi: '',
    cveActa: '',
    cveOficioArmada: '',
  };
  dictationTypeValidOption: string[] = [
    'PROCEDENCIA',
    'TRANSFERENTE',
    'DESTRUCCION',
    'DONACION',
    'ENAJENACION',
    'ABANDONO',
    'RESARCIMIENTO',
  ];
  showEnableTypeOffice: boolean = false;
  showScanForm: boolean = true;
  loadingGoods: boolean = false;
  loadingSend: boolean = false;
  screenKey: string = 'FACTJURDICTAMOFICIO';
  dataUserLogged: any;
  dataUserLoggedTokenData: any;
  dataTable: LocalDataSource = new LocalDataSource();
  goodsByDictation = new BehaviorSubject<ListParams>(new ListParams());
  goodData: IDictationXGood1[] = [];
  totalData: number = 0;
  totalCurrent: number = 0;
  bodyCurrent: any = {};
  totalCorrect: number = 0;
  totalIncorrect: number = 0;
  blockSender: boolean = false;
  objDetail: any = {};
  loadDetail: boolean = false;
  showSearchAppointment: boolean = false;
  numberNotaryVisible: boolean = false;
  V_ARCHOSAL: string = '';
  pup_genera_xml: boolean = false;
  pup_genera_pdf: boolean = false;
  V_URL_OPEN_FIRM: string = '';
  // Cargar n cantidad de Copias para
  totalCopiesTo: number = 2;
  formCopiesTo: FormGroup;
  formCopiesToTotals: number[] = [];
  copiesToList: { ccp_person: ''; ccp_addressee: ''; ccp_TiPerson: '' }[] = [];
  // Cargar n cantidad de Copias para
  // PUP_GEN_MASIV
  totalItemsPUP_GEN_MASIV: number = 0;
  currentItemPUP_GEN_MASIV: number = 0;
  currentPagePUP_GEN_MASIV: number = 0;
  // SAVE DATA OR UPDATE
  _saveDictation: boolean = false;
  _saveDictation_loading: boolean = false;
  _saveOfficeDictation: boolean = false;
  _saveOfficeDictation_loading: boolean = false;
  _saveTextDictation: boolean = false;
  _saveTextDictation_loading: boolean = false;
  _saveCopiesDictation: boolean = false;
  _saveCopiesDictation_loading: boolean = false;
  _totalCopiesTo: number = 0;
  _valid_saveOfficeDictation: boolean = false;
  // Electronic Firm
  routeFirm: string = 'electronicfirm';
  fileFirm: any;
  // Good Loop
  goodLoopCurrent: number = 0;
  goodLoopTotal: number = 0;
  goodLoopPage: number = 0;
  goodLoopTmpData: IDictationXGood1[] = [];
  // TEMP DATA FIRM DOCUMENT
  nameStorageKeyArmedOffice: string = 'CLAVE_OFICIO_ARMADA';
  nameStorageDictationDate: string = 'FEC_DICTAMINACION';
  // CCP
  settings3 = { ...this.settings };
  public formCcpOficio: FormGroup;
  loadingCopiesDictation: boolean = false;
  // Folio
  folio: string = '';
  files: string[] = [];

  constructor(
    private fb: FormBuilder,
    private svLegalOpinionsOfficeService: LegalOpinionsOfficeService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private documentsService: DocumentsService,
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private securityService: SecurityService,
    private fileBrowserService: FileBrowserService,
    private _blockErrors: showHideErrorInterceptorService,
    private route: ActivatedRoute
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
      },
      hideSubHeader: true, //oculta subheaader de filtro
      columns: COLUMNS,
    };
    this.settings3 = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        edit: false,
        add: false,
        delete: true,
      },
      hideSubHeader: true,
      columns: { ...CCP_COLUMS_OFICIO },
    };
    // this.settings.columns = COLUMNS;
    // this.settings.actions = false;
  }

  ngOnInit(): void {
    localStorage.removeItem(this.nameStorageKeyArmedOffice);
    localStorage.removeItem(this.nameStorageDictationDate);
    this.setInitValuesToSave(); // INIT SAVE VARIABLES
    this.buildForm();
    this.cleanDataForm();
    this.showEnableTypeOffice = false;
    this.showScanForm = true;
    this.addresseeDataSelect = null;
    const token = this.authService.decodeToken();
    console.log(token);
    this.dataUserLoggedTokenData = token;
    // this.anotherSearchAppointment();
    if (token.preferred_username) {
      this.getUserDataLogged(
        token.preferred_username
          ? token.preferred_username.toLocaleUpperCase()
          : token.preferred_username
      );
    } else {
      this.alertInfo(
        'warning',
        'Error al obtener los datos del Usuario de la sesión actual',
        ''
      );
    }
  }

  setInitValuesToSave() {
    this._saveDictation = true; // Se actualiza el registro actual solamente
    this._saveDictation_loading = false;
    this._saveOfficeDictation = true; // Se actualiza el registro actual solamente
    this._saveOfficeDictation_loading = false;
    this._saveTextDictation = true; // Se actualiza el registro actual solamente
    this._saveTextDictation_loading = false;
    this._saveCopiesDictation = true; // Se actualiza el registro actual solamente
    this._saveCopiesDictation_loading = false;
    this._totalCopiesTo = 0;
  }

  initFormPostGetUserData() {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        console.log(params);
        console.log(this.paramsScreen);
        for (const key in this.paramsScreen) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            this.paramsScreen[key as keyof typeof this.paramsScreen] =
              params[key] ?? null;
          }
        }
        this.origin = params['origin2']
          ? params['origin2']
          : params['origin'] ?? null;
        this.origin3 = params['origin3'] ?? null;
        this.TIPO_VO = params['TIPO_VO'] ?? null;
        this.CONSULTA = params['CONSULTA'] ?? null;
        this.NO_EXP = params['NO_EXP'] ?? null;
        if (
          this.origin &&
          this.paramsScreen.TIPO != null &&
          this.paramsScreen.P_VALOR != null
        ) {
          // this.btnSearchAppointment();
        }
        console.log(params, this.paramsScreen);
      });
    if (this.paramsScreen) {
      if (this.paramsScreen.TIPO && this.paramsScreen.P_VALOR) {
        this.initForm();
      } else {
        console.log('SIN PARAMETROS');
        if (!this.origin) {
          // this.showSearchAppointment = true; // Habilitar pantalla de búsqueda de dictaminaciones
          // this.showSearchAppointment = true; // Habilitar pantalla de búsqueda de dictaminaciones
        } else {
          // this.alertInfo(
          //   'info',
          //   'Error en los paramétros',
          //   'Los paramétros No. Oficio: ' +
          //     this.paramsScreen.P_VALOR +
          //     ' y el Tipo Oficio: ' +
          //     this.paramsScreen.TIPO +
          //     ' al iniciar la pantalla son requeridos'
          // );
        }
      }
    }
  }

  getUserDataLogged(userId: string) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter(
      'user',
      userId == 'SIGEBIADMON' ? userId.toLocaleLowerCase() : userId
    );
    let subscription = this.svLegalOpinionsOfficeService
      .getInfoUserLogued(params.getParams())
      .subscribe({
        next: (res: any) => {
          console.log('USER INFO', res);
          this.dataUserLogged = res.data[0];
          // console.log(this.officeDictationData.city);
          // this.getCityByDetail(new ListParams(), true);
          this.initFormPostGetUserData();
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          this.alertInfo(
            'warning',
            'Error al obtener los datos del Usuario de la sesión actual',
            error.error.message
          );
          subscription.unsubscribe();
        },
      });
  }

  initForm() {
    this.setInitValuesToSave(); // INIT SAVE VARIABLES
    if (this.paramsScreen.TIPO == 'RESARCIMIENTO') {
      this.form.get('cveOfficeGenerate').enable();
    } else {
      this.form.get('cveOfficeGenerate').disable();
    }
    let body: IInitFormLegalOpinionOfficeBody = {
      p_valor: Number(this.paramsScreen.P_VALOR),
      tipo: this.paramsScreen.TIPO,
    };
    let subscription = this.svLegalOpinionsOfficeService
      .getInitFormDictation(body)
      .subscribe({
        next: (res: any) => {
          console.log('INIT FORM OFICIO', res);
          this.variables.identi = res['identi'];
          this.getInitForm2(body);
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          // this.alertInfo(
          //   'info',
          //   'Error al cargar la información inicial de la pantalla de acuerdo a los paramétros recibidos',
          //   'No se encontró el identificador'
          // );
          subscription.unsubscribe();
        },
      });
    this.btnSearchAppointment();
  }

  getInitForm2(body: any) {
    let subscription = this.svLegalOpinionsOfficeService
      .getInitFormDictation2(body)
      .subscribe({
        next: (res: any) => {
          console.log('INIT FORM OFICIO 2', res);
          this.variables.cveActa = res['cve_acta'];
          this.variables.fecha = res['fecha'];
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          // this.alertInfo(
          //   'info',
          //   'Error al cargar la información inicial de la pantalla de acuerdo a los paramétros recibidos',
          //   'No se encontrarón la Clave del Acta y la Fecha'
          // );
          subscription.unsubscribe();
        },
      });
  }

  cleanDataForm() {
    this.form.reset();
    this.formScan.reset();
    // this.formCopiesTo.reset();
    this.cityData = new DefaultSelect();
    this.issuingUser = new DefaultSelect();
    this.addressee = new DefaultSelect();
    this.userCopies1 = new DefaultSelect();
    this.userCopies2 = new DefaultSelect();
    this.expedientData = null;
    this.dictationData = null;
    this.officeDictationData = null;
    this.officeCopiesDictationData = null;
    this.tmpOfficeCopiesDictationData = null;
    this.officeTextDictationData = null;
    this.addresseeDataSelect = null;
    this.goodData = [];
    this.totalData = 0;
    this.dataTable.load([]);
    this.dataTable.refresh();
    this.totalCopiesTo = 2;
    this.enabledDataCopies();
    this.enabledDataOffice();
    this.form.get('numberNotary').enable();
    this.form.get('typeOffice').setValue('');
  }

  showMoreInformationField(show: boolean, option: number) {
    this.moreInfo1 = option == 1 ? show : false;
    this.moreInfo2 = option == 2 ? show : false;
    this.moreInfo3 = option == 3 ? show : false;
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      file: [
        { value: '', disabled: true },
        [Validators.maxLength(11), Validators.pattern(NUM_POSITIVE)],
      ],
      numberOfficeDic: [
        { value: '', disabled: true },
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern(NUM_POSITIVE),
        ],
      ],
      typeOffice: [{ value: '', disabled: true }],
      cveOfficeGenerate: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(100)],
      ],
      authorizedDic: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      issuingUser: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      name: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      addressee: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      nameAddressee: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      city: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      descriptionCity: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      introductoryParagraph: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(2000)],
      ],
      finalParagraph: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      moreInformation1: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      moreInformation2: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      moreInformation3: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(4000)],
      ],
      numberNotary: [{ value: '', disabled: false }, [Validators.maxLength(6)]],
      ccp_person: [{ value: '', disabled: false }],
      ccp_addressee: [
        { value: null, disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      ccp_TiPerson: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ],
      ccp_person_1: [{ value: '', disabled: false }],
      ccp_addressee_1: [
        { value: null, disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ], // SELECT
      ccp_TiPerson_1: [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
    });
    this.formScan = this.fb.group({
      scanningFoli: [
        { value: '', disabled: false },
        [Validators.pattern(NUM_POSITIVE), Validators.maxLength(11)],
      ],
    });

    this.formCcpOficio = this.fb.group({
      ccp: [null, [Validators.minLength(1)]], //*
      usuario: ['', [Validators.minLength(1)]], //*
      nombreUsuario: '',
      ccp2: [null, [Validators.minLength(1)]], //*
      usuario2: ['', [Validators.minLength(1)]], //*
      nombreUsuario2: '',
    });
  }

  continueSearchAppoinment(event: any) {
    console.log(event);
    this.showSearchAppointment = false;
    if (event) {
      if (event.id) {
        // this.cleanDataForm();
        // this.dictationData = event;
        // this.paramsScreen = {
        //   PAQUETE: '0',
        //   P_GEST_OK: '',
        //   CLAVE_OFICIO_ARMADA: this.dictationData.passOfficeArmy,
        //   P_NO_TRAMITE: '',
        //   TIPO: this.dictationData.typeDict,
        //   P_VALOR: this.dictationData.id.toString(),
        //   TIPO_VO: '',
        //   NO_EXP: '',
        //   CONSULTA: '',
        // };
        // console.log(this.dictationData, this.paramsScreen);
        // this.initForm();
        // this.callNextbtnSearchAppointment();
      }
    }
  }

  cancelEventSearch(event: any) {
    console.log(event);
    this.showSearchAppointment = false;
  }

  anotherSearchAppointment() {
    // this.showSearchAppointment = true;
  }

  btnSearchAppointment() {
    this.loading = true;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('typeDict', this.paramsScreen.TIPO);
    params.addFilter('id', this.paramsScreen.P_VALOR);
    // params['sortBy'] = 'nameCity:ASC';
    let subscription = this.svLegalOpinionsOfficeService
      .getDictations(params.getParams())
      .subscribe({
        next: data => {
          console.log('DICTAMEN', data);
          this.dictationData = data.data[0];
          try {
            localStorage.removeItem(this.nameStorageKeyArmedOffice);
            localStorage.removeItem(this.nameStorageDictationDate);
          } catch (error) {}
          subscription.unsubscribe();
          this.callNextbtnSearchAppointment();
          this.goodsByDictation
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.loadGoodsByOfficeDictation());
          // this.startLoopGoods(true); // Inicar Loop de bienes
        },
        error: error => {
          this.loading = false;
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  callNextbtnSearchAppointment() {
    this.setDataAppointment();
    this.getOfficeDictationData();
    // Call dictaminaciones por bien
    if (
      this.dictationTypeValidOption.includes(this.dictationData.typeDict) &&
      !this.variables.identi.includes('4')
    ) {
      this.form.get('typeOffice').enable();
      this.showEnableTypeOffice = true;
    }
  }

  setDataAppointment() {
    // this.blockSender = false;
    this._saveDictation = false; // Se actualiza el registro actual solamente
    this.form
      .get('cveOfficeGenerate')
      .setValue(this.dictationData.passOfficeArmy);
    this.form.get('cveOfficeGenerate').updateValueAndValidity();
    this.form.get('file').setValue(this.dictationData.expedientNumber);
    this.form.get('file').updateValueAndValidity();
    this.form.get('numberOfficeDic').setValue(this.dictationData.id);
    this.form.get('numberOfficeDic').updateValueAndValidity();
    this.showScanForm = false;
    // if (this._saveOfficeDictation) {
    //   this.form.get('issuingUser').setValue(this.dictationData.userDict); // Remitente
    //   this.form.get('issuingUser').updateValueAndValidity();
    // } else {
    //   this.form.get('issuingUser').setValue(this.officeDictationData.sender); // Remitente
    //   this.form.get('issuingUser').updateValueAndValidity();
    // }
    // if (this.dictationData.statusDict == 'DICTAMINADO') {
    //   this.form.get('issuingUser').disable();
    // }
    // this.getIssuingUserByDetail(new ListParams(), true);
    setTimeout(() => {
      this.formScan
        .get('scanningFoli')
        .setValue(this.dictationData.folioUniversal);
      this.formScan.get('scanningFoli').updateValueAndValidity();
      this.showScanForm = true;
    }, 200);
  }

  // SSF3_FIRMA_ELEC_DOCS
  getElectronicFirmData() {
    console.log(this.dictationData);
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('natureDocument', this.dictationData.typeDict);
    params.addFilter('documentNumber', this.dictationData.id);
    params.addFilter('documentType', this.dictationData.statusDict);
    let subscription = this.svLegalOpinionsOfficeService
      .getElectronicFirmData(params.getParams())
      .subscribe({
        next: data => {
          console.log('FIRMA ELECTRONICA', data);
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  // SSF3_FIRMA_ELEC_DOCS
  sendElectronicFirmData() {
    console.log(this.dictationData);
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('natureDocument', this.dictationData.typeDict);
    params.addFilter('documentNumber', this.dictationData.id);
    params.addFilter('documentType', this.officeDictationData.statusOf);
    this.svLegalOpinionsOfficeService
      .getElectronicFirmData(params.getParams())
      .subscribe({
        next: data => {
          console.log('COUNT FIRMA ELECTRONICA XML', data);
          this.officeDictationData.statusOf = 'ENVIADO';
          this.disabledDataOffice();
          this.disabledDataCopies();
          localStorage.removeItem(this.nameStorageKeyArmedOffice);
          localStorage.removeItem(this.nameStorageDictationDate);
          // this.deleteTempDictation(true);
          this.alertInfo(
            'success',
            'Se realizó la firma del dictamen',
            ''
          ).then(() => {
            this.pup_genera_pdf = true;
            // PUP_GENERA_PDF
            this.execute_PUP_GENERA_PDF();
          });
        },
        error: error => {
          console.log(error);
          if (error.status == 400) {
            let save = false;
            let obj: any = {
              ...this.dictationData,
            };
            // this.deleteTempDictation(true);
            let armedKey = localStorage.getItem(this.nameStorageKeyArmedOffice); // GET CLAVE_OFICIO_ARMADA
            if (armedKey) {
              obj['passOfficeArmy'] = armedKey;
              save = true;
            }
            let localDateDictation = localStorage.getItem(
              this.nameStorageDictationDate
            ); // GET FECHA_DICTAMEN
            if (localDateDictation) {
              let dateLocal = format(
                new Date(localDateDictation),
                'yyyy-MM-dd'
              );
              obj['dictDate'] = new Date(dateLocal);
              save = true;
            }
            localStorage.removeItem(this.nameStorageKeyArmedOffice);
            localStorage.removeItem(this.nameStorageDictationDate);
            if (save) {
              this.svLegalOpinionsOfficeService
                .updateDictations(obj)
                .subscribe({
                  next: data => {
                    console.log('UPDATE DICTAMEN', data);
                    const params = new FilterParams();
                    params.removeAllFilters();
                    params.addFilter('typeDict', this.paramsScreen.TIPO);
                    params.addFilter('id', this.paramsScreen.P_VALOR);
                    this.svLegalOpinionsOfficeService
                      .getDictations(params.getParams())
                      .subscribe({
                        next: data => {
                          console.log('DICTAMEN', data);
                          this.dictationData = data.data[0];
                          this.startLoopGoods(); // Inicar Loop de bienes
                        },
                        error: error => {
                          console.log(error);
                          this.alertInfo(
                            'error',
                            'Ocurrió un error al obtener el Dictamen',
                            error.error.message
                          );
                        },
                      });
                  },
                  error: error => {
                    console.log(error);
                    this.alertInfo(
                      'error',
                      'Ocurrió un error al actualizar el Dictamen',
                      error.error.message
                    );
                  },
                }); // SAVE DICTATION SIN CONSECUTIVO
            } else {
              this.startLoopGoods(); // Inicar Loop de bienes
            }
          } else {
            localStorage.removeItem(this.nameStorageKeyArmedOffice);
            localStorage.removeItem(this.nameStorageDictationDate);
            this.alertInfo(
              'warning',
              'No se encontró el archivo firmado. El documento no ha sido enviado',
              ''
            );
          }
        },
      });
  }

  returnStatusProcess(
    dataLength: number,
    count: number,
    dataCurrent: IDictationXGood1[]
  ) {
    if (this.goodLoopTmpData[count].good) {
      // Review Status Screen
      const params = new FilterParams();
      params.removeAllFilters();
      params.addFilter(
        'screenKey',
        this.dictationData.typeDict == 'DESTRUCCION'
          ? 'FACTJURDICTAMAS'
          : 'FACTJURDICTAMASG'
      );
      params.addFilter('typeDict', this.dictationData.typeDict);
      params.addFilter(
        'processExtSun',
        this.goodLoopTmpData[count].good.extDomProcess
      );
      params.addFilter(
        'Status.status',
        this.goodLoopTmpData[count].good.status
      );
      this.svLegalOpinionsOfficeService
        .getScreenStatusService(params.getParams())
        .subscribe({
          next: res => {
            console.log('REVIEW STATUS SCREEN', res);
            this.goodLoopCurrent++;
            if (dataLength == count + 1) {
              this.goodLoopPage++;
              this.controlGoodLoop([]);
            } else {
              count++;
              this.returnStatusProcess(dataLength, count, dataCurrent);
            }
          },
          error: error => {
            console.log(error);
            if (error.status == 400) {
              // Return Status
              let body: any = {
                pGoodNumber: this.goodLoopTmpData[count].good.goodId,
                pStatus: this.goodLoopTmpData[count].good.status,
              };
              this.svLegalOpinionsOfficeService
                .returnStatusProcess(body)
                .subscribe({
                  next: data => {
                    console.log('RETURN STATUS PROCESS', data);
                    if (data.data[0]) {
                      this.updateStatusGood(
                        dataLength,
                        count,
                        dataCurrent,
                        data.data[0].estatus,
                        this.goodLoopTmpData[count].good.goodId
                      );
                    } else {
                      this.goodLoopCurrent++;
                      if (dataLength == count + 1) {
                        this.goodLoopPage++;
                        this.controlGoodLoop([]);
                      } else {
                        count++;
                        this.returnStatusProcess(
                          dataLength,
                          count,
                          dataCurrent
                        );
                      }
                    }
                  },
                  error: error => {
                    console.log(error);
                    this.goodLoopCurrent++;
                    if (dataLength == count + 1) {
                      this.goodLoopPage++;
                      this.controlGoodLoop([]);
                    } else {
                      count++;
                      this.returnStatusProcess(dataLength, count, dataCurrent);
                    }
                    this.onLoadToast(
                      'error',
                      'No se encontró el estatus anterior del bien',
                      'Para el bien: ' + this.goodLoopTmpData[count].good.goodId
                    );
                  },
                });
            } else {
              this.goodLoopCurrent++;
              if (dataLength == count + 1) {
                this.goodLoopPage++;
                this.controlGoodLoop([]);
              } else {
                count++;
                this.returnStatusProcess(dataLength, count, dataCurrent);
              }
            }
          },
        });
    } else {
      this.goodLoopCurrent++;
      if (dataLength == count + 1) {
        this.goodLoopPage++;
        this.controlGoodLoop([]);
      } else {
        count++;
        this.returnStatusProcess(dataLength, count, dataCurrent);
      }
    }
  }

  getGoodListTMP() {
    console.log(this.goodLoopPage, this.goodLoopTotal, this.goodLoopCurrent);

    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('typeDict', this.dictationData.typeDict);
    params.addFilter('ofDictNumber', this.dictationData.id);
    params.limit = 10;
    params.page = this.goodLoopPage;
    this.svLegalOpinionsOfficeService.getGoods(params.getParams()).subscribe({
      next: res => {
        console.log('GOODS LIST TMP', res);
        // Object.assign(this.goodLoopTmpData, res.data);
        this.goodLoopTmpData = this.goodLoopTmpData.concat(res.data);
        console.log('TEST ARRAY ', this.goodLoopTmpData);

        // this.goodLoopTmpData res.data; // = res.data;
        this.goodLoopTotal = res.count;
        // this.controlGoodTMP(this.goodLoopTmpData);
        this.goodLoopCurrent =
          this.goodLoopCurrent + 10 > this.goodLoopTotal
            ? this.goodLoopTotal
            : this.goodLoopCurrent + 10;
        this.goodLoopPage++; // Next page
        if (this.goodLoopCurrent < this.goodLoopTotal) {
          this.getGoodListTMP();
        } else if ((this.goodLoopCurrent = this.goodLoopTotal)) {
          // FIN PROCESO
          // this._endProcess_LooopGood();
          this.controlGoodTMP([]);
        }
      },
      error: error => {
        console.log(error);
        this.goodLoopCurrent =
          this.goodLoopCurrent + 10 > this.goodLoopTotal
            ? this.goodLoopTotal
            : this.goodLoopCurrent + 10;
        this.goodLoopPage++; // Next page
        if (this.goodLoopCurrent < this.goodLoopTotal) {
          this.getGoodListTMP();
        } else if ((this.goodLoopCurrent = this.goodLoopTotal)) {
          // FIN PROCESO
          // this._endProcess_LooopGood();
          this.controlGoodTMP([]);
        }
      },
    });
  }

  controlGoodTMP(dataCurrent: IDictationXGood1[]) {
    console.log(dataCurrent);

    // if (dataCurrent.length > 0) {
    //   // this.returnStatusProcess(dataCurrent.length, 0, dataCurrent);
    // } else {
    if (this.goodLoopCurrent < this.goodLoopTotal) {
      this.getGoodListTMP();
    } else if ((this.goodLoopCurrent = this.goodLoopTotal)) {
      // FIN PROCESO
      console.log('FIN GOOD TMP', this.goodLoopTmpData);
    }
    // }
  }

  startLoopGoods(listGoods: boolean = false) {
    this.goodLoopCurrent = 1;
    this.goodLoopTotal = 0;
    this.goodLoopTmpData = [];
    this.goodLoopPage = 1;
    if (listGoods) {
      this.getGoodListTMP();
    } else {
      this.getLoopGoodList();
      // this.returnStatusProcess(this.goodLoopTotal, 0, this.goodLoopTmpData);
    }
  }

  getLoopGoodList() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('typeDict', this.dictationData.typeDict);
    params.addFilter('ofDictNumber', this.dictationData.id);
    params.limit = 10;
    params.page = this.goodLoopPage;
    this.svLegalOpinionsOfficeService.getGoods(params.getParams()).subscribe({
      next: res => {
        console.log('GOODS LIST', res);
        this.goodLoopTmpData = res.data;
        this.goodLoopTotal = res.count;
        this.controlGoodLoop(this.goodLoopTmpData);
      },
      error: error => {
        console.log(error);
        this.goodLoopCurrent =
          this.goodLoopCurrent + 10 > this.goodLoopTotal
            ? this.goodLoopTotal
            : this.goodLoopCurrent + 10;
        this.goodLoopPage++; // Next page
        if (this.goodLoopCurrent < this.goodLoopTotal) {
          this.getLoopGoodList();
        } else if ((this.goodLoopCurrent = this.goodLoopTotal)) {
          // FIN PROCESO
          // this._endProcess_LooopGood();
          this.controlGoodLoop([]);
        }
      },
    });
  }

  controlGoodLoop(dataCurrent: IDictationXGood1[]) {
    if (dataCurrent.length > 0) {
      this.returnStatusProcess(dataCurrent.length, 0, dataCurrent);
    } else {
      if (this.goodLoopCurrent < this.goodLoopTotal) {
        this.getLoopGoodList();
      } else if ((this.goodLoopCurrent = this.goodLoopTotal)) {
        // FIN PROCESO
        this._endProcess_LooopGood();
      }
    }
  }

  _endProcess_LooopGood() {
    this.goodsByDictation
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.loadGoodsByOfficeDictation());
  }

  updateStatusGood(
    dataLength: number,
    count: number,
    dataCurrent: IDictationXGood1[],
    statusGood: string,
    goodId: number
  ) {
    let body: any = {
      ...dataCurrent[count].good,
      status: statusGood,
      goodId: goodId,
    };
    console.log(body);

    this.svLegalOpinionsOfficeService.updateGood(body).subscribe({
      next: data => {
        console.log('UPDATE STATUS', data);
        this.goodLoopCurrent++;
        if (dataLength == count + 1) {
          this.goodLoopPage++;
          this.controlGoodLoop([]);
        } else {
          count++;
          this.returnStatusProcess(dataLength, count, dataCurrent);
        }
      },
      error: error => {
        console.log('ERROR UPDATE STATUS', error);
        this.goodLoopCurrent++;
        if (dataLength == count + 1) {
          this.goodLoopPage++;
          this.controlGoodLoop([]);
        } else {
          count++;
          this.returnStatusProcess(dataLength, count, dataCurrent);
        }
        this.onLoadToast(
          'error',
          'No se regresó el valor anterior del dictamen',
          'Para el bien: ' + this.goodLoopTmpData[count].good.goodId
        );
      },
    });
  }

  deleteTempDictation(onlydelete: boolean) {
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

  getOfficeDictationData() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('officialNumber', this.paramsScreen.P_VALOR);
    params.addFilter('typeDict', this.paramsScreen.TIPO);
    let subscription = this.svLegalOpinionsOfficeService
      .getOfficeDictation(params.getParams())
      .subscribe({
        next: data => {
          console.log('OFICIO DICTAMEN', data);
          this.officeDictationData = data.data[0];
          if (this.dictationData.passOfficeArmy) {
            if (
              this.officeDictationData.statusOf == 'ENVIADO' &&
              !this.dictationData.passOfficeArmy.toString().includes('?')
            ) {
              this.getElectronicFirmData();
            }
          }
          this.setDataOfficeDictation();
          this.getProcedureManagment();
          this.getExpedientData();
          this.getOfficeCopiesDictation();
          this.getOfficeTextDictation();
          subscription.unsubscribe();
        },
        error: error => {
          this.loading = false;
          this.getExpedientData();
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }
  setDataOfficeDictation() {
    this._saveOfficeDictation = false; // Se actualiza el registro actual solamente
    // this.form.get('issuingUser').setValue(this.officeDictationData.sender); // Remitente
    // this.form.get('issuingUser').updateValueAndValidity();
    // this.form.get('issuingUser').disable();
    // #############
    // if (this._saveOfficeDictation) {
    //   this.form.get('issuingUser').setValue(this.dictationData.userDict); // Remitente
    //   this.form.get('issuingUser').updateValueAndValidity();
    // } else {
    // }
    this.form.get('issuingUser').setValue(this.officeDictationData.sender); // Remitente
    this.form.get('issuingUser').updateValueAndValidity();
    if (this.dictationData.statusDict == 'DICTAMINADO') {
      this.form.get('issuingUser').disable();
    }
    if (
      this.officeDictationData.recipient == null ||
      this.officeDictationData.city == null ||
      this.officeDictationData.sender == null
    ) {
      this._valid_saveOfficeDictation = true;
    } else {
      this._valid_saveOfficeDictation = false;
    }
    // this.getIssuingUserByDetail(new ListParams(), true);
    this.form.get('addressee').setValue(this.officeDictationData.recipient); // Destinatario
    this.form.get('addressee').updateValueAndValidity();
    this.form.get('city').setValue(this.officeDictationData.city); // Ciudad
    this.form.get('city').updateValueAndValidity();
    console.log(this.officeDictationData.city, this.form.get('city').value);
    this.form
      .get('numberNotary')
      .setValue(this.officeDictationData.notaryNumber);
    this.form.get('numberNotary').updateValueAndValidity();
    this.form
      .get('introductoryParagraph')
      .setValue(this.officeDictationData.text1);
    this.form.get('introductoryParagraph').updateValueAndValidity();
    this.form.get('finalParagraph').setValue(this.officeDictationData.text2);
    this.form.get('finalParagraph').updateValueAndValidity();
    this.form
      .get('moreInformation1')
      .setValue(this.officeDictationData.text2To);
    this.form.get('moreInformation1').updateValueAndValidity();
    // Validar el texto3 de acuerdo al tipo de dictaminación
    this.officeDictationData =
      this.svLegalOpinionsOfficeService.getTexto3FromOfficeDictation(
        this.officeDictationData,
        this.form.get('typeOffice').value
      );
    this.form.get('moreInformation3').setValue(this.officeDictationData.text3);
    this.form.get('moreInformation3').updateValueAndValidity();
    if (this.officeDictationData.statusOf == 'ENVIADO') {
      this.blockSender = true;
      this.disabledDataOffice();
      this.disabledDataCopies();
      // this.form.get('numberNotary').disable();
    } else {
      this.blockSender = false;
      this.enabledDataOffice();
      this.enabledDataCopies();
      // this.form.get('numberNotary').enable();
    }
    console.log(
      this.form.get('issuingUser').value,
      'ISSUING',
      this.officeDictationData.recipient
    );
    this.getIssuingUserByDetail(
      new ListParams(),
      this.officeDictationData.sender ? true : false
    );
    this.getAddresseeByDetail(
      new ListParams(),
      this.officeDictationData.recipient ? true : false
    );
    this.getCityByDetail(
      new ListParams(),
      this.officeDictationData.city ? true : false
    );
  }

  enabledDataOffice() {
    // this.form.get('issuingUser').enable();
    this.form.get('addressee').enable();
    this.form.get('city').enable();
    this.form.get('introductoryParagraph').enable();
    this.form.get('finalParagraph').enable();
    this.form.get('moreInformation1').enable();
    this.form.get('moreInformation2').enable();
    this.form.get('moreInformation3').enable();
  }

  enabledDataCopies() {
    this.form.get('ccp_person').enable();
    this.form.get('ccp_addressee').enable();
    this.form.get('ccp_TiPerson').enable();
    this.form.get('ccp_person_1').enable();
    this.form.get('ccp_addressee_1').enable();
    this.form.get('ccp_TiPerson_1').enable();
  }

  disabledDataOffice() {
    // this.form.get('issuingUser').disable();
    this.form.get('addressee').disable();
    this.form.get('city').disable();
    this.form.get('introductoryParagraph').disable();
    this.form.get('finalParagraph').disable();
    this.form.get('moreInformation1').disable();
    this.form.get('moreInformation2').disable();
    this.form.get('moreInformation3').disable();
  }

  disabledDataCopies() {
    this.form.get('ccp_person').disable();
    this.form.get('ccp_addressee').disable();
    this.form.get('ccp_TiPerson').disable();
    this.form.get('ccp_person_1').disable();
    this.form.get('ccp_addressee_1').disable();
    this.form.get('ccp_TiPerson_1').disable();
  }

  getProcedureManagment() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('affairSij', SearchFilter.NULL, SearchFilter.NOT);
    params.addFilter('flierNumber', this.dictationData.wheelNumber);
    let subscription = this.svLegalOpinionsOfficeService
      .getProcedureManagement(params.getParams())
      .subscribe({
        next: data => {
          console.log('PROCEDURE MANAGEMENT', data);
          // Visible true
          this.form.get('numberNotary').enable();
          this.numberNotaryVisible = true;
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          this.form.get('numberNotary').disable();
          this.numberNotaryVisible = false;
          subscription.unsubscribe();
        },
      });
  }

  loadGoodsByOfficeDictation() {
    this.loadingGoods = true;
    this.totalData = 0;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('typeDict', this.paramsScreen.TIPO);
    params.addFilter('ofDictNumber', this.paramsScreen.P_VALOR);
    params.limit = this.goodsByDictation.value.limit;
    params.page = this.goodsByDictation.value.page;
    let subscription = this.svLegalOpinionsOfficeService
      .getGoods(params.getParams())
      .subscribe({
        next: res => {
          this.loadingGoods = false;
          console.log('GOODS', res);
          this.goodData = res.data;
          let dataResponse = res.data.map((i: any) => {
            i.good ? (i.good['amountDict'] = i.amountDict) : '';
            i.menaje && i.good ? (i.good['menaje'] = i.menaje['noGood']) : '';
            return i.good;
          });
          console.log(dataResponse);
          this.totalData = res.count;
          this.dataTable.load(dataResponse);
          this.dataTable.refresh();
          subscription.unsubscribe();
        },
        error: error => {
          this.loadingGoods = false;
          console.log(error);
          this.dataTable.load([]);
          this.dataTable.refresh();
          subscription.unsubscribe();
        },
      });
  }

  getExpedientData() {
    let paramsData = new ListParams();
    paramsData['filter.id'] = '$eq:' + this.dictationData.expedientNumber; // 791474; //
    let subscription = this.svLegalOpinionsOfficeService
      .getExpedient(paramsData)
      .subscribe({
        next: data => {
          console.log('EXPEDIENTE', data);
          this.expedientData = data.data[0];
          subscription.unsubscribe();
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  getOfficeCopiesDictation() {
    this.loadingCopiesDictation = true;
    this.officeCopiesDictationData = null;
    this.tmpOfficeCopiesDictationData = null;
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('numberOfDicta', this.officeDictationData.officialNumber);
    params.addFilter('typeDictamination', this.officeDictationData.typeDict);
    params.limit = 100;
    let subscription = this.svLegalOpinionsOfficeService
      .getOfficeCopiesDictation(params.getParams())
      .subscribe({
        next: async (resp: any) => {
          console.log('OFICIO COPIAS DICTAMEN', resp);
          let result = resp.data.map(async (data: any) => {
            if (data.personExtInt == 'I') {
              data['personExtInt_'] = 'INTERNO';
              data['userOrPerson'] = await this.getSenders2OfiM2___(
                data.recipientCopy
              );
            } else if (data.personExtInt == 'E') {
              data['personExtInt_'] = 'EXTERNO';
              data['userOrPerson'] = data.namePersonExt;
            }
          });
          Promise.all(result).then((data: any) => {
            this.officeCopiesDictationData = resp.data;
            this.tmpOfficeCopiesDictationData = resp.data;
            // Set copies data
            this.totalCopiesTo = resp.count;
            this._totalCopiesTo = resp.count;
            // this.buildCopiesToControls();
            // this.setDataOfficeCopiesDictation();
            subscription.unsubscribe();
            this.loadingCopiesDictation = false;
          });
        },
        error: error => {
          console.log(error);
          this.officeCopiesDictationData = null;
          this.tmpOfficeCopiesDictationData = null;
          subscription.unsubscribe();
          this.loadingCopiesDictation = false;
        },
      });
  }

  async getSenders2OfiM2___(user: any) {
    const params = new ListParams();
    params['filter.user'] = `$eq:${user}`;
    return new Promise((resolve, reject) => {
      this.securityService.getAllUsersTracker(params).subscribe(
        (data: any) => {
          let result = data.data.map(async (item: any) => {
            item['userAndName'] = item.user + ' - ' + item.name;
          });
          resolve(data.data[0].userAndName);
        },
        error => {
          resolve(null);
          // this.senders = new DefaultSelect();
        }
      );
    });
  }

  setDataOfficeCopiesDictation() {
    if (this.officeCopiesDictationData.length == 2) {
      this._saveCopiesDictation = false; // Se actualiza el registro actual solamente
    }
    this.officeCopiesDictationData.forEach((copiesData, index) => {
      console.log(copiesData);
      this.form
        .get('ccp_person' + (index == 0 ? '' : '_1'))
        .setValue(copiesData.personExtInt);
      this.form
        .get('ccp_person' + (index == 0 ? '' : '_1'))
        .updateValueAndValidity();
      if (copiesData.personExtInt == 'I') {
        this.form
          .get('ccp_addressee' + (index == 0 ? '' : '_1'))
          .setValue(copiesData.recipientCopy);
        this.form
          .get('ccp_addressee' + (index == 0 ? '' : '_1'))
          .updateValueAndValidity();
        setTimeout(() => {
          this.getUsersCopies(new ListParams(), index == 0 ? 1 : 2, true);
        }, 300);
      } else if (copiesData.personExtInt == 'E' && copiesData.namePersonExt) {
        this.form
          .get('ccp_TiPerson' + (index == 0 ? '' : '_1'))
          .setValue(copiesData.namePersonExt);
        this.form
          .get('ccp_TiPerson' + (index == 0 ? '' : '_1'))
          .updateValueAndValidity();
      }
    });
  }

  getOfficeTextDictation() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('dictatesNumber', this.officeDictationData.officialNumber);
    params.addFilter('rulingType', this.officeDictationData.typeDict);
    let subscription = this.svLegalOpinionsOfficeService
      .getOfficeTextDictation(params.getParams())
      .subscribe({
        next: data => {
          console.log('OFICIO TEXTOS DICTAMEN', data);
          this.officeTextDictationData = data.data[0];
          this.setOfficeTextDictation();
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          this.officeTextDictationData = null;
          subscription.unsubscribe();
        },
      });
  }

  setOfficeTextDictation() {
    this._saveTextDictation = false; // Se actualiza el registro actual solamente
    this.form
      .get('moreInformation2')
      .setValue(this.officeTextDictationData.textx);
    this.form.get('moreInformation2').updateValueAndValidity();
  }

  getCityByDetail(paramsData: ListParams, getByValue: boolean = false) {
    if (!this.dataUserLogged) {
      return;
    }
    console.log(this.form.get('city').value, 'CITY');
    if (this.form.get('city').value != this.dataUserLogged.user && getByValue) {
      // if (!this.dataUserLogged) {
      //   return;
      // }
      console.log(paramsData);
      const params = new FilterParams();
      if (paramsData['search'] == undefined || paramsData['search'] == null) {
        paramsData['search'] = '';
      }
      params.removeAllFilters();
      if (getByValue) {
        params.addFilter('idCity', this.form.get('city').value);
        // paramsData['filter.id_ciudad'] = this.form.get('city').value;
      } else {
        params.addFilter('nameCity', paramsData['search'], SearchFilter.LIKE);
        // paramsData['filter.leyenda_oficio'] = paramsData['search'];
      }
      params['sortBy'] = 'nameCity:ASC';
      // lovCitiesRegCity
      // .lovCitiesRegCity(
      //     { toolbar_user: this.dataUserLogged.user },
      //     paramsData
      //   )
      let subscription = this.svLegalOpinionsOfficeService
        .getCityByDetail(params.getParams())
        .subscribe({
          next: data => {
            this.cityData = new DefaultSelect(
              data.data.map(i => {
                i.nameAndId =
                  i.idCity + ' -- ' + i.nameCity + ' -- ' + i.legendOffice;
                return i;
              }),
              data.count
            );
            console.log(data, this.cityData);
            subscription.unsubscribe();
          },
          error: error => {
            this.cityData = new DefaultSelect();
            subscription.unsubscribe();
          },
        });
    } else {
      console.log(paramsData);
      const params = new FilterParams();
      if (paramsData['search'] == undefined || paramsData['search'] == null) {
        paramsData['search'] = '';
      }
      params.removeAllFilters();
      if (getByValue) {
        // params.addFilter('idCity', this.form.get('city').value);
        paramsData['filter.id_ciudad'] = this.form.get('city').value;
      } else {
        // params.addFilter('nameCity', paramsData['search'], SearchFilter.LIKE);
        paramsData['filter.leyenda_oficio'] = paramsData['search'];
      }
      // params['sortBy'] = 'nameCity:ASC';
      console.log(params, paramsData);
      // lovCitiesRegCity
      // .getCityByDetail(params.getParams())
      let subscription = this.svLegalOpinionsOfficeService
        .lovCitiesRegCity(
          { toolbar_user: this.dataUserLogged.user },
          paramsData
        )
        .subscribe({
          next: data => {
            this.cityData = new DefaultSelect(
              data.data.map((i: any) => {
                i['nameAndId'] = i.id_ciudad + ' -- ' + i.leyenda_oficio;
                i['idCity'] = i.id_ciudad;
                return i;
              }),
              data.count
            );
            console.log(data, this.cityData);
            subscription.unsubscribe();
          },
          error: error => {
            this.cityData = new DefaultSelect();
            subscription.unsubscribe();
          },
        });
    }
  }
  getIssuingUserByDetail(paramsData: ListParams, getByValue: boolean = false) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('id', this.form.get('issuingUser').value);
    } else {
      params.search = paramsData['search'];
      // params.addFilter('name', paramsData['search'], SearchFilter.LIKE);
    }
    params['sortBy'] = 'name:ASC';
    let subscription = this.svLegalOpinionsOfficeService
      .getIssuingUserByDetail(params.getParams())
      .subscribe({
        next: data => {
          this.issuingUser = new DefaultSelect(
            data.data.map(i => {
              i.name = i.id + ' -- ' + i.name;
              return i;
            }),
            data.count
          );
          console.log(data, this.issuingUser);
          subscription.unsubscribe();
        },
        error: error => {
          this.issuingUser = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }

  changeAddreseeDetail(event: any) {
    console.log(event);
    if (event) {
      this.addresseeDataSelect = event;
      if (event.user) {
        if (!this.officeDictationData) {
          this.officeDictationData = { ...this.officeDictationData };
        }
        this.officeDictationData.delegacionRecipientNumber =
          event.delegationNumber;
        event.delegationNumber;
        this.officeDictationData.recipientDepartmentNumber =
          event.departamentNumber;
        console.log(this.officeDictationData);
        this.officeDictationData.cveChargeRem =
          this.dataUserLoggedTokenData.siglasnivel4;
        // this.officeDictationData.sender
        // const params: any = new FilterParams();
        // params.removeAllFilters();
        // params.addFilter('user', event.user);
        // this.svLegalOpinionsOfficeService
        //   .getAllUsersTracker(params.getParams())
        //   .subscribe({
        //     next: data => {
        //       console.log(data);
        //       this.officeDictationData.cveChargeRem = data.data[0].postKey;
        //     },
        //     error: error => {},
        //   });
      }
    }
  }
  // DELEGACION Y DEPARTAMENTO EN DESTINATARIO
  getAddresseeByDetail(paramsData: ListParams, getByValue: boolean = false) {
    console.log(paramsData);

    if (paramsData['search'] == undefined || paramsData['search'] == null) {
      paramsData['search'] = '';
    }
    if (getByValue) {
      paramsData['filter.user'] = '$eq:' + this.form.get('addressee').value;
    } else {
      // paramsData['filter.userDetail.name'] = '$ilike:' + paramsData['search'];
    }
    delete paramsData['text'];
    paramsData['sortBy'] = 'userDetail.name:ASC';
    let subscription = this.svLegalOpinionsOfficeService
      .getAddresseeByDetail(paramsData)
      .subscribe({
        next: data => {
          this.addressee = new DefaultSelect(
            data.data.map(i => {
              i['description'] = i.user + ' -- ' + i.userDetail.name;
              return i;
            }),
            data.count
          );
          if (getByValue) {
            this.addresseeDataSelect = data.data[0];
            this.changeAddreseeDetail(data.data[0]);
          }
          console.log(data, this.addressee);
          subscription.unsubscribe();
        },
        error: error => {
          this.addressee = new DefaultSelect();
          subscription.unsubscribe();
        },
      });
  }

  getUsersCopies(
    paramsData: ListParams,
    ccp: number,
    getByValue: boolean = false
  ) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter(
        'id',
        this.form.get('ccp_addressee' + (ccp == 1 ? '' : '_1')).value
      );
    } else {
      params.search = paramsData['search'];
      // params.addFilter('name', paramsData['search'], SearchFilter.LIKE);
    }
    params['sortBy'] = 'name:ASC';
    let subscription = this.svLegalOpinionsOfficeService
      .getIssuingUserByDetail(params.getParams())
      .subscribe({
        next: data => {
          let tempDataUser = new DefaultSelect(
            data.data.map(i => {
              i.name = i.id + ' -- ' + i.name;
              return i;
            }),
            data.count
          );
          if (ccp == 1) {
            this.userCopies1 = tempDataUser;
          } else {
            this.userCopies2 = tempDataUser;
          }
          console.log(data, this.userCopies1);
          subscription.unsubscribe();
        },
        error: error => {
          if (ccp == 1) {
            this.userCopies1 = new DefaultSelect();
          } else {
            this.userCopies2 = new DefaultSelect();
          }
          subscription.unsubscribe();
        },
      });
  }

  changeTypeOffice(event: any) {
    // console.log(event);
    if (event) {
      console.log(event.target.value);
      if (event.target.value && this.dictationData) {
        this.officeDictationData =
          this.svLegalOpinionsOfficeService.getTextDefaultDictation(
            this.dictationData,
            this.expedientData,
            this.officeDictationData,
            event.target.value
          );
      }
    }
  }

  changeCopiesType(event: any, ccp: number) {
    console.log(event.target.value, ccp);
    if (ccp == 1) {
      console.log('CCP1');
      this.form.get('ccp_addressee').reset();
      this.form.get('ccp_TiPerson').reset();
      if (event.target.value == 'I') {
        this.form.get('ccp_addressee').enable();
        this.form.get('ccp_TiPerson').disable();
      } else if (event.target.value == 'E') {
        this.form.get('ccp_addressee').disable();
        this.form.get('ccp_TiPerson').enable();
      }
    } else {
      console.log('CCP2');
      this.form.get('ccp_addressee_1').reset();
      this.form.get('ccp_TiPerson_1').reset();
      if (event.target.value == 'I') {
        this.form.get('ccp_addressee_1').enable();
        this.form.get('ccp_TiPerson_1').disable();
      } else if (event.target.value == 'E') {
        this.form.get('ccp_addressee_1').disable();
        this.form.get('ccp_TiPerson_1').enable();
      }
    }
  }

  sendOffice(count: number = 0) {
    try {
      localStorage.removeItem(this.nameStorageKeyArmedOffice);
      localStorage.removeItem(this.nameStorageDictationDate);
    } catch (error) {}
    if (this.officeDictationData) {
      if (this.officeDictationData.statusOf == 'ENVIADO' && !this.blockSender) {
        this.btnDetail();
        return;
      }
    }
    this.pup_genera_xml = false;
    this.V_URL_OPEN_FIRM = '';
    console.log(this.form.get('issuingUser').value, this.dataUserLogged);
    if (count == 0) {
      this.setDataDictationSave();
    }
    if (this.blockSender) {
      return;
    }
    if (!this.officeDictationData) {
      this.alertInfo(
        'warning',
        'Se requiere cargar la información del Oficio para continuar',
        'Complete los campos requeridos y vuelva a intentar'
      );
      return;
    }
    if (!this.dictationData) {
      this.alertInfo(
        'warning',
        'Se requiere cargar la información de la Dictaminación para continuar',
        'Complete los campos requeridos y vuelva a intentar'
      );
      return;
    }
    if (!this.addresseeDataSelect) {
      this.alertInfo(
        'warning',
        'Se requiere seleccionar un Destinatario para continuar',
        'Selecciona un Destinatario y vuelve a intentar'
      );
      return;
    }
    if (this.form.get('issuingUser').value != this.dataUserLogged.user) {
      this.alertInfo(
        'warning',
        'El usuario actual no corresponde al campo de "Autoriza Dictaminación"',
        'Sólo el usuario del campo "Autoriza Dictaminación" puede realizar está acción'
      );
      return;
    }
    if (
      this.dictationData.delegationDictNumber !=
      this.dataUserLogged.delegationNumber
    ) {
      this.alertInfo(
        'warning',
        'La Delegación del usuario actual no corresponde a la Delegación del Dictamen',
        ''
      );
      return;
    }
    if (this.goodData.length == 0) {
      this.alertInfo(
        'warning',
        'Se requiere por lo menos un Bien Asociado',
        ''
      );
      return;
    }
    this.loadingSend = true;
    console.log('SEND OFFICE');
    // this.getElectronicFirmData()
    let body: ICopiesOfficeSendDictation = {
      vc_pantalla: this.screenKey,
      clave_oficio_armada: this.dictationData.passOfficeArmy, //this.dictationData.keyArmyNumber.toString(),
      estatus_of: this.officeDictationData.statusOf
        ? this.officeDictationData.statusOf
        : '',
      fec_dictaminacion: this.dictationData.dictDate,
      tipo_dictaminacion: this.dictationData.typeDict,
      identi: this.variables.identi,
      no_volante: this.dictationData.wheelNumber,
      no_of_dicta: this.dictationData.id,
      toolbar_no_delegacion: this.dataUserLogged.delegationNumber, // Data del usuario
      nom_dest: this.addresseeDataSelect.userDetail.name,
      destinatario: this.officeDictationData.recipient,
      // no_clasif_bien: null, // Bienes
      // no_bien: null, // Bienes
      no_departamento_destinatario: Number(
        this.officeDictationData.recipientDepartmentNumber
      ),
      no_delegacion_destinatario: Number(
        this.officeDictationData.delegacionRecipientNumber
      ),
      no_delegacion_dictam: this.dictationData.delegationDictNumber, // Data del usuario
      tipo: this.paramsScreen.TIPO,
      usuario:
        this.dataUserLogged.user == 'SIGEBIADMON'
          ? this.dataUserLogged.user.toLocaleLowerCase()
          : this.dataUserLogged.user, // Data del usuario
      ciudad: this.officeDictationData.city.toString(),
      // iden: null, // Bienes
      num_clave_armada: this.dictationData.keyArmyNumber, // :DICTAMINACIONES.NUM_CLAVE_ARMADA
      toolbar_no_departamento: this.dataUserLogged.departamentNumber, // Data del usuario
      toolbar_no_subdelegacion: this.dataUserLogged.subdelegationNumber, // Data del usuario
      estatus_dictaminacion: this.dictationData.statusDict,
      // proceso_ext_dom: null, // Bienes
      paquete: Number(this.paramsScreen.PAQUETE),
    };
    console.log('SEND ---- BODY ', body);
    if (count == 0) {
      this.totalCurrent = 1;
      this.totalCorrect = 0;
      this.totalIncorrect = 0;
    }
    setTimeout(() => {
      localStorage.setItem(
        this.nameStorageKeyArmedOffice,
        this.dictationData.passOfficeArmy
      ); // SAVE CLAVE_OFICIO_ARMADA
      console.log(this.dictationData.dictDate);
      if (this.dictationData.dictDate) {
        localStorage.setItem(
          this.nameStorageDictationDate,
          this.dictationData.dictDate.toString()
        ); // SAVE FECHA_DICTAMEN
      }
    }, 300);
    this.sendGoodDataToSendOffice(count, body);
  }

  sendGoodDataToSendOffice(count: number, body: any) {
    let infoGood = this.goodData[count];
    // body.no_clasif_bien = infoGood.good.goodClassNumber;
    // body.no_bien = infoGood.good.goodId;
    // body.iden = infoGood.good.identifier;
    // body.proceso_ext_dom = infoGood.good.extDomProcess;
    // console.log(
    //   'COPIAS OFICIO DICTAMEN',
    //   count,
    //   this.totalCurrent,
    //   this.goodData.length,
    //   this.totalData
    // );
    this.sendOfficeAndGoodData(count, body);
    // console.log(body);
  }

  sendOfficeAndGoodData(count: number, body: any) {
    this.bodyCurrent = body; // Set current body
    // console.log(
    //   'COPIAS OFICIO DICTAMEN',
    //   count,
    //   this.totalCurrent,
    //   this.goodData.length,
    //   this.totalData
    // );
    let subscription = this.svLegalOpinionsOfficeService
      .getCopiesOfficeSendDictation(body)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          // count++;
          // this.totalCurrent++;
          // this.totalCorrect++;
          // console.log(
          //   'COPIAS OFICIO DICTAMEN',
          //   res,
          //   count,
          //   this.totalCurrent,
          //   this.goodData.length,
          //   this.totalData
          // );
          this.validResponseSendOffice(res, count);
          // if (this.totalData > count) {
          //   // this.sendOffice(count);
          // }
          // if (this.totalData == count) {
          //   this.loadingSend = false;
          //   // this.alertInfo(
          //   //   'info',
          //   //   'Se enviaron correctamente ' +
          //   //     this.totalCorrect +
          //   //     ' Bien(es) de ' +
          //   //     this.totalData +
          //   //     '. Con ' +
          //   //     this.totalIncorrect +
          //   //     ' Error(es)',
          //   //   ''
          //   // );
          // }
          // subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          this.loadingSend = false;
          this.onLoadToast('success', error.error.message, '');
          // count++;
          // this.totalCurrent++;
          // this.totalIncorrect++;
          // console.log(
          //   error,
          //   count,
          //   this.totalCurrent,
          //   this.goodData.length,
          //   this.totalData
          // );
          // if (error.status == 400) {
          //   this.onLoadToast(
          //     'warning',
          //     error.error.message,
          //     'Error para el bien: ' + body.no_bien
          //   );
          // }
          // if (this.totalData > count) {
          //   this.sendOffice(count);
          // }
          // if (this.totalData == count) {
          //   this.loadingSend = false;
          //   // this.alertInfo(
          //   //   'info',
          //   //   'Se enviaron correctamente ' +
          //   //     this.totalCorrect +
          //   //     ' Bien(es) de ' +
          //   //     this.totalData +
          //   //     '. Con ' +
          //   //     this.totalIncorrect +
          //   //     ' Error(es)',
          //   //   ''
          //   // );
          // }
          // subscription.unsubscribe();
        },
      });
  }

  validResponseSendOffice(response: any, count: number) {
    console.log('RESPONSE SEND ', response);
    if (response.procedimiento) {
      switch (response.procedimiento) {
        case 'PUP_XML_DICTAMINADO':
          // PUP_XML_DICTAMINADO
          // SE DETIENE PROCESO
          this.getElectronicFirmCount_PUP_XML_DICTAMINADO();
          break;
        case 'PA_VALIDA_CAMBIO_ESTATUS':
          // PA_VALIDA_CAMBIO_ESTATUS
          // CONTINUA PROCESO
          if (count > -1) {
            this.execute_PA_VALIDA_CAMBIO_ESTATUS();
          } else {
            this.loadingSend = false;
          }
          break;
        case 'PUP_LLAMA_VALIDACION':
          // PUP_LLAMA_VALIDACION
          // SE DETIENE PROCESO
          this.onLoadToast(
            'error',
            'Se encontraron bienes sin información requerida para este proceso ',
            ''
          );
          // SE DETIENE PROCESO
          this.execute_PUP_LLAMA_VALIDACION();
          break;
        case 'PUP_GEN_MASIV':
          // PUP_GEN_MASIV
          // ULTIMA CONDICION PARA TERMINAR
          this.totalItemsPUP_GEN_MASIV = 0;
          this.currentItemPUP_GEN_MASIV = 0;
          this.currentPagePUP_GEN_MASIV = 1;
          this.execute_PUP_GEN_MASIV();
          break;
        default:
          // VALID COMPLETE RESPONSE
          this.validCompleteResponseSend(response, count);
          break;
      }
    } else {
      if (this.totalData > count) {
        // this.sendOffice(count);
      }
    }
  }

  validCompleteResponseSend(response: any, count: number) {
    // if (response.message.includes('Multiples procedures por ejecutar')) {
    if (isArray(response.procedimiento)) {
      if ((response.procedimiento.length = 2)) {
        // PUP_GENERA_XML y luego PUP_GENERA_PDF
        this.execute_PUP_GENERA_XML();
      } else {
        this.loadingSend = false;
        // PUP_GENERA_PDF
        this.execute_PUP_GENERA_PDF();
      }
    } else {
      if (response.estatus_of == 'ENVIADO') {
        this.loadingSend = false;
        this.blockSender = true;
        this.onLoadToast('success', 'Dictamen enviado correctamente', '');
      }
    }
    // } else {
    // this.sendOffice(count);
    // }
  }

  /**
   * EJECUTAR PROCESO PUP_LLAMA_VALIDACION
   * @param event PUP_LLAMA_VALIDACION
   * @returns
   */

  execute_PA_VALIDA_CAMBIO_ESTATUS() {
    let body: IValidaCambioEstatus = {
      p1: 2,
      p2: this.dictationData.id,
      p3: this.paramsScreen.TIPO,
      p4: null,
    };
    this.svLegalOpinionsOfficeService.getPAValidaCambio(body).subscribe({
      next: data => {
        console.log(data);
        this.bodyCurrent['valida_estatus'] = data['P5'];
        this.loadingSend = false;
        this.loadingSend = true;
        this.sendAgainCopiesOffice();
        // console.log(this.totalCurrent - 2, this.bodyCurrent);
        // this.sendOfficeAndGoodData(this.totalCurrent - 2, this.bodyCurrent);
        // if (this.totalData > this.totalCurrent - 2) {
        // }
      },
      error: error => {
        console.log(error);
        this.loadingSend = false;
        this.onLoadToast(
          'error',
          'Ocurrió un error al validar si el Dictamen ha sido enviado',
          error.error.message
        );
      },
    });
  }

  sendAgainCopiesOffice() {
    this.svLegalOpinionsOfficeService
      .getCopiesOfficeSendDictation(this.bodyCurrent)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.validResponseSendOffice(res, -1);
        },
        error: error => {
          this.loadingSend = false;
          console.log(error);
          this.onLoadToast(
            'error',
            'Ocurrió un error al validar si el Dictamen ha sido enviado',
            error.error.message
          );
        },
      });
  }

  /**
   * END PUP_LLAMA_VALIDACION
   */

  /**
   * EJECUTAR PROCESO PUP_GENERA_XML
   * @param event PUP_GENERA_XML
   * @returns
   */

  execute_PUP_GENERA_XML() {
    this.V_URL_OPEN_FIRM = '';
    this.pup_genera_xml = true;
    this.objDetail = {
      c_ESTATUS_OF: this.officeDictationData
        ? this.officeDictationData.statusOf
          ? this.officeDictationData.statusOf
          : 'ENVIADO'
        : 'ENVIADO',
      V_NOMBRE: this.dictationData.passOfficeArmy
        .replaceAll('/', '-')
        .replaceAll('?', '0')
        .replaceAll(' ', ''),
    };
    console.log(this.objDetail);
    this.getParameters_PUP_GENERA_XML(false);
  }

  getParameters_PUP_GENERA_XML(onlyDetail: boolean) {
    const paramsData = new ListParams();
    paramsData['filter.id'] = '$eq:SSF3_FIRMA_ELEC_DOCS';
    this.svLegalOpinionsOfficeService.getParameters(paramsData).subscribe({
      next: data => {
        console.log('PARAMETERS', data);
        this.objDetail['V_ARCHOSAL'] =
          data.data[0].finalValue + this.objDetail.V_NOMBRE + '.XML';
        this.V_URL_OPEN_FIRM = `${data.data[0].initialValue}dictamen=${this.objDetail.V_NOMBRE}&NATURALEZA_DOC=${this.dictationData.typeDict}&NO_DOCUMENTO=${this.dictationData.id}&TIPO_DOCUMENTO=${this.objDetail.c_ESTATUS_OF}`;
        console.log(this.V_URL_OPEN_FIRM);
        this.getCountElectronicFirms_PUP_GENERA_XML(onlyDetail);
      },
      error: error => {
        this.pup_genera_xml = false;
        this.loadingSend = false;
        console.log(error);
        this.onLoadToast(
          'error',
          'No se encontró la ruta para depositar el XML',
          error.error.message
        );
      },
    });
  }

  getCountElectronicFirms_PUP_GENERA_XML(onlyDetail: boolean) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('natureDocument', this.dictationData.typeDict);
    params.addFilter('documentNumber', this.dictationData.id);
    params.addFilter('documentType', this.officeDictationData.statusOf);
    this.svLegalOpinionsOfficeService
      .getElectronicFirmData(params.getParams())
      .subscribe({
        next: data => {
          console.log('FIRMA ELECTRONICA', data);
          if (data.count > 0) {
            // DELETE SSF3_FIRMA_ELEC_DOCS
            this.runConditionReports(false);
          } else {
            this.runConditionReports(false);
          }
        },
        error: error => {
          console.log(error);
          if (error.status == 400) {
            this.runConditionReports(false);
          } else {
            this.pup_genera_xml = false;
            this.loadingSend = false;
            this.onLoadToast(
              'error',
              'Ocurrió un error al validar la Firma Electrónica',
              error.error.message
            );
          }
        },
      });
  }

  /**
   * END PUP_GENERA_XML
   */

  /**
   * EJECUTAR PROCESO PUP_LLAMA_VALIDACION
   * @param event PUP_LLAMA_VALIDACION
   * @returns
   */

  execute_PUP_LLAMA_VALIDACION() {
    this.loadingSend = false;
    // Call form FATRIBREQUERIDO
    // this.alertInfo('info', 'Se llama la pantalla FATRIBREQUERIDO', '');
    this.router.navigate(
      ['/pages/general-processes/goods-with-required-information'],
      {
        queryParams: {
          origin: this.screenKey,
          TIPO_PROC: 2,
          NO_INDICADOR: this.dictationData.id,
          origin2: this.origin,
          origin3: this.origin3,
          ...this.paramsScreen,
        },
      }
    );
  }

  /**
   * END PUP_LLAMA_VALIDACION
   */

  /**
   * EJECUTAR PROCESO PUP_GEN_MASIV
   * @param event PUP_GEN_MASIV
   * @returns
   */

  execute_PUP_GEN_MASIV() {
    let obj = {
      pcNoPaquete: this.paramsScreen.PAQUETE,
      pcNoExpediente: this.dictationData.expedientNumber,
    };
    this.svLegalOpinionsOfficeService.pupGenMasiv(obj).subscribe({
      next: data => {
        console.log('PUP GEN MASIV', data);
        // INSERT INTO TMP_EXP_DESAHOGOB
        // LLAMAR LA FUNCION PA_CARGA_MAS_DESAHOGOB
        this.listResponseDataPayments(data.data);
      },
      error: error => {
        console.log(error);
        this.loadingSend = false;
      },
    });
  }

  listResponseDataPayments(data: any[]) {
    if (data.length > 0) {
      this.sendData_TMP_EXP_DESAHOGOB_Function(data.length, 0, data);
    } else {
      if (this.currentItemPUP_GEN_MASIV < this.totalItemsPUP_GEN_MASIV) {
        this.execute_PUP_GEN_MASIV();
      } else if (
        (this.currentItemPUP_GEN_MASIV = this.totalItemsPUP_GEN_MASIV)
      ) {
        // FIN PROCESO
        this.loadingSend = false;
      }
    }
  }

  async sendData_TMP_EXP_DESAHOGOB_Function(
    dataLength: number,
    count: number,
    dataComplete: any[]
  ) {
    let bodyData: ITmpExpDesahogoB = {
      goodNumber: dataComplete[count].no_bien,
      numberProceedings: dataComplete[count].no_expediente,
    };
    this.svLegalOpinionsOfficeService
      .createTmpExpDesahogoB(bodyData)
      .subscribe({
        next: (res: any) => {
          this.currentItemPUP_GEN_MASIV++;
          if (dataLength == count + 1) {
            this.currentPagePUP_GEN_MASIV++;
            this.listResponseDataPayments([]);
          } else {
            count++;
            this.sendData_TMP_EXP_DESAHOGOB_Function(
              dataLength,
              count,
              dataComplete
            );
          }
        },
        error: err => {
          this.currentItemPUP_GEN_MASIV++;
          if (dataLength == count + 1) {
            this.currentPagePUP_GEN_MASIV++;
            this.listResponseDataPayments([]);
          } else {
            count++;
            this.sendData_TMP_EXP_DESAHOGOB_Function(
              dataLength,
              count,
              dataComplete
            );
          }
        },
      });
  }

  execute_PA_CARGA_MAS_DESAHOGOB_PUP_GEN_MASIV() {
    // PA_CARGA_MAS_DESAHOGOB
    // let obj = {
    //   pcNoPaquete: this.paramsScreen.PAQUETE,
    //   pcNoExpediente: this.dictationData.expedientNumber,
    // };
    // this.svLegalOpinionsOfficeService.pupGenMasiv(obj).subscribe({
    //   next: data => {
    //     console.log('PUP GEN MASIV', data);
    //     // INSERT INTO TMP_EXP_DESAHOGOB
    //     // LLAMAR LA FUNCION PA_CARGA_MAS_DESAHOGOB
    //     this.listResponseDataPayments(data.data);
    //   },
    //   error: error => {
    //     console.log(error);
    //   },
    // });
  }

  /**
   * END PUP_GEN_MASIV
   */

  /**
   * EJECUTAR PROCESO PUP_XML_DICTAMINADO
   * @param event PUP_XML_DICTAMINADO
   * @returns
   */

  // SSF3_FIRMA_ELEC_DOCS
  getElectronicFirmCount_PUP_XML_DICTAMINADO() {
    // Obtener datos de firma electrónica
    this.getElectronicFirmCount(false);
  }

  getParameters_PUP_XML_DICTAMINADO(v_COUNT: number) {
    this.V_ARCHOSAL = '';
    const paramsData = new ListParams();
    paramsData['filter.id'] = '$eq:SSF3_FIRMA_ELEC_DOCS';
    this.svLegalOpinionsOfficeService.getParameters(paramsData).subscribe({
      next: data => {
        console.log('PARAMETERS', data);
        this.V_ARCHOSAL =
          data.data[0].finalValue + this.objDetail.V_NOMBRE + '.XML';
        if (v_COUNT > 0) {
          this.deleteElectronicFirm_PUP_XML_DICTAMINADO();
        } else {
          this.loadingSend = false;
        }
      },
      error: error => {
        console.log(error);
        this.loadingSend = false;
        this.onLoadToast(
          'error',
          'No se encontró la ruta para depositar el XML',
          error.error.message
        );
      },
    });
  }

  // SSF3_FIRMA_ELEC_DOCS
  deleteElectronicFirm_PUP_XML_DICTAMINADO() {
    this.runConditionReports();
    // const params = new FilterParams();
    // params.removeAllFilters();
    // params.addFilter('natureDocument', this.dictationData.typeDict);
    // params.addFilter('documentNumber', this.dictationData.id);
    // params.addFilter('documentType', this.dictationData.statusDict);
    // this.svLegalOpinionsOfficeService
    //   .deleteElectronicFirmData(params.getParams())
    //   .subscribe({
    //     next: data => {
    //       console.log('DELETE FIRMA ELECTRONICA', data);
    //     },
    //     error: error => {
    //       console.log(error);
    //     },
    //   });
  }

  insertTMPDictation_PUP_XML_DICTAMINADO() {
    let obj: ITmpDictationCreate = {
      id: this.dictationData.id,
      typeDict: this.dictationData.typeDict,
      keyOfficeArmA: this.dictationData.passOfficeArmy,
      statusOf: this.dictationData.statusDict,
    };
    this.svLegalOpinionsOfficeService.createTmpDictation(obj).subscribe({
      next: data => {
        console.log('TMP DICTAMEN', data);
        // Se firma el documento
        // this.alertInfo('info', 'Hacer clic al terminar de firmar', '')
        //   .then(() => {

        //   });
      },
      error: error => {
        console.log(error);
        this.onLoadToast(
          'error',
          'No se realizó la inserción en la tabla de validación firma electrónica',
          error.error.message
        );
      },
    });
  }

  postFirm_PUP_XML_DICTAMINADO() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('natureDocument', this.dictationData.typeDict);
    params.addFilter('documentNumber', this.dictationData.id);
    params.addFilter('documentType', this.officeDictationData.statusOf);
    this.svLegalOpinionsOfficeService
      .getElectronicFirmData(params.getParams())
      .subscribe({
        next: data => {
          console.log('POST FIRMA ELECTRONICA', data);
          if (data.count > 0) {
            // this.onLoadToast(
            //   'error',
            //   'Se realizó la firma del dictamen',
            //   ''
            // );
            // Delete Tmp Dictaminacion
            this.deleteTmpDictation_PUP_XML_DICTAMINADO(true);
          }
        },
        error: error => {
          console.log(error);
          if (error.status == 400) {
            // Delete Tmp Dictaminacion
            this.deleteTmpDictation_PUP_XML_DICTAMINADO();
          }
        },
      });
  }

  deleteTmpDictation_PUP_XML_DICTAMINADO(generatePdf: boolean = false) {
    this.svLegalOpinionsOfficeService
      .deleteTmpDictation(this.dictationData.id)
      .subscribe({
        next: data => {
          console.log('DELETE TMP DICTAMEN', data);
          if (generatePdf) {
            // PUP_GENERA_PDF
            this.execute_PUP_GENERA_PDF();
          }
        },
        error: error => {
          console.log(error);
          this.alertInfo(
            'error',
            'No se encontró el archivo firmado. El documento no ha sido enviado',
            error.error.message
          );
        },
      });
  }

  /**
   * END PUP_XML_DICTAMINADO
   */

  /**
   * EJECUTAR PROCESO PUP_GENERA_PDF
   * @param event PUP_GENERA_PDF
   * @returns
   */
  // MANDA LLAMAR REPORTES Y EMPIEZA DESDE BOTON DETALLE
  execute_PUP_GENERA_PDF() {
    // LLAMAR LOS REPORTES DE ACUERDO A LAS VALIDACIONES
    // CARGAR EL PDF COMO EN OFICIALIA DE PARTES --- SUBIR ARCHIVOS AL SERVIDOR
    this.pup_genera_xml = false;
    this.btnDetail();
  }

  /**
   * END PUP_GENERA_PDF
   */

  viewPictures(event: any) {
    console.log(event);
    if (!this.dictationData.wheelNumber) {
      this.onLoadToast(
        'error',
        'Error',
        'Este trámite no tiene volante asignado'
      );
      return;
    }
    this.getDocumentsByFlyer(this.dictationData.wheelNumber);
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
    this._blockErrors.blockAllErrors = true;
    // const formData = new FormData();
    // formData.append('file', blobFile, nameAndExtension);
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
          // this.updateSheets();
          this.files = [];
          this.loadImages(this.folio).subscribe(() => {
            this.updateSheets();
          });
        },
      });
  }

  updateSheets() {
    const token = this.authService.decodeToken();
    let scanStatus = null;
    const sheets = `${this.files.length}`;
    if (this.files.length > 0) {
      scanStatus = 'ESCANEADO';
    }
    const userRegistersScan = token?.preferred_username?.toUpperCase();
    const dateRegistrationScan = new Date();
    this.documentsService
      .update(this.folio, {
        sheets,
        scanStatus,
        userRegistersScan,
        dateRegistrationScan,
      })
      .subscribe(() => {
        // const params = this.documentsParams.getValue();
        // this.documentsParams.next(params);
      });
  }
  loadImages(folio: string | number) {
    return this.getFileNamesByFolio(folio).pipe(
      catchError(error => {
        if (error.status >= 500) {
        }
        return throwError(() => error);
      }),
      map(response => response.data.map(element => element.name)),
      tap(files => {
        this.files = files;
      })
    );
  }
  getFileNamesByFolio(folio: number | string) {
    return this.fileBrowserService.getFilenamesFromFolio(folio).pipe(
      catchError(error => {
        this.files = [];
        return throwError(() => error);
      })
    );
  }

  openDocumentsModal(flyerNum: string | number, title: string) {
    const params = new FilterParams();
    params.addFilter('flyerNumber', flyerNum);
    const $params = new BehaviorSubject(params);
    const $obs = this.documentsService.getAllFilter;
    const service = this.documentsService;
    const columns = RELATED_FOLIO_COLUMNS;
    // const body = {
    //   proceedingsNum: this.dictationData.expedientNumber,
    //   flierNum: this.dictationData.wheelNumber,
    // };
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        $obs,
        service,
        columns,
        title,
        $params,
        proceedingsNumber: this.dictationData.expedientNumber,
        wheelNumber: this.dictationData.wheelNumber,
        showConfirmButton: true,
      },
    };
    return this.modalService.show(
      ModalScanningFoilTableComponent<IDocuments>,
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
    // if (document.id != this.dictationData.folioUniversal) {
    // if (document.id) {
    //   folio = this.dictationData.folioUniversal;
    // }
    if (document.associateUniversalFolio) {
      folio = document.associateUniversalFolio;
    }
    if (!folio && this.folio) {
      folio = this.folio;
    }
    console.log('PICTURES ', folio, document);
    const config = {
      ...MODAL_CONFIG,
      ignoreBackdropClick: false,
      initialState: {
        folio,
      },
    };
    this.modalService.show(DocumentsViewerByFolioComponent, config);
  }

  btnDetail() {
    console.log(
      'SAVE BOOLEAN ',
      this._saveOfficeDictation,
      this._valid_saveOfficeDictation
    );

    if (this._saveOfficeDictation || this._valid_saveOfficeDictation) {
      this.alertInfo(
        'warning',
        'No se ha guardado la información para consultar el reporte.',
        'Favor de guardar'
      );
      return;
    }
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   this.alert(
    //     'warning',
    //     'Complete los campos requeridos correctamente e intente nuevamente',
    //     ''
    //   );
    //   return;
    // }
    // this.setDataDictationSave(true);
    this.loadDetail = true;
    this.objDetail = {
      c_ESTATUS_OF: 'ENVIADO',
      V_NOMBRE: this.dictationData.passOfficeArmy
        .replaceAll('/', '-')
        .replaceAll('?', '0')
        .replaceAll(' ', ''),
      vCLAVE_ARMADA: '',
    };
    console.log(this.objDetail);
    this.getParameters();
  }

  getParameters() {
    const paramsData = new ListParams();
    paramsData['filter.id'] = '$eq:SSF3_FIRMA_ELEC_DOCS';
    this.svLegalOpinionsOfficeService.getParameters(paramsData).subscribe({
      next: data => {
        console.log('PARAMETERS', data);
        this.objDetail['V_ARCHOSAL'] =
          data.data[0].finalValue + this.objDetail.V_NOMBRE + '.XML';
        this.reviewValidations();
      },
      error: error => {
        console.log(error);
        this.loadDetail = false;
        this.pup_genera_pdf = false;
        this.onLoadToast(
          'error',
          'No se encontró la ruta para depositar el XML',
          error.error.message
        );
      },
    });
  }

  reviewValidations() {
    if (this.dictationData.passOfficeArmy) {
      // CLAVE OFICIO ARMADA NOT NULL
      if (
        !this.dictationData.passOfficeArmy.includes('?') &&
        this.officeDictationData.statusOf == 'ENVIADO'
      ) {
        // Obtener datos de firma electrónica
        this.getElectronicFirmCount();
      } else {
        // Llamar reportes de acuerdo a validaciones
        this.runConditionReports();
      }
    } else {
      // CLAVE OFICIO ARMADA NULL
      this.objDetail['vCLAVE_ARMADA'] = '';
      this.objDetail['ETAPA'] = '';
      if (this.dictationData.dictDate) {
        this.getEtapaByDictation();
      } else {
        this.loadDetail = false;
        this.pup_genera_pdf = false;
        this.alert(
          'warning',
          'El Dictamen no tiene una fecha: ' + this.dictationData.dictDate,
          ''
        );
      }
    }
  }

  getEtapaByDictation() {
    const paramsData = new ListParams();
    paramsData['date'] = format(this.dictationData.dictDate, 'dd/MM/yyyy');
    this.svLegalOpinionsOfficeService
      .getEtapaByDictation(paramsData)
      .subscribe({
        next: (data: any) => {
          console.log('FIRMA ELECTRONICA', data);
          this.objDetail['ETAPA'] = data.data.stagecreated;
          if (this.paramsScreen.TIPO == 'PROCEDENCIA') {
            // Realiza peticiones a cursores
            this.cuEmisora();
          } else {
            this.continuationOfMakeArmyKey();
          }
        },
        error: error => {
          this.loadDetail = false;
          this.pup_genera_pdf = false;
          console.log(error);
          this.alert(
            'warning',
            'Error al obtener la Etapa a partir de la Fecha de Dictaminación',
            error.error.message
          );
        },
      });
  }

  getElectronicFirmCount(onlyDetail: boolean = true) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('natureDocument', this.dictationData.typeDict);
    params.addFilter('documentNumber', this.dictationData.id);
    if (onlyDetail) {
      params.addFilter('documentType', 'ENVIADO');
    } else {
      params.addFilter('documentType', this.officeDictationData.statusOf);
    }
    this.svLegalOpinionsOfficeService
      .getElectronicFirmData(params.getParams())
      .subscribe({
        next: data => {
          console.log('FIRMA ELECTRONICA', data);
          if (data.count > 0) {
            if (onlyDetail) {
              // PUP_CONSULTA_PDF_BD_SSF3(:DICTAMINACIONES.FOLIO_UNIVERSAL,2);
              // Llamar reportes de acuerdo a validaciones
              this.runConditionReports();
            } else {
              // DELETE SSF3_FIRMA_ELEC_DOCS
              this.getParameters_PUP_XML_DICTAMINADO(data.count);
            }
          }
        },
        error: error => {
          console.log(error);
          if (error.status == 400) {
            if (onlyDetail) {
              this.getDictaminacionesCount(onlyDetail);
            } else {
              this.runConditionReports();
            }
          } else {
            this.loadDetail = false;
            this.pup_genera_pdf = false;
          }
        },
      });
  }

  getDictaminacionesCount(onlyDetail: boolean = true) {
    const paramsData = new ListParams();
    paramsData['no_of_dicta'] = this.dictationData.id;
    paramsData['estatus_of'] = this.officeDictationData.statusOf;
    this.svLegalOpinionsOfficeService
      .getDictaminacionesCount(paramsData)
      .subscribe({
        next: (data: any) => {
          console.log('COUNT DICTAMINACIONES', data);
          if (data.count > 0) {
            this.blockSender = false;
          }
          this.runConditionReports(onlyDetail);
        },
        error: error => {
          this.loadDetail = false;
          this.pup_genera_pdf = false;
          console.log(error);
          this.alert(
            'warning',
            'Error al obtener datos de las Dictaminaciones',
            error.error.message
          );
        },
      });
  }

  runConditionReports(onlyDetail: boolean = true) {
    if (
      Number(this.paramsScreen.PAQUETE) > 0 &&
      this.dictationData.passOfficeArmy
    ) {
      // Continuar obteniendo los volantes
      this.getWheels();
    } else {
      // Llama reportes
      let params: any = {
        // PARAMFORM: 'NO',
        PELABORO_DICTA: this.dataUserLoggedTokenData.title, // PENDIENTE DE RESOLVER
        PDEPARTAMENTO: this.dataUserLogged.departament
          ? this.dataUserLogged.departament.description
          : '', // PENDIENTE DE RESOLVER
        POFICIO: this.goodData[0]
          ? this.goodData[0].ofDictNumber
          : this.dictationData.id,
        PDICTAMEN: this.dictationData.typeDict,
        PESTADODICT: this.officeDictationData
          ? this.officeDictationData.statusOf
            ? this.officeDictationData.statusOf
              ? this.officeDictationData.statusOf
              : ''
            : ''
          : '',
      };
      console.log(params, this.variables, this.paramsScreen);
      if (this.variables.identi.includes('4')) {
        if (
          this.paramsScreen.TIPO == 'PROCEDENCIA' &&
          this.objDetail['vCLAVE_ARMADA']
        ) {
          params['NOME_DICTPRO'] = this.objDetail['vCLAVE_ARMADA']; // NO SE LLENA ESTA VARIABLE EN EL FORMS
          this.runReport('RGENADBDICTAMASIV_EXT', params);
          // this.runReport('blank', params, onlyDetail);
        } else {
          this.runReport('RGENADBDICTAMASIV', params, onlyDetail);
          // this.runReport('RGENREPDICTAMASDES', params, onlyDetail);
          // this.runReport('blank', params, onlyDetail);
        }
      } else if (
        this.variables.identi.includes('A') &&
        this.paramsScreen.TIPO != 'ABANDONO'
      ) {
        if (
          this.paramsScreen.TIPO == 'PROCEDENCIA' &&
          this.objDetail['vCLAVE_ARMADA']
        ) {
          params['NOME_DICTPRO'] = this.objDetail['vCLAVE_ARMADA']; // NO SE LLENA ESTA VARIABLE EN EL FORMS
        }
        this.runReport('RGENADBDICTAMASIV', params, onlyDetail);
      } else if (
        this.variables.identi.includes('T') &&
        this.paramsScreen.TIPO != 'ABANDONO'
      ) {
        if (
          this.paramsScreen.TIPO == 'PROCEDENCIA' &&
          this.objDetail['vCLAVE_ARMADA']
        ) {
          params['NOME_DICTPRO'] = this.objDetail['vCLAVE_ARMADA']; // NO SE LLENA ESTA VARIABLE EN EL FORMS
        }
        this.runReport('RGENADBDICTAMASIV', params, onlyDetail);
      } else if (this.paramsScreen.TIPO == 'ABANDONO') {
        let params: any = {
          PNOOFICIO: this.goodData[0]
            ? this.goodData[0].ofDictNumber
            : this.dictationData.id,
          PTIPODIC: this.dictationData.typeDict,
        };
        this.runReport('RGENABANDEC', params, onlyDetail);
      } else {
        this.pup_genera_xml = false;
        this.pup_genera_pdf = false;
        this.loadDetail = false;
        this.loadingSend = false;
        this.onLoadToast(
          'warning',
          'No se cumplen las condiciones para mostrar este reporte',
          ''
        );
      }
    }
  }

  getWheels(onlyDetail: boolean = true) {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('wheelNumber', this.dictationData.wheelNumber);
    this.svLegalOpinionsOfficeService
      .getWheelsByFilters(params.getParams())
      .subscribe({
        next: data => {
          console.log('NOTIFICATIONS', data);
          this.objDetail['vTIPO_VOLANTE'] = data.data[0].wheelType;
          this.reviewParametersFirstPart(onlyDetail);
        },
        error: error => {
          this.loadDetail = false;
          this.loadingSend = false;
          console.log(error);
          this.alert(
            'warning',
            'Error al obtener el tipo de volante del dictamen',
            error.error.message
          );
        },
      });
  }

  reviewParametersFirstPart(onlyDetail: boolean = true) {
    if (this.dictationData.passOfficeArmy.includes('?') && onlyDetail) {
      this.onLoadToast(
        'info',
        'El dictamen se imprimirá parcial, hasta que se cierre',
        ''
      );
    }
    if (
      this.variables.identi.includes('4') &&
      this.paramsScreen.TIPO == 'PROCEDENCIA'
    ) {
      let params: any = {
        // PARAMFORM: 'NO',
        P_OFICIO: this.dictationData.id,
        TIPO_DIC: this.dictationData.typeDict,
        CLAVE_ARMADA: this.dictationData.passOfficeArmy, // EN ESPERA DE SI SE QUITA
        P_TIPOVOL: this.objDetail['vTIPO_VOLANTE'],
        // ESTAT_DIC: onlyDetail
        //   ? this.dictationData.statusDict
        //   : this.officeDictationData.statusOf,
      };
      if (this.objDetail['vCLAVE_ARMADA']) {
        params['NOME_DICTPRO'] = this.objDetail['vCLAVE_ARMADA']; // NO SE LLENA ESTA VARIABLE EN EL FORMS
      }
      this.runReport('RGENREPDICTAMASDES_EXT', params);
      // this.runReport('blank', params, onlyDetail);
    } else {
      let params: any = {
        P_OFICIO: this.goodData[0]
          ? this.goodData[0].ofDictNumber
          : this.dictationData.id,
        TIPO_DIC: this.dictationData.typeDict,
      };
      this.runReport('RGENREPDICTAMASDES', params);
      // this.runReport('blank', params, onlyDetail);
    }
  }

  /**
   * Cargar los reportes en un modal
   * @param nameReport Nombre del Reporte
   * @param params Parametros para el reporte
   */
  runReport(nameReport: string, params: any, onlyDetail: boolean = true) {
    this.hideError(true);
    this.siabService.fetchReport(nameReport, params).subscribe(response => {
      this.loadDetail = false;
      console.log(response);
      if (response !== null) {
        this.fileFirm = response;
        if (this.pup_genera_xml) {
          this.pup_genera_xml = false;
          this.loadingSend = false;
          localStorage.setItem(
            this.nameStorageKeyArmedOffice,
            this.dictationData.passOfficeArmy
          ); // SAVE CLAVE_OFICIO_ARMADA
          try {
            localStorage.setItem(
              this.nameStorageDictationDate,
              this.dictationData.dictDate.toString()
            ); // SAVE FECHA_DICTAMEN
          } catch (error) {
            console.log(error);
          }
          // // UPLOAD PDF AND XML
          // const formData = new FormData();
          // const blob2 = new Blob([response], { type: 'application/pdf' });
          // formData.append('file', blob2, this.objDetail.V_NOMBRE + '.pdf'); // NOMBRE CON EXTENSION
          // formData.append('directory', this.routeFirm);
          // this.svLegalOpinionsOfficeService
          //   .saveDocumentFirm(formData)
          //   .subscribe({
          //     next: data => {
          //       console.log('SAVE FILE PDF', data);
          //     },
          //     error: error => {
          //       console.log(error);
          //     },
          //   });
          // const formData2 = new FormData();
          // const blob3 = new Blob([response], { type: 'text/xml' });
          // formData2.append('file', blob3, this.objDetail.V_NOMBRE + '.xml'); // NOMBRE CON EXTENSION
          // this.svLegalOpinionsOfficeService
          //   .saveDocumentFirm(formData2)
          //   .subscribe({
          //     next: data => {
          //       console.log('SAVE FILE XML', data);
          //     },
          //     error: error => {
          //       console.log(error);
          //     },
          //   });
          // console.log(this.V_URL_OPEN_FIRM);
          // window.open(this.V_URL_OPEN_FIRM, '_blank');

          // // PUP_GENERA_PDF
          // this.execute_PUP_GENERA_PDF();
          //         this.sendElectronicFirmData();
          console.log('REPORT PARAMS', nameReport, params);
          const paramsDictation = new FilterParams();
          paramsDictation.removeAllFilters();
          paramsDictation.addFilter('typeDict', this.paramsScreen.TIPO);
          paramsDictation.addFilter('id', this.paramsScreen.P_VALOR);
          this.svLegalOpinionsOfficeService
            .getDictations(paramsDictation.getParams())
            .subscribe({
              next: data => {
                console.log('DICTAMEN', data);
                this.dictationData = data.data[0];
                this.openFirmModal(nameReport, params);
              },
              error: error => {
                console.log(error);
              },
            });
        } else {
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
          if (onlyDetail) {
            this.postReport();
          }
          if (!onlyDetail) {
            this.modalService.onHide.subscribe(subsOnHide => {
              console.log(subsOnHide);
              // Continue INSERT TMP_DICTAMINACIONES DICTAMINADO
              // if (this.pup_genera_xml) {
              //   this.alertInfo(
              //     'success',
              //     'Hacer clic al terminar de firmar',
              //     ''
              //   ).then(() => {
              //     // COUNT SSF3_FIRMA_ELEC_DOCS
              //     // SI COUNT ES 0 LLAMA PUP_REGRESA_ESTATUS
              //     // DELETE TMP_DICTAMINACIONES
              //     console.log('VERIFICANDOOOOOOOOOOO ');
              //     this.sendElectronicFirmData();
              //   });
              // }
            });
          }
          if (this.pup_genera_pdf) {
            let nameFile = this.dictationData.passOfficeArmy
              .replaceAll('/', '-')
              .replaceAll('?', '0')
              .replaceAll(' ', '');
            this.pup_genera_pdf = false;
            const document = {
              numberProceedings: this.dictationData.expedientNumber,
              keySeparator: '60',
              keyTypeDocument: 'ENTRE',
              natureDocument: 'ORIGINAL',
              descriptionDocument: `DICTAMEN ${this.dictationData.passOfficeArmy}`, // Clave de Oficio Armada
              significantDate: format(new Date(), 'MM-yyyy'),
              scanStatus: 'SOLICITADO',
              userRequestsScan:
                this.dataUserLogged.user == 'SIGEBIADMON'
                  ? this.dataUserLogged.user.toLocaleLowerCase()
                  : this.dataUserLogged.user,
              scanRequestDate: new Date(),
              numberDelegationRequested: this.dataUserLogged.delegationNumber,
              numberSubdelegationRequests:
                this.dataUserLogged.subdelegationNumber,
              numberDepartmentRequest: this.dataUserLogged.departamentNumber,
              flyerNumber: this.dictationData.wheelNumber,
            };

            this.createDocument(document)
              .pipe(
                tap(_document => {
                  this.showScanForm = false;
                  this.formScan.get('scanningFoli').setValue(_document.id);
                  this.folio = _document.id.toString();
                  setTimeout(() => {
                    this.showScanForm = true;
                  }, 300);
                }),
                switchMap(_document => {
                  let obj: any = {
                    id: this.dictationData.id,
                    typeDict: this.dictationData.typeDict,
                    folioUniversal: _document.id,
                  };
                  return this.svLegalOpinionsOfficeService
                    .updateDictations(obj)
                    .pipe(map(() => _document));
                }),
                switchMap(async _document =>
                  this.uploadPdfEmitter(blob, nameFile + '.pdf', _document.id)
                )
              )
              .subscribe();
          }
        }
      } else {
        if (this.pup_genera_xml) {
          this.pup_genera_xml = false;
          this.errorFirmOnGetXml(); // Error y regresa los datos a como estaban
        }
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
          'Error',
          'Ocurrió un error al generar el reporte PDF'
        );
        return throwError(() => error);
      })
    );
  }

  postReport() {
    if (this.officeDictationData) {
      if (
        this.officeDictationData.sender.toLocaleLowerCase() ==
        this.dataUserLogged.user.toLocaleLowerCase()
      ) {
        if (
          this.officeDictationData.statusOf == 'ENVIADO' ||
          !this.officeDictationData.statusOf ||
          this.officeDictationData.statusOf == 'EN REVISION'
        ) {
          // this.blockSender = true;
        }
      }
    }
    if (!this.paramsScreen.CLAVE_OFICIO_ARMADA) {
      // EXECUTE_QUERY(NO_VALIDATE);
    }
  }

  cuEmisora() {
    const paramsData = new ListParams();
    paramsData['no_expediente'] = this.dictationData.expedientNumber;
    this.svLegalOpinionsOfficeService.getCuEmisora(paramsData).subscribe({
      next: data => {
        console.log('cuEmisora', data);
        this.objDetail['vEMISORA'] = data.data[0]['desc_emisora'];
        this.objDetail['vTRANSF'] = data.data[0]['clave'];
        this.cuDelRem();
      },
      error: error => {
        console.log(error);
        this.loadDetail = false;
        this.pup_genera_pdf = false;
        this.alert('warning', 'Error al obtener la Emisora por expediente', '');
      },
    });
  }

  cuDelRem() {
    const paramsData = new ListParams();
    paramsData['remitente'] = this.officeDictationData.sender;
    paramsData['etapa'] = this.objDetail['ETAPA'];
    this.svLegalOpinionsOfficeService.getCuDelRem(paramsData).subscribe({
      next: data => {
        console.log('cuDelRem', data);
        this.objDetail['vNO_DELREM'] = data.data[0]['id_delegacion'];
        this.objDetail['vDELEGAREM'] = data.data[0]['delegacion'];
        this.cuDelDest();
      },
      error: error => {
        console.log(error);
        this.loadDetail = false;
        this.pup_genera_pdf = false;
        this.alert(
          'warning',
          'Error al obtener la Delegación y Subdelegación del Remitente',
          ''
        );
      },
    });
  }

  cuDelDest() {
    const paramsData = new ListParams();
    paramsData['destinatario'] = this.officeDictationData.recipient;
    paramsData['etapa'] = this.objDetail['ETAPA'];
    this.svLegalOpinionsOfficeService.getCuDelDest(paramsData).subscribe({
      next: data => {
        console.log('cuDelDest', data);
        this.objDetail['vNO_DELDEST'] = data.data[0]['id_delegacion'];
        this.objDetail['vDELEGADEST'] = data.data[0]['delegacion'];
        this.cu_Tpacta();
      },
      error: error => {
        console.log(error);
        this.loadDetail = false;
        this.pup_genera_pdf = false;
        this.alert(
          'warning',
          'Error al obtener la Delegación y Subdelegación del Destinatario',
          ''
        );
      },
    });
  }

  cu_Tpacta() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('wheelNumber', this.dictationData.wheelNumber);
    params.addFilter('expedientNumber', this.dictationData.expedientNumber);
    this.svLegalOpinionsOfficeService
      .getWheelsByFilters(params.getParams())
      .subscribe({
        next: data => {
          console.log('NOTIFICATIONS CU', data);
          this.objDetail['vNOTR_FINAL'] = data.data[0].endTransferNumber;
          this.makeArmedKey();
        },
        error: error => {
          this.loadDetail = false;
          this.pup_genera_pdf = false;
          console.log(error);
          this.alert(
            'warning',
            'Error al obtener el Número de Transferente Final de Volantes',
            error.error.message
          );
        },
      });
  }

  makeArmedKey() {
    if (
      this.objDetail['vNOTR_FINAL'].includes('1') ||
      this.objDetail['vNOTR_FINAL'].includes('3')
    ) {
      this.objDetail['vT_ACTA'] = 'A';
    } else {
      this.objDetail['vT_ACTA'] = 'RT';
    }
    if (this.objDetail['vNO_DELDEST'] == 0) {
      this.objDetail['vDELAGACION'] = 'CRB';
    } else {
      this.objDetail['vDELAGACION'] = this.objDetail['vDELEGADEST'];
      if (this.objDetail['vNO_DELREM'] == 3) {
        if (this.objDetail['vNO_DELDEST'] == 2) {
          this.objDetail['vDELAGACION'] = this.objDetail['vDELEGAREM'];
        }
      }
    }
    if (this.objDetail['vTRANSF'] == 'SAT') {
      this.objDetail['vCLAVE_ARMADA'] =
        this.objDetail['vT_ACTA'] +
        '/' +
        this.objDetail['vEMISORA'] +
        '/ADM/' +
        this.objDetail['vDELAGACION'] +
        '/' +
        this.objDetail['vDELAGACION'] +
        '/CONSECUTIVO/AÑO/MES';
    } else {
      this.objDetail['vCLAVE_ARMADA'] =
        this.objDetail['vT_ACTA'] +
        '/' +
        this.objDetail['vTRANSF'] +
        '/ADM/' +
        this.objDetail['vDELAGACION'] +
        '/' +
        this.objDetail['vDELAGACION'] +
        '/CONSECUTIVO/AÑO/MES';
    }
    this.continuationOfMakeArmyKey();
  }

  continuationOfMakeArmyKey() {
    if (!this.variables.identi.includes('4')) {
      if (!this.officeDictationData.recipient) {
        this.alert('warning', 'El Destinatario es requerido', '');
      }
    } else {
      if (!this.officeDictationData.recipient) {
        this.alert('warning', 'El Destinatario es requerido', '');
      }
    }
    if (!this.officeDictationData.city) {
      this.alert('warning', 'La Ciudad es requerida', '');
    }
    if (this.variables.identi.includes('4')) {
      this.officeDictationData.recipientEsxt =
        this.addresseeDataSelect.userDetail.name;
    }
    if (this.variables.cveOficioArmada) {
      this.dictationData.passOfficeArmy = this.variables.cveOficioArmada;
    }
    if (this.paramsScreen.CLAVE_OFICIO_ARMADA) {
      // LIP_COMMIT_SILENCIOSO;
    }
    // GENERAR REPORTES
    this.runConditionReports();
  }
  goBack() {
    if (this.origin == 'FACTJURDICTAMAS') {
      // this.router.navigate(['/pages/juridical/juridical-ruling']);
      this.router.navigate(['/pages/juridical/juridical-ruling'], {
        queryParams: {
          origin: this.origin3,
          P_GEST_OK: this.paramsScreen.P_GEST_OK,
          P_NO_TRAMITE: this.paramsScreen.P_NO_TRAMITE,
          NO_EXP: this.NO_EXP,
        },
      });
    } else if (this.origin == 'FACTJURDICTAMASG') {
      // this.router.navigate(['/pages/juridical/juridical-ruling-g']);
      this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
        queryParams: {
          origin: this.origin3,
          CLAVE_OFICIO_ARMADA: this.paramsScreen.CLAVE_OFICIO_ARMADA,
          P_GEST_OK: this.paramsScreen.P_GEST_OK,
          P_NO_TRAMITE: this.paramsScreen.P_NO_TRAMITE,
          CONSULTA: this.CONSULTA,
          VOLANTE: this.dictationData.wheelNumber,
          EXPEDIENTE: this.dictationData.expedientNumber,
          TIPO_DIC: this.paramsScreen.TIPO,
          TIPO_VO: this.TIPO_VO,
        },
      });
      // } else if (this.origin == 'juridical-ruling-g') {
      //   window.history.back();
    } else {
      this.alert(
        'warning',
        'La página de origen no tiene opción para regresar a la pantalla anterior',
        ''
      );
    }
  }

  buildCopiesToControls() {
    let controlsObj: any = {};
    for (let index = 0; index < this.totalCopiesTo; index++) {
      controlsObj['ccp_person' + index] = [{ value: '', disabled: false }];
      controlsObj['ccp_addressee' + index] = [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ];
      controlsObj['ccp_TiPerson' + index] = [
        { value: '', disabled: false },
        [Validators.pattern(STRING_PATTERN)],
      ];
    }
    this.formCopiesTo = this.fb.group(controlsObj);
    console.log(this.formCopiesTo);
  }

  addCopiesOffice() {
    this.formCopiesTo.addControl('ccp_person' + this.totalCopiesTo, [
      { value: '', disabled: false },
    ]);
    this.formCopiesTo.addControl('ccp_addressee' + this.totalCopiesTo, [
      { value: '', disabled: false },
      [Validators.pattern(STRING_PATTERN)],
    ]);
    this.formCopiesTo.addControl('ccp_TiPerson' + this.totalCopiesTo, [
      { value: '', disabled: false },
      [Validators.pattern(STRING_PATTERN)],
    ]);
    this.formCopiesToTotals.push(this.totalCopiesTo); // Add copies to
    this.totalCopiesTo++;
    console.log(this.formCopiesTo.controls, this.totalCopiesTo);
  }

  deleteCopiesOffice(position: number) {
    this.formCopiesTo.removeControl('ccp_person' + position);
    this.formCopiesTo.removeControl('ccp_addressee' + position);
    this.formCopiesTo.removeControl('ccp_TiPerson' + position);
    this.formCopiesToTotals.splice(position, 1); // Remove copies to
    this.totalCopiesTo--;
    console.log(this.formCopiesTo.controls, this.totalCopiesTo);
  }

  saveDataForm() {
    if (this.blockSender) {
      return;
    }
    console.log(this.form);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert(
        'warning',
        'Complete los campos requeridos correctamente e intente nuevamente',
        ''
      );
      return;
    }
    this.setDataDictationSave(true);
  }

  setDataDictationSave(saveData: boolean = false) {
    if (this.blockSender) {
      return;
    }
    // DICTAMINACIONES
    this.dictationData = {
      ...this.dictationData,
      passOfficeArmy: this.form.get('cveOfficeGenerate').value, // CLAVE ARMADA
      folioUniversal: this.formScan.get('scanningFoli').value, // FOLIO UNIVERSAL
    };
    // OFICIO DICTAMINACIÓN
    this.officeDictationData = {
      ...this.officeDictationData,
      officialNumber: this.dictationData.id,
      typeDict: this.dictationData.typeDict,
      sender: this.form.get('issuingUser').value, // REMITENTE
      recipient: this.form.get('addressee').value, // DESTINATARIO
      city: this.form.get('city').value, // CIUDAD
      notaryNumber: this.form.get('numberNotary').value, // NUMERO NOTARIO
      text1: this.form.get('introductoryParagraph').value, // PARRAFO INICIAL
      text2: this.form.get('finalParagraph').value, // PARRAFO FINAL
      text2To: this.form.get('moreInformation1').value, // MÁS INFORMACIÓN 1
      text3: this.form.get('moreInformation3').value, // MÁS INFORMACIÓN 2
    };
    // TEXTOS OFICIO DICTAMINACIÓN
    this.officeTextDictationData = {
      ...this.officeTextDictationData,
      rulingType: this.dictationData.typeDict,
      dictatesNumber: this.dictationData.id,
      textx: this.form.get('moreInformation2').value,
    };
    // COPIAS OFICIO DICTAMEN
    // ARREGLO DE COPIAS PARA
    console.log(
      this.officeCopiesDictationData,
      this.form.get('ccp_person').value,
      this.form.get('ccp_person_1').value,
      this._totalCopiesTo
    );
    // this.officeCopiesDictationData = [];
    // if (this.form.get('ccp_person').value) {
    //   if (
    //     this.form.get('ccp_addressee').value ||
    //     this.form.get('ccp_TiPerson').value
    //   ) {
    //   } else {
    //     this.alert(
    //       'warning',
    //       'Complete los campos requeridos correctamente para C.C.P. e intente nuevamente',
    //       ''
    //     );
    //     return;
    //   }
    //   if (this.tmpOfficeCopiesDictationData) {
    //     if (this.tmpOfficeCopiesDictationData[0]) {
    //       this.officeCopiesDictationData.push({
    //         ...this.tmpOfficeCopiesDictationData[0],
    //         numberOfDicta: this.dictationData.id,
    //         typeDictamination: this.dictationData.typeDict,
    //         recipientCopy: this.form.get('ccp_addressee').value,
    //         copyDestinationNumber: null,
    //         personExtInt: this.form.get('ccp_person').value,
    //         namePersonExt:
    //           this.form.get('ccp_person').value == 'I'
    //             ? ''
    //             : this.form.get('ccp_TiPerson').value,
    //       });
    //     }
    //   } else {
    //     this.officeCopiesDictationData.push({
    //       numberOfDicta: this.dictationData.id,
    //       typeDictamination: this.dictationData.typeDict,
    //       recipientCopy: this.form.get('ccp_addressee').value,
    //       copyDestinationNumber: null,
    //       personExtInt: this.form.get('ccp_person').value,
    //       namePersonExt:
    //         this.form.get('ccp_person').value == 'I'
    //           ? ''
    //           : this.form.get('ccp_TiPerson').value,
    //     });
    //   }
    // }
    // if (this.form.get('ccp_person_1').value) {
    //   if (
    //     this.form.get('ccp_addressee_1').value ||
    //     this.form.get('ccp_TiPerson_1').value
    //   ) {
    //   } else {
    //     this.alert(
    //       'warning',
    //       'Complete los campos requeridos correctamente para C.C.P. e intente nuevamente',
    //       ''
    //     );
    //     return;
    //   }
    //   if (this.tmpOfficeCopiesDictationData && this._totalCopiesTo > 1) {
    //     if (this.tmpOfficeCopiesDictationData[1]) {
    //       this.officeCopiesDictationData.push({
    //         ...this.tmpOfficeCopiesDictationData[1],
    //         numberOfDicta: this.dictationData.id,
    //         typeDictamination: this.dictationData.typeDict,
    //         recipientCopy: this.form.get('ccp_addressee_1').value,
    //         copyDestinationNumber: null,
    //         personExtInt: this.form.get('ccp_person_1').value,
    //         namePersonExt:
    //           this.form.get('ccp_person_1').value == 'I'
    //             ? ''
    //             : this.form.get('ccp_TiPerson_1').value,
    //       });
    //     }
    //   } else {
    //     this.officeCopiesDictationData.push({
    //       numberOfDicta: this.dictationData.id,
    //       typeDictamination: this.dictationData.typeDict,
    //       recipientCopy: this.form.get('ccp_addressee_1').value,
    //       copyDestinationNumber: null,
    //       personExtInt: this.form.get('ccp_person_1').value,
    //       namePersonExt:
    //         this.form.get('ccp_person_1').value == 'I'
    //           ? ''
    //           : this.form.get('ccp_TiPerson_1').value,
    //     });
    //   }
    // }
    console.log(
      'CONSOLE LOG DATA',
      this.dictationData,
      this.officeDictationData,
      this.officeTextDictationData,
      this.officeCopiesDictationData
    );
    if (saveData) {
      this.saveDictation();
    }
  }

  saveDictation() {
    this._saveDictation_loading = true;
    // console.log(this._saveDictation);
    // this.saveOfficeDictation();
    if (this._saveDictation) {
      this.svLegalOpinionsOfficeService
        .saveDictations(this.dictationData)
        .subscribe({
          next: data => {
            console.log('SAVE DICTAMEN', data);
            this.onLoadToast(
              'success',
              'El Dictamen se guardó correctamente',
              ''
            );
            this._saveDictation_loading = false;
            this.saveOfficeDictation();
          },
          error: error => {
            console.log(error);
            this._saveDictation_loading = false;
            this.onLoadToast(
              'error',
              'Ocurrió un error al guardar el Dictamen',
              error.error.message
            );
            // this.continueSearchAppoinment(this.dictationData);
            this.saveOfficeDictation();
          },
        });
    } else {
      // let objDictation = {
      //   passOfficeArmy: this.form.get('cveOfficeGenerate').value, // CLAVE ARMADA
      //   folioUniversal: this.formScan.get('scanningFoli').value, // FOLIO UNIVERSAL
      // };
      this.svLegalOpinionsOfficeService
        .updateDictations(this.dictationData)
        .subscribe({
          next: data => {
            console.log('UPDATE DICTAMEN', data);
            this.onLoadToast(
              'success',
              'El Dictamen se guardó correctamente',
              ''
            );
            this._saveDictation_loading = false;
            this.saveOfficeDictation();
          },
          error: error => {
            console.log(error);
            this._saveDictation_loading = false;
            this.onLoadToast(
              'error',
              'Ocurrió un error al guardar el Dictamen',
              error.error.message
            );
            // this.continueSearchAppoinment(this.dictationData);
            this.saveOfficeDictation();
          },
        });
    }
  }

  saveOfficeDictation() {
    this._saveOfficeDictation_loading = true;
    // console.log(this._saveOfficeDictation);
    // this.saveOfficeText();
    if (this._saveOfficeDictation) {
      this.svLegalOpinionsOfficeService
        .saveOfficeDictation(this.officeDictationData)
        .subscribe({
          next: data => {
            console.log('SAVE OFFICE DICTAMEN', data);
            this.onLoadToast(
              'success',
              'El Oficio del Dictamen se guardó correctamente',
              ''
            );
            this._saveOfficeDictation_loading = false;
            this.saveOfficeText();
          },
          error: error => {
            console.log(error);
            this._saveOfficeDictation_loading = false;
            this.onLoadToast(
              'error',
              'Ocurrió un error al guardar el Oficio del Dictamen',
              error.error.message
            );
            // this.continueSearchAppoinment(this.dictationData);
            this.saveOfficeText();
          },
        });
    } else {
      // let objOfficeDictation = {
      //   sender: this.form.get('issuingUser').value, // REMITENTE
      //   recipient: this.form.get('addressee').value, // DESTINATARIO
      //   city: this.form.get('city').value, // CIUDAD
      //   notaryNumber: this.form.get('numberNotary').value, // NUMERO NOTARIO
      //   text1: this.form.get('introductoryParagraph').value, // PARRAFO INICIAL
      //   text2: this.form.get('finalParagraph').value, // PARRAFO FINAL
      //   text2To: this.form.get('moreInformation1').value, // MÁS INFORMACIÓN 1
      //   text3: this.form.get('moreInformation3').value, // MÁS INFORMACIÓN 2
      // };
      this.svLegalOpinionsOfficeService
        .updateOfficeDictation(this.officeDictationData)
        .subscribe({
          next: data => {
            console.log('UPDATE OFFICE DICTAMEN', data);
            this.onLoadToast(
              'success',
              'El Oficio del Dictamen se guardó correctamente',
              ''
            );
            this._saveOfficeDictation_loading = false;
            this.saveOfficeText();
          },
          error: error => {
            console.log(error);
            this._saveOfficeDictation_loading = false;
            this.onLoadToast(
              'error',
              'Ocurrió un error al guardar el Oficio del Dictamen',
              error.error.message
            );
            // this.continueSearchAppoinment(this.dictationData);
            this.saveOfficeText();
          },
        });
    }
  }

  saveOfficeText() {
    this._saveTextDictation_loading = true;
    // console.log(this._saveTextDictation);
    // this.saveCopiesOfficeDictation();
    if (this._saveTextDictation) {
      if (this.officeTextDictationData.textx) {
        this.svLegalOpinionsOfficeService
          .saveTextOfficeDictation(this.officeTextDictationData)
          .subscribe({
            next: data => {
              console.log('SAVE TEXT DICTAMEN', data);
              this.onLoadToast(
                'success',
                'Los Textos del Dictamen se guardaron correctamente',
                ''
              );
              this._saveTextDictation_loading = false;
              this.saveCopiesOfficeDictation();
            },
            error: error => {
              console.log(error);
              this.onLoadToast(
                'error',
                'Ocurrió un error al guardar los Textos del Oficio del Dictamen',
                error.error.message
              );
              this._saveTextDictation_loading = false;
              // this.continueSearchAppoinment(this.dictationData);
              this.saveCopiesOfficeDictation();
            },
          });
      } else {
        // this.continueSearchAppoinment(this.dictationData);
        this.saveCopiesOfficeDictation();
      }
    } else {
      // let objDictation = {
      //   textx: this.form.get('moreInformation2').value,
      // };
      this.svLegalOpinionsOfficeService
        .updateTextOfficeDictation(this.officeTextDictationData)
        .subscribe({
          next: data => {
            console.log('UPDATE TEXT DICTAMEN', data);
            this.onLoadToast(
              'success',
              'Los Textos del Dictamen se guardaron correctamente',
              ''
            );
            this._saveTextDictation_loading = false;
            this.saveCopiesOfficeDictation();
          },
          error: error => {
            console.log(error);
            this.onLoadToast(
              'error',
              'Ocurrió un error al guardar los Textos del Oficio del Dictamen',
              error.error.message
            );
            this._saveTextDictation_loading = false;
            // this.continueSearchAppoinment(this.dictationData);
            this.saveCopiesOfficeDictation();
          },
        });
    }
  }

  saveCopiesOfficeDictation() {
    // this.continueSearchAppoinment(this.dictationData);
    this.setInitValuesToSave(); // INIT SAVE VARIABLES
    this.cleanDataForm();
    this.btnSearchAppointment();
    // if (this.officeCopiesDictationData.length == 0) {
    //   this.continueSearchAppoinment(this.dictationData);
    //   return;
    // }
    // // this.continueSearchAppoinment(this.dictationData);
    // this._saveCopiesDictation_loading = true;
    // this.officeCopiesDictationData.forEach((elementCopies, count) => {
    //   console.log(count, this._totalCopiesTo);
    //   console.log(
    //     this._saveCopiesDictation,
    //     count + 1,
    //     this._totalCopiesTo,
    //     count + 1 > this._totalCopiesTo
    //   );
    //   if (
    //     (this._saveCopiesDictation && count + 1 > this._totalCopiesTo) ||
    //     !this.tmpOfficeCopiesDictationData
    //   ) {
    //     // console.log('CREATE COPIAS', elementCopies);
    //     // this.continueSearchAppoinment(this.dictationData);
    //     this.svLegalOpinionsOfficeService
    //       .saveCopiesOfficeDictation(elementCopies)
    //       .subscribe({
    //         next: data => {
    //           console.log('SAVE COPIES DICTAMEN', data);
    //           this._saveCopiesDictation_loading = false;
    //           if (this.officeCopiesDictationData.length == count + 1) {
    //             this.continueSearchAppoinment(this.dictationData);
    //           }
    //         },
    //         error: error => {
    //           console.log(error);
    //           this._saveCopiesDictation_loading = false;
    //           if (this.officeCopiesDictationData.length == count + 1) {
    //             this.continueSearchAppoinment(this.dictationData);
    //           }
    //         },
    //       });
    //   } else {
    //     this.svLegalOpinionsOfficeService
    //       .updateCopiesOfficeDictation(elementCopies)
    //       .subscribe({
    //         next: data => {
    //           console.log('UPDATE COPIES DICTAMEN', data);
    //           this._saveCopiesDictation_loading = false;
    //           if (this.officeCopiesDictationData.length == count + 1) {
    //             this.continueSearchAppoinment(this.dictationData);
    //           }
    //         },
    //         error: error => {
    //           console.log(error);
    //           this._saveCopiesDictation_loading = false;
    //           if (this.officeCopiesDictationData.length == count + 1) {
    //             this.continueSearchAppoinment(this.dictationData);
    //           }
    //         },
    //       });
    //   }
    // });
  }

  testSendFile() {
    this.siabService.fetchReport('blank', {}).subscribe(response => {
      console.log(response);
      const formData = new FormData();
      const blob = new Blob([response], { type: 'application/pdf' });
      // const blob = new Blob([response], { type: 'text/xml' });
      formData.append('file', blob, 'test_firma_nombre.pdf'); // NOMBRE CON EXTENSION
      // formData.append('file', blob, 'test_firma_nombre.xml'); // NOMBRE CON EXTENSION
      formData.append('directory', this.routeFirm);
      this.fileFirm = response;
      // let obj: IDocumentServiceSaveFile = {
      //   file: formData.get('file'),
      //   directory: this.routeFirm
      // }
      // this.svLegalOpinionsOfficeService.saveDocumentFirm(formData).subscribe({
      //   next: data => {
      //     console.log('SAVE FILE', data);
      //   },
      //   error: error => {
      //     console.log(error);
      //   },
      // });
      // if (response !== null) {
      //   const blob = new Blob([response], { type: 'application/pdf' });
      //   const url = URL.createObjectURL(blob);
      //   let config = {
      //     initialState: {
      //       documento: {
      //         urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
      //         type: 'pdf',
      //       },
      //       callback: (data: any) => {},
      //     }, //pasar datos por aca
      //     class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      //     ignoreBackdropClick: true, //ignora el click fuera del modal
      //   };
      //   this.modalService.show(PreviewDocumentsComponent, config);
      // } else {
      //   this.alert('warning', ERROR_REPORT, '');
      // }
    });
  }

  showDeleteAlert(event: any) {
    console.log(event);
    if (!event) {
      return;
    }
    if (this.officeDictationData) {
      if (this.officeDictationData.statusOf == 'ENVIADO') {
        this.onLoadToast(
          'warning',
          'No es posible eliminar el registro porque el Dictamen tiene estatus ' +
            this.officeDictationData.statusOf,
          ''
        );
        return;
      }
    }
    this.alertQuestion(
      'question',
      'Selecciono el C.C.P. ' + event.userOrPerson + '. ¿Desea eliminarlo?',
      ''
    ).then(async question => {
      if (question.isConfirmed) {
        if (event.id == undefined) {
        } else {
          // DELETE COPIA PARA
          this.svLegalOpinionsOfficeService
            .deleteCopiesOfficeDictation(event)
            .subscribe({
              next: data => {
                console.log('UPDATE COPIES DICTAMEN', data);
                this.onLoadToast('success', 'Se eliminó correctamente', '');
                this.getOfficeCopiesDictation();
              },
              error: error => {
                console.log(error);
                this.onLoadToast(
                  'error',
                  'Ocurrió un Error al Eliminar la CCP',
                  error.error.message
                );
              },
            });
        }
      }
    });
  }

  // CREAR C.P.P. //
  openModalCopy(data: boolean) {
    if (!this.dictationData) {
      return;
    }
    if (!this.dictationData.id) {
      return;
    }
    if (this.officeDictationData) {
      if (this.officeDictationData.statusOf == 'ENVIADO') {
        this.onLoadToast(
          'warning',
          'No es posible eliminar el registro porque el Dictamen tiene estatus ' +
            this.officeDictationData.statusOf,
          ''
        );
        return;
      }
    }
    this.openForm({
      dataEdit: data,
      numberOfDicta: this.dictationData.id,
      typeDictamination: this.dictationData.typeDict,
      screenKey: this.screenKey,
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
      this.getOfficeCopiesDictation();
    });
    modalRef.content.refresh.subscribe((next: any) => {
      this.getOfficeCopiesDictation();
    });
  }

  openFirmModal(nameReport: string = 'RGENADBDICTAMASIV', params: any = null) {
    this.hideError(true);
    let nameFile = this.dictationData.passOfficeArmy
      .replaceAll('/', '-')
      .replaceAll('?', '0')
      .replaceAll(' ', '');
    if (!params) {
      params = {
        P_OFICIO: this.dictationData.id,
        TIPO_DIC: this.dictationData.typeDict,
      };
    }
    let paramsData = new ListParams();
    paramsData = {
      ...params,
      nombreReporte: nameReport + '.jasper',
    };
    // for (const key in paramsData) {
    //   if (Object.prototype.hasOwnProperty.call(paramsData, key)) {
    //     let dataToParse = paramsData[key];
    //     paramsData[key] = encodeURIComponent(dataToParse);
    //   }
    // }
    // this.siabService
    //   .fetchReport(nameReport, params, SiabReportEndpoints.EXTENSION_XML)
    this.svLegalOpinionsOfficeService.getXMLReportToFirm(paramsData).subscribe(
      {
        next: (response: any) => {
          console.log(response);
          if (!response) {
            this.errorFirmOnGetXml(); // Error y regresa los datos a como estaban
            this.onLoadToast(
              'warning',
              'Ocurrió un error al cargar el XML con el nombre: ' + nameFile,
              ''
            );
            return;
          }
          if (
            // response.includes(this.dictationData.expedientNumber) ||
            // response.includes(this.dictationData.wheelNumber) ||
            !response.includes('xml')
          ) {
            this.errorFirmOnGetXml(); // Error y regresa los datos a como estaban
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
            natureDocumentDictation: this.dictationData.typeDict,
            numberDictation: this.dictationData.id,
            typeDocumentDictation: this.officeDictationData.statusOf
              ? this.officeDictationData.statusOf
              : 'ENVIADO',
            fileDocumentDictation: formData.get('file'), // DOCUMENTO XML GENERADO
          });
        },
        error: error => {
          console.log(error);
          if (error.status == 200) {
            let response = error.error.text;
            // console.log('XML DICTAMEN', typeof response, response);
            // console.log(response);
            if (!response) {
              this.errorFirmOnGetXml(); // Error y regresa los datos a como estaban
              this.onLoadToast(
                'warning',
                'Ocurrió un error al cargar el XML con el nombre: ' + nameFile,
                ''
              );
              return;
            }
            if (
              // response.includes(this.dictationData.expedientNumber) ||
              // response.includes(this.dictationData.wheelNumber) ||
              !response.includes('xml')
            ) {
              this.errorFirmOnGetXml(); // Error y regresa los datos a como estaban
              this.onLoadToast(
                'warning',
                'Ocurrió un error al cargar el XML con el nombre: ' + nameFile,
                ''
              );
              return;
            }
            // const encoded: string = response;
            // const decoded: string = Buffer.from(encoded, 'base64').toString(
            //   'utf8'
            // );
            // var blob = new Blob([decoded], { type: 'text/xml' });
            // const formData = new FormData();
            // formData.append(
            //   'file',
            //   this.convertXMLStringToblob(response),
            //   nameFile + '.xml'
            // ); // NOMBRE CON EXTENSION
            const formData = new FormData();
            const file = new File([response], nameFile + '.xml', {
              type: 'text/xml',
            });
            formData.append('file', file);
            this.startFirmComponent({
              nameFileDictation: nameFile,
              natureDocumentDictation: this.dictationData.typeDict,
              numberDictation: this.dictationData.id,
              typeDocumentDictation: this.officeDictationData.statusOf
                ? this.officeDictationData.statusOf
                : 'ENVIADO',
              fileDocumentDictation: formData.get('file'), // DOCUMENTO XML GENERADO
            });
          } else {
            this.errorFirmOnGetXml(); // Error y regresa los datos a como estaban
            this.onLoadToast(
              'warning',
              'Ocurrió un error al CREAR el XML con el nombre: ' + nameFile,
              ''
            );
          }
        },
      }

      //   (response: any) => {
      //   console.log(response);
      //   if (!response) {
      //     this.onLoadToast(
      //       'warning',
      //       'Ocurrió un error al cargar el XML con el nombre: ' + nameFile,
      //       ''
      //     );
      //     return;
      //   }
      // const blob = new Blob([response], { type: 'application/pdf' });
      // const url = URL.createObjectURL(blob);
      // let config = {
      //   initialState: {
      //     documento: {
      //       urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
      //       type: 'pdf',
      //     },
      //     callback: (data: any) => {},
      //   }, //pasar datos por aca
      //   class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
      //   ignoreBackdropClick: true, //ignora el click fuera del modal
      // };
      // this.modalService.show(PreviewDocumentsComponent, config);

      //   const formData = new FormData();
      // const blob = new Blob([response], {
      //   type: 'application/xml;charset=UTF-8',
      // });
      // formData.append('file', blob, nameFile + '.xml'); // NOMBRE CON EXTENSION
      //   formData.append('file', response, nameFile + '.xml'); // NOMBRE CON EXTENSION
      //   this.startFirmComponent({
      //     nameFileDictation: nameFile,
      //     natureDocumentDictation: this.dictationData.typeDict,
      //     numberDictation: this.dictationData.id,
      //     typeDocumentDictation: this.officeDictationData.statusOf
      //       ? this.officeDictationData.statusOf
      //       : 'ENVIADO',
      //     fileDocumentDictation: formData.get('file'), // DOCUMENTO XML GENERADO
      //   });
      // }
    );
  }

  errorFirmOnGetXml() {
    this.blockSender = false;
    this.sendElectronicFirmData();
    // let save = false;
    // let obj: any = {
    //   ...this.dictationData,
    // };
    // // this.deleteTempDictation(true);
    // let armedKey = localStorage.getItem(this.nameStorageKeyArmedOffice); // GET CLAVE_OFICIO_ARMADA
    // if (armedKey) {
    //   obj['passOfficeArmy'] = armedKey;
    //   save = true;
    // }
    // let localDateDictation = localStorage.getItem(
    //   this.nameStorageDictationDate
    // ); // GET FECHA_DICTAMEN
    // if (localDateDictation) {
    //   let dateLocal = format(new Date(localDateDictation), 'yyyy-MM-dd');
    //   obj['dictDate'] = new Date(dateLocal);
    //   save = true;
    // }
    // localStorage.removeItem(this.nameStorageKeyArmedOffice);
    // localStorage.removeItem(this.nameStorageDictationDate);
    // if (save) {
    //   this.svLegalOpinionsOfficeService.updateDictations(obj).subscribe({
    //     next: data => {
    //       console.log('UPDATE DICTAMEN', data);
    //       this.startLoopGoods(); // Inicar Loop de bienes
    //     },
    //     error: error => {
    //       console.log(error);
    //     },
    //   }); // SAVE DICTATION SIN CONSECUTIVO
    // } else {
    //   this.startLoopGoods(); // Inicar Loop de bienes
    // }
  }

  startFirmComponent(context?: Partial<LegalOpinionsOfficeFirmModalComponent>) {
    const modalRef = this.modalService.show(
      LegalOpinionsOfficeFirmModalComponent,
      {
        initialState: context,
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
      }
    );
    modalRef.content.responseFirm.subscribe((next: any) => {
      console.log('next', next);
      // this.officeDictationData = {
      //   ...this.officeDictationData,
      //   statusOf: 'ENVIADO',
      // };
      let objSend = {
        ...this.officeDictationData,
        statusOf: 'ENVIADO',
      };
      this.svLegalOpinionsOfficeService
        .updateOfficeDictation(objSend)
        .subscribe({
          next: data => {
            console.log('UPDATE OFFICE DICTAMEN', data);
            const params = new FilterParams();
            params.removeAllFilters();
            params.addFilter('typeDict', this.paramsScreen.TIPO);
            params.addFilter('id', this.paramsScreen.P_VALOR);
            // params['sortBy'] = 'nameCity:ASC';
            this.svLegalOpinionsOfficeService
              .getDictations(params.getParams())
              .subscribe({
                next: data => {
                  console.log('DICTAMEN', data);
                  this.dictationData = data.data[0];
                  // this.callNextbtnSearchAppointment();
                  this.goodsByDictation
                    .pipe(takeUntil(this.$unSubscribe))
                    .subscribe(() => this.loadGoodsByOfficeDictation());
                  // FIRM PROCESS
                  this.blockSender = true;
                  this.officeDictationData.statusOf = objSend.statusOf;
                  // RUN PDF REPORT
                  this.sendElectronicFirmData();
                },
                error: error => {
                  console.log(error);
                },
              });
          },
          error: error => {
            console.log(error);
          },
        });
    });
    modalRef.content.errorFirm.subscribe((next: any) => {
      console.log(next);
      if (next) {
        // Run error
        // this.sendElectronicFirmData();
      }
      this.errorFirmOnGetXml(); // Error y regresa los datos a como estaban
    });
  }
  errorFirm() {
    this.errorFirmOnGetXml(); // Error y regresa los datos a como estaban
  }
  convertXMLStringToblob(xmlstring: any) {
    // Convert xml string to base64data
    let xmlval = new DOMParser().parseFromString(xmlstring, 'application/xml');
    let base64Data = window.btoa(new XMLSerializer().serializeToString(xmlval));

    // Convert base64data to blob
    const byteCharacters = window.atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/xml;charset=UTF-8' });
  }

  testUploadPdf() {
    // let nameFile = this.dictationData.passOfficeArmy
    //   .replaceAll('/', '-')
    //   .replaceAll('?', '0')
    //   .replaceAll(' ', '');
    // this.siabService.fetchReport('blank', {}).subscribe(response => {
    //   console.log(response);
    //   const blob = new Blob([response], { type: 'application/pdf' });
    //   const document = {
    //     numberProceedings: this.dictationData.expedientNumber,
    //     keySeparator: '60',
    //     keyTypeDocument: 'ENTRE',
    //     natureDocument: 'ORIGINAL',
    //     descriptionDocument: `DICTAMEN ${this.dictationData.passOfficeArmy}`, // Clave de Oficio Armada
    //     significantDate: format(new Date(), 'MM-yyyy'),
    //     scanStatus: 'SOLICITADO',
    //     userRequestsScan:
    //       this.dataUserLogged.user == 'SIGEBIADMON'
    //         ? this.dataUserLogged.user.toLocaleLowerCase()
    //         : this.dataUserLogged.user,
    //     scanRequestDate: new Date(),
    //     numberDelegationRequested: this.dataUserLogged.delegationNumber,
    //     numberSubdelegationRequests: this.dataUserLogged.subdelegationNumber,
    //     numberDepartmentRequest: this.dataUserLogged.departamentNumber,
    //     flyerNumber: this.dictationData.wheelNumber,
    //   };
    //   this.createDocument(document)
    //     .pipe(
    //       tap(_document => {
    //         console.log('DOCUMENT ', _document);
    //         this.showScanForm = false;
    //         this.formScan.get('scanningFoli').setValue(_document.id);
    //         setTimeout(() => {
    //           this.showScanForm = true;
    //         }, 300);
    //       }),
    //       switchMap(_document => {
    //         console.log('UPDATE DICTAMEN ', _document);
    //         let obj: any = {
    //           id: this.dictationData.id,
    //           typeDict: this.dictationData.typeDict,
    //           folioUniversal: _document.id,
    //         };
    //         return this.svLegalOpinionsOfficeService
    //           .updateDictations(obj)
    //           .pipe(map(() => _document));
    //       }),
    //       switchMap(async _document =>
    //         this.uploadPdfEmitter(blob, nameFile+'.pdf', _document.id)
    //       )
    //     )
    //     .subscribe();
    // });
  }
}
