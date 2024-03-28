import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IChatClarifications } from 'src/app/core/models/ms-chat-clarifications/chat-clarifications-model';
import { IClarificationDocumentsImpro } from 'src/app/core/models/ms-documents/clarification-documents-impro-model';
import { ISignatories } from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
import { GelectronicFirmService } from 'src/app/core/services/ms-gelectronicfirm/gelectronicfirm.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { UploadReportReceiptComponent } from 'src/app/pages/request/programming-request-components/execute-reception/upload-report-receipt/upload-report-receipt.component';
import {
  getXMLNode,
  isNullOrEmpty,
} from 'src/app/pages/request/request-complementary-documentation/request-comp-doc-tasks/request-comp-doc-tasks.component';
import { environment } from 'src/environments/environment';
import { LIST_REPORTS_COLUMN } from './list-reports-column';
import { UploadFielsModalComponent } from '../../transfer-request/tabs/notify-clarifications-impropriety-tabs-component/upload-fiels-modal/upload-fiels-modal.component';

@Component({
  selector: 'app-request-signature-modal',
  templateUrl: './request-signature-modal.component.html',
  styles: [],
})
export class RequestSignatureModalComponent extends BasePage implements OnInit {
  //idDoc: number;
  idTypeDoc: any; //ID Tipo de documento
  idReportAclara: any; //ID de los reportes
  sign: boolean = true;
  date: string = '';
  signatories: ISignatories[] = [];
  valuesSign: ISignatories;
  requestInfo: IRequest;
  process: string = '';
  dataClarifications1: any;
  dataClarifications2: IChatClarifications;
  idProg: number = 0;
  receiptId: number = 0;
  receiptGuards: any;
  src = '';
  isPdfLoaded = false;
  private pdf: PDFDocumentProxy;
  nomenglatura: string;
  infoReport: IClarificationDocumentsImpro;
  isDynamic = false;
  readOnly = false;

  @ViewChild('FileInput', { static: false }) inputFile: ElementRef;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  totalItems: number = 0;

  title: string = 'Imprimir Reporte';
  btnTitle: string = 'Firmar Reporte';
  btnSubTitle: string = 'Vista Previa Reporte';
  printReport: boolean = true;
  listSigns: boolean = false;
  rowSelected: boolean = false;
  isAttachDoc: boolean = false;
  columns = LIST_REPORTS_COLUMN;
  config = {
    keyboard: true,
  };
  typeReport: string = '';
  sizeMessage: boolean = false;
  pdfTemp: File;

  selectedRow: any = null;

  msjCheck: boolean = false;
  formLoading: boolean = true;
  urlBaseReport = `${environment.API_URL}processgoodreport/report/showReport?nombreReporte=`;
  idSolicitud: any;
  idRegionalDelegation: any;
  notificationValidate: any; //Parámetro que identifica si es notificación Y= si lo es
  loadSingnatures: boolean = false;

  noBien: any;
  constructor(
    public modalService: BsModalService,
    public modalRef: BsModalRef,
    private signatoriesService: SignatoriesService,
    private gelectronicFirmService: GelectronicFirmService,
    private authService: AuthService,
    private wContentService: WContentService,
    private requestService: RequestService,
    private sanitizer: DomSanitizer,
    private chatClarificationsService: ChatClarificationsService,
    private documentService: DocumentsService
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

  onLoaded(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isPdfLoaded = true;
  }

  userName: any[] = [];

  ngOnInit(): void {
    this.idSolicitud = this.requestInfo.id;
    this.idRegionalDelegation = this.requestInfo.regionalDelegationId;

    //Condición para saber que ID tipo de documento lelga
    switch (parseInt(this.idTypeDoc)) {
      case 50: {
        let linkDoc: string = `${this.urlBaseReport}Dictamen_Procedencia.jasper&ID_SOLICITUD=${this.idReportAclara}&ID_TIPO_DOCTO=${this.idTypeDoc}`;
        this.src = linkDoc;

        break;
      }
      case 104: {
        let linkDoc: string = `${this.urlBaseReport}OficioAclaracionTransferente.jasper&ID_DOCUMENTO=${this.idReportAclara}`;
        this.src = linkDoc;

        break;
      }
      case 111: {
        let linkDoc: string = `${this.urlBaseReport}OficioImprocedencia.jasper&ID_DOCUMENTO=${this.idReportAclara}&ID_TIPO_DOCTO=${this.idTypeDoc}`;
        this.src = linkDoc;

        break;
      }
      case 211: {
        let linkDoc: string = `${this.urlBaseReport}AclaracionAsegurados.jasper&ID_DOCUMENTO=${this.idReportAclara}`;
        this.src = linkDoc;

        break;
      }
      case 212: {
        let linkDoc: string = `${this.urlBaseReport}AclaracionComercioExterior.jasper&ID_DOCUMENTO=${this.idReportAclara}`;
        this.src = linkDoc;

        break;
      }
      case 216: {
        let linkDoc: string = `${this.urlBaseReport}ImprocedenciaTransferentesVoluntarias.jasper&ID_DOCUMENTO=${this.idReportAclara}`;
        this.src = linkDoc;

        break;
      }
      case 213: {
        let linkDoc: string = `${this.urlBaseReport}AclaracionTransferentesVoluntarias.jasper&ID_DOCUMENTO=${this.idReportAclara}`;
        this.src = linkDoc;

        break;
      }
      case 221: {
        let linkDoc: string = `${this.urlBaseReport}oficio_programacion_recepcion.jasper&ID_PROGRAMACION=${this.idReportAclara}`;
        this.src = linkDoc;
        break;
      }
      case 223: {
        let linkDoc: string = `${this.urlBaseReport}situacion_juridica_amparo.jasper&ID_SOLICITUD=${this.idReportAclara}`;
        this.src = linkDoc;
        console.log('Link: ', linkDoc);
        break;
      }
      default: {
        break;
      }
    }

    if (this.isDynamic) {
      let linkDoc: string = `${this.urlBaseReport}sae.rptdesign&ID_TABLA=NOMBRE_TABLA,ID_REGISTRO,ID_TIPO_DOCTO&NOM_TABLA=REPORTES_DINAMICOS&NOM_CAMPO=CONTENIDO&ID_REGISTRO=SOLICITUDES,${this.idSolicitud},${this.idTypeDoc}`;
      this.src = linkDoc;
    }

    if (!this.readOnly) {
      this.loadSignatories(true);
    }

  }

  async loadSignatories(reset: boolean = false) {

    if (!reset) {
      this.signatories = await this.getSignatories();
      return;
    }

    this.loadSingnatures = true;

    console.log('Firmantes -----------------');

    let signatories = await this.getSignatories();
    console.log('Firmantes: ', signatories);

    let deletes = signatories.map(signatory => {
      let item = this.deleteSignatories(signatory.signatoryId);
      console.log('Firmante eliminado: ', signatory.signatoryId);
      return item;
    });

    Promise.all(deletes)
      .then(async () => {
        let create: any = await this.createSignatorie();
        console.log('Firmante creado: ', create.signatoryId);
        return create;
      }).then(async create => {
        let signatories = await this.getSignatories();
        this.signatories = signatories;
        console.log('Firmantes: ', this.signatories);
        this.loadSingnatures = false;
      }).catch(error => {
        // Si algo sale mal, el error se capturará aquí
        this.loadSingnatures = false;
      });

    //this.signatories = signatories;

  }

  async getSignatories() {

    let learnedId = this.idReportAclara;
    let learnedType = this.idTypeDoc;

    if (this.isDynamic) {
      learnedType = 217;
      learnedId = 'SOLICITUDES-' + this.idReportAclara + '-' + this.idTypeDoc;
    }

    if (parseInt(this.idTypeDoc) == 223) {
      learnedId = this.idReportAclara + '-2-' + this.idTypeDoc;
    }

    return new Promise<any[]>((res, rej) => {
      this.signatoriesService.getSignatoriesName(learnedType, learnedId).subscribe({
        next: resp => {
          res(resp.data);
        },
        error: err => {
          res([]);
        },
      });
    });
  }

  async deleteSignatories(signatoryId) {
    return new Promise<any[]>((res, rej) => {
      this.signatoriesService.deleteFirmante(signatoryId).subscribe({
        next: resp => {
          res(resp);
        },
        error: err => {
          res(null);
        },
      });
    });
  }

  async createSignatorie() {

    let token = this.authService.decodeToken();
    let name = token.name;
    let post = token.cargonivel1;
    let learnedId = this.idReportAclara;
    let learnedType = this.idTypeDoc;

    if (this.isDynamic) {
      learnedType = 217;
      learnedId = 'SOLICITUDES-' + this.idReportAclara + '-' + this.idTypeDoc;
      name = this.requestInfo.nameSignatoryRuling;
      post = this.requestInfo.postSignatoryRuling;
    }

    if (parseInt(this.idTypeDoc) == 223) {
      learnedId = this.idReportAclara + '-2-' + this.idTypeDoc;
    }

    const formData = {
      name: name,
      post: post,
      learnedType: learnedType,
      learnedId: learnedId,
    };

    return new Promise<any[]>((res, rej) => {
      this.signatoriesService.create(formData).subscribe({
        next: resp => {
          res(resp);
        },
        error: err => {
          res(null);
        },
      });
    });

  }

  close(): void {
    this.modalRef.hide();
  }

  signReport() {
    //mostrar listado de reportes

    if (!this.listSigns && this.printReport && !this.isAttachDoc) {
      this.printReport = false;
      this.listSigns = true;
      this.title = 'Firma electrónica';
    } else if (!this.listSigns && this.printReport && this.isAttachDoc) {
      //adjuntar el reporte
      let message = '¿Está seguro que quiere cargar el documento?';
      this.openMessage2(message);
    }
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
          callback: (response: any) => { },
        }, //pasar datos por aca
        class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
        keyboard: false,
        ignoreBackdropClick: true,
      };
      this.modalService.show(PreviewDocumentsComponent, config);
    });
  }

  uploadData(signatories: ISignatories): void {
    const idReportAclara = this.idReportAclara;
    this.loading = true;
    let config: ModalOptions = {
      initialState: {
        idReportAclara,
        signatories,
        typeReport: this.typeReport,
        callback: (next: boolean) => {
          if (next) {
            this.loading = false;
            this.loadSignatories();
          }
        },
        onClose: (cancel: boolean) => {
          if (cancel) this.loading = false;
        }
      },
      class: 'modal-lg modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true,
    };

    this.modalService.show(UploadFielsModalComponent, config);
  }

  rowsSelected(event: any) {
    this.valuesSign = event.data;
    const idDoc = this.idSolicitud;

    const obj: Object = {
      id: this.requestInfo.id,
      recordId: this.requestInfo.recordId,
      applicationDate: this.requestInfo.applicationDate,
      receptionDate: this.requestInfo.receptionDate,
      nameOfOwner: this.requestInfo.nameOfOwner,
      holderCharge: this.requestInfo.holderCharge,
      phoneOfOwner: this.requestInfo.phoneOfOwner,
      emailOfOwner: this.requestInfo.emailOfOwner,
      transferenceId: this.requestInfo.transferenceId,
      //transferent: this.requestInfo.transferent, ¿Cambio?
      stationId: this.requestInfo.stationId,
      //emisora: this.requestInfo.emisora, ¿Cambio?
      authorityId: this.requestInfo.authorityId,
      regionalDelegationId: this.requestInfo.regionalDelegationId,
      //regionalDelegation: this.requestInfo.regionalDelegation,
      sender: this.requestInfo.sender,
      observations: this.requestInfo.observations,
      targetUser: this.requestInfo.targetUser,
      urgentPriority: this.requestInfo.urgentPriority,
      indicatedTaxpayer: this.requestInfo.indicatedTaxpayer,
      transferenceFile: this.requestInfo.transferenceFile,
      transferEntNotes: this.requestInfo.transferEntNotes,
      idAddress: this.requestInfo.idAddress,
      originInfo: this.requestInfo.originInfo,
      circumstantialRecord: this.requestInfo.circumstantialRecord,
      previousInquiry: this.requestInfo.previousInquiry,
      lawsuit: this.requestInfo.lawsuit,
      protectNumber: this.requestInfo.protectNumber,
      tocaPenal: this.requestInfo.tocaPenal,
      paperNumber: this.requestInfo.paperNumber,
      paperDate: this.requestInfo.paperDate,
      indicated: this.requestInfo.indicated,
      publicMinistry: this.requestInfo.publicMinistry,
      court: this.requestInfo.court,
      crime: this.requestInfo.crime,
      receiptRoute: this.requestInfo.receiptRoute,
      destinationManagement: this.requestInfo.destinationManagement,
      affair: this.requestInfo.affair,
      satDeterminant: this.requestInfo.satDeterminant,
      satDirectory: this.requestInfo.satDirectory,
      //authority: this.requestInfo.authority,
      satZoneCoordinator: this.requestInfo.satZoneCoordinator,
      userCreated: this.requestInfo.userCreated,
      creationDate: this.requestInfo.creationDate,
      userModification: this.requestInfo.userModification,
      modificationDate: this.requestInfo.modificationDate,
      typeOfTransfer: this.requestInfo.typeOfTransfer,
      domainExtinction: this.requestInfo.domainExtinction,
      version: this.requestInfo.version,
      targetUserType: this.requestInfo.targetUserType,
      trialType: this.requestInfo.trialType,
      typeRecord: this.requestInfo.typeRecord,
      requestStatus: this.requestInfo.requestStatus,
      fileLeagueType: this.requestInfo.fileLeagueType,
      fileLeagueDate: this.requestInfo.fileLeagueDate,
      rejectionComment: this.requestInfo.rejectionComment,
      authorityOrdering: this.requestInfo.authorityOrdering,
      instanceBpm: this.requestInfo.instanceBpm,
      trial: this.requestInfo.trial,
      compensationType: this.requestInfo.compensationType,
      stateRequestId: this.requestInfo.stateRequestId,
      searchSiab: this.requestInfo.searchSiab,
      priorityDate: this.requestInfo.priorityDate,
      ofRejectionsNumber: this.requestInfo.ofRejectionsNumber,
      rulingDocumentId: this.requestInfo.rulingDocumentId,
      reportSheet: this.requestInfo.reportSheet,
      nameRecipientRuling: this.requestInfo.nameRecipientRuling,
      postRecipientRuling: this.requestInfo.postRecipientRuling,
      paragraphOneRuling: this.requestInfo.paragraphOneRuling,
      paragraphTwoRuling: this.requestInfo.paragraphTwoRuling,
      nameSignatoryRuling: this.valuesSign.name, //Info nueva que se inserta
      postSignatoryRuling: this.valuesSign.post,
      ccpRuling: this.requestInfo.ccpRuling,
      rulingCreatorName: this.requestInfo.rulingCreatorName,
      rulingSheetNumber: this.requestInfo.rulingSheetNumber,
      registrationCoordinatorSae: this.requestInfo.registrationCoordinatorSae,
      emailNotification: this.requestInfo.emailNotification,
      keyStateOfRepublic: this.requestInfo.keyStateOfRepublic,
      instanceBpel: this.requestInfo.instanceBpel,
      verificationDateCump: this.requestInfo.verificationDateCump,
      recordTmpId: this.requestInfo.recordTmpId,
      coordregsae_ktl: this.requestInfo.coordregsae_ktl,
    };

    //Enviar nueva información a Request
    this.requestService.update(idDoc, obj).subscribe({
      next: data => { },
      error: error => (this.loading = false),
    });
  }

  selectRow(row?: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }

  sendSign() {
    //verificar que el estado de registro este como "datos completo" y enviarlo!
    let message = '¿Está seguro de enviar la información a firmar?';
    this.openMessage(message);
  }

  backStep() {
    if (this.notificationValidate == 'Y') {
    } else {
      this.loadSignatories(true);
    }
    this.listSigns = false;
    this.isAttachDoc = false;
    this.printReport = true;
    this.paragraphs = [];
    this.loading = false;
    this.loadSingnatures = false;
    this.rowSelected = false;
    this.selectedRow = null;
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

  pdfTempo: string = 'PDF';
  myItem: any;

  downloadTemp() {
    this.pdf.getData().then(u8 => {
      let blob = new Blob([u8.buffer], {
        type: 'application/pdf',
      });
    });
  }

  reader = new FileReader();

  validAttachDoc() {
    let token = this.authService.decodeToken();
    const extension = '.pdf';
    const nombreDoc = `DOC_${this.date}${extension}`;
    const contentType: string = '.pdf';
    const file: any = '';
    if (this.idSolicitud === undefined) {
      const formData = {
        dDocTitle: nombreDoc, //Título del documento
        dDocAuthor: token.name, //Autor del documento
        dDocType: contentType, //Tipo de documento
        dDocCreator: token.name, //Creador del documento
        //dDocName: 'Dictamen Procendecia',	//Identificador del documento
        dInDate: new Date(), //Fecha de creación del documento
        xidSolicitud: this.requestInfo.id,
        xtipoDocumento: this.idTypeDoc,
        xDelegacionRegional: this.idRegionalDelegation,
      };
      this.attachDoc(formData);
    } else {
      const formData = {
        dDocTitle: nombreDoc, //Título del documento
        dDocAuthor: token.name, //Autor del documento
        dDocType: contentType, //Tipo de documento
        dDocCreator: token.name, //Creador del documento
        //dDocName: 'Dictamen Procendecia',	//Identificador del documento
        dInDate: new Date(), //Fecha de creación del documento
        xidSolicitud: this.idSolicitud,
        xtipoDocumento: this.idTypeDoc,
        xidBien: this.noBien,
        xestado: this.requestInfo?.keyStateOfRepublic,
        xDelegacionRegional: this.requestInfo?.regionalDelegationId,
        xremitente: this.requestInfo?.sender,
        xcargoRemitente: this.requestInfo?.holderCharge,
        texto: 'prueba_unir', //propiedad que se ocupara para traer las notificaciones. Para un solo ciclo
      };

      this.attachDoc(formData);
      //Si el reporte es 104 (SAT Aclaración tipo 2 | Documentación faltante)
      if (this.idTypeDoc == 104) {
        //Generar pdf de prueba
        //Agregar Documento de prueba
        //this.attachDocSimulated();
        //this.attachDocSimulated2();
        //this.attachDocSimulated3();
        //this.attachDocSimulated4();
      }
    }
  }

  nombreDoc = '';

  attachDoc(formData: Object) {
    let token = this.authService.decodeToken();
    const extension = '.pdf';
    //Cambia el título del documento según el id tipo de documento
    switch (this.idTypeDoc) {
      case 50: {
        this.nombreDoc = `Dictamen_Procedencia${extension}`;
        break;
      }
      case 104: {
        this.nombreDoc = `OficioAclaracionTransferente${extension}`;
        break;
      }
      case 111: {
        this.nombreDoc = `OficioImprocedencia${extension}`;
        break;
      }
      case 211: {
        this.nombreDoc = `AclaracionAsegurados${extension}`;
        break;
      }
      case 212: {
        this.nombreDoc = `AclaracionComercioExterior${extension}`;
        break;
      }
      case 216: {
        this.nombreDoc = `ImprocedenciaTransferentesVoluntarias${extension}`;
        break;
      }
      case 213: {
        this.nombreDoc = `AclaracionTransferentesVoluntarias${extension}`;
        break;
      }
      case 221: {
        this.nombreDoc = `oficio_programacion_recepcion${extension}`;
        break;
      }
      default: {
        this.nombreDoc = `Documento${extension}`;
        break;
      }
    }

    const contentType: string = '.pdf';
    const file: any = '';
    this.pdf.getData().then(u8 => {
      let blob = new Blob([u8.buffer], {
        type: 'application/pdf',
      });
      this.wContentService
        .addDocumentToContent(
          this.nombreDoc,
          contentType,
          JSON.stringify(formData),
          blob,
          extension
        )
        .subscribe({
          next: resp => {
            this.alert('success', 'El Documento ha sido Guardado', '');
            this.modalRef.content.callback(false, null);
            this.close();
          },
          error: error => { },
        });
    });
  }

  loadingButton: boolean = false;

  openMessage(message: string): void {
    this.alertQuestion('warning', 'Confirmación', message, 'Aceptar').then(
      question => {
        if (question.isConfirmed) {
          this.loadingButton = true;
          this.firm();
        }
      }
    );
  }

  firm() {
    //Firmar reporte Documento Dinamico
    if (this.isDynamic) {
      let id = 'SOLICITUDES-' + this.idReportAclara + '-' + this.idTypeDoc;

      const nameTypeReport = 'DocumentoDinamico';
      const formData: Object = {
        id: id,
        firma: true,
        tipoDocumento: nameTypeReport,
      };

      this.firmReport(id, nameTypeReport, formData);
      return;
    }

    //String situacionJuridicaID = ID.split("-")[1];
    //String solicitudID = ID.split("-")[0];
    //String tipoDocumentoID = ID.split("-")[2];

    //65991 - 2 - 223

    if (parseInt(this.idTypeDoc) == 223) {
      let id = this.idReportAclara + '-2-' + this.idTypeDoc;

      const nameTypeReport = 'SituacionJuridicaAmparo';
      const formData: Object = {
        id: id,
        firma: true,
        tipoDocumento: nameTypeReport,
      };

      this.firmReport(id, nameTypeReport, formData);
      return;
    }

    //Firmar reporte Dictamen Procedencia
    if (this.idTypeDoc == 50) {
      const requestInfo = this.requestInfo; //ID solicitud

      const nameTypeReport = 'DictamenProcendecia';
      const formData: Object = {
        id: this.idReportAclara,
        firma: true,
        tipoDocumento: nameTypeReport,
      };

      this.firmReport(requestInfo.id, nameTypeReport, formData);
    }
    //Firmar reporte Oficio improcedencia / Oficio_Aclaracion
    if (this.idTypeDoc == 111) {
      const nameTypeReport = 'OficioImprocedencia';
      const formData: Object = {
        id: this.idReportAclara,
        firma: true,
        tipoDocumento: nameTypeReport,
      };

      this.firmReport(this.idReportAclara, nameTypeReport, formData);
    }
    if (this.idTypeDoc == 104) {
      const nameTypeReport = 'OficioAclaracionTransferente';
      const formData: Object = {
        id: this.idReportAclara,
        firma: true,
        tipoDocumento: nameTypeReport,
      };

      this.firmReport(this.idReportAclara, nameTypeReport, formData);
    }

    if (this.idTypeDoc == 212) {
      const nameTypeReport = 'AclaracionComercioExterior';
      const formData: Object = {
        id: this.idReportAclara,
        firma: true,
        tipoDocumento: nameTypeReport,
      };

      this.firmReport(this.idReportAclara, nameTypeReport, formData);
    }

    if (this.idTypeDoc == 211) {
      const nameTypeReport = 'AclaracionAsegurados';
      const formData: Object = {
        id: this.idReportAclara,
        firma: true,
        tipoDocumento: nameTypeReport,
      };

      this.firmReport(this.idReportAclara, nameTypeReport, formData);
    }

    if (this.idTypeDoc == 213) {
      const nameTypeReport = 'AclaracionTransferentesVoluntarias';
      const formData: Object = {
        id: this.idReportAclara,
        firma: true,
        tipoDocumento: nameTypeReport,
      };

      this.firmReport(this.idReportAclara, nameTypeReport, formData);
    }

    if (this.idTypeDoc == 216) {
      const nameTypeReport = 'ImprocedenciaTransferentesVoluntarias';
      const formData: Object = {
        id: this.idReportAclara,
        firma: true,
        tipoDocumento: nameTypeReport,
      };

      this.firmReport(this.idReportAclara, nameTypeReport, formData);
    }
  }

  xml: string = '';
  //Método para plasmar firma en reporte generado
  firmReport(requestInfo, nameTypeReport?: string, formData?: Object) {
    this.gelectronicFirmService
      .firmDocument(requestInfo, nameTypeReport, formData)
      .subscribe({
        next: data => {
          this.loadingButton = false;

          this.xml = data;

          if (this.isDynamic || this.idTypeDoc == 223) {
            //this.updateRequest();
            let content = getXMLNode(this.xml, 'strXmlFirmado')?.textContent;

            if (!isNullOrEmpty(content)) {
              this.msjCheck = true;
              this.handleSuccess();
              //Plasmar la clave
              this.claveInReport();
              this.updateStatusSigned(content);
            } else {
              this.selectedRow = null;
              this.rowSelected = false;

              this.valuesSign.validationocsp = false;

              this.updateStatusSigned();

              let error = getXMLNode(this.xml, 'strError')?.textContent;

              this.alertInfo(
                'error',
                'Acción Inválida',
                'Error al generar firma electrónica\nFavor de revisar la información'
                //+ error.split('.')[0] + ''
              );
            }

            return;
          }

          this.msjCheck = true;

          if (nameTypeReport === 'DictamenProcendecia') {
            //this.updateRequest();
          } else {
            this.updateStatusclarifications();
          }

          //this.updateStatusSigned();
        },
        error: error => {
          this.loadingButton = false;
          this.alertInfo(
            'error',
            'Acción Inválida',
            'Error al generar firma electrónica'
          );
        },
      });
  }

  updateRequest() {
    this.requestService
      .update(this.idReportAclara, this.requestInfo)
      .subscribe({
        next: data => {
          //this.handleSuccess(), this.signDictum();
        },
        error: error => (
          this.onLoadToast(
            'warning',
            'No se pudo actualizar',
            error.error.message[0]
          ),
          (this.loading = false)
        ),
      });
  }

  updateStatusclarifications() {
    const formData: Object = {
      id: this.dataClarifications2.id,
      clarificationStatus: 'A_ACLARACION',
    };

    this.chatClarificationsService
      .update(this.dataClarifications2.id, formData)
      .subscribe({
        next: data => {
          //this.onLoadToast('success', 'Aclaración guardada correctamente', '');

          this.loading = false;
        },
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'No se pudo guardar', '');
        },
      });
  }

  uploadReport() {
    let config = {
      ...MODAL_CONFIG,
      class: 'modal-lg modal-dialog-centered',
      keyboard: false,
      ignoreBackdropClick: true,
    };
    config.initialState = {
      receiptGuards: this.receiptGuards,
      typeDoc: this.idTypeDoc,
      callback: (data: boolean) => {
        if (data) {
        }
      },
    };

    this.modalService.show(UploadReportReceiptComponent, config);
  }

  updateStatusSigned(signature = null) {
    //Validar si no ha seleccionado firmante
    if (isNullOrEmpty(this.valuesSign.validationocsp)) {
      this.valuesSign.validationocsp = true;
    }

    const formData = new FormData();
    formData.append('learnedType', this.valuesSign.learnedType);
    formData.append('signatoryId', String(this.valuesSign.signatoryId));
    formData.append('learnedId', this.valuesSign.learnedId);
    formData.append('name', this.valuesSign.name);
    formData.append('pass', this.valuesSign.pass);
    formData.append('post', this.valuesSign.post);
    formData.append('rfcUser', this.valuesSign.rfcUser);
    formData.append('validationocsp', this.valuesSign.validationocsp + '');
    formData.append('identifierSystem', '1');
    formData.append('identifierSignatory', '1');

    if (signature) {
      formData.append('signature', signature);
    }

    this.signatoriesService
      .update(this.valuesSign.signatoryId, formData)
      .subscribe({
        next: data => {
          this.loadSignatories();
        },
        error: error => {
          this.alert('info', 'No se pudo actualizar', error.data);
        },
      });
  }

  openMessage2(message: string): void {
    this.alertQuestion('question', 'Confirmación', message, 'Aceptar').then(
      question => {
        if (question.isConfirmed) {
          this.validAttachDoc();
          //this. attachDoc();
        }
      }
    );
  }

  //Para plasmar la clave en el reporte
  claveInReport() {
    //Condicionar si es Oficio procedencia y Aclaraciones

    switch (this.idTypeDoc) {
      case 50: {
        const obj: IRequest = {
          reportSheet: this.nomenglatura,
        };

        this.requestService.update(this.idReportAclara, obj).subscribe({
          next: resp => { },
          error: error => { },
        });
        break;
      }
      case 104:
      case 111:
      case 211:
      case 212:
      case 216:
      case 213: {
        const modelReport: IClarificationDocumentsImpro = {
          invoiceLearned: this.nomenglatura,
        };

        this.documentService
          .updateClarDocImp(this.infoReport.id, modelReport)
          .subscribe({
            next: data => { },
            error: error => { },
          });

        break;
      }

      default: {
        break;
      }
    }
  }

  handleSuccess() {
    const message: string = 'Firmado';
    this.alertInfo('success', 'Reporte Firmado', ``);
    this.loading = false;
    this.modalRef.content.callback(true, this.xml);
  }

}
