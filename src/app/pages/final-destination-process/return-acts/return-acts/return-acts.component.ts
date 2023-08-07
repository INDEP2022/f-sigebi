import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  IPAAbrirActasPrograma,
  IPACambioStatus,
} from 'src/app/core/models/good-programming/good-programming';
import { IDepositaryAppointments_custom } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsForDictumService } from 'src/app/core/services/catalogs/documents-for-dictum.service';
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { HistoricalProcedureManagementService } from 'src/app/core/services/ms-procedure-management/historical-procedure-management.service';
import {
  DetailProceedingsDevolutionService,
  ProceedingsService,
} from 'src/app/core/services/ms-proceedings';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { RELATED_FOLIO_COLUMNS } from 'src/app/pages/administrative-processes/proceedings-conversion/proceedings-conversion-column';
import { ModalScanningFoilAppointmentTableComponent } from 'src/app/pages/juridical-processes/depositary/appointments/modal-scanning-foil/modal-scanning-foil.component';
import { GoodService } from './../../../../core/services/ms-good/good.service';
import { COLUMNS } from './columns';
import { GOODS_COLUMNS } from './goods-columns';
import { PROCEEDINGS_COLUMNS } from './proceedings-columns';

@Component({
  selector: 'app-return-acts',
  templateUrl: './return-acts.component.html',
  styleUrls: ['./return-acts.component.scss'],
})
export class FdpAddCReturnActsComponent extends BasePage implements OnInit {
  proceedingList: any[] = [
    { value: 'DEV', text: 'DEV' },
    { value: 'REST', text: 'REST' },
  ];
  response: boolean = false;
  data = new LocalDataSource();
  actForm: FormGroup;
  formTable1: FormGroup;
  formTable2: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  settingsDetailProceedings: any;
  settingsGoods: any;
  proceedingsColumns: any;
  fileNumber: number;
  flag: boolean = true;
  selectedProceedings: boolean;
  proceedingsData: any[] = [];
  proceedingsData2: any[] = [];
  detailProceedingsData: any[] = [];
  goodsData: any[] = [];
  dataResp: IProceedings;
  totalProceedings: number;
  totalGoods: number = 0;
  totalDetailProceedings: number;
  copyDataProceedings: any;
  quantityOfGoods: number;
  quantityDetailProceedings: number;
  // dataTable: any[] = [];
  proceedingsNumb: number;
  //paginacion
  firsTime: boolean = true;
  paginatorGoods: any = {};
  formadd: FormGroup = new FormGroup({});
  paginatorProceedings: any = {};
  paramsDetailProceedings = new BehaviorSubject<ListParams>(new ListParams());
  paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
  paramsProceedings = new BehaviorSubject<ListParams>(new ListParams());
  fechaActual: Date;
  fechaActualFormateada: string;
  cause: boolean = false;
  bcause: boolean = false;
  goodsList = new LocalDataSource();
  goodsListTable = new LocalDataSource();
  dataGood: any[] = [];
  dataGoodtable: any[] = [];
  selectedRow: any = null;
  deleteselectedRow: any;
  @ViewChild('mySmartTable') mySmartTable: any;
  invoiceDetailsForm: ModelForm<any>;
  formScan: FormGroup;
  disabled: boolean = true;
  _saveDataDepositary: boolean = false;
  depositaryAppointment: IDepositaryAppointments_custom;
  user: any;
  userdelegacion: any;
  userDepartament: any;
  userSubdelegacion: any;
  folioScan: any;
  reportParams: any;
  labelActa: string;
  btnCSSAct = 'btn-primary';
  saveDataAct: any[] = [];
  reopening = false;
  tipoActa: any;
  P_NO_TRAMITE: any;
  pass: boolean = false;
  nopass: boolean = false;
  delete: boolean = false;
  nodelete: boolean = false;
  sol: boolean = false;
  folioBoool: boolean = false;
  scanBool: boolean = false;
  expediente: any;
  open: boolean = false;
  actaopen: boolean = false;
  labela: boolean = false;
  expForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private proceedingsService: ProceedingsService,
    private detailProceedingsDevolutionService: DetailProceedingsDevolutionService,
    private goodService: GoodService,
    private expedientService: ExpedientService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService,
    private fractionsService: FractionsService,
    private documentsForDictumService: DocumentsForDictumService,
    private serviceProgrammingGood: ProgrammingGoodService,
    private activatedRoute: ActivatedRoute,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private historicalProcedureManagementService: HistoricalProcedureManagementService,
    private documentsService: DocumentsService
  ) {
    super();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.P_NO_TRAMITE = params['P_NO_TRAMITE']
          ? Number(params['P_NO_TRAMITE'])
          : null;
        this.fileNumber = params['expediente']
          ? Number(params['expediente'])
          : null;
        this.getBlkExp(this.fileNumber);
        this.getbyexpedient(this.fileNumber);
        this.folioScan = params['folio'] ? Number(params['folio']) : null;
      });
    this.settings = { ...this.settings };
    this.settings.selectMode = 'single';
    (this.settings.rowClassFunction = (row: any) => {
      if (row.isSelected) {
        return 'selected-row';
      }
      return '';
    }),
      (this.settings.columns = PROCEEDINGS_COLUMNS);
    this.settings.actions.delete = true;
    this.settingsDetailProceedings = { ...this.settings, actions: false };
    this.settingsDetailProceedings.columns = COLUMNS;
    this.settingsGoods = { ...this.settings, actions: false };
    this.settingsGoods.columns = GOODS_COLUMNS;
    this.proceedingsColumns = { ...this.settings, actions: false };
    this.proceedingsColumns.columns = this.proceedingsColumns;
  }

  ngOnInit(): void {
    this.initForm();
    this.initPaginatorGoods();
    this.initPaginatorDetailProceedings();
    this.fechaActual = new Date();
    this.formatoFechaActual();
    this.getuser();
    this.labelActa = 'Cerrar acta';
    this.btnCSSAct = 'btn-primary';
    console.log('P_NO_ ', this.P_NO_TRAMITE);
    if (this.folioScan != null) {
      let formparams = {
        scanningFoli: this.folioScan,
      };
      this.folioBoool = true;
      this.scanBool = true;
      this.formadd.patchValue(formparams);
    }
  }

  getGoods() {
    return this.goodService.getByExpedient(this.fileNumber, {
      text: '?expedient=',
      page: this.paginatorGoods.page,
      limit: this.paginatorGoods.limit,
    });
    // .subscribe(data => console.log(data));
  }

  search() {
    this.clear();
    this.fileNumber = this.expForm.get('expediente').value;
    console.log('prueba expe', this.fileNumber);
    //this.getInfo();
    this.getBlkExp(this.fileNumber);
    this.getbyexpedient(this.fileNumber);
  }

  handleError(error: HttpErrorResponse, msg: string) {
    if (error.status <= 404) {
      this.onLoadToast('info', 'Información', msg);
    }
  }

  getDetailProceedings(proceedingsNumb: number) {
    console.log(proceedingsNumb);
    return this.detailProceedingsDevolutionService.getDetailProceedingsDevolutionByProceedingsNumb(
      proceedingsNumb,
      this.paginatorGoods
    );
  }
  /*
  getInfo() {
    this.flag = false;
    this.firsTime = false;
    this.getProceedings(this.fileNumber)
      .pipe(
        catchError(err => {
          this.handleError(
            err,
            'No se han encontrado registros para este expediente'
          );
          return EMPTY;
        }),
        switchMap((proceedings: IListResponse<IProceedings>) =>
          this.getDetailProceedings(proceedings.data[0].id).pipe(
            catchError(err => {
              tap(resp => console.log(resp)),
                this.handleError(
                  err,
                  'No existen bienes asociados a esta acta'
                );
              return of(err);
            }),
            concatMap((detail: any) => {
              console.log(detail.data);
              return from(detail.data).pipe(
                concatMap((element: any) => {
                  console.log(element);
                  return this.goodService
                    .getFromGoodsAndExpedients({
                      goodNumber: Number(element?.numGoodId?.id),
                    })
                    .pipe(
                      map((status_description: any) => {
                        console.log('222222222: ', status_description);
                        return {
                          ...element,
                          di_status_good:
                            status_description.data[0].description,
                        };
                      })
                    );
                }),
                toArray()
              );
            }),
            // map((data: any) => {
            //   for (let good of data?.data) {
            //     this.goodService
            //       .getFromGoodsAndExpedients({
            //         goodNumber: Number(good.numGoodId.id),
            //       })
            //       .pipe(
            //         tap((data: any) => {
            //           good.di_status_good = data.data[0].description;
            //         })
            //       );
            //   }
            // }),
            concatMap((detailProceeding: any) =>
              this.getGoods().pipe(
                map((goods: any) => ({
                  proceedings,
                  detailProceeding,
                  goods,
                }))
              )
            )
          )
        )
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.firsTime = false;
          this.prepareData(data);
          this.totalProceedings = Number(data.proceedings.count);
          console.log(data?.detailProceeding?.length);
          this.totalDetailProceedings = Number(data.detailProceeding.length);
          this.totalGoods = Number(data.goods.count);
        },
        error: error => {
          console.log(error);
        },
      });
  }*/

  prepareData(data: {
    proceedings: IListResponse<IProceedings>;
    goods: any;
    detailProceeding: any;
  }) {
    console.log(data);
    this.proceedingsData = [];
    this.proceedingsData2 = [];
    let expedientInfo: any = {};
    this.dataResp = data.proceedings.data[0];
    expedientInfo.penaltyCause =
      data.proceedings.data[0].fileNumber.penaltyCause;
    expedientInfo.previewFind = data.proceedings.data[0].fileNumber.previewFind;
    this.actForm.patchValue(expedientInfo);
    this.prepareProceedingsData(data.proceedings);
    // this.proceedingsData = this.proceedingsData2;
    console.log(data);
    if (!data.goods?.hasOwnProperty('error')) {
      this.prepareGoodsData(data?.goods);
    }
    if (!data.detailProceeding?.hasOwnProperty('error')) {
      console.log(data.detailProceeding);
      this.prepareDetailProceedings(data?.detailProceeding);
    }
    // this.form.patchValue(this.dataForm);
    this.flag = true;
  }

  convertDate(date: Date) {
    return new Date(date).toLocaleDateString().toString();
  }

  prepareProceedingsData(data: IListResponse<IProceedings>) {
    let proceedingsTemp: any;
    this.copyDataProceedings = data.data;
    for (let proceedings of data.data) {
      proceedingsTemp = {
        proceeding: proceedings.id,
        receiptCve: proceedings.receiptCve,
        authorityOrder: proceedings.authorityOrder,
        proceedingsCve: proceedings.proceedingsCve,
        elaborationDate: this.convertDate(proceedings.elaborationDate),
        universalFolio: proceedings.universalFolio,
        witnessOne: proceedings.witnessOne,
        witnessTwo: proceedings.witnessTwo,
        beneficiaryOwner: proceedings.beneficiaryOwner,
        auditor: proceedings.auditor,
        observations: proceedings.observations,
      };
      console.log(proceedingsTemp.universalFolio);
      this.proceedingsData.push(proceedingsTemp);
    }
  }

  prepareGoodsData(data: IListResponse<IGood>) {
    console.log(data);
    this.quantityOfGoods = data.count;
    let goodsData: any[] = [];
    for (let good of data.data) {
      let data: any = {
        id: good.id,
        description: good.description,
        extDomProcess: good.extDomProcess,
        quantity: good.quantity,
        appraisedValue: good.appraisedValue,
      };
      goodsData.push(data);
    }
    this.goodsData = goodsData;
  }

  prepareDetailProceedings(detailProceedings: any) {
    console.log(detailProceedings);
    this.quantityDetailProceedings = detailProceedings?.count;
    let detailProceedingsData: any[] = [];
    console.log(detailProceedings);
    for (let detail of detailProceedings) {
      let data: any = {
        goodId: detail.good[0].id,
        description: detail.good[0].description,
        extDomProcess: detail.good[0].extDomProcess,
        quantity: detail.good[0].quantity,
        amountReturned: detail.amountReturned,
      };
      console.log(detailProceedingsData);
      detailProceedingsData.push(data);
    }
    this.detailProceedingsData = detailProceedingsData;
  }

  onSubmit() {}
  /*
  initPaginatorProceedings() {
    console.log('Inicio');
    this.paramsProceedings
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(data => {
        this.paginatorProceedings.page = data.page;
        this.paginatorProceedings.limit = data.limit;
        console.log(this.paginatorProceedings);
        console.log(`Init Paginator ${data.page} ${data.limit}`);
        if (!this.firsTime) {
          this.getProceedings(this.fileNumber).subscribe((data: any) => {
            this.prepareProceedingsData(data);
          });
        }
      });
  }*/

  initPaginatorDetailProceedings() {
    this.paramsDetailProceedings
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(data => {
        console.log(2);
        this.paginatorGoods.page = data.page;
        this.paginatorGoods.limit = data.limit;
        if (!this.firsTime) {
          console.log('XXXX');
          this.getDetailProceedings(this.proceedingsNumb).subscribe(
            (data: any) => {
              this.prepareGoodsData(data);
            }
          );
        }
      });
  }

  initPaginatorGoods() {
    this.paramsGoods.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      console.log(2);
      this.paginatorGoods.page = data.page;
      this.paginatorGoods.limit = data.limit;
      if (!this.firsTime) {
        console.log('XXXX');
        this.getGoods().subscribe((data: any) => {
          this.prepareGoodsData(data);
        });
      }
    });
  }

  settingsChange(event: any, op: number) {
    op === 1
      ? (this.settings = event)
      : (this.settingsDetailProceedings = event);
  }

  initForm() {
    this.expForm = this.fb.group({
      expediente: [null, [Validators.required]],
    });
    this.actForm = this.fb.group({
      previewFind: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      penaltyCause: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeexpe: [null, [Validators.required]],
      delito: [null, [Validators.required]],
      noExp: [null, [Validators.required]],
      //DELITO     FALTA
    });

    this.formTable1 = this.fb.group({
      detail: [null, []],
    });

    this.formTable2 = this.fb.group({
      detail: [null, []],
    });
    this.formadd = this.fb.group({
      preva: [null, [Validators.required]],
      record: [null, [Validators.required]],
      status: [null, [Validators.required]],
      entity: [null, [Validators.required]],
      admin: [null, [Validators.required]],
      folio: [null, [Validators.required]],
      year: [null],
      mes: [null],
      oficea: [null, [Validators.required]],
      autority: [null, [Validators.required]],
      nameEnt: [null],
      witness: [null],
      dateElab: [null, [Validators.required]],
      propben: [null, [Validators.required]],
      audit: [null],
      observations: [null],
      returnFoli: [null],
      estado: [null],
      scanningFoli: [null],
    });
    // this.formScan = this.fb.group({
    //   scanningFoli: [
    //     { value: '', disabled: false },
    //     [Validators.maxLength(15)],
    //   ],
    //   returnFoli: [
    //     { value: '', disabled: false },
    //     [Validators.maxLength(15)],
    //   ],
    // });
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

  formatoFechaActual() {
    const month = this.fechaActual.getMonth() + 1;
    const year = this.fechaActual.getFullYear();

    this.fechaActualFormateada = `${month.toString().padStart(2, '0')}/${year}`;
    console.log('fecha: ', this.fechaActualFormateada);

    let dataform = {
      year: this.fechaActualFormateada,
    };
    this.formadd.patchValue(dataform);
  }

  getBlkExp(id: number) {
    this.expedientService.getExpedienteById(id).subscribe({
      next: resp => {
        console.log('Respuesta: ', resp);
        if (resp.expedientType == 'T') {
          this.cause = true;
          console.log('es true!!!', this.cause);
        } else {
          this.cause = false;
          console.log('es false!!!');
        }
        if (resp.expedientType != 'T') {
          this.bcause = true;
        } else {
          this.bcause = false;
        }
        let dataform = {
          previewFind: resp.preliminaryInquiry,
          penaltyCause: resp.criminalCase,
          delito: resp.crimeKey + ' - ' + 'NO SE PUEDE MAPEAR LA DESCRIPCIÓN',
          typeexpe: resp.expedientType,
          noExp: resp.transferNumber,
        };
        console.log('Response: ', dataform);
        this.getGoodsTable(id);
        this.actForm.patchValue(dataform);
      },
    });
  }

  getGoodsTable(expediente: number): void {
    this.goodService
      .getByExpedient(expediente, this.params.getValue())
      .subscribe({
        next: response => {
          console.log(response);
          for (let i = 0; i < response.count; i++) {
            console.log('BIENES: ', response);
            if (response.data[i] != undefined) {
              let params = {
                goodNumber: response.data[i].goodId,
                fileNumber: this.fileNumber,
              };
              this.detailProceeDelRecService.getbyfile(params).subscribe({
                next: resp => {
                  console.log('Response File: ', resp);
                  this.actaopen = true;
                  let item: IGood = {
                    id: response.data[i].goodId,
                    description: response.data[i].description,
                    quantity: response.data[i].quantity,
                    extDomProcess: response.data[i].extDomProcess,
                    appraisedValue: response.data[i].appraisedValue,
                    status: response.data[i].status,
                    record: resp.data[0].cve_acta,
                  };
                  this.dataGood.push(item);
                  this.totalGoods = response.count;
                  this.loading = false;
                  this.goodsList.load(this.dataGood);
                  this.goodsList.refresh();
                },
                error: err => {
                  let item: IGood = {
                    id: response.data[i].goodId,
                    description: response.data[i].description,
                    quantity: response.data[i].quantity,
                    extDomProcess: response.data[i].extDomProcess,
                    appraisedValue: response.data[i].appraisedValue,
                    status: response.data[i].status,
                    record: null,
                  };
                  this.dataGood.push(item);
                  this.totalGoods = response.count;
                  this.loading = false;
                  this.goodsList.load(this.dataGood);
                  this.goodsList.refresh();
                },
              });
            }
          }
          this.totalGoods = response.count;
          this.loading = false;
          this.goodsList.load(this.dataGood);
          this.goodsList.refresh();
        },
        error: error => (this.loading = false),
      });
  }
  /*
  getProceedings(fileNumber: number) {
    this.selectedProceedings = false;
    return this.proceedingsService.getActByFileNumber(
      fileNumber,
      this.paginatorProceedings
    );
  }*/

  onRowSelect(event: any) {
    if (event.data.record != null) {
      this.selectedRow = event.data;
      console.log(this.selectedRow);
      this.pass = true;
      this.nopass = true;
    } else {
      this.alertInfo(
        'warning',
        'El Bien seleccionado no cuenta con una Acta.',
        ''
      );
      this.clearSelection();
    }
  }
  deleteRowSelect(event: any) {
    this.deleteselectedRow = event.data;
    this.delete = true;
    this.nodelete = true;
  }

  addSelect() {
    this.nopass = false;
    this.sol = true;
    this.dataGoodtable = this.dataGoodtable;
    if (this.selectedRow == null) {
      this.onLoadToast('error', 'Debe Seleccionar un Registro');
      return;
    } else {
      if (this.selectedRow.record != '' || this.selectedRow.record != null) {
        this.totalItems = 0;
        console.log('Acta: ', this.selectedRow.record);
        let dataForm = {
          goodId: this.selectedRow.id,
          description: this.selectedRow.description,
          extDomProcess: this.selectedRow.extDomProcess,
          quantity: this.selectedRow.quantity,
          amountReturned: this.selectedRow.appraisedValue,
          acta: this.selectedRow.record,
        };
        this.dataGoodtable.push(dataForm);
        this.loading = false;
        this.open = true;
        this.goodsListTable.load(this.dataGoodtable);
        this.countFacture();
        this.goodsListTable.refresh();
        this.clearSelection();
        this.nopass = false;
        this.sol = true;
      } else {
        this.alertInfo(
          'warning',
          'El Bien seleccionado no cuenta con una Acta.',
          ''
        );
      }
    }
  }
  countFacture() {
    this.totalItems = 0;
    for (let i = 0; i < this.dataGoodtable.length; i++) {
      this.totalItems++;
    }
  }

  clearSelection() {
    const selectedRows = this.mySmartTable.grid.getSelectedRows();
    selectedRows.forEach((row: any) => {
      row.isSelected = false;
    });
  }

  removeSelect() {
    this.nodelete = false;
    this.dataGoodtable = [];
    if (this.deleteselectedRow == null) {
      this.onLoadToast('error', 'Debe Seleccionar un Registro');
      return;
    } else {
      this.goodsListTable.remove(this.deleteselectedRow);
      this.goodsListTable.remove(this.dataGoodtable);
      this.totalItems = 0;
      this.clearSelection();
      this.countFacture();
      this.nodelete = false;
    }
  }

  initSolicitud() {
    if (
      this.formadd.get('status').value != 'CERRADA' &&
      this.formadd.get('status').value != null
    ) {
      if (this.formadd.get('oficea').value != null) {
        if (this.formadd.get('scanningFoli').value == null) {
          this.alertQuestion(
            'info',
            'Se Generará un Nuevo Folio de Escaneo para el Acta Abierta. ¿Deseas continuar?',
            '',
            'Aceptar',
            'Cancelar'
          ).then(res => {
            console.log(res);
            if (res.isConfirmed) {
              this.notificationService
                .getByFileNumber(this.fileNumber)
                .subscribe({
                  next: resp => {
                    console.log('Respuesta primer: ', resp);
                    let params = {
                      fileNumber: this.fileNumber,
                      actKey: this.formadd.get('oficea').value,
                      delegationNumber: this.userdelegacion,
                      subDelegationNumber: this.userSubdelegacion,
                      departmentNumber: this.userDepartament,
                      flyerNumber: resp.data[0].max,
                    };
                    this.documentsForDictumService
                      .postDocuemntFolio(params)
                      .subscribe({
                        next: response => {
                          this.folioScan = response.data[0].folio_universal;
                          let formparams = {
                            scanningFoli: response.data[0].folio_universal,
                          };
                          console.log('scanningFoli: ', formparams);
                          this.folioBoool = true;
                          this.formadd.patchValue(formparams);
                          this.getReport();
                        },
                      });
                  },
                });
            }
          });
        } else {
          this.alertInfo('warning', 'El Acta ya Tiene Folio de Escaneo.', '');
        }
      }
    }
  }

  getuser() {
    let token = this.authService.decodeToken();
    this.user = token.name.toUpperCase();
    let userDepartament = token.department.toUpperCase();
    this.getdepartament(userDepartament);
    console.log('User: ', token);
  }

  getdepartament(id: number | string) {
    this.fractionsService.getDepartament(id).subscribe({
      next: response => {
        this.userDepartament = response.data[0].id;
        this.userdelegacion = response.data[0].numDelegation;
        this.userSubdelegacion = response.data[0].numSubDelegation.id;
      },
    });
  }

  getReport() {
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
    this.scanBool = true;
    if (this.formadd.get('scanningFoli').value != null) {
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
              expedientNumber: this.fileNumber,
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
  validarStatusActa() {
    let statusacta = this.formadd.get('estado').value;
    console.log('estatus: ', statusacta);
    if (statusacta == 'CERRADA' || statusacta == 'CERRADO') {
      this.openactas();
      console.log('Entra a Cerrada');
    }
    if (statusacta == 'ABIERTA' || statusacta == 'ABIERTO') {
      this.PupCierreActa();
      console.log('Entra a Abierta');
    }
  }
  //PUP_MOVIMIENTO_ACTA
  openactas() {
    let statusacta = this.formadd.get('estado').value;
    if ((statusacta = 'CERRADA')) {
      this.alertQuestion(
        'info',
        'Está Seguro de Abrir el Acta?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          let acta = 'S';
          let cve_acta = this.formadd.get('oficea').value;
          this.tipoActa = 'DEVOLU';
          //PUP BUSCA ACTA
          if (cve_acta.substr(0, 5) === 'RESAR') {
            this.tipoActa = 'RESAR';
          } else {
            this.tipoActa = 'DEVOLU';
          }
          const lv_TIP_ACTA = `RF,${this.tipoActa}`;
          //OPEN PROCEEDING
          const modelPaOpen: IPAAbrirActasPrograma = {
            P_NOACTA: this.formadd.get('record').value,
            P_AREATRA: lv_TIP_ACTA,
            P_PANTALLA: 'FACTREFACTADEVOLU',
            P_TIPOMOV: 2,
            USUARIO:
              localStorage.getItem('username') == 'sigebiadmon'
                ? localStorage.getItem('username')
                : localStorage.getItem('username').toLocaleUpperCase(),
          };
          console.log(modelPaOpen);
          this.serviceProgrammingGood
            .paOpenProceedingProgam(modelPaOpen)
            .subscribe(
              resp => {
                const paramsF = new FilterParams();
                let VAL_MOVIMIENTO = 0;
                paramsF.addFilter(
                  'valUser',
                  localStorage.getItem('username') == 'sigebiadmon'
                    ? localStorage.getItem('username')
                    : localStorage.getItem('username').toLocaleUpperCase()
                );
                this.serviceProgrammingGood
                  .getTmpProgValidation(paramsF.getParams())
                  .subscribe(
                    res => {
                      console.log(res);
                      VAL_MOVIMIENTO = res.data[0]['valmovement'];
                      if (VAL_MOVIMIENTO == 1) {
                        this.serviceProgrammingGood
                          .paRegresaEstAnterior(modelPaOpen)
                          .subscribe(
                            res => {
                              this.labelActa = 'Cerrar acta';
                              this.btnCSSAct = 'btn-primary';
                              this.formadd.get('estado').setValue('ABIERTA');
                              this.reopening = true;
                              this.saveDataAct = [];
                              this.alert(
                                'success',
                                'Acta Abierta',
                                `El Acta ${
                                  this.formadd.get('acta').value
                                } Fue Abierta`
                              );
                              this.loading = false;
                            },
                            err => {
                              this.loading = false;
                              console.log(err);
                              this.alert(
                                'error',
                                'No se pudo abrir el acta',
                                'Ocurrió un error que no permite abrir el acta'
                              );
                            }
                          );
                      }
                    },
                    err => {
                      this.loading = false;
                      console.log(err);
                      VAL_MOVIMIENTO = 0;
                      this.alert(
                        'error',
                        'No se Pudo Abrir el Acta',
                        'Ocurrió un Error que no Permite Abrir el Acta'
                      );
                    }
                  );
              },
              err => {
                console.log(err);
                this.alert(
                  'error',
                  'No se Pudo Abrir el Acta',
                  err.error.message
                );
                this.loading = false;
              }
            );
        }
      });
    } else {
      let acta = 'N';
      //
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${month}/${year}`;
  }

  validarCVE_ACTA() {
    const cveActaValue = this.formadd.get('oficea').value;
    const words = cveActaValue.split('/');
    return words.length >= 8;
  }

  PupCierreActa() {
    let cve_acta = this.formadd.get('oficea').value;
    this.tipoActa = 'DEVOLU';
    //PUP BUSCA ACTA
    if (cve_acta.substr(0, 5) === 'RESAR') {
      this.tipoActa = 'RESAR';
    } else {
      this.tipoActa = 'DEVOLU';
    }
    console.log('entra 1');
    let fecElabora = this.formadd.get('dateElab').value;
    let fecActual = this.formadd.get('year').value;
    const Capture = fecElabora ? new Date(fecElabora) : null;
    const formattedfecCapture = this.formatDate(Capture);
    if (formattedfecCapture != fecActual) {
      let tipo = true;
      //this.tipoActa == 'RESAR'
      if (tipo) {
        console.log('entra RESAR');
        for (let i = 0; i < this.dataGoodtable.length; i++) {
          console.log('good: ', this.dataGoodtable[i]);
          if (this.dataGoodtable[i].goodId != null) {
            if (this.formadd.get('estado').value) {
              if (this.validarCVE_ACTA()) {
                const model: IPACambioStatus = {
                  P_NOACTA: this.formadd.get('record').value,
                  P_PANTALLA: 'FACTREFACTADEVOLU',
                  P_FECHA_RE_FIS: new Date(),
                  P_TIPO_ACTA: this.tipoActa,
                  USUARIO:
                    localStorage.getItem('username') == 'sigebiadmon'
                      ? localStorage.getItem('username')
                      : localStorage.getItem('username').toLocaleUpperCase(),
                };
                console.log('entra validar acta');
                this.serviceProgrammingGood.paChangeStatus(model).subscribe({
                  next: resp => {
                    console.log('PaChangeStatus: ', resp);
                    if (this.P_NO_TRAMITE == null || this.P_NO_TRAMITE == '') {
                      this.P_NO_TRAMITE = null;
                    } else {
                      this.P_NO_TRAMITE = this.P_NO_TRAMITE;
                    }
                    const params = {
                      procedureNumber: this.P_NO_TRAMITE,
                      proceedingsNumber: this.fileNumber,
                    };
                    console.log('Antes de consumir el update');
                    this.historicalProcedureManagementService
                      .updateStatus(params)
                      .subscribe({
                        next: responses => {
                          console.log('response Update: ', responses);
                          let id = this.formadd.get('record').value;
                          this.formadd.reset();
                          console.log('Antes de consumir el procedingbyId', id);
                          this.detailProceeDelRecService
                            .getProcedingbyId(id)
                            .subscribe({
                              next: respon => {
                                const Capture = respon.data[0].elaborationDate
                                  ? new Date(respon.data[0].elaborationDate)
                                  : null;
                                const formattedfecCapture =
                                  this.formatDate2(Capture);
                                let formParams = {
                                  record: respon.data[0].id,
                                  status: respon.data[0].proceedingsType,
                                  entity: respon.data[0].transferNumber.key,
                                  admin: respon.data[0].id,
                                  folio: respon.data[0].universalFolio,
                                  dateElab: formattedfecCapture,
                                  propben: respon.data[0].beneficiaryOwner,
                                  audit: respon.data[0].auditor,
                                  observations: respon.data[0].observations,
                                  estado: respon.data[0].proceedingStatus,
                                  oficea: respon.data[0].proceedingsCve,
                                  autority: respon.data[0].authorityOrder,
                                  nameEnt: respon.data[0].witnessOne,
                                  witness: respon.data[0].witnessTwo,
                                };
                                this.formadd.patchValue(formParams);
                                let estado = this.formadd.get('estado').value;
                                if ((estado = 'CERRADO' || 'CERRADA')) {
                                  this.labelActa = 'Abrir Acta';
                                  this.alert(
                                    'error',
                                    'El Acta ha Sido Cerrada.',
                                    ''
                                  );
                                }
                              },
                            });
                        },
                      });
                  },
                });
              } else {
                this.alert('error', 'La Clave del Acta es Inconsistente.', '');
              }
            } else {
              this.alert('error', 'El Acta ya Esta Cerrada.', '');
            }
          } else {
            this.alert(
              'error',
              'El Acta no Tiene Ningun  Bien Asignado, no se Puede Cerrar',
              ''
            );
          }
        }
      }
    }
  }
  formatDate2(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  getbyexpedient(id: number | string) {
    this.detailProceeDelRecService.getByExpedient(id).subscribe({
      next: resp => {
        console.log('Respuesta: ', resp);
        const Capture = resp.data[0].elaborationDate
          ? new Date(resp.data[0].elaborationDate)
          : null;
        const formattedfecCapture = this.formatDate2(Capture);
        this.labela = false;
        if (
          resp.data[0].proceedingStatus == 'CERRADA' ||
          resp.data[0].proceedingStatus == 'CERRADO'
        ) {
          this.labelActa = 'Abrir Acta';
          this.labela = true;
        }
        if (
          resp.data[0].proceedingStatus == 'ABIERTA' ||
          resp.data[0].proceedingStatus == 'ABIERTA'
        ) {
          this.labelActa = 'Cerrar Acta';
          this.labela = true;
        }
        let formParams = {
          record: resp.data[0].id,
          status: resp.data[0].proceedingsType,
          entity: resp.data[0].transferNumber.key,
          admin: resp.data[0].id,
          folio: resp.data[0].universalFolio,
          dateElab: formattedfecCapture,
          propben: resp.data[0].beneficiaryOwner,
          audit: resp.data[0].auditor,
          observations: resp.data[0].observations,
          estado: resp.data[0].proceedingStatus,
          oficea: resp.data[0].proceedingsCve,
          autority: resp.data[0].authorityOrder,
          nameEnt: resp.data[0].witnessOne,
          witness: resp.data[0].witnessTwo,
        };
        this.formadd.patchValue(formParams);
        this.actaopen = true;
      },
      error: err => {
        this.actaopen = false;
      },
    });
  }

  viewscan() {
    this.getReportViewActa();
  }

  getReportViewActa() {
    let params = {
      PN_FOLIO: this.folioScan,
    };
    if (this.params != null) {
      this.siabService.fetchReport('blank', params).subscribe({
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

  openview() {
    let folio = this.formadd.get('scanningFoli').value;
    this.getDocumentsByFolio(Number(folio), true);
  }

  getPicturesFromFolio(document: IDocuments) {
    console.log(document);
    let folio = this.formadd.get('scanningFoli').value;
    // let folio = document.file.universalFolio;
    // if (document.id != this.depositaryAppointment.){
    //   folio = this.depositaryAppointment;
    // }
    if (true) {
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

  clear() {
    this.folioScan = null;
    this.actForm.reset();
    this.formadd.reset();
    this.formTable1.reset();
    this.formTable2.reset();
    this.goodsListTable.load([]);
    this.goodsListTable.refresh();
    this.goodsList.load([]);
    this.goodsList.refresh();
    this.open = false;
    this.totalGoods = 0;
    this.totalItems = 0;
    this.labela = false;
  }
}
