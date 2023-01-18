import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDetailDelegation } from 'src/app/core/models/catalogs/detail-delegation.model';
import { DetailDelegationService } from 'src/app/core/services/catalogs/detail-delegation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  EMAIL_PATTERN,
  NUMBERS_PATTERN,
  PHONE_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-detail-delegation-form',
  templateUrl: './detail-delegation-form.component.html',
  styles: [],
})
export class DetailDelegationFormComponent extends BasePage implements OnInit {
  detailDelegationForm: ModelForm<IDetailDelegation>;
  title: string = 'Detalle Delegación';
  edit: boolean = false;
  detailDelegation: IDetailDelegation;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private detailDelegationService: DetailDelegationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.detailDelegationForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      location: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      address: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      position: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      area: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      mail: [null, [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      numP1: [null, [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      numP2: [null, [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      numP3: [null, [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      numDelegation: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.detailDelegation != null) {
      this.edit = true;
      this.detailDelegationForm.patchValue(this.detailDelegation);
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
    this.detailDelegationService
      .create(this.detailDelegationForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.detailDelegationService
      .update(this.detailDelegation.id, this.detailDelegationForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
