import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
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
export class EmailComponentC extends BasePage implements OnInit {
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
    private emailService: DataEmailService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();

    const params = new FilterParams();
    const token = this.user.decodeToken();
    params.addFilter('user', token.username.toUpperCase());
    this.receptionService.getUsersSegAreas(params.getParams()).subscribe({
      next: response => {
        if (response.data.length > 0) {
          this.delegation = response.data[0].delegationNumber;
          console.log(this.delegation);
        }
      },
      error: () => {},
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      asunto: [null],
      CC: [null],
      fechaEnv: [null],
      MENSAJE: [null],
      PARA: [null],
      PREVIO: [null],
      REMITENTE: [null],
      REPORTE: [null],
      LPARA: [null],
      DELEGACION: [null],
      USER: [null],
    });

    this.form.patchValue(this.email);

    this.form.get('asunto').patchValue(this.email.data[0].asunto);

    console.log(this.email.data[0]);

    this.form
      .get('fechaEnv')
      .patchValue(
        this.email.data[0].fechaEnv
          ? this.email.data[0].fechaEnv
              .split('T')[0]
              .split('-')
              .reverse()
              .join('/')
          : ''
      );

    const user = this.user.decodeToken();

    this.form.get('REMITENTE').patchValue(user.username.toUpperCase());
  }

  getDate(date: any) {
    let newDate;
    if (typeof date == 'string') {
      newDate = String(date).split('/').reverse().join('-');
    } else {
      newDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    }
    return newDate;
  }

  close() {
    this.modalRef.hide();
  }

  getNameRemit(params: ListParams) {
    params['delegationNumber'] = this.delegation;

    this.segUserService.getNameEmail(params).subscribe({
      next: resp => {
        this.list = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {},
    });
  }

  getNameDist(params: ListParams) {
    params['delegationNumber'] = this.delegation;

    this.segUserService.getDisNameEmail(params).subscribe({
      next: resp => {
        this.list2 = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {},
    });
  }

  sendEmail() {
    const {
      check,
      dateDevolution,
      cveCurrency,
      total,
      cveAccount,
      delegation,
    } = this.report;
    const { asunto, PARA, REPORTE, CC, fechaEnv } = this.form.value;
    const user: string = this.user.decodeToken().username;
    console.log(this.report);
    const del = this.delegations.data.filter(
      (del: any) => del.id == delegation
    )[0].description;

    const body = {
      to: PARA ? PARA.join(',') : 'pruebasqaindep@gmail.com',
      subject: asunto,
      fecDepositDev: dateDevolution,
      description: del ?? this.description,
      cveCurrency: cveCurrency,
      toolbarUser: user.toUpperCase(),
      noReportDev: REPORTE,
      noCheque: check,
      amountTotalDev: total,
      cveAccountDev: cveAccount,
    };

    this.transferGoodService.getEmailCentral(body).subscribe({
      next: resp => {
        this.form.get('MENSAJE').patchValue(resp.message);

        const body: any = {
          header: 'aetiru@gmail.com',
          destination: PARA ?? [],
          copy: CC ?? [],
          subject: asunto,
          message: `${resp.message}`,
        };

        // const body: any = {
        //   header: 'DEV',
        //   destination: ['pruebasqaindep@gmail.com'],
        //   copy: [''],
        //   subject: 'DEV EMAIL',
        //   message: `${resp.message}`,
        // };

        this.transferGoodService.sendEmail(body).subscribe({
          next: () => {
            this.alert('success', 'Correo', 'Mensaje enviado correctamente');

            const date =
              typeof fechaEnv == 'string'
                ? fechaEnv.split('/').reverse().join('-')
                : fechaEnv;

            const body = {
              addressee: PARA ? PARA.join(',') : '',
              sender: user.toUpperCase(),
              cc: CC ? CC.join(',') : [],
              message: `${resp.message}`,
              affair: asunto,
              sendDate: date,
              devReportNumber: REPORTE,
            };

            // const body: any = {
            //   addressee: 'pruebasqaindep@gmail.com',
            //   sender: user.toUpperCase(),
            //   cc: '',
            //   message: `${resp.message}`,
            //   affair: asunto,
            //   sendDate: date,
            //   devReportNumber: REPORTE,
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
