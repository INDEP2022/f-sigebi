import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IDeductive } from 'src/app/core/models/catalogs/deductive.model';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage, TABLE_SETTINGS } from '../../../../../core/shared/base-page';
import { LIST_DEDUCTIVES_VIEW_COLUMNS } from '../../sampling-assets/sampling-assets-form/columns/list-deductivas-column';
import { LIST_VERIFY_VIEW } from '../../sampling-assets/sampling-assets-form/columns/list-verify-noncompliance';

@Component({
  selector: 'app-verification-warehouse-assets',
  templateUrl: './verification-warehouse-assets.component.html',
  styleUrls: ['./verification-warehouse-assets.component.scss'],
})
export class VerificationWarehouseAssetsComponent
  extends BasePage
  implements OnInit
{
  title: string = `Verificacion de bienes en almacén ${302}`;
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  sampleInfo: ISample;
  idSample: number = 0;
  filterObject: any;
  params = new BehaviorSubject<ListParams>(new ListParams());
  willSave: boolean = true;
  paragraphs = new LocalDataSource();
  paragraphsDeductivas = new LocalDataSource();
  assetsSelected: ISampleGood[] = [];
  totalItems: number = 0;
  deductivesSel: IDeductive[] = [];
  loadingDeductives: boolean = false;
  allDeductives: ISamplingDeductive[] = [];
  allSampleGoods: ISampleGood[] = [];
  settingsDeductive = {
    ...TABLE_SETTINGS,
    actions: false,

    columns: LIST_DEDUCTIVES_VIEW_COLUMNS,
  };

  constructor(
    private store: Store,
    private samplingService: SamplingGoodService,
    private deductiveService: DeductiveVerificationService,
    private router: Router
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: 'multi',
      columns: LIST_VERIFY_VIEW,
    };
  }

  ngOnInit(): void {
    //Id de muestreo se obtiene de la tarea
    this.idSample = 302;
    this.getSampleInfo();
    this.getSampleDeductives();
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
        this.paragraphs.load(response.data);
        this.allSampleGoods = response.data;
        this.totalItems = response.count;
      },
      error: error => {},
    });
  }

  openAnnexJ() {}

  opemAnnexK() {}

  public verifyTurn() {
    if (this.assetsSelected.length == this.allSampleGoods.length) {
      this.alertQuestion(
        'question',
        'Confirmación',
        'Todos los bienes se encontraron en el almacén. ¿Esta de acuerdo que la información es correcta para Finalizar el muestreo?'
      ).then(async question => {
        if (question.isConfirmed) {
          if (this.assetsSelected.length == this.allSampleGoods.length) {
            const updateGood = await this.updateGood();
            if (updateGood) {
              const udapteStatusSample = await this.updateStatusSample(
                'TERMINA MUESTREO'
              );
              if (udapteStatusSample) {
                this.alert(
                  'success',
                  'Correcto',
                  'Muestreo cerrado correctamente'
                );
              }
            }
          }
        }
      });
    } else {
      this.alertQuestion(
        'question',
        'Confirmación',
        'Hay bienes que no se localizaron en el almacén. ¿Esta de acuerdo que la información es correcta para turnar el muestreo?'
      ).then(async question => {
        if (question.isConfirmed) {
          if (this.assetsSelected.length != this.allSampleGoods.length) {
            const updateGood = await this.updateGood();
            if (updateGood) {
              const udapteStatusSample = await this.updateStatusSample(
                'BIENES VERIFICACION'
              );
              if (udapteStatusSample) {
                this.alert(
                  'success',
                  'Correcto',
                  'Muestreo cerrado correctamente'
                );
                this.router.navigate([
                  '/pages/request/restitution-assets-numeric',
                ]);
              }
            }
          }
        }
      });
    }
  }

  updateGood() {
    return new Promise((resolve, reject) => {
      this.assetsSelected.map(good => {
        const sampleGood: ISampleGood = {
          sampleGoodId: good.sampleGoodId,
          indVerification: 'Y',
        };
        this.samplingService.editSamplingGood(sampleGood).subscribe({
          next: () => {
            resolve(true);
          },
        });
      });
    });
  }

  updateStatusSample(status: string) {
    return new Promise((resolve, reject) => {
      const sample: ISample = {
        sampleId: this.idSample,
        sampleStatus: status,
      };

      this.samplingService.updateSample(sample).subscribe({
        next: () => {
          resolve(true);
        },
      });
    });
  }

  getSearchForm(event: any) {
    this.filterObject = event;
  }

  goodsSamplingSelect(event: any) {
    this.assetsSelected = event.selected;
  }

  getSampleDeductives() {
    this.params.getValue()['filter.sampleId'] = `$eq:${this.idSample}`;
    this.samplingService
      .getAllSampleDeductives(this.params.getValue())
      .subscribe({
        next: response => {
          this.allDeductives = response.data;
          this.getDeductives(response.data);
        },
        error: error => {},
      });
  }

  getDeductives(deductivesRelSample: ISamplingDeductive[]) {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    this.deductiveService.getAll(params.getValue()).subscribe({
      next: response => {
        const infoDeductives = response.data.map(item => {
          deductivesRelSample.map(deductiveEx => {
            if (deductiveEx.deductiveVerificationId == item.id) {
              item.observations = deductiveEx.observations;
              item.selected = true;
            }
          });
          return item;
        });
        this.paragraphsDeductivas.load(infoDeductives);
      },
      error: error => {},
    });
  }

  deductivesSelect(event: any) {
    this.deductivesSel.push(event.selected[0]);
  }

  save(): void {}
}
