import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IChatClarifications } from 'src/app/core/models/ms-chat-clarifications/chat-clarifications-model';
import { ClarificationGoodRejectNotification } from 'src/app/core/models/ms-clarification/clarification-good-reject-notification';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-refuse-clarification-modal',
  templateUrl: './refuse-clarification-modal.component.html',
  styles: [],
})
export class RefuseClarificationModalComponent
  extends BasePage
  implements OnInit
{
  clarification: any;
  observationForm: ModelForm<ClarificationGoodRejectNotification>;
  title: string = 'Rechazo';
  edit: boolean = false;
  today: Date;
  refuseObj: ClarificationGoodRejectNotification;
  dataClarifications2: ClarificationGoodRejectNotification;
  idSolicitud: any;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private rejectedGoodService: RejectedGoodService,
    private chatService: ChatClarificationsService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
    console.log('ID DE CHAT', this.refuseObj.chatClarification.idClarification);
  }

  private prepareForm() {
    this.observationForm = this.fb.group({
      rejectNotificationId: [this.refuseObj.rejectNotificationId],
      rejectionDate: [this.today],
      answered: ['RECHAZADA', []],
      //clarificationType: ['ACLARACIÓN', []],
      observations: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(255)],
      ],
    });
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.rejectedGoodService.create(this.observationForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    //Actualiza ClarificationsGoodReject
    this.loading = true;
    this.rejectedGoodService
      .update(this.refuseObj.rejectNotificationId, this.observationForm.value)
      .subscribe({
        next: data => {
          console.log('actualizando Rechazo');
          this.updateChatClarifications();
          //this.updateClarifications(); Actualizar Objeto de Clarifications/notificaciones, pasar clarification a nulo y type a nulo
          this.handleSuccess();
        },
        error: error => (this.loading = false),
      });
  }

  updateChatClarifications() {
    //Actualiza estado de notificación en ChatClarifications

    const idChat = this.refuseObj.chatClarification.idClarification;
    const modelChatClarifications: IChatClarifications = {
      id: Number(this.refuseObj.chatClarification.idClarification), //ID primaria /Esta propiedad es importante, se le debe asignar a bienes_recha_notif_aclara
      requestId: Number(this.refuseObj.chatClarification.id),
      goodId: this.refuseObj.chatClarification.idProperty,
      //clarifiNewsRejectId: Number(this.refuseObj.chatClarification.clarificationDate), //Establecer ID de bienes_recha_notif_aclara
      clarificationStatus: 'RECHAZADO', //Este estado cambia cuando se manda a guardar el formulario, tanto largo como corto
    };

    console.log('Datos del objeto chatclarifications', modelChatClarifications);

    this.chatService.update(idChat, modelChatClarifications).subscribe({
      next: async data => {
        this.onLoadToast('success', 'Actualizado', '');
        console.log('SE ACTUALIZÓ:', data);
        this.loading = false;
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

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  close() {
    this.modalRef.hide();
  }
}
