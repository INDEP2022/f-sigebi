import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
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

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {}

  openAnnexJ() {}

  opemAnnexK() {}

  public verifyTurn() {
    let bienesSelecconados = new Array();
    let tempArray = new Array();

    for (let i = 0; i < bienesSelecconados.length; i++) {
      bienesSelecconados[i].EstatusRestitucion = 'PENDIENTE_LIBERACION';
    }

    if (bienesSelecconados.length == tempArray.length) {
      this.turnVerification('1');
    } else {
      this.turnVerification('2');
    }
  }

  turnVerification(option: string) {
    let message = '';
    switch (option) {
      case '1':
        message =
          'Todos los bienes se encontraron en el almacén.\n¿Esta de acuerdo que la información es correcta para Finalizar el muestreo?';
        // ADFUtils.setBoundAttributeValue("lsEstatusMuestreo", "TERMINA MUESTREO");
        this.openturnSampling(message);
        break;
      case '2':
        message =
          'Hay bienes que no se localizaron en el almacén.\n¿Esta de acuerdo que la información es correcta para turnar el muestreo?';
        // ADFUtils.setBoundAttributeValue("lsEstatusMuestreo", "BIENES VERIFICACION");
        this.openturnSampling(message);
        break;
    }
  }
  public openturnSampling(messageSend: string) {
    let message = messageSend;

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
