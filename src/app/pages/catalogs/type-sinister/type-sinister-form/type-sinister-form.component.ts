import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITypeSiniester } from 'src/app/core/models/catalogs/type-siniester.model';
import { TypeSiniesterService } from 'src/app/core/services/catalogs/type-siniester.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-type-sinister-form',
  templateUrl: './type-sinister-form.component.html',
  styles: [],
})
export class TypeSinisterFormComponent extends BasePage implements OnInit {
  typeSinisterForm: ModelForm<ITypeSiniester>;
  title: string = 'Tipo Siniestro';
  edit: boolean = false;
  typeSiniester: ITypeSiniester;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private typeSinisterService: TypeSiniesterService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.typeSinisterForm = this.fb.group({
      id: [null],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      flag: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      //noRegistre: [null, [Validators.required]],
    });
    if (this.typeSiniester != null) {
      this.edit = true;
      this.typeSinisterForm.patchValue(this.typeSiniester);
    }
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (this.typeSinisterForm.controls['description'].value.trim() == '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return;
    } else {
      this.loading = true;
      this.typeSinisterService
        .create(this.typeSinisterForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  update() {
    if (this.typeSinisterForm.controls['description'].value.trim() == '') {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      return;
    } else {
      this.loading = true;
      this.typeSinisterService
        .newUpdate(this.typeSinisterForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
