import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStatusClaims } from 'src/app/core/models/catalogs/status-claims.model';
import { StatusClaimsService } from 'src/app/core/services/catalogs/claim-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-status-claims-form',
  templateUrl: './status-claims-form.component.html',
  styles: [],
})
export class StatusClaimsFormComponent extends BasePage implements OnInit {
  statusClaimsForm: ModelForm<IStatusClaims>;
  title: string = 'Estatus Siniestros';
  edit: boolean = false;
  statusClaims: IStatusClaims;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private StatusClaimsService: StatusClaimsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.statusClaimsForm = this.fb.group({
      id: [null],
      description: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(80),
          Validators.pattern(STRING_PATTERN),
        ]),
      ],
      flag: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ]),
      ],
    });
    if (this.statusClaims != null) {
      this.edit = true;
      this.statusClaimsForm.patchValue(this.statusClaims);
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
    this.StatusClaimsService.create(
      this.statusClaimsForm.getRawValue()
    ).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.StatusClaimsService.update(
      this.statusClaims.id,
      this.statusClaimsForm.getRawValue()
    ).subscribe({
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
