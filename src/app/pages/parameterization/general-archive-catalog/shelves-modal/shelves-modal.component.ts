import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//models
import { IShelves } from 'src/app/core/models/catalogs/shelves.model';
//Services
import { SaveValueService } from 'src/app/core/services/catalogs/save-value.service';
import { BatterysService } from 'src/app/core/services/save-values/battery.service';
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

  cveSaveValues = new DefaultSelect();
  idBattery = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private shelvessService: ShelvessService,
    private saveValueService: SaveValueService,
    private batterysService: BatterysService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  getCveSaveValues(params: ListParams) {
    this.saveValueService.getCveSaveValues(params).subscribe({
      next: data =>
        (this.cveSaveValues = new DefaultSelect(data.data, data.count)),
    });
  }

  getBatteryById(params: ListParams) {
    this.batterysService.getBatteryById(params).subscribe({
      next: data => (this.idBattery = new DefaultSelect(data.data, data.count)),
    });
  }

  private prepareForm() {
    this.shelvesForm = this.fb.group({
      key: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      batteryNumber: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      id: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      registerNumber: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.shelves != null) {
      this.edit = true;
      this.shelvesForm.patchValue(this.shelves);
      // this.shelvesForm.valueChanges.pipe(
      //   map(value => `${value.key}-${value.batteryNumber}`)
      // ).subscribe(value => {
      //   this.shelvesForm.controls['key'].setValue(value,)
      // })
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
