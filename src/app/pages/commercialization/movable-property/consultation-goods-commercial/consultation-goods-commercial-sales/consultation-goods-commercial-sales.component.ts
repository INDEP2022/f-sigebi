import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

import {
  CONSUL_GOODS_COMMER_SALES_COLUMNS,
  goodCheck,
} from './consul-goods-commer-sales-columns';

import { addDays, format, subDays } from 'date-fns';
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
  goodCheck: any;
  modelSave: any;

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

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(params => {
      console.log(params);
      console.log(this.dataGoods['data'].length);
      if (this.dataGoods['data'].length > 0) {
        this.executeConsult('pag');
      }
    });
  }

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
    this.modelSave = null;
  }

  //Exportar select excel
  exportSelected() {
    if (goodCheck.length > 0) {
      console.log('Entra');
      const today = format(new Date(), 'yyyy-MM-dd');
      const filename = `Ventas_${today}`;
      const data = goodCheck.map((row: any) => this.transFormColums(row));
      this.excelService.export(data, { filename });
    } else {
      this.alert('warning', 'No Seleccionó ningún Registro', '');
    }
  }

  private transFormColums(row: any) {
    return {
      Evento: row.evento_comer_eventos,
      Lote: row.lote_publico,
      Expediente: row.no_expediente,
      'No. Bien': row.no_bien,
      Cantidad: row.cantidad,
      'Evento Comer': row.evento_comer_eventos,
      'Lote Comer': row.lote_publico,
      Estatus: row.estatus,
      Mandato: row.cvman,
      'Precio Bien': row.precio_final_bienes_x_lote,
      'Precio Lote': row.precio_final_comer_lotes,
      Serie: '',
      Cliente: '',
      OI: row.idordeningreso,
      Factura: row.no_factura,
      'Fecha Factura': row.fecha_factura,
      'Coordinación Captura': row.descripcion_delegacion,
      'Coordinación Administra': row.descripcion_delegacion,
      'Referencia Garantía': row.referenciag,
      'Referencia Liquidación': row.referencial,
      Ubicación: '',
    };
  }

  //Exportar Excel todo
  exportAll() {
    this.loading = true;
    if (this.modelSave != null) {
      this.goodService.chargeGoodsExcel(this.modelSave).subscribe(
        res => {
          this.downloadDocument('TODO_VENTAS', 'excel', res.base64File);
        },
        err => {
          this.loading = false;
          console.log(err);
        }
      );
    } else {
      this.loading = false;
      this.alert(
        'warning',
        'Debe especificar al menos un parámetro de búsqueda',
        ''
      );
    }
  }

  //Ejecutar Consulta
  executeConsult(procedence: string) {
    this.loading = true;
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
    this.modelSave = model;

    if (Object.keys(model).length === 0) {
      this.alert(
        'warning',
        'Debe especificar al menos un parámetro de búsqueda',
        ''
      );
      this.loading = false;
    } else {
      const paramsF = new FilterParams();
      if (procedence != 'pag') {
        this.params.value.page = 1;
        this.params.value.limit = 10;
      }
      paramsF.page = this.params.value.page;
      paramsF.limit = this.params.value.limit;

      this.goodService.chargeGoods(model, paramsF.getParams()).subscribe(
        res => {
          console.log(res);
          this.dataGoods.load(res.data);
          this.totalItems = res.count;
          this.loading = false;
        },
        err => {
          this.alert(
            'error',
            'Se presentó un error inesperado al obtener los Bienes',
            ''
          );
          this.dataGoods.load([]);
          this.totalItems = 0;
          this.modelSave = null;
          this.loading = false;
          console.log(err);
        }
      );
    }
  }

  //Descargar Excel
  downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    console.log(this.form.value);
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('xls', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    this.loading = false;
    this.alert('success', 'Reporte Excel', 'Descarga Finalizada');
    URL.revokeObjectURL(objURL);
  }

  base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
