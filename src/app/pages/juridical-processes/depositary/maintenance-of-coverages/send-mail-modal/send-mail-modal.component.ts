import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { p1, p2, p3, p4, s1, s2, s3, s4 } from './send-mail-messages';

const messages = [
  {
    id: 'p1',
    description: 'mensaje 1',
  },
  {
    id: 'p2',
    description: 'mensaje 2',
  },
  {
    id: 'p3',
    description: 'mensaje 3',
  },
  {
    id: 'p4',
    description: 'mensaje 4',
  },
  {
    id: 'none',
    description: 'Ninguno',
  },
];

@Component({
  selector: 'app-send-mail-modal',
  templateUrl: './send-mail-modal.component.html',
  styles: [],
})
export class SendMailModalComponent extends BasePage implements OnInit {
  title: string = 'Enviar Correo';
  form: FormGroup;
  optionsSelected = new DefaultSelect();
  subject: string = null;
  preview: any = null;
  for: string = null;
  message: string = '';
  cc: any = null;
  notification: any = null;

  fb = inject(FormBuilder);
  ChildbsModalRef = inject(BsModalRef);
  emailService = inject(EmailService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.initialForm();
    this.getSelecOptions();
    console.log('cc:', this.cc);
  }

  initialForm() {
    this.form = this.fb.group({
      for: [this.for],
      cc: [this.cc],
      subject: [this.subject],
      message: [this.message],
      selMen: [null],
    });
  }

  close() {
    this.ChildbsModalRef.hide();
  }

  getSelecOptions(params?: ListParams) {
    this.optionsSelected = new DefaultSelect(messages, 4);
    this.form.get('selMen').setValue('none');
  }

  changeSelection(event: any) {
    let value: string = null;
    this.form.get('message').setValue(null);
    switch (event.id) {
      case 'p1':
        value = p1(
          this.notification.wheelNumber,
          this.notification.expedientNumber,
          this.preview
        );
        console.log(value);
        this.form.get('message').setValue(value);
        break;
      case 'p2':
        value = p2(
          this.notification.wheelNumber,
          this.notification.expedientNumber,
          this.preview
        );
        this.form.get('message').setValue(value);
        break;
      case 'p3':
        value = p3(
          this.notification.wheelNumber,
          this.notification.expedientNumber,
          this.preview
        );
        this.form.get('message').setValue(value);
        break;
      case 'p4':
        value = p4(
          this.notification.wheelNumber,
          this.notification.expedientNumber,
          this.preview
        );
        this.form.get('message').setValue(value);
        break;
      default:
        this.form.get('message').setValue(value);
        value = null;
        break;
    }
  }

  async send() {
    if (
      this.form.get('for').value == '' ||
      this.form.get('for').value == null
    ) {
      this.onLoadToast(
        'error',
        'Los campos Para/Mensaje no pueden estar vacios',
        ''
      );
      return;
    }

    if (
      this.form.get('message').value == '' ||
      this.form.get('message').value == null
    ) {
      this.onLoadToast(
        'error',
        'Los campos Para/Mensaje no pueden estar vacios',
        ''
      );
      return;
    }
    let selecMsg = this.form.get('selMen').value;
    let para = this.form.get('for').value.split(',');
    let cc =
      this.form.get('cc').value != null || this.form.get('cc').value != ''
        ? this.form.get('cc').value.split(',')
        : [];
    let asunto = this.form.get('subject').value;
    let mensaje = '';
    const newPreviewer = this.formatPreviewerforMail(this.preview);
    if (selecMsg == 'p1') {
      mensaje = s1(
        this.notification.wheelNumber,
        this.notification.expedientNumber,
        newPreviewer
      );
    } else if (selecMsg == 'p2') {
      mensaje = s2(
        this.notification.wheelNumber,
        this.notification.expedientNumber,
        newPreviewer
      );
    } else if (selecMsg == 'p3') {
      mensaje = s3(
        this.notification.wheelNumber,
        this.notification.expedientNumber,
        newPreviewer
      );
    } else if (selecMsg == 'p4') {
      mensaje = s4(
        this.notification.wheelNumber,
        this.notification.expedientNumber,
        this.preview
      );
    } else {
      mensaje = this.form.get('message').value;
    }
    const formData = new FormData();
    formData.append('emails_send', para);
    formData.append('template', mensaje);
    formData.append('emails_cc', cc);
    formData.append('subject', asunto);

    const response: any = await this.sendMail(formData);

    if (para.length == response.accepted.length) {
      this.onLoadToast('success', 'El mensaje fue enviado.', '');
      setTimeout(() => {
        this.close();
      }, 3000);
    } else {
      this.onLoadToast(
        'info',
        'El mensaje no fue enviado a todos los destinatarios',
        `${response.rejected}`
      );
    }
  }

  sendMail(mail: any) {
    return new Promise((resolve, reject) => {
      this.emailService.sendEmail(mail).subscribe({
        next: resp => {
          resolve(resp);
        },
        error: e => {
          this.onLoadToast(
            'error',
            'Ocurrio un error al enviar los mensaje',
            `${e.error?.message}`
          );
          console.log(e);
          reject('error');
        },
      });
    });
  }

  formatPreviewerforMail(preview: any) {
    const value = this.preview.split('.\n');
    const newValue = value.join('<br>');

    return newValue;
  }
}
