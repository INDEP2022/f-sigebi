import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStrategyShift } from 'src/app/core/models/ms-strategy-shift/strategy-shift.model';
import { StrategyShiftService } from 'src/app/core/services/ms-strategy/strategy-shift.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-turn-type-form',
  templateUrl: './turn-type-form.component.html',
  styles: [],
})
export class TurnTypeFormComponent extends BasePage implements OnInit {
  shiftForm: ModelForm<IStrategyShift>;
  shift: IStrategyShift;

  title: string = 'Turno/Tipo';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private shiftService: StrategyShiftService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.shiftForm = this.fb.group({
      description: [null, [Validators.required]],
    });

    if (this.shift != null) {
      this.edit = true;
      this.shiftForm.patchValue(this.shift);
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

    this.shiftService.create(this.shiftForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;

    this.shiftService
      .update(this.shiftForm.value, this.shift.shiftNumber)
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
