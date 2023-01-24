import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IManagement } from 'src/app/core/models/catalogs/management.model';
import { ManagementService } from 'src/app/core/services/catalogs/management.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from '../../../../core/shared/patterns';

@Component({
  selector: 'app-management-form',
  templateUrl: './management-form.component.html',
  styles: [],
})
export class ManagementFormComponent extends BasePage implements OnInit {
  management: IManagement;
  edit: boolean = false;
  managementForm: ModelForm<IManagement>;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private managemetService: ManagementService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.managementForm = this.fb.group({
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      idTramite: [null, [Validators.required, Validators.maxLength(2)]],
    });

    if (this.management != null) {
      this.edit = true;
      this.managementForm.patchValue(this.management);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.managemetService.create(this.managementForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.managemetService
      .update(this.management.id, this.managementForm.value)
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
