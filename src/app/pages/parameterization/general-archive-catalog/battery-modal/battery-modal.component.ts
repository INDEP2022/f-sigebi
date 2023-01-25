import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IBattery } from 'src/app/core/models/catalogs/battery.model';
import { BatterysService } from 'src/app/core/services/save-values/battery.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-battery-modal',
  templateUrl: './battery-modal.component.html',
  styles: [],
})
export class BatteryModalComponent extends BasePage implements OnInit {
  batteryForm: ModelForm<IBattery>;
  battery: IBattery;
  title: string = 'Baterias';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private batterysService: BatterysService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.batteryForm = this.fb.group({
      storeCode: [{ value: this.battery.storeCode, disabled: true }],
      idBattery: [null, [Validators.required]],
      description: [null, [Validators.required]],
      status: [null, [Validators.required]],
      registerNumber: [{ value: null, disabled: true }],
    });
    if (this.battery != null) {
      this.edit = true;
      this.batteryForm.patchValue(this.battery);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.update();
  }

  update() {
    this.loading = true;
    this.batterysService
      .update(this.battery.idBattery, this.batteryForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
