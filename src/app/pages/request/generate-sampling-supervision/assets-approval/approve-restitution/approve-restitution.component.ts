import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDeductiveVerification } from 'src/app/core/models/catalogs/deductive-verification.model';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISampleGood } from 'src/app/core/models/ms-goodsinv/sampling-good-view.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { BasePage, TABLE_SETTINGS } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { LIST_DEDUCTIVES_COLUMNS } from '../../sampling-assets/sampling-assets-form/columns/list-deductivas-column';

@Component({
  selector: 'app-approve-restitution',
  templateUrl: './approve-restitution.component.html',
  styleUrls: ['./approve-restitution.component.scss'],
})
export class ApproveRestitutionComponent extends BasePage implements OnInit {
  title: string = 'Aprobación del bien';
  showSamplingDetail: boolean = true;
  showFilterAssets: boolean = true;
  idSample: number = 302;
  sampleInfo: ISample;
  data: any;
  filterObject: any;
  willSave: boolean = false;
  filterForm: ModelForm<any>;
  loadingDeductives: boolean = false;
  paragraphsDeductivas = new LocalDataSource();
  //datos para el detalle de anexo
  annexDetail: any[] = [];
  allDeductives: IDeductiveVerification[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private samplingGoodService: SamplingGoodService,
    private fb: FormBuilder,
    private deductiveService: DeductiveVerificationService,
    private samplingService: SamplingGoodService
  ) {
    super();
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: LIST_DEDUCTIVES_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.getSampleInfo();
    this.initFilterForm();
    this.getSampleDeductives();
  }

  getSampleDeductives() {
    this.params.getValue()['filter.sampleId'] = `$eq:${this.idSample}`;
    this.samplingGoodService
      .getAllSampleDeductives(this.params.getValue())
      .subscribe({
        next: response => {
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
        this.allDeductives = response.data;
      },
      error: error => {},
    });
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      noManagement: [null],
      noInventory: [null],
      descriptionAsset: [null, [Validators.pattern(STRING_PATTERN)]],
    });
  }

  getSampleInfo() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.sampleId'] = `$eq:${303}`;
    this.samplingGoodService.getSample(params.getValue()).subscribe({
      next: response => {
        this.sampleInfo = response.data[0];
      },
      error: () => {},
    });
  }

  async turnSampling() {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea aprobar el muestreo de bien?'
    ).then(async question => {
      if (question.isConfirmed) {
        const allGoodsSample: any = await this.getGoods();
        if (allGoodsSample) {
          const ckeckResultEvaluation: any = await this.checkResultEvaluation(
            allGoodsSample
          );
          if (ckeckResultEvaluation) {
            this.alert(
              'warning',
              'Acción Invalida',
              'Todos los bienes deben contar con un resultado'
            );
          } else {
            const checkApproveRes: any = await this.checkApproveRes(
              allGoodsSample
            );
            if (checkApproveRes.length == allGoodsSample.length) {
              this.alertQuestion(
                'question',
                'Todos los bienes han sido aprobados en el pago de la ficha de orden de ingreso.',
                '¿Esta de acuerdo que la información es correcta para finalizar?'
              ).then(async question => {
                if (question.isConfirmed) {
                  const updateGoodsSample = await this.updateGoodSample(
                    checkApproveRes,
                    'APROBADO_NUMERARIO',
                    'APROBAR'
                  );
                  if (updateGoodsSample) {
                    this.alert(
                      'success',
                      'Correcto',
                      'Muestreo de bien aprobado correctamente'
                    );
                  }
                }
              });
            } else {
              const checkDeclineRes: any = await this.checkDeclineRes(
                allGoodsSample
              );

              if (checkDeclineRes.length > 0) {
                this.alertQuestion(
                  'question',
                  'Hay bienes que han sido rechazados en el pago de la ficha de orden de ingreso.',
                  '¿Esta de acuerdo que la información es correcta para turnar?'
                ).then(async question => {
                  if (question.isConfirmed) {
                    const updateGoodsSample = await this.updateGoodSample(
                      checkApproveRes,
                      'RECHAZADO_NUMERARIO',
                      'RECHAZAR'
                    );
                    if (updateGoodsSample) {
                      this.alert(
                        'success',
                        'Correcto',
                        'Muestreo de bien aprobado correctamente'
                      );
                    }
                  }
                });
              }
            }
          }
        }
      }
    });
  }

  getGoods() {
    return new Promise((resolve, reject) => {
      const params = new BehaviorSubject<ListParams>(new ListParams());
      params.getValue()['filter.sampleId'] = this.idSample;
      params.getValue()['filter.typeRestitution'] = 'EN ESPECIE';
      this.samplingService.getSamplingGoods(params.getValue()).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: error => {},
      });
    });
  }

  checkResultEvaluation(goodsSample: ISampleGood[]) {
    return new Promise((resolve, reject) => {
      const filter = goodsSample.filter((good: any) => {
        if (!good.restitutionStatus) return good;
      });

      if (filter.length > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }

  checkApproveRes(goodsSample: ISampleGood[]) {
    return new Promise((resolve, reject) => {
      const filter = goodsSample.filter((good: any) => {
        if (good.restitutionStatus == 'APROBAR') return good;
      });

      if (filter.length > 0) {
        resolve(filter);
      } else {
        resolve(filter);
      }
    });
  }

  checkDeclineRes(goodsSample: ISampleGood[]) {
    return new Promise((resolve, reject) => {
      const filter = goodsSample.filter((good: any) => {
        if (good.restitutionStatus == 'RECHAZAR') return good;
      });

      if (filter.length > 0) {
        resolve(filter);
      } else {
        resolve(filter);
      }
    });
  }

  updateGoodSample(
    goodsSample: ISampleGood[],
    statusGood: string,
    statusRestitution: string
  ) {
    return new Promise((resolve, reject) => {
      goodsSample.map(good => {
        const goodData: ISampleGood = {
          sampleGoodId: good.sampleGoodId,
          goodStatus: statusGood,
          restitutionStatus: statusRestitution,
        };

        this.samplingGoodService.editSamplingGood(goodData).subscribe({
          next: () => {
            resolve(true);
          },
          error: () => {
            resolve(false);
          },
        });
      });
    });
  }

  save() {}

  getSearchForm(event: any) {
    this.filterObject = this.filterForm.value;
  }
}
