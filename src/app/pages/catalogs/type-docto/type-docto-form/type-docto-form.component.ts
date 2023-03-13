import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ITypeDocto } from 'src/app/core/models/catalogs/type-docto.model';
import { TypeDoctoService } from 'src/app/core/services/catalogs/type-docto.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-type-docto-form',
  templateUrl: './type-docto-form.component.html',
  styles: [],
})
export class TypeDoctoFormComponent extends BasePage implements OnInit {
  typeDoctoForm: ModelForm<ITypeDocto>;
  title: string = 'Tipo Docto';
  edit: boolean = false;
  typeDocto: ITypeDocto;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private typeDoctoService: TypeDoctoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.typeDoctoForm = this.fb.group({
      id: [null, [Validators.required]],
      description: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(STRING_PATTERN),
        ]),
      ],
      version: [null, Validators.compose([Validators.required])],
      status: [null, Validators.compose([Validators.required])],
    });
    if (this.typeDocto != null) {
      this.edit = true;
      this.typeDoctoForm.patchValue(this.typeDocto);
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
    this.typeDoctoService.create(this.typeDoctoForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.typeDoctoService
      .update(this.typeDocto.id, this.typeDoctoForm.getRawValue())
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
