import { Component, OnInit } from '@angular/core';
import { BasePage } from '../../../../../core/shared/base-page';

@Component({
  selector: 'app-verification-warehouse-assets',
  templateUrl: './verification-warehouse-assets.component.html',
  styleUrls: ['./verification-warehouse-assets.component.scss'],
})
export class VerificationWarehouseAssetsComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Verificacion de bienes en almacen 601';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  openAnnexJ() {}

  opemAnnexK() {}

  turnSampling() {
    let message =
      'Hay bienes que nose localizaron en el almacen.\n¿Esta de acuerdo que la información es correcta para turnar el muestreo?';
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

  getSearchForm(event: any) {
    console.log(event);
  }

  save(): void {}
}
