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
import { PrintReportModalComponent } from '../print-report-modal/print-report-modal.component';

@Component({
  selector: 'app-inappropriateness-pgr-sat-form',
  templateUrl: './inappropriateness-pgr-sat-form.component.html',
  styles: [],
})
export class InappropriatenessPgrSatFormComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  notification: ClarificationGoodRejectNotification;
  request: IRequest;

  //Parámetros para generar el folio en el reporte
  today: Date;
  folio: IDictamenSeq;
  folioReporte: string;

  //Parámetro que identifica el tipoTransferente
  type: any;
  paramsReload = new BehaviorSubject<ListParams>(new ListParams());
  params = new BehaviorSubject<ListParams>(new ListParams());
  paramsRequest = new BehaviorSubject<ListParams>(new ListParams());
  dataChatClarifications: IChatClarifications[];
  idSolicitud: any;
  formLoading: boolean = false;

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
      senderName: [null, [Validators.required, Validators.maxLength(50)]],
      positionSender: [null, [Validators.required, Validators.maxLength(50)]],
      paragraphInitial: [null, [Validators.maxLength(4000)]],
      foundation: [null, [Validators.maxLength(4000)]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    //Recupera información del usuario logeando para luego registrarlo como firmante
    let token = this.authService.decodeToken();

    //Crear objeto para generar el reporte
    const modelReport: IClarificationDocumentsImpro = {
      clarification: this.notification.clarificationType,
      sender: this.form.controls['senderName'].value,
      foundation: this.form.controls['foundation'].value,
      id: null,
      version: 1,
      paragraphInitial: this.form.controls['paragraphInitial'].value,
      applicationId: this.request.id,
      positionSender: this.form.controls['positionSender'].value,
      invoiceLearned: this.folioReporte,
      //invoiceNumber: 1,
      modificationDate: new Date(),
      creationUser: token.name,
      documentTypeId: '111', //Aclaración tipo 2 e improcedencia -> OficioImprocedencia
      modificationUser: token.name,
      creationDate: new Date(),
      assignmentInvoiceDate: new Date(),
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
          requestId: this.request.id,
          goodId: goodId,
          clarificationStatus: 'EN_ACLARACION',
        };
        this.chatService.update(chatClarId, updateInfo).subscribe({
          next: data => {
            this.loading = false;
            this.onLoadToast('success', 'Actualizado', '');
            this.modalRef.content.callback(true, data.goodId);
            this.modalRef.hide();
          },
          error: error => {
            this.loading = false;
            console.log(error);
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
    const idTypeDoc = Number(data.documentTypeId);
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
            console.log('Modal cerrado 1');
            this.changeStatusAnswered();
          } else {
            console.log('Modal no cerrado 1');
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
}
