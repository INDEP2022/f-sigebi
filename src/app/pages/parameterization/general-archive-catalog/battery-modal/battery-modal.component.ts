import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
//models
import { IBattery } from 'src/app/core/models/catalogs/battery.model';
import { ISaveValue } from 'src/app/core/models/catalogs/save-value.model';
//service
import { SaveValueService } from 'src/app/core/services/catalogs/save-value.service';
import { BatterysService } from 'src/app/core/services/save-values/battery.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-battery-modal',
  templateUrl: './battery-modal.component.html',
  styles: [],
})
export class BatteryModalComponent extends BasePage implements OnInit {
  batteryForm: ModelForm<IBattery>;
  battery: IBattery;
  title: string = 'Bateria';
  edit: boolean = false;

  id: ISaveValue;
  cve: ISaveValue;

  cveSaveValues = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private batterysService: BatterysService,
    private saveValueService: SaveValueService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.batteryForm = this.fb.group({
      storeCode: [null, [Validators.min(0)]],
      idBattery: [null],
      description: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
          Validators.required,
        ],
      ],
      status: [
        null,
        [
          Validators.required,
          Validators.maxLength(1),
          Validators.minLength(1),
          Validators.min(0),
        ],
      ],
      registerNumber: [null, []],
    });
    if (this.battery != null) {
      this.id = this.battery.storeCode as unknown as ISaveValue;
      this.edit = true;
      this.batteryForm.patchValue(this.battery);
      this.batteryForm.controls['storeCode'].setValue(this.id.id);
    } else {
      this.edit = false;
      console.log(this.cve);
      this.batteryForm.controls['storeCode'].setValue(this.cve.id);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.batteryForm.controls['description'].value.trim() == '' ||
      this.batteryForm.controls['status'].value.trim() == '' ||
      (this.batteryForm.controls['description'].value.trim() == '' &&
        this.batteryForm.controls['status'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      console.log(this.batteryForm.value);
      this.batterysService.create(this.batteryForm.getRawValue()).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  update() {
    if (
      this.batteryForm.controls['description'].value.trim() == '' ||
      this.batteryForm.controls['status'].value.trim() == '' ||
      (this.batteryForm.controls['description'].value.trim() == '' &&
        this.batteryForm.controls['status'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.batterysService
        .update2(this.battery.idBattery, this.batteryForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
