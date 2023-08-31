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
  selector: 'app-delete-period',
  templateUrl: './delete-period.component.html',
  styles: [],
})
export class DeletePeriodComponent extends BasePage {
  delegationField: string = '';
  get delegation() {
    return this.form.get('delegation');
  }
  form = new FormGroup({
    year: new FormControl(null, Validators.required),
    period: new FormControl(null, [
      Validators.required,
      Validators.pattern(POSITVE_NUMBERS_PATTERN),
    ]),
    delegation: new FormControl(null, Validators.required),
    process: new FormControl(null, Validators.required),
  });
  processes = [
    { value: 1, label: 'Supervisión' },
    { value: 2, label: 'Validación' },
  ];
  public procesess = new DefaultSelect(this.processes, 2);
  public delegations = new DefaultSelect();

  isLoading = false;
  delegationDefault: any = null;
  @Output() eventDelete = new EventEmitter();

  years: number[] = [];
  currentYear: number = new Date().getFullYear();
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
    this.sharedService.setCurrentTab(1);
    // this.prepareForm();
  }

  onClickDeletePeriod() {
    if (!this.delegationDefault) {
      this.form.markAsTouched();
      this.alert('warning', 'Debe seleccionar una delegación', '');
    }

    const period = this.form.value.period;
    if (period.length > 6) {
      let per = period.toString().slice(0, 5);
      this.form.value.period = Number(per);
    }

    this.form.value.delegation = this.delegationDefault.delegationNumber;
    this.eventDelete.emit(this.form.value);
  }

  getFormDeletePeriod() {
    return this.form;
  }

  onClickDeletePeriod2() {
    console.log('SIII');
  }

  // DELEGACIONES //
  async getDelegation(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams?.text)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('delegationNumber', lparams.text, SearchFilter.EQ);
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        console.log('NO');

        params.addFilter('description', lparams.text, SearchFilter.ILIKE);
        // params.addFilter('cve_banco', lparams.text);
      }
    params.sortBy = `delegationNumber:ASC`;
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
            // this.alert('warning', 'No se Encontraron Períodos', '');

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
    } else {
    }
  }

  anio: any;
  obtenerPeriodo(event: any) {
    this.anio = event;

    if (event) {
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

  changeDelegations(event: any) {
    this.delegationDefault = event;
    this.updateSharedVariable(event);
    if (event) {
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

  cleanForm() {
    this.anio = null;
    this.process = null;
    this.disabledPeriod = false;
    this.periods = new DefaultSelect([], 0);
    this.delegationDefault = null;
    this.form.reset();
    this.updateSharedVariable(null);
  }

  limpiarPeriodo() {
    this.form.get('period').setValue(null);
    this.getPeriods(new ListParams());
  }

  updateSharedVariable(value: any): void {
    this.sharedService.setSharedVariable(value);
  }
}
