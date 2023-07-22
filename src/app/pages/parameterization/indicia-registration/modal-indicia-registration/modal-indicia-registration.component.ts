import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IIndiciados } from 'src/app/core/models/catalogs/indiciados.model';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { CURP_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-modal-indicia-registration',
  templateUrl: './modal-indicia-registration.component.html',
  styles: [],
})
export class ModalIndiciaRegistrationComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Indiciado';
  edit: boolean = false;
  form: ModelForm<IIndiciados>;
  indicated: IIndiciados;
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

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      name: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(100),
        ],
      ],
      curp: [
        null,
        [Validators.maxLength(40), Validators.pattern(CURP_PATTERN)],
      ],
      noRegistration: [null],
      consecutive: [
        null,
        [Validators.maxLength(10), Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.indicated != null) {
      this.edit = true;
      console.log(this.indicated);
      this.form.patchValue(this.indicated);
    }
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (this.form.controls['name'].value.trim() == '') {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      return;
    } else {
      this.loading = true;
      this.indicatedService.create(this.form.value).subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
    }
  }

  update() {
    if (this.form.controls['name'].value.trim() == '') {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      return;
    } else {
      this.indicatedService
        .update(this.indicated.id, this.form.value)
        .subscribe({
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
