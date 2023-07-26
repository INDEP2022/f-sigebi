import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
//model
import {
  IThirdParty,
  IThirdParty_,
} from 'src/app/core/models/ms-thirdparty/third-party.model';
//Services
import { ThirdPartyService } from 'src/app/core/services/ms-thirdparty/thirdparty.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-third-party-modal',
  templateUrl: './third-party-modal.component.html',
  styles: [],
})
export class ThirdPartyModalComponent extends BasePage implements OnInit {
  title: string = 'Tercero Comercializador';
  edit: boolean = false;

  thirdPartyForm: ModelForm<IThirdParty_>;
  thirPartys: IThirdParty;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private thirdPartyService: ThirdPartyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.thirdPartyForm = this.fb.group({
      id: [null],
      nameReason: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      calculationRoutine: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      // userAttempts: [
      //   null,
      //   [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      // ],
      // userBlocked: [
      //   null,
      //   [Validators.required, Validators.pattern(STRING_PATTERN)],
      // ],
      // userBlockedEnd: [
      //   null,
      //   [Validators.required, Validators.pattern(STRING_PATTERN)],
      // ],
      // userBlockedStart: [
      //   null,
      //   [Validators.required, Validators.pattern(STRING_PATTERN)],
      // ],
      // userStatus: [
      //   null,
      //   [Validators.required, Validators.pattern(STRING_PATTERN)],
      // ],
      // userKey: [
      //   null,
      //   [Validators.required, Validators.pattern(STRING_PATTERN)],
      // ],
      // userPwd: [
      //   null,
      //   [Validators.required, Validators.pattern(STRING_PATTERN)],
      // ],
      // user: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
    if (this.thirPartys != null) {
      this.edit = true;
      this.thirdPartyForm.patchValue({
        id: this.thirPartys.id,
        nameReason: this.thirPartys.nameReason,
        calculationRoutine: this.thirPartys.calculationRoutine,
      });
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.loading = true;
    let obj: IThirdParty = {
      id: this.thirPartys.id,
      nameReason: this.thirdPartyForm.value.nameReason,
      calculationRoutine: this.thirdPartyForm.value.calculationRoutine,
      userAttempts: this.thirPartys.userAttempts,
      userBlocked: this.thirPartys.userBlocked,
      userBlockedEnd: this.thirPartys.userBlockedEnd,
      userBlockedStart: this.thirPartys.userBlockedStart,
      userStatus: this.thirPartys.userStatus,
      userKey: this.thirPartys.userKey,
      userPwd: this.thirPartys.userPwd,
      user: this.thirPartys.user,
    };
    this.thirdPartyService.update(this.thirPartys.id, obj).subscribe({
      next: data => {
        this.handleSuccess();
      },
      error: error => {
        this.handleError();
      },
    });
  }

  create() {
    this.loading = true;
    let obj: IThirdParty = {
      id: null,
      nameReason: this.thirdPartyForm.value.nameReason,
      calculationRoutine: this.thirdPartyForm.value.calculationRoutine,
      userAttempts: null,
      userBlocked: null,
      userBlockedEnd: null,
      userBlockedStart: null,
      userStatus: null,
      userKey: null,
      userPwd: null,
      user: null,
    };
    this.thirdPartyService.create(obj).subscribe({
      next: data => {
        this.handleSuccess();
      },
      error: error => {
        this.handleError();
      },
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert(
      'success',
      `Tercero Comercializador ${message} Correctamente`,
      ''
    );
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  handleError() {
    const message: string = this.edit ? 'Actualizar' : 'Guardar';
    this.alert(
      'error',
      `Error al Intentar ${message} el Tercero Comercializador`,
      ''
    );
    this.loading = false;
  }
}
