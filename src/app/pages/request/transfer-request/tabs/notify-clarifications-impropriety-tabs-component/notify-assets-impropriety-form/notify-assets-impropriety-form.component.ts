import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IChatClarifications } from 'src/app/core/models/ms-chat-clarifications/chat-clarifications-model';
import { ClarificationGoodRejectNotification } from 'src/app/core/models/ms-clarification/clarification-good-reject-notification';
import { IClarificationDocumentsImpro } from 'src/app/core/models/ms-documents/clarification-documents-impro-model';
import { IDictamenSeq } from 'src/app/core/models/ms-goods-query/opinionDelRegSeq-model';
import { IRequest } from 'src/app/core/models/requests/request.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { ApplicationGoodsQueryService } from 'src/app/core/services/ms-goodsquery/application.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
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
  clarification: any;

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
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private documentService: DocumentsService,
    private chatService: ChatClarificationsService,
    private rejectedGoodService: RejectedGoodService,
    private authService: AuthService,
    private requestService: RequestService,
    private chatClarificationsService: ChatClarificationsService,
    private applicationGoodsQueryService: ApplicationGoodsQueryService
  ) {
    super();
    this.today = new Date();
  }

  //dataDocumentsImpro: IClarificationDocumentsImpro;
  ngOnInit(): void {
    console.log('Tipo de aclaración... ', this.typeClarifications);
    console.log('información de request', this.infoRequest);
    this.generateClave();
    this.withDocumentation = this.idAclara === '1' ? true : false;
    console.log('info request', this.infoRequest);
    console.log('info not', this.dataClarifications2);
    this.dictamenSeq();
    this.initForm1();
    const applicationId = this.idRequest;
    const rejectNoticeId = this.dataClarifications2.rejectNotificationId;
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
      addresseeName: ['', [Validators.required, Validators.maxLength(50)]],

      positionAddressee: [
        '',
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],

      senderName: [
        this.infoRequest.nameOfOwner,
        [
          Validators.pattern(STRING_PATTERN),
          //Validators.required,
          Validators.maxLength(50),
        ],
      ],

      senderCharge: [
        this.infoRequest.holderCharge,
        [
          Validators.pattern(STRING_PATTERN),
          //Validators.required,
          Validators.maxLength(50),
        ],
      ],

      consistentIn: [
        '',
        [
          Validators.pattern(STRING_PATTERN),
          //Validators.required,
          Validators.maxLength(1000),
        ],
      ],

      paragraphInitial: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ],
      paragraphFinal: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(1000)],
      ],

      clarification: [
        '',
        [
          Validators.pattern(STRING_PATTERN),
          //Validators.required,
          Validators.maxLength(1000),
        ],
      ],

      observations: [
        this.dataClarifications2?.observations,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(400)],
      ],

      foundation: [
        '',
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(4000),
        ],
      ],

      transmitterId: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(15)],
      ],

      invoiceLearned: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],

      worthAppraisal: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],

      /*jobClarificationKey: [
        this.dataClarifications2.chatClarification.keyClarificationPaper,
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.required],
      ], */

      userAreaCaptures: [
        this.dataClarifications2?.chatClarification?.areaUserCapture,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],

      webMail: [
        this.dataClarifications2?.chatClarification?.emailWeb,
        [
          Validators.required,
          Validators.pattern(EMAIL_PATTERN),
          Validators.maxLength(30),
        ],
      ],
    });
  }

  async confirm() {
    console.log('Aclaración', this.clarificationForm.value);
    const typeTransference = this.infoRequest.typeOfTransfer;
    let generaXML: boolean = false;
    if (
      typeTransference == 'SAT_SAE' &&
      this.dataClarifications2.chatClarification.idClarificationType == '2'
    ) {
      console.log('Soy tipo Aclaración de SAT_SAE y 2');
      generaXML = true;
    }

    if (typeTransference != 'SAT_SAE' || generaXML) {
      console.log('Soy tipo Aclaración,', typeTransference);
      if (this.typeClarifications == 2 && typeTransference != 'SAT_SAE') {
        console.log(
          'Aclaracipon tipo 2, ImprocedenciaTransferentesVoluntarias tipo 216'
        );
        this.improcedenciaTransferentesVoluntarias(); //Aclaración Manual tipo 2
      }
      const obtainTypeDocument = await this.obtainTypeDocument(
        false,
        this.infoRequest
      );
      if (obtainTypeDocument) {
        //console.log('Tipo', this.typeDoc);
        //Depende del tipo de documento, envia al método correspondiente
        switch (this.typeDoc) {
          case 'AclaracionAsegurados': {
            if (this.typeClarifications == 2) {
              console.log('Aclaracipon tipo 2, OficioImprocedencia tipo 111');
              this.oficioImprocedencia(); //Aclaración PGR tipo 2
            } else {
              console.log('Método para: ', this.typeDoc);
              this.aclaracionAsegurados(); //Aclaración PGR tipo 1
            }

            break;
          }
          case 'AclaracionTransferentesVoluntarias': {
            if (this.typeClarifications == 1) {
              console.log('Método para: ', this.typeDoc);
              this.aclaracionTransferentesVoluntarias(); //Aclaración  MANUAL tipo 1
            }

            break;
          }
        }
      }
    }

    console.log(generaXML);
    console.log(typeTransference);

    if (typeTransference == 'SAT_SAE' && this.typeClarifications == 2) {
      console.log(
        'Soy: ',
        typeTransference,
        'documento: OficioAclaracionTransferente'
      ); //Duda
      this.oficioAclaracionTransferente();
    }

    if (typeTransference == 'SAT_SAE' && this.typeClarifications == 1) {
      console.log(
        'Soy: ',
        typeTransference,
        'documento: AclaracionComercioExterior '
      ); //Duda
      this.aclaracionComercioExterior();
    }

    //this.saveClarificationsAcept();
  }

  improcedenciaTransferentesVoluntarias() {
    //Recupera información del usuario logeando para luego registrarlo como firmante
    let token = this.authService.decodeToken();

    //Crear objeto para generar el reporte
    const modelReport: IClarificationDocumentsImpro = {
      clarification: this.dataClarifications2.clarificationType,
      sender: this.clarificationForm.controls['senderName'].value,
      //foundation: ",",
      //id: 1, //ID primaria
      version: 1,
      //transmitterId: ",",
      paragraphInitial:
        this.clarificationForm.controls['paragraphInitial'].value,
      applicationId: this.idRequest,
      positionSender: this.clarificationForm.controls['senderCharge'].value,
      paragraphFinal: this.clarificationForm.controls['paragraphFinal'].value,
      consistentIn: this.clarificationForm.controls['consistentIn'].value,
      //managedTo: this.clarificationForm.controls['addresseeName'].value,
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      //positionAddressee: this.clarificationForm.controls['positionAddressee'].value,
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
        //this.onLoadToast('success','Aclaración guardada correctamente','' );
        //this.chatClarifications2(); //PARA FORMULARIO LARGO | CREAR NUEVO MÉTODO O CONDICIONAR LOS VALORES DE FORMULARIOS
        this.openReport(data); //Falta verificar información que se envia...
        //this.modalRef.content.callback(true);
        this.loading = false;
        this.saveClarificationsAcept();
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
      clarification: this.dataClarifications2.clarificationType,
      sender: this.clarificationForm.controls['senderName'].value,
      //foundation: ",",
      //id: 1, //ID primaria
      version: 1,
      //transmitterId: ",",
      paragraphInitial:
        this.clarificationForm.controls['paragraphInitial'].value,
      applicationId: this.idRequest,
      positionSender: this.clarificationForm.controls['senderCharge'].value,
      paragraphFinal: this.clarificationForm.controls['paragraphFinal'].value,
      consistentIn: this.clarificationForm.controls['consistentIn'].value,
      //managedTo: this.clarificationForm.controls['addresseeName'].value,
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      //positionAddressee: this.clarificationForm.controls['positionAddressee'].value,
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
        //this.onLoadToast('success','Aclaración guardada correctamente','' );
        //this.chatClarifications2(); //PARA FORMULARIO LARGO | CREAR NUEVO MÉTODO O CONDICIONAR LOS VALORES DE FORMULARIOS
        this.openReport(data); //Falta verificar información que se envia...
        //this.modalRef.content.callback(true);
        this.saveClarificationsAcept();
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
      clarification: this.dataClarifications2.clarificationType,
      sender: this.clarificationForm.controls['senderName'].value,
      //foundation: ",",
      //id: 1, //ID primaria
      version: 1,
      //transmitterId: ",",
      paragraphInitial:
        this.clarificationForm.controls['paragraphInitial'].value,
      applicationId: this.idRequest,
      positionSender: this.clarificationForm.controls['senderCharge'].value,
      paragraphFinal: this.clarificationForm.controls['paragraphFinal'].value,
      consistentIn: this.clarificationForm.controls['consistentIn'].value,
      //managedTo: this.clarificationForm.controls['addresseeName'].value,
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      //positionAddressee: this.clarificationForm.controls['positionAddressee'].value,
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
        //this.onLoadToast('success','Aclaración guardada correctamente','' );
        //this.chatClarifications2(); //PARA FORMULARIO LARGO | CREAR NUEVO MÉTODO O CONDICIONAR LOS VALORES DE FORMULARIOS
        this.openReport(data); //Falta verificar información que se envia...
        //this.modalRef.content.callback(true);
        this.loading = false;
        this.close();
        this.chatClarifications2();
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
      clarification: this.dataClarifications2.clarificationType,
      sender: this.clarificationForm.controls['senderName'].value,
      //foundation: ",",
      //id: 1, //ID primaria
      version: 1,
      //transmitterId: ",",
      paragraphInitial:
        this.clarificationForm.controls['paragraphInitial'].value,
      applicationId: this.idRequest,
      positionSender: this.clarificationForm.controls['senderCharge'].value,
      paragraphFinal: this.clarificationForm.controls['paragraphFinal'].value,
      consistentIn: this.clarificationForm.controls['consistentIn'].value,
      //managedTo: this.clarificationForm.controls['addresseeName'].value,
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      //positionAddressee: this.clarificationForm.controls['positionAddressee'].value,
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
        //this.onLoadToast('success','Aclaración guardada correctamente','' );
        //this.chatClarifications2(); //PARA FORMULARIO LARGO | CREAR NUEVO MÉTODO O CONDICIONAR LOS VALORES DE FORMULARIOS
        this.openReport(data); //Falta verificar información que se envia...
        //this.modalRef.content.callback(true);
        this.loading = false;
        this.close();
        this.chatClarifications2();
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
      clarification: this.dataClarifications2.clarificationType,
      sender: this.clarificationForm.controls['senderName'].value,
      //foundation: ",",
      //id: 1, //ID primaria
      version: 1,
      //transmitterId: ",",
      paragraphInitial:
        this.clarificationForm.controls['paragraphInitial'].value,
      applicationId: this.idRequest,
      positionSender: this.clarificationForm.controls['senderCharge'].value,
      paragraphFinal: this.clarificationForm.controls['paragraphFinal'].value,
      consistentIn: this.clarificationForm.controls['consistentIn'].value,
      managedTo: this.clarificationForm.controls['addresseeName'].value,
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      positionAddressee:
        this.clarificationForm.controls['positionAddressee'].value,
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
      next: data => {
        //this.onLoadToast('success','Aclaración guardada correctamente','' );
        //this.chatClarifications2(); //PARA FORMULARIO LARGO | CREAR NUEVO MÉTODO O CONDICIONAR LOS VALORES DE FORMULARIOS
        this.openReport(data); //Falta verificar información que se envia...
        //this.modalRef.content.callback(true);
        this.loading = false;
        this.close();
        this.chatClarifications2();
      },
      error: error => {
        this.loading = false;

        //this.onLoadToast('error', 'No se pudo guardar', '');
      },
    });
  }

  aclaracionTransferentesVoluntarias() {
    //Recupera información del usuario logeando para luego registrarlo como firmante
    let token = this.authService.decodeToken();

    //Crear objeto para generar el reporte
    const modelReport: IClarificationDocumentsImpro = {
      clarification: this.dataClarifications2.clarificationType,
      sender: this.clarificationForm.controls['senderName'].value,
      //foundation: ",",
      //id: 1, //ID primaria
      version: 1,
      //transmitterId: ",",
      paragraphInitial:
        this.clarificationForm.controls['paragraphInitial'].value,
      applicationId: this.idRequest,
      positionSender: this.clarificationForm.controls['senderCharge'].value,
      paragraphFinal: this.clarificationForm.controls['paragraphFinal'].value,
      consistentIn: this.clarificationForm.controls['consistentIn'].value,
      managedTo: this.clarificationForm.controls['addresseeName'].value,
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      positionAddressee:
        this.clarificationForm.controls['positionAddressee'].value,
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
        //this.onLoadToast('success','Aclaración guardada correctamente','' );
        //this.chatClarifications2(); //PARA FORMULARIO LARGO | CREAR NUEVO MÉTODO O CONDICIONAR LOS VALORES DE FORMULARIOS
        this.openReport(data); //Falta verificar información que se envia...
        //this.modalRef.content.callback(true);

        this.loading = false;
        this.close();
        this.chatClarifications2();
      },
      error: error => {
        this.loading = false;

        //this.onLoadToast('error', 'No se pudo guardar', '');
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
        this.updateNotify(
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

  //------------------------------------ PARA FORMULARIO CORTO -----------------------------------
  chatClarifications1() {
    this.loading = true;
    this.paramsReload.getValue()['filter.clarifiNewsRejectId'] =
      this.dataClarifications2.rejectNotificationId;

    //Trae lista de chat-clarifications con el filtrado, para verificar si ya existe un registro
    this.chatService.getAll(this.paramsReload.getValue()).subscribe({
      next: data => {
        this.dataChatClarifications = data.data;
        //Si ya existe un registro en chatClarificatios, entonces se va a actualizar ese mismo registro
        this.chatClarificationUpdate1(this.dataChatClarifications[0]);
      },
      error: error => {
        //Si no hay un registro en chatClarifications, entonces se crea uno nuevo, con clarifiNewsRejectId establecido con id_recha_noti
        //this.chatClarificationCreate1();
      },
    });
  }

  //Método que Actualiza ChatClarifications PARA FORMULARIO CORTO
  chatClarificationUpdate1(chatClarifications: IChatClarifications) {
    //Construyendo objeto/model para enviarle
    const modelChatClarifications: IChatClarifications = {
      id: chatClarifications.id, //ID primaria
      clarifiNewsRejectId: this.dataClarifications2.rejectNotificationId, //Establecer ID de bienes_recha_notif_aclara
      requestId: chatClarifications.requestId,
      goodId: chatClarifications.goodId,
      senderName: this.clarificationForm.get('senderName').value, //Nueva información que se inserta por el formulario
      jobClarificationKey: this.clarificationForm.get('jobClarificationKey')
        .value, //Nueva información que se inserta por el formulario
      userAreaCaptures: this.clarificationForm.get('userAreaCaptures').value, //Nueva información que se inserta por el formulario
      webMail: this.clarificationForm.get('webMail').value, //Nueva información que se inserta por el formulario
      clarificationStatus: 'A_ACLARACION', //Este estado cambia cuando se manda a guardar el formulario, tanto largo como corto
      //id: this.idClarification, //Esta propiedad es importante, se le debe asignar a bienes_recha_notif_aclara
    };

    //Servicio para actualizar registro de ChatClariffications
    this.chatService
      .update(chatClarifications.id, modelChatClarifications)
      .subscribe({
        next: async data => {
          this.onLoadToast(
            'success',
            'Notificación actualizada y guardada correctamente',
            ''
          );
          this.loading = false;
          this.updateNotify(
            data.clarifiNewsRejectId,
            chatClarifications.id,
            modelChatClarifications.goodId
          );
        },
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'No se pudo actualizar', 'error.error');
          this.modalRef.hide();
        },
      });
  }

  //------------------------------------ PARA FORMULARIO LARGO -----------------------------------
  chatClarifications2() {
    this.loading = true;
    this.paramsReload.getValue()['filter.clarifiNewsRejectId'] =
      this.dataClarifications2.rejectNotificationId;

    //Trae lista de chat-clarifications con el filtrado, para verificar si ya existe un registro
    this.chatService.getAll(this.paramsReload.getValue()).subscribe({
      next: data => {
        this.dataChatClarifications = data.data;
        //Si ya existe un registro en chatClarificatios, entonces se va a actualizar ese mismo registro
        this.chatClarificationUpdate2(this.dataChatClarifications[0]);
      },
      error: error => {
        //Si no hay un registro en chatClarifications, entonces se crea uno nuevo, con clarifiNewsRejectId establecido con id_recha_noti
        //this.chatClarificationCreate2();
      },
    });
  }

  //Método que Actualiza ChatClarifications PARA FORMULARIO LARGO
  chatClarificationUpdate2(chatClarifications: IChatClarifications) {
    //Construyendo objeto/model para enviarle
    const modelChatClarifications: IChatClarifications = {
      id: chatClarifications.id, //ID primaria
      clarifiNewsRejectId: this.dataClarifications2.rejectNotificationId, //Establecer ID de bienes_recha_notif_aclara
      requestId: this.idRequest,
      goodId: this.dataClarifications2.goodId,
      addresseeName: this.clarificationForm.get('addresseeName').value,
      jobClarificationKey: this.clarificationForm.get('jobClarificationKey')
        .value,
      senderName: this.clarificationForm.get('senderName').value,
      userAreaCaptures: this.clarificationForm.get('userAreaCaptures').value,
      webMail: this.clarificationForm.get('webMail').value,
      clarificationStatus: 'A_ACLARACION',
    };

    //Servicio para actualizar registro de ChatClariffications
    this.chatService
      .update(chatClarifications.id, modelChatClarifications)
      .subscribe({
        next: async data => {
          this.onLoadToast('success', 'Actualizado', '');
          this.loading = false;
          this.updateNotify(
            data.clarifiNewsRejectId,
            chatClarifications.id,
            modelChatClarifications.goodId
          );
        },
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'No se pudo actualizar', 'error.error');
        },
      });
  }

  updateNotify(
    id?: number,
    chatClarId?: number | string,
    goodId?: number,
    observations?: string
  ) {
    const data: ClarificationGoodRejectNotification = {
      rejectionDate: new Date(),
      rejectNotificationId: id,
      answered: 'EN ACLARACION',
      observations: observations,
    };

    console.log(data);
    this.rejectedGoodService.update(id, data).subscribe({
      next: () => {
        const updateInfo: IChatClarifications = {
          requestId: this.idRequest,
          goodId: goodId,
          clarificationStatus: 'EN_ACLARACION',
        };
        this.chatClarificationsService
          .update(chatClarId, updateInfo)
          .subscribe({
            next: data => {
              this.modalRef.content.callback(true, data.goodId);
              this.modalRef.hide();
            },
            error: error => {
              console.log(error);
            },
          });
      },
    });
  }

  updateNotifyInapro(
    id?: number,
    chatClarId?: number,
    goodId?: number,
    observations?: string
  ) {
    const data: ClarificationGoodRejectNotification = {
      rejectionDate: new Date(),
      rejectNotificationId: id,
      answered: 'IMPROCEDENTE',
      observations: observations,
    };

    this.rejectedGoodService.update(id, data).subscribe({
      next: () => {
        const updateInfo: IChatClarifications = {
          requestId: this.idRequest,
          goodId: goodId,
          clarificationStatus: 'EN_ACLARACION',
        };
        this.chatClarificationsService
          .update(chatClarId, updateInfo)
          .subscribe({
            next: data => {
              this.modalRef.content.callback(true, data.goodId);
              this.modalRef.hide();
            },
            error: error => {
              console.log(error);
            },
          });
      },
    });
  }

  //Método para crear un nuevo chatClarifications PARA FORMULARIO LARGO
  chatClarificationCreate2() {
    //Creando objeto nuevo para ChatClarifications
    const modelChatClarifications: IChatClarifications = {
      //id: , //ID primaria
      clarifiNewsRejectId: this.dataClarifications2.rejectNotificationId, //Establecer ID de bienes_recha_notif_aclara
      requestId: this.idRequest,
      goodId: this.dataClarifications2.goodId,
      addresseeName: this.clarificationForm.get('addresseeName').value,
      jobClarificationKey: this.clarificationForm.get('jobClarificationKey')
        .value,
      senderName: this.clarificationForm.get('senderName').value,
      userAreaCaptures: this.clarificationForm.get('userAreaCaptures').value,
      webMail: this.clarificationForm.get('webMail').value,
      clarificationStatus: 'A_ACLARACION',
    };

    //Servicio para crear registro de ChatClariffications
    this.chatService.create(modelChatClarifications).subscribe({
      next: async data => {
        this.loading = false;
        this.modalRef.content.callback(true, data.goodId);
        this.modalRef.hide();
        this.updateNotify(data.clarifiNewsRejectId);
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No se pudo crear', error.error);
        this.modalRef.hide();
      },
    });
  }

  //Método para generar reporte y posteriormente la firma
  openReport(data?: IClarificationDocumentsImpro) {
    const idReportAclara = data.id;
    const idDoc = data.id;
    const idTypeDoc = Number(data.documentTypeId);
    const requestInfo = data;
    console.log('ID tipo de documento', idTypeDoc);
    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        requestInfo,
        idTypeDoc,
        idDoc,
        idReportAclara,
        callback: (next: boolean) => {},
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(PrintReportModalComponent, config);
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
        console.log('No. Folio generado ', this.folio.dictamenDelregSeq);
      },
      error: error => {
        console.log('Error al generar secuencia de dictamen', error.error);
      },
    });
  }

  //Método para construir folio con información del usuario
  generateClave(noDictamen?: string) {
    //Trae información del usuario logeado
    let token = this.authService.decodeToken();
    console.log(token);

    //Trae el año actuar
    const year = this.today.getFullYear();
    //Cadena final (Al final las siglas ya venian en el token xd)

    if (token.siglasnivel4 != null) {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${token.siglasnivel4}/${noDictamen}/${year}`;
      console.log('Folio Armado final', this.folioReporte);
    } else {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${noDictamen}/${year}`;
      console.log('Folio Armado final', this.folioReporte);
    }
  }

  close() {
    this.modalRef.hide();
  }

  tipoTransferente = 'SAT_SAE';
  tipoNotificacion = 2;
}
