import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
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
import { ListRandomsComponent } from './list-randoms/list-randoms.component';

@Component({
  selector: 'app-change-goods-random',
  templateUrl: './change-goods-random.component.html',
  styles: [],
})
export class ChangeGoodsRandomComponent extends BasePage implements OnInit {
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private survillanceService: SurvillanceService,
    private sharedService: SharedService
  ) {
    super();
  }

  form: FormGroup;
  public delegations = new DefaultSelect();
  @Output() eventChangeGoodsRandom = new EventEmitter();
  @Output() DelegacionName = new EventEmitter();
  processes = [
    { value: 1, label: 'Supervisión' },
    { value: 2, label: 'Validación' },
  ];
  public procesess = new DefaultSelect(this.processes, 2);
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  delegationDefault: any = null;
  years: number[] = [];
  currentYear: number = new Date().getFullYear();
  periods = new DefaultSelect();
  randoms = new DefaultSelect();
  disabledPeriod: boolean = false;
  disabledRandom: boolean = false;
  data_: any;
  ngOnInit(): void {
    this.anio = this.currentYear;
    this.prepareForm();
    for (let i = 2010; i <= this.currentYear; i++) {
      this.years.push(i);
    }
    this.sharedService.setCurrentTab(3);
  }

  getFormChangeGoodsRandom() {
    return this.form;
  }

  onClickChangeGoodRandom() {
    console.log(this.form.value);
    this.form.value.delegation = this.delegationDefault.delegationNumber;

    const period = this.form.value.period;
    if (period.length > 6) {
      let per = period.toString().slice(0, 5);
      this.form.value.period = Number(per);
    }
    this.DelegacionName_();
    this.eventChangeGoodsRandom.emit(this.form.value);
  }

  prepareForm() {
    this.form = this.fb.group({
      year: [null, Validators.required],
      period: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      delegation: [null, Validators.required],
      process: [null, Validators.required],
      random: [null, Validators.required],
      goodNumber: [null, Validators.required],
      description: [null, [Validators.required]],
      transference: [null, Validators.required],
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

  openForm(objGetSupervionDet?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      objGetSupervionDet,
      callback: (next: any) => {
        console.log(next);

        // this.form.get('random').setValue(next.randomId);
        this.form.get('goodNumber').setValue(next.goodNumber);
        this.form.get('description').setValue(next.address);
        this.form.get('transference').setValue(next.transferee);
      },
    };
    this.modalService.show(ListRandomsComponent, modalConfig);
  }

  listBienes() {
    if (!this.form.value.year) {
      this.alert('warning', 'Debe seleccionar un año', '');
      return;
    }
    if (!this.delegationDefault) {
      this.alert('warning', 'Debe seleccionar una delegación', '');
      return;
    }
    if (!this.form.value.process) {
      this.alert('warning', 'Debe seleccionar un proceso', '');
      return;
    }
    if (!this.form.value.period) {
      this.alert('warning', 'Debe seleccionar un periodo', '');
      return;
    }
    let data = {
      delegationNumber: this.delegationDefault.delegationNumber,
      cveProcess: this.form.value.process,
      cvePeriod: this.form.value.period,
      delegationType: this.delegationDefault.typeDelegation,
    };

    this.getDataVIG_SUPERVISION_TMP(data);
  }

  async getDataVIG_SUPERVISION_TMP(data: any) {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
    };
    params['filter.delegationNumber'] = `$eq:${data.delegationNumber}`;
    params['filter.cveProcess'] = `$eq:${data.cveProcess}`;
    params['filter.cvePeriod'] = `$eq:${data.cvePeriod}`;
    params['filter.delegationType'] = `$eq:${data.delegationType}`;
    this.survillanceService.getVigSupervisionTmp(params).subscribe({
      next: async (response: any) => {
        const next = response.data[0];
        console.log('EDED2', response);

        if (response.count == 1) {
          // this.form.get('random').setValue(next.randomId);
          this.form.get('goodNumber').setValue(next.goodNumber);
          this.form.get('description').setValue(next.address);
          this.form.get('transference').setValue(next.transferee);
        } else {
          this.openForm(data);
        }
      },
      error: error => {
        this.alert('warning', 'No hay bienes disponibles', '');
        this.loading = false;
      },
    });
  }

  cleanForm() {
    this.anio = null;
    this.process = null;
    this.periodoSelecionado = null;
    this.disabledRandom = false;
    this.delegationDefault = null;
    this.disabledPeriod = false;
    this.periods = new DefaultSelect([], 0);
    this.form.reset();
    this.updateSharedVariable(null);
  }

  // -------------------------------------------------------------------------------------------------------------- //

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

  // FUNCION DE PERIODO //
  periodoSelecionado: any = null;
  obtenerNumero(event: any) {
    console.log('event', event);
    this.periodoSelecionado = event;
    if (event) {
      if (
        this.delegationDefault &&
        this.anio &&
        this.process &&
        this.periodoSelecionado
      ) {
        this.disabledRandom = true;
        this.form.get('random').setValue(null);
        let data = {
          delegationNumber: this.delegationDefault.delegationNumber,
          cveProcess: this.form.value.process,
          cvePeriod: this.form.value.period,
          delegationType: this.delegationDefault.typeDelegation,
        };

        this.data_ = data;
        this.getVigSupervisionDet_(new ListParams());
      } else {
        this.form.get('random').setValue(null);
        this.disabledRandom = false;
      }
    } else {
      this.disabledRandom = false;
      this.form.get('random').setValue(null);
    }
  }

  // FUNCION DE AÑO //
  anio: any;
  obtenerPeriodo(event: any) {
    this.anio = event;

    if (event) {
      if (this.delegationDefault && this.anio && this.process) {
        this.disabledPeriod = true;
        this.form.get('period').setValue(null);
        this.form.get('random').setValue(null);
        this.getPeriods(new ListParams());
      } else {
        this.form.get('period').setValue(null);
        this.form.get('random').setValue(null);
        this.disabledPeriod = false;
      }
    } else {
      this.form.get('period').setValue(null);
      this.form.get('random').setValue(null);
      this.disabledPeriod = false;
    }
  }

  // FUNCION DE PROCESO //
  process: any;
  obtenerPeriodoProcess(event: any) {
    console.log('process', event);
    this.process = event.value;
    if (event) {
      if (this.delegationDefault && this.anio && this.process) {
        this.disabledPeriod = true;
        this.form.get('period').setValue(null);
        this.form.get('random').setValue(null);
        this.getPeriods(new ListParams());
      } else {
        this.form.get('period').setValue(null);
        this.form.get('random').setValue(null);
        this.disabledPeriod = false;
      }
    } else {
      this.form.get('period').setValue(null);
      this.form.get('random').setValue(null);
      this.disabledPeriod = false;
    }
  }

  // FUNCION DE DELEGACION //
  changeDelegations(event: any) {
    this.delegationDefault = event;
    this.updateSharedVariable(event);
    if (event) {
      if (this.delegationDefault && this.anio && this.process) {
        this.disabledPeriod = true;
        this.form.get('period').setValue(null);
        this.form.get('random').setValue(null);
        this.getPeriods(new ListParams());
      } else {
        this.form.get('period').setValue(null);
        this.form.get('random').setValue(null);
        this.disabledPeriod = false;
      }
    } else {
      this.form.get('period').setValue(null);
      this.form.get('random').setValue(null);
      this.disabledPeriod = false;
    }
  }

  async getVigSupervisionDet_(lparams: ListParams) {
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
    }

    params.addFilter('perYear', this.form.value.year, SearchFilter.EQ);

    if (this.form.value.process != null) {
      params.addFilter('cveProcess', this.form.value.process, SearchFilter.EQ);
    }

    if (this.form.value.period != null) {
      params.addFilter('cvePeriod', this.form.value.period, SearchFilter.EQ);
    }

    if (lparams.text != '') {
      params.addFilter('randomId', lparams.text, SearchFilter.EQ);
    }

    this.survillanceService
      .getVigSupervisionDet_(params.getParams())
      .subscribe({
        next: async (response: any) => {
          console.log('EDED2', response);
          this.randoms = new DefaultSelect(response.data, response.count);
        },
        error: error => {
          this.randoms = new DefaultSelect([], 0, true);
          // this.alert('warning', 'No hay Registros en este Período', '');
        },
      });
  }

  seleccionarNumero(event: any) {}
  DelegacionName_() {
    return this.delegationDefault.description;
  }

  updateSharedVariable(value: any): void {
    this.sharedService.setSharedVariable(value);
  }
}
