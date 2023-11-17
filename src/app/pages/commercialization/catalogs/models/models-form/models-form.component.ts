import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IParameterComer } from 'src/app/core/models/catalogs/parameter-comer.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModelsService } from '../models.service';

@Component({
  selector: 'app-models-form',
  templateUrl: './models-form.component.html',
  styles: [],
})
export class ModelsFormComponent extends BasePage implements OnInit {
  modelForm: ModelForm<IParameterComer>;
  title: string = 'modelo';
  edit: boolean = false;
  parameterComer: IParameterComer;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modelServices: ModelsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.modelForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      modelComment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      nbOrigin: [null, [Validators.pattern(STRING_PATTERN)]],
    });
    if (this.parameterComer != null) {
      this.edit = true;
      this.modelForm.patchValue(this.parameterComer);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.loading = true;
    this.modelServices
      .update(this.parameterComer.id, this.modelForm.value)
      .subscribe({
        next: data => {
          this.handleSuccess();
          this.modalRef.hide();
        },
        error: error => {
          this.loading = false;
          this.alert('warning', `No es posible asctualizar el modelo`, '');
          this.modalRef.hide();
        },
      });
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    if (this.modelForm.valid) {
      this.modelServices.create(this.modelForm.value).subscribe({
        next: data => {
          this.loading = false;
          this.handleSuccess();
          this.modalRef.hide();
        },
        error: error => {
          this.alert('warning', `No es posible crear el modelo`, '');
          this.loading = false;
        },
      });
    } else {
      this.alert(
        'warning',
        'El Formulario no es Válido. Revise los Campos Requeridos',
        ''
      );
      this.loading = false;
    }
  }

  handleSuccess() {
    const message: string = this.edit
      ? 'ha sido actualizado'
      : 'ha sido guardado';
    this.alert('success', `El ${this.title} ${message}`, '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
