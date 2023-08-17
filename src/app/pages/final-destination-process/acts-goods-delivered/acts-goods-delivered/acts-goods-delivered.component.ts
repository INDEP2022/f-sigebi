import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsForDictumService } from 'src/app/core/services/catalogs/documents-for-dictum.service';
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
import { SiabService } from 'src/app/core/services/jasper-reports/siab.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { COLUMNS } from './columns';

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
  localStorage = new LocalDataSource();
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
  closeActa: boolean = false;
  yData: boolean = false;
  cveActa: any;
  acta: any;
  idActa: any;
  statusScan: boolean = false;
  documentsService = inject(DocumentsService);

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
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.initForm();
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(params => {
        this.folioScan = params['folio'] ? Number(params['folio']) : null;
        this.cveActa = params['cveActa'] ? String(params['cveActa']) : null;
        console.log('Folio ', this.folioScan);
        console.log('cveActa: ', this.cveActa);
        if (this.folioScan != null) {
          this.scan = true;
          this.formAct.patchValue({
            cveRecord: this.cveActa,
          });
          console.log('folio ', this.folioScan);
          this.form.patchValue({
            scanningFoli: this.folioScan,
          });
          this.ConsultAER();
          this.goods = true;
          this.fool = true;
        }
      });
    this.settings = { ...this.settings, actions: false };
    this.settings.columns = COLUMNS;
    this.settings.rowClassFunction = (row: { data: { color: any } }) =>
      row.data.color != null
        ? row.data.color === 'S'
          ? 'bg-success text-white'
          : 'bg-dark text-white'
        : '';
  }

  ngOnInit(): void {
    this.getuser();
  }

  initForm() {
    (this.formAct = this.fb.group({
      cveRecord: [null],
      noTransfer: [null],
      noExpedient: [null],
      statusRecord: [null],
      closingDate: [null],
      dateCapture: [null],
      textarea: [null],
    })),
      (this.form = this.fb.group({
        scanningFoli: [null, [Validators.pattern(STRING_PATTERN)]],
      }));
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

  ConsultAER() {
    this.form.reset();
    this.form.patchValue({
      scanningFoli: this.folioScan,
    });
    this.keyActa = undefined;
    this.keyActa = this.formAct.get('cveRecord').value;
    console.log('Keys: ', this.keyActa);
    if (this.keyActa == undefined) {
      this.onLoadToast('error', 'Seleccione una Clave de Acta', '');
    }
    this.detailProceeDelRecService.getProcedingbykey(this.keyActa).subscribe({
      next: response => {
        console.log('response: ', response);
        const Capture =
          response.data[0].captureDate != null
            ? new Date(response.data[0].captureDate)
            : null;
        if (Capture == null) {
          this.formattedfecCapture = null;
        } else {
          this.formattedfecCapture = this.formatDate(
            new Date(Capture.getTime() + Capture.getTimezoneOffset() * 60000)
          );
        }
        const close =
          response.data[0].closeDate != null
            ? new Date(response.data[0].closeDate)
            : null;
        if (close == null) {
          this.formattedfecclose = null;
        } else {
          this.formattedfecclose = this.formatDate(
            new Date(close.getTime() + close.getTimezoneOffset() * 60000)
          );
        }
        if (response.data[0].statusProceedings == 'CERRADA') {
          this.close = false;
        } else {
          this.close = true;
        }

        console.log('Date Close: ', this.formattedfecclose);
        console.log('Date Capture: ', this.formattedfecCapture);
        this.idActa = response.data[0].id;
        let paramsForm = {
          cveRecord: response.data[0].keysProceedings,
          noTransfer: response.data[0].numTransfer.id,
          textarea: response.data[0].observations,
          dateCapture: this.formattedfecCapture,
          closingDate: this.formattedfecclose,
          statusRecord: response.data[0].statusProceedings,
          noExpedient: response.data[0].numFile,
        };
        this.formAct.patchValue(paramsForm);
        this.goods = true;
        this.yData = true;
        let id = response.data[0].id;
        if (response.data[0].statusProceedings == 'ABIERTA') {
          this.closeActa = true;
        } else {
          this.closeActa = false;
        }
        if (this.folioScan == null && response.data[0].universalFolio != null) {
          console.log('Entra a la validacion del folioScan');
          let formActParams = {
            scanningFoli: response.data[0].universalFolio,
          };
          this.folioScan = response.data[0].universalFolio;
          this.form.patchValue(formActParams);
          this.fool = true;
          this.scan = true;
        }
        this.statusActa();
        this.getDetailProceedingDevolution(id);
      },
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day} /${month}/${year}`;
  }

  getDetailProceedingDevolution(id: number) {
    this.datatable = [];
    this.localStorage.load(this.datatable);
    console.log('getDetailProceedingDevolution');
    this.detailProceeDelRecService.getProceedingbyId(id).subscribe({
      next: response => {
        console.log('response: ', response);
        console.log('entra');
        let params = {
          color: 'S',
          goodNumb: response.data[0].good.id,
          description: response.data[0].good.description,
          quantity: response.data[0].good.quantity,
          process: response.data[0].good.extDomProcess,
          status: response.data[0].good.status,
        };
        console.log('Push ', params);
        this.totalItems = response.data.length;
        this.datatable.push(params);
        this.localStorage.load(this.datatable);
      },
      error: err => {
        console.log('getDetailProceedingDevolution Error');
      },
    });
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
                    this.postStatus(paramsstatus, params, good);
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
                    this.postStatus(paramsstatus, params, good);
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
                //   this.localStorage.load(this.datatable);
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
                //   this.localStorage.load(this.datatable);
                // }}
              },
            });
        }
      }
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un Error al Leer el Archivo', 'Error');
    }
  }

  postStatus(params: any, paramstable: any, good: any) {
    this.screenStatusService.postStatusXPant(params).subscribe({
      next: respon => {
        console.log('Respuesta Status: ', respon);
        this.ESTATUS = respon.data[0].estatus;
        this.getProcedingEstado(good, paramstable);
      },
    });
  }

  getProcedingEstado(good: any, paramstable: any) {
    this.detailProceeDelRecService.getProceedingStatus(good).subscribe({
      next: respon => {
        console.log('response Estatus Proceeding ', respon);
        this.V_ACTAEXIST = respon.data[0].count;
        console.log('this.V_NTRANSF ', this.V_NTRANSF);
        console.log('this.V_ACTAEXIST ', this.V_ACTAEXIST);
        console.log('this.ESTATUS ', this.ESTATUS);
        this.postTable(paramstable);
      },
    });
  }

  postTable(paramstable: any) {
    if (this.V_ACTAEXIST == 0 && this.ESTATUS != null) {
      paramstable['color'] = 'N';
      console.log(paramstable);
      this.datatable.push(paramstable);
      console.log('this.datatable ', this.datatable);
      this.localStorage.load(this.datatable);
    } else {
      paramstable['color'] = 'S';
      console.log(paramstable);
      this.datatable.push(paramstable);
      this.localStorage.load(this.datatable);
    }
  }

  initSolicitud() {
    if (
      this.formAct.get('statusRecord').value != 'CERRADA' &&
      this.formAct.get('statusRecord').value != null
    ) {
      if (this.form.get('scanningFoli').value == null) {
        this.alertQuestion(
          'info',
          'Se Generará un Nuevo Folio de Escaneo para el Acta Abierta. ¿Deseas continuar?',
          '',
          'Aceptar',
          'Cancelar'
        ).then(res => {
          console.log(res);
          if (res.isConfirmed) {
            this.fileNumber = this.formAct.get('noExpedient').value;
            if (this.fileNumber == null || this.fileNumber == 0) {
              this.alertInfo(
                'error',
                'El Acta no Tiene un Numero de Expediente.',
                ''
              );
            }
            this.notificationService
              .getByFileNumber(this.fileNumber)
              .subscribe({
                next: resp => {
                  console.log('Respuesta primer: ', resp);
                  let params = {
                    no_expediente: this.fileNumber,
                    cve_acta: this.keyActa,
                    no_delegacion: this.userdelegacion,
                    no_subdelegacion: this.userSubdelegacion,
                    no_departamento: this.userDepartament,
                    lnu_no_volante: resp.data[0].max,
                    user: this.user,
                  };
                  this.documentsForDictumService
                    .postDocuemnt(params)
                    .subscribe({
                      next: response => {
                        console.log('Response: ', response);
                        this.fool = true;
                        this.folioScan = response.data[0].folio_universal;
                        let formparams = {
                          scanningFoli: response.data[0].folio_universal,
                        };
                        console.log('scanningFoli: ', formparams);
                        this.form.patchValue(formparams);
                        this.getReport();
                        //this.getReport();
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
    console.log('Scaneo ', this.form.get('scanningFoli').value);
    let folio = this.form.get('scanningFoli').value;
    if (folio != null) {
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
              origin: 'FACTREFACTAENTEST',
              folio: this.folioScan,
              cveActa: this.keyActa,
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

  openScannerPageView() {
    this.documentsForDictumService.getByFolio(this.folioScan).subscribe({
      next: response => {
        console.log('Response By Folio ', response);
        let statusFile = response.data[0].scanStatus;
        this.LNU_NO_EXPEDIENTE = response.data[0].numberProceedings;
        if (statusFile == 'ESCANEADO') {
          console.log('Scaneo ', this.form.get('scanningFoli').value);
          let folio = this.form.get('scanningFoli').value;
          if (folio != null) {
            this.alertQuestion(
              'info',
              'Se Abrirá la Pantalla de Escaneo para Visualizar las Imagenes. ¿Deseas continuar?',
              '',
              'Aceptar',
              'Cancelar'
            ).then(res => {
              console.log(res);
              if (res.isConfirmed) {
                this.router.navigate(
                  [`/pages/general-processes/scan-documents`],
                  {
                    queryParams: {
                      origin: 'FACTREFACTAENTEST',
                      folio: this.folioScan,
                      cveActa: this.keyActa,
                    },
                  }
                );
              }
            });
          } else {
            this.alertInfo(
              'warning',
              'No Tiene Folio de Escaneo para Continuar a la Pantalla de Escaneo',
              ''
            );
          }
        } else {
          this.alertInfo('warning', 'El Folio no se encuentra Escaneado', '');
        }
      },
    });
  }

  getclose() {
    this.alertQuestion(
      'info',
      'Se Cerrará el Acta. ¿Deseas continuar?',
      '',
      'Aceptar',
      'Cancelar'
    ).then(res => {
      console.log(res);
      if (res.isConfirmed) {
        this.documentsForDictumService.getByFolio(this.folioScan).subscribe({
          next: response => {
            console.log('Response By Folio ', response);
            this.statusFile = response.data[0].scanStatus;
            this.LNU_NO_EXPEDIENTE = response.data[0].numberProceedings;
            if (this.statusFile == 'ESCANEADO') {
              console.log('entra a scaneado');
              this.closeAct();
            }
          },
        });
      }
    });
  }

  closeAct() {
    if (this.formAct.get('statusRecord').value != 'CERRADA') {
      console.log('primer if ');
      console.log('data table ', this.datatable);
      if (this.datatable.length > 0) {
        console.log('segundo if ');
        console.log('datatable ', this.datatable);
        for (let i = 0; i < this.datatable.length; i++) {
          if (this.datatable[i].color == 'S') {
            console.log('tercer if ');
            this.detailProceeDelRecService
              .getProceedingByNoGood(this.datatable[i].goodNumb)
              .subscribe({
                next: response => {
                  console.log('respuesta getProceedingByNoGood ', response);
                  let params = {
                    curForm: 'FACTREFACTAENTEST',
                    no_bien: this.datatable[i].goodNumb,
                    v_status: response.data[0].good.status,
                  };
                  this.screenStatusService.getStatusV(params).subscribe({
                    next: respo => {
                      //
                      // Suponiendo que closeDate es una instancia de Date
                      var closeDate = new Date();

                      // Obtener el día, mes y año
                      var day = closeDate.getDate();
                      var month = closeDate.getMonth() + 1; // Los meses en JavaScript son base 0, por lo que se suma 1
                      var year = closeDate.getFullYear();

                      // Formatear para que siempre tenga 2 dígitos
                      var formattedDay = day < 10 ? '0' + day : day;
                      var formattedMonth = month < 10 ? '0' + month : month;

                      // Crear la cadena con el formato deseado
                      var formattedDate =
                        formattedDay + '/' + formattedMonth + '/' + year;

                      console.log(formattedDate);
                      //
                      this.formAct.patchValue({
                        closingDate: formattedDate,
                        statusRecord: 'CERRADA',
                      });
                      this.VESTATUS = respo.data[0].estatus_final;
                      console.log('Respuesta STATUS V: ', this.VESTATUS);
                      let params = {
                        observations: this.formAct.get('textarea').value,
                        universalFolio: this.form.get('scanningFoli').value,
                        statusProceedings: 'CERRADA',
                        closeDate: new Date(),
                      };
                      console.log('this.ActaID ', this.idActa);
                      console.log('params PUT ', params);
                      this.detailProceeDelRecService
                        .putActaStatus(this.idActa, params)
                        .subscribe({
                          next: resp => {
                            console.log('response de Put ', resp);
                            this.updateStatus(this.datatable[i].goodNumb);
                          },
                        });
                    },
                  });
                },
              });
          } else {
            this.count += 1;
            if (this.count >= this.datatable.length) {
              this.alertInfo(
                'warning',
                'El Acta no Contiene Bienes Validos, no se Podrá Cerrar.',
                ''
              );
            }
          }
        }
      } else {
        this.alertInfo(
          'warning',
          'El Acta no Contiene Bienes, no se Podrá Cerrar.',
          ''
        );
      }
    } else {
      this.alertInfo('warning', 'El Acta se Encuentra Cerrada ', '');
    }
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
            this.ConsultAER();
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

  clearall() {
    this.form.reset();
    this.formAct.reset();
    this.keyActa = undefined;
    this.localStorage.load([]);
    this.goods = false;
    this.fool = false;
    this.totalItems = 0;
    this.close = false;
    this.yData = false;
  }
}
