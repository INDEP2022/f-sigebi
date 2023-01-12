import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDeductive } from 'src/app/core/models/catalogs/deductive.model';
import { DeductiveService } from 'src/app/core/services/catalogs/deductive.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DOUBLE_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-deductive-form',
  templateUrl: './deductive-form.component.html',
  styles: [],
})
export class DeductiveFormComponent extends BasePage implements OnInit {
  deductiveForm: ModelForm<IDeductive>;
  title: string = 'Deductiva';
  edit: boolean = false;
  deductive: IDeductive;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private deductiveService: DeductiveService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.deductiveForm = this.fb.group({
      id: [null],
      serviceType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      weightedDeduction: [
        null,
        [Validators.required, Validators.pattern(DOUBLE_PATTERN)],
      ],
      startingRankPercentage: [
        null,
        [Validators.required, Validators.pattern(DOUBLE_PATTERN)],
      ],
      finalRankPercentage: [
        null,
        [Validators.required, Validators.pattern(DOUBLE_PATTERN)],
      ],
      contractNumber: [
        null,
        [Validators.required, Validators.pattern(DOUBLE_PATTERN)],
      ],
      version: [
        null,
        [Validators.required, Validators.pattern(DOUBLE_PATTERN)],
      ],
      status: [null, [Validators.required]],
    });
    if (this.deductive != null) {
      this.edit = true;
      this.deductiveForm.patchValue(this.deductive);
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
    this.deductiveService.create(this.deductiveForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.deductiveService
      .update(this.deductive.id, this.deductiveForm.value)
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
