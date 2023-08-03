import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IGood } from 'src/app/core/models/good/good.model';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { IReceipt } from 'src/app/core/models/receipt/receipt.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { GelectronicFirmService } from 'src/app/core/services/ms-gelectronicfirm/gelectronicfirm.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
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
    private proceedingService: ProceedingsService
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
    console.log('this.idTypeDoc', this.idTypeDoc);
    console.log('this.typeFirm', this.typeFirm);
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
        let linkDoc: string = `${this.urlBaseReport}Etiqueta_TDR.jasper&idSolicitud=${this.programming.id}&CID_BIEN=${this.goodId}`;
        this.src = linkDoc;
        this.formLoading = false;
      } else {
        let linkDoc: string = `${this.urlBaseReport}Etiqueta_TDR.jasper&idSolicitud=${this.programming.id}`;
        console.log('linkDoc', linkDoc);
        this.src = linkDoc;
        this.formLoading = false;
      }

      if (this.goodsId) {
        let linkDoc: string = `${this.urlBaseReport}Etiqueta_TDR.jasper&idSolicitud=${this.programming.id}&CID_BIEN=${this.goodsId}`;
        this.src = linkDoc;
        this.formLoading = false;
      }
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
    const learnedId = this.programming.id;
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
    if (this.idTypeDoc == 107 && this.typeFirm == 'autografa') {
      this.modalRef.content.callback(true, this.typeFirm);
      this.modalRef.hide();
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

    if (
      this.idTypeDoc == 221 ||
      (this.idTypeDoc == 210 && this.typeFirm == 'electronica') ||
      (this.idTypeDoc == 103 && this.typeFirm == 'electronica') ||
      (this.idTypeDoc == 106 && this.typeFirm == 'electronica') ||
      (this.idTypeDoc == 107 && this.typeFirm == 'electronica')
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
      console.log('this.idTypeDoc cerrado', this.idTypeDoc);
      console.log('this.typeFirm cerrado', this.typeFirm);
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
              .firmDocument(this.programming.id, 'ProgramacionRecibo', {})
              .subscribe({
                next: response => {
                  this.loadingButton = false;
                  this.msjCheck = true;

                  this.alert(
                    'success',
                    'Correcto',
                    'Documento firmado correctamente'
                  );
                },
                error: error => {
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
                next: response => {
                  this.msjCheck = true;
                  this.loadingButton = false;
                  this.alert(
                    'success',
                    'Correcto',
                    'Documento firmado correctamente'
                  );
                },
                error: error => {
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
            const idKeyDoc = this.programming.id + '-' + this.actId;

            this.gelectronicFirmService
              .firmDocument(idKeyDoc, 'actaSat', {})
              .subscribe({
                next: response => {
                  this.loadingButton = false;
                  this.msjCheck = true;
                  this.alert(
                    'success',
                    'Correcto',
                    'Documento firmado correctamente'
                  );
                },
                error: error => {
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
            const idKeyDoc = this.programming.id + '-' + this.actId;

            this.gelectronicFirmService
              .firmDocument(idKeyDoc, 'actaAsegurados', {})
              .subscribe({
                next: response => {
                  this.msjCheck = true;
                  this.loadingButton = false;
                  this.alert(
                    'success',
                    'Correcto',
                    'Documento firmado correctamente'
                  );
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

          if (this.idTypeDoc == 107) {
            const idKeyDoc = this.programming.id + '-' + this.actId;

            this.gelectronicFirmService
              .firmDocument(idKeyDoc, 'actasVoluntarias', {})
              .subscribe({
                next: response => {
                  this.msjCheck = true;
                  this.loadingButton = false;
                  this.alert(
                    'success',
                    'Correcto',
                    'Documento firmado correctamente'
                  );
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
        console.log('this.idTypeDoc', this.idTypeDoc);
        console.log('this.typeFirm', this.typeFirm);
        if (
          (this.idTypeDoc == 107 && this.typeFirm == 'electronica') ||
          (this.idTypeDoc == 106 && this.typeFirm == 'electronica') ||
          (this.idTypeDoc == 103 && this.typeFirm == 'electronica') ||
          (this.idTypeDoc == 210 && this.typeFirm == 'electronica') ||
          this.idTypeDoc == 221
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
    if (this.typeFirm != 'electronica') {
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
                this.alert(
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
    } else {
      if (this.idTypeDoc == 103 && this.typeFirm == 'electronica') {
        const idProg = this.programming.id;
        //const idReceipt = this.
        const formData = {
          keyDoc:
            this.programming.id +
            '-' +
            this.receipt.actId +
            '-' +
            this.receipt.id,
          xNivelRegistroNSBDB: 'Bien',
          xNoProgramacion: this.programming.id,
          xNombreProceso: 'Ejecutar Recepción',
          xDelegacionRegional: this.programming.regionalDelegationNumber,
          xFolioProgramacion: this.programming.folio,
          xFolioRecibo: this.receipt.folioReceipt,
          dDocTitle: this.receipt.folioReceipt,
          dSecurityGroup: 'Public',
          xidBien: this.goodId,
          xidTransferente: this.programming.tranferId,
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
        const idProg = this.programming.id;
        console.log('proceedingInfo', this.proceedingInfo);
        //const idReceipt = this.
        const formData = {
          keyDoc:
            this.programming.id + '-' + this.proceedingInfo.folioProceedings,
          xNivelRegistroNSBDB: 'Bien',
          xfolioActa: this.proceedingInfo.folioProceedings,
          xNoProgramacion: this.programming.id,
          xNombreProceso: 'Formalizar Recepción',
          xDelegacionRegional: this.programming.regionalDelegationNumber,
          xFolioProgramacion: this.programming.folio,
          dDocTitle: this.proceedingInfo.folioProceedings,
          dSecurityGroup: 'Public',
          xidBien: this.goodId,
          xidTransferente: this.programming.tranferId,
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
        const idProg = this.programming.id;
        console.log('proceedingInfo', this.proceedingInfo);
        //const idReceipt = this.
        const formData = {
          keyDoc:
            this.programming.id + '-' + this.proceedingInfo.folioProceedings,
          xNivelRegistroNSBDB: 'Bien',
          xfolioActa: this.proceedingInfo.folioProceedings,
          xNoProgramacion: this.programming.id,
          xNombreProceso: 'Formalizar Recepción',
          xDelegacionRegional: this.programming.regionalDelegationNumber,
          xFolioProgramacion: this.programming.folio,
          dDocTitle: this.proceedingInfo.folioProceedings,
          dSecurityGroup: 'Public',
          xidBien: this.goodId,
          xidTransferente: this.programming.tranferId,
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
        const idProg = this.programming.id;
        console.log('proceedingInfo', this.proceedingInfo);
        //const idReceipt = this.
        const formData = {
          keyDoc:
            this.programming.id + '-' + this.proceedingInfo.folioProceedings,
          xNivelRegistroNSBDB: 'Bien',
          xfolioActa: this.proceedingInfo.folioProceedings,
          xNoProgramacion: this.programming.id,
          xNombreProceso: 'Formalizar Recepción',
          xDelegacionRegional: this.programming.regionalDelegationNumber,
          xFolioProgramacion: this.programming.folio,
          dDocTitle: this.proceedingInfo.folioProceedings,
          dSecurityGroup: 'Public',
          xidBien: this.goodId,
          xidTransferente: this.programming.tranferId,
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
      }

      /*let token = this.authService.decodeToken();
      const extension = '.pdf';
      const nombreDoc = `Recibo Entrega${extension}`;
      const contentType: string = '.pdf';

      const formData = {
        keyDoc: this.programming.id,
        xDelegacionRegional: this.programming.regionalDelegationNumber,
        dDocTitle: nombreDoc,
        xNombreProceso: 'Ejecutar Recepcion',
        xTipoDocumento: 221,
        xNivelRegistroNSBDB: 'Recibo',
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
                this.alert(
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
      }); */
    }
  }

  procedding(docName: string) {
    return new Promise((resolve, reject) => {
      const formData: any = {
        id: this.proceedingInfo.id,
        idPrograming: this.programming.id,
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
        programmingId: this.programming.id,
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
          programmingId: this.programming.id,
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

  backStep() {
    this.listSigns = false;
    this.isAttachDoc = false;
    this.printReport = true;
  }
}
