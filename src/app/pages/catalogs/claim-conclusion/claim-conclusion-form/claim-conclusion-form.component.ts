import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IClaimConclusion } from 'src/app/core/models/catalogs/claim-conclusion.model';
import { ClaimConclusionService } from 'src/app/core/services/catalogs/claim-conclusion.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-claim-conclusion-form',
  templateUrl: './claim-conclusion-form.component.html',
  styles: [],
})
export class ClaimConclusionFormComponent extends BasePage implements OnInit {
  ClaimConclusionForm: ModelForm<IClaimConclusion>;
  title: string = 'Conclusion de siniestros';
  edit: boolean = false;
  claimConclusion: IClaimConclusion;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private claimConclusionService: ClaimConclusionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.ClaimConclusionForm = this.fb.group({
      id: [null, [Validators.required]],
      description: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(200),
        ],
      ],
      flag: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(20),
        ],
      ],
    });
    if (this.claimConclusion != null) {
      this.edit = true;
      this.ClaimConclusionForm.patchValue(this.claimConclusion);
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
    this.claimConclusionService
      .create(this.ClaimConclusionForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.claimConclusionService
      .update(this.claimConclusion.id, this.ClaimConclusionForm.getRawValue())
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
