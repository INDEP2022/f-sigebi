import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  map,
  of,
  takeUntil,
  throwError,
} from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { IDepositaryAppointments_custom } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IComerLot } from 'src/app/core/models/ms-parametercomer/parameter';
import { IDeleteDetailProceeding } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { IFactconst } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { IdeleteBlkDet } from 'src/app/core/services/ms-goodprocess/interface-goodprocess';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingSusPcancelService } from 'src/app/core/services/ms-proceedings/proceeding-suspcancel.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { ProgrammingGoodReceiptService } from 'src/app/core/services/ms-programming-good/programming-good-receipt.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { TranfergoodService } from 'src/app/core/services/ms-transfergood/transfergood.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ComerEventForm } from 'src/app/pages/commercialization/shared-marketing-components/event-preparation/utils/forms/comer-event-form';
import { ModalScanningFoilTableComponent } from 'src/app/pages/juridical-processes/depositary/legal-opinions-office/modal-scanning-foil/modal-scanning-foil.component';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
import { ModalProceedingsComponent } from '../../destruction-acts/modal-proceedings/modal-proceedings.component';
import { ModalExpedientGenerateComponent } from '../modal-expedient-generate/modal-expedient-generate.component';
import { ModalGoodDonationComponent } from '../modal-good-donation/modal-good-donation.component';
import { ModalSearchActsComponent } from '../modal-search-acts/modal-search-acts.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from './../../../../common/repository/interfaces/list-params';
import { COLUMNS1 } from './columns1';
import { COLUMNS2, RELATED_FOLIO_COLUMNS } from './columns2';

@Component({
  selector: 'app-proof-of-delivery',
  templateUrl: './proof-of-delivery.component.html',
  styles: [],
})
export class ProofOfDeliveryComponent extends BasePage implements OnInit {
  form: FormGroup;
  formAct: FormGroup;
  formExp: FormGroup;
  formTable1: FormGroup;
  formTable2: FormGroup;
  formStatus: FormGroup;
  response: boolean = true;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  data1 = new LocalDataSource();
  LocalData1: any[] = [];
  data2 = new LocalDataSource();
  LocalData2: any[] = [];
  totalItems: number = 0;
  totalItems2: number = 0;
  user: any;
  userDepartament: any;
  expedient: any = null;
  expeBool: boolean = false;
  ActiveEdon: boolean = false;
  select: boolean = false;
  selectedRow: any;
  deleteSelectedRow: any;
  boton: boolean = false;
  new: boolean = false;
  share: boolean = false;
  camposNew: boolean = false;
  campos: boolean = false;
  foliobool: boolean = false;
  newA: boolean = false;
  folioScanbool: boolean = false;
  delegation: any;
  subdelegation: any;
  departament: any;
  delegation1: any;
  folioScan: any;
  ActaNew: string = 'Nueva Acta';
  wheelNumber: number = 0;
  cveActa: any;
  idProceeding: any;
  seleccion: any;
  typeProceeding: any;
  T_TIPOA: any = 0;
  T_PROMES: any = 0;
  noActa: any;
  statusActa: any;
  origin: any;
  origin2: any;
  globalParameter: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  ngGlobal: IGlobalVars = null;
  @Input() depositaryAppointment: IDepositaryAppointments_custom;
  @ViewChild('mySmartTable') mySmartTable: any;
  @Input() lotSelected: IComerLot;
  @Input() onlyBase = false;
  eventForm = this.fb.group(new ComerEventForm());
  genConstancia: boolean = false;
  actDate: any;
  dataProceeding: any;
  clear: boolean = false;

  //AGREGADO POR GRIGORK
  labelSaveProceeding: string = 'Guardar nueva acta';
  statusProceeding: string = '';
  weaponKeyFlag: boolean = false;
  isDon = false;
  navigateProceedings = false;
  loadingTable = false;

  dataAutority = new DefaultSelect();
  dataDelegation = new DefaultSelect();

  columnFilters: any = [];
  completeFilters: any[] = [];

  selectGood: any = null;
  selectGoodAct: any = null;
  subdelegationUser: any = null;
  departamentUser: any = null;
  descriptionStatusGood: any = null;
  //----------------------------------------------

  constructor(
    private fb: FormBuilder,
    private expedientService: ExpedientService,
    private goodService: GoodService,
    private authService: AuthService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer,
    private siabService: SiabService,
    private router: Router,
    private documentsService: DocumentsService,
    private fractionsService: FractionsService,
    private screenStatusService: ScreenStatusService,
    private programmingGoodReceiptService: ProgrammingGoodReceiptService,
    private proceedingSusPcancelService: ProceedingSusPcancelService,
    private globalVarsService: GlobalVarsService,
    private activatedRoute: ActivatedRoute,
    private goodTrackerService: GoodTrackerService,

    //AGREGADO POR GRIGORK
    private transferGoodService: TranfergoodService,
    private parameterGoodService: ParametersService,
    private serviceProcVal: ProceedingsDeliveryReceptionService,
    private serviceDetailProc: DetailProceeDelRecService,
    private proceedingsService: ProceedingsService,
    private serviceUser: UsersService,
    private goodprocessService: GoodprocessService
  ) {
    super();
    // this.activatedRoute.queryParams
    //   .pipe(takeUntil(this.$unSubscribe))
    //   .subscribe(params => {
    //     this.folioScan = params['folio']
    //       ? Number(params['folio'])
    //       : null;
    //     this.idProceeding = params['acta']
    //       ? Number(params['acta'])
    //       : null;
    //     this.expedient = params['expedientNumber']
    //       ? Number(params['expedientNumber'])
    //       : null;
    //   });
    this.expedient =
      localStorage.getItem('expedient') != null
        ? localStorage.getItem('expedient')
        : null;
    this.folioScan =
      localStorage.getItem('folio') != null
        ? localStorage.getItem('folio')
        : null;
    this.idProceeding =
      localStorage.getItem('acta') != null
        ? localStorage.getItem('acta')
        : null;
  }

  settings1 = {
    ...TABLE_SETTINGS,
    hideSubHeader: false,
    actions: false,
    columns: {
      ...COLUMNS1,
    },
    rowClassFunction: (row: { data: { available: any } }) =>
      row.data.available ? 'bg-success text-white' : 'bg-dark text-white',
    noDataMessage: 'No se Encontraron Registros',
  };

  settings2 = {
    ...TABLE_SETTINGS,
    hideSubHeader: true,
    actions: false,
    columns: {
      ...COLUMNS2,
    },
    noDataMessage: 'No se Encontraron Registros',
  };

  ngOnInit(): void {
    console.log('folio ', this.folioScan);
    console.log('idProceeding ', this.idProceeding);
    console.log('expedient ', this.expedient);
    let i = 0;
    this.initForm();
    this.globalVarsService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          console.log('GLOBAL ', this.ngGlobal);
          if (this.ngGlobal.REL_BIENES != null) {
            if (i == 0) {
              i++;
              console.log('REL_BIENES ', this.ngGlobal.REL_BIENES);
              this.backRastreador(this.ngGlobal.REL_BIENES);
            }
          }
        },
      });
    if (this.folioScan != null) {
      this.form.get('scanningFoli').patchValue(this.folioScan);
      localStorage.removeItem('folio');
      this.folioScanbool = true;
    }
    if (this.idProceeding != null) {
      localStorage.removeItem('acta');
    }
    if (this.expedient != null) {
      this.formExp.get('expedient').patchValue(this.expedient);
      this.getExpedient();
      localStorage.removeItem('expedient');
    }
    // Configuración para mostrar solo el año
    this.bsConfigFromYear = {
      dateInputFormat: 'YYYY',
      showTodayButton: false,
      isAnimated: true,
      maxDate: new Date(),
      minMode: 'year',
    };

    // Configuración para mostrar solo el mes
    this.bsConfigFromMonth = {
      dateInputFormat: 'MMMM YYYY',
      showTodayButton: false,
      isAnimated: true,
      maxDate: new Date(),
      minMode: 'month',
    };

    this.formExp.get('capture').patchValue('normal');
    // Agregar listener para el evento de cambio
    this.formExp.get('capture')?.valueChanges.subscribe(newValue => {
      if (newValue === 'normal') {
        this.handleCaptureChange('normal');
      } else if (newValue === 'massive') {
        this.handleCaptureChange('massive');
      }
    });

    this.getDataUser();
    this.columnFilterTable();
    this.navigateGoodTable();
    this.returnScan();
  }

  goBack() {
    //FCONGENRASTREADOR
    if (this.origin == 'FCONGENRASTREADOR') {
      this.router.navigate([`/pages/general-processes/goods-tracker`]);
    }
  }

  initForm() {
    this.getuser();
    this.formExp = this.fb.group({
      expedient: [null],
      statusAct: [null],
      preliminaryAscertainment: [null],
      noExpedientTransfer: [null],
      causePenal: [null],
      capture: [null],
      programmingType: [null, [Validators.required]],
    });
    this.formAct = this.fb.group({
      status: [null],
      elabDate: [null, [Validators.required]],
      actDate: [null, [Validators.required]],
      captureDate: [null, [Validators.required]],
      actSelect: [null, [Validators.required]],
      trans: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      authority: [null, [Validators.required]],
      del: [null, [Validators.required]],
      folio: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      year: [null, this.bsValueFromYear, [Validators.required]],
      month: [null, this.bsValueFromMonth, [Validators.required]],
      act: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      receive: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
      delivery: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      witnessContr: [null, [Validators.pattern(STRING_PATTERN)]],
      folioScan: [null],
    });

    this.form = this.fb.group({
      scanningFoli: [null],
    });
    this.formStatus = this.fb.group({
      status: [null],
    });
    this.formTable1 = this.fb.group({
      detail: [null, []],
    });
    this.formTable2 = this.fb.group({
      detail: [null, []],
      status: [null, []],
    });
  }

  onSubmit() {}

  search(event: any) {
    this.response = !this.response;
  }

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }

  getExpedient() {
    this.expedient = this.formExp.get('expedient').value;

    if (this.expedient == null) {
      this.alert('warning', 'Es Necesario un Numero de Expediente', '');
      return;
    }

    this.expedientService.getExpedient(this.expedient).subscribe({
      next: response => {
        console.log('Respuesta Expedient', response);
        let params = {
          noExpedientTransfer: response.data[0].expTransferNumber,
          preliminaryAscertainment: response.data[0].preliminaryInquiry,
          causePenal: response.data[0].criminalCase,
        };
        this.formExp.patchValue(params);
        this.chargeGoodsByExp();
        this.searchAndFillProceeding();
        this.boton = true;
        this.new = true;
        this.share = true;
        this.clear = true;
        this.select = true;
        this.labelSaveProceeding = 'Guardar cambios';
      },
      error: err => {
        this.alert('warning', 'No se Encontro el Expediente', '');
        console.log('Hubo un error Expedient el cual es: ', err);
      },
    });
  }

  validExpedient() {
    if (this.expedient != null) {
      this.expeBool = true;
    }
  }

  formatDate(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  getuser() {
    let token = this.authService.decodeToken();
    this.user = token.username.toUpperCase();
    //this.getdepartament(userDepartament);
    console.log('User: ', token);
    this.departament = token.department.toUpperCase();
    this.delegation = token.department.toUpperCase();
    let userDepartament = token.department.toUpperCase();
    this.getdepartament(userDepartament);
  }

  getdepartament(id: number | string) {
    this.fractionsService.getDepartament(id).subscribe({
      next: response => {
        this.userDepartament = response.data[0];
        this.subdelegation = response.data[0].numSubDelegation.id;
        console.log('respuesta Departament ', response.data[0]);
      },
    });
  }

  loadModal() {
    this.openModal(true, this.expedient);
  }

  openModal(newOrEdit: boolean, data: any) {
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered modal-lg',
      ignoreBackdropClick: true,
    };
    modalConfig.initialState = {
      newOrEdit,
      data,
      callback: (next: boolean, cveActa?: any, id?: number) => {},
    };
    this.modalService.show(ModalSearchActsComponent, modalConfig);
  }

  onRowSelect(event: any) {
    if (this.formStatus.get('status').value == 'CERRADA') {
      this.alert(
        'warning',
        'Alerta',
        'El Acta ya Esta Cerrada, no Puede Realizar Modificaciones a Esta'
      );
      return;
    }
    if (event.data.color == 'N') {
      this.alert(
        'warning',
        'Alerta',
        'El Bien Tiene un Estado Invalido para ser Asignado a Alguna Acta'
      );
    } else {
      this.selectedRow = event.data;
      console.log('this.selectedRow ', this.selectedRow);
    }
  }

  deleteRowSelect(event: any) {
    this.selectedRow = null;
    this.deleteSelectedRow = event.data;
    console.log('this.deleteSelectedRow ', this.deleteSelectedRow);
  }

  validationTipos(finmesa: any) {
    if (this.T_TIPOA == 0) {
      console.log('Es 1');
      this.alertInfo(
        'error',
        'Error',
        'El No. Bien ' +
          this.selectedRow.goodNumb +
          ' no Tiene el Estado para la Constancia de Entrega de ' +
          finmesa
      );
      return;
    } else {
      this.T_TIPOA = 1;
    }
    if (this.T_PROMES == 0) {
      console.log('Es 2');
      this.alertInfo(
        'error',
        'Error',
        'El No.Bien ' +
          this.selectedRow.goodNumb +
          ' Fue Programado Fuera de Mes'
      );
      return;
    } else {
      this.T_PROMES = 1;
    }
    let lv_valregi = this.T_TIPOA + '' + this.T_PROMES;
    console.log('lv_valregi ', lv_valregi);
    if (this.selectedRow.quantity < 0) {
      console.log('Es 3');
      this.alertInfo('error', 'Error', 'El Bien no Tiene una Cantidad Válida');
      return;
    }
    if (lv_valregi == '11') {
      console.log('Es 11');
    }
  }

  clearSelection() {
    const selectedRows = this.mySmartTable.grid.getSelectedRows();
    selectedRows.forEach((row: any) => {
      row.isSelected = false;
    });
  }

  btnSolicutud() {
    let status = this.formStatus.get('status').value;
    let acta = this.formAct.get('act').value;
    let folio = this.form.get('scanningFoli').value;
    if (folio == null) {
      if ((status != 'CERRADA' && status != null) || acta == null) {
        this.alertQuestion(
          'info',
          'Se Generará un Nuevo Folio de Escaneo para el Acta Abierta. ¿Deseas continuar?',
          '',
          'Aceptar',
          'Cancelar'
        ).then(res => {
          console.log(res);
          if (res.isConfirmed) {
            this.notificationService.getByFileNumber(this.expedient).subscribe({
              next: resp => {
                console.log('Respuesta response', resp);
                let max = resp.data[0].max;
                let params = {
                  fileNumber: this.expedient,
                  actKey: this.cveActa,
                  lnuFlyerNumber: max,
                  delegationNumber: this.delegation,
                  subdelegationNumber: this.subdelegation,
                  departamentNumber: this.departament,
                };
                this.documentsService.postDocuments(params).subscribe({
                  next: resp => {
                    console.log('Response Pos Documents ', resp);
                    this.form
                      .get('scanningFoli')
                      .patchValue(resp.data[0].folio_universal);
                    this.folioScanbool = true;
                    this.folioScan = resp.data[0].folio_universal;
                    console.log(this.folioScan);
                    this.PupLanzaReporte();
                  },
                });
              },
            });
          }
        });
      }
    } else {
      this.alert('error', 'Esta Acta ya Tiene Folio de Escaneo', '');
    }
  }

  PupLanzaReporte() {
    let params = {
      pn_folio: this.folioScan,
    };
    if (this.params != null) {
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

  openScannerPage() {
    if (this.form.get('scanningFoli').value != null) {
      this.alertQuestion(
        'info',
        'Se Abrirá la Pantalla de Escaneo para el Folio de Escaneo del Dictamen. ¿Deseas continuar?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          localStorage.setItem('folio', this.folioScan);
          localStorage.setItem('expedient', this.expedient);
          localStorage.setItem('acta', this.idProceeding);
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
  async replicate() {
    // if (!this.officeDictationData && !this.dictationData) {
    //   return;
    // }
    if (this.statusActa == 'Abrir Acta') {
      this.alert(
        'warning',
        'Alerta',
        'No se Puede Replicar el Folio en un Acta Cerrada'
      );
      return;
    }
    let goodId = this.data2;
    if (goodId) {
      if (this.form.get('scanningFoli').value) {
        // Replicate function
        const response = await this.alertQuestion(
          'question',
          'Aviso',
          'Se Generará un Nuevo Folio de Escaneo y se le Copiarán las Imágenes del Folio de Escaneo Actual. ¿Deseas continuar?'
        );

        if (!response.isConfirmed) {
          return;
        }
        this.getDocumentsCount().subscribe(count => {
          console.log('COUNT ', count);

          if (count == 0) {
            this.alert(
              'warning',
              'Folio de Escaneo Inválido para Replicar',
              ''
            );
          } else {
            if (this.expedient) {
              // Obtener el volante a partir del expediente del bien
              this.notificationService
                .getByFileNumber(this.expedient)
                .subscribe({
                  next: data => {
                    console.log('DATA ', data.data);
                    // INSERTAR REGISTRO PARA EL DOCUMENTO
                    this.saveNewUniversalFolio_Replicate(data.data[0].max);
                    ///
                    //Falta Integrar el de guardar en documentos
                    ///
                    //this.folioScan = response.data[0].folio
                  },
                  error: error => {
                    this.alertInfo(
                      'warning',
                      'Ocurrió un error al obtener el Volante',
                      ''
                    );
                  },
                });
            } else {
              this.alertInfo(
                'warning',
                'El Bien debe tener un expediente para poder replicar',
                ''
              );
            }
          }
        });
      } else {
        this.alertInfo(
          'warning',
          'Especifique el folio de escaneo a replicar',
          ''
        );
      }
    } else {
      this.alertInfo(
        'warning',
        'No se puede replicar el folio de escaneo si no existe un bien',
        ''
      );
    }
  }

  getDocumentsCount() {
    const params = new FilterParams();
    params.addFilter('scanStatus', 'ESCANEADO');
    params.addFilter(
      'associateUniversalFolio',
      SearchFilter.NULL,
      SearchFilter.NULL
    );
    params.addFilter('id', this.form.get('scanningFoli').value);
    // if (this.depositaryAppointment.revocation == 'N') {
    //   params.addFilter('id', this.formScan.get('scanningFoli').value);
    // } else {
    //   params.addFilter('id', this.formScan.get('returnFoli').value);
    // }
    console.log(params);
    this.hideError();
    return this.documentsService.getAllFilter(params.getParams()).pipe(
      catchError(error => {
        if (error.status < 500) {
          return of({ count: 0 });
        }
        this.onLoadToast(
          'error',
          'Ocurrió un error al validar el Folio ingresado',
          error.error.message
        );
        return throwError(() => error);
      }),
      map(response => response.count)
    );
  }

  saveNewUniversalFolio_Replicate(wheelNumber: number) {
    ///
    //Falta Integrar el de guardar en documentos
    ///
    let params = {
      fileNumber: this.expedient,
      actKey: this.cveActa,
      lnuFlyerNumber: wheelNumber,
      delegationNumber: this.delegation,
      subdelegationNumber: this.subdelegation,
      departamentNumber: this.departament,
      universalFolio: this.folioScan,
    };
    this.documentsService.postDocumentsV2(params).subscribe({
      next: response => {
        this.alert(
          'success',
          'Folio Replicado',
          'El Folio ' + this.folioScan + ' fue Replicado Correctamente'
        );
        console.log('respuesta replicar ', response);
        this.form
          .get('scanningFoli')
          .setValue(response.data[0].folio_universal);
        this.folioScan = response.data[0].folio_universal;
      },
    });
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
      proceedingsNum: this.expedient,
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
        proceedingsNumber: this.expedient,
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

  selectNew() {
    if (this.expedient == null || this.data1.count() == 0) {
      this.alert('warning', 'Es necesario un número de expediente', '');
      return;
    }

    this.ActaNew = 'Guardar';
    this.formAct.reset();
    this.formAct.get('elabDate').setValue(new Date());
    this.newA = true;
    this.boton = false;
    this.campos = true;
    this.select = true;
    this.labelSaveProceeding = 'Guardar nueva acta';
    this.weaponKeyFlag = true;
    this.statusProceeding = null;

    this.form.get('scanningFoli').reset();

    this.getAutority();
    this.getDelegation();
    this.fillDate();
    this.weaponKey();
  }

  saveProceeding() {
    if (this.labelSaveProceeding == 'Guardar nueva acta') {
      this.saveNewProceeding();
    } else {
    }
  }
  generarYActualizar(claveActa: any) {
    const datos = this.generarDatosDesdeUltimosCincoDigitos(claveActa);
    if (datos) {
      this.actualizarFormulario(datos.anio, datos.mes);
    }
  }

  generarDatosDesdeUltimosCincoDigitos(
    claveActa: string
  ): { anio: number; mes: number } | null {
    if (claveActa.length < 5) {
      return null; // Clave no válida
    }
    console.log('Entra1 ');
    const ultimosCincoDigitos = claveActa.slice(-5);
    const anio = this.obtenerAnioDesdeDigitos(ultimosCincoDigitos);
    const mesNumero = this.obtenerMesNumeroDesdeDigitos(ultimosCincoDigitos);
    if (!this.validarAnioMes(anio, mesNumero)) {
      return null; // Valores no válidos
    }

    const anioCompleto = this.obtenerAnioCompleto(anio);

    return { anio: anioCompleto, mes: mesNumero };
  }

  // Las otras funciones se mantienen igual

  actualizarFormulario(anioCompleto: number, mesNumero: number) {
    console.log('Entra2');
    if (mesNumero && anioCompleto) {
      const selectedYear = new Date(anioCompleto, 0);
      const selectedMonth = new Date(anioCompleto, mesNumero - 1);
      console.log('SelectedYear ', selectedYear);
      console.log('selectedMonth ', selectedMonth);
      this.formAct.patchValue({
        year: selectedYear,
        month: selectedMonth,
      });
    }
  }

  obtenerAnioDesdeDigitos(ultimosCincoDigitos: string): number {
    console.log('Entra2');
    return parseInt(ultimosCincoDigitos.substring(0, 2), 10);
  }

  obtenerMesNumeroDesdeDigitos(ultimosCincoDigitos: string): number {
    console.log('Entra3');
    return parseInt(ultimosCincoDigitos.substring(3, 5), 10);
  }

  validarAnioMes(anio: number, mesNumero: number): boolean {
    console.log('Entra4');
    return (
      !isNaN(anio) &&
      !isNaN(mesNumero) &&
      anio >= 0 &&
      mesNumero >= 1 &&
      mesNumero <= 12
    );
  }

  obtenerAnioCompleto(anio: number): number {
    console.log('Entra5 ');
    const fechaActual = new Date();
    const sigloActual = Math.floor(fechaActual.getFullYear() / 100) * 100;
    return anio < 100 ? sigloActual + anio : anio;
  }

  Rastreador() {
    this.alertQuestion(
      'info',
      'Se Abrirá la Pantalla de Rastreo por Bienes y Notificación. ¿Deseas continuar?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(res => {
      console.log(res);
      if (res.isConfirmed) {
        // this.router.navigate([`/pages/general-processes/goods-tracker`], {
        //   queryParams: {
        //     origin: 'FACTCONST_0001',
        //     PAR_MASIVO: 'S',
        //   },
        // });
        this.loadFromGoodsTracker();
      }
    });
  }

  async loadFromGoodsTracker() {
    const global = await this.globalVarsService.getVars();
    this.globalVarsService.updateSingleGlobal('REL_BIENES', 0, global);
    // const selfState = await this.eventPreparationService.getState();
    // this.eventPreparationService.updateState({
    //   ...selfState,
    //   eventForm: this.eventForm,
    //   lastLot: Number(this.lotSelected.id) ?? -1,
    //   lastPublicLot: this.lotSelected.publicLot ?? 1,
    //   executionType: this.onlyBase ? 'base' : 'normal',
    // });

    localStorage.setItem('folio', this.folioScan);
    localStorage.setItem('expedient', this.expedient);
    localStorage.setItem('acta', this.idProceeding);
    localStorage.setItem('rastreador', '1');
    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FACTCONST_0001',
      },
    });
  }

  RastreadorGood() {
    this.alertQuestion(
      'info',
      'Se Abrirá la Pantalla de Rastreo por Bienes y Notificación. ¿Deseas continuar?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(res => {
      console.log(res);
      if (res.isConfirmed) {
        // this.router.navigate([`/pages/general-processes/goods-tracker`], {
        //   queryParams: {
        //     origin: 'FACTCONST_0001',
        //     PAR_MASIVO: 'S',
        //   },
        // });
        this.loadFromGoods();
      }
    });
  }

  async loadFromGoods() {
    const global = await this.globalVarsService.getVars();
    this.globalVarsService.updateSingleGlobal('REL_BIENES', 0, global);
    // const selfState = await this.eventPreparationService.getState();
    // this.eventPreparationService.updateState({
    //   ...selfState,
    //   eventForm: this.eventForm,
    //   lastLot: Number(this.lotSelected.id) ?? -1,
    //   lastPublicLot: this.lotSelected.publicLot ?? 1,
    //   executionType: this.onlyBase ? 'base' : 'normal',
    // });

    localStorage.setItem('folio', this.folioScan);
    localStorage.setItem('expedient', this.expedient);
    localStorage.setItem('acta', this.idProceeding);
    localStorage.setItem('rastreador', '2');
    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FACTCONST_0001',
      },
    });
  }

  backRastreador(global: any) {
    let i = 1;
    console.log('Entra a backRastreador ', i++);
    let rastreador = localStorage.getItem('rastreador');
    if (rastreador == '1') {
      let params = {
        pParameter: global,
        pNumberParameter: 1,
        pUser: this.user,
      };
      this.goodTrackerService.PaInsGoodParameters(params).subscribe({
        next: response => {
          console.log('Respuesta, rastreador ', response);
        },
      });
      this.proceedingsService.consultPaValMasive().subscribe({
        next: response => {
          console.log('response PaVal', response);
        },
      });
      this.genConstancia = true;
    }
    if (rastreador == '2') {
      this.goodTrackerService.PaInsGoodtmptracker(global).subscribe({
        next: response => {
          console.log('respuesta TMPTRAKER', response);
          for (let i = 0; i < response.count; i++) {
            console.log('entra ---> For');
          }
          console.log('sale del For');
        },
      });
    }
  }

  loadExpedienGen() {
    if (this.seleccion != 'massive') {
      this.alert('warning', '', 'Seleccione la Captura en Masivo');
    } else {
      let status = this.formStatus.get('status').value;
      if (status == 'CERRADA') {
        let data = {
          expedient: this.expedient,
          folio: this.folioScan,
          cveActa: this.cveActa,
        };
        console.log('DATA ENVIADA ', data);
        this.openModalExpedienGen(true, data);
      } else {
        this.alert(
          'error',
          'Error',
          'No se Podrá Generar la Constancia Masiva, el Acta Base no Esta Cerrada'
        );
      }
    }
  }

  openModalExpedienGen(newOrEdit: boolean, data: any) {
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered modal-lg',
    };
    modalConfig.initialState = {
      newOrEdit,
      data,
      callback: (next: boolean, cveActa?: any, id?: number) => {},
    };
    this.modalService.show(ModalExpedientGenerateComponent, modalConfig);
  }

  cancelar() {
    this.select = false;
    this.newA = false;
    this.boton = true;
    this.campos = true;
    this.foliobool = false;
    this.ActaNew = 'Nueva Acta';
    window.scrollTo(0, 0);
  }

  goodDonations() {
    let data = {
      expedient: this.expedient,
      folio: this.folioScan,
      cveActa: this.cveActa,
      acta: this.idProceeding,
    };
    this.openModal2(true, data);
  }

  openModal2(newOrEdit: boolean, data?: any) {
    console.log('Data Modal2-> ', data);
    let config: ModalOptions = {
      initialState: {
        newOrEdit,
        data,
        callback: (next: boolean, cveActa?: any, id?: number) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ModalGoodDonationComponent, config);
  }

  handleCaptureChange(option: string) {
    console.log('Seleccionaste:', option);
    this.seleccion = option;
  }

  formatDate2(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${year}/${month}/${day}`;
  }

  AgregarGoodsBtn() {
    let status = this.formStatus.get('status').value;
    if (status == 'CERRADA') {
      this.alert('error', 'Error', 'El Acta ya se Encuentra Cerrada');
      return;
    }
    let good;
    this.goodprocessService.getDataFromGood(good).subscribe({
      next: response => {},
    });
  }

  //AGREGADO POR GRIGORK
  get actSelect() {
    return this.formAct.get('actSelect');
  }

  get trans() {
    return this.formAct.get('trans');
  }

  get authority() {
    return this.formAct.get('authority');
  }

  get del() {
    return this.formAct.get('del');
  }

  get folio() {
    return this.formAct.get('folio');
  }

  get year() {
    return this.formAct.get('year');
  }

  get month() {
    return this.formAct.get('month');
  }

  get act() {
    return this.formAct.get('act');
  }

  getDataUser() {
    const user = this.authService.decodeToken();
    const routeUser = `?filter.id=$eq:${user.preferred_username}`;
    this.serviceUser.getAllSegUsers(routeUser).subscribe(
      res => {
        console.log(res.data[0]);
        this.subdelegationUser = res.data[0].usuario.subdelegationNumber;
        this.departamentUser = res.data[0].usuario.departamentNumber;
      },
      err => {
        console.log(err);
      }
    );
  }

  navigateGoodTable() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      if (this.navigateProceedings) {
        this.loadingTable = true;
        this.chargeGoodsByExp();
      }
    });
  }

  columnFilterTable() {
    this.data1
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          this.completeFilters = filters;
          filters.map((filter: any) => {
            let searchFilter = SearchFilter.ILIKE;
            if (filter.search !== '') {
              this.columnFilters[
                filter.field
              ] = `${searchFilter}:${filter.search}`;
            }
          });
          this.chargeGoodsByExp();
        }
      });
  }

  getAutority() {
    this.transferGoodService.queryTransfer(this.expedient).subscribe(
      res => {
        this.dataAutority = new DefaultSelect(res.data, res.count);
      },
      err => {
        console.log(err);
        this.alert(
          'warning',
          'No se encontró lista de autoridades',
          'No se puede generar una nueva acta para este expediente'
        );
        this.dataAutority = new DefaultSelect();
      }
    );
  }

  getDelegation(params?: ListParams) {
    const body = {
      gstAll: 'NADA',
      gnuDelegation: this.authService.decodeToken().department,
    };

    this.parameterGoodService.queryDelegation(body, params).subscribe(
      res => {
        console.log(res);
        this.dataDelegation = new DefaultSelect(res.data, res.count);
      },
      err => {
        console.log(err);
        this.dataDelegation = new DefaultSelect();
      }
    );
  }

  fillDate() {
    const currentDate = new Date();
    this.formAct.get('year').setValue(format(currentDate, 'yy'));
    this.formAct.get('month').setValue(format(currentDate, 'MM'));
  }

  activeSubscribe() {}

  //FUNCION DE AGREGAR CEROS AL FOLIO
  zeroAdd(number: number, lengthS: number) {
    if (number != null) {
      const stringNum = number.toString();
      let newString = '';
      if (stringNum.length < lengthS) {
        lengthS = lengthS - stringNum.length;
        for (let i = 0; i < lengthS; i++) {
          newString = newString + '0';
        }
        newString = newString + stringNum;
        return newString;
      } else {
        return stringNum;
      }
    } else {
      return null;
    }
  }

  weaponKey() {
    this.formAct.get('actSelect').valueChanges.subscribe((value: any) => {
      this.weaponNewKey();
    });

    this.formAct.get('trans').valueChanges.subscribe((value: any) => {
      this.weaponNewKey();
    });

    this.formAct.get('authority').valueChanges.subscribe((value: any) => {
      console.log(value);
      this.weaponNewKey();
    });

    this.formAct.get('del').valueChanges.subscribe((value: any) => {
      console.log(value);
      this.weaponNewKey();
    });

    this.formAct.get('folio').valueChanges.subscribe((value: any) => {
      this.weaponNewKey();
    });

    this.formAct.get('year').valueChanges.subscribe((value: any) => {
      this.weaponNewKey();
    });

    this.formAct.get('month').valueChanges.subscribe((value: any) => {
      this.weaponNewKey();
    });
  }

  clearAll() {
    this.statusProceeding = null;
    this.share = false;
    this.form.reset();
    this.formStatus.reset();
    this.formAct.reset();
    this.formExp.reset();
    this.idProceeding = null;
    this.ActaNew = null;
    this.LocalData2 = [];
    this.data2.load(this.LocalData2);
    this.data2.refresh();
    this.LocalData1 = [];
    this.data1.load(this.LocalData1);
    this.data1.refresh();
    this.newA = false;
  }

  weaponNewKey() {
    if (this.weaponKeyFlag) {
      const nameAct =
        (this.actSelect.value != null ? this.actSelect.value : '') +
        '/' +
        (this.trans.value != null ? this.trans.value : '') +
        '/' +
        (this.authority.value != null ? this.authority.value.transferKey : '') +
        '/' +
        (this.del.value != null ? this.del.value.delegation : '') +
        '/' +
        (this.folio.value != null
          ? this.zeroAdd(parseInt(this.folio.value), 5)
          : '') +
        '/' +
        (this.year.value != null
          ? this.zeroAdd(parseInt(this.year.value), 2)
          : '') +
        '/' +
        (this.month.value != null
          ? this.zeroAdd(parseInt(this.month.value), 2)
          : '');

      console.log(nameAct);

      this.formAct.get('act').setValue(nameAct);
    }
  }

  async saveNewProceeding() {
    console.log(new Date(this.formAct.get('elabDate').value));
    console.log(this.formAct.get('elabDate').value);

    if (this.formExp.get('programmingType').value == null) {
      this.alert('warning', 'Es Necesario Seleccionar un Tipo de Acta', '');
      this.formExp.get('programmingType').markAsTouched();
      return;
    }

    if (!this.formAct.valid) {
      this.alert('warning', 'Es Necesario Llenar Todos los Campos', '');
      this.formAct.markAllAsTouched();
      return;
    }

    const isUnique = await this.searchKeyProceeding();

    if (!isUnique) {
      this.alert('warning', 'La Clave de Acta ya Existe', '');
      return;
    }

    const isEventAndType = await this.validEventAndType();

    if (!isEventAndType) {
      this.alert(
        'warning',
        'El tipo de constancia no corresponde con el tipo programación de bienes',
        ''
      );
      return;
    }

    const newProceedingBody: IProccedingsDeliveryReception = {
      keysProceedings: this.act.value,
      elaborationDate: this.formAct.get('elabDate').value,
      datePhysicalReception: this.formAct.get('actDate').value,
      address: this.formAct.get('address').value,
      statusProceedings: 'ABIERTA',
      elaborate: this.authService.decodeToken().preferred_username,
      typeProceedings: 'CONSENTR',
      numFile: this.formExp.get('expedient').value,
      witness1: this.formAct.get('receive').value,
      witness2: this.formAct.get('delivery').value,
      numDelegation1: this.formAct.get('del').value.delegationNumber2,
      numDelegation2:
        this.formAct.get('del').value.delegationNumber2 == 11 ? '11' : null,
      observations: this.formAct.get('observations').value,
      captureDate: new Date().getTime(),
      comptrollerWitness: this.formAct.get('witnessContr').value,
      idTypeProceedings: this.formAct.get('actSelect').value,
    };

    this.serviceProcVal.postProceeding(newProceedingBody).subscribe(
      res => {
        console.log(res);
        this.alert('success', 'Se creó una nueva acta', '');
        this.weaponKeyFlag = false;
        this.actSelect.reset();
        this.trans.reset();
        this.authority.reset();
        this.del.reset();
        this.folio.reset();
        this.year.reset();
        this.month.reset();

        const jsonResp = JSON.parse(JSON.stringify(res));
        this.idProceeding = jsonResp.id;
        this.act.setValue(jsonResp.keysProceedings);
        this.statusProceeding = jsonResp.statusProceedings;
        this.newA = false;
        this.labelSaveProceeding = 'Guardar cambios';
      },
      err => {
        this.alert('error', 'Error al crear acta', '');
        console.log(err);
      }
    );
  }

  //BUSQUEDA DE CLAVE DE ACTA
  searchKeyProceeding() {
    return new Promise((resolve, reject) => {
      const paramsF = new FilterParams();
      paramsF.addFilter('keysProceedings', this.formAct.get('act').value);
      this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
        res => {
          resolve(false);
        },
        err => {
          resolve(true);
        }
      );
    });
  }

  //VALIDAR ACTA Y CONSTANCIA
  validEventAndType() {
    return new Promise((resolve, _rej) => {
      const lis_event = this.formExp.get('programmingType').value;
      const tipe_event = this.formAct.get('actSelect').value;
      if (lis_event != null) {
        if (tipe_event != null) {
          if (lis_event == 'EVENCOMER' && tipe_event == 'E/VEN') {
            resolve(true);
          } else if (lis_event == 'EVENDON' && tipe_event == 'E/DON') {
            this.isDon = true;
            resolve(true);
          } else if (lis_event == 'EVENDEST' && tipe_event == 'E/DES') {
            resolve(true);
          } else if (lis_event == 'EVENDEV' && tipe_event == 'E/DEV') {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  }

  //FUNCIÓN PARA OBTENER LA FECHA CORRECTA
  correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }

  //BUSCAR ACTA
  searchAndFillProceeding() {
    const paramsF = new FilterParams();
    paramsF.addFilter('typeProceedings', 'CONSENTR');
    paramsF.addFilter('numFile', this.formExp.get('expedient').value);
    this.serviceProcVal.getByFilter(paramsF.getParams()).subscribe(
      res => {
        console.log(res);
        const jsonResp = JSON.parse(JSON.stringify(res['data'][0]));

        this.selectTypeProgramming(jsonResp.idTypeProceedings);

        this.idProceeding = jsonResp.id;
        // this.totalItemsNavigate = res.count;
        this.fillIncomeProceeding(res['data'][0]);
        this.searchGoodsInDetailProceeding();
        // this.navigateProceedings = true;
        // this.isNewProceeding = false;
        // this.assembleKeybool = false;
        // this.loadingProcedure = false;
      },
      err => {
        // this.isNewProceeding = true;
        // this.assembleKeybool = true;
        // this.loadingProcedure = false;
        console.log(err);
      }
    );
  }

  //LLENAR VALORES SI EXISTE ACTAS
  fillIncomeProceeding(data: any) {
    console.log(data);
    this.act.setValue(data.keysProceedings);
    this.form.get('scanningFoli').setValue(data.universalFolio);
    this.formAct
      .get('elabDate')
      .setValue(this.correctDate(data.elaborationDate));
    this.formAct
      .get('actDate')
      .setValue(this.correctDate(data.datePhysicalReception));
    this.formAct
      .get('captureDate')
      .setValue(this.correctDate(data.captureDate));
    this.formAct.get('address').setValue(data.address);
    this.formAct.get('observations').setValue(data.observations);
    this.formAct.get('receive').setValue(data.witness1);
    this.formAct.get('delivery').setValue(data.witness2);
    this.formAct.get('witnessContr').setValue(data.comptrollerWitness);
    this.statusProceeding = data.statusProceedings;
    // this.statusProceeding.setValue(data.statusProceedings);
    // this.proccedingId = data.id;
  }

  //POSTQUERY BLK_DET
  postqueryBlkDet(goodNumber: string) {
    return new Promise((resolve, _rej) => {
      this.goodprocessService.postqueryBlkDet(goodNumber).subscribe(
        res => {
          console.log(res);
          resolve(res);
        },
        err => {
          console.log(err);
          resolve(null);
        }
      );
    });
  }

  //BUSCAR BIENES EN DETALLE_ACTA_ENT_RECEP
  searchGoodsInDetailProceeding() {
    const paramsF = new FilterParams();
    // paramsF.page = this.params2.value.page;
    // paramsF.limit = this.params2.value.limit;

    /* for (let data of this.completeFiltersAct) {
      if (data.search != null && data.search != '') {
        paramsF.addFilter(
          data.field,
          data.search,
          data.field != 'numberGood' ? SearchFilter.ILIKE : SearchFilter.EQ
        );
      }
    } */

    this.serviceDetailProc
      .getGoodsByProceedings(this.idProceeding, paramsF.getParams())
      .subscribe(
        async res => {
          const newData = await Promise.all(
            res.data.map(async (e: any) => {
              console.log(e);
              const resp = await this.postqueryBlkDet(e.numberGood);
              const jsonResp =
                resp != null ? JSON.parse(JSON.stringify(resp)) : resp;
              console.log(jsonResp);
              return {
                ...e,
              };
            })
          );

          console.log(res);
          this.data2.load(res.data);
          this.totalItems2 = res.count;
          this.loadingTable = false;
        },
        err => {
          this.data2.load([]);
          this.totalItems2 = 0;
          console.log(err);
          this.loadingTable = false;
        }
      );
  }

  //TYPE PROGRAMMING
  selectTypeProgramming(idTypeProceedings: string) {
    switch (idTypeProceedings) {
      case 'E/VEN':
        this.formExp.patchValue({
          programmingType: 'EVENCOMER',
        });
        break;
      case 'E/DON':
        this.formExp.patchValue({
          programmingType: 'EVENDON',
        });
        break;
      case 'E/DES':
        this.formExp.patchValue({
          programmingType: 'EVENDEST',
        });
        break;
      case 'E/DEV':
        this.formExp.patchValue({
          programmingType: 'EVENDEV',
        });
        break;
      default:
        this.formExp.patchValue({
          programmingType: null,
        });
        break;
    }
  }

  //VALIDAR BIENES POSTQUERY
  postqueryGoods(data: any) {
    return new Promise((resolve, _rej) => {
      const fecCapture = this.formAct.get('captureDate').value;
      const body: IFactconst = {
        captureDate: fecCapture != null ? fecCapture : '',
        delegation: data.delegationNumber,
        subdelegation: data.subDelegationNumber,
        good: data.id,
        status: data.status,
        screen: 'FACTCONST_0001',
        proceesExtDom: data.extDomProcess,
        expedient: data.fileNumber,
      };

      this.proceedingsService.postqueryFactConst(body).subscribe(
        res => {
          console.log(res);
          resolve(res);
        },
        err => {
          console.log(err);
          resolve(null);
        }
      );
    });
  }

  //TRAER BIENES DEL EXPEDIENTE
  chargeGoodsByExp() {
    const paramsF = new FilterParams();
    paramsF.addFilter('fileNumber', this.expedient);
    paramsF.page = this.params.value.page;
    paramsF.limit = this.params.value.limit;
    console.log(this.columnFilters);

    for (let data of this.completeFilters) {
      if (data.search != null && data.search != '') {
        paramsF.addFilter(
          data.field,
          data.search,
          data.field != 'goodId' ? SearchFilter.ILIKE : SearchFilter.EQ
        );
        paramsF.page = 1;
      }
    }

    this.goodService.getAllFilterDetail(paramsF.getParams()).subscribe(
      async res => {
        const newData = await Promise.all(
          res.data.map(async (e: any) => {
            const resp = await this.postqueryGoods(e);
            const jsonResp = JSON.parse(JSON.stringify(resp));
            console.log(jsonResp);
            return {
              ...e,
              available: jsonResp.di_disponible == 'S' ? true : false,
              acta: jsonResp.di_acta ? jsonResp.di_acta : null,
              diStatus: jsonResp.di_estatus_bien,
            };
          })
        );

        console.log(newData);
        this.data1.load(newData);
        this.totalItems = res.count;
        this.navigateProceedings = true;
        this.loadingTable = false;
        this.share = true;
        // this.navigateProceedings = true;
      },
      err => {
        this.loadingTable = false;
        this.data1.load([]);
        this.alert('warning', 'No se encontraron bienes', '');
        console.log(err);
      }
    );
  }

  //MODAL DE ACTAS
  openListProceeding() {
    let modalConfig = MODAL_CONFIG;
    (modalConfig.class = 'modal-lg modal-dialog-centered'),
      (modalConfig.ignoreBackdropClick = true),
      (modalConfig.initialState = {
        typeProceedings: 'CONSENTR',
        no_acta: this.idProceeding,
        callback: (data: any) => {
          console.log(data);
          //Expediente
          this.expedient = data.numFile;
          this.idProceeding = data.id;
          this.statusProceeding = data.statusProceedings;
          this.formExp.get('expedient').setValue(data.numFile);
          this.expedientService.getById(data.numFile).subscribe(
            res => {
              console.log(res);
              this.formExp.patchValue({
                causePenal: res.criminalCase,
                preliminaryAscertainment: res.preliminaryInquiry,
              });
              this.chargeGoodsByExp();
            },
            err => {
              console.log(err);
            }
          );
          //Acta
          this.formAct.patchValue({
            ...data,
            act: data.keysProceedings,
            elabDate: this.correctDate(data.elaborationDate),
            actDate: this.correctDate(data.datePhysicalReception),
            captureDate: this.correctDate(data.captureDate),
            receive: data.witness1,
            delivery: data.witness2,
            witnessContr: data.comptrollerWitness,
          });

          this.form.get('scanningFoli').setValue(data.universalFolio);
          this.selectTypeProgramming(data.idTypeProceedings);
          this.searchGoodsInDetailProceeding();

          this.select = true;
          this.share = true;
          this.labelSaveProceeding = 'Guardar cambios';
        },
      });
    this.modalService.show(ModalProceedingsComponent, modalConfig);
  }

  selectRowGood(e: any) {
    console.log(e.data);
    this.descriptionStatusGood = e.data.diStatus;
    this.selectGood = e.data;
  }

  selectRowGoodActa(e: any) {
    console.log(e.data);
    this.selectGoodAct = e.data;
  }

  insertGood() {
    if (this.selectGood == null) {
      this.alert('warning', 'Seleccione un bien para agregar al acta', '');
      return;
    }
  }

  deleteGood() {
    if (this.selectGoodAct == null) {
      this.alert('warning', 'Seleccione un bien para eliminar del acta', '');
      return;
    }

    if (['CERRADA', 'CERRADO'].includes(this.statusProceeding)) {
      this.alert(
        'warning',
        'El acta ya se encuentra cerrada',
        'No se pueden efectuar cambios'
      );
      return;
    }

    if (this.formAct.get('act').value == null || this.idProceeding == null) {
      this.alert(
        'warning',
        'No existe un acta',
        'Debe especificar/buscar el acta para despues eliminar el bien de esta'
      );
      return;
    }

    const body: IdeleteBlkDet = {
      goodNumber: this.selectGoodAct.good.goodId,
      vcScreen: 'FACTCONST_0001',
      extDomProcess: this.selectGoodAct.good.extDomProcess,
      user: this.authService.decodeToken().preferred_username,
    };

    this.goodprocessService.deleteBlkDet(body).subscribe(
      res => {
        const deleteBody: IDeleteDetailProceeding = {
          numberGood: this.selectGoodAct.good.goodId,
          numberProceedings: this.idProceeding,
        };

        this.serviceDetailProc.deleteDetailProcee(deleteBody).subscribe(
          res => {
            console.log(res);
            this.alert('success', 'Se eliminó el bien', '');
            this.chargeGoodsByExp();
            this.searchGoodsInDetailProceeding();
          },
          err => {
            console.log(err);
            this.alert('error', 'Error al eliminar el bien', '');
          }
        );
      },
      err => {
        console.log(err);
        this.alert('error', 'Error al eliminar el bien', '');
      }
    );
  }

  //ESCANEO DE FOLIO
  generateFolio() {
    if (['CERRADA', 'CERRADO'].includes(this.statusProceeding)) {
      this.alert(
        'warning',
        'El acta ya se encuentra cerrada',
        'No se pueden efectuar cambios'
      );
    }

    if (this.form.get('scanningFoli').value != null) {
      this.alert('warning', 'El acta ya cuenta con un folio de escaneo', '');
      this.printScanFile();
      return;
    }

    this.generateFolioFn();
  }

  async generateFolioFn() {
    const q = this.alertQuestion(
      'question',
      'Se generará un nuevo folio de escaneo para el acta abierta.',
      '¿Desea continuar?',
      'Continuar',
      'Cancelar'
    );

    if (!(await q).isConfirmed) {
      return;
    }

    const flyer = await this.getFlyer();
    const jsonFlyer = JSON.parse(JSON.stringify(flyer));
    console.log(jsonFlyer);
    console.log(jsonFlyer.wheelNumber);

    const body: IDocuments = {
      id: 0,
      natureDocument: 'ORIGINAL',
      descriptionDocument: `ACTA ${this.formAct.get('act').value}`,
      significantDate: format(new Date(), 'MM/yyyy'),
      scanStatus: 'SOLICITADO',
      fileStatus: '',
      userRequestsScan: this.authService.decodeToken().preferred_username,
      scanRequestDate: new Date(),
      userRegistersScan: '',
      dateRegistrationScan: undefined,
      userReceivesFile: '',
      dateReceivesFile: undefined,
      keyTypeDocument: 'ENTRE',
      keySeparator: '60',
      numberProceedings: this.expedient,
      sheets: '',
      numberDelegationRequested: this.authService.decodeToken().department,
      numberSubdelegationRequests: this.subdelegationUser,
      numberDepartmentRequest: this.departamentUser,
      registrationNumber: 0,
      flyerNumber: jsonFlyer.wheelNumber,
      userSend: '',
      areaSends: '',
      sendDate: undefined,
      sendFilekey: '',
      userResponsibleFile: '',
      mediumId: '',
      associateUniversalFolio: 0,
      dateRegistrationScanningHc: undefined,
      dateRequestScanningHc: undefined,
      goodNumber: 0,
    };

    this.documentsService.create(body).subscribe(
      res => {
        console.log(res);
        this.form.get('scanningFoli').setValue(res.id);
        const modelEdit: IProccedingsDeliveryReception = {
          universalFolio: parseInt(this.form.get('scanningFoli').value),
        };
        const params = {
          pn_folio: res.id,
        };

        this.serviceProcVal
          .editProceeding(this.idProceeding, modelEdit)
          .subscribe(
            res => {
              console.log(res);
              this.downloadReport('RGERGENSOLICDIGIT', params);
            },
            err => {
              console.log(err);
            }
          );
      },
      err => {}
    );
  }

  downloadReport(reportName: string, params: any) {
    this.siabService.fetchReport(reportName, params).subscribe({
      next: response => {
        this.loading = false;
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
      },
    });
  }

  getFlyer() {
    return new Promise((resolve, _rej) => {
      const route = `notification?filter.wheelNumber=$not:$null&filter.expedientNumber=$eq:${this.expedient}&sortBy=wheelNumber:DESC`;
      this.notificationService.getAllFilter(route).subscribe(
        res => {
          console.log(res);
          resolve(res.data[0]);
        },
        err => {
          console.log(err);
          resolve(null);
        }
      );
    });
  }

  scan() {
    localStorage.setItem('expedient_FACTCONST', this.expedient);
    localStorage.setItem('acta_FACTCONST', this.idProceeding);

    this.router.navigate([`/pages/general-processes/scan-documents`], {
      queryParams: {
        origin: 'FACTCONST_0001',
        folio: this.form.get('scanningFoli').value,
      },
    });
  }

  returnScan() {
    this.expedient = localStorage.getItem('expedient_FACTCONST');
    this.idProceeding = localStorage.getItem('acta_FACTCONST');
    if (this.expedient != null && this.idProceeding != null) {
      this.expedientService.getById(this.expedient).subscribe(
        res => {
          console.log(res);
          this.formExp.patchValue({
            causePenal: res.criminalCase,
            preliminaryAscertainment: res.preliminaryInquiry,
          });
          this.chargeGoodsByExp();
        },
        err => {
          console.log(err);
        }
      );

      this.searchGoodsInDetailProceeding();
      localStorage.removeItem('expedient_FACTCONST');
      localStorage.removeItem('acta_FACTCONST');
    }
  }

  replicateFolio() {}

  printScanFile() {
    if (this.form.get('scanningFoli').value == null) {
      this.alert('warning', 'El acta no cuenta con un folio de escaneo', '');
      return;
    }

    const params = {
      pn_folio: this.form.get('scanningFoli').value,
    };

    this.downloadReport('RGERGENSOLICDIGIT', params);
  }

  seeImages() {
    if (this.form.get('scanningFoli').value != null) {
      this.documentsService
        .getByFolio(this.form.get('scanningFoli').value)
        .subscribe(res => {
          const data = JSON.parse(JSON.stringify(res));
          const scanStatus = data.data[0]['scanStatus'];

          if (scanStatus === 'ESCANEADO') {
            this.scan();
          } else {
            this.alert(
              'warning',
              'No existe documentación para este folio',
              ''
            );
          }
        });
    } else {
      this.alert('warning', 'No tiene folio de escaneo para visualizar.', '');
    }
  }

  //ELIMINAR ACTA
  deleteProceeding() {
    if (this.idProceeding == null) {
      this.alert(
        'warning',
        'No existe un acta',
        'Debe especificar/buscar el acta para después eliminarla'
      );
      return;
    }

    this.alertQuestion(
      'question',
      '¿Desea eliminar el acta?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(q => {
      if (q.isConfirmed) {
        this.proceedingsService
          .deleteProceedingById(this.idProceeding)
          .subscribe({
            next: resp => {
              this.alert('success', 'Se Elimino el Acta Correctamente', '');
              this.formAct.reset();
              this.statusProceeding = null;
              this.getExpedient();
              window.scrollTo(0, 0);
            },
          });
      }
    });
  }

  openGenerateConstans() {
    const modalConfig = {
      ...MODAL_CONFIG,
      class: 'modal-dialog-centered modal-lg',
    };
    modalConfig.initialState = {
      callback: (next: boolean, cveActa?: any, id?: number) => {},
    };
    this.modalService.show(ModalExpedientGenerateComponent, modalConfig);
  }

  goTrackerGood() {
    localStorage.setItem('expedient_FACTCONST', this.expedient);
    localStorage.setItem('acta_FACTCONST', this.idProceeding);

    this.router.navigate([GOODS_TACKER_ROUTE], {
      queryParams: {
        origin: 'FACTCONST_0001',
      },
    });
  }
}
