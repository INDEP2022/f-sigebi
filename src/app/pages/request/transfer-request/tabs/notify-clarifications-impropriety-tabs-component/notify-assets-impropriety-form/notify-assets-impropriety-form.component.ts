import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IClarification } from 'src/app/core/models/catalogs/clarification.model';
import { IChatClarifications } from 'src/app/core/models/ms-chat-clarifications/chat-clarifications-model';
import { ClarificationGoodRejectNotification } from 'src/app/core/models/ms-clarification/clarification-good-reject-notification';
import { IClarificationDocumentsImpro } from 'src/app/core/models/ms-documents/clarification-documents-impro-model';
import { Inappropriateness } from 'src/app/core/models/notification-aclaration/notification-aclaration-model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { Clarification2Srvice } from 'src/app/core/services/ms-rejected-good/clarification.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  KEYGENERATION_PATTERN,
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
  procedenceForm: ModelForm<any>;
  inappropriatenessForm: ModelForm<Inappropriateness>;
  clarification: any;
  dataClarifications: ClarificationGoodRejectNotification;

  //en el caso de que una aclaracion llege sin documentacion
  withDocumentation: boolean = false;

  //parametro si es inteconexion por el tipo de transferente pasado desde el padre
  isInterconnection: boolean = false;

  //Parámetro con el id del tipo de la aclaración
  idAclara: any;

  idRequest: any;

  //información de la notificación seleccionada del bien
  dataNotification: IClarification;
  goodValue: any;
  rejectedID: any;

  dataClarifications2: ClarificationGoodRejectNotification;

  paramsReload = new BehaviorSubject<ListParams>(new ListParams());

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private documentService: DocumentsService,
    private chatService: ChatClarificationsService,
    private rejectedGoodService: RejectedGoodService,
    private clarification2Srvice: Clarification2Srvice,
    private authService: AuthService
  ) {
    super();
  }

  ngOnInit(): void {
    this.withDocumentation = this.idAclara === '1' ? true : false;
    this.initForm1();
    this.initForm2();
    console.log('información de la notificación', this.dataNotification);
    console.log('información dl bien', this.goodValue);
  }

  initForm1(): void {
    this.clarificationForm = this.fb.group({
      observations: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(400)],
      ],
      senderName: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      jobClarificationKey: [
        null,
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.required],
      ],
      senderCharge: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      userAreaCaptures: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],

      webMail: [
        null,
        [Validators.pattern(EMAIL_PATTERN), Validators.maxLength(30)],
      ],
      /*
      receiver: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      receiverCharge: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      idTransmitter: [null, [Validators.maxLength(15)]],
      clarification: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
      consistent: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
      initialParagraph: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      finalParagraph: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ], */
    });
  }

  initForm2(): void {
    this.inappropriatenessForm = this.fb.group({
      addresseeName: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      positionSender: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      positionAddressee: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      //Aclaración
      jobClarificationKey: [
        null,
        [
          Validators.pattern(KEYGENERATION_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      senderName: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      clarification: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(100),
        ],
      ],

      consistentIn: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
      paragraphInitial: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      paragraphFinal: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(100)],
      ],
      //Aclaración
      observations: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(400)],
      ],

      userAreaCaptures: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      transmitterId: [null, [Validators.maxLength(15)]], // request emisora?
      webMail: [
        null,
        [Validators.pattern(EMAIL_PATTERN), Validators.maxLength(30)],
      ],
      applicationId: [this.idRequest],
      documentTypeId: [104],
      clarificationStatus: 'EN_ACLARACION',
    });
  }

  confirm() {
    if (!this.withDocumentation) {
      //Recupera información del usuario logeando para luego registrarlo como firmante
      let token = this.authService.decodeToken();

      //Crear objeto para generar el reporte
      const modelReport: IClarificationDocumentsImpro = {
        clarification: this.dataClarifications2.clarificationType,
        sender: this.inappropriatenessForm.controls['senderName'].value,
        //foundation: ",",
        //id: 1, //ID primaria
        version: 1,
        //transmitterId: ",",
        paragraphInitial:
          this.inappropriatenessForm.controls['paragraphInitial'].value,
        applicationId: this.idRequest,
        positionSender:
          this.inappropriatenessForm.controls['positionSender'].value,
        paragraphFinal:
          this.inappropriatenessForm.controls['paragraphFinal'].value,
        consistentIn: this.inappropriatenessForm.controls['consistentIn'].value,
        managedTo: this.inappropriatenessForm.controls['addresseeName'].value,
        invoiceLearned: 'folio_docto sin armar ',
        //invoiceNumber: 1,
        positionAddressee:
          this.inappropriatenessForm.controls['positionAddressee'].value,
        modificationDate: new Date(),
        creationUser: token.name,
        documentTypeId: '211',
        modificationUser: token.name,
        //worthAppraisal: 1,
        creationDate: new Date(),
        //rejectNoticeId: 1,
        assignmentInvoiceDate: new Date(),
        mailNotification: this.inappropriatenessForm.controls['webMail'].value,
        areaUserCapture:
          this.inappropriatenessForm.controls['userAreaCaptures'].value,
      };

      this.loading = true;
      this.documentService.createClarDocImp(modelReport).subscribe({
        next: data => {
          //this.onLoadToast('success','Aclaración guardada correctamente','' );
          console.log(
            'Datos del formulario largo se han guardado en larification-documents-impro',
            data
          );
          this.chatClarifications2(); //PARA FORMULARIO LARGO | CREAR NUEVO MÉTODO O CONDICIONAR LOS VALORES DE FORMULARIOS
          this.openReport(data); //Falta verificar información que se envia...
          this.modalRef.content.callback(true);
          this.loading = false;
          //this.modalRef.hide()
        },
        error: error => {
          this.loading = false;
          console.log(
            'No se envió información del formulario largo en larification-documents-impro',
            error.error
          );
          //this.onLoadToast('error', 'No se pudo guardar', '');
        },
      });
    } else {
      console.log('Formuario corto');
      this.chatClarifications1(); //PARA FORMULARIO CORTO
    }
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
        console.log('Registro de ChatClarifications, filtrado', data.data);
        this.dataChatClarifications = data.data;
        //Si ya existe un registro en chatClarificatios, entonces se va a actualizar ese mismo registro
        this.chatClarificationUpdate1(this.dataChatClarifications[0]);
      },
      error: error => {
        //Si no hay un registro en chatClarifications, entonces se crea uno nuevo, con clarifiNewsRejectId establecido con id_recha_noti
        console.log('no se encuentra', error);
        this.chatClarificationCreate1();
      },
    });
  }

  //Método que Actualiza ChatClarifications PARA FORMULARIO CORTO
  chatClarificationUpdate1(chatClarifications: IChatClarifications) {
    console.log('Actualizando chatClarifications');
    console.log('información de ChatClarificaions', chatClarifications);
    console.log('chatClarifications.id', chatClarifications.id);
    console.log('chatClarifications.requestId', chatClarifications.requestId);
    console.log(
      'id id_recha_noti',
      this.dataClarifications2.rejectNotificationId
    );

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
            'Notificación actualizada correctamente',
            ''
          );
          console.log('SE ACTUALIZÓ:', data);
          this.loading = false;
          this.updateNotify(data.clarifiNewsRejectId);
          this.modalRef.content.callback(true);
          this.modalRef.hide();
        },
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'No se pudo actualizar', 'error.error');
          console.log('NO SE ACTUALIZÓ:', error);
          this.modalRef.hide();
        },
      });
  }

  //Método para crear un nuevo chatClarifications PARA FORMULARIO CORTO
  chatClarificationCreate1() {
    console.log('Creando chatClarifications');

    //Creando objeto nuevo para ChatClarifications
    const modelChatClarifications: IChatClarifications = {
      //id: , //ID primaria
      clarifiNewsRejectId: this.dataClarifications2.rejectNotificationId, //Establecer ID de bienes_recha_notif_aclara
      requestId: this.idRequest,
      goodId: this.dataClarifications2.goodId,
      senderName: this.clarificationForm.get('senderName').value, //Nueva información que se inserta por el formulario
      jobClarificationKey: this.clarificationForm.get('jobClarificationKey')
        .value, //Nueva información que se inserta por el formulario
      userAreaCaptures: this.clarificationForm.get('userAreaCaptures').value, //Nueva información que se inserta por el formulario
      webMail: this.clarificationForm.get('webMail').value, //Nueva información que se inserta por el formulario
      clarificationStatus: 'A_ACLARACION',
    };

    //Servicio para crear registro de ChatClariffications
    this.chatService.create(modelChatClarifications).subscribe({
      next: async data => {
        console.log('SE CREÓ:', data);
        this.onLoadToast(
          'success',
          'Notificación contestada correctamente',
          ''
        );
        this.loading = false;
        this.modalRef.content.callback(true, data.rejectNotificationId);
        this.updateNotify(data.clarifiNewsRejectId);
        this.modalRef.hide();
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No se pudo crear', error.error);
        console.log('NO SE CREÓ:', error);
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
        console.log('Registro de ChatClarifications, filtrado', data.data);
        this.dataChatClarifications = data.data;
        //Si ya existe un registro en chatClarificatios, entonces se va a actualizar ese mismo registro
        this.chatClarificationUpdate2(this.dataChatClarifications[0]);
      },
      error: error => {
        //Si no hay un registro en chatClarifications, entonces se crea uno nuevo, con clarifiNewsRejectId establecido con id_recha_noti
        console.log('no se encuentra', error);
        this.chatClarificationCreate2();
      },
    });
  }

  //Método que Actualiza ChatClarifications PARA FORMULARIO LARGO
  chatClarificationUpdate2(chatClarifications: IChatClarifications) {
    console.log('Actualizando chatClarifications');
    console.log('información de ChatClarificaions', chatClarifications);
    console.log('chatClarifications.id', chatClarifications.id);
    console.log('chatClarifications.requestId', chatClarifications.requestId);
    console.log(
      'id id_recha_noti',
      this.dataClarifications2.rejectNotificationId
    );

    //Construyendo objeto/model para enviarle
    const modelChatClarifications: IChatClarifications = {
      id: chatClarifications.id, //ID primaria
      clarifiNewsRejectId: this.dataClarifications2.rejectNotificationId, //Establecer ID de bienes_recha_notif_aclara
      requestId: this.idRequest,
      goodId: this.dataClarifications2.goodId,
      addresseeName: this.inappropriatenessForm.get('addresseeName').value,
      jobClarificationKey: this.inappropriatenessForm.get('jobClarificationKey')
        .value,
      senderName: this.inappropriatenessForm.get('senderName').value,
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
          console.log('SE ACTUALIZÓ:', data);
          this.loading = false;
          this.updateNotify(data.clarifiNewsRejectId);
          this.modalRef.content.callback(true);
          this.modalRef.hide();
        },
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'No se pudo actualizar', 'error.error');
          console.log('NO SE ACTUALIZÓ:', error);
          this.modalRef.hide();
        },
      });
  }

  updateNotify(id: number) {
    console.log('notificación id', id);
    const data: ClarificationGoodRejectNotification = {
      rejectionDate: new Date(),
      rejectNotificationId: id,
      answered: 'EN ACLARACION',
    };

    this.rejectedGoodService.update(id, data).subscribe({
      next: () => {},
    });
  }

  //Método para crear un nuevo chatClarifications PARA FORMULARIO LARGO
  chatClarificationCreate2() {
    console.log('Creando chatClarifications');

    //Creando objeto nuevo para ChatClarifications
    const modelChatClarifications: IChatClarifications = {
      //id: , //ID primaria
      clarifiNewsRejectId: this.dataClarifications2.rejectNotificationId, //Establecer ID de bienes_recha_notif_aclara
      requestId: this.idRequest,
      goodId: this.dataClarifications2.goodId,
      addresseeName: this.inappropriatenessForm.get('addresseeName').value,
      jobClarificationKey: this.inappropriatenessForm.get('jobClarificationKey')
        .value,
      senderName: this.inappropriatenessForm.get('senderName').value,
      userAreaCaptures: this.clarificationForm.get('userAreaCaptures').value,
      webMail: this.clarificationForm.get('webMail').value,
      clarificationStatus: 'A_ACLARACION',
    };

    //Servicio para crear registro de ChatClariffications
    this.chatService.create(modelChatClarifications).subscribe({
      next: async data => {
        console.log('SE CREÓ:', data);
        this.loading = false;
        this.modalRef.hide();
        this.updateNotify(data.clarifiNewsRejectId);
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No se pudo crear', error.error);
        console.log('NO SE CREÓ:', error);
        this.modalRef.hide();
      },
    });
  }

  //Método para generar reporte y posteriormente la firma
  openReport(data?: IClarificationDocumentsImpro) {
    const idReportAclara = data.id;
    const idDoc = data.id;
    const idTypeDoc = 211;
    const dataClarifications = data;

    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        dataClarifications,
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

  close() {
    this.modalRef.hide();
  }
}
