import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
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
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodTrackerService } from 'src/app/core/services/ms-good-tracker/good-tracker.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingSusPcancelService } from 'src/app/core/services/ms-proceedings/proceeding-suspcancel.service';
import { ProgrammingGoodReceiptService } from 'src/app/core/services/ms-programming-good/programming-good-receipt.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ComerEventForm } from 'src/app/pages/commercialization/shared-marketing-components/event-preparation/utils/forms/comer-event-form';
import { ModalScanningFoilTableComponent } from 'src/app/pages/juridical-processes/depositary/legal-opinions-office/modal-scanning-foil/modal-scanning-foil.component';
import { IGlobalVars } from 'src/app/shared/global-vars/models/IGlobalVars.model';
import { GlobalVarsService } from 'src/app/shared/global-vars/services/global-vars.service';
import { GOODS_TACKER_ROUTE } from 'src/app/utils/constants/main-routes';
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
  constructor(
    private fb: FormBuilder,
    private expedientService: ExpedientService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private goodService: GoodService,
    private authService: AuthService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer,
    private siabService: SiabService,
    private router: Router,
    private documentsService: DocumentsService,
    private fractionsService: FractionsService,
    private proceedingsService: ProceedingsService,
    private screenStatusService: ScreenStatusService,
    private programmingGoodReceiptService: ProgrammingGoodReceiptService,
    private proceedingSusPcancelService: ProceedingSusPcancelService,
    private goodprocessService: GoodprocessService,
    private globalVarsService: GlobalVarsService,
    private activatedRoute: ActivatedRoute,
    private goodTrackerService: GoodTrackerService
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
    hideSubHeader: true,
    actions: false,
    columns: {
      ...COLUMNS1,
    },
    rowClassFunction: (row: { data: { color: any } }) =>
      row.data.color != null
        ? row.data.color === 'S'
          ? 'bg-success text-white'
          : 'bg-dark text-white'
        : '',
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
    this.initForm();
    this.globalVarsService
      .getGlobalVars$()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: global => {
          this.ngGlobal = global;
          console.log('GLOBAL ', this.ngGlobal);
          if (this.ngGlobal.REL_BIENES != null) {
            console.log('REL_BIENES ', this.ngGlobal.REL_BIENES);
            this.backRastreador(this.ngGlobal.REL_BIENES);
          }
        },
      });
    if (this.folioScan != null) {
      this.form.get('scanningFoli').patchValue(this.folioScan);
      localStorage.removeItem('folio');
      this.folioScanbool = true;
    }
    if (this.idProceeding != null) {
      this.blockAct(this.idProceeding);
      this.DetailDelivery(this.idProceeding);
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
      statusAct: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      preliminaryAscertainment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      noExpedientTransfer: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      causePenal: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      capture: [null],
      programmingType: [null, []],
    });
    this.formAct = this.fb.group({
      status: [null],
      elabDate: [null, [Validators.required]],
      actDate: [null, []],
      captureDate: [null, [Validators.required]],
      actSelect: [null, [Validators.required]],
      trans: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      authority: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
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
      receive: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delivery: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      witnessContr: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
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
        this.getGood(this.expedient);
        this.boton = true;
        this.new = true;
        this.share = true;
        this.clear = true;
      },
      error: err => {
        console.log('Hubo un error Expedient el cual es: ', err);
      },
    });
  }

  validExpedient() {
    if (this.expedient != null) {
      this.expeBool = true;
    }
  }

  getGood(expediente: any) {
    this.LocalData1 = [];
    this.data1.load(this.LocalData1);
    this.goodService.getByExpedientFilter(expediente).subscribe({
      next: response => {
        console.log('respuesta Bienes: ', response);
        for (let i = 0; i < response.count; i++) {
          let param = {
            goodNumber: response.data[i].goodId,
            fileNumber: this.expedient,
          };
          this.detailProceeDelRecService.getGoodStatus(param).subscribe({
            next: resp => {
              console.log('Respuesta Status GOOd = ', resp);
              let params = {
                color: 'S',
                goodNumb: response.data[i].goodId,
                description: response.data[i].description,
                quantity: response.data[i].quantity,
                unit: response.data[i].unit,
                extDomProcess: response.data[i].extDomProcess,
                act: resp.data[0].cve_acta,
                noregister: response.data[0].delegationNumber.noRegister,
                noDetail: response.data[0].statusDetails.noPhasePart,
              };
              console.log('params good next ', params);
              this.wheelNumber = response.data[i].flyerNumber;
              this.LocalData1.push(params);
              this.data1.load(this.LocalData1);
              this.data1.refresh();
              this.totalItems = response.count;
            },
            error: err => {
              console.log('Error Status GOOd = ', err);
              let params = {
                color: 'N',
                goodNumb: response.data[i].goodId,
                description: response.data[i].description,
                quantity: response.data[i].quantity,
                unit: response.data[i].unit,
                extDomProcess: response.data[i].extDomProcess,
              };
              console.log('params good error ', params);
              this.wheelNumber = response.data[i].flyerNumber;
              this.LocalData1.push(params);
              this.data1.load(this.LocalData1);
              this.data1.refresh();
              this.totalItems = response.count;
            },
          });
        }
      },
      error: err => {
        console.log('Hubo un error good el cual es: ', err);
      },
    });
  }

  getProceding(expedient: any, cve: any, id: any) {
    this.formAct.reset();
    console.log('Get Proceding, expedient', expedient, ' cve ', cve);

    this.detailProceeDelRecService
      .getProcedingbyKey(expedient, cve, id)
      .subscribe({
        next: resp => {
          this.cveActa = resp.data[0].keysProceedings;
          console.log(
            'resp.data[0].keysProceedings ---> ',
            resp.data[0].keysProceedings
          );
          if (resp.data[0].statusProceedings == 'ABIERTA') {
            this.statusActa = 'Cerrar Acta';
          } else {
            this.statusActa = 'Abrir Acta';
          }
          this.generarYActualizar(resp.data[0].keysProceedings);
          console.log('Respuesta Proceeding: ', resp);
          const Elaboration =
            resp.data[0].elaborationDate != null
              ? new Date(resp.data[0].elaborationDate)
              : null;
          const formattedfecElaboration =
            Elaboration != null ? this.formatDate(Elaboration) : null;

          const Reception =
            resp.data[0].datePhysicalReception != null
              ? new Date(resp.data[0].datePhysicalReception)
              : null;
          const formattedfecReception =
            Reception != null ? this.formatDate(Reception) : null;

          const Capture =
            resp.data[0].captureDate != null
              ? new Date(resp.data[0].captureDate)
              : null;
          const formattedfecCapture =
            Capture != null ? this.formatDate(Capture) : null;
          let params = {
            actSelect: resp.data[0].idTypeProceedings,
            authority:
              resp.data[0].numTransfer != null
                ? resp.data[0].numTransfer.cveTransfer
                : null,
            act: resp.data[0].keysProceedings,
            address: resp.data[0].address,
            receive: resp.data[0].witness1,
            elabDate: formattedfecElaboration,
            actDate: formattedfecReception,
            captureDate: formattedfecCapture,
            observations: resp.data[0].observations,
            delivery: resp.data[0].witness2,
            witnessContr: resp.data[0].comptrollerWitness,
          };
          this.dataProceeding = resp.data[0];
          this.actDate = resp.data[0].datePhysicalReception;
          this.typeProceeding = resp.data[0].idTypeProceedings;
          this.idProceeding = resp.data[0].id;
          this.cveActa = resp.data[0].keysProceedings;
          this.formAct.patchValue(params);
          this.foliobool = true;
          this.select = true;
          this.delegation1 = resp.data[0].numDelegation1;
          this.DetailDelivery(resp.data[0].id);
          let param = {
            status: resp.data[0].statusProceedings,
          };
          this.formStatus.patchValue(param);
          if (resp.data[0].universalFolio != null) {
            this.folioScan = resp.data[0].universalFolio;
            this.form.patchValue({
              scanningFoli: resp.data[0].universalFolio,
            });
          }
          let TypePro = resp.data[0].idTypeProceedings;
          if (TypePro != null) {
            if (TypePro == 'E/VEN') {
              this.formExp.patchValue({
                programmingType: 'EVENCOMER',
              });
            } else if (TypePro == 'E/DON') {
              this.formExp.patchValue({
                programmingType: 'EVENDON',
              });
              this.ActiveEdon = true;
            } else if (TypePro == 'E/DES') {
              this.formExp.patchValue({
                programmingType: 'EVENDEST',
              });
            } else if (TypePro == 'E/DEV') {
              this.formExp.patchValue({
                programmingType: 'EVENDEV',
              });
            } else if (TypePro == null) {
              this.formExp.patchValue({
                programmingType: null,
              });
            }
          }
        },
        error: err => {
          console.log('Hubo un error Proceeding el cual es: ', err);
        },
      });
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

  validaConsec() {
    const fechaYear = this.formAct.get('year').value;
    const fechaY = new Date(fechaYear);
    const anioCompleto = fechaY.getFullYear();
    const dosUltimosDigitos = anioCompleto % 100;
    console.log(dosUltimosDigitos.toString().padStart(2, '0'));

    let ID_TIPO_ACTA =
      this.formAct.get('actSelect').value != null
        ? this.formAct.get('actSelect').value
        : 'E/VEN';
    let CONSECUTIVO = this.formAct.get('folio').value;
    let anio = dosUltimosDigitos.toString().padStart(2, '0');
    if (CONSECUTIVO != null) {
      const LNu_num_folio: number = parseInt(CONSECUTIVO);
      CONSECUTIVO = LNu_num_folio.toString().padStart(5, '0');
      this.formAct.get('folio').patchValue(CONSECUTIVO);
      const lst_cve_acta_bus: string = `${ID_TIPO_ACTA}/%/%/${CONSECUTIVO}/${anio}/%`;
      console.log('lst_cve_acta_bus ', lst_cve_acta_bus);
      this.detailProceeDelRecService
        .getValidaFolio(lst_cve_acta_bus)
        .subscribe({
          next: response => {
            console.log('response VAlIDA ', response);

            if (response.count == 0) {
              this.PupArmaClave();
            } else {
              this.alert(
                'error',
                'Ya existe un Acta con el Folio Ingresado',
                ''
              );
              this.formAct.get('folio').patchValue('');
            }
          },
          error: err => {
            console.log('eerrr ', err);
            if (err.status == 400) {
              this.PupArmaClave();
            } else {
              this.alert(
                'error',
                'Ya existe un Acta con el Folio Ingresado',
                ''
              );
              this.formAct.get('folio').patchValue('');
            }
          },
        });
    } else {
      this.alert('error', 'Número de Folio Inválido', '');
    }
  }

  PupArmaClave() {
    const fechaMes = this.formAct.get('month').value;
    const fechaM = new Date(fechaMes);
    const mes = (fechaM.getMonth() + 1).toString().padStart(2, '0');
    console.log(mes);

    const fechaYear = this.formAct.get('year').value;
    const fechaY = new Date(fechaYear);
    const anioCompleto = fechaY.getFullYear();
    const dosUltimosDigitos = anioCompleto % 100;
    console.log(dosUltimosDigitos.toString().padStart(2, '0'));

    let params = {
      pTypeActaId:
        this.formAct.get('actSelect').value != null
          ? this.formAct.get('actSelect').value
          : 'E/VEN',
      pTrans: this.formAct.get('trans').value,
      pTransferringKey: this.formAct.get('authority').value,
      pManages: this.formAct.get('del').value,
      pConsecutive: this.formAct.get('folio').value,
      pDelgationNumber: this.delegation,
      pSubDelgationNumber: this.subdelegation,
      pDepartment: this.departament,
      pDelegationNumber1: this.delegation,
      pYear: dosUltimosDigitos.toString().padStart(2, '0'),
      pMonth: mes,
    };
    console.log('User params ', params);
    this.detailProceeDelRecService.pupArmaClave(params).subscribe({
      next: response => {
        this.postActas(response.parameter_cve_acta);
      },
      error: err => {
        this.alert('error', 'Error', err.message);
      },
    });
  }

  loadModal() {
    this.openModal(true, this.expedient);
  }

  openModal(newOrEdit: boolean, data: any) {
    const modalConfig = { ...MODAL_CONFIG, class: 'modal-dialog-centered' };
    modalConfig.initialState = {
      newOrEdit,
      data,
      callback: (next: boolean, cveActa?: any, id?: number) => {
        if (next) this.getProceding(this.expedient, cveActa, id);
      },
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

  //faltan los servicios de back
  addSelectedRow() {
    console.log('this.typeProceeding ', this.typeProceeding);
    let identifier: any;
    let finmesa: any;
    if (this.typeProceeding == 'E/VEN') {
      identifier = 'COM';
      finmesa = 'Comercialización';
    } else if (this.typeProceeding == 'E/DON') {
      identifier = 'DON';
      finmesa = 'Donación';
    } else if (this.typeProceeding == 'E/DES') {
      identifier = 'DES';
      finmesa = 'Destrucción';
    } else if (this.typeProceeding == 'E/DEV') {
      identifier = 'DEV';
      finmesa = 'Devolución';
    } else if (this.typeProceeding == 'E/RES') {
      identifier = 'ASI';
      finmesa = 'Asignación';
    }
    console.log('this.selected RoW 22 ', this.selectedRow);
    console.log(' identifier ', identifier);
    let params = {
      screenKey: 'FACTCONST_0001',
      identifier: identifier,
      goodNumber: this.selectedRow.goodNumb,
      extDomProcess: this.selectedRow.extDomProcess,
    };
    this.screenStatusService.getStatusTA(params).subscribe({
      next: responsestatus => {
        console.log('ResponseEstatus ', responsestatus);
        this.T_TIPOA = responsestatus.data[0].count;
        this.detailProceeDelRecService
          .getCount(this.selectedRow.goodNumb)
          .subscribe({
            next: responseProcedingCount => {
              console.log('responseProcedingCount ', responseProcedingCount);
              this.T_PROMES = responseProcedingCount.data[0].count;
              this.validationTipos(finmesa);
            },
            error: err => {
              this.T_PROMES = 0;
              this.validationTipos(finmesa);
            },
          });
      },
      error: err => {
        this.T_TIPOA = 0;
        this.validationTipos(finmesa);
      },
    });
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
      this.addGood();
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
    if (this.ActaNew == 'Nueva Acta') {
      const elaborationDate = new Date();
      const day = elaborationDate.getDate().toString().padStart(2, '0');
      const month = (elaborationDate.getMonth() + 1)
        .toString()
        .padStart(2, '0');
      const year = elaborationDate.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;
      this.ActaNew = 'Guardar';
      this.formAct.reset();
      this.formAct.get('elabDate').setValue(formattedDate);
      this.newA = true;
      this.boton = false;
      this.campos = true;
      this.select = true;
    } else if (this.ActaNew == 'Guardar') {
      this.validaConsec();
    }
  }

  postActas(key: any) {
    let params = {
      keysProceedings: key,
      elaborationDate: new Date().toISOString(),
      datePhysicalReception: this.formAct.get('actDate').value,
      address: this.formAct.get('address').value,
      statusProceedings: 'ABIERTA',
      elaborate: this.user,
      numFile: this.expedient,
      witness1: this.formAct.get('receive').value,
      witness2: this.formAct.get('delivery').value,
      typeProceedings: 'CONSENTR',
      observations: this.formAct.get('observations').value,
      //numRegister: '123',
      captureDate: this.formAct.get('captureDate').value,
      numDelegation1: this.userDepartament.delegation.id,
      //  numDelegation2: n,
      numTransfer:
        this.formExp.get('noExpedientTransfer').value != null
          ? this.formExp.get('noExpedientTransfer').value
          : null,
      idTypeProceedings: this.formAct.get('actSelect').value,
      comptrollerWitness: this.formAct.get('witnessContr').value,
      //closeDate: 'null',
    };
    this.detailProceeDelRecService.postProceeding(params).subscribe({
      next: resp => {
        this.formAct.reset();
        console.log('Respuesta Proceeding: ', resp);
        this.alert('success', 'Exitoso', 'Se Creo el Acta Exitosamente');
        console.log('resp.data[0].keysProceedings ', resp.keysProceedings);

        if (resp.statusProceedings == 'ABIERTA') {
          this.statusActa = 'Cerrar Acta';
        } else {
          this.statusActa = 'Abrir Acta';
        }
        this.generarYActualizar(resp.keysProceedings);
        const Elaboration =
          resp.elaborationDate != null ? new Date(resp.elaborationDate) : null;
        const formattedfecElaboration =
          Elaboration != null ? this.formatDate(Elaboration) : null;

        const Reception =
          resp.datePhysicalReception != null
            ? new Date(resp.datePhysicalReception)
            : null;
        const formattedfecReception =
          Reception != null ? this.formatDate(Reception) : null;

        const Capture =
          resp.captureDate != null ? new Date(resp.captureDate) : null;
        const formattedfecCapture =
          Capture != null ? this.formatDate(Capture) : null;
        let params = {
          actSelect: resp.idTypeProceedings,
          authority:
            resp.numTransfer != null ? resp.numTransfer.cveTransfer : null,
          act: resp.keysProceedings,
          address: resp.address,
          receive: resp.witness1,
          elabDate: formattedfecElaboration,
          actDate: formattedfecReception,
          captureDate: formattedfecCapture,
          observations: resp.observations,
          delivery: resp.witness2,
          witnessContr: resp.comptrollerWitness,
        };
        this.dataProceeding = resp;
        this.actDate = resp.datePhysicalReception;
        this.typeProceeding = resp.idTypeProceedings;
        this.idProceeding = resp.id;
        this.cveActa = resp.keysProceedings;
        this.formAct.patchValue(params);
        this.DetailDelivery(resp.id);
        this.boton = true;
        this.select = true;
        this.foliobool = true;
        this.campos = false;
        this.newA = false;
        let param = {
          status: resp.statusProceedings,
        };
        this.formStatus.patchValue(param);
        if (resp.universalFolio != null) {
          this.form.patchValue({
            scanningFoli: resp.universalFolio,
          });
        }
        let TypePro = resp.idTypeProceedings;
        if (TypePro != null) {
          if (TypePro == 'E/VEN') {
            this.formExp.patchValue({
              programmingType: 'EVENCOMER',
            });
          } else if (TypePro == 'E/DON') {
            this.formExp.patchValue({
              programmingType: 'EVENDON',
            });
            this.ActiveEdon = true;
          } else if (TypePro == 'E/DES') {
            this.formExp.patchValue({
              programmingType: 'EVENDEST',
            });
          } else if (TypePro == 'E/DEV') {
            this.formExp.patchValue({
              programmingType: 'EVENDEV',
            });
          } else if (TypePro == null) {
            this.formExp.patchValue({
              programmingType: null,
            });
          }
        }
      },
    });
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
            this.addGoodRastreador(response.data[0].goodNumber);
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
      callback: (next: boolean, cveActa?: any, id?: number) => {
        if (next) this.getProceding(this.expedient, cveActa, id);
      },
    };
    this.modalService.show(ModalExpedientGenerateComponent, modalConfig);
  }

  DetailDelivery(NumberActa: any) {
    this.LocalData2 = [];
    this.data2.load(this.LocalData2);
    this.detailProceeDelRecService.getDetailProceeding(NumberActa).subscribe({
      next: response => {
        for (let i = 0; i < response.count; i++) {
          let params = {
            goodNumb: response.data[i].numberGood,
            clasificationNumb: response.data[i].good.goodClassNumber,
            description: response.data[i].good.description,
            quantity: response.data[i].good.quantity,
            unit: response.data[i].good.unit,
            numberProceedings: response.data[i].numberProceedings,
          };
          this.LocalData2.push(params);
          this.data2.load(this.LocalData2);
          this.data2.refresh();
          this.totalItems2 = response.count;
        }
      },
    });
  }

  deleteProceeding() {
    this.proceedingsService.deleteProceedingById(this.idProceeding).subscribe({
      next: resp => {
        this.alert('success', 'Se Elimino el Acta Correctamente', '');
        this.formAct.reset();
        this.getExpedient();
        this.select = false;
        this.newA = false;
        this.boton = true;
        this.campos = true;
        this.foliobool = false;
        window.scrollTo(0, 0);
      },
    });
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
        callback: (next: boolean, cveActa?: any, id?: number) => {
          if (next) this.getProceding(this.expedient, cveActa, id);
        },
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

  closeOpenProceeding() {
    let valmovimiento = 0;
    let valMessage: string;
    let lv_TIP_ACTA: any;
    let lv_VALMOTOS: any;
    let params = {
      usuario: this.user,
      no_acta: this.idProceeding,
    };
    this.programmingGoodReceiptService.getcDatVal(params).subscribe({
      next: response => {
        console.log('RESPONSE PROGRAMMING ', response);
        valmovimiento = response.data.val_movimineto;
        valMessage = response.data.val_mensaje;
        lv_VALMOTOS = response.count;
      },
      error: err => {},
    });
    if (this.statusActa == 'Abrir Acta') {
      this.alertQuestion(
        'info',
        '¿Está seguro de abrir la Constancia ' +
          this.formAct.get('act').value +
          '. ¿Deseas continuar?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          //PUP BUSCA TIPO ACTA
          // BEGIN
          // : BLK_CTR.TIPO_ACTAA  := 'CONSENTR';
          // END;
          lv_TIP_ACTA = 'CONSENTR,' + this.typeProceeding;
          let param = {
            P_NOACTA: this.idProceeding,
            P_AREATRA: 3,
            P_PANTALLA: 'FACTCONST_0001',
            P_TIPOMOV: lv_TIP_ACTA,
            USUARIO: this.user,
          };
          this.programmingGoodReceiptService.paAbrirActas(param).subscribe({
            next: response => {
              console.log('respuesta Pa Abrir Actas ', response);
              if (lv_VALMOTOS == 1) {
                this.programmingGoodReceiptService
                  .paRegresarEstadoAnterior(params)
                  .subscribe({
                    next: resp => {
                      console.log('respuesta Regresar estado anterior ', resp);
                      let proceding = this.idProceeding;
                      this.blockAct(proceding);
                    },
                  });
              } else {
                this.alert('error', 'Error', valMessage);
              }
            },
          });
        }
      });
    } else if (this.statusActa == 'Cerrar Acta') {
      if (this.LocalData2.length == 0) {
        this.alert(
          'warning',
          'Alerta',
          'El Acta no se Puede Cerrar sin Bienes'
        );
        return;
      }
      this.alertQuestion(
        'info',
        '¿Está seguro de Cerrar la Constancia ' +
          this.formAct.get('act').value +
          '. ¿Deseas continuar?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        let T_VALFON;
        let T_VALEXFO;
        let T_DATACT;
        if (res.isConfirmed) {
          this.documentsService.getDocumentsCursor(this.folioScan).subscribe({
            next: response => {
              T_VALFON = response.count;
            },
            error: err => {
              T_VALFON = 0;
            },
          });
          this.documentsService
            .getDocumentsCursor2(this.folioScan, this.expedient)
            .subscribe({
              next: resp => {
                T_VALEXFO = resp.count;
              },
            });
          if (this.folioScan == null) {
            this.alert(
              'warning',
              'Alerta',
              'No se Puede Cerrar la Constancia, el Folio de Escaneo es Obligatorio'
            );
            return;
          } else if (T_VALFON == 0) {
            this.alert(
              'warning',
              'Alerta',
              'No se Puede Cerrar el Constancia, no Tiene Imágenes Escaneadas para Esté Folio'
            );
            return;
          } else if (T_VALEXFO == 0) {
            this.alert(
              'warning',
              'Alerta',
              'El Folio de Escaneo no Esta Relacionado con el Número de Expediente'
            );
            return;
          } else {
            for (let i = 0; i < this.LocalData2.length; i++) {
              const Elaboration =
                this.actDate != null ? new Date(this.actDate) : null;
              const formattedfecElaboration =
                Elaboration != null ? this.formatDate2(Elaboration) : null;
              let par = {
                pCreationDate: formattedfecElaboration,
                pScreen: 'FACTCONST_0001',
                pActNum: this.idProceeding,
                pProc: 1,
                pAction: 'CON',
              };
              this.proceedingsService.postConstDelivery(par).subscribe({
                next: resp => {
                  console.log('postConst Delivery ', resp);
                  this.dataProceeding.statusProceedings = 'CERRADA';
                  this.dataProceeding.universalFolio = this.folioScan;
                  this.detailProceeDelRecService
                    .PutProcedingbyIdAct(this.idProceeding, this.dataProceeding)
                    .subscribe({
                      next: respon => {
                        console.log('respuesta Put ', respon);
                        this.proceedingSusPcancelService
                          .suspcancel(this.user)
                          .subscribe({
                            next: resp => {
                              T_DATACT = resp.count;
                              if (T_DATACT > 0) {
                                this.alert(
                                  'success',
                                  'Realizado con Exito',
                                  'El Acta se Cerró Correctamente'
                                );
                                this.formStatus
                                  .get('status')
                                  .patchValue('CERRADA');
                                let noActa = this.idProceeding;
                                this.blockAct(noActa);
                              }
                            },
                            error: err => {},
                          });
                      },
                    });
                },
              });
            }
          }
        }
      });
    }
  }
  formatDate2(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();
    return `${year}/${month}/${day}`;
  }

  blockAct(noAct: any) {
    this.formAct.reset();
    this.detailProceeDelRecService.getProcedingbyIdAct(noAct).subscribe({
      next: resp => {
        this.cveActa = resp.data[0].keysProceedings;
        console.log(
          'resp.data[0].keysProceedings ---> ',
          resp.data[0].keysProceedings
        );
        if (resp.data[0].statusProceedings == 'ABIERTA') {
          this.statusActa = 'Cerrar Acta';
        } else {
          this.statusActa = 'Abrir Acta';
        }
        this.generarYActualizar(resp.data[0].keysProceedings);
        console.log('Respuesta Proceeding: ', resp);
        const Elaboration =
          resp.data[0].elaborationDate != null
            ? new Date(resp.data[0].elaborationDate)
            : null;
        const formattedfecElaboration =
          Elaboration != null ? this.formatDate(Elaboration) : null;

        const Reception =
          resp.data[0].datePhysicalReception != null
            ? new Date(resp.data[0].datePhysicalReception)
            : null;
        const formattedfecReception =
          Reception != null ? this.formatDate(Reception) : null;

        const Capture =
          resp.data[0].captureDate != null
            ? new Date(resp.data[0].captureDate)
            : null;
        const formattedfecCapture =
          Capture != null ? this.formatDate(Capture) : null;
        let params = {
          actSelect: resp.data[0].idTypeProceedings,
          authority:
            resp.data[0].numTransfer != null
              ? resp.data[0].numTransfer.cveTransfer
              : null,
          act: resp.data[0].keysProceedings,
          address: resp.data[0].address,
          receive: resp.data[0].witness1,
          elabDate: formattedfecElaboration,
          actDate: formattedfecReception,
          captureDate: formattedfecCapture,
          observations: resp.data[0].observations,
          delivery: resp.data[0].witness2,
          witnessContr: resp.data[0].comptrollerWitness,
        };
        this.dataProceeding = resp.data[0];
        this.actDate = resp.data[0].datePhysicalReception;
        this.typeProceeding = resp.data[0].idTypeProceedings;
        this.idProceeding = resp.data[0].id;
        this.cveActa = resp.data[0].keysProceedings;
        this.formAct.patchValue(params);
        this.foliobool = true;
        this.select = true;
        this.delegation1 = resp.data[0].numDelegation1;
        this.DetailDelivery(resp.data[0].id);
        let param = {
          status: resp.data[0].statusProceedings,
        };
        this.formStatus.patchValue(param);
        if (resp.data[0].universalFolio != null) {
          this.form.patchValue({
            scanningFoli: resp.data[0].universalFolio,
          });
        }
        let TypePro = resp.data[0].idTypeProceedings;
        if (TypePro != null) {
          if (TypePro == 'E/VEN') {
            this.formExp.patchValue({
              programmingType: 'EVENCOMER',
            });
          } else if (TypePro == 'E/DON') {
            this.formExp.patchValue({
              programmingType: 'EVENDON',
            });
            this.ActiveEdon = true;
          } else if (TypePro == 'E/DES') {
            this.formExp.patchValue({
              programmingType: 'EVENDEST',
            });
          } else if (TypePro == 'E/DEV') {
            this.formExp.patchValue({
              programmingType: 'EVENDEV',
            });
          } else if (TypePro == null) {
            this.formExp.patchValue({
              programmingType: null,
            });
          }
        }
      },
      error: err => {
        console.log('Hubo un error Proceeding el cual es: ', err);
      },
    });
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

  addGood() {
    if (this.selectedRow == null) {
      this.alert('warning', 'Alerta', 'Es Necesario Seleccionar un Bien');
      return;
    }
    let good = this.selectedRow;
    let params = {
      numberGood: this.selectedRow.goodNumb,
      numberProceedings: this.idProceeding,
      amount: this.selectedRow.quantity,
      approvedDateXAdmon: new Date(),
      approvalUserXAdmon: this.user,
      dateIndicatesUserApproval: new Date(),
      numberRegister: this.selectedRow.noregister,
      amountReturned: this.selectedRow.quantity,
    };
    this.proceedingsService.postConstGood(params).subscribe({
      next: response => {
        console.log('response Post ', response);
        this.data2.refresh();
        this.DetailDelivery(this.idProceeding);
        this.selectedRow = null;
      },
      error: err => {
        console.log('error ', err);
        if (err.error.message == 'El registro ya existe.') {
          this.alert('error', 'No se Puede Agregar', 'El Bien ya Existe');
          this.selectedRow = null;
        }
      },
    });
  }

  deleteSelect() {
    let params = {
      numberGood: this.deleteSelectedRow.goodNumb,
      numberProceedings: this.deleteSelectedRow.numberProceedings,
    };
    this.proceedingsService.deleteReception(params).subscribe({
      next: resp => {
        console.log('respuesta delete ', resp);
        this.DetailDelivery(this.idProceeding);
        this.deleteSelectedRow = null;
      },
    });
  }

  addGoodRastreador(good: any) {
    this.goodService.getByGood(good).subscribe({
      next: response => {
        let params = {
          numberGood: response.data[0].goodId,
          numberProceedings: this.idProceeding,
          amount: response.data[0].quantity,
          approvedDateXAdmon: new Date(),
          approvalUserXAdmon: this.user,
          dateIndicatesUserApproval: new Date(),
          numberRegister: response.data[0].noRegisterDelegation,
          amountReturned: response.data[0].quantity,
        };
        this.proceedingsService.postConstGood(params).subscribe({
          next: response => {
            console.log('response Post ', response);
            this.data2.refresh();
            this.DetailDelivery(this.idProceeding);
            this.selectedRow = null;
          },
          error: err => {
            console.log('error ', err);
            if (err.error.message == 'El registro ya existe.') {
              this.alert('error', 'No se Puede Agregar', 'El Bien ya Existe');
              this.selectedRow = null;
            }
          },
        });
      },
    });
  }
  clearall() {
    this.select = false;
    this.LocalData1 = [];
    this.data1.load(this.LocalData1);
    this.LocalData2 = [];
    this.data1.load(this.LocalData2);
    this.expedient = null;
    this.boton = false;
    this.new = false;
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
    this.clear = false;
    this.newA = true;
    this.boton = false;
    this.campos = true;
    this.select = true;
  }
}
