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
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { PrintReportModalComponent } from '../print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-inappropriateness-form',
  templateUrl: './inappropriateness-form.component.html',
  styles: [],
})
export class InappropriatenessFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  notification: ClarificationGoodRejectNotification;
  request: IRequest;
  //Parámetros para generar el folio en el reporte
  today: Date;
  folio: IDictamenSeq;
  folioReporte: string;
  //
  paramsReload = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsRequest = new BehaviorSubject<ListParams>(new ListParams());
  dataChatClarifications: IChatClarifications[];
  idSolicitud: any;
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private authService: AuthService,
    private documentService: DocumentsService,
    private chatService: ChatClarificationsService,
    private applicationGoodsQueryService: ApplicationGoodsQueryService,
    private rejectedGoodService: RejectedGoodService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    if (this.folioReporte === null) {
      console.log('Crear folio');
      this.dictamenSeq();
    }
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      addresseeName: [null, [Validators.required, Validators.maxLength(50)]],
      positionAddressee: [
        null,
        [Validators.required, Validators.maxLength(50)],
      ],
      senderName: [null, [Validators.required, Validators.maxLength(50)]],
      senderCharge: [null, [Validators.required, Validators.maxLength(50)]],
      clarification: [null, [Validators.required, Validators.maxLength(800)]],
      paragraphInitial: [null, [Validators.maxLength(1000)]],
      paragraphFinal: [null, [Validators.maxLength(1000)]],
      observations: [null, [Validators.maxLength(1000)]],
      //transmitterId: [null, [Validators.maxLength(15)]],
      //foundation: [null, [Validators.maxLength(4000)]],
      //invoiceLearned: [null, [Validators.maxLength(60)]],
      /*worthAppraisal: [
        null,
        [Validators.maxLength(60), Validators.pattern(NUMBERS_PATTERN)],
      ], */
      consistentIn: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  confirm() {
    console.log('improcedenciaTransferentesVoluntarias DESDE EL PEQUEÑO');
    //Recupera información del usuario logeando para luego registrarlo como firmante
    let token = this.authService.decodeToken();

    //Crear objeto para generar el reporte
    const modelReport: IClarificationDocumentsImpro = {
      clarification: this.notification.clarificationType,
      sender: this.form.controls['senderName'].value,
      //foundation: this.form.controls['foundation'].value,
      //id: 1, //ID primaria
      version: 1,
      //transmitterId: this.form.controls['transmitterId'].value,
      paragraphInitial: this.form.controls['paragraphInitial'].value,
      applicationId: this.request.id,
      positionSender: this.form.controls['senderCharge'].value,
      paragraphFinal: this.form.controls['paragraphFinal'].value,
      consistentIn: this.form.controls['consistentIn'].value,
      managedTo: this.form.controls['addresseeName'].value,
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      positionAddressee: this.form.controls['positionAddressee'].value,
      modificationDate: new Date(),
      creationUser: token.name,
      documentTypeId: '216', //Aclaración tipo 2 -> ImprocedenciaTransferentesVoluntarias
      modificationUser: token.name,
      //worthAppraisal: this.form.controls['worthAppraisal'].value,
      creationDate: new Date(),
      //rejectNoticeId: 1,
      assignmentInvoiceDate: new Date(),
      //mailNotification: this.form.controls['webMail'].value,
      /*areaUserCapture:
          this.form.controls['userAreaCaptures'].value,*/
      rejectNoticeId: this.notification.rejectNotificationId,
    };

    this.loading = true;
    this.documentService.createClarDocImp(modelReport).subscribe({
      next: response => {
        this.openReport(response);
        this.loading = false;
        this.close();
      },
      error: error => {
        this.loading = false;

        //this.onLoadToast('error', 'No se pudo guardar', '');
      },
    });
  }

  changeStatusAnswered() {
    this.loading = true;
    this.paramsReload.getValue()['filter.clarifiNewsRejectId'] =
      this.notification.rejectNotificationId;

    this.chatService.getAll(this.paramsReload.getValue()).subscribe({
      next: data => {
        this.dataChatClarifications = data.data;
        this.updateChatClarification(this.dataChatClarifications[0]);
      },
      error: error => {},
    });
  }

  updateChatClarification(chatClarifications: IChatClarifications) {
    const modelChatClarifications: IChatClarifications = {
      id: chatClarifications.id, //ID primaria
      clarifiNewsRejectId: this.notification.rejectNotificationId, //Establecer ID de bienes_recha_notif_aclara
      requestId: this.request.id,
      goodId: this.notification.goodId,
      //clarificationStatus: 'EN_ACLARACION', //Valor a cambiar
    };

    this.chatService
      .update(chatClarifications.id, modelChatClarifications)
      .subscribe({
        next: async data => {
          this.updateAnsweredImpro(
            data.clarifiNewsRejectId,
            chatClarifications.id,
            modelChatClarifications.goodId
          );
        },
        error: error => {
          this.onLoadToast('error', 'No se pudo actualizar', 'error.error');
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
          requestId: this.request.id,
          goodId: goodId,
          clarificationStatus: 'EN_ACLARACION',
        };
        this.chatService.update(chatClarId, updateInfo).subscribe({
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

  //Método para generar reporte y posteriormente la firma
  openReport(data?: IClarificationDocumentsImpro) {
    const notificationValidate = 'Y';
    const idReportAclara = data.id;
    //const idDoc = data.id;
    const idTypeDoc = 216;
    const requestInfo = this.request;
    const idSolicitud = this.idSolicitud;

    //Modal que genera el reporte
    let config: ModalOptions = {
      initialState: {
        requestInfo,
        idTypeDoc,
        //idDoc,
        idReportAclara,
        idSolicitud,
        notificationValidate,
        callback: (next: boolean) => {
          if (next) {
            console.log('Modal cerrado');
            this.changeStatusAnswered();
          } else {
            console.log('Modal no cerrado');
          }
        },
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

    //Trae el año actuar
    const year = this.today.getFullYear();
    //Cadena final (Al final las siglas ya venian en el token xd)

    if (token.siglasnivel4 != null) {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${token.siglasnivel4}/${noDictamen}/${year}`;
    } else {
      this.folioReporte = `${token.siglasnivel1}/${token.siglasnivel2}/${token.siglasnivel3}/${noDictamen}/${year}`;
    }
  }

  close() {
    this.modalRef.hide();
  }
}
