import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../../../../core/shared/base-page';

@Component({
  selector: 'app-deposit-payment-validations',
  templateUrl: './payment-validations.component.html',
  styles: [],
})
export class PaymentValidationsComponent extends BasePage implements OnInit {
  title: string = 'Validación de pagos de avalúo 601';
  showFilterAssets: boolean = true;
  showSamplingDetail: boolean = true;
  willSave: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  getSearchForm(event: any) {
    console.log(event);
  }

  finishSampling() {
    let message =
      'Se a concluido la Aprobación de Restitución de bienes. ¿Esta de acuerdo que la información es correcta para guardar?';
    this.alertQuestion(
      undefined,
      'Confirmación turnado',
      message,
      'Aceptar'
    ).then(question => {
      if (question.isConfirmed) {
        console.log('enviar mensaje');
      }
    });
  }

  turnSampling() {}

  save() {}
}
