import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ISegProfileXPant } from 'src/app/core/models/catalogs/profile-traking-x-pant';
import { ProfileMaintenanceService } from 'src/app/core/services/catalogs/profile-maintenance.service';
import { StatusXScreenService } from 'src/app/core/services/ms-screen-status/statusxscreen.service';
import { SecurityService } from 'src/app/core/services/ms-security/security.service';
import { BasePage } from 'src/app/core/shared';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

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
  screen = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private profileMaintenanceService: ProfileMaintenanceService,
    private statusXScreenService: StatusXScreenService,
    private securityService: SecurityService
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
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(20),
        ],
      ],
    });
    if (this.data != null) {
      this.edit = true;
      this.form1.controls['profile'].disable();
      this.form1.controls['screenKey'].disable();
      this.form1.patchValue(this.data);
      console.log(this.data.permissionReading, this.data.permissionWriting);
      this.form1.controls['permissionReading'].setValue(
        this.data.permissionReading
      );
    }
    console.log(this.profile);
    this.form1.controls['profile'].setValue(this.profile);
    this.form1.controls['profile'].disable();
    setTimeout(() => {
      this.getScreenAll(new ListParams());
    }, 1000);
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  getScreenAll(params: ListParams) {
    this.statusXScreenService.getList(params).subscribe({
      next: data => {
        this.screen = new DefaultSelect(data.data, data.count);
      },
      error: () => {
        this.screen = new DefaultSelect();
      },
    });
  }

  update() {
    if (
      this.form1.controls['profile'].value.trim() == '' ||
      this.form1.controls['screenKey'].value.trim() == '' ||
      (this.form1.controls['profile'].value.trim() == '' &&
        this.form1.controls['screenKey'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.profileMaintenanceService
        .newUpdate1(this.form1.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }
  async create() {
    if (
      this.form1.controls['profile'].value.trim() == '' ||
      this.form1.controls['screenKey'].value.trim() == '' ||
      (this.form1.controls['profile'].value.trim() == '' &&
        this.form1.controls['screenKey'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      let resp = await this.getAccessScreen(
        this.form1.controls['profile'].value,
        this.form1.controls['screenKey'].value
      );
      if (!resp) {
        this.profileMaintenanceService
          .create1(this.form1.getRawValue())
          .subscribe({
            next: data => this.handleSuccess(),
            error: error => (this.loading = false),
          });
      } else {
        this.alert('warning', 'Ya existe un registro con esta pantalla', '');
        this.loading = false;
      }
    }
  }

  getAccessScreen(profile: string, screenKey: string): Promise<boolean> {
    const params = new ListParams();
    params['filter.profile'] = profile;
    params['filter.screenKey'] = `$ilike:${screenKey}`;
    return new Promise((resolve, reject) => {
      this.profileMaintenanceService.getAllProfileXPant(params).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }
  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', 'Perfil por Pantalla', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
