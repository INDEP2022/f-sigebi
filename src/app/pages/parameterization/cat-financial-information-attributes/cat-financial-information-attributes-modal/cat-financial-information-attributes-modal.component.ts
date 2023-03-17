import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
//Models
import { IAttributesFinancialInfo } from 'src/app/core/models/catalogs/attributes-financial-info-model';
//Services
import { AttributesInfoFinancialService } from 'src/app/core/services/catalogs/attributes-info-financial-service';

@Component({
  selector: 'app-cat-financial-information-attributes-modal',
  templateUrl: './cat-financial-information-attributes-modal.component.html',
  styles: [],
})
export class CatFinancialInformationAttributesModalComponent
  extends BasePage
  implements OnInit
{
  attributesFinancialInfoForm: ModelForm<IAttributesFinancialInfo>;
  attributesFinancialInfo: IAttributesFinancialInfo;
  title: string = 'Catálogo de Atributos de Información Financiera';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private attributesInfoFinancialService: AttributesInfoFinancialService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.attributesFinancialInfoForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      type: [null, [Validators.required]],
      subType: [null, [Validators.required]],
    });
    if (this.attributesFinancialInfo != null) {
      this.edit = true;
      this.attributesFinancialInfoForm.patchValue(this.attributesFinancialInfo);
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
    this.attributesInfoFinancialService
      .create(this.attributesFinancialInfoForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.attributesInfoFinancialService
      .update(
        this.attributesFinancialInfo.id,
        this.attributesFinancialInfoForm.value
      )
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => {
          this.onLoadToast('info', 'Opss..', 'Dato duplicado');
          this.loading = false;
          console.log(error);
        },
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
