import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { format } from 'date-fns';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IGoodSpent } from 'src/app/core/models/ms-spent/good-spent.model';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodSpentService } from 'src/app/core/services/ms-spent/good-spent.service';
import { SpentService } from 'src/app/core/services/ms-spent/spent.service';
import { IChargeSpent } from 'src/app/core/services/ms-spent/spents-model';
import { CheckboxElementComponent } from 'src/app/shared/components/checkbox-element-smarttable/checkbox-element';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { isEmpty } from 'src/app/utils/validations/is-empty';
import { CommercialSpentForm } from '../../consultation-goods-commercial-process-tabs/utils/commercial-spents.form';
import { CONSULTATION_GOODS_BILLS_COLUMNS } from './consultation-goods-commercial-bills-columns';
@Component({
  selector: 'app-consultation-goods-commercial-bills',
  templateUrl: './consultation-goods-commercial-bills.component.html',
  styles: [],
})
export class ConsultationGoodsCommercialBillsComponent
  extends BasePage
  implements OnInit
{
  form = this.fb.group(new CommercialSpentForm());
  transferents = new DefaultSelect();
  data = new LocalDataSource();
  selectedRows: IGoodSpent[] = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  newLimit = new FormControl(10);

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private goodSpentService: GoodSpentService,
    private transferentService: TransferenteService,
    private spentService: SpentService
  ) {
    super();
    this.settings = {
      ...this.settings,
      columns: {
        select: {
          title: '',
          sort: false,
          type: 'custom',
          showAlways: true,
          valuePrepareFunction: (departament: any, row: any) =>
            this.isRowSelected(row),
          renderComponent: CheckboxElementComponent,
          onComponentInitFunction: (instance: CheckboxElementComponent) =>
            this.rowSelectChange(instance),
        },
        ...CONSULTATION_GOODS_BILLS_COLUMNS,
      },
      actions: false,
    };
  }

  isRowSelected(row: IGoodSpent) {
    const exists = this.selectedRows.find(
      _row => JSON.stringify(_row) == JSON.stringify(row)
    );
    if (!exists) return false;
    return true;
  }

  rowSelectChange(instance: CheckboxElementComponent) {
    instance.toggle.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: data => this.selectRow(data.row, data.toggle),
    });
  }

  selectRow(row: IGoodSpent, selected: boolean) {
    if (selected) {
      this.selectedRows.push(row);
    } else {
      this.selectedRows = this.selectedRows.filter(
        _row => JSON.stringify(row) != JSON.stringify(_row)
      );
    }
  }

  ngOnInit(): void {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: () => {
        if (this.isValid()) {
          this.getData();
        }
      },
    });
  }

  resetForm() {
    this.form.reset();
  }

  getData() {
    if (!this.isValid()) {
      this.onLoadToast(
        'warning',
        'Advertencia',
        'Debe especificar al menos un parametro de busqueda'
      );
      return;
    }

    this.goodSpentService
      .getGoodSpents(this.form.value, this.params.getValue())
      .subscribe({
        next: response => {
          this.data.load(response.data);
          this.totalItems = response.count;
        },
        error: error => {
          console.log(error);
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

  isValid() {
    const values = Object.values(this.form.value);
    const isValid = values.some(value => !isEmpty(value));
    return isValid;
  }

  exportSelected() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const filename = `Gastos_${today}`;
    const data = this.selectedRows.map(row => this.transFormColums(row));
    this.excelService.export(data, { filename });
  }

  exportAll() {}

  private transFormColums(row: any) {
    return {
      'No. SIAB': row.no_bien,
      Descripción: row.bien_descripcion,
      Expediente: row.no_expediente,
      Estatus: row.estatus,
      Cantidad: row.cantidad,
      Mandato: row.cvman,
      'Clave Transferente': row.no_transferente,
      'Sol. Pago': row.id_solicitudpago,
      Beneficiario: row.nombreprov,
      'Importe Gasto': row['?column?'],
      'No. Factura': row.no_factura_rec,
      'Fecha Factura': row.to_char,
      Solicita: row.nom_empl_solicita,
      Autorizó: row.nom_empl_autoriza,
      Capturó: row.nom_empl_captura,
    };
  }

  //Funciones agregadas por Grigork
  //Gets
  get good() {
    return this.form.get('good');
  }

  get beneficiary() {
    return this.form.get('beneficiary');
  }

  get mandate() {
    return this.form.get('mandate');
  }

  get descMandate() {
    return this.form.get('descMandate');
  }

  get paymentRequest() {
    return this.form.get('paymentRequest');
  }

  get invoice() {
    return this.form.get('invoice');
  }

  get importeF() {
    return this.form.get('importeF');
  }

  get folatenclie() {
    return this.form.get('folatenclie');
  }

  get concept() {
    return this.form.get('concept');
  }

  get descConcept() {
    return this.form.get('descConcept');
  }

  get capture() {
    return this.form.get('capture');
  }

  get request() {
    return this.form.get('request');
  }

  get authority() {
    return this.form.get('authority');
  }

  //Ejecutar consulta
  executeConsult() {
    let model: IChargeSpent = {};

    this.good.value != null ? (model.goodNumber = this.good.value) : '';
    this.beneficiary.value != null
      ? (model.beneficiary = this.beneficiary.value)
      : '';
    this.mandate.value != null ? (model.mandate = this.mandate.value) : '';
    //Descripción de mandato
    this.paymentRequest.value != null
      ? (model.paymentRequest = this.paymentRequest.value)
      : '';
    this.invoice.value != null ? (model.invoice = this.invoice.value) : '';
    // this.importeF.value != null ? model Importe Factura
    this.folatenclie.value != null
      ? (model.clientFolio = this.folatenclie.value)
      : '';
    this.concept.value != null ? (model.conceptId = this.concept.value) : '';
    //Descripción de concepto
    this.capture.value != null ? (model.userCaptured = this.capture.value) : '';
    this.request.value != null ? (model.userRequests = this.request.value) : '';
    this.authority.value != null
      ? (model.userAuthorize = this.authority.value)
      : '';

    if (Object.keys(model).length === 0) {
      this.alert(
        'warning',
        'Debe especificar al menos un parámetro de búsqueda',
        ''
      );
    } else {
      this.spentService.getChargeSpents(model).subscribe(
        res => {
          console.log(res);
          this.data.load(res.data);
          this.totalItems = res.count;
        },
        err => {
          this.alert(
            'error',
            'Se presentó un error inesperado al obtener los Bienes',
            ''
          );
          console.log(err);
          this.data.load([]);
          this.totalItems = 0;
        }
      );
    }
  }
}
