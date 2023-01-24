import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IServiceCat } from 'src/app/core/models/catalogs/service-cat.model';
import { ServiceCatService } from 'src/app/core/services/catalogs/service-cat.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-cat-services-form',
  templateUrl: './cat-services-form.component.html',
  styles: [],
})
export class CatServicesFormComponent extends BasePage implements OnInit {
  catserviceForm: ModelForm<IServiceCat>;
  title: string = 'Servicio';
  edit: boolean = false;
  catservice: IServiceCat;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private catserviceService: ServiceCatService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.catserviceForm = this.fb.group({
      code: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
          Validators.minLength(1),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(200),
          Validators.minLength(1),
        ],
      ],
      unaffordabilityCriterion: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(30),
          Validators.minLength(1),
        ],
      ],
      subaccount: [
        null,
        [
          Validators.required,
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(4),
          Validators.minLength(1),
        ],
      ],
      registryNumber: [null, [Validators.pattern(NUMBERS_PATTERN)]],
      cost: [
        null,
        [
          Validators.pattern(STRING_PATTERN),
          Validators.maxLength(5),
          Validators.minLength(1),
        ],
      ],
    });
    if (this.catservice != null) {
      this.edit = true;
      this.catserviceForm.patchValue(this.catservice);
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
    this.catserviceService.create(this.catserviceForm.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.catserviceService
      .update(this.catservice.code, this.catserviceForm.getRawValue())
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
