import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IIdentifier } from 'src/app/core/models/catalogs/identifier.model';
import { IdentifierService } from 'src/app/core/services/catalogs/identifier.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-identifier-form',
  templateUrl: './identifier-form.component.html',
  styles: [],
})
export class IdentifierFormComponent extends BasePage implements OnInit {
  title: string = 'Identificadores';
  edit: boolean = false;

  identifier: IIdentifier;
  identifierForm: ModelForm<IIdentifier>;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private identifierService: IdentifierService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.identifierForm = this.fb.group({
      id: [null, [Validators.required]],
      description: [null, [Validators.required]],
      keyview: [null, [Validators.required, Validators.maxLength(1)]],
      noRegistration: [null, []],
    });

    if (this.identifier != null) {
      this.edit = true;
      this.identifierForm.patchValue(this.identifier);
      this.identifierForm.get('code').disable();
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.identifierService.create(this.identifierForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.identifierService
      .update(this.identifier.id, this.identifierForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
