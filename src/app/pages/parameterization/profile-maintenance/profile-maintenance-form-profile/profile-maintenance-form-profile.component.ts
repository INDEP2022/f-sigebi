import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISegProfile } from 'src/app/core/models/catalogs/profile-maintenance.model';
import { ProfileMaintenanceService } from 'src/app/core/services/catalogs/profile-maintenance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-profile-maintenance-form-profile',
  templateUrl: './profile-maintenance-form-profile.component.html',
  styles: [],
})
export class ProfileMaintenanceFormProfileComponent
  extends BasePage
  implements OnInit
{
  edit: boolean = false;
  form: ModelForm<ISegProfile>;
  data: any;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private profileMaintenanceService: ProfileMaintenanceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      profile: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      registerNumber: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(20)],
      ],
    });
    if (this.data != null) {
      this.edit = true;
      this.form.patchValue(this.data);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    if (
      this.form.controls['profile'].value.trim() == '' ||
      this.form.controls['description'].value.trim() == '' ||
      (this.form.controls['profile'].value.trim() == '' &&
        this.form.controls['description'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.profileMaintenanceService
        .newUpdate(this.form.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }
  create() {
    this.loading = true;
    if (
      this.form.controls['profile'].value.trim() == '' ||
      this.form.controls['description'].value.trim() == '' ||
      (this.form.controls['profile'].value.trim() == '' &&
        this.form.controls['description'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.profileMaintenanceService.create(this.form.getRawValue()).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert(
      'success',
      'Mantenimiento de Perfil',
      `${message} Correctamente`
    );
    //this.onLoadToast('success', 'Tipos de bienes', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
