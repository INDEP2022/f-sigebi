import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  map,
  skip,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { takeUntil } from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { IAttachedDocument } from 'src/app/core/models/ms-documents/attached-document.model';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IGoodJobManagement } from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import { IMJobManagement } from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { AtachedDocumentsService } from 'src/app/core/services/ms-documents/attached-documents.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { CopiesJobManagementService } from 'src/app/core/services/ms-office-management/copies-job-management.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RELATED_FOLIO_COLUMNS } from 'src/app/pages/administrative-processes/proceedings-conversion/proceedings-conversion-column';
import { ModalScanningFoilTableComponent } from 'src/app/pages/juridical-processes/depositary/legal-opinions-office/modal-scanning-foil/modal-scanning-foil.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { MODAL_CONFIG } from '../../../../../common/constants/modal-config';
import { AddDocsComponent } from '../add-docs/add-docs.component';
import { CppForm } from '../utils/cpp-form';
import { MarketingRecordsForm } from '../utils/marketing-records-form';
import { COLUMNS, COLUMNS2, COLUMNS3 } from './columns';
import { DocsData, GoodsData } from './data';

@Component({
  selector: 'app-marketing-records',
  templateUrl: './marketing-records.component.html',
  styles: [],
})
export class MarketingRecordsComponent extends BasePage implements OnInit {
  showJuridic: boolean = false;
  problematicRadios = new FormControl<1 | 2>(null);
  officeTypeCtrl = new FormControl<'ENT' | 'ESC'>(null);
  form = new FormGroup(new MarketingRecordsForm());
  documents: IGoodJobManagement[] = [];
  formCcp: FormGroup = new FormGroup({});
  // * Documents table & params
  documentsParams = new BehaviorSubject(new FilterParams());
  ccpParams = new BehaviorSubject(new FilterParams());
  docs: IAttachedDocument[] = [];
  //docs: any[] = [];
  ccpData: LocalDataSource = new LocalDataSource();
  data3: any[] = [];
  totalDocuments = 0;
  totalCcp = 0;
  // * Goods table & params
  goodsParams = new BehaviorSubject(new FilterParams());
  goods: IGood[] = [];
  totalGoods = 0;

  goodsData: any[] = GoodsData;

  cppForm = this.fb.group(new CppForm());
  copies: any[] = [];
  disableCpp: boolean = false;
  docSettings;
  ccpSettings;
  docsData: any[] = DocsData;
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  senders = new DefaultSelect();
  receivers = new DefaultSelect();
  cities = new DefaultSelect();

  //-----------------
  BIEN: any;
  user: any;
  NoExpediente: any;
  delegation: any;
  folioScan: any;
  wheelNumber: any;
  BANDERA: number = 0;
  CONSULTA: number = 2;
  GSt_todo: string = 'NADA';
  NO_DELE: any;
  gnu_resarcimiento: number = 0;
  V_OFICIO: any;
  DEV_DES: any;
  managementNumber: any;
  V_BANDERA: any;
  problematicaJuridica: boolean = false;
  //----------------

  usersCcp: any = [];
  gParams = {
    // P_GEST_OK
    pDestOk: '',
    //P_NO_TRAMITE
    pPaperworkNum: '',
    //TIPO_OF
    typeOf: '',
    //SALE
    sale: '',
    //DOC
    doc: '',
    // BIEN
    good: '',
    // VOLANTE
    flyer: '',
    // EXPEDIENTE
    expedient: '',
    // PLLAMO
    pllamo: '',
    // P_DICTAMEN
    pDictum: '',
  };

  get formType() {
    return this.form.controls.recordCommerType.value;
  }

  get controls() {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodsJobManagementService: GoodsJobManagementService,
    private mJobManagement: MJobManagementService,
    private showHide: showHideErrorInterceptorService,
    private goodService: GoodService,
    private attachedDocumentsService: AtachedDocumentsService,
    private usersService: UsersService,
    private cityService: CityService,
    private copiesJobManagement: CopiesJobManagementService,
    private documentsService: DocumentsService,
    private authService: AuthService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private numeraryService: NumeraryService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };

    this.docSettings = {
      ...this.settings,
      // actions: { add: false, delete: true, edit: false },
      columns: COLUMNS2,
    };

    this.ccpSettings = {
      ...this.settings,
      // actions: { add: false, delete: true, edit: false },
      columns: COLUMNS3,
    };
  }

  ngOnInit(): void {
    this.getUserLogin();
    this.prepareForm();
    this.onTypeFormChange();
    this.documentsParams
      .pipe(
        skip(1),
        takeUntil(this.$unSubscribe),
        switchMap(params => this.getDocuments(params))
      )
      .subscribe();
    this.goodsParams
      .pipe(
        skip(1),
        takeUntil(this.$unSubscribe),
        switchMap(params => this.getGoods(params))
      )
      .subscribe();
  }

  goodNumChange() {
    const goodId = this.controls.goodId.value;
    if (!goodId) {
      return;
    }
    const params = new FilterParams();
    params.limit = 100;
    params.addFilter('goodNumber', goodId);
    this.goodService
      .getById(goodId)
      .pipe(
        catchError(error => {
          this.onLoadToast('error', 'Error', 'El bien no existe');
          return throwError(() => error);
        }),
        switchMap(() => {
          this.showHide.showHideError(false);
          return this.goodsJobManagementService
            .getAllFiltered(params.getParams())
            .pipe(
              map(response => response.data.map(row => row.managementNumber)),
              switchMap(ids => this.getMGoods(ids, 'refersTo', 'OFCOMER'))
            );
        })
      )
      .subscribe({
        next: response =>
          this.handleDocumentsCount(response.count, response.data),
      });
  }

  handleDocumentsCount(count: number, documents: IMJobManagement[]) {
    if (count == 2) {
      this.chooseDocument(documents);
    }
  }

  async chooseDocument(documents: IMJobManagement[]) {
    const delyveryDcocument = documents.find(document =>
      document.description.includes('/ENT')
    );
    const deedDocument = documents.find(document =>
      document.description.includes('ESCRITURACION/ESC')
    );
    console.log({ deedDocument, delyveryDcocument });
    const result = await this.alertQuestion(
      'question',
      'El bien tiene dos oficios, seleccione uno',
      '',
      'Entrega',
      'Escrituracion'
    );
    // Entrega
    if (result.isConfirmed) {
      this.whenIsDelivery(delyveryDcocument);
    }

    // Escrituración
    if (!result.isConfirmed) {
      this.whenIsDeed(deedDocument);
    }
  }

  generalFunctions(document: IMJobManagement) {
    this.getCopies(document.managementNumber);
    this.form.patchValue(document);
    this.getAllData(document);
    if (document.statusOf == 'ENVIADO') {
      this.form.disable();
      this.officeTypeCtrl.disable();
      this.cppForm.disable();
      this.disableCpp = true;
    } else {
      this.form.enable();
      this.officeTypeCtrl.enable();
      this.cppForm.enable();
      this.disableCpp = false;
    }
  }

  getCopies(officeNum: string | number) {
    this.copiesJobManagement.getCopiesManagement(officeNum).subscribe({
      next: response => {
        this.copies = response.data.map(user => {
          return { id: user.nombre, name: user.nombre };
        });
      },
      error: error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener las copias'
        );
      },
    });
  }

  whenIsDelivery(document: IMJobManagement) {
    this.generalFunctions(document);

    this.officeTypeCtrl.setValue('ENT');
    this.controls.recordCommerType.setValue('bie');
  }

  whenIsDeed(document: IMJobManagement) {
    this.generalFunctions(document);
    this.officeTypeCtrl.setValue('ESC');
    this.controls.recordCommerType.setValue('bie');
    console.log(document.problematiclegal);
    if (document.problematiclegal?.includes('jurídica 3')) {
      this.problematicRadios.setValue(1);
    }

    if (document.problematiclegal?.includes('jurídica 4')) {
      this.problematicRadios.setValue(2);
    }
    this.showJuridic = true;
  }

  getAllData(document: IMJobManagement) {
    const { managementNumber, sender, addressee, city } = document;
    const docParams = this.documentsParams.getValue();
    docParams.removeAllFilters();
    docParams.addFilter('managementNumber', managementNumber);
    this.documentsParams.next(docParams);

    const goodParams = this.goodsParams.getValue();
    goodParams.removeAllFilters();
    goodParams.addFilter('managementNumber', managementNumber);
    this.goodsParams.next(goodParams);

    const sendersParams = new FilterParams();
    sendersParams.search = sender;
    this.getSenders2(sendersParams);
    const receiverParams = new FilterParams();
    receiverParams.search = addressee;
    this.getReceivers2(receiverParams);

    this.getCityById(city);
  }

  getSenders2(params: FilterParams) {
    this.getUsers(params).subscribe({
      next: response =>
        (this.senders = new DefaultSelect(response.data, response.count)),
      error: error =>
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener el Remitente'
        ),
    });
  }

  public getSenders(params: ListParams) {
    params.limit = 100;
    params.take = 100;
    this.usersService.getAllSegUsers(params).subscribe(
      data => {
        this.senders = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.senders = new DefaultSelect();
      },
      () => {}
    );
  }

  getCities(params: ListParams) {
    this.cityService.getAll(params).subscribe({
      next: response => {
        this.cities = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener las ciudades'
        );
      },
    });
  }

  getCityById(cityId: string | number) {
    this.cityService.getById(cityId).subscribe({
      next: city => {
        this.cities = new DefaultSelect([city], 1);
      },
      error: error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener la ciudad'
        );
      },
    });
  }

  getReceivers2(params: FilterParams) {
    console.log('entra 1');
    this.getUsers(params).subscribe({
      next: response =>
        (this.receivers = new DefaultSelect(response.data, response.count)),
      error: error =>
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener el Destinatario'
        ),
    });
  }

  public getReceivers(params: ListParams) {
    params.limit = 100;
    params.take = 100;
    this.usersService.getAllSegUsers(params).subscribe(
      data => {
        this.receivers = new DefaultSelect(data.data, data.count);
      },
      err => {
        this.receivers = new DefaultSelect();
      },
      () => {}
    );
  }

  getUsers(params: FilterParams) {
    return this.usersService.getAllSegUsers(params.getParams());
  }

  getDocuments(params: FilterParams) {
    return this.attachedDocumentsService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener los documentos'
        );
        return throwError(() => error);
      }),
      tap(response => {
        this.docs = response.data;
        this.totalDocuments = response.count;
      })
    );
  }

  getGoods(params: FilterParams) {
    return this.goodsJobManagementService
      .getAllFiltered(params.getParams())
      .pipe(
        catchError(error => {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio un error al obtener los bienes'
          );
          return throwError(() => error);
        }),
        tap(response => {
          this.goods = response.data.map(goodJob => goodJob.goodNumber);
          this.totalGoods = response.count;
        })
      );
  }

  getMGoods(ids: string[] | number[], filter: string, value: string) {
    this.managementNumber = ids.join(',');
    console.log('this.managementNumber ', this.managementNumber);
    const params = new FilterParams();
    params.addFilter('managementNumber', ids.join(','), SearchFilter.IN);
    params.addFilter(filter, value, SearchFilter.ILIKE);
    this.showHide.showHideError(false);
    return this.mJobManagement.getAllFiltered(params.getParams());
  }

  onTypeFormChange() {
    this.form.controls.recordCommerType.valueChanges
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: value => (value == 'bie' ? this.isGood() : this.isPortfolio()),
      });
  }

  isGood() {
    const { event, portfolio, lot, goodId } = this.controls;
    this.setControlNullAndOptional([event, portfolio, lot]);
    this.setControlRequired([goodId]);
  }

  isPortfolio() {
    const { event, portfolio, lot, goodId } = this.controls;
    this.setControlNullAndOptional([goodId]);
    this.setControlRequired([event, portfolio, lot]);
  }

  setControlNullAndOptional(controls: FormControl[]) {
    controls.forEach(control => {
      control.reset();
      control.removeValidators(Validators.required);
      control.updateValueAndValidity();
    });
  }

  setControlRequired(controls: FormControl[]) {
    controls.forEach(control => {
      control.addValidators(Validators.required);
      control.updateValueAndValidity();
    });
  }

  private prepareForm(): void {
    this.formCcp = this.fb.group({
      userId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      scannerFolio: [null],
    });

    this.formCcp.valueChanges.subscribe(value => {
      let includeId = this.usersCcp.some(
        (us: any) => us.userId == value.userId
      );
      let includeName = this.usersCcp.some((us: any) => us.name == value.name);
      if (!includeId && !includeName && this.formCcp.valid) {
        this.usersCcp.push(value);
      }
    });
  }

  openModal(context?: Partial<AddDocsComponent>): void {
    const modalRef = this.modalService.show(AddDocsComponent, {
      initialState: context,
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });

    modalRef.content.refresh.subscribe((data: any) => {});
  }

  delete(event: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este documento?'
    ).then(question => {
      if (question.isConfirmed) {
      }
    });
  }

  removeItem(index: number): void {
    this.usersCcp.splice(index, 1);
  }

  resetForm(): void {
    // this.alertQuestion(
    //   'warning',
    //   'Borrar',
    //   'Desea borrar los datos ingresados?'
    // ).then(question => {
    //   if (question.isConfirmed) {
    //   }
    // });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }
  getUserLogin() {
    let token = this.authService.decodeToken();
    console.log('token --> ', token);
    this.user = token.username.toUpperCase();
    this.delegation = token.department.toUpperCase();
    //this.getdepartament(userDepartament);
  }

  solicitud() {
    let folio = this.formCcp.get('scannerFolio').value;
    let DESCRIPCION1: any;
    if (folio != null) {
      this.alert('error', 'Error', 'El Oficio ya tiene folio de escaneo');
      return;
    } else {
      let CONSULTA = this.form.get('recordCommerType').value;
      let TIPO_OF = this.form.get('officeTypeCtrl').value;

      if (CONSULTA == 'bie') {
        if (TIPO_OF == 'ent') {
          DESCRIPCION1 = 'Oficio de Entrega Fisica con el Bien: ' + this.BIEN;
        } else if (TIPO_OF == 'esc') {
          DESCRIPCION1 = 'Oficio de Escrituracion con el  Bien: ' + this.BIEN;
        }
        let params = {
          natureDocument: 'ORIGINAL',
          descriptionDocument: DESCRIPCION1,
          significantDate: new Date(),
          scanStatus: 'SOLICITADO',
          userRequestsScan: this.user,
          scanRequestDate: new Date(),
          userRegistersScan: this.user,
          dateRegistrationScan: new Date(),
          keyTypeDocument: 'ENTRE',
          keySeparator: 60,
          numberProceedings: this.NoExpediente,
          numberDelegationRequested: this.delegation,
          numberSubdelegationRequests: 0,
          numberDepartmentRequest: this.delegation,
        };
        this.documentsService.insertDocuments(params).subscribe({
          next: response => {
            console.log('respuesta post documento --> ', response);
            this.folioScan = response.data[0];
            this.PupLanzaReporteSolicDigt();
          },
        });
      }
      if (CONSULTA == 'por') {
        if (this.goods.length > 0) {
          for (let i = 0; i < this.goods.length; i++) {
            this.pupGenFolio(this.goods[i].goodId);
            //falta el PUP_GEN_FOLIO_MAS
          }
          this.PupLanzaReporteSolicDigt();
        }
      }
    }
  }

  PupLanzaReporteSolicDigt() {
    let params = {
      pn_folio: this.folioScan,
    };
    if (params != null) {
      this.siabService.fetchReport('RGERGENSOLICDIGIT', params).subscribe({
        next: res => {
          if (res !== null) {
            const blob = new Blob([res], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              },
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          } else {
            const blob = new Blob([res], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              },
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          }
        },
        error: (error: any) => {
          console.log('error', error);
        },
      });
    }
  }

  PupLanzaReporte() {
    let nogestion = this.form.get('managementNumber').value;
    let params = {
      no_of_ges: nogestion,
    };
    let TIPO_OF = this.form.get('officeTypeCtrl').value;
    let report: any;
    if (TIPO_OF == 'ent') {
      report = 'REP_ENTREGA';
    } else if (TIPO_OF == 'esc') {
      report = 'RGEROFGESTION_ESCA';
    }
    if (params != null) {
      this.siabService.fetchReport(report, params).subscribe({
        next: res => {
          if (res !== null) {
            const blob = new Blob([res], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              },
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          } else {
            const blob = new Blob([res], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            let config = {
              initialState: {
                documento: {
                  urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
                  type: 'pdf',
                },
                callback: (data: any) => {},
              },
              class: 'modal-lg modal-dialog-centered',
              ignoreBackdropClick: true,
            };
            this.modalService.show(PreviewDocumentsComponent, config);
          }
        },
        error: (error: any) => {
          console.log('error', error);
        },
      });
    }
  }

  pupGenFolio(good: any) {
    let expediente: any;
    let TIPO_OF: any;
    let DESCRIPCION1: any;
    this.goodService.getGoodByNoGood(good).subscribe({
      next: response => {
        expediente = response.data[0].fileNumber;
        if (TIPO_OF == 'ent') {
          DESCRIPCION1 = 'Oficio de Entrega Fisica con el Bien: ' + this.BIEN;
        } else if (TIPO_OF == 'esc') {
          DESCRIPCION1 = 'Oficio de Escrituracion con el  Bien: ' + this.BIEN;
        }
        let params = {};
        //Falta Integrar el insert into Document, esta en los archivos pedidos a back
      },
    });
  }

  openScannerPage() {
    if (this.form.get('scannerFolio').value != null) {
      this.alertQuestion(
        'info',
        'Se Abrirá la Pantalla de Escaneo para el Folio de Escaneo del Dictamen. ¿Deseas continuar?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          //localStorage.setItem('folio', this.folioScan);
          //localStorage.setItem('expedient', this.expedient);
          //localStorage.setItem('acta', this.idProceeding);
          this.router.navigate([`/pages/general-processes/scan-documents`], {
            queryParams: {
              origin: 'FACTCONST_0001',
              folio: this.folioScan,
            },
          });
        }
      });
    } else {
      this.alertInfo(
        'warning',
        'Alerta',
        'No Tiene Folio de Escaneo para Continuar a la Pantalla de Escaneo'
      );
    }
  }

  insertListImg() {
    this.getDocumentsByFlyer(this.wheelNumber);
  }

  getDocumentsByFlyer(flyerNum: string | number) {
    const title = 'Folios relacionados al Volante';
    const modalRef = this.openDocumentsModal(flyerNum, title);
    modalRef.content.selected
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(document => this.getPicturesFromFolio(document));
  }

  openDocumentsModal(flyerNum: string | number, title: string) {
    const params = new FilterParams();
    params.addFilter('flyerNumber', flyerNum);
    const $params = new BehaviorSubject(params);
    const $obs = this.documentsService.getAllFilter;
    const service = this.documentsService;
    const columns = RELATED_FOLIO_COLUMNS;
    const body = {
      proceedingsNum: this.NoExpediente,
      flierNum: this.wheelNumber,
    };
    const config = {
      ...MODAL_CONFIG,
      initialState: {
        $obs,
        service,
        columns,
        title,
        $params,
        proceedingsNumber: this.NoExpediente,
        wheelNumber: this.wheelNumber,
        showConfirmButton: true,
      },
    };
    return this.modalService.show(
      ModalScanningFoilTableComponent<IDocuments>,
      config
    );
  }

  getPicturesFromFolio(document: IDocuments) {
    let folio = document.id;
    /*if (document.id != this.dictationData.folioUniversal) {
      folio = this.dictationData.folioUniversal;
    }*/
    // if (document.associateUniversalFolio) {
    //   folio = document.associateUniversalFolio;
    // }
    const config = {
      ...MODAL_CONFIG,
      ignoreBackdropClick: false,
      initialState: {
        folio,
      },
    };
    this.modalService.show(DocumentsViewerByFolioComponent, config);
  }

  BtnGoodPreview() {
    let V_NO_REGISTRO: number;
    let V_CONSULTA: string;
    let TIPO_OF: any;
    let CONSULTA: any;
    let VAL1: any;
    let VAL2: any;
    let VAL3: any;
    let val4: any;
    let val5: any;
    let val6: any;
    let NO_OF_GESTION = this.form.get('managementNumber').value;
    let ESTATUS_OF = this.form.get('statusOf').value;
    if (ESTATUS_OF == 'ENVIADO') {
      this.PupLanzaReporte();
    } else {
      if (this.BANDERA == 1) {
        this.goodsJobManagementService.getMJobManagement(ESTATUS_OF).subscribe({
          next: response => {
            const partes = response.data[0].description.split('/');
            if (partes.length > 1) {
              const segundaParte = partes[1];
              const palabras = segundaParte.split(' ');
              if (palabras.length > 0) {
                this.DEV_DES = palabras[0];
              }
            }
          },
        });
        this.PupLanzaReporte();
      } else if (this.BANDERA == 0) {
        if (this.V_BANDERA > 1) {
          if (ESTATUS_OF == 'REVISION') {
            //FALTA HACER ESTO, SE ESPERAN ENDPOINTS
            //GO_BLOCK('M_OFICIO_GESTION');
            //SET_BLOCK_PROPERTY('M_OFICIO_GESTION', DEFAULT_WHERE, 'NO_OF_GESTION = ' ||: M_OFICIO_GESTION.NO_OF_GESTION);
            //EXECUTE_QUERY;
          }
          this.goodsJobManagementService
            .getMJobManagement(ESTATUS_OF)
            .subscribe({
              next: response => {
                const partes = response.data[0].description.split('/');
                if (partes.length > 1) {
                  const segundaParte = partes[1];
                  const palabras = segundaParte.split(' ');
                  if (palabras.length > 0) {
                    V_CONSULTA = palabras[0];
                    if (V_CONSULTA == 'ENT') {
                      TIPO_OF = 'ENT';
                      CONSULTA = 'BIE';
                    }
                    if (V_CONSULTA == 'ESC') {
                      TIPO_OF = 'ESC';
                      CONSULTA = 'BIE';
                    }
                    this.showJuridic = true;
                    this.form
                      .get('problematiclegal')
                      .setValue(response.data[0].problematiclegal);
                    if (ESTATUS_OF == 'EN REVISION') {
                      //FALTA INTEGRAR PUP_ACTUALIZA(:M_OFICIO_GESTION.NO_OF_GESTION);
                    }
                    this.PupLanzaReporte();
                  }
                }
              },
            });
        }
        if (this.V_BANDERA == 1) {
          this.goodsJobManagementService.getSeq().subscribe({
            next: response => {
              VAL1 = response.data.nextval;
              const partes = VAL1.split('?');
              if (partes.length >= 2) {
                VAL2 = partes[0];
                VAL3 = partes[1];
              }
              if ((TIPO_OF = 'ENT')) {
                val4 = VAL2 + '' + 'ENT/?';
                val5 = val4 + '' + VAL3;
              } else if ((TIPO_OF = 'ESC')) {
                val4 = VAL2 + '' + 'ESC/?';
                val5 = val4 + '' + VAL3;
              }

              this.form.get('cveManagement').patchValue('EN REVISION');
              this.form.get('statusOf').patchValue(val5);
              this.form.get('seRefiereA').patchValue('OFCOMER');
            },
          });

          //------------------- BIENES-------------------------
          for (let i = 0; i < this.goods.length; i++) {
            let params = {
              managementNumber: NO_OF_GESTION,
              goodNumber: this.goods[i].goodId,
              //"recordNumber": "Dato de tipo numérico"
            };
            this.goodsJobManagementService.postJobManagement(params).subscribe({
              next: response => {},
            });
          }
          //------------------DOCUMENTOS-----------------------
          for (let i = 0; i < this.docs.length; i++) {
            let paramsdocument = {
              managementNumber: NO_OF_GESTION,
              cveDocument: this.docs[i].cveDocument,
              rulingType: this.docs[i].opinionType,
              recordNumber: '',
            };
            this.goodsJobManagementService
              .postDocumentJobManagement(paramsdocument)
              .subscribe({
                next: response => {},
              });

            this.numeraryService.nexSeqBitacora().subscribe({
              next: response => {
                let V_NO_REGISTRO = response.data.nextval;
                let params = {
                  managementNumber: NO_OF_GESTION,
                  cveDocument: this.docs[i].cveDocument,
                  description: this.docs[i].description,
                  recordNumber: V_NO_REGISTRO,
                  opinionType: 'COMER',
                };
                this.documentsService.postDocumentHAttached(params).subscribe({
                  next: response => {},
                });
              },
            });
          }
          //---------------------COPIAS------------------------
          for (let i = 0; i < this.data3.length; i++) {
            val6 = NO_OF_GESTION + '' + this.data3[i].destinatario;
          }
        }
      }
    }
  }
}
