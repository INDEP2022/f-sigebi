import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  PERCENTAGE_NUMBERS_PATTERN,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IPenalty } from 'src/app/core/models/catalogs/penalty.model';
import { PenaltyService } from 'src/app/core/services/catalogs/penalty.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-penalty-form',
  templateUrl: './penalty-form.component.html',
  styles: [],
})
export class PenaltyFormComponent extends BasePage implements OnInit {
  penaltyForm: ModelForm<IPenalty>;
  title: string = 'PENALIZACIÓN';
  edit: boolean = false;
  penalty: IPenalty;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private penaltyService: PenaltyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.penaltyForm = this.fb.group({
      id: [null],
      serviceType: [
        null,
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      penaltyPercentage: [
        null,
        [Validators.required, Validators.pattern(PERCENTAGE_NUMBERS_PATTERN)],
      ],
      equivalentDays: [
        null,
        Validators.maxLength(5),
        // [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      version: [1],
      status: [1],
      contractNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
          Validators.minLength(0),
          Validators.maxLength(50),
        ],
      ],
    });
    if (this.penalty != null) {
      this.edit = true;
      this.penaltyForm.patchValue(this.penalty);
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
    this.penaltyService.create(this.penaltyForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.penaltyService
      .update(this.penalty.id, this.penaltyForm.getRawValue())
      .subscribe({
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
