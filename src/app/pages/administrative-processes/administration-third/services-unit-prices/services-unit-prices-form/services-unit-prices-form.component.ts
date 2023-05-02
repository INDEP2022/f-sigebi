import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStrategyService } from 'src/app/core/models/ms-strategy-service/strategy-service.model';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-services-unit-prices-form',
  templateUrl: './services-unit-prices-form.component.html',
  styles: [],
})
export class ServicesUnitPricesFormComponent
  extends BasePage
  implements OnInit
{
  serviceForm: ModelForm<IStrategyService>;
  service: IStrategyService;

  title: string = 'Turno/Tipo';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private serviceService: StrategyServiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.serviceForm = this.fb.group({
      description: [null, [Validators.required]],
    });

    if (this.service != null) {
      this.edit = true;
      this.serviceForm.patchValue(this.service);
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

    this.serviceService.create(this.serviceForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;

    this.serviceService
      .update(this.serviceForm.value, this.service.serviceNumber)
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
