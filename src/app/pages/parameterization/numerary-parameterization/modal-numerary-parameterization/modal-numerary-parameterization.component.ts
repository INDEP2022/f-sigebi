import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { ICategorizationAutomNumerary } from 'src/app/core/models/catalogs/numerary-categories-model';
import { NumeraryParameterizationAutomService } from 'src/app/core/services/catalogs/numerary-parameterization-autom.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-modal-numerary-parameterization',
  templateUrl: './modal-numerary-parameterization.component.html',
  styles: [],
})
export class ModalNumeraryParameterizationComponent
  extends BasePage
  implements OnInit
{
  title: string = 'TASA';
  edit: boolean = false;
  form: ModelForm<ICategorizationAutomNumerary>;

  allotment: ICategorizationAutomNumerary;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private numeraryParameterizationAutomService: NumeraryParameterizationAutomService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      typeProceeding: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      initialCategory: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      finalCategory: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      registerNumber: [null],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    this.loading = true;
    this.numeraryParameterizationAutomService
      .create(this.form.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }
  update() {
    this.loading = true;
    this.numeraryParameterizationAutomService
      .update6(this.form.value)
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
  close() {
    this.modalRef.hide();
  }
}
