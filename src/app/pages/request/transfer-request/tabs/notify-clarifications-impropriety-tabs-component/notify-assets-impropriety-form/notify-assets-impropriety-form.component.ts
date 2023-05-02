import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
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
  //procedenceForm: ModelForm<any>;
  inappropriatenessForm: ModelForm<any>;
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

  //Parámetros para generar el folio en el reporte
  today: Date;
  folio: IDictamenSeq;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private documentService: DocumentsService,
    private chatService: ChatClarificationsService,
    private rejectedGoodService: RejectedGoodService,
    private authService: AuthService,
    private requestService: RequestService,
    private applicationGoodsQueryService: ApplicationGoodsQueryService
  ) {
    super();
    this.today = new Date();
  }

  //dataDocumentsImpro: IClarificationDocumentsImpro;
  ngOnInit(): void {
    //this.generateClave();
    this.withDocumentation = this.idAclara === '1' ? true : false;

    this.initForm1();

    const applicationId = this.idRequest;
    const rejectNoticeId = this.dataClarifications2.rejectNotificationId;

    //Verifica si la solicitud tiene guardado un formulario largo en documents
    this.documentService
      .getAllfilter(applicationId, rejectNoticeId, this.params.getValue())
      .subscribe({
        next: res => {
          const dataDocumentsImpro = res.data[0];
          this.initForm2(dataDocumentsImpro); //Manda a llamar el formulario largo para asignarle valores guardados
        },
        error: error => {
          this.initForm3(); //Se agregó para parchar un error deúltimo momento
        },
      });
  }

  initForm1(): void {
    //Trae información de la solicitud para precargar información en los formularios
    this.requestService.getById(this.idRequest).subscribe({
      next: response => {
        this.infoRequest = response;
      },
    });

    this.clarificationForm = this.fb.group({
      observations: [
        this.dataClarifications2.observations,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(400)],
      ],
      senderName: [
        this.infoRequest.nameOfOwner,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      jobClarificationKey: [
        this.dataClarifications2.chatClarification.keyClarificationPaper,
        [Validators.pattern(KEYGENERATION_PATTERN), Validators.required],
      ],
      senderCharge: [
        this.infoRequest.holderCharge,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      userAreaCaptures: [
        this.dataClarifications2?.chatClarification?.areaUserCapture,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],

      webMail: [
        this.dataClarifications2?.chatClarification?.emailWeb,
        [Validators.pattern(EMAIL_PATTERN), Validators.maxLength(30)],
      ],
    });
  }

  initForm2(dataDocumentsImpro?: IClarificationDocumentsImpro): void {
    this.inappropriatenessForm = this.fb.group({
      addresseeName: [
        dataDocumentsImpro.managedTo,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      positionSender: [
        dataDocumentsImpro.positionSender,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      positionAddressee: [
        dataDocumentsImpro.positionAddressee,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      //Aclaración
      jobClarificationKey: [
        dataDocumentsImpro.invoiceLearned,
        [
          Validators.pattern(KEYGENERATION_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      senderName: [
        dataDocumentsImpro.sender,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(50),
        ],
      ],
      clarification: [
        dataDocumentsImpro.clarification,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(100),
        ],
      ],

      consistentIn: [
        dataDocumentsImpro.consistentIn,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(100),
        ],
      ],
      paragraphInitial: [
        dataDocumentsImpro.paragraphInitial,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(500)],
      ],
      paragraphFinal: [
        dataDocumentsImpro.paragraphFinal,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(500)],
      ],
      //Aclaración
      observations: [
        this.dataClarifications2.observations,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(400)],
      ],

      userAreaCaptures: [
        dataDocumentsImpro.modificationUser,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      transmitterId: [
        dataDocumentsImpro.transmitterId,
        [Validators.maxLength(15)],
      ], // request emisora?
      webMail: [
        dataDocumentsImpro.mailNotification,
        [Validators.pattern(EMAIL_PATTERN), Validators.maxLength(30)],
      ],
      senderCharge: [this.infoRequest.holderCharge, []],
      applicationId: [this.idRequest],
      documentTypeId: [111],
      clarificationStatus: 'EN_ACLARACION',
    });
  }

  initForm3(): void {
    //Se agregó para parchar un error deúltimo momento

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
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(500)],
      ],
      paragraphFinal: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(500)],
      ],
      //Aclaración
      observations: [
        this.dataClarifications2.observations,
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
      senderCharge: [this.infoRequest.holderCharge, []],
      applicationId: [this.idRequest],
      documentTypeId: [111],
      clarificationStatus: 'EN_ACLARACION',
    });
  }

  confirm() {
    if (!this.withDocumentation) {
      //Formulario largo

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
        invoiceLearned: 'folio docto sin armar ',
        //invoiceNumber: 1,
        positionAddressee:
          this.inappropriatenessForm.controls['positionAddressee'].value,
        modificationDate: new Date(),
        creationUser: token.name,
        documentTypeId: '111',
        modificationUser: token.name,
        //worthAppraisal: 1,
        creationDate: new Date(),
        //rejectNoticeId: 1,
        assignmentInvoiceDate: new Date(),
        mailNotification: this.inappropriatenessForm.controls['webMail'].value,
        areaUserCapture:
          this.inappropriatenessForm.controls['userAreaCaptures'].value,
        rejectNoticeId: this.dataClarifications2.rejectNotificationId,
      };

      this.loading = true;
      this.documentService.createClarDocImp(modelReport).subscribe({
        next: data => {
          //this.onLoadToast('success','Aclaración guardada correctamente','' );
          this.chatClarifications2(); //PARA FORMULARIO LARGO | CREAR NUEVO MÉTODO O CONDICIONAR LOS VALORES DE FORMULARIOS
          this.openReport(data); //Falta verificar información que se envia...
          //this.modalRef.content.callback(true);
          this.loading = false;
          this.close();
        },
        error: error => {
          this.loading = false;

          //this.onLoadToast('error', 'No se pudo guardar', '');
        },
      });
    } else {
      //Si el input de observaciones tiene información, se va a guardar en "bienesRechaNoti"
      const observations =
        this.clarificationForm.controls['observations'].value;
      const id = this.dataClarifications2.rejectNotificationId;

      if (observations != null) {
        this.updateNotify(id, observations);
      }

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
        this.dataChatClarifications = data.data;
        //Si ya existe un registro en chatClarificatios, entonces se va a actualizar ese mismo registro
        this.chatClarificationUpdate1(this.dataChatClarifications[0]);
      },
      error: error => {
        //Si no hay un registro en chatClarifications, entonces se crea uno nuevo, con clarifiNewsRejectId establecido con id_recha_noti
        this.chatClarificationCreate1();
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
            'Notificación actualizada correctamente',
            ''
          );
          this.loading = false;
          this.updateNotify(data.clarifiNewsRejectId);
          this.modalRef.content.callback(true, data.goodId);
          this.modalRef.hide();
        },
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'No se pudo actualizar', 'error.error');
          this.modalRef.hide();
        },
      });
  }

  //Método para crear un nuevo chatClarifications PARA FORMULARIO CORTO
  chatClarificationCreate1() {
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
        this.onLoadToast(
          'success',
          'Notificación contestada correctamente',
          ''
        );
        this.loading = false;
        this.modalRef.content.callback(true, data.goodId);
        this.updateNotify(data.clarifiNewsRejectId);
        this.modalRef.hide();
      },
      error: error => {
        this.loading = false;
        this.onLoadToast('error', 'No se pudo crear', error.error);
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
        this.chatClarificationCreate2();
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
          this.loading = false;
          this.updateNotify(data.clarifiNewsRejectId);
          this.modalRef.content.callback(true, data.goodId);
          this.modalRef.hide();
        },
        error: error => {
          this.loading = false;
          this.onLoadToast('error', 'No se pudo actualizar', 'error.error');
          this.modalRef.hide();
        },
      });
  }

  updateNotify(id?: number, observations?: string) {
    const data: ClarificationGoodRejectNotification = {
      rejectionDate: new Date(),
      rejectNotificationId: id,
      answered: 'EN ACLARACION',
      observations: observations,
    };

    this.rejectedGoodService.update(id, data).subscribe({
      next: () => {},
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
    const idTypeDoc = 111;
    const requestInfo = data;

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

  siglasNivel1: string = '';
  siglasNivel2: string = '';
  siglasNivel3: string = '';

  //Método para construir folio con información del usuario
  generateClave(noDictamen?: string) {
    //Trae información del usuario logeado
    let token = this.authService.decodeToken();
    console.log(token);

    //Separa en palabras los 3 niveles del cargo del usuario logeado
    const cargoNivel1 = token.cargonivel1.replace(/,/g, '');
    const cargoNivel2 = token.cargonivel2.replace(/,/g, '');
    const cargoNivel3 = token.cargonivel3.replace(/,/g, '');

    //Cuenta cuantas palabras tiene el CargoNivel1 y obtiene su longitud
    const palabrasNivel1 = cargoNivel1.split(' ');
    const noPalabrasNivel1 = palabrasNivel1.length;

    //Ciclo para extraer la primera letra del cargoNivel1 y concatenarlo en una nueva palabra
    for (let i = 0; i < noPalabrasNivel1; i++) {
      this.siglasNivel1 = `${this.siglasNivel1}${palabrasNivel1[i].charAt(0)}`;
    }

    //Cuenta cuantas palabras tiene el CargoNivel2 y obtiene su longitud
    const palabrasNivel2 = cargoNivel2.split(' ');
    const noPalabrasNivel2 = palabrasNivel2.length;

    //Ciclo para extraer la primera letra del cargoNivel2 y concatenarlo en una nueva palabra
    for (let i = 0; i < noPalabrasNivel2; i++) {
      this.siglasNivel2 = `${this.siglasNivel2}${palabrasNivel2[i].charAt(0)}`;
    }

    //Cuenta cuantas palabras tiene el CargoNivel3 y obtiene su longitud
    const palabrasNivel3 = cargoNivel3.split(' ');
    const noPalabrasNivel3 = palabrasNivel3.length;

    //Ciclo para extraer la primera letra del cargoNivel3 y concatenarlo en una nueva palabra
    for (let i = 0; i < noPalabrasNivel3; i++) {
      this.siglasNivel3 = `${this.siglasNivel3}${palabrasNivel3[i].charAt(0)}`;
    }

    //Trae el año actuar
    const year = this.today.getFullYear();
    //Cadena final (Al final las siglas ya venian en el token xd)

    if (token.siglasnivel4 != null) {
      const folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${token.siglasnivel4}/${noDictamen}/${year}`;
      console.log('Folio Armado final', folioReporte);
    } else {
      const folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${noDictamen}/${year}`;
      console.log('Folio Armado final', folioReporte);
    }
  }

  close() {
    this.modalRef.hide();
  }
}
