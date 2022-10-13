import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { ITypeRelevant } from 'src/app/core/models/catalogs/type-relevant.model';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-type-relevant-form',
  templateUrl: './type-relevant-form.component.html',
  styles: [],
})
export class TypeRelevantFormComponent extends BasePage implements OnInit {
  typeRelevantForm: ModelForm<ITypeRelevant>;
  title: string = 'Tipo relevante';
  edit: boolean = false;
  typeRelevant: ITypeRelevant;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private typeRelevantService: TypeRelevantService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.typeRelevantForm = this.fb.group({
      id: [null],
      description: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      version: [null, Validators.compose([Validators.required])],
      noPhotography: [null, Validators.compose([Validators.required])],
      detailsPhotography: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(500)]),
      ],
    });
    if (this.typeRelevant != null) {
      this.edit = true;
      this.typeRelevantForm.patchValue(this.typeRelevant);
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
    this.typeRelevantService
      .create(this.typeRelevantForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.typeRelevantService
      .update(this.typeRelevant.id, this.typeRelevantForm.getRawValue())
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
