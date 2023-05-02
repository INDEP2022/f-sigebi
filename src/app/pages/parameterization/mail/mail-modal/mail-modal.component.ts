import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { IUserAccessAreas } from 'src/app/core/models/ms-users/users-access-areas-model';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import {
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
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

  title: string = 'Mtto. Correo';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private usersService: UsersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      name: [null, [Validators.pattern(STRING_PATTERN)]],
      rfc: [null, [Validators.pattern(STRING_PATTERN)]],
      curp: [null, [Validators.pattern(STRING_PATTERN)]],
      street: [null, [Validators.pattern(STRING_PATTERN)]],
      insideNumber: [null, [Validators.pattern(STRING_PATTERN)]],
      suburb: [null, [Validators.pattern(STRING_PATTERN)]],
      zipCode: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      phone: [null, [Validators.pattern(STRING_PATTERN)]],
      profession: [null, [Validators.pattern(STRING_PATTERN)]],
      positionKey: [null, [Validators.pattern(STRING_PATTERN)]],
      firstTimeLoginDate: [null, [Validators.pattern(STRING_PATTERN)]],
      daysValidityPass: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      passLastChangeDate: [null, [Validators.pattern(STRING_PATTERN)]],
      passUpdate: [null, [Validators.pattern(STRING_PATTERN)]],
      // registryNumber: [null, []],
      email: [null, [Validators.pattern(EMAIL_PATTERN)]],
      userSirsae: [null, [Validators.pattern(STRING_PATTERN)]],
      sendEmail: [null, [Validators.pattern(STRING_PATTERN)]],
      attribAsign: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      clkdetSirsae: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      exchangeAlias: [null, [Validators.pattern(STRING_PATTERN)]],
      clkdet: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      clkid: [null, [Validators.pattern(STRING_PATTERN)]],
      profileMimKey: [null, [Validators.pattern(STRING_PATTERN)]],
      nameAd: [null, [Validators.pattern(STRING_PATTERN)]],
      posPrevKey: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    if (this.segUsers != null) {
      this.delegationNumber = this.segUsers.usuario as IUserAccessAreas;
      this.edit = true;
      console.log(this.segUsers);
      this.form.patchValue(this.segUsers);
      this.form.controls['usuario'].setValue(
        this.delegationNumber.delegationNumber
      );
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.usersService.create(this.form.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.usersService.update(this.form.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    // this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
