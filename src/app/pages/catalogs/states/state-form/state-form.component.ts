import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStateOfRepublic } from 'src/app/core/models/catalogs/state-of-republic.model';
import { StateOfRepublicService } from 'src/app/core/services/catalogs/state-of-republic.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
  ZONE_NUMBER_PATTERM,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-state-form',
  templateUrl: './state-form.component.html',
  styles: [],
})
export class StateFormComponent extends BasePage implements OnInit {
  stateForm: ModelForm<IStateOfRepublic>;
  title: string = 'Estado';
  edit: boolean = false;
  state: IStateOfRepublic;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private stateService: StateOfRepublicService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.stateForm = this.fb.group({
      //id: [null],
      descCondition: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      codeCondition: [null, [Validators.required, Validators.maxLength(30)]],
      registrationNumber: [null],
      nmtable: [null],
      abbreviation: [null],
      risk: [null],
      version: [
        null,
        [Validators.pattern(POSITVE_NUMBERS_PATTERN), Validators.maxLength(10)],
      ],
      zoneHourlyStd: [
        null,
        [
          Validators.required,
          Validators.pattern(ZONE_NUMBER_PATTERM),
          Validators.maxLength(20),
        ],
      ],
      zoneHourlyVer: [
        null,
        [
          Validators.required,
          Validators.pattern(ZONE_NUMBER_PATTERM),
          Validators.maxLength(20),
        ],
      ],
      userCreation: [null],
      creationDate: [null],
      userModification: [null],
      modificationDate: [null],
    });
    if (this.state != null) {
      this.edit = true;
      //console.log(this.state);
      this.stateForm.patchValue(this.state);
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
      this.stateForm.controls['descCondition'].value.trim() === '' ||
      this.stateForm.controls['codeCondition'].value.trim() === ''
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.stateService.create(this.stateForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.stateService.update(this.state.id, this.stateForm.value).subscribe({
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
