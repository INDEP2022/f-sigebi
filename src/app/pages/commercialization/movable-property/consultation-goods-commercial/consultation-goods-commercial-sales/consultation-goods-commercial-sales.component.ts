import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import { CONSUL_GOODS_COMMER_SALES_COLUMNS } from './consul-goods-commer-sales-columns';

import { addDays, subDays } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { ExcelService } from 'src/app/common/services/excel.service';
import { maxDate, minDate } from 'src/app/common/validations/date.validators';
import { IGoodCharge } from 'src/app/core/models/ms-good/good';
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
  goodControl = new FormControl<string>({ value: null, disabled: true });
  eventControl = new FormControl<string>({ value: null, disabled: true });
  selectedGood: any = null;
  eventTypes = new DefaultSelect();
  transferents = new DefaultSelect();
  delegations = new DefaultSelect();

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  newLimit = new FormControl(10);

  dataGoods = new LocalDataSource();

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

  //Funciones Grigork
  //Gets
  get goodNumber() {
    return this.form.get('goodNumber');
  }

  get descGood() {
    return this.form.get('descGood');
  }

  get expedientNumber() {
    return this.form.get('expedientNumber');
  }

  get serieNumber() {
    return this.form.get('serieNumber');
  }

  get mandate() {
    return this.form.get('mandate');
  }

  get descMandate() {
    return this.form.get('descMandate');
  }

  get lot() {
    return this.form.get('lot');
  }

  get rfc() {
    return this.form.get('rfc');
  }

  get eventId() {
    return this.form.get('eventId');
  }

  get descEvent() {
    return this.form.get('descEvent');
  }

  get eventTp() {
    return this.form.get('eventTp');
  }

  get desctTypeEvent() {
    return this.form.get('descTypeEvent');
  }

  get price() {
    return this.form.get('price');
  }

  get regc() {
    return this.form.get('regc');
  }

  get descord() {
    return this.form.get('descord');
  }

  get facture() {
    return this.form.get('facture');
  }

  get reference() {
    return this.form.get('reference');
  }

  get dateInit() {
    return this.form.get('dateInit');
  }

  get dateFinal() {
    return this.form.get('dateFinal');
  }

  get oi() {
    return this.form.get('oi');
  }

  //Limpiar Filtros
  cleanFilters() {
    this.form.reset();
    this.dataGoods.load([]);
    this.totalItems = 0;
  }

  //Ejecutar Consulta
  executeConsult() {
    let model: IGoodCharge = {};

    this.goodNumber.value != null
      ? (model.goodNumber = this.goodNumber.value)
      : '';
    this.descGood.value != null
      ? (model.descriptionGood = this.descGood.value)
      : '';
    this.expedientNumber.value != null
      ? (model.expedientNumber = this.expedientNumber.value)
      : '';
    this.serieNumber.value != null
      ? (model.serieNumber = this.serieNumber.value)
      : '';
    this.mandate.value != null ? (model.mandate = this.mandate.value) : '';
    //this.descMandate != null ? model. Descripción de mandato
    this.lot.value != null ? (model.lot = this.lot.value) : '';
    this.rfc.value != null ? (model.rfc = this.rfc.value) : '';
    this.eventId.value != null ? (model.eventId = this.eventId.value) : '';
    //Descripción del evento
    //Cliente
    this.eventTp.value != null ? (model.typeEvent = this.eventTp.value) : '';
    //Descripción de evento
    this.price.value != null ? (model.price = this.price.value) : '';
    this.oi.value != null ? (model.entryOrderId = this.oi.value) : '';
    this.regc.value != null ? (model.delegationNumber = this.regc.value) : '';
    //Descripción de delegación
    this.facture.value != null ? (model.invoice = this.facture.value) : '';
    this.reference.value != null
      ? (model.reference = this.reference.value)
      : '';
    this.dateInit.value != null ? (model.startDate = this.dateInit.value) : '';
    this.dateFinal.value != null ? (model.endDate = this.dateFinal.value) : '';

    console.log(model);

    this.goodService.chargeGoods(model).subscribe(
      res => {
        console.log(res);
        this.dataGoods.load(res.data);
        this.totalItems = res.count;
      },
      err => {
        console.log(err);
      }
    );
  }
}
