import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocReceptionRegisterService } from 'src/app/core/services/document-reception/doc-reception-register.service';
import { DataEmailService } from 'src/app/core/services/ms-email/data-email.service';
import { TranfergoodService } from 'src/app/core/services/ms-transfergood/transfergood.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styles: [],
})
export class EmailComponent extends BasePage implements OnInit {
  email: any;
  report: any;
  form: FormGroup;
  goods: any[] = [];
  description: string;
  delegation: number = 0;
  delegations: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  list = new DefaultSelect<{ nombre: string; email: string }>();
  list2 = new DefaultSelect<{ nombre: string; email: string }>();
  isCC: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private user: AuthService,
    private segUserService: SegAcessXAreasService,
    private receptionService: DocReceptionRegisterService,
    private transferGoodService: TranfergoodService,
    private emailService: DataEmailService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      ASUNTO: [null],
      CC: [null],
      FECHA_ENV: [null],
      MENSAJE: [null],
      PARA: [null, Validators.required],
      PREVIO: [null],
      REMITENTE: [null],
      REPORTE: [null],
      LPARA: [null],
      DELEGACION: [null],
      USER: [null],
    });

    this.form.patchValue(this.email);

    this.form.get('PARA').patchValue(this.email.PARA);

    this.form
      .get('FECHA_ENV')
      .patchValue(
        this.email.FECHA_ENV
          ? this.email.FECHA_ENV.split('T')[0].split('-').reverse().join('/')
          : ''
      );

    const user = this.user.decodeToken();

    this.form.get('REMITENTE').patchValue(user.username.toUpperCase());
  }

  close() {
    this.modalRef.hide();
  }

  getNameRemit(params: ListParams) {
    params['filter.delegationNumber'] = this.delegation;
    params.limit = 50;

    this.segUserService.getNameEmail(params).subscribe({
      next: resp => {
        this.list = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.list = new DefaultSelect();
      },
    });
  }

  getNameDist(params: ListParams) {
    params['filter.delegationNumber'] = this.report.delegation;
    params.limit = 50;

    this.segUserService.getDisNameEmail(params).subscribe({
      next: resp => {
        this.list2 = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.list2 = new DefaultSelect();
      },
    });
  }

  sendEmail() {
    const {
      folioCash,
      transactionDate,
      cveCurrency,
      total,
      cveAccount,
      delegation,
    } = this.report;
    const { ASUNTO, PARA, REPORTE, CC, FECHA_ENV } = this.form.value;
    const user: string = this.user.decodeToken().name;

    const del = this.delegations.data.filter(
      (del: any) => del.id == delegation
    )[0].description;

    const body = {
      to: PARA ? PARA.join(',') : '', // ['pruebasqaindep@gmail.com'], ,
      subject: ASUNTO,
      fecTrans: transactionDate,
      cveDescription: del ?? this.description,
      cveCurrency: cveCurrency,
      nameUser: user.toUpperCase(),
      noReport: REPORTE,
      noFolioCv: folioCash,
      cveAccount: cveAccount,
      cveAmount: total,
    };

    this.transferGoodService.getMessageEmail(body).subscribe({
      next: resp => {
        this.form.get('MENSAJE').patchValue(resp.message);

        const body: any = {
          header: 'infosaedwh@sae.gob.mx',
          destination: PARA ?? [],
          copy: CC ?? [],
          subject: ASUNTO ?? '',
          message: `${resp.message}`,
        };

        // const body: any = {
        //   header: 'Test Email',
        //   destination: [''],
        //   copy: [],
        //   subject: ASUNTO,
        //   message: `${resp.message}`,
        // };

        this.transferGoodService.sendEmail(body).subscribe({
          next: () => {
            this.alert('success', 'Correo', 'Mensaje enviado correctamente');

            const date =
              typeof FECHA_ENV == 'string'
                ? FECHA_ENV.split('/').reverse().join('-')
                : FECHA_ENV;

            const body = {
              reportNumber: REPORTE,
              addressee: PARA ? PARA.join(',') : '',
              sender: user.toUpperCase(),
              cc: CC ? CC.join(',') : '',
              message: `${resp.message}`,
              affair: ASUNTO,
              sendDate: date,
              devReportNumber: '',
            };

            // const body: any = {
            //   reportNumber: REPORTE,
            //   addressee: '',
            //   sender: user.toUpperCase(),
            //   cc: '',
            //   message: `${resp.message}`,
            //   affair: ASUNTO,
            //   sendDate: date,
            //   devReportNumber: null,
            // };

            this.emailService.create(body).subscribe({
              next: () => {
                this.modalRef.hide();
              },
              error: err => {
                this.alert('error', 'Error', err.error.message);
              },
            });
          },
          error: () => {
            this.alert('error', 'Error', 'No es posible enviar el correo');
          },
        });
      },
      error: () => {},
    });
  }

  changeName(user: { name: string; email: string }) {
    console.log(user);
  }
}
