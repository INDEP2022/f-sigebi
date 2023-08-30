import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStrategyTypeService } from 'src/app/core/models/ms-strategy-service/strategy-service.model';
import { StrategyServiceService } from 'src/app/core/services/ms-strategy/strategy-service.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-services-type-unit-prices-form',
  templateUrl: './services-type-unit-prices-form.component.html',
  styles: [],
})
export class ServicesTypeUnitPricesFormComponent
  extends BasePage
  implements OnInit
{
  serviceForm: ModelForm<IStrategyTypeService>;
  service: IStrategyTypeService;

  title: string = 'Exitoso';
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
      description: [null],
      registryNumber: [null],
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

    this.serviceService.createType(this.serviceForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;

    this.serviceService
      .updateType(this.serviceForm.value, this.service.serviceTypeNumber)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert(
      'success',
      this.edit ? '' : this.title,
      `${message} Correctamente`
    );
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
