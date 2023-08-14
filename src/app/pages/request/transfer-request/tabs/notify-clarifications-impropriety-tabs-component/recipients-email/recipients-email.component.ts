import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
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
  idSolicitud: any;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private emailService: EmailService,
    private authService: AuthService,
    private wcontentService: WContentService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    console.log('ID de la solicitud, ', this.idSolicitud);
    this.prepareForm();

    this.getDocsNotifi();
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

  createArrayDocs: string = '';
  arrayDocs: any;

  getDocsNotifi() {
    let body: any = {};
    body['xidSolicitud'] = this.idSolicitud;
    this.wcontentService.getDocumentos(body).subscribe({
      next: (resp: any) => {
        //Revisa cuantos documentos tiene
        const length = resp.data.length;
        console.log('Cantidad de documentos:', length);

        for (let i = 0; i < length; i++) {
          if (
            resp.data[i].xtipoDocumento === '111' ||
            resp.data[i].xtipoDocumento === '216' ||
            resp.data[i].xtipoDocumento === '213' ||
            resp.data[i].xtipoDocumento === '212' ||
            resp.data[i].xtipoDocumento === '211'
          ) {
            console.log(
              'Tipo de documento: ',
              resp.data[i].xtipoDocumento,
              '- Nombre document: ',
              resp.data[i].ddocTitle,
              '- Id Documento: ',
              resp.data[i].dDocName
            );
            this.createArrayDocs =
              `${resp.data[i].dDocName},` + this.createArrayDocs;
          }
        }

        let str = this.createArrayDocs;
        str = str.substring(0, str.length - 1);
        this.arrayDocs = str.split(',');
        console.log(this.arrayDocs);
      },
      error: error => {},
    });
  }

  async confirm() {
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
      nameAtt: 'Reporte',
      typeAtt: 'application/pdf;',
      process: 'Notificar Aclaraciones/improcedencias',
      wcontent: this.arrayDocs,
      //report: ["http://sigebimsqa.indep.gob.mx/processgoodreport/report/showReport?nombreReporte=SolicitudTransferencia.jasper&ID_SOLICITUD=56901&NOM_CIUDAD=" ]
    };
    console.log('Objeto que se envia', data);

    //Llamar a método
    this.emailService.createEmailDocs(data).subscribe({
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
