import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage, TABLE_SETTINGS } from '../../../../../core/shared/base-page';
import { LIST_VERIFY_WAREHOUSE } from '../../sampling-assets/sampling-assets-form/columns/list-verify-noncompliance';

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
  sampleInfo: ISample;
  idSample: number = 0;
  filterObject: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  willSave: boolean = true;
  paragraphs = new LocalDataSource();
  assetsSelected: ISampleGood[] = [];
  totalItems: number = 0;
  constructor(
    private store: Store,
    private samplingService: SamplingGoodService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: LIST_VERIFY_WAREHOUSE,
    };
  }

  ngOnInit(): void {
    //Id de muestreo se obtiene de la tarea
    this.idSample = 302;
    this.getSampleInfo();
  }

  getSampleInfo() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${302}`;
    this.samplingService.getSample(params.getValue()).subscribe({
      next: response => {
        console.log('response', response);
        this.sampleInfo = response.data[0];
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getGoodsSampling());
      },
    });
  }

  getGoodsSampling() {
    this.params.getValue()['filter.sampleId'] = this.idSample;
    this.samplingService.getSamplingGoods(this.params.getValue()).subscribe({
      next: response => {
        console.log('samplegfoods', response);
        this.paragraphs.load(response.data);
        this.totalItems = response.count;
      },
      error: error => {},
    });
  }

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
    this.filterObject = event;
  }

  goodsSamplingSelect(event: any) {
    this.assetsSelected = event.selected;
  }

  save(): void {}
}
