import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITypeSiniesters } from 'src/app/core/models/catalogs/types-of-claims.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { TypesOfClaimsService } from '../../../../core/services/catalogs/types-of-claims.service';

@Component({
  selector: 'app-modal-type-of-claims',
  templateUrl: './modal-type-of-claims.component.html',
  styles: [],
})
export class ModalTypeOfClaimsComponent extends BasePage implements OnInit {
  title: string = 'Tipo de Siniestro';
  edit: boolean = false;
  form: ModelForm<ITypeSiniesters>;
  claims: ITypeSiniesters;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private claimService: TypesOfClaimsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      flag: [null, [Validators.max(99)]],
    });
    if (this.claims != null) {
      this.edit = true;
      this.form.patchValue(this.claims);
    }
  }

  update() {
    this.loading = true;
    this.claimService.update(this.form.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  create() {
    this.loading = true;
    this.claimService.create(this.form.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.close();
  }
  close() {
    this.modalRef.hide();
  }
}
