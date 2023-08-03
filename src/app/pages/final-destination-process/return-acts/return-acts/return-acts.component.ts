import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IPAAbrirActasPrograma } from 'src/app/core/models/good-programming/good-programming';
import { IDepositaryAppointments_custom } from 'src/app/core/models/ms-depositary/ms-depositary.interface';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsForDictumService } from 'src/app/core/services/catalogs/documents-for-dictum.service';
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import {
  DetailProceedingsDevolutionService,
  ProceedingsService,
} from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
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
    private serviceProgrammingGood: ProgrammingGoodService
  ) {
    super();

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
  }

  getGoods() {
    return this.goodService.getByExpedient(this.fileNumber, {
      text: '?expedient=',
      page: this.paginatorGoods.page,
      limit: this.paginatorGoods.limit,
    });
    // .subscribe(data => console.log(data));
  }

  search(term: string | number) {
    this.fileNumber = Number(term);
    //this.getInfo();
    this.getBlkExp(this.fileNumber);
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
              let item: IGood = {
                id: response.data[i].goodId,
                description: response.data[i].description,
                quantity: response.data[i].quantity,
                extDomProcess: response.data[i].extDomProcess,
                appraisedValue: response.data[i].appraisedValue,
                status: response.data[i].status,
              };
              this.dataGood.push(item);
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
    this.selectedRow = event.data;
    console.log(this.selectedRow);
  }
  deleteRowSelect(event: any) {
    this.deleteselectedRow = event.data;
  }

  addSelect() {
    this.dataGoodtable = this.dataGoodtable;
    if (this.selectedRow == null) {
      this.onLoadToast('error', 'Debe seleccionar un registro');
      return;
    } else {
      this.totalItems = 0;
      let dataForm = {
        goodId: this.selectedRow.id,
        description: this.selectedRow.description,
        extDomProcess: this.selectedRow.extDomProcess,
        quantity: this.selectedRow.quantity,
      };
      this.dataGoodtable.push(dataForm);
      this.loading = false;
      this.goodsListTable.load(this.dataGoodtable);
      this.goodsListTable.refresh();
      this.clearSelection();
      this.countFacture();
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
    this.dataGoodtable = [];
    if (this.deleteselectedRow == null) {
      this.onLoadToast('error', 'Debe seleccionar un registro');
      return;
    } else {
      this.goodsListTable.remove(this.deleteselectedRow);
      this.goodsListTable.remove(this.dataGoodtable);
      this.totalItems = 0;
      this.clearSelection();
      this.countFacture();
      this.goodsListTable.load([]);
    }
  }

  initSolicitud() {
    if (
      this.formadd.get('status').value != 'CERRADA' &&
      this.formadd.get('status').value != null
    ) {
      if (this.formadd.get('oficea').value != null) {
        if (this.formadd.get('scanningFoli').value != null) {
          this.alertQuestion(
            'info',
            'Se generará un nuevo folio de escaneo para el acta abierta. ¿Deseas continuar?',
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
                      flyerNumber: resp.data.max,
                    };
                    this.documentsForDictumService
                      .postDocuemntFolio(params)
                      .subscribe({
                        next: response => {
                          this.folioScan = response.data[0].folio_universal;
                          let formparams = {
                            scanningFoli: response.data[0].folio_universal,
                          };
                          this.actForm.patchValue(formparams);
                          this.getReport();
                        },
                      });
                  },
                });
            }
          });
        } else {
          this.alertInfo('warning', 'El acta ya tiene folio de escaneo.', '');
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
      PN_FOLIO: this.folioScan,
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
    if (this.invoiceDetailsForm.get('scanFolio').value != null) {
      this.alertQuestion(
        'info',
        'Se abrirá la pantalla de escaneo para el folio de Escaneo del Dictamen. ¿Deseas continuar?',
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
        'No tiene Folio de Escaneo para continuar a la pantalla de Escaneo',
        ''
      );
    }
  }

  //PUP_MOVIMIENTO_ACTA
  closeopenactas() {
    let statusacta = this.formadd.get('estado').value;
    if ((statusacta = 'CERRADA')) {
      this.alertQuestion(
        'info',
        'Está seguro de abrir el Acta?',
        '',
        'Aceptar',
        'Cancelar'
      ).then(res => {
        console.log(res);
        if (res.isConfirmed) {
          let acta = 'S';
          let cve_acta = 'NA/PGR/6/DAB/DAB/0085/00/02';
          let tipoActa = 'DEVOLU';
          //PUP BUSCA ACTA
          if (cve_acta.substr(0, 5) === 'RESAR') {
            tipoActa = 'RESAR';
          } else {
            tipoActa = 'DEVOLU';
          }
          const lv_TIP_ACTA = `RF,${tipoActa}`;
          //OPEN PROCEEDING
          const modelPaOpen: IPAAbrirActasPrograma = {
            P_NOACTA: this.formadd.get('acta').value,
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
                                'Acta abierta',
                                `El acta ${
                                  this.formadd.get('acta').value
                                } fue abierta`
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
                        'No se pudo abrir el acta',
                        'Ocurrió un error que no permite abrir el acta'
                      );
                    }
                  );
              },
              err => {
                console.log(err);
                this.alert(
                  'error',
                  'No se pudo abrir el acta',
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

  viewPictures() {}
}
