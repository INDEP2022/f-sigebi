import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { IReceipt } from 'src/app/core/models/receipt/receipt.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { GelectronicFirmService } from 'src/app/core/services/ms-gelectronicfirm/gelectronicfirm.service';
import { ProgrammingRequestService } from 'src/app/core/services/ms-programming-request/programming-request.service';
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
  receiptId: number = 0;
  isPdfLoaded = false;
  title: string = 'Imprimir Reporte';
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
  actId: number = 0;
  constructor(
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    private receptionGoodService: ReceptionGoodService,
    private signatoriesService: SignatoriesService,
    private gelectronicFirmService: GelectronicFirmService,
    private authService: AuthService,
    private wContentService: WContentService,
    private programmingService: ProgrammingRequestService
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
    console.log('actId', this.actId);
    console.log('progId', this.idProg);
    console.log('nomReport', this.nomReport);
    console.log('typeReport', this.idTypeDoc);
    this.showReportByTypeDoc();
    this.getReceipt();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSignatories());

    if (this.signatore) {
      this.registerSign();
    }
  }

  showReportByTypeDoc() {
    if (this.idTypeDoc == 103) {
      let linkDoc: string = `${this.urlBaseReport}Recibo_Entrega.jasper&ID_PROG=${this.idProg}&ID_RECIBO=${this.receipt.id}&ID_ACTA=${this.receipt.actId}`;
      this.src = linkDoc;
    }

    if (this.idTypeDoc == 221) {
      let linkDoc: string = `${this.urlBaseReport}oficio_programacion_recepcion.jasper&ID_PROGRAMACION=${this.idProg}`;
      this.src = linkDoc;
    }

    if (
      this.idTypeDoc == 106 ||
      this.idTypeDoc == 107 ||
      this.idTypeDoc == 210
    ) {
      let linkDoc: string = `${this.urlBaseReport}${this.nomReport}&ID_ACTA=${this.actId}&ID_PROGRAMACION=${this.idProg}`;
      this.src = linkDoc;
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

  getSignatories() {
    const learnedType = this.idTypeDoc;
    const learnedId = this.idProg;
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
        ignoreBackdropClick: true, //ignora el click fuera del modal
      };
      this.modalService.show(PreviewDocumentsComponent, config);
    });
  }

  signDocument() {
    //mostrar listado de reportes

    if (!this.listSigns && this.printReport && !this.isAttachDoc) {
      // if(this.notificationValidate == 'Y'){
      //   console.log('Soy una notificación, no es necesario validar firmante creado');
      // } else {
      //   console.log('Soy un dictamen, es necesario validar firmante para evitar duplicidad');
      //   this.verificateFirm();
      // }
      this.printReport = false;
      this.listSigns = true;
      this.title = 'Firma electrónica';
    } else if (!this.listSigns && this.printReport && this.isAttachDoc) {
      //adjuntar el reporte
      let message = '¿Está seguro que quiere cargar el documento?';
      this.openMessage2(message);
    }
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
          console.log('firmantes creados');
          resolve(true);
        },
        error: error => {
          console.log('error', error);
        },
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
          if (this.idTypeDoc == 221) {
            this.gelectronicFirmService
              .firmDocument(this.idProg, 'ProgramacionRecibo', {})
              .subscribe({
                next: response => {
                  this.msjCheck = true;
                },
                error: error => {
                  this.msjCheck = true;
                },
              });
          }

          if (this.idTypeDoc == 103) {
            const idKeyDoc =
              this.idProg + '-' + this.receipt.actId + '-' + this.receipt.id;

            this.signatories.map(item => {
              this.gelectronicFirmService
                .firmDocument(
                  idKeyDoc,
                  'reciboEntregaFisicaDeBienesPropiedadDelFiscoFederal',
                  {}
                )
                .subscribe({
                  next: response => {
                    this.msjCheck = true;
                  },
                  error: error => {
                    this.msjCheck = true;
                  },
                });
            });
          }
        }
      }
    );
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
      ignoreBackdropClick: true,
    };
    this.modalService.show(UploadFielsModalComponent, config);
  }

  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  close() {
    this.modalRef.hide();
  }

  openMessage2(message: string): void {
    this.alertQuestion(undefined, 'Confirmación', message, 'Aceptar').then(
      question => {
        if (question.isConfirmed) {
          if (this.idTypeDoc == 221) {
            this.validAttachDoc();
          }

          if (this.idTypeDoc == 103) {
            this.modalRef.content.callback(true);
            this.modalRef.hide();
          }
        }
      }
    );
  }

  validAttachDoc() {
    let token = this.authService.decodeToken();
    const extension = '.pdf';
    const nombreDoc = `Oficio Programación Recepción${extension}`;
    const contentType: string = '.pdf';

    const formData = {
      keyDoc: this.programming.id,
      xDelegacionRegional: this.programming.regionalDelegationNumber,
      dDocTitle: nombreDoc,
      xNombreProceso: 'Aceptar Solicitud Programación',
      xTipoDocumento: 221,
      xNivelRegistroNSBDB: 'Bien',
      dDocType: contentType,
      dDocAuthor: token.name,
      dInDate: new Date(),
      xidProgramacion: this.programming.id,
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
              this.onLoadToast(
                'success',
                'Documento Guardado',
                'El documento se guardó correctamente'
              );
              this.modalRef.content.callback(true);
              this.close();
            }
          },
          error: error => {},
        });
    });
  }

  updateProgramming(dDocName: string) {
    return new Promise((resolve, reject) => {
      const formData: Object = {
        contentId: dDocName,
      };

      this.programmingService
        .updateProgramming(this.programming.id, formData)
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
}
