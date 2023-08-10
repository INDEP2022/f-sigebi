import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IIndiciados } from 'src/app/core/models/catalogs/indiciados.model';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CURP_PATTERN, STRING_PATTERN } from '../../../../core/shared/patterns';

@Component({
  selector: 'app-indicated-form',
  templateUrl: './indicated-form.component.html',
  styles: [],
})
export class IndicatedFormComponent extends BasePage implements OnInit {
  indicated: IIndiciados;
  edit: boolean = false;
  indicatedForm: ModelForm<IIndiciados>;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private indicatedService: IndiciadosService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.indicatedForm = this.fb.group({
      name: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(50),
        ],
      ],
      curp: [
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(CURP_PATTERN),
        ],
      ],
    });

    if (this.indicated != null) {
      this.edit = true;
      this.indicatedForm.patchValue(this.indicated);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (this.indicatedForm.controls['name'].value.trim() === '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return; // Retorna temprano si el campo está vacío.
    }
    this.loading = true;
    this.indicatedService.create(this.indicatedForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.indicatedService
      .update(this.indicated.id, this.indicatedForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  close() {
    this.modalRef.hide();
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', 'Indiciado', `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
