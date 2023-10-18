import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
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
import { environment } from 'src/environments/environment';
import { UploadFielsModalComponent } from '../upload-fiels-modal/upload-fiels-modal.component';
import { LIST_REPORTS_COLUMN } from './list-reports-column';

@Component({
  selector: 'app-print-report-modal',
  templateUrl: './print-report-modal.component.html',
  styles: [],
})
export class PrintReportModalComponent extends BasePage implements OnInit {
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

    console.log('ID de solicitud', this.requestInfo);
    console.log('DOC', this.idTypeDoc);
    console.log('id Bien seleccioando: ', this.noBien);
    console.log('nomenglatura', this.nomenglatura);
    console.log('infoReport', this.infoReport);

    //Borrar firmantes existentes
    this.verificateFirm();
    this.signParams();

    //Condición para saber que ID tipo de documento lelga
    switch (this.idTypeDoc) {
      case 50: {
        console.log('Tipo 50, Aclaración');
        let linkDoc: string = `${this.urlBaseReport}Dictamen_Procedencia.jasper&ID_SOLICITUD=${this.idReportAclara}&ID_TIPO_DOCTO=${this.idTypeDoc}`;
        this.src = linkDoc;
        console.log('URL reporte ', linkDoc);
        break;
      }
      case 104: {
        console.log('Tipo 104, OficioAclaracionTransferente');
        let linkDoc: string = `${this.urlBaseReport}OficioAclaracionTransferente.jasper&ID_DOCUMENTO=${this.idReportAclara}`;
        this.src = linkDoc;
        console.log('URL reporte ', linkDoc);
        break;
      }
      case 111: {
        console.log('Tipo 111, OficioImprocedencia');
        let linkDoc: string = `${this.urlBaseReport}OficioImprocedencia.jasper&ID_DOCUMENTO=${this.idReportAclara}&ID_TIPO_DOCTO=${this.idTypeDoc}`;
        this.src = linkDoc;
        console.log('URL reporte -> ', linkDoc);
        break;
      }
      case 211: {
        console.log('Tipo 211, AclaracionAsegurados');
        let linkDoc: string = `${this.urlBaseReport}AclaracionAsegurados.jasper&ID_DOCUMENTO=${this.idReportAclara}`;
        this.src = linkDoc;
        console.log('URL reporte ', linkDoc);

        break;
      }
      case 212: {
        console.log('Tipo 212, AclaracionComercioExterior');
        let linkDoc: string = `${this.urlBaseReport}AclaracionComercioExterior.jasper&ID_DOCUMENTO=${this.idReportAclara}`;
        this.src = linkDoc;
        console.log('URL reporte ', linkDoc);
        break;
      }
      case 216: {
        console.log('Tipo 216, ImprocedenciaTransferentesVoluntarias');
        let linkDoc: string = `${this.urlBaseReport}ImprocedenciaTransferentesVoluntarias.jasper&ID_DOCUMENTO=${this.idReportAclara}`;
        this.src = linkDoc;
        console.log('URL reporte ', linkDoc);
        break;
      }
      case 213: {
        console.log('Tipo 213, AclaracionTransferentesVoluntarias');
        let linkDoc: string = `${this.urlBaseReport}AclaracionTransferentesVoluntarias.jasper&ID_DOCUMENTO=${this.idReportAclara}`;
        this.src = linkDoc;
        console.log('URL reporte ', linkDoc);
        break;
      }
      case 221: {
        let linkDoc: string = `${this.urlBaseReport}oficio_programacion_recepcion.jasper&ID_PROGRAMACION=${this.idReportAclara}`;
        this.src = linkDoc;
        break;
      }
      default: {
        console.log('No hay ID tipo de documento');
        break;
      }
    }
  }

  //Verifica si ya existen usuarios, para eliminarlo (Evitar duplicidad)
  verificateFirm() {
    this.signatoriesService
      .getSignatoriesName(this.idTypeDoc, this.idReportAclara)
      .subscribe({
        next: response => {
          console.log('Existe firmante, proceder a eliminarlo');
          this.signatories = response.data;
          //Ciclo para eliminar todos los posibles firmantes existentes para esa solicitud
          const count = response.count;
          for (let i = 0; i < count; i++) {
            this.signatoriesService
              .deleteFirmante(this.signatories[i].signatoryId)
              .subscribe({
                next: response => console.log('Firmante borrado'),
              });
          }
        },
        error: error => {
          //Si no hay firmantes, entonces asignar nuevos
          console.log('Si no hay firmantes, entonces crear nuevo');
          this.registerSign();
        },
      });
  }

  deleteSignatories() {
    this.signatoriesService.deleteFirmante(this.idReportAclara).subscribe({
      next: response => console.log('Firmante borrado'),
    });
  }

  registerSign() {
    if (!this.process) {
      this.signatoriesService
        .getSignatoriesName(this.idTypeDoc, this.idReportAclara)
        .subscribe({
          next: response => {
            console.log('Existe firmante, ya no crear');
          },
          error: error => {
            console.log('Si no hay firmantes, entonces crear nuevo');
            let token = this.authService.decodeToken();
            const formData: Object = {
              name: token.name,
              post: token.cargonivel1,
              learnedType: this.idTypeDoc,
              learnedId: this.idReportAclara, // Para los demás reportes
            };

            //Asigna un firmante según el usuario logeado
            this.signatoriesService.create(formData).subscribe({
              next: response => {
                this.signParams(), console.log('Firmante creado: ', response);
              },
              error: error => console.log('No se puede crear: ', error),
            });
          },
        });
    }
  }

  signParams() {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSignatories());
  }

  //Trae listado de los firmantes disponibles para el reporte
  getSignatories() {
    const learnedType = this.idTypeDoc;
    const learnedId = this.idReportAclara;
    this.loading = true;
    console.log('Traer firmantes');
    this.signatoriesService
      .getSignatoriesFilter(learnedType, learnedId)
      .subscribe({
        next: response => {
          this.signatories = response.data;
          this.totalItems = response.count;
          this.loading = false;
        },
        error: error => (this.loading = false),
      });
  }

  close(): void {
    this.modalRef.hide();
  }

  signReport() {
    //mostrar listado de reportes

    if (!this.listSigns && this.printReport && !this.isAttachDoc) {
      // if(this.notificationValidate == 'Y'){
      //   console.log('Soy una notificación, no es necesario validar firmante creado');
      // } else {
      //   console.log('Soy un dictamen, es necesario validar firmante para evitar duplicidad');
      //   this.verificateFirm();
      // }
      this.registerSign();
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
          callback: (response: any) => {},
        }, //pasar datos por aca
        class: 'modal-lg modal-dialog-centered', //asignar clase de bootstrap o personalizado
        ignoreBackdropClick: true, //ignora el click fuera del modal
      };
      this.modalService.show(PreviewDocumentsComponent, config);
    });
  }

  uploadData(signatories: ISignatories): void {
    const idReportAclara = this.idReportAclara;
    let config: ModalOptions = {
      initialState: {
        idReportAclara,
        signatories,
        typeReport: this.typeReport,
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

  rowsSelected(event: any) {
    this.valuesSign = event.data;
    const idDoc = this.idSolicitud;
    console.log('ID solicitud row seleccionado', idDoc);
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
    console.log();
    //Enviar nueva información a Request
    this.requestService.update(idDoc, obj).subscribe({
      next: data => {},
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
      console.log(
        'Soy una notificación, no es necesario validar firmante creado'
      );
    } else {
      console.log(
        'Soy un dictamen, es necesario validar firmante para evitar duplicidad'
      );
      this.verificateFirm();
    }
    this.listSigns = false;
    this.isAttachDoc = false;
    this.printReport = true;
    this.paragraphs = [];
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
    console.log('this.idSolicitud:', this.idSolicitud);
    let token = this.authService.decodeToken();
    const extension = '.pdf';
    const nombreDoc = `DOC_${this.date}${extension}`;
    const contentType: string = '.pdf';
    const file: any = '';
    if (this.idSolicitud === undefined) {
      console.log('soy reporte de dictaminación');
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
      console.log('soy reporte de notificaciones');
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
      console.log('Data a guardar: ', formData);
      this.attachDoc(formData);
      //Si el reporte es 104 (SAT Aclaración tipo 2 | Documentación faltante)
      if (this.idTypeDoc == 104) {
        //Generar pdf de prueba
        //Agregar Documento de prueba
        this.attachDocSimulated(formData);
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
            this.modalRef.content.callback(true);
            this.close();
          },
          error: error => {
            console.log('Error', error);
          },
        });
    });
  }

  attachDocSimulated(formData: Object) {
    const base64 =
      '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b2REYXRlKEQ6MjAyMzEwMTgwNTU0MTFaKS9DcmVhdG9yKEphc3BlclJlcG9ydHMgTGlicmFyeSB2ZXJzaW9uIDYuMjAuMC0yYmM3YWI2MWM1NmY0NTllODE3NmViMDVjNzcwNWUxNDVjZDQwMGFkKS9DcmVhdGlvbkRhdGUoRDoyMDIzMTAxODA1NTQxMVopL1Byb2R1Y2VyKGlUZXh0IDIuMS43IGJ5IDFUM1hUKT4+CmVuZG9iagp4cmVmCjAgMTMKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDE1NTM0IDAwMDAwIG4gCjAwMDAwMTU4NDQgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMzYzIDAwMDAwIG4gCjAwMDAwMDkzMjkgMDAwMDAgbiAKMDAwMDAxNTA1NiAwMDAwMCBuIAowMDAwMDE1OTMyIDAwMDAwIG4gCjAwMDAwMTU4MDkgMDAwMDAgbiAKMDAwMDAxNTk5NSAwMDAwMCBuIAowMDAwMDE2MDQ5IDAwMDAwIG4gCjAwMDAwMTYwODIgMDAwMDAgbiAKMDAwMDAxNjE4NyAwMDAwMCBuIAp0cmFpbGVyCjw8L0luZm8gMTIgMCBSL0lEIFs8MGNlNDVlOGRkODBiNjM3YWFmYzYwYjM4YTA5MjY2M2U+PDViMzNjZjIxNWNhOWUwODg4NGRjNzg5ZmU2YjJiMWQwPl0vUm9vdCAxMSAwIFIvU2l6ZSAxMz4+CnN0YXJ0eHJlZgoxNjM4NQolJUVPRgoxIDAgb2JqDQo8PC9Bbm5vdHMgMjIgMCBSDQovVHlwZSAvUGFnZQ0KL1Jlc291cmNlcyA0OTggMCBSDQovVGFicyAvUw0KL0NvbnRlbnRzIDUwMSAwIFINCi9Hcm91cCA8PC9TIC9UcmFuc3BhcmVuY3kNCi9UeXBlIC9Hcm91cA0KL0NTIC9EZXZpY2VSR0INCj4+DQovUGFyZW50IDcgMCBSDQovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQ0KPj4NCmVuZG9iag0KMTEgMCBvYmoNCjw8L1R5cGUgL0NhdGFsb2cNCi9WaWV3ZXJQcmVmZXJlbmNlcyA8PC9QcmludFNjYWxpbmcgL0FwcERlZmF1bHQNCj4+DQovUGFnZXMgNyAwIFINCi9OYW1lcyAxMCAwIFINCi9NZXRhZGF0YSA1MDQgMCBSDQo+Pg0KZW5kb2JqDQoxMiAwIG9iag0KPDwvTW9kRGF0ZSAoRDoyMDIzMTAxNzIzNTc0NC0wNicwMCcpDQovQ3JlYXRvciAoSmFzcGVyUmVwb3J0cyBMaWJyYXJ5IHZlcnNpb24gNi4yMC4wLTJiYzdhYjYxYzU2ZjQ1OWU4MTc2ZWIwNWM3NzA1ZTE0NWNkNDAwYWQpDQovQ3JlYXRpb25EYXRlIChEOjIwMjMxMDE4MDU1NDExWikNCi9Qcm9kdWNlciAoaVRleHQgMi4xLjcgYnkgMVQzWFQpDQo+Pg0KZW5kb2JqDQoyMiAwIG9iag0KW10NCmVuZG9iag0KMTAyIDAgb2JqDQo8PC9XIFszIFsyNzddIDE3IFsyNzddIDM2IFs2NjZdIDM4IDM5IDcyMiA0MCBbNjY2IDYxMF0gNDQgWzI3NyA1MDBdIDQ3IFs1NTYgODMzIDcyMiA3NzcgNjY2XSA1MyBbNzIyIDY2NiA2MTAgNzIyIDY2Nl0gNzAgWzUwMF0gNzEgNzIgNTU2IDc1IFs1NTYgMjIyXSA4MiA4MyA1NTYgODYgWzUwMCAyNzddIDkyIFs1MDBdIDIwNyBbNzc3XV0NCi9TdWJ0eXBlIC9DSURGb250VHlwZTINCi9UeXBlIC9Gb250DQovRm9udERlc2NyaXB0b3IgMTAzIDAgUg0KL0Jhc2VGb250IC9BcmlhbE1UDQovQ0lEU3lzdGVtSW5mbyA8PC9SZWdpc3RyeSAoQWRvYmUpDQovT3JkZXJpbmcgKElkZW50aXR5KQ0KL1N1cHBsZW1lbnQgMA0KPj4NCj4+DQplbmRvYmoNCjEwMyAwIG9iag0KPDwvRm9udE5hbWUgL0FyaWFsTVQNCi9UeXBlIC9Gb250RGVzY3JpcHRvcg0KL0NhcEhlaWdodCAwDQovRGVzY2VudCAtMjExDQovRmxhZ3MgMzINCi9Bc2NlbnQgOTA1DQovRm9udEJCb3ggWy02NjQuMDAwMCAtMzI0LjAwMDAgMjAwMC4wMDAwIDEwMzkuMDAwMF0NCi9JdGFsaWNBbmdsZSAwDQovTGVhZGluZyAwDQovTWF4V2lkdGggMTE0OQ0KL1N0ZW1IIDANCi9BdmdXaWR0aCA5MDQNCi9YSGVpZ2h0IDANCi9G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ZD0iaHR0cDovL3d3dy5haWltLm9yZy9wZGZhL25zL2lkLyIgeG1sbnM6cGRmeD0iaHR0cDovL25zLmFkb2JlLmNvbS9wZGZ4LzEuMy8iIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+PHhtcDpDcmVhdG9yVG9vbD5KYXNwZXJSZXBvcnRzIExpYnJhcnkgdmVyc2lvbiA2LjIwLjAtMmJjN2FiNjFjNTZmNDU5ZTgxNzZlYjA1Yzc3MDVlMTQ1Y2Q0MDBhZDwveG1wOkNyZWF0b3JUb29sPgo8cGRmOlByb2R1Y2VyPmlUZXh0IDIuMS43IGJ5IDFUM1hUPC9wZGY6UHJvZHVjZXI+Cjx4bXA6Q3JlYXRlRGF0ZT4yMDIzLTEwLTE4VDA1OjU0OjExWjwveG1wOkNyZWF0ZURhdGU+Cjx4bXA6TW9kaWZ5RGF0ZT4yMDIzLTEwLTE3VDIzOjU3OjQ0LTA2OjAwPC94bXA6TW9kaWZ5RGF0ZT4KPHhtcDpNZXRhZGF0YURhdGU+MjAyMy0xMC0xN1QyMzo1Nzo0NC0wNjowMDwveG1wOk1ldGFkYXRhRGF0ZT4KPC9yZGY6RGVzY3JpcHRpb24+CjwvcmRmOlJERj4KPC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InIiPz4NCmVuZHN0cmVhbQ0KZW5kb2JqDQp4cmVmDQoxIDENCjAwMDAwMTY3OTYgMDAwMDAgbg0KMTEgMg0KMDAwMDAxNjk5OCAwMDAwMCBuDQowMDAwMDE3MTM4IDAwMDAwIG4NCjIyIDENCjAwMDAwMTczNTcgMDAwMDAgbg0KMTAyIDMNCjAwMDAwMTczNzkgMDAwMDAgbg0KMDAwMDAxNzc1NSAwMDAwMCBuDQowMDAwMDE4MDU3IDAwMDAwIG4NCjQxNiAxDQowMDAwMDE4MjAzIDAwMDAwIG4NCjQ5OCA1DQowMDAwMDE4NjE4IDAwMDAwIG4NCjAwMDAwMTg2NzYgMDAwMDAgbg0KMDAwMDAxODcyNSAwMDAwMCBuDQowMDAwMDE4NzcyIDAwMDAwIG4NCjAwMDAwMTkyNzQgMDAwMDAgbg0KNTA0IDENCjAwMDAxMDAyMzkgMDAwMDAgbg0KdHJhaWxlcg0KPDwvSUQgWzwwQ0U0NUU4REQ4MEI2MzdBQUZDNjBCMzhBMDkyNjYzRT4gPDQ1MzFFMzVDRjZDOEVENjhERTNFNkRCOEYwRjBBRjg3Pl0NCi9Sb290IDExIDAgUg0KL1NpemUgNTA1DQovUHJldiAxNjM4NQ0KL0luZm8gMTIgMCBSDQo+Pg0Kc3RhcnR4cmVmDQoxMDEzNDINCiUlRU9GDQo=';
    const base64Data = `data:application/pdf;base64,${base64}`;

    const binaryData = atob(base64Data.split(',')[1]);
    const u8 = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      u8[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([u8], { type: 'application/pdf' });
    let token = this.authService.decodeToken();
    const extension = '.pdf';
    const nombreDoc = `DOCUMENTO FALTANTE`;
    const contentType: string = '.pdf';
    const file: any = '';

    this.wContentService
      .addDocumentToContent(
        nombreDoc,
        contentType,
        JSON.stringify(formData),
        blob,
        extension
      )
      .subscribe({
        next: resp => {
          //this.alert('success', 'El Documento ha sido Guardado', '');
          //this.modalRef.content.callback(true);
          //this.close();
        },
        error: error => {
          console.log('Error', error);
        },
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
    //Firmar reporte Dictamen Procedencia
    if (this.idTypeDoc == 50) {
      const requestInfo = this.requestInfo; //ID solicitud
      console.log('ID de solicitud', this.requestInfo);
      const nameTypeReport = 'DictamenProcendecia';
      const formData: Object = {
        id: this.idReportAclara,
        firma: true,
        tipoDocumento: nameTypeReport,
      };
      console.log('Información del reporte', formData);

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
      console.log(formData);
      this.firmReport(this.idReportAclara, nameTypeReport, formData);
    }
    if (this.idTypeDoc == 104) {
      const nameTypeReport = 'OficioAclaracionTransferente';
      const formData: Object = {
        id: this.idReportAclara,
        firma: true,
        tipoDocumento: nameTypeReport,
      };
      console.log(formData);
      this.firmReport(this.idReportAclara, nameTypeReport, formData);
    }

    if (this.idTypeDoc == 212) {
      const nameTypeReport = 'AclaracionComercioExterior';
      const formData: Object = {
        id: this.idReportAclara,
        firma: true,
        tipoDocumento: nameTypeReport,
      };
      console.log(formData);
      this.firmReport(this.idReportAclara, nameTypeReport, formData);
    }

    if (this.idTypeDoc == 211) {
      const nameTypeReport = 'AclaracionAsegurados';
      const formData: Object = {
        id: this.idReportAclara,
        firma: true,
        tipoDocumento: nameTypeReport,
      };
      console.log(formData);
      this.firmReport(this.idReportAclara, nameTypeReport, formData);
    }

    if (this.idTypeDoc == 213) {
      const nameTypeReport = 'AclaracionTransferentesVoluntarias';
      const formData: Object = {
        id: this.idReportAclara,
        firma: true,
        tipoDocumento: nameTypeReport,
      };
      console.log(formData);
      this.firmReport(this.idReportAclara, nameTypeReport, formData);
    }

    if (this.idTypeDoc == 216) {
      const nameTypeReport = 'ImprocedenciaTransferentesVoluntarias';
      const formData: Object = {
        id: this.idReportAclara,
        firma: true,
        tipoDocumento: nameTypeReport,
      };
      console.log(formData);
      this.firmReport(this.idReportAclara, nameTypeReport, formData);
    }
  }

  xml: string = '';
  //Método para plasmar firma en reporte generado
  firmReport(requestInfo?: number, nameTypeReport?: string, formData?: Object) {
    this.gelectronicFirmService
      .firmDocument(requestInfo, nameTypeReport, formData)
      .subscribe({
        next: data => {
          this.loadingButton = false;
          console.log('XML Generado: ', data);
          this.xml = data;
          this.msjCheck = true;
          this.handleSuccess();
          //Plasmar la clave
          this.claveInReport();

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
            'Error al generar firma electronica'
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
          console.log('Se actualizó');
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
    console.log('Información de la notificacion: ', this.dataClarifications2);
    const formData: Object = {
      id: this.dataClarifications2.id,
      clarificationStatus: 'A_ACLARACION',
    };

    this.chatClarificationsService
      .update(this.dataClarifications2.id, formData)
      .subscribe({
        next: data => {
          //this.onLoadToast('success', 'Aclaración guardada correctamente', '');
          console.log('Data guardada', data);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'No se pudo guardar', '');
        },
      });
  }

  uploadReport() {
    let config = { ...MODAL_CONFIG, class: 'modal-lg modal-dialog-centered' };
    config.initialState = {
      receiptGuards: this.receiptGuards,
      typeDoc: this.idTypeDoc,
      callback: (data: boolean) => {
        if (data) {
        }
      },
    };

    this.modalService.show(UploadReportReceiptComponent, config);
    console.log('componente para adjuntar doc');
  }

  updateStatusSigned() {
    const formData = new FormData();
    formData.append('learnedType', this.valuesSign.learnedType);
    formData.append('signatoryId', String(this.valuesSign.signatoryId));
    formData.append('learnedId', this.valuesSign.learnedId);
    formData.append('name', this.valuesSign.name);
    formData.append('pass', this.valuesSign.pass);
    formData.append('post', this.valuesSign.post);
    formData.append('rfcUser', this.valuesSign.rfcUser);
    formData.append('validationocsp', 'true');
    formData.append('identifierSystem', '1');
    formData.append('identifierSignatory', '1');
    this.signatoriesService
      .update(this.valuesSign.signatoryId, formData)
      .subscribe({
        next: data => {
          console.log('data', data), this.getSignatories();
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
          console.log('Adjuntar documento:');
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
          next: resp => {
            console.log('Se actualizó la clave: ', resp);
          },
          error: error => {
            console.log('No se actualizó la clave: ', error);
          },
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
            next: data => {
              console.log(
                'Se plasmo la nomenglatura al reporte firmado de NOTIFICACIONES:',
                data
              );
            },
            error: error => {
              console.log(
                'No se plasmo la nomenglatura al reporte firmado de NOTIFICACIONES:',
                error
              );
            },
          });

        break;
      }

      default: {
        console.log('No hay otro documento para plasmar firma');
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
