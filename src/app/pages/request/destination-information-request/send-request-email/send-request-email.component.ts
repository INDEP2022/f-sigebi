import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotificationEmailService } from 'src/app/core/services/ms-notification/notification-emai.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN } from '../../../../core/shared/patterns';

@Component({
  selector: 'app-send-request-email',
  templateUrl: './send-request-email.component.html',
  styles: [],
})
export class SendRequestEmailComponent extends BasePage implements OnInit {
  title: string = 'Enviar Correo de Solicitud de Información';
  sendForm: FormGroup = new FormGroup({});
  @Output() onSend = new EventEmitter<boolean>();

  saleEmails: string[] = [];
  donationEmails: string[] = [];

  private emailService = inject(NotificationEmailService);

  recipients: string = '';

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.sendForm = this.fb.group({
      saleEmail: [null, [Validators.pattern(EMAIL_PATTERN)]],
      donationEmail: [null, [Validators.pattern(EMAIL_PATTERN)]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.handleSuccess();
  }

  async handleSuccess() {
    this.loading = true;

    let fechaActual = new Date();
    let fechaEntero = fechaActual.getTime();
    let fechaCadena = fechaEntero.toString();
    let fechaCortada = fechaCadena.substring(3);
    let idSal = parseInt(fechaCortada);

    await this.sendMail({
      id: idSal,
      subject: 'venta de Información',
      body: 'Se solicita la siguiente información: ',
      recipients: this.saleEmails.join(','),
      message: 'Se solicita la siguiente información: ',
      answerTo: 'Solicitud de Información',
    });

    let dat1 = new Date();
    let dat2 = dat1.getTime();
    let dat3 = dat2.toString();
    let dat4 = dat3.substring(3);
    let idDon = parseInt(dat4);

    await this.sendMail({
      id: idDon,
      subject: 'Donación de Información',
      body: 'Se solicita la siguiente información: ',
      recipients: this.donationEmails.join(','),
      message: 'Se solicita la siguiente información: ',
      answerTo: 'Solicitud de Información',
    });

    this.onLoadToast(
      'success',
      'Correos enviados con éxito',
      `Se enviaron ${
        this.saleEmails.length + this.donationEmails.length
      } correos de solicitud de información.`
    );
    this.loading = false;
    this.onSend.emit(true);
    this.modalRef.hide();
  }

  addEmail(event: any, type: string) {
    const { value } = event.target;
    const { keycode, code, which } = event;
    if (
      keycode == 32 ||
      code == 'space' ||
      which == 32 ||
      keycode == 13 ||
      code == 'enter' ||
      which == 13 ||
      keycode == 188 ||
      code == 'comma' ||
      which == 188
    ) {
      if (value.match(EMAIL_PATTERN)) {
        switch (type) {
          case 'sale':
            event.preventDefault();
            this.saleEmails.push(value);
            this.sendForm.controls['saleEmail'].setValue('');
            break;

          case 'donation':
            event.preventDefault();
            this.donationEmails.push(value);
            this.sendForm.controls['donationEmail'].setValue('');
            break;

          default:
            break;
        }
      }
    }
  }

  removeEmail(email: string, type: string) {
    let i: number;
    switch (type) {
      case 'sale':
        i = this.saleEmails.findIndex(element => {
          if (element === email) return true;
          return false;
        });
        if (i != -1) {
          this.saleEmails.splice(i, 1);
        }
        break;

      case 'donation':
        i = this.donationEmails.findIndex(element => {
          if (element === email) return true;
          return false;
        });
        if (i != -1) {
          this.donationEmails.splice(i, 1);
        }
        break;

      default:
        break;
    }
  }

  sendMail(object: any) {
    return new Promise((resolve, reject) => {
      this.emailService.createNotificationEmail(object).subscribe({
        next: resp => {
          console.log(resp);
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
}
