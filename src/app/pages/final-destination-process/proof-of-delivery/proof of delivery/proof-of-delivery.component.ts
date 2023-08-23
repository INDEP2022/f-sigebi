import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
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
import { IDepositaryAppointments_custom } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ModalScanningFoilTableComponent } from 'src/app/pages/juridical-processes/depositary/legal-opinions-office/modal-scanning-foil/modal-scanning-foil.component';
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
  settings2: any;
  data1 = new LocalDataSource();
  LocalData1: any[] = [];
  data2 = new LocalDataSource();
  LocalData2: any[] = [];
  totalItems: number = 0;
  user: any;
  userDepartament: any;
  expedient: any;
  expeBool: boolean = false;
  ActiveEdon: boolean = false;
  selectedRow: any;
  deleteSelectedRow: any;
  folioScan: any;
  ActaNew: string = 'Nueva Acta';
  wheelNumber: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  @Input() depositaryAppointment: IDepositaryAppointments_custom;

  constructor(
    private fb: FormBuilder,
    private expedientService: ExpedientService,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private goodService: GoodService,
    private parameterCatService: ParameterCatService,
    private authService: AuthService,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer,
    private siabService: SiabService,
    private router: Router,
    private documentsService: DocumentsService,
    private fractionsService: FractionsService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings2 = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS1;
    this.settings2.columns = COLUMNS2;
  }

  ngOnInit(): void {
    this.initForm();
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
      capture: [null, []],
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
      folioScan: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
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
    this.goodService.getByExpedientFilter(expediente).subscribe({
      next: response => {
        console.log('respuesta Bienes: ', response);
        for (let i = 0; i < response.count; i++) {
          let params = {
            goodNumb: response.data[i].goodId,
            description: response.data[i].description,
            quantity: response.data[i].quantity,
            unit: response.data[i].unit,
          };
          this.wheelNumber = response.data[i].flyerNumber;
          this.LocalData1.push(params);
          this.data1.load(this.LocalData1);
          this.data1.refresh();
          this.totalItems = response.count;
        }
      },
      error: err => {
        console.log('Hubo un error good el cual es: ', err);
      },
    });
  }

  getProceding(expedient: any, cve: any, id: any) {
    console.log('Get Proceding, expedient', expedient, ' cve ', cve);

    this.detailProceeDelRecService
      .getProcedingbyKey(expedient, cve, id)
      .subscribe({
        next: resp => {
          console.log(
            'resp.data[0].keysProceedings ---> ',
            resp.data[0].keysProceedings
          );
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
            resp.data[0].datePhysicalReception != null
              ? new Date(resp.data[0].datePhysicalReception)
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
          this.formAct.patchValue(params);
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
                programmingType: 1,
              });
            } else if (TypePro == 'E/DON') {
              this.formExp.patchValue({
                programmingType: 2,
              });
              this.ActiveEdon = true;
            } else if (TypePro == 'E/DES') {
              this.formExp.patchValue({
                programmingType: 3,
              });
            } else if (TypePro == 'E/DEV') {
              this.formExp.patchValue({
                programmingType: 4,
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

    this.user = token.name.toUpperCase();
    //this.getdepartament(userDepartament);
    console.log('User: ', token);
    let userDepartament = token.department.toUpperCase();
    this.getdepartament(userDepartament);
  }

  getdepartament(id: number | string) {
    this.fractionsService.getDepartament(id).subscribe({
      next: response => {
        this.userDepartament = response.data[0];
        console.log('respuesta Departament ', response.data[0]);
      },
    });
  }

  //Se debe revisar el endpoint
  PupArmaClave() {
    let params = {
      pUser: this.user,
    };
    console.log('User params ', params);
    this.parameterCatService.PupArmaClave(params).subscribe({
      next: response => {},
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
    this.selectedRow = event.data;
    console.log(this.selectedRow);
  }

  deleteRowSelect(event: any) {
    this.deleteSelectedRow = event.data;
    console.log(this.deleteSelectedRow);
  }

  //faltan los servicios de back
  addSelectedRow() {}

  btnSolicutud() {
    let status = this.formStatus.get('status').value;
    let acta = this.formAct.get('act').value;
    let folio = this.form.get('scanningFoli').value;
    if (folio != null) {
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
                ///
                //Falta Integrar el de guardar en documentos
                ///
                //this.folioScan = response.data[0].folio
                this.PupLanzaReporte();
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
          this.router.navigate([`/pages/general-processes/scan-documents`], {
            queryParams: {
              origin: 'FACTREFACTADEVOLU',
              folio: this.folioScan,
            },
          });
        }
      });
    } else {
      this.alertInfo(
        'warning',
        'No Tiene Folio de Escaneo para Continuar a la Pantalla de Escaneo',
        ''
      );
    }
  }
  async replicate() {
    // if (!this.officeDictationData && !this.dictationData) {
    //   return;
    // }
    let goodId = this.data2;
    if (goodId) {
      if (this.form.get('scanningFoli').value) {
        // Replicate function
        const response = await this.alertQuestion(
          'question',
          'Aviso',
          'Se generará un nuevo folio de escaneo y se le copiarán las imágenes del folio de escaneo actual. ¿Deseas continuar?'
        );

        if (!response.isConfirmed) {
          return;
        }
        this.getDocumentsCount().subscribe(count => {
          console.log('COUNT ', count);

          if (count == 0) {
            this.alert(
              'warning',
              'Folio de escaneo inválido para replicar',
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
      this.ActaNew = 'Guardar';
      this.formAct.reset();
    } else if (this.ActaNew == 'Guardar') {
      this.postActas();
    }
  }

  postActas() {
    let params = {
      keysProceedings: 'PRUEBA/PRUEBA',
      elaborationDate: new Date(),
      datePhysicalReception: this.formAct.get('actDate').value,
      address: this.formAct.get('address').value,
      statusProceedings: 'ABIERTA',
      elaborate: this.user,
      numFile: this.expedient,
      witness1: this.formAct.get('receive').value,
      witness2: this.formAct.get('delivery').value,
      typeProceedings: 'CONSENTR',
      observations: this.formAct.get('observations').value,
      numRegister: '123',
      captureDate: this.formAct.get('elabDate').value,
      numDelegation1: this.userDepartament.delegation.id,
      numDelegation2: 'null',
      numTransfer: this.formAct.get('noExpedientTransfer').value,
      idTypeProceedings: this.formAct.get('actSelect').value,
      comptrollerWitness: this.formAct.get('witnessContr').value,
      closeDate: 'null',
    };
    this.detailProceeDelRecService.postProceeding(params).subscribe({
      next: resp => {
        console.log('Respuesta Proceeding: ', resp);
        console.log(
          'resp.data[0].keysProceedings ',
          resp.data[0].keysProceedings
        );
        this.generarYActualizar(resp.data[0].keysProceedings);
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
          resp.data[0].datePhysicalReception != null
            ? new Date(resp.data[0].datePhysicalReception)
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
        this.formAct.patchValue(params);
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
              programmingType: 1,
            });
          } else if (TypePro == 'E/DON') {
            this.formExp.patchValue({
              programmingType: 2,
            });
            this.ActiveEdon = true;
          } else if (TypePro == 'E/DES') {
            this.formExp.patchValue({
              programmingType: 3,
            });
          } else if (TypePro == 'E/DEV') {
            this.formExp.patchValue({
              programmingType: 4,
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

  newActa() {}
}
