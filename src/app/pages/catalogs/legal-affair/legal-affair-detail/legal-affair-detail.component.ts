import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ILegalAffair } from 'src/app/core/models/catalogs/legal-affair-model';
import { LegalAffairService } from 'src/app/core/services/catalogs/legal-affair.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-legal-affair-detail',
  templateUrl: './legal-affair-detail.component.html',
  styles: [],
})
export class LegalAffairDetailComponent extends BasePage implements OnInit {
  legalAffairForm: ModelForm<ILegalAffair>;
  legalAffair: ILegalAffair;

  title: string = 'Asunto Jurídico';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private legalAffairService: LegalAffairService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.legalAffairForm = this.fb.group({
      id: [null, []],
      legalAffair: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, []],
    });
    if (this.legalAffair != null) {
      this.edit = true;
      this.legalAffairForm.patchValue(this.legalAffair);
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
    this.legalAffairService.create(this.legalAffairForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.legalAffairService.update(this.legalAffairForm.value).subscribe({
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
