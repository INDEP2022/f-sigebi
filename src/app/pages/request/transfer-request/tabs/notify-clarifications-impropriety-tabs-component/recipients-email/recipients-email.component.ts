import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-recipients-email',
  templateUrl: './recipients-email.component.html',
  styles: [],
})
export class RecipientsEmailComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  today: Date;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private emailService: EmailService,
    private authService: AuthService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      emails: [null, [Validators.required]],
      subject: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
      message: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.required],
      ],
    });
  }

  confirm() {
    const token = this.authService.decodeToken();
    console.log('String de los correos', this.form.controls['emails'].value);

    //Construir objeto a enviar
    const data = {
      //recipients: `gustavoangelsantosclemente@gmail.com, al221810743@gmail.com`,
      recipients: `${this.form.controls['emails'].value}`,
      message: `${this.form.controls['message'].value}`,
      userCreation: token.username,
      dateCreation: this.today,
      userModification: token.username,
      dateModification: this.today,
      version: '2',
      subject: `${this.form.controls['subject'].value}`,
      nameAtt: '',
      typeAtt: 'application/pdf;',
      //"urlAtt": "https://seguimiento.agoraparticipa.org/docs/PDF_TEXT-CA4Bn.pdf", //si cuentas con una url usas esto en ves del base64
      process: '',
      wcontent: '',
    };
    console.log('Objeto que se envia', data);

    //Llamar a método
    this.emailService.createEmailNotify(data).subscribe({
      next: response => {
        this.close();
        this.onLoadToast('success', 'Correo Enviado Correctamente', '');
        console.log('Se envió correctamente', response);
      },
      error: error => {
        this.close();
        this.onLoadToast(
          'error',
          'Error',
          'Hubo un problema al enviar el correo electrónico'
        );
        console.log('No se logró enviar los correos', error);
      },
    });
  }

  close() {
    this.modalRef.hide();
  }
}
