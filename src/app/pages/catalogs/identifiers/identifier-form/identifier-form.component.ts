import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { IIdentifier } from 'src/app/core/models/catalogs/identifier.model';
import { IdentifierService } from 'src/app/core/services/catalogs/identifier.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-identifier-form',
  templateUrl: './identifier-form.component.html',
  styles: [],
})
export class IdentifierFormComponent extends BasePage implements OnInit {
  identifier: IIdentifier;
  edit: boolean = false;
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
      code: [null, [Validators.required]],
      description: [null, [Validators.required]],
      keyview: [null, [Validators.required, Validators.maxLength(1)]],
      noRegistration: [null, [Validators.required]],
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
    this.identifierService
      .update(this.identifier.code, this.identifierForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
