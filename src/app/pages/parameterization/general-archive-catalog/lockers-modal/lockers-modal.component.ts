import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
//Service
import { LockersService } from 'src/app/core/services/save-values/locker.service';
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

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.update();
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
