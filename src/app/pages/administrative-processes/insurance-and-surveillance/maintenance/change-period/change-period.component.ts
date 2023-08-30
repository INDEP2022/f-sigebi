import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { POSITVE_NUMBERS_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { SharedService } from '../service/services';

@Component({
  selector: 'app-change-period',
  templateUrl: './change-period.component.html',
  styles: [],
})
export class ChangePeriodComponent extends BasePage {
  form = new FormGroup({
    year: new FormControl(null, Validators.required),
    period: new FormControl(null, Validators.required),
    delegation: new FormControl(null, Validators.required),
    process: new FormControl(null, [
      Validators.required,
      Validators.pattern(POSITVE_NUMBERS_PATTERN),
    ]),
    yearDestiny: new FormControl(null, Validators.required),
    periodDestiny: new FormControl(null, [
      Validators.required,
      Validators.pattern(POSITVE_NUMBERS_PATTERN),
    ]),
    delegationDestiny: new FormControl(null, Validators.required),
    processDestiny: new FormControl(null, Validators.required),
  });
  delegationDefault: any = null;
  processDefault: any = null;
  public delegations = new DefaultSelect();
  processes = [
    { value: 1, label: 'Supervisión' },
    { value: 2, label: 'Validación' },
  ];
  public procesess = new DefaultSelect(this.processes, 2);
  public procesess1 = new DefaultSelect(this.processes, 2);

  years: number[] = [];
  currentYear: number = new Date().getFullYear();

  // public delegations = new DefaultSelect();
  isLoading = false;
  @Output() eventChangePeriod = new EventEmitter();
  years2: number[] = [];
  currentYear2: number = new Date().getFullYear();
  maxDate: number = 2050;
  periods = new DefaultSelect();
  disabledPeriod: boolean = false;
  constructor(
    private survillanceService: SurvillanceService,
    private sharedService: SharedService
  ) {
    super();
  }

  ngOnInit(): void {
    this.anio = this.currentYear;
    for (let i = 2010; i <= this.currentYear; i++) {
      this.years.push(i);
    }
    // this.prepareForm();
    this.sharedService.setCurrentTab(2);
    this.dateDestino();
  }
  dateDestino() {
    // this.currentYear2 = this.anio;
    this.years2 = [];
    const aaa = this.currentYear2 - 1;
    for (let i = aaa; i <= this.currentYear2; i++) {
      // if (i == 2009) return;
      this.years2.push(i);
    }
  }

  // yearChange(event: any) {
  //   console.log(event);
  //   if (event) {
  //     this.form.get('period').setValue(null);
  //     this.maxDate = event;
  //     this.dateDestino();
  //     this.disabledPeriod = true;
  //     this.getPeriods(new ListParams());
  //   } else {
  //     this.form.get('period').setValue(null);
  //     this.disabledPeriod = false;
  //   }
  // }
  // prepareForm() {
  //   this.form = this.fb.group({
  //     year: [null, Validators.required],
  //     period: [null, Validators.required],
  //     delegation: [null, Validators.required],
  //     process: [null, Validators.required],
  //     yearDestiny: [null, Validators.required],
  //     periodDestiny: [null, Validators.required],
  //     delegationDestiny: [null, Validators.required],
  //     processDestiny: [null, Validators.required],
  //   });
  // }

  getFormChangePeriod() {
    return this.form;
  }

  changePeriod() {
    console.log(this.form.value);
    this.form.value.delegation = this.delegationDefault.delegationNumber;
    this.form.value.delegationDestiny = this.delegationDefault.delegationNumber;
    this.form.value.processDestiny = this.process;
    console.log(this.form.value);

    const period = this.form.value.period;
    if (period.length > 6) {
      let per = period.toString().slice(0, 5);
      this.form.value.period = Number(per);
    }

    const periodDestiny = this.form.value.periodDestiny;
    if (periodDestiny.length > 6) {
      let per = periodDestiny.toString().slice(0, 5);
      this.form.value.periodDestiny = Number(per);
    }

    this.eventChangePeriod.emit(this.form.value);
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

  // changeDelegations(event: any) {
  //   if (event) {
  //     this.form.get('delegationDestiny').setValue(event.numberAndDescrip);
  //   } else {
  //     this.form.get('delegationDestiny').setValue('');
  //   }
  //   this.delegationDefault = event;
  // }

  changeProcess(event: any) {
    if (event) {
      this.form.get('processDestiny').setValue(event.label);
    } else {
      this.form.get('processDestiny').setValue('');
    }
    this.processDefault = event;
  }

  public getDelegations(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  public getProcesess(event: any) {
    // this.bankService.getAll(params).subscribe(data => {
    //   this.banks = new DefaultSelect(data.data, data.count);
    // });
  }

  changePeriods(event: any) {}
  cleanForm() {
    this.disabledPeriod = false;
    this.periods = new DefaultSelect([], 0, true);
    this.delegationDefault = null;
    this.processDefault = null;
    this.form.reset();
    this.updateSharedVariable(null);
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

      params.addFilter('perYear', this.form.value.year, SearchFilter.EQ);

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
            this.periods = new DefaultSelect([], 0, true);
            this.loading = false;
            // this.alert('warning', 'No se Encontraron Períodos', '');
            resolve(null);
          },
        });
    });
  }

  // AGREGAR FECHAS //
  addDate(event: any) {
    console.log('event', event);
    if (event != null) {
    } else {
    }
  }

  anio: any;
  obtenerPeriodo(event: any) {
    this.anio = event;

    if (event) {
      // this.currentYear2 = event;
      // this.years2 = [];
      // const aaa = this.anio - 1;
      // for (let i = aaa; i <= this.anio; i++) {
      //   if (i >= 2010) {
      //     this.years2.push(i);
      //   }
      // }

      if (this.delegationDefault && this.anio && this.process) {
        this.disabledPeriod = true;
        this.form.get('period').setValue(null);
        this.getPeriods(new ListParams());
      } else {
        this.form.get('period').setValue(null);
        this.disabledPeriod = false;
      }
    } else {
      this.form.get('period').setValue(null);
      this.disabledPeriod = false;
    }
  }

  process: any;
  obtenerPeriodoProcess(event: any) {
    console.log('process', event);
    this.process = event.value;
    if (event) {
      this.form.get('processDestiny').setValue(event.label);
      if (this.delegationDefault && this.anio && this.process) {
        this.disabledPeriod = true;
        this.form.get('period').setValue(null);
        this.getPeriods(new ListParams());
      } else {
        this.form.get('period').setValue(null);
        this.disabledPeriod = false;
      }
    } else {
      this.form.get('processDestiny').setValue('');
      this.form.get('period').setValue(null);
      this.disabledPeriod = false;
    }
  }

  changeDelegations(event: any) {
    this.delegationDefault = event;
    this.updateSharedVariable(event);
    if (event) {
      this.form.get('delegationDestiny').setValue(event.numberAndDescrip);
      if (this.delegationDefault && this.anio && this.process) {
        this.disabledPeriod = true;
        this.form.get('period').setValue(null);
        this.getPeriods(new ListParams());
      } else {
        this.form.get('period').setValue(null);
        this.disabledPeriod = false;
      }
    } else {
      this.form.get('delegationDestiny').setValue('');
      this.form.get('period').setValue(null);
      this.disabledPeriod = false;
    }
  }

  limpiarPeriodo() {
    this.form.get('period').setValue(null);

    const periodDestiny = this.form.value.periodDestiny;
    if (periodDestiny.length > 6) {
      let per = periodDestiny.toString().slice(0, 5);
      this.form.get('period').setValue(Number(per));
    } else {
      this.form.get('period').setValue(Number(periodDestiny));
    }

    this.getPeriods(new ListParams());
  }

  updateSharedVariable(value: any): void {
    this.sharedService.setSharedVariable(value);
  }
}
