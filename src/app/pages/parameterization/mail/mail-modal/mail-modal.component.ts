import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { DatePipe } from '@angular/common';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { IUserAccessAreas } from 'src/app/core/models/ms-users/users-access-areas-model';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import {
  CURP_PATTERN,
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  RFC_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-mail-modal',
  templateUrl: './mail-modal.component.html',
  styles: [],
})
export class MailModalComponent extends BasePage implements OnInit {
  form: ModelForm<ISegUsers>;
  segUsers: ISegUsers;
  delegationNumber: IUserAccessAreas;
  value: string;
  title: string = 'Mantenimiento de Correo';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private usersService: UsersService,
    private datePipe: DatePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      name: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      rfc: [
        null,
        [
          Validators.maxLength(13),
          Validators.pattern(RFC_PATTERN),
          Validators.required,
        ],
      ],
      curp: [
        null,
        [Validators.maxLength(20), Validators.pattern(CURP_PATTERN)],
      ],
      street: [
        null,
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ],
      insideNumber: [
        null,
        [Validators.maxLength(10), Validators.pattern(STRING_PATTERN)],
      ],
      suburb: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      zipCode: [
        null,
        [Validators.maxLength(5), Validators.pattern(NUMBERS_PATTERN)],
      ],
      phone: [
        null,
        [Validators.maxLength(20), Validators.pattern(NUMBERS_PATTERN)],
      ],
      profession: [
        null,
        [Validators.maxLength(60), Validators.pattern(STRING_PATTERN)],
      ],
      positionKey: [
        null,
        [Validators.maxLength(15), Validators.pattern(STRING_PATTERN)],
      ],
      firstTimeLoginDate: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      daysValidityPass: [
        null,
        [Validators.maxLength(4), Validators.pattern(NUMBERS_PATTERN)],
      ],
      passLastChangeDate: [null, [Validators.pattern(STRING_PATTERN)]],
      passUpdate: [
        null,
        [Validators.maxLength(1), Validators.pattern(STRING_PATTERN)],
      ],
      // registryNumber: [null, []],
      email: [
        null,
        [Validators.maxLength(50), Validators.pattern(EMAIL_PATTERN)],
      ],
      userSirsae: [
        null,
        [
          Validators.maxLength(30),
          Validators.required,
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      sendEmail: [
        null,
        [Validators.maxLength(10), Validators.pattern(NUMBERS_PATTERN)],
      ],
      attribAsign: [
        null,
        [Validators.maxLength(10), Validators.pattern(NUMBERS_PATTERN)],
      ],
      clkdetSirsae: [
        null,
        [Validators.maxLength(10), Validators.pattern(NUMBERS_PATTERN)],
      ],
      exchangeAlias: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      clkdet: [
        null,
        [Validators.maxLength(10), Validators.pattern(NUMBERS_PATTERN)],
      ],
      clkid: [
        null,
        [Validators.maxLength(20), Validators.pattern(STRING_PATTERN)],
      ],
      profileMimKey: [
        null,
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ],
      nameAd: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      posPrevKey: [
        null,
        [Validators.maxLength(15), Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.segUsers != null) {
      this.delegationNumber = this.segUsers.usuario as IUserAccessAreas;

      this.edit = true;
      const formatFec = this.segUsers.passLastChangeDate;
      const fechaObjeto = new Date(formatFec);
      const format = this.datePipe.transform(formatFec, 'yyyy/MM/dd');
      this.form.patchValue(this.segUsers);
      this.form.controls['firstTimeLoginDate'].setValue(format);
      console.log(formatFec, format);
      /*this.form.controls['usuario'].setValue(
        this.delegationNumber.delegationNumber
      );*/
      this.form.controls['id'].disable();
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.form.controls['id'].value.trim() == '' ||
      this.form.controls['name'].value.trim() == '' ||
      this.form.controls['userSirsae'].value.trim() == '' ||
      (this.form.controls['id'].value.trim() == '' &&
        this.form.controls['name'].value.trim() == '' &&
        this.form.controls['userSirsae'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.usersService.create(this.form.getRawValue()).subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.loading = false;
          this.alert('warning', error.error.message, ``);
        },
      });
    }
  }

  update() {
    if (
      this.form.controls['id'].value.trim() == '' ||
      this.form.controls['name'].value.trim() == '' ||
      this.form.controls['userSirsae'].value.trim() == '' ||
      this.form.controls['id'].value.trim() == '' ||
      this.form.controls['name'].value.trim() == '' ||
      this.form.controls['userSirsae'].value.trim() == ''
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;

      this.usersService.update(this.form.getRawValue()).subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.alert('error', error.error.message, '');
          console.log(error);

          this.loading = false;
        },
      });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
