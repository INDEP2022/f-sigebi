import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IClarification } from 'src/app/core/models/catalogs/clarification.model';
import { IChatClarifications } from 'src/app/core/models/ms-chat-clarifications/chat-clarifications-model';
import { ClarificationGoodRejectNotification } from 'src/app/core/models/ms-clarification/clarification-good-reject-notification';
import { IClarificationDocumentsImpro } from 'src/app/core/models/ms-documents/clarification-documents-impro-model';
import { IDictamenSeq } from 'src/app/core/models/ms-goods-query/opinionDelRegSeq-model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { PrintReportModalComponent } from '../print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-notify-assets-impropriety-form',
  templateUrl: './notify-assets-impropriety-form.component.html',
  styles: [],
})
export class NotifyAssetsImproprietyFormComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Aclaración';
  clarificationForm: FormGroup = new FormGroup({});
  clarification: IClarification;
  notification: any;
  //en el caso de que una aclaracion llege sin documentacion
  withDocumentation: boolean = false;

  //parametro si es inteconexion por el tipo de transferente pasado desde el padre
  isInterconnection: boolean = false;

  //Parámetro con el id del tipo de la aclaración
  idAclara: any;
  idRequest: any;
  goodValue: any;
  rejectedID: any;
  dataClarifications2: ClarificationGoodRejectNotification;
  paramsReload = new BehaviorSubject<ListParams>(new ListParams());
  infoRequest: IRequest;
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsRequest = new BehaviorSubject<ListParams>(new ListParams());

  //Parámetros para generar el folio en el reporte
  today: Date;
  folio: IDictamenSeq;
  folioReporte: string;
  typeDoc: string = '';

  //Parámetro para detectar que tipo de aclaración es
  typeClarifications: any;
  idSolicitud: any;
  delegationUser: any;

  xmlRespSat: string = '';
  showSearchForm: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private documentService: DocumentsService,
    private chatService: ChatClarificationsService,
    private rejectedGoodService: RejectedGoodService,
    private authService: AuthService,
    private requestService: RequestService,
    private applicationGoodsQueryService: ApplicationGoodsQueryService,
    private goodService: GoodService
  ) {
    super();
    this.today = new Date();
  }

  //dataDocumentsImpro: IClarificationDocumentsImpro;
  ngOnInit(): void {
    this.getInfoDoc();
    //Actualiza Bien, de prueba
    //this.changeSimulateGood()
    this.modalService.onHide.subscribe(key => {});

    this.dictamenSeq();
    this.withDocumentation = this.idAclara === '1' ? true : false;
    this.initForm1();
    const applicationId = this.idRequest;
    const rejectNoticeId = this.dataClarifications2.rejectNotificationId;
  }

  getInfoDoc() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.applicationId'] = this.idRequest;
    this.documentService
      .getAllClarificationDocImpro(params.getValue())
      .subscribe({
        next: response => {
          console.log('response', response);
        },
      });
  }

  initForm1(): void {
    //Trae información de la solicitud para precargar información en los formularios
    this.paramsRequest.getValue()['filter.id'] = this.idRequest;
    this.requestService.getAll(this.paramsRequest.getValue()).subscribe({
      next: response => {
        this.infoRequest = response.data[0];
      },
    });

    this.clarificationForm = this.fb.group({
      addresseeName: [
        this.infoRequest?.nameOfOwner || null,
        null,
        [Validators.pattern(STRING_PATTERN)],
      ],

      positionAddressee: [
        //Cargo Destinatario - Titular de la solicitud
        this.infoRequest?.holderCharge || null,
        [Validators.pattern(STRING_PATTERN)],
      ],

      senderName: [
        //Nombre Remitente - DELEGADO
        null,
        [Validators.pattern(STRING_PATTERN)],
      ],

      senderCharge: [
        //Cargo Remitente - DELEGADO
        null,
        [Validators.pattern(STRING_PATTERN)],
      ],

      consistentIn: [null, [Validators.pattern(STRING_PATTERN)]],

      paragraphInitial: [null, [Validators.pattern(STRING_PATTERN)]],
      paragraphFinal: [null, [Validators.pattern(STRING_PATTERN)]],

      clarification: [null, [Validators.pattern(STRING_PATTERN)]],

      observations: [
        this.dataClarifications2?.observations || null,
        [Validators.pattern(STRING_PATTERN)],
      ],

      userAreaCaptures: [
        this.dataClarifications2?.chatClarification?.areaUserCapture || null,
        [Validators.pattern(STRING_PATTERN)],
      ],

      webMail: [null, [Validators.pattern(EMAIL_PATTERN)]],
      unit: [null, [Validators.pattern(STRING_PATTERN)]],
      amount: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      keyClarificationPaper: [null],
      description: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  countAclaraManual: number = 0;

  async confirm() {
    const typeTransference = this.infoRequest.typeOfTransfer;

    let generaXML: boolean = false;
    if (
      typeTransference == 'SAT_SAE' &&
      this.dataClarifications2.chatClarification.idClarificationType == '2'
    ) {
      generaXML = true;
    }

    if (typeTransference != 'SAT_SAE' || generaXML) {
      //this.aclaracionTransferentesVoluntarias(); //Aclaración Manual tipo 2
      if (
        (this.typeClarifications == 1 || this.typeClarifications == 2) &&
        typeTransference === 'MANUAL'
      ) {
        this.countAclaraManual = this.countAclaraManual + 1;
        this.aclaracionTransferentesVoluntarias(); //Aclaración Manual tipo 2
      }
      const obtainTypeDocument = await this.obtainTypeDocument(
        false,
        this.infoRequest
      );
      if (obtainTypeDocument) {
        switch (this.typeDoc) {
          case 'AclaracionAsegurados': {
            this.aclaracionAsegurados(); //Aclaración PGR tipo 1 y 2

            break;
          }
          case 'AclaracionTransferentesVoluntarias': {
            this.countAclaraManual = this.countAclaraManual + 1;
            this.aclaracionTransferentesVoluntarias(); //Aclaración  MANUAL tipo 1

            break;
          }
        }
      }

      if (
        this.dataClarifications2.clarificationType === 'SOLICITAR_ACLARACION' &&
        this.dataClarifications2.chatClarification.clarificationStatus ==
          'IMPROCEDENCIA' &&
        typeTransference == 'MANUAL'
      ) {
        this.improcedenciaTransferentesVoluntarias(); //IMPROCEDENCIA  MANUAL
      }
    }

    if (
      typeTransference == 'SAT_SAE' &&
      this.typeClarifications == 2 &&
      this.notification.reason != 'INDIVIDUALIZACIÓN DE BIENES'
    ) {
      this.oficioAclaracionTransferente();
    }
    if (
      typeTransference == 'SAT_SAE' &&
      this.typeClarifications == 1 &&
      this.notification.reason != 'INDIVIDUALIZACIÓN DE BIENES'
    ) {
      this.aclaracionComercioExterior();
    }

    if (
      typeTransference == 'SAT_SAE' &&
      this.notification?.clarification?.clarification ==
        'INDIVIDUALIZACIÓN DE BIENES'
    ) {
      this.aclaracionComercioExterior();
    }

    //this.saveClarificationsAcept();
  }

  improcedenciaTransferentesVoluntarias() {
    //Recupera información del usuario logeando para luego registrarlo como firmante
    let token = this.authService.decodeToken();

    //Crear objeto para generar el reporte
    const modelReport: IClarificationDocumentsImpro = {
      clarification: this.clarificationForm.controls['clarification'].value,
      sender: this.clarificationForm.controls['senderName'].value, //Nombre Remitente - DELEGADO
      //foundation: ",",
      //id: 1, //ID primaria
      version: 1,
      //transmitterId: ",",
      paragraphInitial:
        this.clarificationForm.controls['paragraphInitial'].value,
      applicationId: this.idRequest,
      positionSender: this.clarificationForm.controls['senderCharge'].value, //Cargo Remitente - DELEGADO
      paragraphFinal: this.clarificationForm.controls['paragraphFinal'].value,
      consistentIn: this.clarificationForm.controls['consistentIn'].value,
      managedTo: this.infoRequest?.nameOfOwner, //Nombre Destinatario - Titular de la solicitud
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      positionAddressee:
        this.clarificationForm.controls['positionAddressee'].value, //Cargo Destinatario - Titular de la solicitud
      modificationDate: new Date(),
      creationUser: token.name,
      documentTypeId: '216',
      modificationUser: token.name,
      //worthAppraisal: 1,
      creationDate: new Date(),
      //rejectNoticeId: 1,
      assignmentInvoiceDate: new Date(),
      mailNotification: this.clarificationForm.controls['webMail'].value,
      areaUserCapture:
        this.clarificationForm.controls['userAreaCaptures'].value,
      rejectNoticeId: this.dataClarifications2.rejectNotificationId,
    };

    this.loading = true;
    this.documentService.createClarDocImp(modelReport).subscribe({
      next: data => {
        this.openReport(data);
        this.loading = false;
        this.close();
      },
      error: error => {
        this.loading = false;

        //this.onLoadToast('error', 'No se pudo guardar', '');
      },
    });
  }

  oficioImprocedencia() {
    //Recupera información del usuario logeando para luego registrarlo como firmante
    let token = this.authService.decodeToken();

    //Crear objeto para generar el reporte
    const modelReport: IClarificationDocumentsImpro = {
      clarification: this.clarificationForm.controls['clarification'].value,
      sender: this.clarificationForm.controls['senderName'].value, //Nombre Remitente - DELEGADO
      //foundation: ",",
      //id: 1, //ID primaria
      version: 1,
      //transmitterId: ",",
      paragraphInitial:
        this.clarificationForm.controls['paragraphInitial'].value,
      applicationId: this.idRequest,
      positionSender: this.clarificationForm.controls['senderCharge'].value, //Cargo Remitente - DELEGADO
      paragraphFinal: this.clarificationForm.controls['paragraphFinal'].value,
      consistentIn: this.clarificationForm.controls['consistentIn'].value,
      managedTo: this.clarificationForm.controls['addresseeName'].value, //Nombre Destinatario - Titular de la solicitud
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      positionAddressee:
        this.clarificationForm.controls['positionAddressee'].value, //cargo Destinatario - Titular de la solicitud
      modificationDate: new Date(),
      creationUser: token.name,
      documentTypeId: '111',
      modificationUser: token.name,
      //worthAppraisal: 1,
      creationDate: new Date(),
      //rejectNoticeId: 1,
      assignmentInvoiceDate: new Date(),
      mailNotification: this.clarificationForm.controls['webMail'].value,
      areaUserCapture:
        this.clarificationForm.controls['userAreaCaptures'].value,
      rejectNoticeId: this.dataClarifications2.rejectNotificationId,
    };

    this.loading = true;
    this.documentService.createClarDocImp(modelReport).subscribe({
      next: data => {
        this.openReport(data);
        this.loading = false;
        this.close();
      },
      error: error => {
        this.loading = false;

        //this.onLoadToast('error', 'No se pudo guardar', '');
      },
    });
  }

  aclaracionComercioExterior() {
    //Recupera información del usuario logeando para luego registrarlo como firmante
    let token = this.authService.decodeToken();

    //Crear objeto para generar el reporte
    const modelReport: IClarificationDocumentsImpro = {
      clarification: this.clarificationForm.controls['clarification'].value,
      sender: this.clarificationForm.controls['senderName'].value, //Nombre Remitente - DELEGADO
      //foundation: ",",
      //id: 1, //ID primaria
      version: 1,
      //transmitterId: ",",
      paragraphInitial:
        this.clarificationForm.controls['paragraphInitial'].value,
      applicationId: this.idRequest,
      positionSender: this.clarificationForm.controls['senderCharge'].value, //Cargo Remitente - DELEGADO
      paragraphFinal: this.clarificationForm.controls['paragraphFinal'].value,
      consistentIn: this.clarificationForm.controls['observations'].value,
      managedTo: this.clarificationForm.controls['addresseeName'].value, //Nombre destinatario - Titular de la solicitud
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      positionAddressee:
        this.clarificationForm.controls['positionAddressee'].value, //Cargo destinatario - Titular de la solicitud
      modificationDate: new Date(),
      creationUser: token.name,
      documentTypeId: '212',
      modificationUser: token.name,
      //worthAppraisal: 1,
      creationDate: new Date(),
      //rejectNoticeId: 1,
      assignmentInvoiceDate: new Date(),
      mailNotification: this.clarificationForm.controls['webMail'].value,
      areaUserCapture:
        this.clarificationForm.controls['userAreaCaptures'].value,
      rejectNoticeId: this.dataClarifications2.rejectNotificationId,
    };

    this.loading = true;
    this.documentService.createClarDocImp(modelReport).subscribe({
      next: data => {
        if (
          this.notification?.clarification?.clarification ==
          'INDIVIDUALIZACIÓN DE BIENES'
        ) {
          this.updateAnsweredAcla(
            this.notification.rejectNotificationId,
            this.notification.chatClarification.idClarification,
            this.notification.goodId
          );
        } else {
          const createClarGoodDoc = this.createClarGoodDoc(data);

          if (createClarGoodDoc) {
            this.openReport(data);
            this.loading = false;
            this.close();
          }
        }
      },
      error: error => {
        this.loading = false;

        //this.onLoadToast('error', 'No se pudo guardar', '');
      },
    });
  }

  oficioAclaracionTransferente() {
    //Recupera información del usuario logeando para luego registrarlo como firmante
    let token = this.authService.decodeToken();

    //Crear objeto para generar el reporte
    const modelReport: IClarificationDocumentsImpro = {
      clarification: this.clarificationForm.controls['clarification'].value,
      sender: this.clarificationForm.controls['senderName'].value, //Nombre Remitente - DELEGADO
      //foundation: ",",
      //id: 1, //ID primaria
      version: 1,
      //transmitterId: ",",
      paragraphInitial:
        this.clarificationForm.controls['paragraphInitial'].value,
      applicationId: this.idRequest,
      positionSender: this.clarificationForm.controls['senderCharge'].value, //Cargo Remitente - DELEGADO
      paragraphFinal: this.clarificationForm.controls['paragraphFinal'].value,
      consistentIn: this.clarificationForm.controls['consistentIn'].value,
      managedTo: this.clarificationForm.controls['addresseeName'].value, //Nombre destinatario - Titular de la solicitud
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      positionAddressee:
        this.clarificationForm.controls['positionAddressee'].value, //Cargo destinatario - Titular de la solicitud
      modificationDate: new Date(),
      creationUser: token.name,
      documentTypeId: '104',
      modificationUser: token.name,
      //worthAppraisal: 1,
      creationDate: new Date(),
      //rejectNoticeId: 1,
      assignmentInvoiceDate: new Date(),
      mailNotification: this.clarificationForm.controls['webMail'].value,
      areaUserCapture:
        this.clarificationForm.controls['userAreaCaptures'].value,
      rejectNoticeId: this.dataClarifications2.rejectNotificationId,
    };

    this.loading = true;
    this.documentService.createClarDocImp(modelReport).subscribe({
      next: data => {
        const createClarGoodDoc = this.createClarGoodDoc(data);

        if (createClarGoodDoc) {
          this.openReport(data);
          this.loading = false;
          this.close();
        }
      },
      error: error => {
        this.loading = false;

        //this.onLoadToast('error', 'No se pudo guardar', '');
      },
    });
  }

  aclaracionAsegurados() {
    //Recupera información del usuario logeando para luego registrarlo como firmante
    let token = this.authService.decodeToken();

    //Crear objeto para generar el reporte
    const modelReport: IClarificationDocumentsImpro = {
      clarification: this.clarificationForm.controls['clarification'].value,
      sender: this.clarificationForm.controls['senderName'].value, //Nombre Remitente - DELEGADO
      //foundation: ",",
      //id: 1, //ID primaria
      version: 1,
      //transmitterId: ",",
      paragraphInitial:
        this.clarificationForm.controls['paragraphInitial'].value,
      applicationId: this.idRequest,
      positionSender: this.clarificationForm.controls['senderCharge'].value, //Cargo Remitente - DELEGADO
      paragraphFinal: this.clarificationForm.controls['paragraphFinal'].value,
      consistentIn: this.clarificationForm.controls['consistentIn'].value,
      managedTo: this.clarificationForm.controls['addresseeName'].value, //Nombre destinatario - Titular de la solicitud
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      positionAddressee:
        this.clarificationForm.controls['positionAddressee'].value, //Cargo destinatario - Titular de la solicitud
      modificationDate: new Date(),
      creationUser: token.name,
      documentTypeId: '211',
      modificationUser: token.name,
      //worthAppraisal: 1,
      creationDate: new Date(),
      //rejectNoticeId: 1,
      assignmentInvoiceDate: new Date(),
      mailNotification: this.clarificationForm.controls['webMail'].value,
      areaUserCapture:
        this.clarificationForm.controls['userAreaCaptures'].value,
      rejectNoticeId: this.dataClarifications2.rejectNotificationId,
    };

    this.loading = true;
    this.documentService.createClarDocImp(modelReport).subscribe({
      next: async data => {
        const createClarGoodDoc = this.createClarGoodDoc(data);
        if (createClarGoodDoc) {
          this.openReport(data);
          this.loading = false;
          this.close();
        }
      },
      error: error => {
        this.loading = false;

        //this.onLoadToast('error', 'No se pudo guardar', '');
      },
    });
  }

  createClarGoodDoc(docImpro: IClarificationDocumentsImpro) {
    return new Promise((resolve, reject) => {
      const formData = {
        documentId: docImpro.id,
        version: '1',
        clarificationRequestId: docImpro.rejectNoticeId,
      };
      this.documentService.createClarDocGood(formData).subscribe({
        next: () => {
          resolve(true);
        },
        error: error => {},
      });
    });
  }

  aclaracionTransferentesVoluntarias() {
    if (this.countAclaraManual === 1) {
      //Recupera información del usuario logeando para luego registrarlo como firmante
      let token = this.authService.decodeToken();

      //Crear objeto para generar el reporte
      const modelReport: IClarificationDocumentsImpro = {
        clarification: this.clarificationForm.controls['clarification'].value,
        sender: this.clarificationForm.controls['senderName'].value, //Nombre Remitente - DELEGADO
        //foundation: ",",
        //id: 1, //ID primaria
        version: 1,
        //transmitterId: ",",
        paragraphInitial:
          this.clarificationForm.controls['paragraphInitial'].value,
        applicationId: this.idRequest,
        positionSender: this.clarificationForm.controls['senderCharge'].value, //Cargo Remitente - DELEGADO
        paragraphFinal: this.clarificationForm.controls['paragraphFinal'].value,
        consistentIn: this.clarificationForm.controls['consistentIn'].value,
        managedTo: this.clarificationForm.controls['addresseeName'].value, //Nombre destinatario - Titular de la solicitud
        invoiceLearned: this.folioReporte,
        //invoiceNumber: 1,
        positionAddressee:
          this.clarificationForm.controls['positionAddressee'].value, //Cargo destinatario - Titular de la solicitud
        modificationDate: new Date(),
        creationUser: token.name,
        documentTypeId: '213',
        modificationUser: token.name,
        //worthAppraisal: 1,
        creationDate: new Date(),
        //rejectNoticeId: 1,
        assignmentInvoiceDate: new Date(),
        mailNotification: this.clarificationForm.controls['webMail'].value,
        areaUserCapture:
          this.clarificationForm.controls['userAreaCaptures'].value,
        rejectNoticeId: this.dataClarifications2.rejectNotificationId,
      };

      this.loading = true;
      this.documentService.createClarDocImp(modelReport).subscribe({
        next: data => {
          const createClarGoodDoc = this.createClarGoodDoc(data);
          if (createClarGoodDoc) {
            this.openReport(data);
            this.loading = false;
            this.close();
          }
        },
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'No se pudo guardar', '');
        },
      });
    } else {
    }
  }

  changeStatusAnswered(xml: string) {
    this.loading = true;
    this.paramsReload.getValue()['filter.clarifiNewsRejectId'] =
      this.dataClarifications2.rejectNotificationId;

    this.chatService.getAll(this.paramsReload.getValue()).subscribe({
      next: data => {
        this.dataChatClarifications = data.data;
        this.updateChatClarification(this.dataChatClarifications[0], xml);
      },
      error: error => {},
    });
  }

  //Variables temporales para respuesta del SAT

  updateChatClarification(
    chatClarifications: IChatClarifications,
    xml: string
  ) {
    const transferente = this.infoRequest.transferent.name;
    const idOficioAclaracion: string = 'AGA-SA24130-803-5230';
    const oficio = this.infoRequest.paperNumber;
    const fechaOficio = this.infoRequest.paperDate;
    const nombreDestinatario: string =
      this.clarificationForm?.controls['addresseeName'].value;
    const puestoDestinatario: string =
      this.clarificationForm?.controls['positionAddressee'].value;
    const estado = this.infoRequest.regionalDelegation.keyState;
    const ciudad = this.infoRequest.regionalDelegation.city;
    const direccion = this.infoRequest.regionalDelegation.officeAddress;
    const regional = this.infoRequest.regionalDelegation.description;
    const cargoTitular = this.clarificationForm.controls['senderCharge'].value;
    const titular = this.clarificationForm.controls['senderName'].value;

    this.xmlRespSat = `<OficioAclaracion><IdOficioAclaracion>${idOficioAclaracion}</IdOficioAclaracion><VersionOficio>1.0</VersionOficio><AdministracionGeneral>${transferente}</AdministracionGeneral><UnidadTransferente>Transferente de ${estado}</UnidadTransferente><IdUnidadTransferente>803</IdUnidadTransferente><NoOficio>${oficio}</NoOficio><FechaOficio>${fechaOficio}</FechaOficio><Asunto>Aclaración en atención al oficio ${this.folioReporte} de fecha ${fechaOficio}.</Asunto><LugarFechaEmision>${ciudad}, ${estado}, a 01 de agosto de 2023.</LugarFechaEmision><LeyendaAnioOficial></LeyendaAnioOficial><NombreDestinatario>${nombreDestinatario}</NombreDestinatario><PuestoDestinatario>${puestoDestinatario}</PuestoDestinatario><DireccionDestinatario>${direccion}, ${ciudad}, Chiapas</DireccionDestinatario><RegionalSAE>${regional}</RegionalSAE><Titular>${titular}</Titular><RFCTitular>AEDL7001109G8</RFCTitular><CargoTitular>${cargoTitular}</CargoTitular><PieOficio1>Carretera Federal 200 Tepic-Talismán, Km. 24+400m Tramo Tapachula - Ciudad Hidalgo, Municipio de Suchiate, C.P. 30840, Ciudad Hidalgo, Chiapas</PieOficio1><PieOficio2>Tel.: 01(962) 6202000   sat.gob.mx   youtube/satmx  twitter.com/satmx.</PieOficio2><Parrafo>En atención al oficio número ${this.folioReporte} de fecha ${fechaOficio}, el cual hace referencia al oficio de transferencia Aduana-de-Cd-Hidalgo-2022-334 de fecha 30 de noviembre de 1999, dirigido al Servicio de Administración y Enajenación de Bienes, mediante el cual se puso a disposición diversos bienes, afectos al(os) expediente(s) A-108/20 y donde se acredita que han pasado a propiedad del Fisco Federal o estan disponibles para su transferencia.\n\nEn virtud de lo anterior, le informo que se anexa ACUERDO DE ADJUDICACION DELAS MERCANCIAS A-108/20, MEDIANTE EL CUAL SE PASO A PROPIEDAD DEL FISCO FEDERAL LA MERCANCIA..\n\n1.- ACUERDO DE ADJUDICACION\n\n\nSin otro asunto en particular, le envío un cordial saludo.</Parrafo><Suplencia>En suplencia por ausencia del Administrador de la Aduana de Ciudad Hidalgo, con fundamento en los artículos 1, 2, primer párrafo, apartado D, segundo párrafo; 4, sexto párrafo; 5, último párrafo; 7 primer párrafo fracción XII y último párrafo, 19 párrafos primero, segundo y tercero, numeral 9, y 21 primer párrafo, apartado A, fracción I y último párrafo del Reglamento Interior del Servicio de Administración Tributaria publicado en el Diario Oficial de la Federación el 24 de agosto de 2015, firma el  de la Aduana.</Suplencia><DocumentosAdjuntos><Documento><DocAdjunto>ACUERDO DE ADJUDICACION</DocAdjunto><ArchivoDocAdjunto>SA24130-5230-8900.pdf</ArchivoDocAdjunto><AlgoritmoHashDocAdjunto>SHA1</AlgoritmoHashDocAdjunto><HashDocAdjunto>6935cc0476c76a19178f1d8b0572dfeefbb1e6aa</HashDocAdjunto></Documento></DocumentosAdjuntos><ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
<ds:SignedInfo>
<ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"></ds:CanonicalizationMethod>
<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"></ds:SignatureMethod>
<ds:Reference URI="">
<ds:Transforms>
<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"></ds:Transform>
<ds:Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments"></ds:Transform>
</ds:Transforms>
<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"></ds:DigestMethod>
<ds:DigestValue>GQZ5G/VQjYa25UtnpjeAT4Za5x4=</ds:DigestValue>
</ds:Reference>
</ds:SignedInfo>
<ds:SignatureValue>
h3ZxEjVczSMVPJqOXQ7K78VUCHo4wQX5kgmfj6DKBz31rZXdnTs3oZf9NdIKwThqTiUGUhfkE3d0
qRA63kI+p7ObrXtxUyRhGR6k4ZyjPy4iw1k36URvPLX+hGyKuRpkSUBVo/ZR9HM+0hZLVefyC55d
ssqG2NXKaWKIuocA7PGZR1Am8ZwcqAcabek4M0jIGx0N50hvga+RpmVKNccz6rzlIIsVBL39Mbsc
BbNIKlgbsI74zRoWl56BVR71i51UUdMRRlNuWKIGBFEkXue3Hczt1jl/KWUWBj7JvAKLi8gjPyiX
Ayvj531AhQk1AoyWqzeoLZSiJMu/BiVZcIIP0g==
</ds:SignatureValue>
<ds:KeyInfo>
<ds:X509Data>
<ds:X509Certificate>
MIIGTzCCBDegAwIBAgIUMDAwMDEwMDAwMDA1MDI1NjkxMTkwDQYJKoZIhvcNAQELBQAwggGEMSAw
HgYDVQQDDBdBVVRPUklEQUQgQ0VSVElGSUNBRE9SQTEuMCwGA1UECgwlU0VSVklDSU8gREUgQURN
SU5JU1RSQUNJT04gVFJJQlVUQVJJQTEaMBgGA1UECwwRU0FULUlFUyBBdXRob3JpdHkxKjAoBgkq
hkiG9w0BCQEWG2NvbnRhY3RvLnRlY25pY29Ac2F0LmdvYi5teDEmMCQGA1UECQwdQVYuIEhJREFM
R08gNzcsIENPTC4gR1VFUlJFUk8xDjAMBgNVBBEMBTA2MzAwMQswCQYDVQQGEwJNWDEZMBcGA1UE
CAwQQ0lVREFEIERFIE1FWElDTzETMBEGA1UEBwwKQ1VBVUhURU1PQzEVMBMGA1UELRMMU0FUOTcw
NzAxTk4zMVwwWgYJKoZIhvcNAQkCE01yZXNwb25zYWJsZTogQURNSU5JU1RSQUNJT04gQ0VOVFJB
TCBERSBTRVJWSUNJT1MgVFJJQlVUQVJJT1MgQUwgQ09OVFJJQlVZRU5URTAeFw0xOTEyMjYxODEz
NDhaFw0yMzEyMjYxODE0MjhaMIHrMSgwJgYDVQQDEx9NQVJJQSBERSBMT1VSREVTIEFSRVZBTE8g
REFNSUFOMSgwJgYDVQQpEx9NQVJJQSBERSBMT1VSREVTIEFSRVZBTE8gREFNSUFOMSgwJgYDVQQK
Ex9NQVJJQSBERSBMT1VSREVTIEFSRVZBTE8gREFNSUFOMQswCQYDVQQGEwJNWDEpMCcGCSqGSIb3
DQEJARYabG91cmRlcy5hcmV2YWxvQHNhdC5nb2IubXgxFjAUBgNVBC0TDUFFREw3MDAxMTA5Rzgx
GzAZBgNVBAUTEkFFREw3MDAxMTBNQ1NSTVIwNDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAIsVyjuQMkhs8P94lPdlRDUAX+8uMEsKclwA1djEzx0hWUlzr5SAu7ea/WeawsZSZmenw6t7
bIF/Qc8DW0MHbuPXgKmHUTaOm8KEiyAIovVj+XUwpnuIMFF/agDMTqOqQMx/hNcN8p8JvwTHHSdV
qZyVrkJC3TAbFRwmF4CY35SsQsQHoEaPbdRDTmQr+YWUHdK1JYqYXEYr6xuzE9HFy88qsUxr9O5L
FKnB+h8tyw0t3HvwdnkIUQl0XdHFEcYehmpZGWH5L4NDOn4XKdCWrQA9Qsv8IIdoK/yPwNd42lcL
sx+kA11RXXsTbgxC0NMP6nw9cc7GHrSfs/M8d4LV39MCAwEAAaNPME0wDAYDVR0TAQH/BAIwADAL
BgNVHQ8EBAMCA9gwEQYJYIZIAYb4QgEBBAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMEBggrBgEF
BQcDAjANBgkqhkiG9w0BAQsFAAOCAgEAdvnHPUGa1NRrms3LMXArPr9uwr8e0rLHsrCTZj4zxDG0
0uRIltfUSE3RCa3JAHTReC9uuPp5dFWvmDgC3nk2jXldpw9HqlAycmKQPnYPsCEDzsKBuJJ2Rz8B
s5OtTExxKqkb2BWvjkTvXlLhnWe/E3Ib609BcHbprL2FECQ1om+YNuzhdWoEJTuI9n8ryEw/taZ3
LQ7lYt2D4AtKJg7NaCG/181ZKD2koUNBnSTtmhvbH29jBYC2CTnX34BOPlcERPE9E4HuzBkZSVOx
wF1oZMbNLwSpI3gLJlEL7HTViuR94kKpEzPwWTujDhEzXCdK8+9OcvxLfey3dP72IDioLzcTBJdu
fBT/bgLLSl6/pJJffKCg0Hf6gwEDXLRSmmYU9Ii4F0CFakyRIKQ3Fk69VYhzKxYVXo+uSHxWIHWI
u6yb0hGAP0NoJpjQe4KWZm807AuVI2JwEK5ZTAfsHtn7k2sPeI8pJ6uho0zZudkugJ/Z/RLRLdeA
MYLjqDnmzqr6pgichkEsnuUvjhgEY0dNMfljd8bUTUFg6TrQ8PSSEP3A1LqB07ao6jSsOsXbd8dB
7RAQSFcv7gtHJakCwLDEVbXMI9d1rmiq6LmkHXeajEwpib54CwmLeiU/wfiGdamjAQWu2qptnz2R
bJf6G7qGAQKP2mJZ1zTY5YZmZeOUj1o=
</ds:X509Certificate>
</ds:X509Data>
<ds:KeyValue>
<ds:RSAKeyValue>
<ds:Modulus>
ixXKO5AySGzw/3iU92VENQBf7y4wSwpyXADV2MTPHSFZSXOvlIC7t5r9Z5rCxlJmZ6fDq3tsgX9B
zwNbQwdu49eAqYdRNo6bwoSLIAii9WP5dTCme4gwUX9qAMxOo6pAzH+E1w3ynwm/BMcdJ1WpnJWu
QkLdMBsVHCYXgJjflKxCxAegRo9t1ENOZCv5hZQd0rUliphcRivrG7MT0cXLzyqxTGv07ksUqcH6
Hy3LDS3ce/B2eQhRCXRd0cURxh6GalkZYfkvg0M6fhcp0JatAD1Cy/wgh2gr/I/A13jaVwuzH6QD
XVFdexNuDELQ0w/qfD1xzsYetJ+z8zx3gtXf0w==
</ds:Modulus>
<ds:Exponent>AQAB</ds:Exponent>
</ds:RSAKeyValue>
</ds:KeyValue>
</ds:KeyInfo>
</ds:Signature></OficioAclaracion>`;

    const modelChatClarifications: IChatClarifications = {
      id: chatClarifications.id, //ID primaria
      clarifiNewsRejectId: this.dataClarifications2.rejectNotificationId, //Establecer ID de bienes_recha_notif_aclara
      requestId: this.idRequest,
      goodId: this.dataClarifications2.goodId,
      xmlJobClarification: xml,
      xmlClarificationJobResp: this.xmlRespSat,

      //clarificationStatus: 'EN_ACLARACION', //Valor a cambiar
    };

    this.chatService
      .update(chatClarifications.id, modelChatClarifications)
      .subscribe({
        next: async data => {
          if (data.clarificationTypeId == 1) {
            this.updateAnsweredAcla(
              data.clarifiNewsRejectId,
              chatClarifications.id,
              modelChatClarifications.goodId
            );
          } else if (data.clarificationTypeId == 2) {
            this.updateAnsweredImpro(
              data.clarifiNewsRejectId,
              chatClarifications.id,
              modelChatClarifications.goodId
            );
          }
        },
        error: error => {
          this.onLoadToast('error', 'No se pudo actualizar', '');
        },
      });
  }

  updateAnsweredAcla(
    id?: number,
    chatClarId?: number | string,
    goodId?: number,
    observations?: string
  ) {
    const data: ClarificationGoodRejectNotification = {
      rejectionDate: new Date(),
      rejectNotificationId: id,
      answered: 'EN ACLARACION', // ??
      observations: observations,
    };

    this.rejectedGoodService.update(id, data).subscribe({
      next: () => {
        const updateInfo: IChatClarifications = {
          requestId: this.idRequest,
          goodId: goodId,
          clarificationStatus: 'EN_ACLARACION',
        };
        this.chatService.update(chatClarId, updateInfo).subscribe({
          next: data => {
            this.loading = false;

            //his.onLoadToast('success', 'Actualizado', '');
            this.modalRef.content.callback(true, data.goodId);
            this.modalRef.hide();
          },
          error: error => {
            this.loading = false;
          },
        });
      },
    });
  }

  updateAnsweredImpro(
    id?: number,
    chatClarId?: number,
    goodId?: number,
    observations?: string
  ) {
    const data: ClarificationGoodRejectNotification = {
      rejectionDate: new Date(),
      rejectNotificationId: id,
      answered: 'EN ACLARACION',
      observations: observations,
    };

    this.rejectedGoodService.update(id, data).subscribe({
      next: () => {
        const updateInfo: IChatClarifications = {
          requestId: this.idRequest,
          goodId: goodId,
          clarificationStatus: 'EN_ACLARACION',
        };
        this.chatService.update(chatClarId, updateInfo).subscribe({
          next: data => {
            this.modalRef.content.callback(true, data.goodId);
            this.modalRef.hide();
          },
          error: error => {},
        });
      },
    });
  }

  saveClarificationsAcept() {
    const typeTransferent = this.infoRequest.typeOfTransfer;

    if (this.dataClarifications2.answered == 'NUEVA') {
      //Se tiene que guardar el id del documento generado
      //Se guardan las observaciones

      if (
        this.dataClarifications2.clarificationType == 'SOLICITAR_IMPROCEDENCIA'
      ) {
      } else {
        this.updateAnsweredAcla(
          this.dataClarifications2.rejectNotificationId,
          this.dataClarifications2.chatClarification.idClarification,
          this.dataClarifications2.goodId,
          this.dataClarifications2.observations
        );
      }
    }
  }

  obtainTypeDocument(improcedencia: boolean, request: IRequest) {
    const typeTransference = this.infoRequest.typeOfTransfer;
    let generaXML: boolean = false;
    if (
      typeTransference == 'SAT_SAE' &&
      this.dataClarifications2.chatClarification.idClarificationType == '2'
    ) {
      generaXML = true;
    }

    return new Promise((resolve, reject) => {
      if (generaXML && !improcedencia) {
        this.typeDoc = 'OficioAclaracionTransferente';
      }

      if (this.infoRequest.transferent?.type == 'A') {
        if (improcedencia) {
          this.typeDoc = 'OficioImprocedencia';
        } else {
          this.typeDoc = 'AclaracionAsegurados';
        }
      } else if (this.infoRequest.transferent?.type == 'CE') {
        if (improcedencia) {
          this.typeDoc = 'OficioImprocedencia';
        } else {
          this.typeDoc = 'AclaracionComercioExterior';
        }
      } else if (this.infoRequest.transferent?.type == 'NO') {
        if (improcedencia) {
          this.typeDoc = 'ImprocedenciaTransferentesVoluntarias';
        } else {
          this.typeDoc = 'AclaracionTransferentesVoluntarias';
        }
      }

      resolve(true);
    });
  }

  dataChatClarifications: IChatClarifications[];

  //Método para generar reporte y posteriormente la firma
  openReport(data?: IClarificationDocumentsImpro) {
    const notificationValidate = 'Y';
    const idReportAclara = data.id;
    //const idDoc = data.id;
    const idTypeDoc = Number(data.documentTypeId);
    const requestInfo = this.infoRequest;
    const idSolicitud = this.idSolicitud;
    const noBien = this.dataClarifications2.goodId;
    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        requestInfo,
        idTypeDoc,
        //idDoc,
        idReportAclara,
        idSolicitud,
        notificationValidate,
        noBien,
        callback: (next: boolean, xml?: string) => {
          if (next) {
            this.changeStatusAnswered(xml);
            if (
              this.clarificationForm?.controls['amount'].value != null ||
              this.clarificationForm?.controls['unit'].value != null ||
              this.clarificationForm?.controls['description'].value != null
            ) {
              this.changeSimulateGood();
            }
          } else {
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PrintReportModalComponent, config);
  }

  //Modifica atributos del bien
  changeSimulateGood() {
    //Obtiene noBien
    const noGood = this.dataClarifications2.goodId;
    //Establecer Cantidad
    const amountNew = 2;
    //Unidad
    const unitNew = 'PZ';
    //

    //Traer información del Bien
    this.goodService.getById(noGood).subscribe({
      next: resp => {
        const obj = {
          id: noGood,
          goodId: noGood,
          goodClassNumber: resp.goodClassNumber,
          quantity: this.clarificationForm?.controls['amount'].value,
          unitMeasure: this.clarificationForm?.controls['unit'].value,
          unit: this.clarificationForm?.controls['unit'].value,
          description: this.clarificationForm?.controls['description'].value,
        };

        //Actualiza el Bien
        this.goodService.update(obj).subscribe({
          next: resp => {},
          error: error => {},
        });
      },
      error: error => {},
    });
  }

  //Método para crear número secuencial según la no delegación del user logeado
  dictamenSeq() {
    let token = this.authService.decodeToken();

    const pNumber = Number(token.department);

    this.applicationGoodsQueryService.getDictamenSeq(pNumber).subscribe({
      next: response => {
        // this.noFolio = response.data;
        this.folio = response;
        this.generateClave(this.folio.dictamenDelregSeq);
      },
      error: error => {},
    });
  }

  //Método para construir folio con información del usuario
  generateClave(noDictamen?: string) {
    //Trae información del usuario logeado
    let token = this.authService.decodeToken();
    //Trae el año actuar
    const year = this.today.getFullYear();
    //Cadena final (Al final las siglas ya venian en el token xd)

    if (token.siglasnivel4 != null) {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${token.siglasnivel4}/${noDictamen}/${year}`;

      this.clarificationForm
        .get('keyClarificationPaper')
        .setValue(this.folioReporte);
    } else {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${noDictamen}/${year}`;

      this.clarificationForm
        .get('keyClarificationPaper')
        .setValue(this.folioReporte);
    }
  }

  close() {
    this.modalRef.hide();
  }

  tipoTransferente = 'SAT_SAE';
  tipoNotificacion = 2;
}
