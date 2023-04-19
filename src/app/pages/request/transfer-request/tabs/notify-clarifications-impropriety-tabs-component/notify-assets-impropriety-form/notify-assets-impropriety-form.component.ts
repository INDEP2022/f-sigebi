import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IChatClarifications } from 'src/app/core/models/ms-chat-clarifications/chat-clarifications-model';
import { ClarificationGoodRejectNotification } from 'src/app/core/models/ms-clarification/clarification-good-reject-notification';
import { Inappropriateness } from 'src/app/core/models/notification-aclaration/notification-aclaration-model';
import { ChatClarificationsService } from 'src/app/core/services/ms-chat-clarifications/chat-clarifications.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
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
  dataClarifications: IChatClarifications;

  //en el caso de que una aclaracion llege sin documentacion
  withDocumentation: boolean = false;

  //parametro si es inteconexion por el tipo de transferente pasado desde el padre
  isInterconnection: boolean = false;

  //Parámetro con el id del tipo de la aclaración
  idAclara: any;

  idRequest: string = '';

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private documentService: DocumentsService,
    private chatService: ChatClarificationsService,
    private rejectedGoodService: RejectedGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.withDocumentation = this.idAclara === '2' ? true : false;
    this.initForm1();
    this.initForm2();
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
      managedTo: [
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
      sender: [
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

      areaUserCapture: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(60)],
      ],
      transmitterId: [null, [Validators.maxLength(15)]], // request emisora?
      mailNotification: [
        null,
        [Validators.pattern(EMAIL_PATTERN), Validators.maxLength(30)],
      ],
      applicationId: [this.idRequest],
      documentTypeId: [111],
      clarificationStatus: 'EN_ACLARACION',
    });
  }

  confirm() {
    if (this.withDocumentation) {
      this.loading = true;
      this.documentService
        .createClarDocImp(this.inappropriatenessForm.value)
        .subscribe({
          next: data => {
            this.onLoadToast(
              'success',
              'Aclaración guardada correctamente',
              ''
            );
            console.log('id del documento', data.id);
            this.openReport(data);
            this.updateNotificationImp(data);
            this.loading = false;
            //this.modalRef.hide()
          },
          error: error => {
            this.loading = false;
            this.onLoadToast('error', 'No se pudo guardar', '');
          },
        });
    } else {
      this.loading = true;
      const info: IChatClarifications = {
        requestId: this.idRequest,
        goodId: this.dataClarifications.goodId,
        senderName: this.clarificationForm.get('senderName').value,
        jobClarificationKey: this.clarificationForm.get('jobClarificationKey')
          .value,
        userAreaCaptures: this.clarificationForm.get('userAreaCaptures').value,
        webMail: this.clarificationForm.get('webMail').value,
        clarifiNewsRejectId: Number(
          this.dataClarifications.rejectNotificationId
        ),
        clarificationStatus: 'EN_ACLARACION',
        idClarification: 24,
      };

      this.chatService.create(info).subscribe({
        next: async data => {
          this.onLoadToast('success', 'Creado', '');
          this.updateNotificationAclaration(data.id);
          this.loading = false;
        },
        error: error => {
          this.loading = false;
          console.log(error);
        },
      });
    }
  }

  updateNotificationAclaration(id: number) {
    const idReject: any = this.dataClarifications.rejectNotificationId;
    console.log('id', idReject);
    const data: ClarificationGoodRejectNotification = {
      rejectNotificationId: idReject,
      answered: 'EN ACLARACIÓN',
      clarificationId: id,
      rejectionDate: new Date(),
    };

    this.rejectedGoodService.update(idReject, data).subscribe({
      next: response => {
        console.log('modificado', response);
        this.onLoadToast('success', 'Notificación aceptada correctamente', '');
        this.close();
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  updateNotificationImp(data: Inappropriateness) {
    const idReject: any = this.dataClarifications.rejectNotificationId;

    const _data: ClarificationGoodRejectNotification = {
      rejectNotificationId: idReject,
      answered: 'EN ACLARACIÓN',
      rejectionDate: new Date(),
      clarificationId: data.id,
    };

    this.rejectedGoodService.update(idReject, _data).subscribe({
      next: response => {
        this.onLoadToast('success', 'Notificación aceptada correctamente', '');
        this.close();
      },
      error: error => {
        this.loading = false;
        console.log(error);
      },
    });
  }

  openReport(data: Inappropriateness) {
    const idReportAclara = data.id;
    const idDoc = data.id;
    const idTypeDoc = 111;
    const dataClarifications = this.dataClarifications;

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
