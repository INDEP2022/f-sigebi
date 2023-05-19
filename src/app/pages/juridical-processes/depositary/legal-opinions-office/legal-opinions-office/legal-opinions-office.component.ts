import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ICopiesOfficialOpinion } from 'src/app/core/models/ms-dictation/copies-official-opinion.model';
import {
  ICopiesOfficeSendDictation,
  IDictation,
  IInitFormLegalOpinionOfficeBody,
} from 'src/app/core/models/ms-dictation/dictation-model';
import { IDictationXGood1 } from 'src/app/core/models/ms-dictation/dictation-x-good1.model';
import { IOfficialDictation } from 'src/app/core/models/ms-dictation/official-dictation.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IJobDictumTexts } from 'src/app/core/models/ms-officemanagement/job-dictum-texts.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUM_POSITIVE, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { MailboxModalTableComponent } from 'src/app/pages/general-processes/work-mailbox/components/mailbox-modal-table/mailbox-modal-table.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { COLUMNS, officeTypeOption, RELATED_FOLIO_COLUMNS } from './columns';
import { LegalOpinionsOfficeService } from './services/legal-opinions-office.service';

export interface IParamsLegalOpinionsOffice {
  PAQUETE: string;
  P_GEST_OK: string;
  CLAVE_OFICIO_ARMADA: string;
  P_NO_TRAMITE: string;
  TIPO: string;
  P_VALOR: string;
}
@Component({
  selector: 'app-legal-opinions-office',
  templateUrl: './legal-opinions-office.component.html',
  styles: [],
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
  officeTextDictationData: IJobDictumTexts;
  addresseeDataSelect: any;
  paramsScreen: IParamsLegalOpinionsOffice = {
    PAQUETE: '',
    P_GEST_OK: '',
    CLAVE_OFICIO_ARMADA: '',
    P_NO_TRAMITE: '',
    TIPO: '', //'PROCEDENCIA', // DEVOLUCION   ---  DESTRUCCION  --- EXP
    P_VALOR: '', //'486063', // --- EXP 791474  --  155--- EXP 5060   ---   5240--- EXP 339805
  };
  officeTypeOption: any[] = officeTypeOption;
  origin: string = '';
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
  dataTable: LocalDataSource = new LocalDataSource();
  goodsByDictation = new BehaviorSubject<ListParams>(new ListParams());
  goodData: IDictationXGood1[] = [];
  totalData: number = 0;
  totalCurrent: number = 0;
  totalCorrect: number = 0;
  totalIncorrect: number = 0;
  blockSender: boolean = true;
  objDetail: any = {};
  loadDetail: boolean = false;

  constructor(
    private fb: FormBuilder,
    private svLegalOpinionsOfficeService: LegalOpinionsOfficeService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private documentsService: DocumentsService,
    private modalService: BsModalService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private router: Router
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
    // this.settings.columns = COLUMNS;
    // this.settings.actions = false;
  }

  ngOnInit(): void {
    this.showEnableTypeOffice = false;
    this.showScanForm = true;
    this.addresseeDataSelect = null;
    const token = this.authService.decodeToken();
    console.log(token);
    if (token.preferred_username) {
      this.getUserDataLogged(
        token.preferred_username
          ? token.preferred_username.toLocaleUpperCase()
          : token.preferred_username
      );
    }
    this.buildForm();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        for (const key in this.paramsScreen) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            this.paramsScreen[key as keyof typeof this.paramsScreen] =
              params[key] ?? null;
          }
        }
        this.origin = params['origin'] ?? null;
        if (
          this.origin &&
          this.paramsScreen.TIPO != null &&
          this.paramsScreen.P_VALOR != null
        ) {
          this.btnSearchAppointment();
        }
        console.log(params, this.paramsScreen);
      });
    if (this.paramsScreen) {
      if (this.paramsScreen.TIPO && this.paramsScreen.P_VALOR) {
        this.initForm();
      } else {
        console.log('SIN PARAMETROS');
        this.alertInfo(
          'info',
          'Error en los paramétros',
          'Los paramétros No. Oficio: ' +
            this.paramsScreen.P_VALOR +
            ' y el Tipo Oficio: ' +
            this.paramsScreen.TIPO +
            ' al iniciar la pantalla son requeridos'
        );
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
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  initForm() {
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
          this.alertInfo(
            'info',
            'Error al cargar la información inicial de la pantalla de acuerdo a los paramétros recibidos',
            ''
          );
          subscription.unsubscribe();
        },
      });
    // this.btnSearchAppointment();
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
          this.alertInfo(
            'info',
            'Error al cargar la información inicial de la pantalla de acuerdo a los paramétros recibidos',
            ''
          );
          subscription.unsubscribe();
        },
      });
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
      file: [{ value: '', disabled: false }, [Validators.maxLength(11)]],
      numberOfficeDic: [
        { value: '', disabled: false },
        [Validators.required, Validators.maxLength(40)],
      ],
      typeOffice: [{ value: '', disabled: true }],
      cveOfficeGenerate: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(100)],
      ],
      authorizedDic: [
        { value: '', disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      issuingUser: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      name: [
        { value: '', disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      addressee: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      nameAddressee: [
        { value: '', disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      city: [
        { value: null, disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ], // SELECT
      descriptionCity: [
        { value: '', disabled: false },
        [Validators.required, Validators.pattern(STRING_PATTERN)],
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
          this.setDataAppointment();
          subscription.unsubscribe();
          this.getOfficeDictationData();
          // Call dictaminaciones por bien
          if (
            this.dictationTypeValidOption.includes(
              this.dictationData.typeDict
            ) &&
            !this.variables.identi.includes('4')
          ) {
            this.form.get('typeOffice').enable();
            this.showEnableTypeOffice = true;
          }
        },
        error: error => {
          this.loading = false;
          console.log(error);
          subscription.unsubscribe();
        },
      });
  }

  setDataAppointment() {
    this.form
      .get('cveOfficeGenerate')
      .setValue(this.dictationData.passOfficeArmy);
    this.form.get('file').setValue(this.dictationData.expedientNumber);
    this.form.get('numberOfficeDic').setValue(this.dictationData.id);
    this.showScanForm = false;
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
          this.goodsByDictation
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.loadGoodsByOfficeDictation());
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
    this.form.get('issuingUser').setValue(this.officeDictationData.sender); // Remitente
    this.form.get('addressee').setValue(this.officeDictationData.recipient); // Destinatario
    this.form.get('city').setValue(this.officeDictationData.city); // Ciudad
    this.form
      .get('numberNotary')
      .setValue(this.officeDictationData.notaryNumber);
    this.form
      .get('introductoryParagraph')
      .setValue(this.officeDictationData.text1);
    this.form.get('finalParagraph').setValue(this.officeDictationData.text2);
    this.form
      .get('moreInformation1')
      .setValue(this.officeDictationData.text2To);
    // Validar el texto3 de acuerdo al tipo de dictaminación
    this.officeDictationData =
      this.svLegalOpinionsOfficeService.getTexto3FromOfficeDictation(
        this.officeDictationData,
        this.form.get('typeOffice').value
      );
    this.form.get('moreInformation3').setValue(this.officeDictationData.text3);
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
    this.getCityByDetail(new ListParams(), true);
    this.getIssuingUserByDetail(new ListParams(), true);
    this.getAddresseeByDetail(new ListParams(), true);
  }

  enabledDataOffice() {
    this.form.get('issuingUser').enable();
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
    this.form.get('issuingUser').disable();
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
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          this.form.get('numberNotary').disable();
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
            i.menaje && i.good
              ? (i.good['menaje'] = i.menaje['noGoodMenaje'])
              : '';
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
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('numberOfDicta', this.officeDictationData.officialNumber);
    params.addFilter('typeDictamination', this.officeDictationData.typeDict);
    let subscription = this.svLegalOpinionsOfficeService
      .getOfficeCopiesDictation(params.getParams())
      .subscribe({
        next: data => {
          console.log('OFICIO COPIAS DICTAMEN', data);
          this.officeCopiesDictationData = data.data;
          this.setDataOfficeCopiesDictation();
          subscription.unsubscribe();
        },
        error: error => {
          console.log(error);
          this.officeCopiesDictationData = null;
          subscription.unsubscribe();
        },
      });
  }

  setDataOfficeCopiesDictation() {
    this.officeCopiesDictationData.forEach((copiesData, index) => {
      console.log(copiesData);
      this.form
        .get('ccp_person' + (index == 0 ? '' : '_1'))
        .setValue(copiesData.personExtInt);
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
    this.form
      .get('moreInformation2')
      .setValue(this.officeTextDictationData.textx);
  }

  getCityByDetail(paramsData: ListParams, getByValue: boolean = false) {
    console.log(paramsData);
    const params = new FilterParams();
    if (paramsData['search'] == undefined) {
      paramsData['search'] = '';
    }
    params.removeAllFilters();
    if (getByValue) {
      params.addFilter('idCity', this.form.get('city').value);
    } else {
      params.addFilter('nameCity', paramsData['search'], SearchFilter.LIKE);
    }
    params['sortBy'] = 'nameCity:ASC';
    console.log(params, paramsData);
    let subscription = this.svLegalOpinionsOfficeService
      .getCityByDetail(params.getParams())
      .subscribe({
        next: data => {
          this.cityData = new DefaultSelect(
            data.data.map(i => {
              i.nameAndId =
                '#' + i.idCity + ' -- ' + i.nameCity + ' -- ' + i.legendOffice;
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
  getIssuingUserByDetail(paramsData: ListParams, getByValue: boolean = false) {
    const params: any = new FilterParams();
    if (paramsData['search'] == undefined) {
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
              i.name = '#' + i.id + ' -- ' + i.name;
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
    }
  }
  // DELEGACION Y DEPARTAMENTO EN DESTINATARIO
  getAddresseeByDetail(paramsData: ListParams, getByValue: boolean = false) {
    if (paramsData['search'] == undefined) {
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
              i['description'] = '#' + i.user + ' -- ' + i.userDetail.name;
              return i;
            }),
            data.count
          );
          if (getByValue) {
            this.addresseeDataSelect = data.data[0];
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
              i.name = '#' + i.id + ' -- ' + i.name;
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
    console.log(this.form.get('issuingUser').value, this.dataUserLogged);
    if (this.blockSender) {
      return;
    }
    if (!this.officeDictationData) {
      this.alertInfo(
        'warning',
        'Se requiere cargar la información del Oficio para continuar',
        'Revisa los parámetros y vuelve a intentar'
      );
      return;
    }
    if (!this.dictationData) {
      this.alertInfo(
        'warning',
        'Se requiere cargar la información de la Dictaminación para continuar',
        'Revisa los parámetros y vuelve a intentar'
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
    if (
      this.form.get('issuingUser').value.toLocaleLowerCase() !=
      this.dataUserLogged.user.toLocaleLowerCase()
    ) {
      this.alertInfo(
        'warning',
        'El usuario actual no corresponde al del campo "Autoriza Dictaminación"',
        'Sólo el usuario del campo "Autoriza Dictaminación" puede realizar está acción'
      );
      return;
    }
    this.loadingSend = true;
    console.log('SEND OFFICE');

    let body: ICopiesOfficeSendDictation = {
      vc_pantalla: this.screenKey,
      clave_oficio_armada: this.dictationData.keyArmyNumber.toString(),
      estatus_of: this.officeDictationData.statusOf,
      fec_dictaminacion: this.dictationData.dictDate,
      tipo_dictaminacion: this.dictationData.typeDict,
      identi: this.variables.identi,
      no_volante: this.dictationData.wheelNumber,
      no_of_dicta: this.dictationData.id,
      toolbar_no_delegacion: this.dataUserLogged.delegationNumber, // Data del usuario
      nom_dest: this.addresseeDataSelect.userDetail.name,
      destinatario: this.officeDictationData.recipient,
      no_clasif_bien: null, // Bienes
      no_bien: null, // Bienes
      no_departamento_destinatario:
        this.officeDictationData.recipientDepartmentNumber,
      no_delegacion_destinatario:
        this.officeDictationData.delegacionRecipientNumber,
      no_delegacion_dictam: this.dictationData.delegationDictNumber, // Data del usuario
      tipo: this.paramsScreen.TIPO,
      usuario:
        this.dataUserLogged.user == 'SIGEBIADMON'
          ? this.dataUserLogged.user.toLocaleLowerCase()
          : this.dataUserLogged.user, // Data del usuario
      ciudad: this.officeDictationData.city.toString(),
      iden: null, // Bienes
      num_clave_armada: this.dictationData.keyArmyNumber, // CHECAR CUAL ES
      toolbar_no_departamento: this.dataUserLogged.departamentNumber, // Data del usuario
      toolbar_no_subdelegacion: this.dataUserLogged.subdelegationNumber, // Data del usuario
      estatus_dictaminacion: this.dictationData.statusDict,
      proceso_ext_dom: null, // Bienes
      paquete: Number(this.paramsScreen.PAQUETE),
    };
    console.log(body);
    if (count == 0) {
      this.totalCurrent = 1;
      this.totalCorrect = 0;
      this.totalIncorrect = 0;
    }
    this.sendGoodDataToSendOffice(count, body);
  }

  sendGoodDataToSendOffice(count: number, body: any) {
    let infoGood = this.goodData[count];
    body.no_clasif_bien = infoGood.good.goodClassNumber;
    body.no_bien = infoGood.good.goodId;
    body.iden = infoGood.good.identifier;
    body.proceso_ext_dom = infoGood.good.extDomProcess;
    console.log(
      'COPIAS OFICIO DICTAMEN',
      count,
      this.totalCurrent,
      this.goodData.length,
      this.totalData
    );
    this.sendOfficeAndGoodData(count, body);
  }

  sendOfficeAndGoodData(count: number, body: any) {
    console.log(
      'COPIAS OFICIO DICTAMEN',
      count,
      this.totalCurrent,
      this.goodData.length,
      this.totalData
    );
    let subscription = this.svLegalOpinionsOfficeService
      .getCopiesOfficeSendDictation(body)
      .subscribe({
        next: (res: any) => {
          count++;
          this.totalCurrent++;
          this.totalCorrect++;
          console.log(
            'COPIAS OFICIO DICTAMEN',
            res,
            count,
            this.totalCurrent,
            this.goodData.length,
            this.totalData
          );
          if (this.totalData > count) {
            this.sendOffice(count);
          }
          if (this.totalData == count) {
            this.loadingSend = false;
            this.alertInfo(
              'info',
              'Se enviaron correctamente ' +
                this.totalCorrect +
                ' Bien(es) de ' +
                this.totalData +
                '. Con ' +
                this.totalIncorrect +
                ' Error(es)',
              ''
            );
          }
          subscription.unsubscribe();
        },
        error: error => {
          count++;
          this.totalCurrent++;
          this.totalIncorrect++;
          console.log(
            error,
            count,
            this.totalCurrent,
            this.goodData.length,
            this.totalData
          );
          if (this.totalData > count) {
            this.sendOffice(count);
          }
          if (this.totalData == count) {
            this.loadingSend = false;
            this.alertInfo(
              'info',
              'Se enviaron correctamente ' +
                this.totalCorrect +
                ' Bien(es) de ' +
                this.totalData +
                '. Con ' +
                this.totalIncorrect +
                ' Error(es)',
              ''
            );
          }
          subscription.unsubscribe();
        },
      });
  }

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
    const title = 'Folios relacionados al expediente';
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

  btnDetail() {
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
      if (this.paramsScreen.TIPO == 'PROCEDENCIA') {
        // Realiza peticiones a cursores
        this.cuEmisora();
      } else {
        this.continuationOfMakeArmyKey();
      }
    }
  }

  getElectronicFirmCount() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('natureDocument', this.dictationData.typeDict);
    params.addFilter('documentNumber', this.dictationData.id);
    this.svLegalOpinionsOfficeService
      .getElectronicFirmData(params.getParams())
      .subscribe({
        next: data => {
          console.log('FIRMA ELECTRONICA', data);
          // PUP_CONSULTA_PDF_BD_SSF3(:DICTAMINACIONES.FOLIO_UNIVERSAL,2);
        },
        error: error => {
          console.log(error);
          if (error.status == 400) {
            this.getDictaminacionesCount();
          } else {
            this.loadDetail = false;
          }
        },
      });
  }

  getDictaminacionesCount() {
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
          this.runConditionReports();
        },
        error: error => {
          this.loadDetail = false;
          console.log(error);
          this.alert(
            'warning',
            'Error al obtener datos de las Dictaminaciones',
            error.error.message
          );
        },
      });
  }

  runConditionReports() {
    if (
      Number(this.paramsScreen.PAQUETE) > 0 &&
      this.dictationData.passOfficeArmy
    ) {
      // Continuar obteniendo los volantes
      this.getWheels();
    } else {
      // Llama reportes
      let params: any = {
        PARAMFORM: 'NO',
        P_OFICIO: this.goodData[0].ofDictNumber,
        TIPO_DIC: this.dictationData.typeDict,
        ESTAT_DIC: this.officeDictationData.typeDict,
      };
      if (this.variables.identi.includes('4')) {
        if (this.paramsScreen.TIPO == 'PROCEDENCIA') {
          params['NOME_DICTPRO'] = this.objDetail['vCLAVE_ARMADA']; // NO SE LLENA ESTA VARIABLE EN EL FORMS
          // this.runReport('RGENADBDICTAMASIV_EXT', params);
          this.runReport('blank', params);
        } else {
          this.runReport('RGENADBDICTAMASIV', params);
        }
      } else if (
        this.variables.identi.includes('A') &&
        this.paramsScreen.TIPO != 'ABANDONO'
      ) {
        if (this.paramsScreen.TIPO == 'PROCEDENCIA') {
          params['NOME_DICTPRO'] = this.objDetail['vCLAVE_ARMADA']; // NO SE LLENA ESTA VARIABLE EN EL FORMS
        }
        this.runReport('RGENADBDICTAMASIV', params);
      } else if (
        this.variables.identi.includes('T') &&
        this.paramsScreen.TIPO != 'ABANDONO'
      ) {
        if (this.paramsScreen.TIPO == 'PROCEDENCIA') {
          params['NOME_DICTPRO'] = this.objDetail['vCLAVE_ARMADA']; // NO SE LLENA ESTA VARIABLE EN EL FORMS
        }
        this.runReport('RGENADBDICTAMASIV', params);
      } else if (this.paramsScreen.TIPO == 'ABANDONO') {
        this.runReport('RGENABANDEC', params);
      } else {
        this.loadDetail = false;
      }
    }
  }

  getWheels() {
    const params = new FilterParams();
    params.removeAllFilters();
    params.addFilter('wheelNumber', this.dictationData.wheelNumber);
    this.svLegalOpinionsOfficeService
      .getWheelsByFilters(params.getParams())
      .subscribe({
        next: data => {
          console.log('NOTIFICATIONS', data);
          this.objDetail['vTIPO_VOLANTE'] = data.data[0].wheelType;
          this.reviewParametersFirstPart();
        },
        error: error => {
          this.loadDetail = false;
          console.log(error);
          this.alert(
            'warning',
            'Error al obtener el tipo de volante del dictamen',
            error.error.message
          );
        },
      });
  }

  reviewParametersFirstPart() {
    if (this.dictationData.passOfficeArmy.includes('?')) {
      this.onLoadToast(
        'info',
        'El dictamen se imprimirá parcial, hasta que se cierre',
        ''
      );
    }
    let params: any = {
      PARAMFORM: 'NO',
      P_OFICIO: this.dictationData.id,
      TIPO_DIC: this.dictationData.typeDict,
      CLAVE_ARMADA: this.dictationData.passOfficeArmy,
      TIPO_VOL: this.objDetail['vTIPO_VOLANTE'],
      ESTAT_DIC: this.dictationData.statusDict,
    };
    if (
      this.variables.identi.includes('4') &&
      this.paramsScreen.TIPO == 'PROCEDENCIA'
    ) {
      params['NOME_DICTPRO'] = this.objDetail['vCLAVE_ARMADA']; // NO SE LLENA ESTA VARIABLE EN EL FORMS
      // this.runReport('RGENREPDICTAMASDES_EXT', params);
      this.runReport('blank', params);
    } else {
      // this.runReport('RGENREPDICTAMASDES', params);
      this.runReport('blank', params);
    }
  }

  /**
   * Cargar los reportes en un modal
   * @param nameReport Nombre del Reporte
   * @param params Parametros para el reporte
   */
  runReport(nameReport: string, params: any) {
    this.postReport();
    this.siabService.fetchReport(nameReport, params).subscribe(response => {
      this.loadDetail = false;
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
        this.alert('warning', 'Reporte no disponible por el momento', '');
      }
    });
  }

  postReport() {
    if (
      this.officeDictationData.sender.toLocaleLowerCase() ==
      this.dataUserLogged.user.toLocaleLowerCase()
    ) {
      if (
        this.officeDictationData.statusOf == 'ENVIADO' ||
        !this.officeDictationData.statusOf ||
        this.officeDictationData.statusOf == 'EN REVISION'
      ) {
        this.blockSender = true;
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
      this.router.navigate(['/pages/juridical/juridical-ruling-g'], {
        queryParams: {
          origin: this.screenKey,
          P_GEST_OK: this.paramsScreen.P_GEST_OK,
          P_NO_TRAMITE: this.paramsScreen.P_NO_TRAMITE,
        },
      });
    }
  }
}
