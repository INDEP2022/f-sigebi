import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { forkJoin, takeUntil } from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from 'src/app/common/services/show-hide-error-interceptor.service';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGoodJobManagement } from 'src/app/core/models/ms-officemanagement/good-job-management.model';
import { IMJobManagement } from 'src/app/core/models/ms-officemanagement/m-job-management.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { AuthorityService } from 'src/app/core/services/catalogs/authority.service';
import { CityService } from 'src/app/core/services/catalogs/city.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { AtachedDocumentsService } from 'src/app/core/services/ms-documents/attached-documents.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { EventAppService } from 'src/app/core/services/ms-event/event-app.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { NumeraryService } from 'src/app/core/services/ms-numerary/numerary.service';
import { CopiesJobManagementService } from 'src/app/core/services/ms-office-management/copies-job-management.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { JobDictumTextsService } from 'src/app/core/services/ms-office-management/job-dictum-texts.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { TranfergoodService } from 'src/app/core/services/ms-transfergood/transfergood.service';
import { IndUserService } from 'src/app/core/services/ms-users/ind-user.service';
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
  form = new FormGroup(new MarketingRecordsForm());
  documents: IGoodJobManagement[] = [];
  formCcp: FormGroup = new FormGroup({});
  // * Documents table & params
  documentsParams = new BehaviorSubject(new FilterParams());
  ccpParams = new BehaviorSubject(new FilterParams());
  //docs: IAttachedDocument[] = [];
  docs: any[] = [];
  docsLocalData: LocalDataSource = new LocalDataSource();
  ccpData: LocalDataSource = new LocalDataSource();
  data3: any[] = [];
  totalDocuments = 0;
  totalCcp = 0;
  // * Goods table & params
  goodsParams = new BehaviorSubject(new FilterParams());
  //goods: IGood[] = [];
  goods: any[] = [];
  localGoods: LocalDataSource = new LocalDataSource();
  totalGoods = 0;

  goodsData: any[] = GoodsData;
  officeTypeCtrl = new FormControl<'ENT' | 'ESC'>('ENT');
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
  @ViewChild('portfolioInput', { static: false }) portfolioInput: ElementRef;

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
  V_VALIDA: any;
  PORTAFOLIO: any;
  LOTE: any;
  EVENTO: any;
  M_MES: any;
  COPIAS: any;
  COPIAS1: any;
  problematicaJuridica: boolean = false;
  flyerNumber: any;
  V_VALBIEN: any;
  NO_OF_GESTION: any;
  NO_BIEN: any;
  Descripcion: any;
  M_DES: any;
  NO_VOLANTE: any;
  NO_EXPEDIENTE: any;
  activeSol: boolean = false;
  activeScan: boolean = false;
  activeDelete: boolean = false;
  activeDoc: boolean = false;
  activeSend: boolean = false;
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
    private numeraryService: NumeraryService,
    private tranfergoodService: TranfergoodService,
    private eventAppService: EventAppService,
    private goodprocessService: GoodprocessService,
    private jobDictumTextsService: JobDictumTextsService,
    private comerClientsService: ComerClientsService,
    private lotService: LotService,
    private indUserService: IndUserService,
    private authorityService: AuthorityService
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
    params.addFilter('goods.goodId', goodId);
    this.goodService
      .getById(goodId)
      .pipe(
        catchError(error => {
          this.onLoadToast('error', 'Error', 'El bien no existe');
          this.form.get('goodId').setErrors({ customErrorKey: true });
          return throwError(() => error);
        }),
        switchMap(() => {
          this.showHide.showHideError(false);
          return this.goodsJobManagementService
            .getAllFilteredV2(params.getParams())
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

  eventInput() {
    let V_VER_PORT = true;
    let lote = this.form.get('lot').value;
    let Evento = this.form.get('event').value;
    let portafolio = this.form.get('portfolio').value;
    if (lote == null) {
      this.alert('error', 'Error', 'Debe Ingresar el número de Lote');
      return;
    } else if (Evento == null) {
      this.alert('error', 'Error', 'Debe Ingresar el número de Evento');
      return;
    } else if (portafolio == null) {
      this.alertQuestion(
        'info',
        'El portafolio está vacío, debe ingresarlo!',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          if (this.portfolioInput) {
            this.portfolioInput.nativeElement.focus();
          }
          V_VER_PORT = false;
        }
      });
    } else if ((V_VER_PORT = true)) {
      //falta PUP_OBTINFOPORTA
      this.pupObtinFoPorta();
    }
  }

  handleDocumentsCount(count: number, documents: IMJobManagement[]) {
    let good = this.form.get('goodId').value;
    let VAL_TIPOF2: any;
    let VAL_TIPOF: any;
    let TIPO_OF: any;
    console.log('count ----> ', count);
    if (count == 2) {
      this.chooseDocument(documents);
    } else if (count == 1) {
      this.jobDictumTextsService.getData(good).subscribe({
        next: response => {
          VAL_TIPOF = response.data[0].getword;
          if ((VAL_TIPOF = 'ENT')) {
            VAL_TIPOF = 'ENTREGA';
            VAL_TIPOF2 = 'ESCRITURACION';
          } else if ((VAL_TIPOF = 'ESC')) {
            VAL_TIPOF = 'ESCRITURACION';
            VAL_TIPOF2 = 'ENTREGA';
          }
        },
      });
      //servicio pedido a Eduardo
    }
    if (count < 2) {
      let good = this.form.get('goodId').value;
      this.goodsJobManagementService.getblokOffice1(good).subscribe({
        next: response => {
          console.log('Respuesta de getblockOffice1 ', response);
          this.V_VALBIEN = response.data[0].no_bien;
          this.alertQuestion(
            'info',
            'Este bien tiene un oficio de: ' +
              VAL_TIPOF +
              ' generar el oficio de: ' +
              VAL_TIPOF2 +
              '. ¿Deseas continuar?',
            '',
            'Aceptar',
            'Cancelar'
          ).then(res => {
            console.log(res);
            if (res.isDismissed) {
              this.goodsJobManagementService
                .getOficeJobManagementbyGood(this.V_VALBIEN)
                .subscribe({
                  next: respon => {
                    console.log('Office Job --> ', respon);
                    let managementNumber: any = respon.data[0].managementNumber;
                    this.goodsJobManagementService
                      .getMJobJobManagement(managementNumber)
                      .subscribe({
                        next: response => {
                          console.log(
                            'respuensta GetMJobJobManagement --> ',
                            response
                          );
                          this.V_OFICIO = response.data[0].managementNumber;
                          this.BANDERA = 1;
                          this.NO_OF_GESTION = this.V_OFICIO;
                          this.form.patchValue({
                            managementNumber: this.V_OFICIO,
                          });
                          //falta PUP_EXTRAE_DATO(:GLOBAL.V_OFICIO);
                          this.PupExtraeDato(this.V_OFICIO);
                        },
                      });
                  },
                });
            } else {
              if (VAL_TIPOF2 == 'ESCRITURACION') {
                TIPO_OF = 'ESC';
                //Falta PUP_AGREGA_TEXTO
                this.PupAgregaTexto();
              } else if (VAL_TIPOF2 == 'ENTREGA') {
                TIPO_OF = 'ENT';
                //Falta PUP_AGREGA_TEXTO
                this.PupAgregaTexto();
              }
              this.V_VALBIEN = null;
              if (this.V_VALBIEN == null) {
                this.BANDERA = 0;
                this.NO_BIEN = this.form.get('goodId').value;
                let VC_PANTALLA = 'FOFICIOCOMER';
                let params = {
                  goodNo: this.NO_BIEN,
                  screen: VC_PANTALLA,
                };
                this.goodprocessService.postBlokOffice3(params).subscribe({
                  next: resp => {
                    console.log('respuesta de BlokOFfice3 --> ', resp);
                    this.NO_VOLANTE = response.data[0].no_volante;
                    this.NO_EXPEDIENTE = response.data[0].no_expediente;
                    this.form.patchValue({
                      status: resp.data[0].estatus,
                      desStatus: resp.data[0].descripcion,
                    });
                    this.BIEN = response.data[0].no_bien;
                    let param = {
                      goodId: response.data[0].no_bien,
                      description: response.data[0].descripcion,
                      amout: response.data[0].cantidad,
                      identifier: response.data[0].identificador,
                    };
                    this.goods.push(param);
                    this.localGoods.load(this.goodsData);
                  },
                });
              }
            }
          });
        },
        error: err => {
          this.V_VALBIEN = null;
        },
      });
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
    let name = params['search'];
    let filtro: any = '';
    if (name != null && name != undefined) {
      let filtro = '?filter.nameCity=$ilike:' + name;
      this.cityService.getAllByCity(filtro, params).subscribe({
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
    } else {
      this.cityService.getAllByCity(filtro, params).subscribe({
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
    console.log(
      'this.mJobManagement.getAllFiltered(params.getParams()); --> ',
      this.mJobManagement.getAllFiltered(params.getParams())
    );
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

    modalRef.content.refresh.subscribe((data: any) => {
      console.log('data111 ', data);
      if (data != null) {
        this.docs = [];
        this.docsLocalData.load(this.docs);
        for (let i = 0; i < data.length; i++) {
          let params = {
            cveDocument: data[i].key,
            description: data[i].document,
          };
          this.docs.push(params);
        }
        this.docsLocalData.load(this.docs);
      }
    });
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
    this.BIEN = this.form.get('goodId').value;
    let DESCRIPCION1: any;
    if (folio != null) {
      this.alert('error', 'Error', 'El Oficio ya tiene folio de escaneo');
      return;
    } else {
      let CONSULTA = this.form.get('recordCommerType').value;
      let TIPO_OF = this.officeTypeCtrl.value;

      if (CONSULTA == 'bie') {
        if (TIPO_OF == 'ENT') {
          DESCRIPCION1 = 'Oficio de Entrega Fisica con el Bien: ' + this.BIEN;
        } else if (TIPO_OF == 'ESC') {
          DESCRIPCION1 = 'Oficio de Escrituracion con el  Bien: ' + this.BIEN;
        }
        this.goodprocessService.getSeqFolio().subscribe({
          next: response => {
            const formattedfecFin = this.formatDate(new Date());
            let params = {
              natureDocument: 'ORIGINAL',
              descriptionDocument: DESCRIPCION1,
              significantDate: formattedfecFin,
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
          },
        });
      }
      if (CONSULTA == 'por') {
        if (this.goods.length > 0) {
          for (let i = 0; i < this.goods.length; i++) {
            this.pupGenFolio(this.goods[i].goodId);
            //falta el PUP_GEN_FOLIO_MAS
            this.PupGenFolioMas();
          }
          this.PupLanzaReporteSolicDigt();
        }
      }
    }
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${month}/${year}`;
  }

  PupGenFolioMas() {
    let NO_OF_GESTION = this.form.get('managementNumber').value;
    let params = {
      noOfGestion: NO_OF_GESTION,
      univFolio: this.folioScan,
      user: this.user,
      delegNo: this.delegation,
      subDelegNo: 0,
      departmentNo: this.delegation,
    };
    this.documentsService.postFolioMasive(params).subscribe({
      next: response => {
        console.log('Se genero el Folio Masivo ', response);
      },
    });
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

  PupLanzaReportes() {
    let nogestion = this.form.get('managementNumber').value;
    let params = {
      no_of_ges: nogestion,
    };
    let TIPO_OF = this.officeTypeCtrl.value;
    let report: any;
    if (TIPO_OF == 'ENT') {
      //FALTA PUP_ENT_LOTE
      report = 'REP_ENT_POR';
    } else if (TIPO_OF == 'ESC') {
      report = 'RGEROFGESTION_ESCAP';
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

  PupLanzaReporte() {
    let nogestion = this.form.get('managementNumber').value;
    let params = {
      no_of_ges: nogestion,
    };
    let TIPO_OF = this.officeTypeCtrl.value;
    let report: any;
    if (TIPO_OF == 'ENT') {
      this.PupRemiEnt();
      //REP_ENTREGA
      report = 'blank';
    } else if (TIPO_OF == 'ESC') {
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
    let PJURIDICA: any;
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
        this.goodsJobManagementService
          .getMJobManagement(NO_OF_GESTION)
          .subscribe({
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
        let NO_OF_GESTION = this.form.get('managementNumber').value;
        if (this.V_BANDERA > 1) {
          if (ESTATUS_OF == 'REVISION') {
            //FALTA HACER ESTO, SE ESPERAN ENDPOINTS
            //GO_BLOCK('M_OFICIO_GESTION');
            //SET_BLOCK_PROPERTY('M_OFICIO_GESTION', DEFAULT_WHERE, 'NO_OF_GESTION = ' ||: M_OFICIO_GESTION.NO_OF_GESTION);
            //EXECUTE_QUERY;
            this.goodsJobManagementService
              .getMJobManagement(NO_OF_GESTION)
              .subscribe({
                next: response1 => {
                  console.log(
                    'respuesta del servicio en el primero boton ',
                    response1
                  );
                },
              });
            //Crear una funcion para mapear con este endpoint
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
                      this.PupActualiza(NO_OF_GESTION);
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
          if (this.goods.length > 0) {
            for (let i = 0; i < this.goods.length; i++) {
              let params = {
                managementNumber: NO_OF_GESTION,
                goodNumber: this.goods[i].goodId,
                //"recordNumber": "Dato de tipo numérico"
              };
              this.goodsJobManagementService
                .postJobManagement(params)
                .subscribe({
                  next: response => {},
                });
            }
          }
          //------------------DOCUMENTOS-----------------------
          if (this.docs.length > 0) {
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
                  this.documentsService
                    .postDocumentHAttached(params)
                    .subscribe({
                      next: response => {},
                    });
                },
              });
            }
          }
          //---------------------COPIAS------------------------
          if (this.data3.length > 0) {
            for (let i = 0; i < this.data3.length; i++) {
              val6 = NO_OF_GESTION + '' + this.data3[i].destinatario;
              let params = {
                managementNumber: NO_OF_GESTION,
                addresseeCopy: this.data3[i].destinatario,
                recordNumber: '',
              };
              this.goodsJobManagementService
                .postOficeJobManagement(params)
                .subscribe({
                  next: response => {},
                });
            }
          }
          this.DEV_DES = null;

          this.PupLanzaReporte();

          //Falta Hacer Esto
          /*
          GO_BLOCK('M_OFICIO_GESTION');
          SET_BLOCK_PROPERTY('M_OFICIO_GESTION',DEFAULT_WHERE,'NO_OF_GESTION = '||:M_OFICIO_GESTION.NO_OF_GESTION);
          EXECUTE_QUERY;
          */
          this.goodsJobManagementService
            .getMJobManagement(NO_OF_GESTION)
            .subscribe({
              next: response1 => {
                console.log(
                  'respuesta del servicio en el primero boton ',
                  response1
                );
              },
            });
          //----------------------------------------

          this.goodsJobManagementService
            .getMJobManagement(NO_OF_GESTION)
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
                      this.goodsJobManagementService
                        .getMJobJuridica3(NO_OF_GESTION)
                        .subscribe({
                          next: respon => {
                            this.V_VALIDA = response.count;
                            if (this.V_VALIDA == 1) {
                              PJURIDICA = 1;
                            }
                          },
                          error: err => {
                            this.V_VALIDA = 0;
                          },
                        });
                      this.goodsJobManagementService
                        .getMJobJuridica4(NO_OF_GESTION)
                        .subscribe({
                          next: respon => {
                            this.V_VALIDA = response.count;
                            if (this.V_VALIDA == 2) {
                              PJURIDICA = 2;
                            }
                          },
                          error: err => {
                            this.V_VALIDA = 0;
                          },
                        });
                      TIPO_OF = 'ESC';
                      CONSULTA = 'BIE';
                      this.officeTypeCtrl.patchValue('ESC');
                      this.form.patchValue({
                        recordCommerType: 'bie',
                      });
                      this.showJuridic = true;
                      this.goodsJobManagementService
                        .getMJobManagement(NO_OF_GESTION)
                        .subscribe({
                          next: response => {
                            this.form
                              .get('problematiclegal')
                              .patchValue(response.data[0].problematiclegal);
                          },
                        });
                      //FALTAN ESTOS ENDPOINTS
                      /*
                    select nombre into :nom_rem
                      from seg_usuarios 
                     where usuario in(select remitente
                                        from m_oficio_gestion
                                       where no_of_gestion=:M_OFICIO_GESTION.NO_OF_GESTION);
                       select nombre into :nom_des
                        from seg_usuarios 
                       where usuario in(select destinatario
                                          from m_oficio_gestion
                                         where no_of_gestion=:M_OFICIO_GESTION.NO_OF_GESTION);
                    */
                      this.usersService
                        .getBtnViewPrev(NO_OF_GESTION)
                        .subscribe({
                          next: response => {
                            this.loadAdress(response.data[0].destinatario);
                            this.loadsender(response.data[0].remitente);
                          },
                        });
                      this.V_BANDERA = this.V_BANDERA + 1;
                    }
                  }
                }
              },
            });
        }
      }
    }
  }

  loadAdress(user: string) {
    this.indUserService.getUser(user).subscribe({
      next: response => {
        this.receivers = new DefaultSelect(response.data, response.count);
        this.form.get('addressee').setValue(response.data[0].user);
      },
    });
  }

  loadsender(user: string) {
    this.indUserService.getUser(user).subscribe({
      next: response => {
        this.senders = new DefaultSelect(response.data, response.count);
        this.form.get('sender').setValue(response.data[0].user);
      },
    });
  }

  loadcity(city: string) {
    this.cityService.getCityQuery(city).subscribe({
      next: response => {
        this.cities = new DefaultSelect(response.data, response.count);
        this.form.get('city').setValue(response.data[0].idCity);
      },
    });
  }

  loadcitybyid(city: string) {
    this.cityService.getCityQueryByid(city).subscribe({
      next: response => {
        this.cities = new DefaultSelect(response.data, response.count);
        this.form.get('city').setValue(response.data[0].idCity);
      },
    });
  }

  btnPrivous() {
    let DOCUMENTO: any;
    let TEXTO: any;
    let TEXTO1: any;
    let V_NO_REGISTRO: any;
    let V_CONSULTA: any;
    let CONSULTA: any;
    let TIPO_OF: any;
    let val1: any;
    let val2: any;
    let val3: any;
    let val4: any;
    let val5: any;
    let val6: any;
    let val7: any;
    let NO_OF_GESTION = this.form.get('managementNumber').value;
    let ESTATUS_OF = this.form.get('statusOf').value;

    if (ESTATUS_OF == 'ENVIADO') {
      this.PupLanzaReportes();
    } else {
      if (this.BANDERA == 1) {
        this.goodsJobManagementService
          .getMJobManagement(NO_OF_GESTION)
          .subscribe({
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
        //FALTA PUP_ACTUALIZA(:GLOBAL.V_OFICIO);
        this.PupActualiza(this.V_OFICIO);
        this.PupLanzaReportes();
      } else if (this.BANDERA == 0) {
        if (this.V_BANDERA == 1) {
          if (ESTATUS_OF == 'REVISION') {
            /*
            IF :M_OFICIO_GESTION.ESTATUS_OF='REVISION' THEN  
                    GO_BLOCK('M_OFICIO_GESTION');
                    SET_BLOCK_PROPERTY('M_OFICIO_GESTION',DEFAULT_WHERE,'NO_OF_GESTION = '||:M_OFICIO_GESTION.NO_OF_GESTION);
                    EXECUTE_QUERY;

                    select nombre 
                      into :nom_rem
                        from seg_usuarios 
                          where usuario in(select remitente
                                          from m_oficio_gestion
                                         where no_of_gestion=:M_OFICIO_GESTION.NO_OF_GESTION);
                               
                      select nombre 
                        into :nom_des
                        from seg_usuarios 
                          where usuario in(select destinatario
                                            from m_oficio_gestion
                                           where no_of_gestion=:M_OFICIO_GESTION.NO_OF_GESTION);  
            */

            this.goodsJobManagementService
              .getMJobManagement(NO_OF_GESTION)
              .subscribe({
                next: response1 => {
                  console.log(
                    'respuesta del servicio en el primero boton ',
                    response1
                  );
                },
              });
            //Crear una funcion para mapear con este endpoint

            this.usersService.getBtnViewPrev(NO_OF_GESTION).subscribe({
              next: response => {
                this.loadAdress(response.data[0].destinatario);
                this.loadsender(response.data[0].remitente);
              },
            });

            this.goodsJobManagementService
              .getMJobManagement(NO_OF_GESTION)
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
                        // this.officeTypeCtrl.patchValue('ESC');
                        // this.form.patchValue({
                        //   recordCommerType: 'bie'
                        // })
                      }
                      if (V_CONSULTA == 'ESC') {
                        TIPO_OF = 'ESC';
                        CONSULTA = 'BIE';
                        // this.officeTypeCtrl.patchValue('ESC');
                        // this.form.patchValue({
                        //   recordCommerType: 'bie'
                        // })
                        this.showJuridic = true;
                        this.goodsJobManagementService
                          .getMJobManagement(NO_OF_GESTION)
                          .subscribe({
                            next: response => {
                              this.form
                                .get('problematiclegal')
                                .patchValue(response.data[0].problematiclegal);
                            },
                          });
                      }
                    }
                  }
                },
              });
          } else if (ESTATUS_OF == 'EN REVISION') {
            //FALTA EL PUP_ACTUALIZA(:M_OFICIO_GESTION.NO_OF_GESTION);
            this.PupActualiza(NO_OF_GESTION);
          }
          this.PupLanzaReportes();
        }
        if (this.V_BANDERA == 1) {
          if (this.goods.length > 0) {
            for (let i = 0; i < this.goods.length; i++) {
              this.goodsJobManagementService.getSeq().subscribe({
                next: response => {
                  //VAL1:= PUF_GENERA_CLAVE;
                  const partes = val1.split('?');
                  if (partes.length >= 2) {
                    val2 = partes[0];
                    val3 = partes[1];
                  }
                  if ((TIPO_OF = 'ENT')) {
                    val4 = val2 + '' + 'ENT/?';
                    val5 = val4 + '' + val3;
                  } else if ((TIPO_OF = 'ESC')) {
                    val4 = val2 + '' + 'ESC/?';
                    val5 = val4 + '' + val3;
                  }
                  this.form.get('cveManagement').patchValue(val5);
                },
              });
            }
            let portafolio = this.form.get('portfolio').value;
            let lote = this.form.get('lot').value;
            let evento = this.form.get('event').value;
            if (portafolio == null) {
              this.alert(
                'warning',
                'Importante',
                'Es necesario el numero de Portafolio'
              );
              return;
            }
            if (lote == null) {
              this.alert('warning', 'Importante', 'Es necesario el Lote');
              return;
            }
            if (evento == null) {
              this.alert('warning', 'Importante', 'Es necesario el Evento');
              return;
            }
            let description =
              'P: ' +
              portafolio +
              ' L: ' +
              lote +
              ' E: ' +
              evento +
              '/' +
              this.M_MES +
              ' ' +
              this.user;
            this.form.get('description').patchValue(description);
            this.form.get('statusOf').patchValue('EN REVISION');
            this.form.get('seRefiereA').patchValue('OFCOMER');
            this.PORTAFOLIO = portafolio;
            this.LOTE = lote;
            this.EVENTO = evento;

            //------------------- BIENES-------------------------
            if (this.goods.length > 0) {
              for (let i = 0; i < this.goods.length; i++) {
                let params = {
                  managementNumber: NO_OF_GESTION,
                  goodNumber: this.goods[i].goodId,
                  //"recordNumber": "Dato de tipo numérico"
                };
                this.goodsJobManagementService
                  .postJobManagement(params)
                  .subscribe({
                    next: response => {},
                    error: err => {
                      console.log('error 1');
                    },
                  });
              }
            }
            //------------------DOCUMENTOS-----------------------
            if (this.docs.length > 0) {
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
                    this.documentsService
                      .postDocumentHAttached(params)
                      .subscribe({
                        next: response => {},
                      });
                  },
                });
              }
            }
            //---------------------COPIAS------------------------
            if (this.data3.length > 0) {
              for (let i = 0; i < this.data3.length; i++) {
                val6 = NO_OF_GESTION + '' + this.data3[i].destinatario;
                let params = {
                  managementNumber: NO_OF_GESTION,
                  addresseeCopy: this.data3[i].destinatario,
                  recordNumber: '',
                };
                this.goodsJobManagementService
                  .postOficeJobManagement(params)
                  .subscribe({
                    next: response => {},
                  });
              }
            }
            this.DEV_DES = null;

            this.PupLanzaReportes();
            //FALTA
            /*
              GO_BLOCK('M_OFICIO_GESTION');
                SET_BLOCK_PROPERTY('M_OFICIO_GESTION',DEFAULT_WHERE,'NO_OF_GESTION = '||:M_OFICIO_GESTION.NO_OF_GESTION);
                EXECUTE_QUERY;
                PUP_EXTRAE_DATOS(:GLOBAL.NO_OF_GESTION);
            */
            this.goodsJobManagementService
              .getMJobManagement(NO_OF_GESTION)
              .subscribe({
                next: response1 => {
                  console.log(
                    'respuesta del servicio en el primero boton ',
                    response1
                  );
                },
              });
            //Crear una funcion para mapear con este endpoint
            this.PupExtraeDatos(NO_OF_GESTION);
            this.V_BANDERA = this.V_BANDERA + 1;
            //Activar biton cerrar-Enviar y el de Borrar Oficio
          }
        }
      }
    }
  }

  closeSend() {
    let vc_pantalla = 'FOFICIOCOMER';
    let EST_FINAL: string;
    let cveDocument = this.form.get('cveManagement').value;
    let NO_OF_GESTION = this.form.get('managementNumber').value;
    let FOLIO: any;
    let lv_VALFOLUNI: any;
    let consulta = this.form.get('recordCommerType').value;
    let ESTATUS_OF = this.form.get('statusOf').value;
    this.alertQuestion(
      'question',
      'El oficio sera enviado y cerrado',
      '¿Deseas continuar?'
    ).then(q => {
      if (q.isConfirmed) {
        if (this.folioScan == null) {
          this.alert('error', 'Error', 'Es necesario un folio de escaneo');
          return;
        }
        this.documentsService.getDocumentsCursor(this.folioScan).subscribe({
          next: response => {},
          error: err => {
            this.alert(
              'error',
              'Error',
              'No se puede cerrar el oficio, no tiene imagenesw escaneadas'
            );
            return;
          },
        });
        if (consulta == 'por') {
          /*
          SELECT DISTINCT(1) INTO FOLIO
           FROM DOCUMENTOS 
          WHERE FOLIO_UNIVERSAL=:FOLIO_UNIVERSAL
             OR FOLIO_UNIVERSAL_ASOC=:FOLIO_UNIVERSAL;
          
                      	
           IF FOLIO=1 THEN       
          
             UPDATE DOCUMENTOS 
             SET ESTATUS_ESCANEO='ESCANEADO'
             WHERE FOLIO_UNIVERSAL_ASOC=:GLOBAL.LN_folio;

           ENDIF
          */
          //son los de abajo ya integrados falta probar
          this.documentsService
            .getDocumentInvoiceFolio(this.folioScan)
            .subscribe({
              next: response => {
                this.documentsService
                  .getDocumentInvoiceFolioAsoc(this.folioScan)
                  .subscribe({
                    next: response => {},
                  });
              },
            });
        }
        /*
                NO_OF_GESTION  := :M_OFICIO_GESTION.NO_OF_GESTION;
           
           GO_BLOCK('M_OFICIO_GESTION');
           SET_BLOCK_PROPERTY('M_OFICIO_GESTION',DEFAULT_WHERE,'NO_OF_GESTION = '||NO_OF_GESTION);
           EXECUTE_QUERY;
        */

        /*
          SELECT NOMBRE INTO :M_OFICIO_GESTION.NOM_REM
        FROM SEG_USUARIOS WHERE USUARIO IN(
        SELECT REMITENTE
        FROM M_OFICIO_GESTION 
        WHERE NO_OF_GESTION=:GLOBAL.NO_OF_GESTION);
        
        SELECT NOMBRE INTO :M_OFICIO_GESTION.NOM_DES
        FROM SEG_USUARIOS WHERE USUARIO IN(
        SELECT DESTINATARIO
        FROM M_OFICIO_GESTION 
        WHERE NO_OF_GESTION=:GLOBAL.NO_OF_GESTION);
        
        
        SELECT leyenda_oficio INTO :M_OFICIO_GESTION.DES_CIDAD
        FROM cat_ciudades
        WHERE NO_CIUDAD IN(SELECT CIUDAD 
                           FROM M_OFICIO_GESTION
                           WHERE NO_OF_GESTION=:GLOBAL.NO_OF_GESTION);
        */

        this.usersService.getBtnViewPrev(NO_OF_GESTION).subscribe({
          next: response => {
            this.loadAdress(response.data[0].destinatario);
            this.loadsender(response.data[0].remitente);
          },
        });
        this.authorityService.getobtnCityQuery(NO_OF_GESTION).subscribe({
          next: response => {
            console.log('response get city ', response);
            this.loadcity(response.data[0].leyenda_oficio);
          },
        });

        if (
          (ESTATUS_OF == 'EN REVISION' && consulta == 'bie') ||
          this.CONSULTA == 1
        ) {
          //FALTA PUP_BUSCA_NUMERO
          this.form.get('statusOf').patchValue('ENVIADO');
          /*
            LIP_COMMIT_SILENCIOSO;
            Set_Item_Property('enviar',ICON_NAME,'../iconos/rt_lock');
            SET_ITEM_PROPERTY('ENVIAR',ENABLED,PROPERTY_FALSE);
            --SET_ITEM_PROPERTY('oficio',ENABLED,PROPERTY_TRUE);
            SET_ITEM_PROPERTY('BORRAR',ENABLED,PROPERTY_FALSE);
            --SET_ITEM_PROPERTY('IMPR',ENABLED,PROPERTY_TRUE);
            SET_ITEM_PROPERTY('DOC',ENABLED,PROPERTY_FALSE);
            SET_ITEM_PROPERTY('IMG_SOLICITUD',ENABLED,PROPERTY_FALSE);
            SET_ITEM_PROPERTY('IMG_ESCANEO',ENABLED,PROPERTY_FALSE);
            --SET_ITEM_PROPERTY('IMG_VER_IMAGENES',ENABLED,PROPERTY_FALSE);
            SET_ITEM_PROPERTY('IMG_IMP_SOL_DIGIT',ENABLED,PROPERTY_FALSE);
            Set_Item_Property('enviar',ICON_NAME,'../iconos/rt_lock');
          */
          this.PupLanzaReporte();
          //FALTA PUP_EXTRAE_DATO(:GLOBAL.NO_OF_GESTION);
        }
        if (
          (ESTATUS_OF == 'EN REVISION' && consulta == 'por') ||
          this.CONSULTA == 2
        ) {
          //FALTA PUP_BUSCA_NUMERO
          /*
           UPDATE M_OFICIO_GESTION
           SET CVE_OF_GESTION=:M_OFICIO_GESTION.CVE_OF_GESTION
           WHERE NO_OF_GESTION=:M_OFICIO_GESTION.NO_OF_GESTION;
          */
          let params = {
            cveOfGestion: cveDocument,
            numberOfGestion: NO_OF_GESTION,
          };
          this.goodsJobManagementService
            .updateMJobManagement(params)
            .subscribe({
              next: response => {},
            });
          this.form.get('statusOf').patchValue('ENVIADO');
          /*
            Set_Item_Property('ENVIAR',ICON_NAME,'../iconos/rt_lock');
          SET_ITEM_PROPERTY('ENVIAR',ENABLED,PROPERTY_FALSE);
          SET_ITEM_PROPERTY('BORRAR',ENABLED,PROPERTY_FALSE);
          SET_ITEM_PROPERTY('IMPR',ENABLED,PROPERTY_FALSE);
          SET_ITEM_PROPERTY('DOC',ENABLED,PROPERTY_FALSE);
          SET_ITEM_PROPERTY('IMG_SOLICITUD',ENABLED,PROPERTY_FALSE);
          SET_ITEM_PROPERTY('IMG_ESCANEO',ENABLED,PROPERTY_FALSE);
           -- SET_ITEM_PROPERTY('IMG_VER_IMAGENES',ENABLED,PROPERTY_FALSE);
          SET_ITEM_PROPERTY('IMG_IMP_SOL_DIGIT',ENABLED,PROPERTY_FALSE); */

          this.PupLanzaReportes();
          // FALTA PUP_EXTRAE_DATOS(:GLOBAL.NO_OF_GESTION);
        }

        //---------------------COPIAS------------------------
        if (this.data3.length > 0) {
          for (let i = 0; i < this.data3.length; i++) {
            this.COPIAS = this.data3[i].regional;
            this.COPIAS1 = this.COPIAS + ';' + this.COPIAS1;
          }
          //FALTA PUP_CONVIERTE
          this.PupMail();
        }
      }
    });
  }

  btnDelete() {
    let NO_OF_GESTION = this.form.get('managementNumber').value;
    let cveDocument = this.form.get('cveManagement').value;
    this.alertQuestion(
      'question',
      'Se eliminara el oficio',
      '¿Deseas continuar?'
    ).then(q => {
      if (q.isConfirmed) {
        let params = {
          managementNumber: NO_OF_GESTION,
          cveDocument: cveDocument,
        };
        this.goodsJobManagementService
          .deleteOficeJobManagement(params)
          .subscribe({
            next: response => {
              console.log('goods Job delete Ok', response);
            },
            error: err => {
              console.log('goods Job delete error', err);
            },
          });
        this.goodsJobManagementService
          .deleteCopiesJob(NO_OF_GESTION)
          .subscribe({
            next: response => {
              console.log('copies Job delete Ok', response);
            },
            error: err => {
              console.log('copies Job delete error', err);
            },
          });
        this.goodsJobManagementService.deleteDocumentJob(params).subscribe({
          next: response => {
            console.log('document Job delete Ok', response);
          },
          error: err => {
            console.log('document Job delete error', err);
          },
        });
        let paramsMJob = {
          managementNumber: NO_OF_GESTION,
          flyerNumber: this.flyerNumber,
        };
        this.goodsJobManagementService
          .deleteMJobManagement(paramsMJob)
          .subscribe({
            next: response => {
              console.log('document M Job Management delete Ok', response);
            },
            error: err => {
              console.log('document M Job Management delete error', err);
            },
          });
        this.documentsService.deleteDocumentHAttached(NO_OF_GESTION).subscribe({
          next: response => {
            console.log('document attached delete Ok', response);
          },
          error: err => {
            console.log('document attached delete error', err);
          },
        });
        this.documentsService.deleteDocumentsInvoice(this.folioScan).subscribe({
          next: response => {
            console.log('document delete Ok', response);
          },
          error: err => {
            console.log('document delete error', err);
          },
        });
        //FALTA INTEGRAR DELETE FROM DOCUMENTOS WHERE FOLIO_UNIVERSAL=:FOLIO_UNIVERSAL OR FOLIO_UNIVERSAL_ASOC=:FOLIO_UNIVERSAL;
        //PEDIDO A YELTSIN
        this.form.reset();
        this.data3 = [];
        this.ccpData.load(this.data3);
        this.goods = [];
        this.docs = [];
      }
    });
  }

  PupMail() {
    let copydestinationarray: any[] = [];
    let destination = this.form.get('addressee').value;
    let CVE_OF_GESTION = this.form.get('cveManagement').value;
    let mesaje =
      'SE GENERO EL OFICIO: ' +
      CVE_OF_GESTION +
      ' PARA ENTREGA FISICA DE BIENES INMUEBLES CON FOLIO DE ESCANEO No. ' +
      this.folioScan;

    if (this.data3.length > 0) {
      const requests = this.data3.map(item =>
        this.usersService.getUsersbyUSer(item.destinatario)
      );

      forkJoin(requests).subscribe({
        next: responses => {
          responses.forEach((response, i) => {
            const destination = response.data.email;
            copydestinationarray.push(destination);
          });

          // Ahora que todas las copias se han cargado, envía el correo.
          this.sendEmail(destination, copydestinationarray, mesaje);
        },
      });
    } else {
      // Si no hay datos3, también puedes enviar el correo directamente.
      this.sendEmail(destination, copydestinationarray, mesaje);
    }
  }

  sendEmail(
    destination: string,
    copydestinationarray: string[],
    mesaje: string
  ) {
    let params = {
      header: '',
      destination: destination,
      copy: copydestinationarray,
      subject: 'OFICIO COMER',
      message: mesaje,
    };

    this.tranfergoodService.sendEmail(params).subscribe({
      next: response => {
        console.log('Se envió el correo ', response);
      },
    });
  }

  PupActualiza(NO_OF_GESTION: any) {
    let V_NO_REGISTRO: any;
    //let NO_OF_GESTION = this.form.get('managementNumber').value;
    let cveDocument = this.form.get('cveManagement').value;
    let params = {
      managementNumber: NO_OF_GESTION,
      cveDocument: cveDocument,
    };
    //FALTA
    /*
    UPDATE M_OFICIO_GESTION 
    SET CVE_OF_GESTION=:M_OFICIO_GESTION.CVE_OF_GESTION,REMITENTE=REMITENTE,DESTINATARIO=DESTINATARIO,CIUDAD=CIUDAD,
    TEXTO1=TEXTO1,TEXTO2=TEXTO2,OFICIO_POR=OFICIO_POR,TEXTO3=TEXTO3
    WHERE NO_OF_GESTION=OF_GESTION;
    */

    //------------------DOCUMENTOS-----------------------
    this.documentsService.deleteDocumentHAttached(NO_OF_GESTION).subscribe({
      next: response => {
        console.log('document attached update-delete Ok', response);
      },
      error: err => {
        console.log('document attached update-delete error', err);
      },
    });
    this.goodsJobManagementService.deleteDocumentJob(params).subscribe({
      next: response => {
        console.log('document Job update-delete Ok', response);
      },
      error: err => {
        console.log('document Job update-delete error', err);
      },
    });
    if (this.docs.length > 0) {
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
    }
    //---------------------COPIAS------------------------
    this.goodsJobManagementService.deleteCopiesJob(NO_OF_GESTION).subscribe({
      next: response => {
        console.log('copies Job delete Ok', response);
      },
      error: err => {
        console.log('copies Job delete error', err);
      },
    });
    if (this.data3.length > 0) {
      for (let i = 0; i < this.data3.length; i++) {
        let params = {
          managementNumber: NO_OF_GESTION,
          addresseeCopy: this.data3[i].destinatario,
          recordNumber: '',
        };
        this.goodsJobManagementService
          .postOficeJobManagement(params)
          .subscribe({
            next: response => {
              console.log('Ofice Job post Ok', response);
            },
            error: err => {
              console.log('Ofice Job post error', err);
            },
          });
      }
    }
  }

  PupRemiEnt() {
    let noBien = this.form.get('goodId').value;
    this.eventAppService.getPupRemiEnt(noBien).subscribe({
      next: response => {
        console.log('response -----> ', response);
      },
    });
  }

  PupAgregaTexto() {
    let noBien = this.form.get('goodId').value;
    let lote = this.form.get('lot').value;
    let evento = this.form.get('event').value;
    let recordCommerType = this.form.get('recordCommerType').value;
    console.log('recordCommerType ', recordCommerType);
    let officeTypeCtrl = this.officeTypeCtrl.value;
    console.log('officeTypeCtrl ', officeTypeCtrl);

    if (recordCommerType == 'bie' && officeTypeCtrl == 'ENT') {
      console.log('entra 1');
      this.M_DES = 'ENT';
      this.V_BANDERA = 1;
      let noBien = this.form.get('goodId').value;
      //Cursor A
      this.comerClientsService.getCursorA(noBien).subscribe({
        next: response => {
          console.log('response Cursor A-->', response);
          //Cursor B
          this.comerClientsService.getCursorB(noBien).subscribe({
            next: resp => {
              console.log('response Cursor B-->', resp);
              let text1 =
                'Con relacion a los inmuebles, bajo administracion del SAE te informo que el precio de venta del/los bienes descrito en próximas líneas ha sido cubierto en su totalidad, por lo que requiero tu apoyo para coordinar las acciones que permitan llevar a cabo la entrega física del bien al comprador, asimismo se remita a esta Dirección, copia simple del documento comprobatorio "Acta".';
              let text2 =
                'GENERALIDADES DEL COMPRADOR:\n\n' +
                'CLIENTE: ' +
                response.data[0].nom_razon +
                '\n' +
                'RFC: ' +
                response.data[0].rfc +
                '\n' +
                'Domicilio: ' +
                '\n' +
                'Calle: ' +
                response.data[0].calle +
                '\n' +
                'Colonia: ' +
                response.data[0].colonia +
                '\n' +
                'Cp: ' +
                response.data[0].cp +
                '\n' +
                'Entidad: ' +
                response.data[0].ciudad +
                '\n' +
                'Tel: ' +
                response.data[0].telefono +
                '\n' +
                'Correo Web: ' +
                response.data[0].correoweb +
                '\n\n' +
                //falta
                'CARACTERISTICAS DEL INMUEBLE:\n' +
                'No. de Bien: ' +
                resp.data[0].no_bien +
                '\n' +
                'NO. Inv: ______ ' +
                '\n' +
                'Estatus: ' +
                resp.data[0].estatus +
                '\n' +
                'Descripcion: ' +
                resp.data[0].descripcion +
                '\n' +
                'Transferente: ' +
                resp.data[0].nombre_transferente +
                '\n' +
                'Cve. Evento: ' +
                resp.data[0].cve_evento +
                '\n';
              let text3 = 'Sin otro particular, reciba un cordial saludo.';
              this.Descripcion = 'ENTREGA' + '/' + this.M_DES + ' ' + this.user;
              this.form.patchValue({
                text1: text1,
                text2: text2,
                text3: text3,
              });
            },
          });
        },
      });
    } else if (recordCommerType == 'por' && officeTypeCtrl == 'ENT') {
      this.M_DES = 'PENT';
      this.V_BANDERA = 1;

      let paramsAptFolio = {
        publicLot: lote,
        eventId: evento,
      };
      this.comerClientsService.getCursorAptFolio(paramsAptFolio).subscribe({
        next: response => {
          console.log('response Cursor AptFolio-->', response);
          this.comerClientsService.getCursorDesBienes(noBien).subscribe({
            next: resp => {
              console.log('response Cursor DesBienes --> ', resp);
              let text1 =
                'Con relacion a los inmuebles, bajo administracion del SAE te informo que el precio de venta del/los bienes descrito en próximas líneas ha sido cubierto en su totalidad, por lo que requiero tu apoyo para coordinar las acciones que permitan llevar a cabo la entrega física del bien al comprador, asimismo se remita a esta Dirección, copia simple del documento comprobatorio "Acta".';
              let text2 =
                'GENERALIDADES DEL COMPRADOR:\n\n' +
                'CLIENTE: ' +
                response.data[0].nom_razon +
                '\n' +
                'RFC: ' +
                response.data[0].rfc +
                '\n' +
                'Domicilio: ' +
                '\n' +
                'Calle: ' +
                response.data[0].calle +
                '\n' +
                'Colonia: ' +
                response.data[0].colonia +
                '\n' +
                'Cp: ' +
                response.data[0].cp +
                '\n' +
                'Entidad: ' +
                response.data[0].ciudad +
                '\n' +
                'Tel: ' +
                response.data[0].telefono +
                '\n' +
                'Correo Web: ' +
                response.data[0].correoweb +
                '\n\n' +
                //falta
                'CARACTERISTICAS DEL INMUEBLE:\n' +
                'No. de Bien: ______' +
                '\n' +
                'NO. Inv: ______ ' +
                '\n' +
                'Estatus: ' +
                resp.data[0].estatus +
                '\n' +
                'Descripcion: ' +
                resp.data[0].num_bienes +
                ' BIENES ' +
                resp.data[0].val7 +
                ' ' +
                resp.data[0].val2 +
                ' ' +
                resp.data[0].val3 +
                ' ' +
                resp.data[0].val4;
              '\n' +
                'Transferente: ' +
                resp.data[0].nombre_transferente +
                '\n' +
                'Cve. Evento: ' +
                resp.data[0].cve_evento +
                '\n';
              let text3 = 'Sin otro particular, reciba un cordial saludo..';
              this.form.patchValue({
                text1: text1,
                text2: text2,
                text3: text3,
              });
            },
          });
        },
      });
    } else if (recordCommerType == 'bie' && officeTypeCtrl == 'ESC') {
      this.M_DES = 'ESC';
      this.V_BANDERA = 1;
      this.showJuridic = true;
      this.comerClientsService.getCursor1(noBien).subscribe({
        next: response => {
          console.log('respuesta Cursor 1 ', response);
          this.lotService
            .getGlobalGoodEventLot(response.data[0].id_lote)
            .subscribe({
              next: respon => {
                console.log('respuesta lote del cursor 1', respon);
                let text1 =
                  'Me refiero a la operación de compraventa entre esta Institución y el SR. ' +
                  response.data[0].nom_razon +
                  ' respecto al inmueble identificado como  ' +
                  response.data[0].descripcion +
                  response.data[0].campo3 +
                  ',' +
                  response.data[0].campo1 +
                  ', ____________________' +
                  ' con número de inventario:' +
                  response.data[0].no_inventario +
                  ' procedente de la ' +
                  '________' +
                  ' y adjudicado mediante el proceso de ' +
                  response.data[0].lower +
                  ' ___________ en $' +
                  respon.data[0].finalPrice +
                  ' (_______________________00/100 M.N.), mas I.V.A' +
                  '\n';
                let text2 =
                  'Sobre el particular, solicito su apoyo a fin de girar Carta de instrucción al ' +
                  '___________________________________________ ' +
                  ' con domicilio en ' +
                  '____________________' +
                  ' Tel:______________' +
                  ' y se inicien los tramites de escrituración a  favor de ' +
                  '____________________' +
                  'con  número de tel.' +
                  '______' +
                  'Para tales efectos se ha digitalizado la siguiente documentación:';
                let text3 = 'Sin otro particular, reciba un cordial saludo.';
                this.Descripcion =
                  'ESCRITURACIÓN' + '/' + this.M_DES + ' ' + this.user;
                this.form.patchValue({
                  text1: text1,
                  text2: text2,
                  text3: text3,
                });
              },
            });
        },
        error: err => {
          let text1 =
            'Me refiero a la operación de compraventa entre esta Institución y el SR. ' +
            '____________' +
            ' respecto al inmueble identificado como  ' +
            '_______________' +
            ', ____________________' +
            ' con número de inventario Portafolio ' +
            this.form.get('portfolio').value +
            ' proveniente de ' +
            '________' +
            ' y mediante el proceso de ' +
            '_____________' +
            ' en $' +
            '_______________' +
            ' (_______________________00/100 M.N.), mas I.V.A' +
            '\n';
          let text2 =
            'Sobre el particular, solicito su apoyo a fin de girar Carta de instrucción al ' +
            '___________________________________________ ' +
            ' con domicilio en ' +
            '____________________' +
            ' Tel:______________' +
            ' y se inicien los tramites de escrituración a  favor de ' +
            '____________________' +
            'con  número de tel.' +
            '______' +
            'Para tales efectos se ha digitalizado la siguiente documentación:';
          let text3 = 'Sin otro particular, reciba un cordial saludo.';
          this.form.patchValue({
            text1: text1,
            text2: text2,
            text3: text3,
          });
        },
      });
    } else if (recordCommerType == 'por' && officeTypeCtrl == 'ESC') {
      this.M_DES = 'PESC';
      this.V_BANDERA = 1;
      this.showJuridic = true;
      let text1 =
        'Me refiero a la operación de compraventa entre esta Institución y el  ' +
        '____________' +
        ' respecto al inmueble identificado como  ' +
        '_______________' +
        ', ____________________' +
        ' con número de inventario Portafolio ' +
        this.form.get('portfolio').value +
        ' proveniente de ' +
        '________' +
        ' y mediante el proceso de ' +
        '_____________' +
        ' en $' +
        '_______________' +
        ' (_______________________00/100 M.N.), mas I.V.A' +
        '\n';
      let text2 =
        'Sobre el particular, solicito su apoyo a fin de girar Carta de instruccón al ' +
        '___________________________________________ ' +
        ' con domicilio en ' +
        '____________________' +
        ' Tel:______________' +
        ' y se inicien los tramites de escrituración a  favor de ' +
        '____________________' +
        'con  número de tel.' +
        '______' +
        'Para tales efectos se ha digitalizado la siguiente documentación:';
      let text3 = 'Sin otro particular, reciba un cordial saludo.';
      this.form.patchValue({
        text1: text1,
        text2: text2,
        text3: text3,
      });
    }
  }

  PupExtraeDato(OF_GESTION: number) {
    let noBien = this.form.get('goodId').value;
    let params = {
      ofManagement: Number(OF_GESTION),
      goodNumber: Number(noBien),
    };
    this.jobDictumTextsService.pupExtractData(params).subscribe({
      next: response => {
        this.loadcitybyid(response.CIUDAD);
        this.loadAdress(response.DESTINATARIO);
        this.loadsender(response.REMITENTE);
        this.showJuridic = true;
        if (response.ESTATUS_OF == 'ENVIADO') {
          this.activeSol = true;
          this.activeScan = true;
          this.activeDelete = true;
          this.activeDoc = true;
          this.activeSend = true;
        }
        if (response.FOLIO_UNIVERSAL != null) {
          this.formCcp.patchValue({
            scannerFolio: response.FOLIO_UNIVERSAL,
          });
          this.activeSol = true;
          this.folioScan = response.FOLIO_UNIVERSAL;
        }
        this.form.patchValue({
          cveManagement: response.CVE_OF_GESTION,
          salesProcess: response.OFICIO_POR,
          text1: response.TEXTO1,
          text2: response.TEXTO2,
          text3: response.TEXTO3,
          managementNumber: response.NO_OF_GESTION,
          problematiclegal: response.PROBLEMATICA_JURIDICA,
          statusOf: response.ESTATUS_OF,
        });
        console.log('response Extrae Data--> ', response);
        //falta el resto del flujo
        //Documents docsLocalData docs
        this.documentsService.getDocumentsattachment(OF_GESTION).subscribe({
          next: response => {
            this.docs = [];
            this.docsLocalData.load(this.docs);
            console.log('Respuesta Documents ', response);
            for (let i = 0; i < response.data.length; i++) {
              let params = {
                cveDocument: response.data[i].cveDocument,
                description: response.data[i].description,
                managementNumber: response.data[i].managementNumber,
                recordNumber: response.data[i].recordNumber,
                opinionType: response.data[i].opinionType,
              };
              this.docs.push(params);
            }
            this.docsLocalData.load(this.docs);

            //Bienes
            this.jobDictumTextsService.getCursorGoods2(OF_GESTION).subscribe({
              next: response => {
                this.goods = [];
                this.localGoods.load(this.goods);
                console.log('respuesta del Get bienes --> ', response);
                for (let i = 0; i < response.data.length; i++) {
                  let params = {
                    goodId: response.data[i].no_bien,
                    description: response.data[i].descripcion,
                    amout: response.data[i].cantidad,
                    identifier: response.data[i].identificador,
                  };
                  this.goods.push(params);
                }
                this.localGoods.load(this.goods);
              },
            });

            //COPIAS
            this.jobDictumTextsService.getcursorCopys(OF_GESTION).subscribe({
              next: response => {
                this.data3 = [];
                this.ccpData.load(this.data3);
                console.log('respuesta COPIAS --> ', response);
                for (let i = 0; i < response.data.length; i++) {
                  let params = {
                    destinatario: response.data[i].usuario,
                    regional: response.data[i].nombre,
                  };
                  this.data3.push(params);
                }
                this.ccpData.load(this.data3);
              },
            });
          },
        });
      },
    });
  }

  PupExtraeDatos(OF_GESTION: number) {
    let lote = this.form.get('lot').value;
    let evento = this.form.get('event').value;
    let params = {
      ofManagement: Number(OF_GESTION),
      lot: Number(lote),
      event: Number(evento),
    };
    this.jobDictumTextsService.pupExtractDatas(params).subscribe({
      next: response => {
        console.log('response Extrae Datas --> ', response);
        //Documents docsLocalData docs
        this.documentsService.getDocumentsattachment(OF_GESTION).subscribe({
          next: response => {
            this.docs = [];
            this.docsLocalData.load(this.docs);
            console.log('Respuesta Documents ', response);
            for (let i = 0; i < response.data.length; i++) {
              let params = {
                cveDocument: response.data[i].cveDocument,
                description: response.data[i].description,
                managementNumber: response.data[i].managementNumber,
                recordNumber: response.data[i].recordNumber,
                opinionType: response.data[i].opinionType,
              };
              this.docs.push(params);
            }
            this.docsLocalData.load(this.docs);
          },
        });

        //Bienes
        let param = {
          vcScreen: 'FOFICIOCOMER',
          lot: Number(lote),
          event: Number(evento),
        };
        this.jobDictumTextsService.getCursorGoods(param).subscribe({
          next: response => {
            console.log('respuesta del Get bienes --> ', response);
            for (let i = 0; i < response.data.length; i++) {
              let params = {
                goodId: response.data[i].no_bien,
                description: response.data[i].descripcion,
                amout: response.data[i].cantidad,
                identifier: response.data[i].identificador,
                no_expediente: response.data[i].no_expediente,
              };
              this.goods.push(params);
            }
            this.localGoods.load(this.goods);
          },
        });

        //COPIAS
        this.jobDictumTextsService.getcursorCopys(OF_GESTION).subscribe({
          next: response => {
            console.log('respuesta COPIAS --> ', response);
            for (let i = 0; i < response.data.length; i++) {
              let params = {
                destinatario: response.data[i].usuario,
                regional: response.data[i].nombre,
              };
              this.data3.push(params);
            }
            this.ccpData.load(this.data3);
          },
        });
      },
    });
  }

  pupObtinFoPorta() {
    let lote = this.form.get('lot').value;
    let Evento = this.form.get('event').value;
    let portafolio = this.form.get('portfolio').value;
    let V_OFICIO: any;
    let VAL_TIPOF: any;
    let VAL_TIPOF2: any;
    let TIPO_OF: any;
    let VAL_CONT: any;
    let params = {
      screenVc: 'FOFICIOCOMER',
      portFolio: Number(portafolio),
      lot: Number(lote),
      event: Number(Evento),
    };
    this.jobDictumTextsService.getPupObtInfoPort(params).subscribe({
      next: response => {
        console.log('Procedimiento PupObtieneInforPort ', response);
        V_OFICIO = response.data[0].GLOBAL_V_OFICIO;
        VAL_TIPOF = response.data[0].VAL_TIPOF;
        VAL_TIPOF2 = response.data[0].VAL_TIPOF2;
        VAL_CONT = response.data[0].VAL_CONT;
        if (V_OFICIO != null) {
          this.alertQuestion(
            'info',
            'Este Lote-Evento tiene un oficio de: ' +
              VAL_TIPOF +
              ' ¿Generar el oficio de : ' +
              VAL_TIPOF2 +
              ' ?. ¿Deseas continuar?',
            '',
            'Aceptar',
            'Cancelar'
          ).then(res => {
            console.log(res);
            if (res.isDismissed) {
              //:PRUEBAS.NO_OF_GESTION := :M_OFICIO_GESTION.NO_OF_GESTION;
              this.NO_OF_GESTION = V_OFICIO;
              this.form.patchValue({
                managementNumber: V_OFICIO,
              });
              this.PupExtraeDatos(V_OFICIO);
              this.BANDERA = 1;
            } else {
              if (this.BANDERA == 0) {
                if ((VAL_TIPOF2 = 'ESCRITURACION')) {
                  TIPO_OF = 'ESC';
                  this.PupAgregaTexto();
                } else if ((VAL_TIPOF2 = 'ENTREGA')) {
                  TIPO_OF = 'ENT';
                  this.PupAgregaTexto();
                }
                this.V_OFICIO = null;
                if (V_OFICIO == null) {
                  this.BANDERA = 0;
                  //falta PUP_PORTAFOLIO
                }
              }
            }
          });
        }
      },
    });
  }

  PupPortafolio() {
    let lote = this.form.get('lot').value;
    let event = this.form.get('event').value;
    let params = {
      eventId: event,
      publicLot: lote,
      screen: 'FOFICIOCOMER',
    };
    this.goodprocessService.postPupPortafolio(params).subscribe({
      next: response => {
        console.log('Pup Portafolio ', response);
        this.NO_VOLANTE = response.data[0].no_volante;
        this.NO_EXPEDIENTE = response.data[0].no_expediente;
        let param = {
          goodId: response.data[0].no_bien,
          description: response.data[0].descripcion,
          amout: response.data[0].cantidad,
          identifier: response.data[0].identificador,
        };
        this.goods.push(param);
        this.localGoods.load(this.goodsData);
        //FALTA
        /*
        LOOP
            V_CONSECUTIVO:=V_CONSECUTIVO+1;
            :DATOS.CONSECUTIVO:=V_CONSECUTIVO;
          	
            NEXT_RECORD;
            END LOOP;
        */
      },
    });
  }
}
