import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStateRepuve } from 'src/app/core/models/catalogs/state-repuve.model';
import { StateRepuveService } from 'src/app/core/services/catalogs/state-repuve.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-state-repuves-form',
  templateUrl: './state-repuves-form.component.html',
  styles: [],
})
export class StateRepuvesFormComponent extends BasePage implements OnInit {
  stateRepuveForm: ModelForm<IStateRepuve>;
  title: string = 'Estado Repuves';
  edit: boolean = false;
  stateRepuve: IStateRepuve;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private stateRepuveService: StateRepuveService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.stateRepuveForm = this.fb.group({
      cve: [null, [Validators.required]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      procedure: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.stateRepuve != null) {
      this.edit = true;
      this.stateRepuveForm.patchValue(this.stateRepuve);
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
    this.stateRepuveService
      .create(this.stateRepuveForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.stateRepuveService
      .update(this.stateRepuve.cve, this.stateRepuveForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
