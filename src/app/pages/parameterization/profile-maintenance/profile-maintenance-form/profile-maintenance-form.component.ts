import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISegProfileXPant } from 'src/app/core/models/catalogs/profile-traking-x-pant';
import { ProfileMaintenanceService } from 'src/app/core/services/catalogs/profile-maintenance.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-profile-maintenance-form',
  templateUrl: './profile-maintenance-form.component.html',
  styles: [],
})
export class ProfileMaintenanceFormComponent
  extends BasePage
  implements OnInit
{
  edit: boolean = false;
  form1: ModelForm<ISegProfileXPant>;
  data: any;
  profile: string;

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
    this.form1 = this.fb.group({
      profile: [
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      screenKey: [
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      permissionReading: [null],
      permissionWriting: [null],
      recordNumber: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(20)],
      ],
    });
    if (this.data != null) {
      this.edit = true;
      this.form1.controls['profile'].disable();
      this.form1.patchValue(this.data);
      console.log(this.data.permissionReading, this.data.permissionWriting);
      this.form1.controls['permissionReading'].setValue(
        this.data.permissionReading
      );
    }
    console.log(this.profile);
    this.form1.controls['profile'].setValue(this.profile);
    this.form1.controls['profile'].disable();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.profileMaintenanceService
      .newUpdate1(this.form1.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  create() {
    this.loading = true;
    this.profileMaintenanceService.create1(this.form1.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', 'Tipo de Bien', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
