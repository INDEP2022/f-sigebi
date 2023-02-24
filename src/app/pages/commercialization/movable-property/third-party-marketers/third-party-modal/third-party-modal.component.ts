import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
//model
import { IThirdParty } from 'src/app/core/models/ms-thirdparty/third-party.model';
//Services
import { ThirdPartyService } from 'src/app/core/services/ms-thirdparty/thirdparty.service';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-third-party-modal',
  templateUrl: './third-party-modal.component.html',
  styles: [],
})
export class ThirdPartyModalComponent extends BasePage implements OnInit {
  title: string = 'Terceros comercializadores';
  edit: boolean = false;

  thirdPartyForm: ModelForm<IThirdParty>;
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
      id: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      nameReason: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      calculationRoutine: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      userAttempts: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      userBlocked: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      userBlockedEnd: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      userBlockedStart: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      userStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      userKey: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      userPwd: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      user: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
    if (this.thirPartys != null) {
      this.edit = true;
      this.thirdPartyForm.patchValue(this.thirPartys);
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
    this.thirdPartyService
      .update(this.thirPartys.id, this.thirdPartyForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  create() {
    this.loading = true;
    this.thirdPartyService.create(this.thirdPartyForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
