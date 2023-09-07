import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IOrderServiceProvider } from 'src/app/core/models/ms-order-entry/order-service-provider.model';
import { orderentryService } from 'src/app/core/services/ms-comersale/orderentry.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-create-manual-service-form',
  templateUrl: './create-manual-service-form.component.html',
  styles: [],
})
export class CreateManualServiceFormComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  private orderEntryService = inject(orderentryService);

  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      andmidserv: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      priceUnitary: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea crear el servicio manual?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        const form = this.form.getRawValue();
        form.classificationService = 'Manual';

        this.modalRef.content.callback(this.form.value);
        this.close();
        //this.createOrderServicePrestado(form);
      }
    });
  }

  close() {
    this.modalRef.hide();
  }

  createOrderServicePrestado(body: IOrderServiceProvider) {
    this.orderEntryService.createServiceProvided(body).subscribe({
      next: resp => {
        this.onLoadToast('success', 'Servicio manual creado correctamente');
        this.modalRef.content.callback(this.form.value);
        this.close();
      },
      error: error => {
        this.onLoadToast('error', 'Error al crear el servicio');
        console.error(error);
      },
    });
  }
}
