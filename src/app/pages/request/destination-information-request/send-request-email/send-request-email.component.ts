import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
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

  handleSuccess() {
    this.loading = true;
    // Llamar servicio para enviar correos
    console.log(this.saleEmails, this.donationEmails);
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
}
