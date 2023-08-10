import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDepositaryAppointments_custom } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { AffairService } from 'src/app/core/services/catalogs/affair.service';
import { StationService } from 'src/app/core/services/catalogs/station.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { MaximunClosingTimeService } from 'src/app/core/services/ms-proceedings';
import { DetailProceedingsDevolutionService } from 'src/app/core/services/ms-proceedings/detail-proceedings-devolution';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { RELATED_FOLIO_COLUMNS } from 'src/app/pages/juridical-processes/depositary/appointments/appointments/columns';
import { ModalScanningFoilAppointmentTableComponent } from 'src/app/pages/juridical-processes/depositary/appointments/modal-scanning-foil/modal-scanning-foil.component';
import { DetailDelegationsComponent } from '../../shared-final-destination/detail-delegations/detail-delegations.component';
import { DELEGATIONS_COLUMNS } from '../delegations-columns';
import { DocumentFormModalComponent } from '../document-form-modal/document-form-modal/document-form-modal.component';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-third-possession-acts',
  templateUrl: './third-possession-acts.component.html',
  styles: [],
})
export class ThirdPossessionActsComponent extends BasePage implements OnInit {
  response: boolean = false;
  actForm: FormGroup;
  boolScan: boolean = true;
  formTable1: FormGroup;
  folioScan: number;
  folioScan2: number;
  bsModalRef?: BsModalRef;
  totalItems: number = 0;
  depositaryAppointment: IDepositaryAppointments_custom;
  _saveDataDepositary: boolean = false;
  totalItems1: number = 0;
  settings2: any;
  public noBienReadOnly: number = null;
  params = new BehaviorSubject<ListParams>(new ListParams());
  invoiceDetailsForm: ModelForm<any>;
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  params4 = new BehaviorSubject<ListParams>(new ListParams());
  params5 = new BehaviorSubject<ListParams>(new ListParams());

  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  //data = EXAMPLE_DATA;
  //data2 = EXAMPLE_DATA2;
  columnFilters: any = [];
  columnFilters1: any = [];

  data: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();

  expedientSearch: number | string;
  expedient: any;
  proceedingDev: any;
  crime: any;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private rNomenclaService: RNomenclaService,
    private router: Router,
    private procedureManagementService: ProcedureManagementService,
    //Transferente
    private documentsService: DocumentsService,
    private stationService: StationService,
    //HistoricoGood
    private historyGoodService: HistoryGoodService,
    private expedientService: ExpedientService,
    private goodService: GoodService,
    private activatedRoute: ActivatedRoute,
    private statusGoodService: StatusGoodService,
    private detailProceedingsDevolutionService: DetailProceedingsDevolutionService,
    //crime
    private affairService: AffairService,
    //document
    private serviceDocuments: DocumentsService,
    // maximun-closing-time
    private maximunClosingTimeService: MaximunClosingTimeService
  ) {
    super();
    this.settings = { ...this.settings, actions: false };
    this.settings2 = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
    this.settings2.columns = COLUMNS;

    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.folioScan2 = params['folio'] ? Number(params['folio']) : null;
      });
    /* this.settings.columns = IMPLEMENTATION_COLUMNS;
    this.settings.rowClassFunction = (row: { data: { estatus: any } }) =>
      row.data.estatus != null
        ? row.data.estatus === 'AUTORIZADA'
          ? 'bg-success text-white'
          : 'bg-dark text-white'
        : '';
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...IMPLEMENTATION_COLUMNS },
    };
    this.settings2.columns = INVOICE_COLUMNS;*/
  }

  ngOnInit(): void {
    this.initForm();
    this.startCalendars();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            /*  SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'eventTpId':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              console.log(filter.search);
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getGood();
        }
      });

    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGood());*/
    /*const noTransfer = 1;
    const type = 'P'
    this.getCveTransferent(noTransfer,type);*/
  }

  initForm() {
    this.actForm = this.fb.group({
      statusAct: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      preliminaryAscertainment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      causePenal: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      crimeKey: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      crime: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      actSelect: [null, [Validators.required]],
      status: [null, [Validators.required]],
      authority: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      delivery: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      admin: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      folio: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      act: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      elabDate: [null, [Validators.required]],
      year: [this.bsValueFromYear, [Validators.required]],
      month: [this.bsValueFromMonth, [Validators.required]],
      folioScan: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      orderingJudge: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      deliveryName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      beneficiary: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      witness: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      auditor: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });

    this.formTable1 = this.fb.group({
      id: [null, []],
      preliminaryInquiry: [null, []],
      criminalCase: [null, []],
      crimeKey: [null, []],
      registerNumber: [null, []],
      transferNumber: [null, []],
      expTransferNumber: [null, []],
      expedientType: [null, []],
      detail: [null, []],
      crime: [null, []],
    });
  }

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }

  startCalendars() {
    this.bsConfigFromMonth = Object.assign(
      {},
      {
        minMode: this.minModeFromMonth,
        dateInputFormat: 'MM',
      }
    );
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  search(term: string | number) {
    this.expedientSearch = term;
    console.log(this.expedientSearch);
    //this.response = !this.response;
    this.getExpedient(term);
    // this.actForm.disable();
    //this.formTable1.disable();
  }

  onSubmit() {}

  openModalApplicant(context?: any) {
    console.log(context);
    const modalRef = this.modalService.show(DocumentFormModalComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.onConfirm.subscribe(data => {
      if (data) this.initForm();
    });
  }
  /* getActDevoluciones(id?: number | string){
if (id) {
      this.params4.getValue()['filter.id'] = `$eq:${id}`;
    }
    let params = {
      ...this.params4.getValue(),
    };
    console.log('params',params);
    this.detailProceedingsDevolutionService.getAllProceedingsDevolution(params).subscribe({
      next: response => {
        this.expedient = response.data;
        this.actForm.controls['id'].setValue(this.expedient[0].id);
        this.actForm.controls['preliminaryInquiry'].setValue(
          this.expedient[0].preliminaryInquiry
        );
        this.actForm.controls['criminalCase'].setValue(
          this.expedient[0].criminalCase
        );
        this.actForm.controls['crimeKey'].setValue(
          this.expedient[0].crimeKey
        );
        this.actForm.controls['expTransferNumber'].setValue(
          this.expedient[0].expTransferNumber
        );
        this.actForm.controls['expedientType'].setValue(
          this.expedient[0].expedientType
        );
        console.log(response.data);
        this.response = !this.response;
        this.getCrime(this.actForm.controls['crimeKey'].value);
        this.getProceedingsDevolution(this.actForm.controls['id'].value);
      },
      error: err => {
        this.onLoadToast(
          'warning',
          'No se Encontro el Expediente',
          `Intente con Otro`
        );
      },
    });
  }*/

  getExpedient(id?: number | string) {
    if (id) {
      this.params1.getValue()['filter.id'] = `$eq:${id}`;
    }
    let params = {
      ...this.params1.getValue(),
    };
    console.log('params', params);
    this.expedientService.getAll(params).subscribe({
      next: response => {
        this.expedient = response.data;
        console.log('expedient', this.expedient);
        this.formTable1.controls['id'].setValue(this.expedient[0].id);
        this.formTable1.controls['preliminaryInquiry'].setValue(
          this.expedient[0].preliminaryInquiry
        );
        this.formTable1.controls['criminalCase'].setValue(
          this.expedient[0].criminalCase
        );
        this.formTable1.controls['crimeKey'].setValue(
          this.expedient[0].crimeKey
        );
        this.formTable1.controls['expTransferNumber'].setValue(
          this.expedient[0].expTransferNumber
        );
        this.formTable1.controls['expedientType'].setValue(
          this.expedient[0].expedientType
        );
        console.log(response.data);
        this.response = !this.response;
        this.getCrime(this.formTable1.controls['crimeKey'].value);
        this.getProceedingsDevolution(this.formTable1.controls['id'].value);
        this.getGood(this.formTable1.controls['id'].value);
      },
      error: err => {
        this.onLoadToast(
          'warning',
          'No se Encontro el Expediente',
          `Intente con Otro`
        );
      },
    });
  }

  getProceedingsDevolution(idExp: string | number) {
    if (idExp) {
      this.params2.getValue()['filter.fileNumber.filesId'] = `$eq:${idExp}`;
    }
    let params = {
      ...this.params2.getValue(),
    };
    console.log('hemos llegado');
    this.detailProceedingsDevolutionService
      .getAllProceedingsDevolution(params)
      .subscribe({
        next: response => {
          this.proceedingDev = response.data;
          console.log('proceedingDev', this.proceedingDev);
          this.actForm.controls['actSelect'].setValue(
            this.proceedingDev[0].proceeding
          );
          this.actForm.controls['status'].setValue(
            this.proceedingDev[0].proceedingStatus
          );
          this.actForm.controls['authority'].setValue(
            this.proceedingDev[0].authorityOrder
          );
          this.actForm.controls['orderingJudge'].setValue(
            this.proceedingDev[0].authorityOrder
          );
          this.actForm.controls['act'].setValue(
            this.proceedingDev[0].proceedingsCve
          );
          var formatted = new DatePipe('en-EN').transform(
            this.proceedingDev[0].elaborationDate,
            'dd/MM/yyyy',
            'UTC'
          );
          this.actForm.controls['elabDate'].setValue(formatted);
          this.actForm.controls['folioScan'].setValue(
            this.proceedingDev[0].universalFolio
          );
          this.actForm.controls['orderingJudge'].setValue(
            this.proceedingDev[0].authorityOrder
          );
          this.actForm.controls['observations'].setValue(
            this.proceedingDev[0].observations
          );
          this.actForm.controls['deliveryName'].setValue(
            this.proceedingDev[0].witnessOne
          );
          this.actForm.controls['beneficiary'].setValue(
            this.proceedingDev[0].beneficiaryOwner
          );
          this.actForm.controls['witness'].setValue(
            this.proceedingDev[0].witnessTwo
          );
          this.actForm.controls['auditor'].setValue(
            this.proceedingDev[0].auditor
          );
          this.actForm.controls['statusAct'].setValue(
            this.proceedingDev[0].proceedingStatus
          );

          this.getDetailProcedings(this.proceedingDev[0].id);
          /*proceedingsTypeId
        receiptCve
        elaborationDate
        closingDate
        authorityOrder
        witnessOne
        witnessTwo
        observations
        beneficiaryOwner
        auditor
        proceedingStatus
        elaborated
        id
        proceedingsType
        delegationNumberOne
        delegationNumberTwo
        numRegister

        transferNumber
        proceedingsCve*/
        },
        error: err => {
          console.log('ups');
        },
      });
  }

  getCrime(cveCrime?: string | number) {
    if (cveCrime) {
      this.params3.getValue()['filter.id'] = cveCrime;
    }
    let params = {
      ...this.params3.getValue(),
    };
    this.affairService.getCrime(params).subscribe({
      next: response => {
        this.crime = response.data;
        this.formTable1.controls['crime'].setValue(this.crime[0].otvalor);
        //otvalor
        //console.log(response.data);
      },
      error: err => {},
    });
  }

  getCveTransferent(noTranfer: string | number, typeExpe: string) {
    let body = {
      transferNumber: noTranfer,
      fileType: typeExpe,
    };
    let params = {
      ...this.params4.getValue(),
    };
    this.affairService.getCveTransfer(body, params).subscribe({
      next: resp => {
        console.log(resp);
      },
      error: err => {},
    });
  }

  openModal() {
    const initialState: ModalOptions = {
      initialState: {
        title: 'Delegación Administra',
        columns: DELEGATIONS_COLUMNS,
        optionColumn: 'delegations',
      },
    };
    this.bsModalRef = this.modalService.show(
      DetailDelegationsComponent,
      initialState
    );
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  openScannerPage() {
    this.boolScan = false;
    if (this.actForm.get('folioScan').value) {
      this.alertQuestion(
        'info',
        'Se abrirá la pantalla de escaneo para el folio de Escaneo del Dictamen. ¿Deseas continuar?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          this.router.navigate(
            [`/pages/final-destination-process/third-possession-acts`],
            {
              queryParams: {
                origin: 'FACTREFACTAPOSTER',
                folio: this.actForm.value.folioScan,
              },
            }
          );
        }
      });
    } else {
      this.alertInfo(
        'warning',
        'No tiene Folio de Escaneo para continuar a la pantalla de Escaneo',
        ''
      );
    }
  }

  getGood(expId?: string | number) {
    this.loading = true;
    if (expId) {
      this.params.getValue()['filter.fileNumber'] = `$eq:${expId}`;
    }
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodService.getAll(params).subscribe({
      next: response => {
        //this.comerEvent = response.data;
        this.data.load(response.data);
        this.totalItems = response.count || 0;
        this.data.refresh();
        //this.params.value.page = 1;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  getDetailProcedings(expId: string | number) {
    this.loading = true;
    if (expId) {
      this.params.getValue()['filter.good.fileNumber'] = `$eq:${expId}`;
    }
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters1,
    };
    this.detailProceedingsDevolutionService.getAll(params).subscribe({
      next: response => {
        //this.comerEvent = response.data;
        this.data2.load(response.data);
        this.totalItems1 = response.count || 0;
        this.data2.refresh();
        //this.params.value.page = 1;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data2.load([]);
        this.data2.refresh();
        this.totalItems1 = 0;
      },
    });
  }

  closeExpedient() {
    let existe = '';
    let vban = true;
    let vtmp_max = 0;

    if (!this.proceedingDev[0].proceedingsCve) {
      this.alert(
        'warning',
        'Ha Ocurrido un Error',
        'No Existe Ningun Acta a Cerra'
      );
    }
    if (!this.proceedingDev[0].universalFolio) {
      this.alert(
        'warning',
        'Ha Ocurrido un Error',
        'Indique El Folio de Escaneo'
      );
    } else {
      this.serviceDocuments
        .getByFolioUniversal(this.proceedingDev[0].universalFolio)
        .subscribe({
          next: data => {
            if (data.data.length == 0) {
              existe = 'N';
              this.alert(
                'warning',
                'Ha Ocurrido un Error',
                'No se ha realizado el escaneo...'
              );
            }
            if (this.validateActCve()) {
              this.alert(
                'warning',
                'Ha Ocurrido un Error',
                'La Clave del Acta es inconsistente'
              );
            }
            if (new Date(this.proceedingDev[0].elaborationDate) != new Date()) {
              this.maximunClosingTimeService.getByTypeActa().subscribe({
                next: data => {
                  vtmp_max = data.data.maxTmp;
                  if (vtmp_max > 0) {
                  }
                  if (
                    new Date(this.proceedingDev[0].elaborationDate) < new Date()
                  ) {
                    this.alert(
                      'warning',
                      'Ha Ocurrido un Error',
                      'El Acta No Tiene Ningun Bien Asignado, No Se Puede Cerrar.'
                    );
                  }
                },
                error: err => {},
              });
              console.log(data);
            }

            if (data.data.length > 0) {
              if (
                new Date(this.proceedingDev[0].elaborationDate) != new Date()
              ) {
                this.maximunClosingTimeService.getByTypeActa().subscribe({
                  next: data => {
                    vtmp_max = data.data.maxTmp;
                    if (vtmp_max > 0) {
                    }
                  },
                  error: err => {},
                });
                console.log(data);
              } else {
              }
            } else {
              existe = 'N';
              this.alert(
                'warning',
                'Ha Ocurrido un Error',
                'La Clave del Acta o el Numero de Folio Universal, No Fueron Encontrados'
              );
            }
          },
          error: err => {
            console.log(err);
          },
        });
    }

    /*
                console.log('NO cagamos');
    }else{
      this.alert(
                    'warning',
                    'Ha Ocurrido un Error',
                    'La Clave del Acta o el Numero de Folio Universal, No Estan Registrados'
                    );
                console.log('cagamos');
    }*/
  }

  validateActCve() {
    this.proceedingDev[0].proceedingsCve;
    let vret = false;
    let number = this.proceedingDev[0].proceedingsCve.split('/');
    if (number.length == 8) {
      let vret = true;
      return vret;
    }
    console.log(number);
    return vret;
  }

  viewPictures(event: any) {
    if (!this.noBienReadOnly) {
      this.alert(
        'warning',
        'Se Requiere de una Búsqueda de Bien Primero para Poder ver está Opción',
        ''
      );
      return;
    }
    if (this._saveDataDepositary == true) {
      this.alert(
        'warning',
        'Se Requiere Guardar el Registro para Poder ver está Opción',
        ''
      );
      return;
    }
    console.log(event);
    if (this.depositaryAppointment.revocation == 'N') {
      if (this.actForm.get('scanningFoli').value) {
        ///
        // Continuar proceso para cargar imágenes
        this.getDocumentsByFolio(
          Number(this.depositaryAppointment.InvoiceUniversal),
          true
        );
      } else {
        this.alertInfo(
          'warning',
          'No Tiene Folio de Escaneo para Visualizar',
          ''
        );
      }
    } else {
      if (this.actForm.get('returnFoli').value) {
        ///
        // Continuar proceso para cargar imágenes
        this.getDocumentsByFolio(
          Number(this.depositaryAppointment.InvoiceReturn),
          false
        );
      } else {
        this.alertInfo(
          'warning',
          'No Tiene Folio de Escaneo para Visualizar',
          ''
        );
      }
    }
  }

  getDocumentsByFolio(folio: number, folioUniversal: boolean) {
    const title = 'Folios relacionados al Volante';
    const modalRef = this.openDocumentsModal(
      folio,
      folio,
      title,
      false,
      folioUniversal
    );
    modalRef.content.selected
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(document => this.getPicturesFromFolio(document));
  }
  getPicturesFromFolio(document: IDocuments) {
    console.log(document);
    let folio = document.id;
    // let folio = document.file.universalFolio;
    // if (document.id != this.depositaryAppointment.){
    //   folio = this.depositaryAppointment;
    // }
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
  openDocumentsModal(
    flyerNum: string | number,
    folioUniversal: number,
    title: string,
    wheel: boolean,
    folio: boolean
  ) {
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
        wheel,
        folio,
        folioUniversal: folioUniversal,
        wheelNumber: flyerNum,
        showConfirmButton: true,
      },
    };
    return this.modalService.show(
      ModalScanningFoilAppointmentTableComponent<IDocuments>,
      config
    );
  }
  validationAct() {
    console.log(this.proceedingDev[0].proceedingsCve);
    if (
      this.proceedingDev[0].proceedingsCve ==
      this.proceedingDev[0].proceedingsCve
    ) {
    }
    //if(this.actForm.value.){

    //}
  }
}
const EXAMPLE_DATA = [
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    importe: '1',
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    importe: '1',
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    importe: '1',
  },
  {
    noBien: 123,
    description: 'INMUEBLE UBICADO EN CALLE',
    cantidad: 1,
    importe: '1',
  },
];

const EXAMPLE_DATA2 = [
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    cantidad: 3,
    importe: 5,
  },
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    cantidad: 3,
    importe: 5,
  },
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    cantidad: 3,
    importe: 5,
  },
  {
    noBien: 543,
    description: 'INMUEBLE UBICADO EN LA CIUDAD',
    cantidad: 3,
    importe: 5,
  },
];
