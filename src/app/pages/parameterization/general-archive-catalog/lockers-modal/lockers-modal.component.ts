import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

//Service
import { SaveValueService } from 'src/app/core/services/catalogs/save-value.service';
import { BatterysService } from 'src/app/core/services/save-values/battery.service';
import { LockersService } from 'src/app/core/services/save-values/locker.service';
import { ShelvessService } from 'src/app/core/services/save-values/shelves.service';
//models
import { ILocker } from 'src/app/core/models/catalogs/locker.model';

@Component({
  selector: 'app-lockers-modal',
  templateUrl: './lockers-modal.component.html',
  styles: [],
})
export class LockersModalComponent extends BasePage implements OnInit {
  lockerForm: ModelForm<ILocker>;
  locker: ILocker;

  title: string = 'Casilleros';
  edit: boolean = false;

  cveSaveValues = new DefaultSelect();
  idBattery = new DefaultSelect();
  idShelve = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private lockersService: LockersService,
    private saveValueService: SaveValueService,
    private batterysService: BatterysService,
    private shelvessService: ShelvessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.lockerForm = this.fb.group({
      saveValueKey: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      numBattery: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      numShelf: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
      id: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      numRegister: [
        null,
        [Validators.required, Validators.pattern(NUMBERS_PATTERN)],
      ],
    });
    if (this.locker != null) {
      this.edit = true;
      this.lockerForm.patchValue(this.locker);
    }
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

  getShelvesById(params: ListParams) {
    this.shelvessService.getShelvesById(params).subscribe({
      next: data => (this.idShelve = new DefaultSelect(data.data, data.count)),
    });
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    console.log(this.lockerForm.value);
    this.lockersService.create(this.lockerForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.lockersService
      .update(this.locker.id, this.lockerForm.value)
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
