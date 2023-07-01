import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SURVEILLANCE_SERVICE_COLUMNS } from './surveillance-service-columns';

@Component({
  selector: 'app-surveillance-service',
  templateUrl: './surveillance-service.component.html',
  styles: [],
})
export class SurveillanceServiceComponent extends BasePage implements OnInit {
  form: FormGroup;
  formRegistro: FormGroup;
  goods: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  delegations = new DefaultSelect();
  delegationDefault: any = null;
  delegationMae: any = null;
  periods = new DefaultSelect();
  disabledPeriod: boolean = false;
  disabledProcess: boolean = false;
  constructor(
    private fb: FormBuilder,
    private delegationService: DelegationService,
    private survillanceService: SurvillanceService
  ) {
    super();
    this.settings.columns = SURVEILLANCE_SERVICE_COLUMNS;
    // this.settings.actions.delete = false;
  }

  async ngOnInit() {
    await this.prepareForm();
    await this.getDelegation(new ListParams());
  }

  async prepareForm() {
    this.form = this.fb.group({
      delegation: [null, Validators.required],
      process: [null, Validators.required],
      period: [null, Validators.required],
      from: [null],
      to: [null],
      total: [null],
    });

    this.formRegistro = this.fb.group({
      processTwo: [null],
      fromTwo: [null],
      toTwo: [null],
    });
  }

  // DELEGACIONES //
  async getDelegation(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    params.addFilter('description', lparams.text, SearchFilter.ILIKE);

    return new Promise((resolve, reject) => {
      this.survillanceService
        .getViewVigDelegations(params.getParams())
        .subscribe({
          next: async (response: any) => {
            console.log('resss', response);
            let result = response.data.map(async (item: any) => {
              item['numberAndDescrip'] =
                item.delegationNumber + ' - ' + item.description;
            });

            Promise.all(result).then(async (resp: any) => {
              this.delegations = new DefaultSelect(
                response.data,
                response.count
              );
              this.loading = false;
            });
          },
          error: error => {
            this.delegations = new DefaultSelect();
            this.loading = false;
            resolve(null);
          },
        });
    });
  }

  // SUPERVISION_MAE //
  async changeDelegations(event: any) {
    // LIMPIAMOS CAMPOS PARA REALIZAR NUEVAMENTE LA BÚSQUEDA //

    const params = new FilterParams();
    if (event) {
      this.disabledProcess = true;
      this.disabledPeriod = false;
      this.form.get('process').setValue(null);
      this.form.get('period').setValue(null);
      this.delegationDefault = event;
      params.addFilter(
        'delegationNumber',
        event.delegationNumber,
        SearchFilter.EQ
      );
    } else {
      this.disabledProcess = false;
      this.disabledPeriod = false;
      this.form.get('process').setValue(null);
      this.form.get('period').setValue(null);
    }
    //=======================================================//
    return new Promise((resolve, reject) => {
      this.survillanceService
        .getVigSupervisionMae(params.getParams())
        .subscribe({
          next: async (response: any) => {
            console.log('EDED', response);
            this.delegationMae = response.data[0];
            resolve(response.data[0]);
          },
          error: error => {
            this.loading = false;
            resolve(null);
          },
        });
    });
  }

  // CHANGE SELECT PROCESS //
  async cleanPeriod(event: any) {
    console.log('event', event);

    if (event === null) {
      this.disabledPeriod = false;
      this.form.get('period').setValue(null);
    } else {
      this.disabledPeriod = true;
      this.getPeriods(new ListParams());
    }
  }

  // PREPARATION OBJECT SEARCH SUPERVISIONDET //
  async searchSupervisionDet() {
    console.log(this.form);
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    let obj = {
      delegationNumber: this.delegationMae.delegationNumber,
      cveProcess: this.form.value.process,
      cvePeriod: this.form.value.period,
      delegationType: this.delegationMae.delegationType,
    };
    this.getVigSupervisionDet(obj);
  }

  // SUPERVISION_DET
  async getVigSupervisionDet(event: any) {
    const params = new FilterParams();

    params.addFilter(
      'delegationNumber',
      event.delegationNumber,
      SearchFilter.EQ
    );
    params.addFilter('cveProcess', event.cveProcess, SearchFilter.EQ);
    params.addFilter('cvePeriod', event.cvePeriod, SearchFilter.EQ);
    params.addFilter('delegationType', event.delegationType, SearchFilter.EQ);

    return new Promise((resolve, reject) => {
      this.survillanceService
        .getVigSupervisionDet(params.getParams())
        .subscribe({
          next: async (response: any) => {
            console.log('EDED2', response);
            this.goods.load(response.data);
            this.goods.refresh();
            this.totalItems = response.count;

            this.form.get('total').setValue(response.count);
            resolve(response.data);
          },
          error: error => {
            this.loading = false;
            resolve(null);
          },
        });
    });
  }

  // OBTENER PERIODOS //
  async getPeriods(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (this.delegationDefault != null) {
      params.addFilter(
        'delegationNumber',
        this.delegationDefault.delegationNumber,
        SearchFilter.EQ
      );
      params.addFilter(
        'delegationType',
        this.delegationDefault.typeDelegation,
        SearchFilter.EQ
      );

      if (this.form.value.process != null) {
        params.addFilter(
          'cveProcess',
          this.form.value.process,
          SearchFilter.EQ
        );
      }
    }

    if (lparams.text != '') {
      params.addFilter('cvePeriod', lparams.text, SearchFilter.EQ);
    }

    return new Promise((resolve, reject) => {
      this.survillanceService
        .getVigSupervisionMae(params.getParams())
        .subscribe({
          next: async (response: any) => {
            console.log('EDED2', response);

            this.periods = new DefaultSelect(response.data, response.count);
            resolve(response.data);
          },
          error: error => {
            this.periods = new DefaultSelect();
            this.loading = false;
            resolve(null);
          },
        });
    });
  }

  // AGREGAR FECHAS //
  addDate(event: any) {
    console.log('event', event);
    if (event != null) {
      this.form.get('from').setValue(event.initialDate);
      this.form.get('to').setValue(event.finalDate);
    } else {
      this.form.get('from').setValue(null);
      this.form.get('to').setValue(null);
    }
  }
  save() {
    console.log(this.form.value);
  }

  cleanForm() {
    this.disabledProcess = false;
    this.disabledPeriod = false;
    this.form.reset();
  }
}
