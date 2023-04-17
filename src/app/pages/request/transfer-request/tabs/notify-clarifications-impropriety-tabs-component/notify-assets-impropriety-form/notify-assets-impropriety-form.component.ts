import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { Inappropriateness } from 'src/app/core/models/notification-aclaration/notification-aclaration-model';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

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
  clarificationForm: ModelForm<any>;
  procedenceForm: ModelForm<any>;
  inappropriatenessForm: ModelForm<Inappropriateness>;
  clarification: any;

  //en el caso de que una aclaracion llege sin documentacion
  withDocumentation: boolean = false;

  //parametro si es inteconexion por el tipo de transferente pasado desde el padre
  isInterconnection: boolean = false;

  //Parámetro con el id del tipo de la aclaración
  idAclara: any;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private documentService: DocumentsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.withDocumentation = this.idAclara === '18' ? true : false;
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
      id: ['14253'],
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
      applicationId: [this.clarification[0]?.requestId],
      documentTypeId: [111],
    });
  }

  confirm() {
    this.loading = true;
    console.log(this.inappropriatenessForm.value);
    this.documentService
      .createClarDocImp(this.inappropriatenessForm.value)
      .subscribe({
        next: data => {
          this.onLoadToast('success', 'Aclaración guardada correctamente', '');
          this.loading = false;
          //this.modalRef.hide()
        },
        error: error => {
          this.loading = false;
          console.log(error);
        },
      });
    //
    /*if (this.clarification[0].typeClarification === '1') {
      // cambiar el estado de la aclaracion en "EN_ACLARACION"
    } else {
      let config: ModalOptions = {
        initialState: {
          data: '',
          typeReport: 'noncompliance',
          callback: (next: boolean) => {
            //if (next){ this.getData();}
          },
        },
        class: 'modalSizeXL modal-dialog-centered',
        ignoreBackdropClick: true,
      };
      this.modalService.show(PrintReportModalComponent, config);
    }
    this.close(); */
  }

  close() {
    console.log('cerrar');

    this.modalRef.hide();
  }
}
