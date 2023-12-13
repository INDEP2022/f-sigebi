import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IDeductiveVerification } from 'src/app/core/models/catalogs/deductive-verification.model';
import { ISample } from 'src/app/core/models/ms-goodsinv/sample.model';
import { ISamplingDeductive } from 'src/app/core/models/ms-sampling-good/sampling-deductive.model';
import { DeductiveVerificationService } from 'src/app/core/services/catalogs/deductive-verification.service';
import { SamplingGoodService } from 'src/app/core/services/ms-sampling-good/sampling-good.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { BasePage, TABLE_SETTINGS } from '../../../../../core/shared/base-page';
import { LIST_DEDUCTIVES_COLUMNS } from '../../sampling-assets/sampling-assets-form/columns/list-deductivas-column';

@Component({
  selector: 'app-deposit-payment-validations',
  templateUrl: './payment-validations.component.html',
  styles: [],
})
export class PaymentValidationsComponent extends BasePage implements OnInit {
  title: string = `Validación de pagos de avalúo ${302}`;
  showFilterAssets: boolean = true;
  showSamplingDetail: boolean = true;
  willSave: boolean = false;
  sampleInfo: ISample;
  idSample: number = 302;
  filterForm: ModelForm<any>;
  loadingDeductives: boolean = false;
  paragraphsDeductivas = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  filterObject: any;
  allDeductives: IDeductiveVerification[] = [];
  constructor(
    private samplingGoodService: SamplingGoodService,
    private fb: FormBuilder,
    private deductiveService: DeductiveVerificationService
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

  getSearchForm(event: any) {
    this.filterObject = this.filterForm.value;
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
