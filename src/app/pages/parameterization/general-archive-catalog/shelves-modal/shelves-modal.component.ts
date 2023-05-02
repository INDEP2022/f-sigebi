import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
//models
import { IShelves } from 'src/app/core/models/catalogs/shelves.model';
//Services
import { IBattery } from 'src/app/core/models/catalogs/battery.model';
import { ISaveValue } from 'src/app/core/models/catalogs/save-value.model';
import { ShelvessService } from 'src/app/core/services/save-values/shelves.service';

@Component({
  selector: 'app-shelves-modal',
  templateUrl: './shelves-modal.component.html',
  styles: [],
})
export class ShelvesModalComponent extends BasePage implements OnInit {
  shelvesForm: ModelForm<IShelves>;
  shelves: IShelves;

  title: string = 'Estantes';
  edit: boolean = false;

  id: ISaveValue;
  idBattery: IBattery;
  cve: ISaveValue;
  noBattery: IBattery;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private shelvessService: ShelvessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    console.log(this.noBattery);
  }

  private prepareForm() {
    this.shelvesForm = this.fb.group({
      key: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      batteryNumber: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      id: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      registerNumber: [null, []],
    });
    if (this.shelves != null) {
      this.edit = true;
      this.id = this.shelves.key as unknown as ISaveValue;
      this.idBattery = this.shelves.batteryNumber as unknown as IBattery;
      this.shelvesForm.patchValue(this.shelves);
      this.shelvesForm.controls['key'].setValue(this.id.id);
      this.shelvesForm.controls['batteryNumber'].setValue(
        this.idBattery.idBattery
      );
    } else {
      this.edit = false;
      console.log(this.cve);
      this.shelvesForm.controls['key'].setValue(this.cve.id);
      this.shelvesForm.controls['batteryNumber'].setValue(
        this.noBattery.idBattery
      );
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
    console.log(this.shelvesForm.value);
    this.shelvessService.create(this.shelvesForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.shelvessService
      .update(this.shelves.id, this.shelvesForm.value)
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
