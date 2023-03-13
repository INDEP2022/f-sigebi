import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import { CONSUL_GOODS_COMMER_SALES_COLUMNS } from './consul-goods-commer-sales-columns';

import { addDays, subDays } from 'date-fns';
import { ExcelService } from 'src/app/common/services/excel.service';
import { maxDate, minDate } from 'src/app/common/validations/date.validators';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { ComerSaleService } from 'src/app/core/services/ms-comersale/comer-sale.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { ComerTpEventosService } from 'src/app/core/services/ms-event/comer-tpeventos.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { CommercialSalesForm } from '../../consultation-goods-commercial-process-tabs/utils/commercial-sales-form';

@Component({
  selector: 'app-consultation-goods-commercial-sales',
  templateUrl: './consultation-goods-commercial-sales.component.html',
  styles: [],
})
export class ConsultationGoodsCommercialSalesComponent
  extends BasePage
  implements OnInit
{
  form = new FormGroup(new CommercialSalesForm());
  params = new BehaviorSubject<ListParams>(new ListParams());
  goodControl = new FormControl<string>({ value: null, disabled: true });
  eventControl = new FormControl<string>({ value: null, disabled: true });
  totalItems: number = 0;
  selectedGood: any = null;
  eventTypes = new DefaultSelect();
  transferents = new DefaultSelect();
  delegations = new DefaultSelect();

  get controls() {
    return this.form.controls;
  }

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private comerSaleService: ComerSaleService,
    private goodService: GoodService,
    private comerEventService: ComerEventosService,
    private comerTypeEventService: ComerTpEventosService,
    private transferentService: TransferenteService,
    private delegationService: DelegationService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...CONSUL_GOODS_COMMER_SALES_COLUMNS },
    };
  }

  ngOnInit(): void {}

  getData() {
    this.loading = true;
    this.comerSaleService.getGoodSales(this.form.value).subscribe({
      next: response => {
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  getGood() {
    const goodId = this.controls.goodNumber.value;
    if (!goodId) {
      this.resetGoodCtrl();
      return;
    }
    this.goodService.getById(goodId).subscribe({
      next: good => {
        this.goodControl.setValue(good.description);
      },
      error: error => {
        this.resetGoodCtrl();
        if (error.status > 0 && error.status <= 404) {
          this.onLoadToast('error', 'Error', 'El bien no existe');
        }
      },
    });
  }

  resetGoodCtrl() {
    this.goodControl.reset();
    this.controls.goodNumber.setValue(null);
  }

  resetEventCtrl() {
    this.eventControl.reset();
    this.controls.eventId.setValue(null);
  }

  resetForm() {
    this.form.reset();
    this.resetGoodCtrl();
    this.resetEventCtrl();
  }

  getEvent() {
    const eventId = this.controls.eventId.value;
    if (!eventId) {
      this.resetEventCtrl();
      return;
    }
    this.comerEventService.getById(eventId).subscribe({
      next: event => {
        this.eventControl.setValue(event.processKey);
      },
      error: error => {
        this.resetEventCtrl();
        if (error.status > 0 && error.status <= 404) {
          this.onLoadToast('error', 'Error', 'El evento no existe');
        }
      },
    });
  }

  getEventTypes(params: ListParams) {
    this.comerTypeEventService.getAll(params).subscribe({
      next: response => {
        this.eventTypes = new DefaultSelect(response.data, response.count);
      },
      error: () => {
        this.onLoadToast(
          'error',
          'Error',
          'Ocurrio un error al obtener los tipos de evento'
        );
      },
    });
  }

  getTransferent(params: ListParams) {
    this.transferentService.getAll(params).subscribe({
      next: response => {
        this.transferents = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        if (error.status > 0 && error.status <= 404) {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio un error al obtener los transferentes'
          );
        }
      },
    });
  }

  getDelegations(params: ListParams) {
    this.delegationService.getAll(params).subscribe({
      next: response => {
        this.delegations = new DefaultSelect(response.data, response.count);
      },
      error: error => {
        if (error.status > 0 && error.status <= 404) {
          this.onLoadToast(
            'error',
            'Error',
            'Ocurrio un error al obtener las delegaciones'
          );
        }
      },
    });
  }

  fromDateChange(date: Date) {
    const toDateCtrl = this.controls.dateFinal;
    toDateCtrl.clearValidators();
    if (date) {
      const min = addDays(date, 1);
      toDateCtrl.addValidators(minDate(min));
    }
    toDateCtrl.updateValueAndValidity();
  }

  toDateChange(date: Date) {
    const fromDateCtrl = this.controls.dateInit;
    fromDateCtrl.clearValidators();
    if (date) {
      const min = subDays(date, 1);
      fromDateCtrl.addValidators(maxDate(min));
    }
    fromDateCtrl.updateValueAndValidity();
  }
}
