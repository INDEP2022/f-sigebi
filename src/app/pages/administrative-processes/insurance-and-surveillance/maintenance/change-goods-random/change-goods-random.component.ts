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
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
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
    private survillanceService: SurvillanceService
  ) {
    super();
  }

  form: FormGroup;
  public delegations = new DefaultSelect();
  @Output() eventChangeGoodsRandom = new EventEmitter();
  processes = [
    { value: 1, label: 'Supervisión' },
    { value: 2, label: 'Validación' },
  ];
  public procesess = new DefaultSelect(this.processes, 2);
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  delegationDefault: any = null;
  years: number[] = [];
  currentYear: number = new Date().getFullYear();

  ngOnInit(): void {
    this.prepareForm();
    for (let i = 1900; i <= this.currentYear; i++) {
      this.years.push(i);
    }
  }

  getFormChangeGoodsRandom() {
    return this.form;
  }

  onClickChangeGoodRandom() {
    console.log(this.form.value);
    this.form.value.delegation = this.delegationDefault.delegationNumber;
    this.eventChangeGoodsRandom.emit(this.form.value);
  }

  prepareForm() {
    this.form = this.fb.group({
      year: [null, Validators.required],
      period: [null, Validators.required],
      delegation: [null],
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

        this.form.get('random').setValue(next.randomId);
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
    if (!this.form.value.period) {
      this.alert('warning', 'Debe seleccionar un periodo', '');
      return;
    }
    console.log('this.form.value.delegation', this.delegationDefault);
    if (!this.delegationDefault) {
      this.alert('warning', 'Debe seleccionar una delegación', '');
      return;
    }
    if (!this.form.value.process) {
      this.alert('warning', 'Debe seleccionar un proceso', '');
      return;
    }
    let data = {
      delegationNumber: this.delegationDefault.delegationNumber,
      cveProcess: this.form.value.process,
      cvePeriod: this.form.value.period,
      delegationType: this.delegationDefault.typeDelegation,
    };

    this.getVigSupervisionDet_(data);
  }

  async getVigSupervisionDet_(data: any) {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
    };
    // const params = new FilterParams();
    params['filter.delegationNumber'] = `$eq:${data.delegationNumber}`;
    params['filter.cveProcess'] = `$eq:${data.cveProcess}`;
    params['filter.cvePeriod'] = `$eq:${data.cvePeriod}`;
    params['filter.delegationType'] = `$eq:${data.delegationType}`;

    // return new Promise((resolve, reject) => {
    this.survillanceService.getVigSupervisionDet(params).subscribe({
      next: async (response: any) => {
        const next = response.data[0];
        console.log('EDED2', response);

        if (response.count == 1) {
          this.form.get('random').setValue(next.randomId);
          this.form.get('goodNumber').setValue(next.goodNumber);
          this.form.get('description').setValue(next.address);
          this.form.get('transference').setValue(next.transferee);
        } else {
          this.openForm(data);
        }

        // resolve(response.data);
      },
      error: error => {
        this.alert('warning', 'No hay registros en este período', '');
        // resolve(null);
      },
    });
    // });
  }

  changeDelegations(event: any) {
    this.delegationDefault = event;
  }
  cleanForm() {
    this.delegationDefault = null;
    this.form.reset();
  }
}
