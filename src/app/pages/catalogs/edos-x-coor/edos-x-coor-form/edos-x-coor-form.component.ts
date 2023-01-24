import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IEdosXCoor } from 'src/app/core/models/catalogs/edos-x-coor.model';
import { EdosXCoorService } from 'src/app/core/services/catalogs/edos-x-coor.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-edos-x-coor-form',
  templateUrl: './edos-x-coor-form.component.html',
  styles: [],
})
export class EdosXCoorFormComponent extends BasePage implements OnInit {
  edosXCoorForm: ModelForm<IEdosXCoor>;
  title: string = 'Edos X Coor';
  edit: boolean = false;
  edosXCoor: IEdosXCoor;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private edosXCoorService: EdosXCoorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.edosXCoorForm = this.fb.group({
      id: [null],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(80),
        ],
      ],
      noState: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(60),
        ],
      ],
      state: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(10),
        ],
      ],
      stage: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(10),
        ],
      ],
    });
    if (this.edosXCoor != null) {
      this.edit = true;
      this.edosXCoorForm.patchValue(this.edosXCoor);
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
    this.edosXCoorService.create(this.edosXCoorForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.edosXCoorService
      .update(this.edosXCoor.id, this.edosXCoorForm.getRawValue())
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
