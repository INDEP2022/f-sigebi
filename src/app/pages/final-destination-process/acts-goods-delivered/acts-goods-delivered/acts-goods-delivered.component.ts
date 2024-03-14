import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import * as saveAs from 'file-saver';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ICountDelivery } from 'src/app/core/interfaces/list-response.interface';
import { TokenInfoModel } from 'src/app/core/models/authentication/token-info.model';
import { IDelegation } from 'src/app/core/models/catalogs/delegation.model';
import {
  IBienActRecept,
  IBienErrorSave,
  ITransferente,
} from 'src/app/core/models/catalogs/transferente.model';
import { IAcceptGoodStatusScreen } from 'src/app/core/models/ms-good/good';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsForDictumService } from 'src/app/core/services/catalogs/documents-for-dictum.service';
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodProcessService } from 'src/app/core/services/ms-good/good-process.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { RNomenclaService } from 'src/app/core/services/ms-parametergood/r-nomencla.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { COLUMNS } from './columns';
import { DelegationsComponent } from './delegations/delegations.component';
import { GoodsErrorsComponent } from './goods-errors/goods-errors.component';
import { SearchActsComponent } from './search-acts/search-acts.component';
import { ActasConvertionCommunicationService } from './services/services';
import { TransferentsComponent } from './transferents/transferents.component';

@Component({
  selector: 'app-acts-goods-delivered',
  templateUrl: './acts-goods-delivered.component.html',
  styles: [],
})
export class ActsGoodsDeliveredComponent extends BasePage implements OnInit {
  response: boolean = false;
  form: FormGroup;
  formAct: FormGroup;
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: any = [];
  datatable: any[] = [];
  dataTableGoods = new LocalDataSource();
  dataTableGoodsCargada = new LocalDataSource();
  statusRecord: string = 'Activo';
  formattedfecclose: any;
  formattedfecCapture: any;
  close: boolean = false;
  fileNumber: any;
  user: any;
  userSubdelegacion: any;
  userdelegacion: any;
  userDepartament: any;
  keyActa: any;
  folioScan: any;
  V_NTRANSF: any;
  ESTATUS: any;
  V_ACTAEXIST: any;
  statusFile: any;
  LNU_NO_EXPEDIENTE: any;
  count: number;
  VESTATUS: any;
  goods: boolean = false;
  fool: boolean = false;
  scan: boolean = false;
  closeActa: boolean = true;
  yData: boolean = false;
  cveActa: any;
  acta: any;
  idActa: any;
  statusScan: boolean = false;

  actaCerrada: boolean = false;
  btnSave: boolean = false;
  actaDefault: any = null;
  dataUser: TokenInfoModel;
  dataExpediente: any;
  newAct: boolean = true;
  @ViewChild('file') fileInput: ElementRef;
  transferentes = new DefaultSelect<ITransferente>();
  jsonToTXT: any[] = ['BIEN', '421146', '234123', '57432'];
  btnLoadingTXT: boolean = false;
  transferenteSelected: ITransferente;
  delegationSelected: IDelegation;
  columnFilters: any[] = [];
  valPaginator: boolean = false;
  loadingBtn: boolean = false;
  tooltip: string = 'Ir a tabla de Bienes Cargados';
  valTableNgIf: boolean = false;
  constructor(
    private fb: FormBuilder,
    private detailProceeDelRecService: DetailProceeDelRecService,
    private excelService: ExcelService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private fractionsService: FractionsService,
    private documentsForDictumService: DocumentsForDictumService,
    private siabService: SiabService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private router: Router,
    private expedientService: ExpedientService,
    private screenStatusService: ScreenStatusService,
    private activatedRoute: ActivatedRoute,
    private actasConvertionCommunicationService: ActasConvertionCommunicationService,
    private datePipe: DatePipe,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private parametersService: ParametersService,
    private rNomenclaService: RNomenclaService,
    private goodService: GoodService,
    private goodProcessService: GoodProcessService,
    private documentsService: DocumentsService,
    private transferenteService: TransferenteService,
    private serviceDetailProc: DetailProceeDelRecService
  ) {
    super();

    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        add: false,
        edit: false,
        delete: true,
      },
      delete: {
        deleteButtonContent:
          '<i class="fa fa-trash text-danger mx-2 pl-4"></i>',
        confirmDelete: true,
      },
    };
    this.settings.columns = COLUMNS;
    this.settings.rowClassFunction = (row: { data: { color: any } }) =>
      row.data.color != null
        ? row.data.color === 'S'
          ? 'bg-success text-white'
          : 'bg-dark text-white'
        : '';
  }

  ngOnInit(): void {
    this.dataUser = this.authService.decodeToken();
    this.initForm();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        console.log(params);
        const folio = params['folio'] ? Number(params['folio']) : null;
        this.folioScan = folio;
        // this.cveActa =
        let id = params['cveActa'] ? Number(params['cveActa']) : null;

        if (this.folioScan) this.goBackScanning(id, folio);
      });

    this.getdepartament(this.dataUser.department);
    this.getEtapa();
    console.log(this.dataUser);
  }

  stagecreated: any = null;
  getEtapa() {
    this.parametersService
      .getPhaseEdo(`date=${format(new Date(), 'yyyy-MM-dd')}`)
      .subscribe(
        (res: any) => {
          this.stagecreated = !res.stagecreated ? 2 : res.stagecreated;
        },
        err => {
          this.stagecreated = 2;
        }
      );
  }

  initForm() {
    this.formAct = this.fb.group({
      cveRecord: [null],
      noTransfer: [null],
      noExpedient: [null],
      statusRecord: [null],
      datePhysicalReception: [null],
      dateCapture: [null],
      observations: [null],
      idTipoAct: [null],
    });
    this.form = this.fb.group({
      scanningFoli: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  settingsChange(event: any) {
    this.settings = event;
  }

  statusActa() {
    if (this.folioScan != null) {
      this.documentsForDictumService.getByFolio(this.folioScan).subscribe({
        next: response => {
          console.log('Response By Folio ', response);
          let statusFile = response.data[0].scanStatus;
          this.LNU_NO_EXPEDIENTE = response.data[0].numberProceedings;
          if (statusFile == 'ESCANEADO') {
            this.statusScan = true;
          } else {
            this.statusScan = false;
          }
        },
      });
    }
  }

  getuser() {
    let token = this.authService.decodeToken();
    this.user = token.name.toUpperCase();
    let userDepartament = token.department.toUpperCase();
    this.getdepartament(userDepartament);
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

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.data = this.excelService.getData<any>(binaryExcel);
      console.log('Excel data: ', this.data);
      for (let i = 0; i < this.data.length; i++) {
        console.log('this.data[i].BIENES ', this.data[i].BIENES);
        if (this.data[i] != undefined) {
          this.detailProceeDelRecService
            .getProceedingByNoGood(this.data[i].BIENES)
            .subscribe({
              next: response => {
                console.log('response: ', response);
                let V_NOEXPED = response.data[0].good.fileNumber;
                let paramsTrasfer = {
                  v_noexped: V_NOEXPED,
                  no_transferente: this.formAct.get('noTransfer').value,
                };
                this.expedientService.postExpedient(paramsTrasfer).subscribe({
                  next: resp => {
                    console.log('Transfer ', resp);
                    this.V_NTRANSF = resp.data[0].no_transferente;
                    let params = {
                      color: 'S',
                      goodNumb: response.data[0].good.id,
                      description: response.data[0].good.description,
                      quantity: response.data[0].good.quantity,
                      process: response.data[0].good.extDomProcess,
                      status: response.data[0].good.status,
                    };
                    let paramsstatus = {
                      curForm: 'FACTREFACTAENTEST',
                      no_bien: this.data[i].BIENES,
                    };
                    let good = this.data[i].BIENES;
                    // this.postStatus(paramsstatus, params, good);
                  },
                  error: err => {
                    this.V_NTRANSF = null;
                    let params = {
                      color: 'N',
                      goodNumb: response.data[0].good.id,
                      description: response.data[0].good.description,
                      quantity: response.data[0].good.quantity,
                      process: response.data[0].good.extDomProcess,
                      status: response.data[0].good.status,
                    };
                    let paramsstatus = {
                      curForm: 'FACTREFACTAENTEST',
                      no_bien: this.data[i].BIENES,
                    };
                    let good = this.data[i].BIENES;
                    // this.postStatus(paramsstatus, params, good);
                  },
                });
                this.totalItems = response.data.length;
                // if (this.V_NTRANSF != null && this.V_ACTAEXIST != 0) {
                //   let params = {
                //     color: 'S',
                //     goodNumb: response.data[0].good.id,
                //     description: response.data[0].good.description,
                //     quantity: response.data[0].good.quantity,
                //     process: response.data[0].good.extDomProcess,
                //     status: response.data[0].good.status,
                //   }
                //   this.totalItems = response.data.length;
                //   this.datatable.push(params);
                //   this.dataTableGoods.load(this.datatable);
                // } else {
                //   let params = {
                //     color: 'N',
                //     goodNumb: response.data[0].good.id,
                //     description: response.data[0].good.description,
                //     quantity: response.data[0].good.quantity,
                //     process: response.data[0].good.extDomProcess,
                //     status: response.data[0].good.status,
                //   }
                //   this.totalItems = response.data.length;
                //   this.datatable.push(params);
                //   this.dataTableGoods.load(this.datatable);
                // }}
              },
            });
        }
      }
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un Error al Leer el Archivo', 'Error');
    }
  }

  initSolicitud() {
    const { statusRecord, noExpedient, cveRecord } = this.formAct.value;
    const { scanningFoli } = this.form.value;
    if (statusRecord != 'CERRADA' && statusRecord) {
      if (!scanningFoli) {
        this.alertQuestion(
          'question',
          'Se generará un nuevo folio de escaneo para el Acta abierta',
          '¿Deseas continuar?'
        ).then(res => {
          if (res.isConfirmed) {
            this.notificationService.getByFileNumber(noExpedient).subscribe({
              next: resp => {
                let params = {
                  no_expediente: noExpedient,
                  cve_acta: cveRecord,
                  no_delegacion: this.userdelegacion,
                  no_subdelegacion: this.userSubdelegacion,
                  no_departamento: this.userDepartament,
                  lnu_no_volante: resp.data[0].max,
                  user: this.dataUser.preferred_username,
                };
                this.saveFolioUniversal(params);
              },
              error: err => {
                this.alert(
                  'error',
                  'Ocurrió un error al obtenere el Número de Volante',
                  ''
                );
              },
            });
          }
        });
      } else {
        this.alert('warning', 'El Acta ya tiene folio de escaneo.', '');
      }
    } else if (statusRecord == null) {
      this.alert('warning', 'Primero debe guardar el Acta', '');
    } else {
      this.alert(
        'warning',
        'No se puede generar el folio de escaneo en un acta ya cerrada',
        ''
      );
    }
  }

  saveFolioUniversal(params: any) {
    this.documentsForDictumService.postDocuemnt(params).subscribe({
      next: response => {
        console.log('Response: ', response);
        this.form.patchValue({
          scanningFoli: response.data[0].folio_universal,
        });
        this.actualizarActa(true);
        this.getReport();
      },
      error: err => {
        this.alert('warning', 'No se pudo generar el Folio de Escaneo', '');
      },
    });
  }
  getReport() {
    const { scanningFoli } = this.form.value;
    if (!scanningFoli) {
      return this.alert(
        'warning',
        'No tiene folio de escaneo para imprimir',
        ''
      );
    }

    let params = {
      pn_folio: scanningFoli,
    };
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

  openScannerPage() {
    const { scanningFoli } = this.form.value;
    const { statusRecord, cveRecord } = this.formAct.value;
    this.folioScan = scanningFoli;
    if ((statusRecord != 'CERRADA' && statusRecord != null) || !cveRecord) {
      if (scanningFoli) {
        this.alertQuestion(
          'question',
          'Se abrirá la pantalla de escaneo para el folio de escaneo del Acta abierta',
          '¿Deseas continuar?'
        ).then(res => {
          if (res.isConfirmed) {
            this.router.navigate([`/pages/general-processes/scan-documents`], {
              queryParams: {
                origin: 'FACTREFACTAENTEST',
                folio: this.folioScan,
                cveActa: this.actaDefault.id,
              },
            });
          }
        });
      } else {
        this.alert('warning', 'No existe folio de escaneo a escanear', '');
      }
    } else {
      this.alert(
        'warning',
        'No se puede escanear para un Acta que no esté abierta',
        ''
      );
    }
  }

  openScannerPageView() {
    const { scanningFoli } = this.form.value;
    const { cveRecord } = this.form.value;
    if (!scanningFoli) {
      return this.alert(
        'warning',
        'No tiene folio de escaneo para visualizar',
        ''
      );
    }
    this.folioScan = scanningFoli;
    if (scanningFoli) {
      this.documentsForDictumService.getByFolio(scanningFoli).subscribe({
        next: response => {
          if (response.data[0].scanStatus == 'ESCANEADO') {
            this.alertQuestion(
              'question',
              'Se abrirá la pantalla de escaneo para visualizar las imágenes',
              '¿Deseas continuar?'
            ).then(res => {
              if (res.isConfirmed) {
                this.router.navigate(
                  [`/pages/general-processes/scan-documents`],
                  {
                    queryParams: {
                      origin: 'FACTREFACTAENTEST',
                      folio: this.folioScan,
                      cveActa: this.actaDefault.id,
                    },
                  }
                );
              }
            });
          } else {
            this.alert('warning', 'El Folio no se encuentra escaneado', '');
          }
        },
        error: err => {
          this.alert('warning', 'El Folio no existe', '');
        },
      });
    } else {
      this.alert(
        'warning',
        'No Tiene Folio de Escaneo para Continuar a la Pantalla de Escaneo',
        ''
      );
    }
  }

  getclose() {}

  closeAct() {
    const { statusRecord } = this.formAct.value;
    if (!statusRecord) {
      this.alert(
        'warning',
        'Primero deberá guardar el Acta para continuar',
        ''
      );
    } else if (statusRecord == 'ABIERTA') {
      console.log('data table ', this.datatable);
      // PUP_CIERRE_ACTA
      this.alertQuestion(
        'question',
        'Se cerrará el Acta',
        '¿Deseas continuar?'
      ).then(question => {
        if (question.isConfirmed) {
          this.pupCierreActa();
          // this.documentsForDictumService.getByFolio(this.folioScan).subscribe({
          //   next: response => {
          //     console.log('Response By Folio ', response);
          //     this.statusFile = response.data[0].scanStatus;
          //     this.LNU_NO_EXPEDIENTE = response.data[0].numberProceedings;
          //     if (this.statusFile == 'ESCANEADO') {
          //       console.log('entra a scaneado');
          //       this.closeAct();
          //     }
          //   },
          // });
        }
      });
    } else {
      this.alertInfo('warning', 'El Acta se encuentra cerrada', '');
    }
  }

  async pupCierreActa() {
    const { statusRecord } = this.formAct.value;
    const { scanningFoli } = this.form.value;
    const data: any[] = await this.dataTableGoods.getAll();
    if (data.length == 0) {
      return this.alert(
        'warning',
        'El Acta no contiene bienes',
        'No se podrá cerrar'
      );
    }
    if (!scanningFoli) {
      return this.alert('warning', 'Debe introducir el valor del folio', '');
    }
    let resValScanningFol = await this.getValScaningFolio(scanningFoli);
    if (!resValScanningFol) {
      return this.alert('warning', 'No se ha realizado el escaneo', '');
    }
    let dataGood: any = this.pupCleanBlock(true);
    if (dataGood == 0) {
      this.alert(
        'warning',
        'Se ha limpiado la tabla de bienes',
        'No hay ningún bien válido'
      );
    } else {
      // PROCEDEMOS AL CERRADO DE ACTA, CAMBIO DE ESTATUS DE LOS BIENES E INSERCIÓN EN HISTÓRICOS //
      this.cerrarActa();
    }
  }

  cerrarActa() {
    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    // await this.createDET();
    const { observations, noExpedient, noTransfer } = this.formAct.value;
    const { scanningFoli } = this.form.value;
    let obj: any = {
      datePhysicalReception: date,
      statusProceedings: 'CERRADA',
      numFile: noExpedient,
      observations: observations,
      universalFolio: scanningFoli,
      numTransfer: noTransfer,
      closeDate: date,
    };
    this.loadingBtn = true;
    this.proceedingsDeliveryReceptionService
      .editProceeding(this.actaDefault.id, obj)
      .subscribe({
        next: async data => {
          this.actaDefault.datePhysicalReception = date;
          this.actaDefault.closeDate = date;
          const date1 = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
          this.formAct.patchValue({
            statusRecord: 'CERRADA',
            datePhysicalReception: date1,
          });
          let obj = {
            pActaNumber: this.actaDefault.id,
            pStatusActa: 'CERRADA',
            pVcScreen: 'FACTREFACTAENTEST',
            pUser: this.authService.decodeToken().preferred_username,
          };

          await this.updateGoodEInsertHistoric(obj);

          this.alertInfo(
            'success',
            'Se cerró el Acta correctamente',
            'También se realizó el cambio de estatus de los bienes'
          );
          this.loadingBtn = false;
          this.closeActa = false;
          await this.getDetailProceedingsDevollution(this.actaDefault.id);
        },
        error: error => {
          this.loadingBtn = false;
          this.alert('error', 'Ocurrió un error al cerrar el Acta', '');
        },
      });
  }
  proceedingsDeliveryReceptionCount(body: ICountDelivery) {
    return new Promise((resolve, reject) => {
      this.proceedingsDeliveryReceptionService
        .proceedingsDeliveryReceptionCount(body)
        .subscribe({
          next: (resp: any) => {
            resolve(resp.count);
          },
          error: (error: any) => {
            resolve(0);
          },
        });
    });
  }
  updateGoodEInsertHistoric(good: any) {
    return new Promise((resolve, reject) => {
      this.proceedingsDeliveryReceptionService
        .updateGoodEInsertHistoric(good)
        .subscribe({
          next: (resp: any) => {
            resolve(true);
          },
          error: (error: any) => {
            resolve(false);
          },
        });
    });
  }

  // PUP_LIMPIA_BLOQUE
  async pupCleanBlock(bool?: boolean) {
    const data: any[] = await this.dataTableGoods.getAll();
    let arr = data.filter(item => item.color === 'S');
    if (bool) {
      this.dataTableGoods.load(arr);
      this.dataTableGoods.refresh();
    }
    return arr.length;
  }
  async pupCleanBlockCargada(bool?: boolean) {
    const data: any[] = await this.dataTableGoodsCargada.getAll();
    let arr = data.filter(item => item.color === 'S');
    if (bool) {
      this.dataTableGoodsCargada.load(arr);
      this.dataTableGoodsCargada.refresh();
    }
    return arr.length;
  }

  async getValScaningFolio(folio: number | string) {
    return new Promise((resolve, reject) => {
      this.documentsService.getByFolio(folio).subscribe({
        next: (response: any) => {
          if (response.data[0].scanStatus == 'ESCANEADO') {
            resolve(true);
          } else {
            resolve(false);
          }
          // this.statusFile = response.data[0].scanStatus;
          // this.LNU_NO_EXPEDIENTE = response.data[0].numberProceedings;
        },
        error(err) {
          resolve(false);
        },
      });
    });
  }
  updateStatus(good: any) {
    let params = {
      vestatus: this.VESTATUS,
      no_bien: good,
    };
    console.log('params changeStatus ', params);
    this.documentsForDictumService.changeStatus(params).subscribe({
      next: response => {
        console.log('Put Status: ', response);
        let param = {
          no_bien: good,
          vestatus: this.VESTATUS,
          usuario: this.user,
          curForm: 'FACTREFACTAENTEST',
        };
        console.log('param postDocument Hist ', param);
        this.documentsForDictumService.postDocumentHist(param).subscribe({
          next: resp => {
            console.log('Pos Document Hist ', resp);
            // this.ConsultAER();
            this.alertInfo(
              'warning',
              'Se Realizó el Cambio de Estatus de los Bienes y el Acta se Encuentra CERRADA.',
              ''
            );
          },
        });
      },
    });
  }

  save() {
    if (this.newAct && !this.actaDefault) {
      this.guardarRegistro();
    } else {
      this.actualizarActa();
    }
  }

  async guardarRegistro(cveActa?: any) {
    const { statusRecord, noExpedient, noTransfer } = this.formAct.value;
    const data: any[] = await this.dataTableGoodsCargada.getAll();
    if (!statusRecord && !noExpedient) {
      if (data.length == 0) {
        return this.alert(
          'warning',
          'No hay bienes cargados',
          'Se necesitan para asociar el expediente'
        );
      }
      let valDataGood: any = await this.pupCleanBlockCargada();
      console.log(valDataGood);
      if (valDataGood == 0) {
        return this.alert('warning', 'No hay bienes válidos cargados', '');
      }
      const data_: any[] = await this.dataTableGoodsCargada.getAll();
      let arr = data_.filter(item => item.color === 'S');
      let resp: any = await this.valGood(arr[0].numberGood);
      if (!resp) {
        this.alert(
          'warning',
          'No. Bien inválido',
          'No se podrá insertar el expediente al Acta'
        );
      } else {
        if (!resp.fileNumber) {
          return this.alert('warning', 'No. Bien sin expediente', '');
        } else {
          this.formAct.get('noExpedient').setValue(resp.fileNumber);
        }
      }
    }

    const date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let obj: any = {
      keysProceedings: this.formAct.value.cveRecord
        ? this.formAct.value.cveRecord
        : null,
      elaborationDate: date,
      datePhysicalReception: date,
      statusProceedings: 'ABIERTA',
      elaborate: this.dataUser.preferred_username,
      numFile: this.formAct.get('noExpedient').value,
      typeProceedings: 'ENTEST',
      dateDeliveryGood: date,
      observations: this.formAct.value.observaciones,
      captureDate: date,
      numDelegation1: this.dataUser.department,
      numDelegation2: this.dataUser.department,
      universalFolio: this.form.value.scanningFoli,
      numTransfer: noTransfer,
      idTypeProceedings: 'BEE',
      numDelegation_1: null,
      numDelegation_2: null,
      file: this.dataExpediente ? this.dataExpediente.id : null,
    };
    this.proceedingsDeliveryReceptionService
      .createDeliveryReception(obj)
      .subscribe({
        next: async (data: any) => {
          console.log('DATA', data);
          this.actaDefault = data;
          const date = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
          this.formAct.get('statusRecord').setValue('ABIERTA');
          this.formAct.get('dateCapture').setValue(date);
          this.formAct.get('datePhysicalReception').setValue(date);

          this.alert('success', 'El Acta se ha creado correctamente', '');
          await this.createDET();
          this.dataTableGoodsCargada.load([]);
          this.dataTableGoodsCargada.refresh();
          await this.getDetailProceedingsDevollution(this.actaDefault.id);
          this.valTableNgIf = false;
        },
        error: error => {
          this.alert('error', 'El Acta no se puede crear', '');
        },
      });
  }

  async actualizarActa(boolFolio?: boolean) {
    if (!this.actaDefault) {
      this.alertInfo('warning', 'Debe seleccionar un Acta', '');
      return;
    }
    if (this.actaDefault.statusProceedings == 'CERRADA') {
      this.alertInfo('warning', 'No puede actualizar un Acta cerrada', '');
      return;
    }
    const { noExpedient, noTransfer, statusRecord } = this.formAct.value;
    const { scanningFoli } = this.form.value;
    let obj: any = {
      // keysProceedings: ,
      // elaborationDate: this.actaDefault.elaborationDate,
      // datePhysicalReception: this.actaDefault.datePhysicalReception,
      statusProceedings: statusRecord,
      numFile: noExpedient,
      observations: this.formAct.value.observations,
      universalFolio: scanningFoli,
      numTransfer: noTransfer,
      file: noExpedient,
    };

    this.proceedingsDeliveryReceptionService
      .editProceeding(this.actaDefault.id, obj)
      .subscribe({
        next: async resp => {
          if (!boolFolio) {
            this.alertInfo('success', 'Acta actualizada correctamente', '');
            await this.createDET();
            this.dataTableGoodsCargada.load([]);
            this.dataTableGoodsCargada.refresh();
            await this.getDetailProceedingsDevollution(this.actaDefault.id);
          }
        },
        error: error => {
          this.alert('error', 'Ocurrió un error al actualizar el Acta', '');
        },
      });
  }

  cleanActa() {
    this.newAct = true;
    this.formAct.reset();
    this.form.reset();
    this.btnSave = true;
    this.actaDefault = null;
    this.closeActa = true;
    this.transferenteSelected = null;
    this.dataTableGoods.load([]);
    this.dataTableGoods.refresh();
    this.dataTableGoodsCargada.load([]);
    this.dataTableGoodsCargada.refresh();
    this.dataExpediente = null;
    this.transferenteSelected = null;
    this.delegationSelected = null;
    this.valTableNgIf = false;
  }

  async searchActa() {
    const modalConfig = {
      initialState: {},
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    modalConfig.initialState = {
      // expedienteNumber,
      actaActual: this.actaDefault,
    };

    let modalRef = this.modalService.show(SearchActsComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        console.log('next', next);
        this.actaDefault = next;
        if (this.actaDefault.statusProceedings == 'CERRADA')
          this.closeActa = false;
        else this.closeActa = true;
        this.formAct.patchValue({
          cveRecord: this.actaDefault.keysProceedings,
          noTransfer: this.actaDefault.numTransfer
            ? this.actaDefault.numTransfer_
            : null,
          noExpedient: this.actaDefault.numFile,
          statusRecord: this.actaDefault.statusProceedings,
          datePhysicalReception: this.datePipe.transform(
            await this.correctDate(this.actaDefault.datePhysicalReception),
            'dd/MM/yyyy'
          ),
          dateCapture: this.datePipe.transform(
            await this.correctDate(this.actaDefault.captureDate),
            'dd/MM/yyyy'
          ),
          observations: this.actaDefault.observations,
        });
        this.form.patchValue({
          scanningFoli: this.actaDefault.universalFolio,
        });
        this.folioScan = this.actaDefault.universalFolio;
        this.formAct.get('noTransfer').setValue(this.actaDefault.numTransfer_);
        this.getDetailProceedingsDevollution(this.actaDefault.id);
        this.dataTableGoodsCargada.load([]);
        this.dataTableGoodsCargada.refresh();
        this.valTableNgIf = false;
      }
    });

    modalRef.content.onDelete.subscribe(async (next: any) => {
      this.ejecutarFuncion();
    });
  }

  onButtonClick() {
    this.fileInput.nativeElement.click();
  }

  clearInput() {
    this.fileInput.nativeElement.value = '';
  }

  async cargarBienes() {
    const { statusRecord, cveRecord, noTransfer } = this.formAct.value;
    if (statusRecord == 'ABIERTA') {
      this.alertQuestion(
        'question',
        'Se agregarán más bienes al acta',
        '¿Desea continuar?'
      ).then(async (question: any) => {
        if (question.isConfirmed) {
          // PUP_LEER_ARCHIVO;
          // PUP_CARGA_BIENES_ABIERTA;
          this.onButtonClick();
        }
      });
    } else if (!statusRecord && !cveRecord) {
      if (noTransfer) {
        let respTransfer: ITransferente =
          await this.getTransferentesDeliveryCve(noTransfer);
        if (!respTransfer) {
          this.alert('warning', 'Transferente Inválido', '');
        } else {
          this.transferenteSelected = respTransfer;
          this.buildCveActFirstPart();
        }
      } else {
        (
          await this.alertInfo(
            'info',
            'Para generar la clave debe seleccionar una Transferente',
            ''
          )
        ).isConfirmed.valueOf() == true
          ? this.searchTransferent()
          : null;
      }
    } else if (!statusRecord && cveRecord) {
      this.alertQuestion(
        'question',
        'Se agregarán más bienes al acta',
        '¿Desea continuar?'
      ).then(async (question: any) => {
        if (question.isConfirmed) {
          // PUP_LEER_ARCHIVO;
          // PUP_CARGA_BIENES_ABIERTA;
          this.onButtonClick();
        }
      });
    } else {
      this.alert('warning', 'El acta se encuentra cerrada', '');
    }
  }

  ejecutarFuncion() {
    this.cleanActa();
  }

  onFileChange2(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readTXT(fileReader.result);
  }

  async readTXT(binaryTXT: string | ArrayBuffer) {
    const data = this.excelService.getData<any>(binaryTXT);
    const { noTransfer } = this.formAct.value;
    let valNoBienNumber: IBienErrorSave[] = [];
    let bienesActRecept: IBienActRecept[] = [];
    this.btnLoadingTXT = true;
    if (data.length == 0) {
      this.alert('warning', 'No hay data para cargar en el archivo', '');
      this.btnLoadingTXT = false;
      return this.clearInput();
    }
    const data2: any[] = await this.deleteDuplicate(data);

    let result = data2.map(async item => {
      if (item.BIEN) {
        // VALIDAMOS QUE EL NO.BIEN SEA UN NÚMERO //
        if (!isNaN(parseInt(item.BIEN))) {
          // VALIDAMOS QUE EL NO.BIEN EXISTA EN LA BASE DE DATOS//
          let resValGood: any = await this.valGood(item.BIEN);
          console.log(resValGood);
          if (!resValGood) {
            let obj: IBienErrorSave = {
              BIEN: item.BIEN,
              ERROR: 'El Bien no existe en la Base de Datos',
            };
            valNoBienNumber.push(obj);
          } else {
            // VALIDAMOS LA DELEGACIÓN DEL BIEN //
            let valDelegacion = await this.faDelAdmBien(item.BIEN);
            if (!valDelegacion) {
              let obj: IBienErrorSave = {
                BIEN: item.BIEN,
                ERROR: 'Delegación del bien inválida',
              };
              valNoBienNumber.push(obj);
              bienesActRecept.push({
                numberGood: resValGood.id,
                description: resValGood.description,
                amount: resValGood.quantity,
                process: resValGood.extDomProcess,
                status: resValGood.status,
                color: 'N',
              });
            } else {
              if (valDelegacion != this.dataUser.department) {
                let obj: IBienErrorSave = {
                  BIEN: item.BIEN,
                  ERROR:
                    'La delegación del usuario es diferente a la del Bien cargado',
                };
                valNoBienNumber.push(obj);
                bienesActRecept.push({
                  numberGood: resValGood.id,
                  description: resValGood.description,
                  amount: resValGood.quantity,
                  process: resValGood.extDomProcess,
                  status: resValGood.status,
                  color: 'N',
                });
              } else {
                // VALIDAMOS QUE EL BIEN TENGA EL ESTATUS CORRECTO PARA LA PANTALLA //
                let resValGoodScreen = this.valGoodStatusScreen(item.BIEN);
                if (!resValGoodScreen) {
                  let obj: IBienErrorSave = {
                    BIEN: item.BIEN,
                    ERROR:
                      'El Bien no tiene un estatus correcto para esta pantalla',
                  };
                  valNoBienNumber.push(obj);
                  bienesActRecept.push({
                    numberGood: resValGood.id,
                    description: resValGood.description,
                    amount: resValGood.quantity,
                    process: resValGood.extDomProcess,
                    status: resValGood.status,
                    color: 'N',
                  });
                } else {
                  // VALIDAMOS QUE EL EXPEDIENTE ASOCIADO AL BIEN Y EL TRANSFERENTE SELECCIONADO TENGAN RELACIÓN //
                  let resValGoodExpedient = await this.valGoodExpedientTransfer(
                    resValGood.fileNumber
                  );
                  if (!resValGoodExpedient) {
                    let obj: IBienErrorSave = {
                      BIEN: item.BIEN,
                      ERROR: `Expediente (${resValGood.fileNumber}) asociado al Bien y Transferente (${noTransfer}) seleccionado no tienen relación`,
                    };
                    valNoBienNumber.push(obj);
                    bienesActRecept.push({
                      numberGood: resValGood.id,
                      description: resValGood.description,
                      amount: resValGood.quantity,
                      process: resValGood.extDomProcess,
                      status: resValGood.status,
                      color: 'N',
                    });
                  } else {
                    // VERIFICAMOS QUE EL BIEN TENGA UN PADRE PARCIALIZADOR //
                    let resValGoodFatherParc: any = await this.valGood(
                      item.BIEN,
                      true
                    );
                    if (!resValGoodFatherParc) {
                      let obj: IBienErrorSave = {
                        BIEN: item.BIEN,
                        ERROR: `El Bien no tiene un Padre Parcializador asignado`,
                      };
                      valNoBienNumber.push(obj);
                      bienesActRecept.push({
                        numberGood: resValGood.id,
                        description: resValGood.description,
                        amount: resValGood.quantity,
                        process: resValGood.extDomProcess,
                        status: resValGood.status,
                        color: 'N',
                      });
                    } else {
                      // VERIFICAMOS QUE EL BIEN NO SE ENCUENTRE EN OTRA ACTA
                      // let res = await this.valGoodInActasRecept(item.BIEN, resValGood.fileNumber)
                      let res = await this.proceedingsDeliveryReceptionCount({
                        good: item.BIEN,
                      });

                      if (res == 1) {
                        let obj: IBienErrorSave = {
                          BIEN: item.BIEN,
                          ERROR: `El Bien ya se encuentra asignado en otra acta`,
                        };
                        valNoBienNumber.push(obj);
                        bienesActRecept.push({
                          numberGood: resValGood.id,
                          description: resValGood.description,
                          amount: resValGood.quantity,
                          process: resValGood.extDomProcess,
                          status: resValGood.status,
                          color: 'N',
                        });
                      } else {
                        bienesActRecept.push({
                          numberGood: resValGood.id,
                          description: resValGood.description,
                          amount: resValGood.quantity,
                          process: resValGood.extDomProcess,
                          status: resValGood.status,
                          color: 'S',
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          let obj: IBienErrorSave = {
            BIEN: item.BIEN,
            ERROR: 'El dato ingresado no es un número',
          };
          valNoBienNumber.push(obj);
        }
      }
    });
    Promise.all(result).then(resp => {
      console.log(data.length);
      console.log(valNoBienNumber.length);
      if (
        valNoBienNumber.length >= 1 &&
        valNoBienNumber.length == data.length
      ) {
        this.alertQuestion(
          'warning',
          'Todos los bienes cargados son inválidos',
          '¿Desea visualizarlos?'
        ).then(question => {
          if (question.isConfirmed) {
            // DESPLEGAMOS VENTANA DE ERRORES //
            this.openErrorsGoods(valNoBienNumber);
            this.dataTableGoodsCargada.load(bienesActRecept);
            this.dataTableGoodsCargada.refresh();
          } else {
            this.dataTableGoodsCargada.load(bienesActRecept);
            this.dataTableGoodsCargada.refresh();
          }
        });
      } else if (
        valNoBienNumber.length >= 1 &&
        valNoBienNumber.length != data.length
      ) {
        this.alertQuestion(
          'warning',
          'Se cargaron bienes inválidos',
          '¿Desea visualizarlos?'
        ).then(question => {
          if (question.isConfirmed) {
            // DESPLEGAMOS VENTANA DE ERRORES //
            this.openErrorsGoods(valNoBienNumber);
            this.dataTableGoodsCargada.load(bienesActRecept);
            this.dataTableGoodsCargada.refresh();
          } else {
            this.dataTableGoodsCargada.load(bienesActRecept);
            this.dataTableGoodsCargada.refresh();
          }
        });
      } else {
        this.dataTableGoodsCargada.load(bienesActRecept);
        this.dataTableGoodsCargada.refresh();
        this.alert('success', 'Bienes cargados correctamente', '');
      }
      this.valTableNgIf = true;
      this.btnLoadingTXT = false;
      this.clearInput();
    });
  }

  async deleteDuplicate(array: any) {
    let valoresUnicos = Array.from(new Set(array.map(a => a.BIEN))).map(
      BIEN => {
        return array.find((a: any) => a.BIEN === BIEN);
      }
    );
    return valoresUnicos;
  }

  async valGood(id: string | number, filter?: boolean) {
    let params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    params.limit = 1;
    params.page = 1;
    if (filter) {
      params['filter.status'] = `$eq:ADM`;
      params['filter.goodsPartializationFatherNumber'] = `$not:$null`;
    }
    return new Promise((resolve, reject) => {
      this.goodService.getByGoodNumber(id).subscribe({
        next(value) {
          resolve(value.data[0]);
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }
  async faDelAdmBien(good: number) {
    return new Promise((resolve, reject) => {
      this.proceedingsDeliveryReceptionService
        .proceedingsDeliveryFaDelAdmBien(good)
        .subscribe({
          next: (resp: any) => {
            resolve(resp.coordAdmin);
          },
          error: (error: any) => {
            resolve(null);
          },
        });
    });
  }
  async valGoodStatusScreen(good: number) {
    let obj: IAcceptGoodStatusScreen = {
      pNumberGood: good,
      pVcScreen: 'FACTREFACTAENTEST',
    };
    return new Promise((resolve, reject) => {
      this.goodProcessService.getacceptGoodStatusScreen(obj).subscribe({
        next(value) {
          resolve(value);
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }

  async valGoodExpedientTransfer(expedient: number | string) {
    let paramsTrasfer = {
      v_noexped: expedient,
      no_transferente: this.formAct.get('noTransfer').value,
    };
    return new Promise((resolve, reject) => {
      this.expedientService.postExpedient(paramsTrasfer).subscribe({
        next(resp) {
          resolve(resp.data[0].no_transferente);
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }

  async valGoodInActasRecept(
    good: number | string,
    expedient: number | string
  ) {
    let params = new ListParams();
    params['sortBy'] = `goodNumber:ASC`;
    params['filter.goodNumber'] = `$eq:${good}`;
    let body = {
      proceedingsNumber: expedient,
      typeMinutes: 'ENTEST',
    };
    return new Promise((resolve, reject) => {
      this.goodProcessService
        .GetTypeMinuteDetailDelivery(body, params)
        .subscribe({
          next(value) {
            resolve(1);
          },
          error(err) {
            resolve(0);
          },
        });
    });
  }

  async openErrorsGoods(dataErrors: IBienErrorSave[]) {
    const modalConfig = {
      initialState: {},
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    modalConfig.initialState = {
      dataErrors,
    };

    let modalRef = this.modalService.show(GoodsErrorsComponent, modalConfig);
  }

  exportCsv() {
    const filename: string = 'BIENESBEE';
    this.exportToTxt(this.jsonToTXT, filename);
  }

  exportToTxt(json: any[], filename: string) {
    const txtData = json.join('\n');
    const blob = new Blob([txtData], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filename + '.txt');
  }

  async searchTransferent() {
    const modalConfig = {
      initialState: {},
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    modalConfig.initialState = {};

    let modalRef = this.modalService.show(TransferentsComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      if (next) {
        this.transferenteSelected = next;
        this.formAct.patchValue({
          noTransfer: this.transferenteSelected.id,
        });
        this.buildCveActFirstPart(); // PUP_ARMA_CLAVE - Primera parte;

        // PUP_LEER_ARCHIVO;
        // PUP_CARGA_BIENES;
      }
    });
    modalRef.content.onCancel.subscribe(async (next: any) => {
      this.alert(
        'warning',
        'No seleccionó Transferente',
        'Vuelva a cargar bienes'
      );
    });
  }

  async buildCveActFirstPart() {
    // PUP_ARMA_CLAVE
    if (this.dataUser.department == '0') {
      (
        await this.alertInfo(
          'info',
          'Deberá seleccionar la Delegación o Área correspondiente',
          ''
        )
      ).isConfirmed.valueOf() == true
        ? this.searchDelegations()
        : null;
    } else {
      this.buildCveActSecondPart();
    }
  }

  searchDelegations() {
    const modalConfig = {
      initialState: {},
      class: 'modal-xl modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    modalConfig.initialState = {};

    let modalRef = this.modalService.show(DelegationsComponent, modalConfig);
    modalRef.content.onSave.subscribe(async (next: any) => {
      this.delegationSelected = next;
      this.buildCveActSecondPart();
    });
    modalRef.content.onCancel.subscribe(async (next: any) => {
      this.alert(
        'warning',
        'No seleccionó Delegación',
        'Vuelva a cargar bienes'
      );
    });
  }

  async buildCveActSecondPart() {
    // PUP_ARMA_CLAVE --- CONTINUACIÓN;
    let delegation: any = await this.getRNomencla();
    let maxId = await this.getMaxId();
    let cveAct: any = await this.getCveAct(maxId);
    let V_CVE_ACTA = cveAct;
    let V_CONSEC: string | number =
      cveAct == 0 ? 0 : parseInt(V_CVE_ACTA.split('/')[3]);
    V_CONSEC = V_CONSEC + 1;
    V_CONSEC = V_CONSEC.toString().padStart(5, '0');
    const year = this.datePipe.transform(new Date(), 'yy');
    const mes = this.datePipe.transform(new Date(), 'MM');
    let clave = `BEE/${this.transferenteSelected.keyTransferent}/${delegation.delegation}/${V_CONSEC}/${year}/${mes}`;
    this.formAct.get('idTipoAct').setValue('BEE');
    this.formAct.get('cveRecord').setValue(clave);

    // PUP_LEER_ARCHIVO;
    // PUP_CARGA_BIENES;
    this.alertQuestion(
      'question',
      'Se cargarán los bienes al acta',
      '¿Desea continuar?'
    ).then(async (question: any) => {
      if (question.isConfirmed) {
        this.onButtonClick();
      }
    });
  }

  async getTransferentesDeliveryCve(id?: any) {
    let params = new ListParams();

    params['filter.active'] = `$is:$null`;
    params['filter.id'] = `$eq:${id}`;
    params['sortBy'] = `id:DESC`;
    return new Promise((resolve, reject) => {
      this.transferenteService.getAll(params).subscribe({
        next: value => {
          resolve(value.data[0]);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async getRNomencla() {
    const params = new FilterParams();
    params.addFilter(
      'numberDelegation2',
      this.dataUser.department,
      SearchFilter.EQ
    );
    params.addFilter('stageedo', this.stagecreated, SearchFilter.EQ);
    return new Promise((resolve, reject) => {
      this.rNomenclaService.getAll(params.getParams()).subscribe({
        next: (data: any) => {
          console.log('REG_DEL_DESTR', data);
          resolve(data.data[0]);
        },
        error: error => {
          resolve(null);
        },
      });
    });
  }

  async getMaxId() {
    const params = new ListParams();
    params['filter.numDelegation1'] = `$eq:${this.dataUser.department}`;
    params['filter.typeProceedings'] = `$eq:ENTEST`;
    params['sortBy'] = `id:DESC`;
    return new Promise((resolve, reject) => {
      this.proceedingsDeliveryReceptionService
        .getStatusDeliveryCveExpendienteAll(params)
        .subscribe({
          next: async (data: any) => {
            resolve(data.data[0].id);
          },
          error: error => {
            resolve(0);
          },
        });
    });
  }

  async getCveAct(maxId: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${maxId}`;
    params['sortBy'] = `id:DESC`;
    return new Promise((resolve, reject) => {
      this.proceedingsDeliveryReceptionService
        .getStatusDeliveryCveExpendienteAll(params)
        .subscribe({
          next: async (data: any) => {
            resolve(data.data[0].keysProceedings);
          },
          error: error => {
            resolve(0);
          },
        });
    });
  }

  async getDetailProceedingsDevollution(id: any) {
    this.loading = true;
    let params: any = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.detailProceeDelRecService.getGoodsByProceedings(id, params).subscribe({
      next: data => {
        const { cveRecord, statusRecord } = this.formAct.value;
        let result = data.data.map(async (item: any) => {
          item['description'] = item.good ? item.good.description : null;
          item['process'] = item.good ? item.good.extDomProcess : null;
          item['status'] = item.good ? item.good.status : null;

          let resValGoodScreen = this.valGoodStatusScreen(item.numberGood);

          let resCveAct = await this.proceedingsDeliveryReceptionCount({
            good: item.numberGood,
            proceedingKey: cveRecord,
          });
          let goodParz = this.valGood(item.numberGood, true);
          if (
            resValGoodScreen &&
            goodParz &&
            resCveAct == 0 &&
            cveRecord &&
            statusRecord == 'ABIERTA'
          ) {
            item['color'] = 'S';
          } else {
            item['color'] = 'N';
          }
        });

        Promise.all(result).then(item => {
          this.dataTableGoods.load(data.data);
          this.dataTableGoods.refresh();
          this.totalItems = data.count;
          this.loading = false;
        });
      },
      error: error => {
        this.dataTableGoods.load([]);
        this.dataTableGoods.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }
  clearallTable() {
    this.pupCleanBlockCargada(true);
  }

  async correctDate(date: string) {
    const dateUtc = new Date(date);
    return new Date(dateUtc.getTime() + dateUtc.getTimezoneOffset() * 60000);
  }

  goBackScanning(id: number, folio: number | string) {
    this.form.patchValue({
      scanningFoli: folio,
    });
    // this.keyActa = this.formAct.get('cveRecord').value;
    this.proceedingsDeliveryReceptionService.getProceedingsById(id).subscribe({
      next: async response => {
        console.log('response: ', response);
        this.actaDefault = response.data[0];
        if (this.actaDefault.statusProceedings == 'CERRADA')
          this.closeActa = false;
        else this.closeActa = true;

        this.formAct.patchValue({
          cveRecord: this.actaDefault.keysProceedings,
          noTransfer: this.actaDefault.numTransfer
            ? this.actaDefault.numTransfer.id
            : null,
          noExpedient: this.actaDefault.numFile,
          statusRecord: this.actaDefault.statusProceedings,
          datePhysicalReception: this.datePipe.transform(
            await this.correctDate(this.actaDefault.datePhysicalReception),
            'dd/MM/yyyy'
          ),
          dateCapture: this.datePipe.transform(
            await this.correctDate(this.actaDefault.captureDate),
            'dd/MM/yyyy'
          ),
          observations: this.actaDefault.observations,
        });

        this.getDetailProceedingsDevollution(this.actaDefault.id);
      },
    });
  }

  async createDET() {
    const data: any[] = await this.dataTableGoodsCargada.getAll();
    let result = data.map(async item => {
      if (item.color == 'S') {
        let obj: any = {
          numberProceedings: this.actaDefault.id,
          numberGood: item.numberGood,
          amount: item.amount,
          received: null,
          approvedXAdmon: null,
          approvedDateXAdmon: null,
          approvedUserXAdmon: null,
          dateIndicatesUserApproval: null,
          numberRegister: null,
          reviewIndft: null,
          correctIndft: null,
          idftUser: null,
          idftDate: null,
          numDelegationIndft: null,
          yearIndft: null,
          monthIndft: null,
          idftDateHc: null,
          packageNumber: null,
          exchangeValue: null,
          asd: null,
        };
        await this.saveGoodActas(obj);
      }
    });

    await Promise.all(result);
    return true;
  }
  async saveGoodActas(body: any) {
    return new Promise((resolve, reject) => {
      this.serviceDetailProc.addGoodToProceedings(body).subscribe({
        next: data => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }
  deleteGood(data: any) {
    const { statusRecord } = this.formAct.value;
    if (statusRecord == 'CERRADA')
      return this.alert(
        'warning',
        'El Acta se encuentra cerrada',
        'No se puede modificar'
      );

    this.alertQuestion(
      'question',
      'Se eliminará el bien del acta',
      '¿Desea Continuar?'
    ).then(async question => {
      if (question.isConfirmed) {
        let obj: any = {
          numberGood: data.data.numberGood,
          numberProceedings: this.actaDefault.id,
        };

        this.serviceDetailProc.deleteDetailProcee(obj).subscribe({
          next: data => {
            this.alert('success', 'Bien eliminado correctamente', '');
            this.getDetailProceedingsDevollution(this.actaDefault.id);
          },
          error: error => {
            this.alert('warning', 'No se pudo eliminar el bien del acta', '');
          },
        });
      }
    });
  }
  next() {
    this.valTableNgIf = !this.valTableNgIf;
    if (this.valTableNgIf)
      this.tooltip = 'Ir a la tabla de Bienes Relacionados al Acta';
    else this.tooltip = 'Ir a la tabla de Bienes Cargados';
  }

  questionDeleteCargada(data: any) {
    this.alertQuestion(
      'question',
      'Se eliminará el bien',
      '¿Desea continuar?'
    ).then(async question => {
      if (question.isConfirmed) {
        this.dataTableGoodsCargada.remove(data);
        this.dataTableGoodsCargada.refresh();
        this.alert('success', 'El bien se eliminó correctamente', '');
      }
    });
  }
}
