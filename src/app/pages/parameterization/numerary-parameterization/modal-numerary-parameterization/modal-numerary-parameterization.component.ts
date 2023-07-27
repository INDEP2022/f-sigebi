import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import {
  ICategorizationAutomNumerary,
  INumeraryCategories,
} from 'src/app/core/models/catalogs/numerary-categories-model';
import { NumeraryParameterizationAutomService } from 'src/app/core/services/catalogs/numerary-parameterization-autom.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NAME_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-modal-numerary-parameterization',
  templateUrl: './modal-numerary-parameterization.component.html',
  styles: [],
})
export class ModalNumeraryParameterizationComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Parametrización de Numerario';
  edit: boolean = false;
  form: ModelForm<ICategorizationAutomNumerary>;
  categories = new DefaultSelect<INumeraryCategories>();
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
    this.getCategories(new ListParams());
  }

  private prepareForm() {
    this.form = this.fb.group({
      typeProceeding: [
        null,
        [
          Validators.required,
          Validators.pattern(NAME_PATTERN),
          Validators.maxLength(11),
        ],
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
      this.form.patchValue(this.allotment);
      let value = this.allotment.typeProceeding;
      this.form.controls['typeProceeding'].setValue(value);
      //this.form.get('typeProceeding').disable();
    }
  }
  confirm() {
    this.edit ? this.update() : this.create();
  }
  create() {
    if (this.form.controls['typeProceeding'].value.trim() === '') {
      this.alert('warning', 'No se puede guardar campos vacíos', '');
      return;
    }
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
      .update(this.form.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  getCategories(params: ListParams) {
    this.numeraryParameterizationAutomService
      .getCategories(params)
      .subscribe(item => {
        this.categories = new DefaultSelect(item.data, item.count);
      });
  }

  categoriesChange(categories: INumeraryCategories) {}

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
  close() {
    this.modalRef.hide();
  }
}
