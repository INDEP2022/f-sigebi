import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ILegalSupport } from 'src/app/core/models/catalogs/legal-suport.model';
import { LegalSupportService } from 'src/app/core/services/catalogs/legal-suport.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from '../../../../core/shared/patterns';

@Component({
  selector: 'app-legal-support-form',
  templateUrl: './legal-support-form.component.html',
  styles: [],
})
export class LegalSupportFormComponent extends BasePage implements OnInit {
  legalSupportForm: ModelForm<ILegalSupport>;
  title: string = 'Sustento Legal';
  edit: boolean = false;
  legalSupport: ILegalSupport;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private legalSupportService: LegalSupportService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.legalSupportForm = this.fb.group({
      id: [null, [Validators.required, Validators.maxLength(5)]],
      support: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.legalSupport != null) {
      this.edit = true;
      this.legalSupportForm.patchValue(this.legalSupport);
      this.legalSupportForm.get('id').disable();
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
    this.legalSupportService
      .create(this.legalSupportForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.legalSupportService
      .update(this.legalSupport.id, this.legalSupportForm.getRawValue())
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
