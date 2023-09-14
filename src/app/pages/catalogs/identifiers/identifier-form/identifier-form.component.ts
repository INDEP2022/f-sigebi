import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IIdentifier } from 'src/app/core/models/catalogs/identifier.model';
import { IdentifierService } from 'src/app/core/services/catalogs/identifier.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-identifier-form',
  templateUrl: './identifier-form.component.html',
  styles: [],
})
export class IdentifierFormComponent extends BasePage implements OnInit {
  title: string = 'Identificador';
  edit: boolean = false;

  identifier: IIdentifier;
  identifierForm: ModelForm<IIdentifier>;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private identifierService: IdentifierService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.identifierForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      keyview: [
        null,
        [
          Validators.required,
          Validators.maxLength(1),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      noRegistration: [null],
    });

    if (this.identifier != null) {
      this.edit = true;
      this.identifierForm.patchValue(this.identifier);
      this.identifierForm.get('id').disable();
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.identifierForm.controls['id'].value.trim() == '' ||
      this.identifierForm.controls['description'].value.trim() == '' ||
      this.identifierForm.controls['keyview'].value.trim() == '' ||
      (this.identifierForm.controls['id'].value.trim() == '' &&
        this.identifierForm.controls['description'].value.trim() == '' &&
        this.identifierForm.controls['keyview'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.identifierService.create(this.identifierForm.value).subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.loading = false;
          this.alert('warning', 'Dato duplicado', ``);
        },
      });
    }
  }

  update() {
    if (
      this.identifierForm.controls['id'].value.trim() == '' ||
      this.identifierForm.controls['description'].value.trim() == '' ||
      this.identifierForm.controls['keyview'].value.trim() == '' ||
      (this.identifierForm.controls['id'].value.trim() == '' &&
        this.identifierForm.controls['description'].value.trim() == '' &&
        this.identifierForm.controls['keyview'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      let data = {
        id: this.identifierForm.controls['id'].value,
        description: this.identifierForm.controls['description'].value,
        keyview: this.identifierForm.controls['keyview'].value,
        noRegistration: this.identifierForm.controls['noRegistration'].value,
      };
      console.log(data);
      this.identifierService.update(this.identifier.id, data).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
