import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStrategyServiceType } from 'src/app/core/models/ms-strategy-service-type/strategy-service-type.model';
import { StrategyServiceTypeService } from 'src/app/core/services/ms-strategy/strategy-service-type.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-specs-form',
  templateUrl: './specs-form.component.html',
  styles: [],
})
export class SpecsFormComponent extends BasePage implements OnInit {
  serviceTypeForm: ModelForm<IStrategyServiceType>;
  serviceType: IStrategyServiceType;

  title: string = 'Turno/Tipo';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private serviceTypeService: StrategyServiceTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.serviceTypeForm = this.fb.group({
      description: [null, [Validators.required]],
    });

    if (this.serviceType != null) {
      this.edit = true;
      this.serviceTypeForm.patchValue(this.serviceType);
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

    this.serviceTypeService.create(this.serviceTypeForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;

    this.serviceTypeService
      .update(this.serviceTypeForm.value, this.serviceType.serviceTypeNumber)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
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
