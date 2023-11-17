import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IBrand } from 'src/app/core/models/ms-parametercomer/parameter';
import { ParameterBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-brands.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-brands-sub-brands-form',
  templateUrl: './brands-sub-brands-form.component.html',
  styles: [],
})
export class BrandsSubBrandsFormComponent extends BasePage implements OnInit {
  brandsSubBrandsForm: ModelForm<IBrand>;
  brandsSubBrands: IBrand;
  title: string = 'marca';
  edit: boolean = false;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private brandService: ParameterBrandsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.brandsSubBrandsForm = this.fb.group({
      id: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      brandDescription: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.brandsSubBrands) {
      this.edit = true;
      this.brandsSubBrandsForm.patchValue(this.brandsSubBrands);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  update() {
    this.brandService
      .update(this.brandsSubBrands.id, this.brandsSubBrandsForm.value)
      .subscribe({
        next: data => {
          this.handleSuccess(), this.modalRef.hide();
        },
        error: (error: any) => {
          this.alert('warning', `No es Posible Actualizar la Marca`, '');
          this.modalRef.hide();
        },
      });
    this.modalRef.hide();
  }

  create() {
    if (this.brandsSubBrandsForm.valid) {
      this.brandService.create(this.brandsSubBrandsForm.value).subscribe({
        next: data => {
          this.handleSuccess();
          this.modalRef.hide();
        },
        error: error => {
          this.alert('warning', `Ya Existe una Marca con ese Nombre`, '');
          this.modalRef.hide();
        },
      });
      this.modalRef.hide();
    } else {
      this.alert(
        'warning',
        'El Formulario no es Válido. Revise los Campos Requeridos',
        ''
      );
    }
  }

  handleSuccess() {
    const message: string = this.edit
      ? 'ha sido actualizada'
      : 'ha sido creada';
    this.alert('success', `La ${this.title} ${message}`, '');
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
