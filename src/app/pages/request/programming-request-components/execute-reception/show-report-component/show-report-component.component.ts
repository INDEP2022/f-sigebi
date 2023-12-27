import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IGood } from 'src/app/core/models/good/good.model';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { IReceipt } from 'src/app/core/models/receipt/receipt.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { GelectronicFirmService } from 'src/app/core/services/ms-gelectronicfirm/gelectronicfirm.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { OrderServiceService } from 'src/app/core/services/ms-order-service/order-service.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared';
import { environment } from 'src/environments/environment';
import { LIST_REPORTS_COLUMN } from '../../../transfer-request/tabs/notify-clarifications-impropriety-tabs-component/print-report-modal/list-reports-column';
import { UploadFielsModalComponent } from '../../../transfer-request/tabs/notify-clarifications-impropriety-tabs-component/upload-fiels-modal/upload-fiels-modal.component';

@Component({
  selector: 'app-show-report-component',
  templateUrl: './show-report-component.component.html',
  styles: [],
})
export class ShowReportComponentComponent extends BasePage implements OnInit {
  private pdf: PDFDocumentProxy;
  idTypeDoc: number = 0;
  idProg: number = 0;
  idSampleOrder: number = 0;
  idprogDel: number = 0;
  typeNotification: number = 0;
  orderSampleId: number = 0;
  receiptId: number = 0;
  idSample: number = 0;
  idReportAclara: any; //ID de los reportes
  isPdfLoaded = false;
  title: string = '';
  btnTitle: string = 'Firmar Reporte';
  printReport: boolean = true;
  listSigns: boolean = false;
  msjCheck: boolean = false;
  showButtonFirm: boolean = false;
  infoFirmantes: any[] = [];
  btnSubTitle: string = 'Vista Previa Reporte';
  signatories: ISignatories[] = [];
  selectedRow: any = null;
  urlBaseReport = `${environment.API_URL}processgoodreport/report/showReport?nombreReporte=`;
  src: string = '';
  keyDoc: string = '';
  isAttachDoc: boolean = false;
  rowSelected: boolean = false;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  receipt: IReceipt;
  signatore: ISignatories;
  programming: Iprogramming;
  nomReport: string = '';
  goodsId: string = '';
  actId: number = 0;
  formLoading: boolean = false;
  loadingButton: boolean = false;
  showTDR: boolean = false;
  receiptGuards: any;
  goodId: number = 0;
  typeFirm: string = '';
  guardReception: any;
  proceedingInfo: IProceedings;
  userInfo: any;
  idOrderService: number = 0;
  annexW: boolean = false;
  annexk: boolean = false;
  idRegionalDelegation: number = 0; //parametro pasado desde el padre
  process: string = '';
  orderServiceTask: number = null;
  typeAnnex: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    private receptionGoodService: ReceptionGoodService,
    private signatoriesService: SignatoriesService,
    private gelectronicFirmService: GelectronicFirmService,
    private authService: AuthService,
    private wContentService: WContentService,
    private programmingService: ProgrammingRequestService,
    private programminGoodService: ProgrammingGoodService,
    private goodService: GoodService,
    private proceedingService: ProceedingsService,
    private historyGoodService: HistoryGoodService,
    private orderService: OrderServiceService,
    private samplingGoodService: SamplingGoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: true,
      actions: {
        columnTitle: 'Cargar Archivos',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
      },
      edit: {
        editButtonContent: '<i class="fa fa-upload text-primary"></i>',
      },
      columns: { ...LIST_REPORTS_COLUMN },
    };
  }

  ngOnInit(): void {
    if (this.showTDR) {
      this.title = 'ETIQUETA';
    } else {
      this.title = 'Imprimir Reporte';
    }

    if (this.typeFirm == 'autografa' || this.typeFirm == 'autograf') {
      this.btnTitle = 'Adjuntar Documento';
    }
    this.formLoading = true;
    this.showReportByTypeDoc();

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSignatories());

    if (this.idProg || this.idSampleOrder) {
      this.getReceipt();
    }

    if (this.signatore) {
      this.registerSign();
    }

    this.getInfoUserLog();
  }

  showReportByTypeDoc() {
    if (this.idTypeDoc == 103) {
      let linkDoc: string = `${this.urlBaseReport}Recibo_Entrega.jasper&ID_PROG=${this.idProg}&ID_RECIBO=${this.receipt.id}&ID_ACTA=${this.receipt.actId}`;
      this.src = linkDoc;
      this.formLoading = false;
    }

    if (this.idTypeDoc == 221) {
      let linkDoc: string = `${this.urlBaseReport}oficio_programacion_recepcion.jasper&ID_PROGRAMACION=${this.idProg}`;
      this.src = linkDoc;
      this.formLoading = false;
    }

    if (
      this.idTypeDoc == 106 ||
      this.idTypeDoc == 107 ||
      this.idTypeDoc == 210
    ) {
      let linkDoc: string = `${this.urlBaseReport}${this.nomReport}&ID_ACTA=${this.actId}&ID_PROGRAMACION=${this.idProg}`;
      this.src = linkDoc;
      this.formLoading = false;
    }

    if (this.idTypeDoc == 185 || this.idTypeDoc == 186) {
      let linkDoc: string = `${this.urlBaseReport}Recibo_Resguardo.jasper&ID_RECIBO_RESGUARDO=${this.receiptGuards.id}`;
      this.src = linkDoc;
      this.formLoading = false;
    }

    if (this.showTDR) {
      if (this.goodId) {
        let linkDoc: string = `${this.urlBaseReport}Etiqueta_TDR.jasper&idSolicitud=${this.programming?.id}&CID_BIEN=${this.goodId}`;
        this.src = linkDoc;
        this.formLoading = false;
      } else {
        let linkDoc: string = `${this.urlBaseReport}Etiqueta_TDR.jasper&idSolicitud=${this.programming?.id}`;

        this.src = linkDoc;
        this.formLoading = false;
      }

      if (this.goodsId) {
        let linkDoc: string = `${this.urlBaseReport}Etiqueta_TDR.jasper&idSolicitud=${this.programming?.id}&CID_BIEN=${this.goodsId}`;
        this.src = linkDoc;
        this.formLoading = false;
      }
    }
    if (this.idprogDel && this.typeNotification == 1) {
      let linkDoc: string = `${this.urlBaseReport}NotificacionParaDestruccion.jasper&ID_PROG_ENTREGA=${this.idprogDel}`;
      this.src = linkDoc;

      this.formLoading = false;
    }

    if (this.idprogDel && this.typeNotification == 2) {
      let linkDoc: string = `${this.urlBaseReport}NotificacionDestruccionFondos.jasper&ID_PROG_ENTREGA=${this.idprogDel}`;
      this.src = linkDoc;

      this.formLoading = false;
    }

    if (this.idOrderService) {
      let linkDoc: string = `${this.urlBaseReport}orden_servicio.jasper&ordenServicioID=${this.idOrderService}`;
      this.src = linkDoc;
      this.formLoading = false;
    }

    if (this.idOrderService) {
      let linkDoc: string = `${this.urlBaseReport}orden_servicio.jasper&ordenServicioID=${this.idOrderService}`;
      this.src = linkDoc;
      this.formLoading = false;
    }

    if (this.idTypeDoc == 198 && this.annexW == true) {
      let linkDoc: string = `${this.urlBaseReport}AnexoOrdenesW.jasper&ID_ORDE_SERVICIO=${this.idOrderService}&ID_TIPO_DOCTO=2`;
      this.src = linkDoc;
      this.formLoading = false;
    }

    if (this.process == 'validation-report' && this.idOrderService) {
      let linkDoc: string = `${this.urlBaseReport}reporte_implementacion.jasper&ordenServicioID=${this.idOrderService}`;
      this.src = linkDoc;
      this.formLoading = false;
    }

    if (this.idTypeDoc == 197 && this.orderSampleId) {
      let linkDoc: string = `${this.urlBaseReport}AnexoKOrdenes.jasper&ID_MUESTREO_ORDEN=${this.orderSampleId}&ID_TIPO_DOCTO=197`;
      this.src = linkDoc;
      this.formLoading = false;
    }

    if (this.idTypeDoc == 218) {
      let linkDoc: string = `${this.urlBaseReport}FormatoReclamacionMuestreo.jasper&ID_MUESTREO=${this.idSample}&ID_TIPO_DOCTO=${this.idTypeDoc}`;
      this.src = linkDoc;
      this.formLoading = false;
    }

    if (this.idTypeDoc == 219) {
      let linkDoc: string = `${this.urlBaseReport}AnexoKBienes.jasper&ID_MUESTREO=${this.idSample}&ID_TIPO_DOCTO=${this.idTypeDoc}`;
      this.src = linkDoc;
      this.formLoading = false;
    }
  }

  getReceipt() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.idProg;
    this.receptionGoodService.getReceipt(params.getValue()).subscribe({
      next: response => {
        //this.createPersonsSing(response.data[0]);
      },
      error: error => {},
    });
  }

  getInfoUserLog() {
    this.programmingService.getUserInfo().subscribe(data => {
      this.userInfo = data;
    });
  }

  getSignatories() {
    const learnedType = this.idTypeDoc;
    let learnedId = null;
    if (this.idTypeDoc == 218 || this.idTypeDoc == 219) {
      learnedId = this.idSample;
    } else {
      learnedId = this.programming?.id;
    }

    if (this.idTypeDoc == 197) {
      learnedId = this.orderSampleId;
    }
    this.loading = true;
    this.signatoriesService
      .getSignatoriesFilter(learnedType, learnedId)
      .subscribe({
        next: response => {
          this.signatories = response.data;
          this.totalItems = response.count;
          this.loading = false;

          const filter = this.signatories.filter(userSign => {
            return userSign.validationocsp;
          });

          if (filter.length == this.signatories.length) {
            this.showButtonFirm = true;
          }
        },

        error: error => (this.loading = false),
      });
  }

  onLoaded(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isPdfLoaded = true;
  }

  print() {
    this.pdf.getData().then(u8 => {
      let blob = new Blob([u8.buffer], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);
      let config = {
        initialState: {
          documento: {
            urlDoc: this.sanitizer.bypassSecurityTrustResourceUrl(url),
            type: 'pdf',
          },
          callback: (response: any) => {},
        }, //pasar datos por aca
        class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
        keyboard: false,
        ignoreBackdropClick: true,
      };
      this.modalService.show(PreviewDocumentsComponent, config);
    });
  }

  signDocument() {
    if (this.idTypeDoc == 107 && this.typeFirm == 'autografa') {
      this.modalRef.content.callback(true, this.typeFirm);
      this.modalRef.hide();
    }

    if (this.idTypeDoc == 218 && this.typeFirm == 'autografa') {
      this.modalRef.content.callback(true, this.typeFirm);
      this.close();
    }

    if (this.idTypeDoc == 219 && this.typeFirm == 'autografa') {
      this.modalRef.content.callback(true, this.typeFirm);
      this.close();
    }

    if (this.idTypeDoc == 103 && this.typeFirm == 'autograf') {
      this.modalRef.content.callback(true, this.typeFirm);
      this.modalRef.hide();
    }

    if (this.idTypeDoc == 210 && this.typeFirm == 'autografa') {
      this.modalRef.content.callback(true, this.typeFirm);
      this.modalRef.hide();
    }

    if (this.idTypeDoc == 106 && this.typeFirm == 'autografa') {
      this.modalRef.content.callback(true, this.typeFirm);
      this.modalRef.hide();
    }

    if (
      this.idTypeDoc == 186 ||
      this.idTypeDoc == 187 ||
      this.idTypeDoc == 185
    ) {
      this.modalRef.content.callback(true, this.typeFirm);
      this.modalRef.hide();
    }

    if (this.idTypeDoc == 197 && this.typeFirm == 'autografa') {
      this.modalRef.content.callback(true, this.typeFirm);
      this.modalRef.hide();
    }

    if (
      (this.idTypeDoc == 221 && this.typeFirm == 'electronica') ||
      (this.idTypeDoc == 210 && this.typeFirm == 'electronica') ||
      (this.idTypeDoc == 103 && this.typeFirm == 'electronica') ||
      (this.idTypeDoc == 106 && this.typeFirm == 'electronica') ||
      (this.idTypeDoc == 107 && this.typeFirm == 'electronica') ||
      (this.idTypeDoc == 197 && this.typeFirm == 'electronica') ||
      (this.idTypeDoc == 218 && this.typeFirm == 'electronica') ||
      (this.idTypeDoc == 219 && this.typeFirm == 'electronica') ||
      (this.idOrderService && this.typeFirm == 'electronica')
    ) {
      if (!this.listSigns && this.printReport && !this.isAttachDoc) {
        this.printReport = false;
        this.listSigns = true;
        this.title = 'Firma electrónica';
      } else if (!this.listSigns && this.printReport && this.isAttachDoc) {
        //adjuntar el reporte
        this.openMessage2();
      }
    }

    //mostrar listado de reportes
    /*if (
      this.idTypeDoc == 185 ||
      this.idTypeDoc == 186 ||
      (this.idTypeDoc == 103 && this.typeFirm == 'autograf') ||
      (this.idTypeDoc == 107 && this.typeFirm == 'autografa')
    ) {
  
      this.modalRef.content.callback(true);
      this.modalRef.hide();
    } else {
      
    }*/
  }

  registerSign() {
    const learnedType = 221;
    const learndedId = this.idProg;
    this.signatoriesService
      .getSignatoriesFilter(learnedType, learndedId)
      .subscribe({
        next: response => {
          this.signatoriesService
            .deleteFirmante(Number(response.data[0].signatoryId))
            .subscribe({
              next: async () => {
                const createSignatore = await this.createSign(
                  this.idProg,
                  221,
                  'PROGRAMACIONES',
                  'TIPO_FIRMA',
                  this.signatore.nameSignatore,
                  this.signatore.chargeSignatore
                );
                if (createSignatore) this.getSignatories();
              },
              error: error => {},
            });
        },
        error: async error => {
          const createSignatore = await this.createSign(
            this.idProg,
            221,
            'PROGRAMACIONES',
            'TIPO_FIRMA',
            this.signatore.nameSignatore,
            this.signatore.chargeSignatore
          );
          if (createSignatore) this.getSignatories();
        },
      });
  }

  createSign(
    keyDoc: number,
    docId: number,
    boardSig: string,
    columnSig: string,
    name: string,
    position: string
  ) {
    return new Promise((resolve, reject) => {
      const formData: Object = {
        learnedId: keyDoc,
        learnedType: docId,
        boardSignatory: boardSig,
        columnSignatory: columnSig,
        name: name,
        post: position,
      };

      this.signatoriesService.create(formData).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {},
      });
    });
  }

  sendSign() {
    //verificar que el estado de registro este como "datos completo" y enviarlo!
    let message = '¿Está seguro de enviar la información a firmar?';
    this.openMessage(message);
  }

  openMessage(message: string): void {
    this.alertQuestion('question', 'Confirmación', `${message}`).then(
      question => {
        if (question.isConfirmed) {
          this.loadingButton = true;
          if (this.idTypeDoc == 221) {
            this.gelectronicFirmService
              .firmDocument(this.programming?.id, 'ProgramacionRecibo', {})
              .subscribe({
                next: () => {
                  this.loadingButton = false;
                  this.msjCheck = true;

                  this.alert(
                    'success',
                    'Correcto',
                    'Documento firmado correctamente'
                  );
                },
                error: () => {
                  this.alert(
                    'error',
                    'Acción Invalida',
                    'Errror al firmar el documento'
                  );
                  this.loadingButton = false;
                },
              });
          }

          if (this.idTypeDoc == 103) {
            const idKeyDoc =
              this.idProg + '-' + this.receipt.actId + '-' + this.receipt.id;

            this.gelectronicFirmService
              .firmDocument(
                idKeyDoc,
                'reciboEntregaFisicaDeBienesPropiedadDelFiscoFederal',
                {}
              )
              .subscribe({
                next: () => {
                  this.msjCheck = true;
                  this.loadingButton = false;
                  this.alert(
                    'success',
                    'Correcto',
                    'Documento firmado correctamente'
                  );
                },
                error: () => {
                  this.alert(
                    'error',
                    'Acción Invalida',
                    'Errror al firmar el documento'
                  );
                  this.loadingButton = false;
                },
              });
          }

          if (this.idTypeDoc == 210) {
            const idKeyDoc = this.programming?.id + '-' + this.actId;

            this.gelectronicFirmService
              .firmDocument(idKeyDoc, 'actaSat', {})
              .subscribe({
                next: () => {
                  this.loadingButton = false;
                  this.msjCheck = true;
                  this.alert(
                    'success',
                    'Correcto',
                    'Documento firmado correctamente'
                  );
                },
                error: () => {
                  this.alertInfo(
                    'error',
                    'Acción Inválida',
                    'No fue posible firmar el documento'
                  ).then();
                  //this.msjCheck = true;

                  this.loadingButton = false;
                },
              });
          }

          if (this.idTypeDoc == 106) {
            const idKeyDoc = this.programming?.id + '-' + this.actId;

            this.gelectronicFirmService
              .firmDocument(idKeyDoc, 'actaAsegurados', {})
              .subscribe({
                next: () => {
                  this.msjCheck = true;
                  this.loadingButton = false;
                  this.alert(
                    'success',
                    'Correcto',
                    'Documento firmado correctamente'
                  );
                },
                error: () => {
                  //this.msjCheck = true;
                  this.loadingButton = false;
                  this.alertInfo(
                    'error',
                    'Acción Inválida',
                    'No fue posible firmar el documento'
                  ).then();
                },
              });
          }

          if (this.idTypeDoc == 107) {
            const idKeyDoc = this.programming?.id + '-' + this.actId;

            this.gelectronicFirmService
              .firmDocument(idKeyDoc, 'actasVoluntarias', {})
              .subscribe({
                next: () => {
                  this.msjCheck = true;
                  this.loadingButton = false;
                  this.alert(
                    'success',
                    'Correcto',
                    'Documento firmado correctamente'
                  );
                },
                error: () => {
                  //this.msjCheck = true;
                  this.loadingButton = false;
                  this.alertInfo(
                    'error',
                    'Acción Inválida',
                    'No fue posible firmar el documento'
                  ).then();
                },
              });
          }

          if (this.idTypeDoc == 218) {
            const idKeyDoc = this.idSample;

            this.gelectronicFirmService
              .firmDocument(idKeyDoc, 'AnexoJ', {})
              .subscribe({
                next: () => {
                  this.msjCheck = true;
                  this.loadingButton = false;
                  this.alert(
                    'success',
                    'Correcto',
                    'Documento firmado correctamente'
                  );
                },
                error: () => {
                  //this.msjCheck = true;
                  this.loadingButton = false;
                  this.alertInfo(
                    'error',
                    'Acción Inválida',
                    'No fue posible firmar el documento'
                  ).then();
                },
              });
          }

          if (this.idTypeDoc == 219) {
            const idKeyDoc = this.idSample + '-K';

            this.gelectronicFirmService
              .firmDocument(idKeyDoc, 'AnexoKMuestreoBien', {})
              .subscribe({
                next: () => {
                  this.msjCheck = true;
                  this.loadingButton = false;
                  this.alert(
                    'success',
                    'Correcto',
                    'Documento firmado correctamente'
                  );
                },
                error: () => {
                  //this.msjCheck = true;
                  this.loadingButton = false;
                  this.alertInfo(
                    'error',
                    'Acción Inválida',
                    'No fue posible firmar el documento'
                  ).then();
                },
              });
          }

          if (this.idTypeDoc == 197) {
            const idKeyDoc = this.orderSampleId + '-K';

            this.gelectronicFirmService
              .firmDocument(idKeyDoc, 'AnexoKMuestreoOrdenServicio', {})
              .subscribe({
                next: () => {
                  this.msjCheck = true;
                  this.loadingButton = false;
                  this.alert(
                    'success',
                    'Correcto',
                    'Documento firmado correctamente'
                  );
                },
                error: () => {
                  //this.msjCheck = true;
                  this.loadingButton = false;
                  this.alertInfo(
                    'error',
                    'Acción Inválida',
                    'No fue posible firmar el documento'
                  ).then();
                },
              });

            /* const idKeyDoc = this.orderSampleId + '-K';
            this.saveElectronicSign(idKeyDoc, 'AnexoKMuestreoOrdenServicio'); */
          }

          /*if (this.idOrderService) {
            const idKeyDoc = this.programming.id + ' - ' + this.idOrderService;
            this.saveElectronicSign(idKeyDoc, 'order_service');
          } */
        }
      }
    );
  }

  saveElectronicSign(idKeyDoc: any, title: any, body = {}) {
    this.gelectronicFirmService.firmDocument(idKeyDoc, title, body).subscribe({
      next: response => {
        this.msjCheck = true;
        this.loadingButton = false;
        this.alert('success', 'Correcto', 'Documento firmado correctamente');
      },
      error: error => {
        //this.msjCheck = true;
        this.loadingButton = false;
        this.alertInfo(
          'error',
          'Acción Inválida',
          'No fue posible firmar el documento'
        ).then();
      },
    });
  }

  nextStep() {
    if (this.msjCheck == true) {
      this.listSigns = false;
      this.printReport = true;
      this.isAttachDoc = true;
      this.title = 'Imprimir Reporte';
      this.btnTitle = 'Adjuntar Documento';
      this.btnSubTitle = 'Imprimir Reporte';
    }
  }

  uploadData(signatories: ISignatories): void {
    const idReportAclara = this.receiptId;
    let config: ModalOptions = {
      initialState: {
        idReportAclara,
        signatories,
        typeReport: this.receiptId,
        callback: (next: boolean) => {
          if (next) {
            this.getSignatories();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true,
    };
    this.modalService.show(UploadFielsModalComponent, config);
  }

  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  close() {
    if (this.showTDR) {
      this.modalRef.content.callback(true);
      this.modalRef.hide();
    } else {
      this.modalRef.hide();
    }
  }

  openMessage2(): void {
    this.alertQuestion(
      'question',
      '¿Quiere continuar con el proceso?',
      ''
    ).then(question => {
      if (question.isConfirmed) {
        if (
          (this.idTypeDoc == 107 && this.typeFirm == 'electronica') ||
          (this.idTypeDoc == 106 && this.typeFirm == 'electronica') ||
          (this.idTypeDoc == 103 && this.typeFirm == 'electronica') ||
          (this.idTypeDoc == 210 && this.typeFirm == 'electronica') ||
          (this.idTypeDoc == 221 && this.typeFirm == 'electronica') ||
          (this.idTypeDoc == 197 && this.typeFirm == 'electronica') ||
          (this.idTypeDoc == 218 && this.typeFirm == 'electronica') ||
          (this.idTypeDoc == 219 && this.typeFirm == 'electronica')
        ) {
          this.validAttachDoc();
        }
        /*if (
          this.idTypeDoc == 221 ||
          this.typeFirm == 'electronic' ||
          this.idTypeDoc == 107
        ) {
          this.validAttachDoc();
        }

        if (
          this.idTypeDoc == 106 ||
          this.idTypeDoc == 107 ||
          this.idTypeDoc == 108 ||
          this.idTypeDoc == 210
        ) {
          this.close();
          this.modalRef.content.callback(true);
        } */
      }
    });
  }

  validAttachDoc() {
    if (this.idTypeDoc == 221 && this.typeFirm == 'electronica') {
      let token = this.authService.decodeToken();
      const extension = '.pdf';
      const nombreDoc = `Oficio Programación Recepción${extension}`;
      const contentType: string = '.pdf';
      const formData = {
        keyDoc: this.programming?.id,
        xDelegacionRegional: this.programming?.regionalDelegationNumber,
        dDocTitle: nombreDoc,
        xNombreProceso: 'Aceptar Solicitud Programación',
        xTipoDocumento: 221,
        xNivelRegistroNSBDB: 'Bien',
        dDocType: contentType,
        dDocAuthor: token.name,
        dInDate: new Date(),
        xidProgramacion: this.programming?.id,
      };

      this.pdf.getData().then(u8 => {
        let blob = new Blob([u8.buffer], {
          type: 'application/pdf',
        });
        this.wContentService
          .addDocumentToContent(
            nombreDoc,
            contentType,
            JSON.stringify(formData),
            blob,
            extension
          )
          .subscribe({
            next: async resp => {
              const updateProgramming = await this.updateProgramming(
                resp.dDocName
              );

              if (updateProgramming) {
                this.alert('success', 'El Documento ha sido Guardado', '');
                this.modalRef.content.callback(true);
                this.close();
              }
            },
            error: error => {},
          });
      });
    } else {
      if (this.idTypeDoc == 103 && this.typeFirm == 'electronica') {
        const idProg = this.programming?.id;
        //const idReceipt = this.
        const formData = {
          keyDoc:
            this.programming.id +
            '-' +
            this.receipt.actId +
            '-' +
            this.receipt.id,
          xNivelRegistroNSBDB: 'Bien',
          xNoProgramacion: this.programming?.id,
          xNombreProceso: 'Ejecutar Recepción',
          xDelegacionRegional: this.programming?.regionalDelegationNumber,
          xFolioProgramacion: this.programming?.folio,
          xFolioRecibo: this.receipt.folioReceipt,
          dDocTitle: this.receipt.folioReceipt,
          dSecurityGroup: 'Public',
          xidBien: this.goodId,
          xidTransferente: this.programming?.tranferId,
          xTipoDocumento: 103,
        };

        const extension = '.pdf';
        const docName = 'Recibo Resguardo';
        const contentType: string = '.pdf';

        this.pdf.getData().then(u8 => {
          let blob = new Blob([u8.buffer], {
            type: 'application/pdf',
          });
          this.wContentService
            .addDocumentToContent(
              docName,
              contentType,
              JSON.stringify(formData),
              blob,
              extension
            )
            .subscribe({
              next: async response => {
                const updateReceipt = await this.updateReceipt(
                  response.dDocName
                );

                if (updateReceipt) {
                  const updateProgrammingGood =
                    await this.updateProgrammingGood();

                  if (updateProgrammingGood) {
                    const updateGood = await this.updateGood();

                    if (updateGood) {
                      //const createHistGood = await this.createHistorailGood();

                      this.alertInfo(
                        'success',
                        'Acción Correcta',
                        'Documento adjuntado correctamente'
                      ).then(question => {
                        if (question.isConfirmed) {
                          this.close();
                          this.modalRef.content.callback(true, this.typeFirm);
                        }
                      });
                    }
                  }
                }
              },
              error: error => {},
            });
        });
      } else if (this.idTypeDoc == 107 && this.typeFirm == 'electronica') {
        const idProg = this.programming?.id;

        //const idReceipt = this.
        const formData = {
          keyDoc:
            this.programming?.id + '-' + this.proceedingInfo.folioProceedings,
          xNivelRegistroNSBDB: 'Bien',
          xfolioActa: this.proceedingInfo.folioProceedings,
          xNoProgramacion: this.programming?.id,
          xNombreProceso: 'Formalizar Recepción',
          xDelegacionRegional: this.programming?.regionalDelegationNumber,
          xFolioProgramacion: this.programming?.folio,
          dDocTitle: this.proceedingInfo.folioProceedings,
          dSecurityGroup: 'Public',
          xidBien: this.goodId,
          xidTransferente: this.programming?.tranferId,
          xTipoDocumento: 107,
        };

        const extension = '.pdf';
        const docName = this.proceedingInfo.folioProceedings;
        const contentType: string = '.pdf';

        this.pdf.getData().then(u8 => {
          let blob = new Blob([u8.buffer], {
            type: 'application/pdf',
          });
          this.wContentService
            .addDocumentToContent(
              docName,
              contentType,
              JSON.stringify(formData),
              blob,
              extension
            )
            .subscribe({
              next: async response => {
                const updateReceipt = await this.procedding(response.dDocName);

                if (updateReceipt) {
                  this.alertInfo(
                    'success',
                    'Acción Correcta',
                    'Documento adjuntado correctamente'
                  ).then(question => {
                    if (question.isConfirmed) {
                      this.close();
                      this.modalRef.content.callback(true, this.typeFirm);
                    }
                  });
                }
              },
              error: error => {},
            });
        });
      } else if (this.idTypeDoc == 210 && this.typeFirm == 'electronica') {
        const idProg = this.programming?.id;

        //const idReceipt = this.
        const formData = {
          keyDoc:
            this.programming.id + '-' + this.proceedingInfo.folioProceedings,
          xNivelRegistroNSBDB: 'Bien',
          xfolioActa: this.proceedingInfo.folioProceedings,
          xNoProgramacion: this.programming?.id,
          xNombreProceso: 'Formalizar Recepción',
          xDelegacionRegional: this.programming?.regionalDelegationNumber,
          xFolioProgramacion: this.programming?.folio,
          dDocTitle: this.proceedingInfo.folioProceedings,
          dSecurityGroup: 'Public',
          xidBien: this.goodId,
          xidTransferente: this.programming?.tranferId,
          xTipoDocumento: 210,
        };

        const extension = '.pdf';
        const docName = this.proceedingInfo.folioProceedings;
        const contentType: string = '.pdf';

        this.pdf.getData().then(u8 => {
          let blob = new Blob([u8.buffer], {
            type: 'application/pdf',
          });
          this.wContentService
            .addDocumentToContent(
              docName,
              contentType,
              JSON.stringify(formData),
              blob,
              extension
            )
            .subscribe({
              next: async response => {
                const updateReceipt = await this.procedding(response.dDocName);

                if (updateReceipt) {
                  this.alertInfo(
                    'success',
                    'Acción Correcta',
                    'Documento adjuntado correctamente'
                  ).then(question => {
                    if (question.isConfirmed) {
                      this.close();
                      this.modalRef.content.callback(true, this.typeFirm);
                    }
                  });
                }
              },
              error: error => {},
            });
        });
      } else if (this.idTypeDoc == 106 && this.typeFirm == 'electronica') {
        const idProg = this.programming?.id;

        //const idReceipt = this.
        const formData = {
          keyDoc:
            this.programming?.id + '-' + this.proceedingInfo.folioProceedings,
          xNivelRegistroNSBDB: 'Bien',
          xfolioActa: this.proceedingInfo.folioProceedings,
          xNoProgramacion: this.programming?.id,
          xNombreProceso: 'Formalizar Recepción',
          xDelegacionRegional: this.programming?.regionalDelegationNumber,
          xFolioProgramacion: this.programming?.folio,
          dDocTitle: this.proceedingInfo.folioProceedings,
          dSecurityGroup: 'Public',
          xidBien: this.goodId,
          xidTransferente: this.programming?.tranferId,
          xTipoDocumento: 106,
        };

        const extension = '.pdf';
        const docName = this.proceedingInfo.folioProceedings;
        const contentType: string = '.pdf';

        this.pdf.getData().then(u8 => {
          let blob = new Blob([u8.buffer], {
            type: 'application/pdf',
          });
          this.wContentService
            .addDocumentToContent(
              docName,
              contentType,
              JSON.stringify(formData),
              blob,
              extension
            )
            .subscribe({
              next: async response => {
                const updateReceipt = await this.procedding(response.dDocName);

                if (updateReceipt) {
                  this.alertInfo(
                    'success',
                    'Acción Correcta',
                    'Documento adjuntado correctamente'
                  ).then(question => {
                    if (question.isConfirmed) {
                      this.close();
                      this.modalRef.content.callback(true, this.typeFirm);
                    }
                  });
                }
              },
              error: error => {},
            });
        });
      } else if (this.idTypeDoc == 197 && this.typeFirm == 'electronica') {
        const dDocTitle = this.idSampleOrder.toString() + '-K';
        const formData = {
          xNivelRegistroNSBDB: 'Solicitud',
          xNombreProceso: 'Muestreo Ordenes',
          xDelegacionRegional: this.idRegionalDelegation,
          dDocTitle: dDocTitle,
          dSecurityGroup: 'Public',
          xTipoDocumento: 197,
        };

        const extension = '.pdf';
        const docName = `MUESTREO_ORDENES${this.idSampleOrder}${moment(
          new Date()
        ).format('YYYYMMDD')}`;
        const contentType: string = '.pdf';

        this.pdf.getData().then(u8 => {
          let blob = new Blob([u8.buffer], {
            type: 'application/pdf',
          });
          this.wContentService
            .addDocumentToContent(
              docName,
              contentType,
              JSON.stringify(formData),
              blob,
              extension
            )
            .subscribe({
              next: async response => {
                const updateSampleOrder = await this.updateSampleOrder(
                  response.dDocName
                );
                if (updateSampleOrder) {
                  this.alertInfo(
                    'success',
                    'Acción Correcta',
                    'Documento adjuntado correctamente'
                  ).then(question => {
                    if (question.isConfirmed) {
                      this.close();
                      this.modalRef.content.callback(true, this.typeFirm);
                    }
                  });
                }
              },
              error: error => {},
            });
        });
      } else if (this.idOrderService && this.typeFirm == 'electronica') {
        let dDocTitle = '';
        if (this.orderServiceTask) {
          dDocTitle = this.idOrderService.toString() + '-OrderService';
        }
        const formData = {
          xNivelRegistroNSBDB: 'Solicitud',
          xNombreProceso: 'Ordenes Servicio',
          xDelegacionRegional: this.idRegionalDelegation,
          dDocTitle: dDocTitle,
          dSecurityGroup: 'Public',
          //xTipoDocumento: 197,
        };

        const extension = '.pdf';
        const docName = `ORDEN_SERVICO${this.idSampleOrder}${moment(
          new Date()
        ).format('YYYYMMDD')}`;
        const contentType: string = '.pdf';

        this.pdf.getData().then(u8 => {
          let blob = new Blob([u8.buffer], {
            type: 'application/pdf',
          });
          this.wContentService
            .addDocumentToContent(
              docName,
              contentType,
              JSON.stringify(formData),
              blob,
              extension
            )
            .subscribe({
              next: async response => {
                //const updateReceipt = await this.procedding(response.dDocName);
                const updateSampleOrder = await this.updateSampleOrder(
                  response.dDocName
                );
                if (updateSampleOrder) {
                  this.alertInfo(
                    'success',
                    'Acción Correcta',
                    'Documento adjuntado correctamente'
                  ).then(question => {
                    if (question.isConfirmed) {
                      this.close();
                      this.modalRef.content.callback(true, this.typeFirm);
                    }
                  });
                }
              },
              error: error => {},
            });
        });
      } else if (this.idTypeDoc == 218 && this.typeFirm == 'electronica') {
        const token = this.authService.decodeToken();
        const formData = {
          keyDoc: this.idSample,
          dDocTitle: 'Solicitud de Restitución de Bienes Faltantes y/o Dañados',
          xDelegacionRegional: token.department,
          xNombreProceso: 'Muestreo Bienes',
          xTipoDocumento: 218,
          xNivelRegistroNSBDB: 'Bien',
          dSecurityGroup: 'Public',
        };

        const extension = '.pdf';
        const docName =
          'Solicitud de Restitución de Bienes Faltantes y/o Dañados';
        const contentType: string = '.pdf';

        this.pdf.getData().then(u8 => {
          let blob = new Blob([u8.buffer], {
            type: 'application/pdf',
          });
          this.wContentService
            .addDocumentToContent(
              docName,
              contentType,
              JSON.stringify(formData),
              blob,
              extension
            )
            .subscribe({
              next: async response => {
                const updateSample = await this.updateSample(response.dDocName);
                if (updateSample) {
                  this.alertInfo(
                    'success',
                    'Acción Correcta',
                    'Documento adjuntado correctamente'
                  ).then(question => {
                    if (question.isConfirmed) {
                      this.close();
                      this.modalRef.content.callback(true, this.typeFirm);
                    }
                  });
                }
              },
              error: error => {},
            });
        });
      } else if (this.idTypeDoc == 219 && this.typeFirm == 'electronica') {
        const token = this.authService.decodeToken();
        const formData = {
          keyDoc: `${this.idSample} -K`,
          dDocTitle: 'Anexo K',
          xDelegacionRegional: token.department,
          xNombreProceso: 'Muestreo Bienes',
          xTipoDocumento: 219,
          xNivelRegistroNSBDB: 'Bien',
          dSecurityGroup: 'Public',
        };

        const extension = '.pdf';
        const docName = 'Anexo K';
        const contentType: string = '.pdf';

        this.pdf.getData().then(u8 => {
          let blob = new Blob([u8.buffer], {
            type: 'application/pdf',
          });
          this.wContentService
            .addDocumentToContent(
              docName,
              contentType,
              JSON.stringify(formData),
              blob,
              extension
            )
            .subscribe({
              next: async response => {
                const updateSample = await this.updateSampleK(
                  response.dDocName
                );
                if (updateSample) {
                  this.alertInfo(
                    'success',
                    'Acción Correcta',
                    'Documento adjuntado correctamente'
                  ).then(question => {
                    if (question.isConfirmed) {
                      this.close();
                      this.modalRef.content.callback(true, this.typeFirm);
                    }
                  });
                }
              },
              error: error => {},
            });
        });
      }
    }
  }

  procedding(docName: string) {
    return new Promise((resolve, reject) => {
      const formData: any = {
        id: this.proceedingInfo.id,
        idPrograming: this.programming?.id,
        statusProceeedings: 'CERRADO',
        id_content: docName,
      };

      this.proceedingService.updateProceeding(formData).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {},
      });
    });
  }

  updateGood() {
    return new Promise((resolve, reject) => {
      const goodsReception = this.guardReception.value;
      goodsReception.map((item: IGood) => {
        const formData: Object = {
          id: item.id,
          goodId: item.goodId,
          goodStatus: 'EN_RECEPCION',
        };
        this.goodService.updateByBody(formData).subscribe({
          next: response => {
            resolve(true);
          },
          error: error => {},
        });
      });
    });
  }

  updateReceipt(docName: string) {
    return new Promise((resolve, reject) => {
      const formData: any = {
        id: this.receipt.id,
        actId: this.receipt.actId,
        programmingId: this.programming?.id,
        statusReceipt: 'CERRADO',
        contentId: docName,
      };

      this.receptionGoodService.updateReceipt(formData).subscribe({
        next: () => {
          resolve(true);
        },
      });
    });
  }

  updateProgrammingGood() {
    return new Promise((resolve, reject) => {
      const goodsReception = this.guardReception.value;
      goodsReception.map((item: IGood) => {
        const formData: Object = {
          programmingId: this.programming?.id,
          goodId: item.id,
          status: 'EN_RECEPCION',
        };
        this.programminGoodService.updateGoodProgramming(formData).subscribe({
          next: response => {
            resolve(true);
          },
          error: error => {},
        });
      });
    });
  }

  updateProgramming(dDocName: string) {
    return new Promise((resolve, reject) => {
      const formData: Object = {
        contentId: dDocName,
      };

      this.programmingService
        .updateProgramming(this.programming?.id, formData)
        .subscribe({
          next: () => {
            resolve(true);
          },
          error: () => {
            resolve(false);
          },
        });
    });
  }

  /* createHistorailGood() {
    return new Promise((resolve, reject) => {
      const goodsReception = this.guardReception.value;
      goodsReception.map((item: IGood) => {
        const historyGood: IHistoryGood = {
          propertyNum: item.goodId,
          status: 'ADM',
          changeDate: new Date(),
          userChange: this.userInfo.name,
          statusChangeProgram: 'TR_UPD_HISTO_BIENES',
          reasonForChange: 'AUTOMATICO',
        };

        this.historyGoodService.create(historyGood).subscribe({
          next: response => {

            resolve(true);
          },
          error: error => {
           
          },
        });
      });
    });
  } */

  backStep() {
    this.listSigns = false;
    this.isAttachDoc = false;
    this.printReport = true;
  }

  updateSampleOrder(dDocName: string) {
    return new Promise((resolve, reject) => {
      const body = {
        idSamplingOrder: this.orderSampleId,
        idcontentk: dDocName,
      };
      this.orderService.updateSampleOrder(body).subscribe({
        next: () => {
          resolve(true);
        },
        error: error => {
          this.onLoadToast(
            'error',
            'error al actualizar el muestreo de ordenes'
          );
          reject(error);
        },
      });
    });
  }

  updateSample(dDocName: string) {
    return new Promise((resolve, reject) => {
      if (this.typeAnnex == 'annexJ-assets-classification') {
        const sampleData: ISample = {
          sampleId: this.idSample,
          contentId: dDocName,
        };

        this.samplingGoodService.updateSample(sampleData).subscribe({
          next: () => {
            resolve(true);
          },
        });
      } else if (this.typeAnnex == 'sign-annexJ-assets-classification') {
        const sampleData: ISample = {
          sampleId: this.idSample,
          contentTeId: dDocName,
        };

        this.samplingGoodService.updateSample(sampleData).subscribe({
          next: () => {
            resolve(true);
          },
        });
      }
    });
  }

  updateSampleK(dDocName: string) {
    return new Promise((resolve, reject) => {
      if (this.typeAnnex == 'annex-assets-classification') {
        const sampleData: ISample = {
          sampleId: this.idSample,
          contentIdK: dDocName,
        };

        this.samplingGoodService.updateSample(sampleData).subscribe({
          next: () => {
            resolve(true);
          },
        });
      } else if (this.typeAnnex == 'sign-annex-assets-classification') {
        const sampleData: ISample = {
          sampleId: this.idSample,
          contentKSaeId: dDocName,
        };

        this.samplingGoodService.updateSample(sampleData).subscribe({
          next: () => {
            resolve(true);
          },
        });
      }
    });
  }
}
