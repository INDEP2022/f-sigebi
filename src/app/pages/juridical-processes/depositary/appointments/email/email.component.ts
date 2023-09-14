import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocReceptionRegisterService } from 'src/app/core/services/document-reception/doc-reception-register.service';
import { TranfergoodService } from 'src/app/core/services/ms-transfergood/transfergood.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styles: [],
})
export class EmailAppointmentComponent extends BasePage implements OnInit {
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
  userSelected: any;
  message: string = '';
  asunto: string = '';

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private user: AuthService,
    private segUserService: SegAcessXAreasService,
    private receptionService: DocReceptionRegisterService,
    private transferGoodService: TranfergoodService,
    private msUsersService: UsersService
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
        }
      },
      error: () => {},
    });
  }

  prepareForm() {
    this.form = this.fb.group({
      ASUNTO: [
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      // CC: [null, [Validators.maxLength(50), Validators.pattern(EMAIL_PATTERN)]],
      CC: [null, [Validators.maxLength(500)]],
      // FECHA_ENV: [null],
      MENSAJE: [
        null,
        [
          Validators.required,
          Validators.maxLength(2000),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      PARA: [
        null,
        [
          Validators.required,
          Validators.maxLength(500),
          // Validators.pattern(STRING_PATTERN),
        ],
      ],
      // PREVIO: [null],
      REMITENTE: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      // REPORTE: [null],
      // LPARA: [null],
      // DELEGACION: [null],
      // USER: [null],
    });

    // this.form.patchValue(this.email);

    this.form
      .get('PARA')
      .patchValue(
        this.userSelected
          ? this.userSelected.email
            ? this.userSelected.email
            : null
          : null
      );
    // console.log(this.form.get('PARA').value, this.userSelected);
    // this.form
    //   .get('FECHA_ENV')
    //   .patchValue(
    //     this.email.FECHA_ENV
    //       ? this.email.FECHA_ENV.split('T')[0].split('-').reverse().join('/')
    //       : ''
    //   );

    const user = this.user.decodeToken();

    this.form.get('REMITENTE').patchValue(user.username.toUpperCase());
    this.form.get('MENSAJE').patchValue(this.message);
    this.form.get('ASUNTO').patchValue(this.asunto);
    // console.log(this.asunto, this.message, this.userSelected);
  }

  close() {
    this.modalRef.hide();
  }

  getNameRemit(params: ListParams) {
    params['delegationNumber'] = this.delegation;
    params['filter.email'] = '$ilike:' + params.text;

    // this.segUserService.getNameEmail(params).subscribe({
    this.msUsersService.getAllSegUsers(params).subscribe({
      next: resp => {
        this.list = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.list = new DefaultSelect();
      },
    });
  }

  getNameDist(params: ListParams) {
    params['delegationNumber'] = this.delegation;
    // if (this.form.get('PARA').value) {
    //   params['search'] = this.form.get('PARA').value;
    // }
    // console.log(params);
    params['filter.email'] = '$ilike:' + params.text;
    // this.segUserService.getDisNameEmail(params).subscribe({
    this.msUsersService.getAllSegUsers(params).subscribe({
      next: resp => {
        this.list2 = new DefaultSelect(resp.data, resp.count);
        // console.log(this.list2, this.form.get('PARA').value);
      },
      error: () => {
        this.list2 = new DefaultSelect();
      },
    });
  }

  sendEmail() {
    if (this.form.invalid) {
      this.alert('warning', 'Complete los Campos Correctamente', '');
      return;
    }
    // const {
    //   folioCash,
    //   transactionDate,
    //   cveCurrency,
    //   total,
    //   cveAccount,
    //   delegation,
    // } = this.report;
    const { ASUNTO, PARA, MENSAJE, CC } = this.form.value;
    const user: string = this.user.decodeToken().name;

    // const del = this.delegations.data.filter(
    //   (del: any) => del.id == delegation
    // )[0].description;
    // const body = {
    //   to: PARA.join(','),
    //   subject: ASUNTO,
    //   fecTrans: transactionDate,
    //   cveDescription: del ?? this.description,
    //   cveCurrency: cveCurrency,
    //   nameUser: user.toUpperCase(),
    //   noReport: REPORTE,
    //   noFolioCv: folioCash,
    //   cveAccount: cveAccount,
    //   cveAmount: total,
    // };
    let bodyMail = {
      header: user.toUpperCase(), // encabezado
      destination: [PARA], // destino
      copy: CC ? [CC] : [], // copia
      subject: ASUNTO, // asunto
      message: MENSAJE, // mensaje
    };
    this.transferGoodService.sendEmail(bodyMail).subscribe({
      next: resp => {
        // console.log(resp);
        this.modalRef.hide();
        // this.form.get('MENSAJE').patchValue(resp.message);
        this.alert('success', 'Correo enviado correctamente', '');
      },
      error: err => {
        // console.log(err);
        this.alert(
          'warning',
          'Error al enviar',
          'Ocurrió un error al enviar el correo, intente nuevamente'
        );
      },
    });
  }

  changeName(user: { name: string; email: string }) {
    console.log(user);
  }
}
