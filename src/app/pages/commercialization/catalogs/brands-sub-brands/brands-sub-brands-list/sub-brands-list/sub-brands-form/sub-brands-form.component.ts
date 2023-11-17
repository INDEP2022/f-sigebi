import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IUpdateSubBrandsModel } from 'src/app/core/models/ms-parametercomer/parameter';
import { ParameterBrandsService } from 'src/app/core/services/ms-parametercomer/parameter-brands.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-sub-brands-form',
  templateUrl: './sub-brands-form.component.html',
  styles: [],
})
export class SubBrandsFormComponent extends BasePage implements OnInit {
  modelForm: ModelForm<IUpdateSubBrandsModel>;
  model: IUpdateSubBrandsModel;
  title: string = 'Submarca';
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
    this.modelForm = this.fb.group({
      idBrand: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      idSubBrand: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      subBrandDescription: [
        null,
        [Validators.maxLength(100), Validators.pattern(STRING_PATTERN)],
      ],
      nbOrigin: [
        null,
        [Validators.maxLength(30), Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.model) {
      this.edit = true;
      this.modelForm.patchValue(this.model);
    }
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.update();
  }

  update() {
    this.brandService.updateSubBrand(this.modelForm.value).subscribe({
      next: data => {
        this.handleSuccess(), this.modalRef.hide();
      },
      error: (error: any) => {
        this.alert('warning', `No es posible actualizar la submarca`, '');
        this.modalRef.hide();
      },
    });
    this.modalRef.hide();
  }

  handleSuccess() {
    const message: string = 'La submarca ha sido actualizada';
    this.alert('success', `${message}`, '');
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
