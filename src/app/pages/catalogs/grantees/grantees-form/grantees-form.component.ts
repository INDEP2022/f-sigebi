import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IGrantee } from 'src/app/core/models/catalogs/grantees.model';
import { GranteeService } from 'src/app/core/services/catalogs/grantees.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-grantees-form',
  templateUrl: './grantees-form.component.html',
  styles: [],
})
export class GranteesFormComponent extends BasePage implements OnInit {
  granteesForm: ModelForm<IGrantee>;
  title: string = 'Donatario';
  edit: boolean = false;
  grantee: IGrantee;

  constructor(
    public modalRef: BsModalRef,
    public fb: FormBuilder,
    public granteeService: GranteeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm(): void {
    this.granteesForm = this.fb.group({
      id: [null],
      description: [null, Validators.required],
      puesto: [null, Validators.required],
      type: [null, Validators.required],
      razonSocial: [null, Validators.required],
      street: [null, Validators.required],
      noInside: [null, Validators.required],
      noExterior: [null, Validators.required],
      col: [null, Validators.required],
      nommun: [null, Validators.required],
      nomedo: [null, Validators.required],
      cp: [null, Validators.required],
      usrStatus: [null, Validators.required],
    });

    if (this.grantee != null) {
      this.edit = true;
      this.granteesForm.patchValue(this.grantee);
      this.granteesForm.get('id').disable();
    }
  }

  close(): void {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.granteeService.create(this.granteesForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.granteeService
      .update(this.grantee.id, this.granteesForm.getRawValue())
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
