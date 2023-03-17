import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

//Service
import { LockersService } from 'src/app/core/services/save-values/locker.service';
//models
import { IBattery } from 'src/app/core/models/catalogs/battery.model';
import { ILocker } from 'src/app/core/models/catalogs/locker.model';
import { ISaveValue } from 'src/app/core/models/catalogs/save-value.model';
import { IShelves } from 'src/app/core/models/catalogs/shelves.model';

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

  cve: ISaveValue;
  noBattery: IBattery;
  noShelve: IShelves;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private lockersService: LockersService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.lockerForm = this.fb.group({
      saveValueKey: [null, [Validators.pattern(STRING_PATTERN)]],
      numBattery: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      numShelf: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      id: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      numRegister: [null, []],
    });
    if (this.locker != null) {
      this.edit = true;
      this.lockerForm.patchValue(this.locker);
    } else {
      this.edit = false;
      console.log(this.cve);
      console.log(this.noBattery);
      console.log(this.noShelve);
      this.lockerForm.controls['saveValueKey'].setValue(this.cve.id);
      this.lockerForm.controls['numBattery'].setValue(this.noBattery.idBattery);
      this.lockerForm.controls['numShelf'].setValue(this.noShelve.id);
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
    console.log(this.lockerForm.value);
    this.lockersService.create(this.lockerForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.lockersService.update(this.lockerForm.value).subscribe({
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
