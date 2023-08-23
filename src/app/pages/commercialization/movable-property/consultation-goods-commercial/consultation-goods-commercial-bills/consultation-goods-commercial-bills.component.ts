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

  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  newLimit2 = new FormControl(10);

  modelSave2: any = null;

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
          title: 'Seleccionar',
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
    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe({
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
      this.alert(
        'warning',
        '',
        'Debe completar al menos un campo de búsqueda'
      );
      return;
    }

    this.goodSpentService
      .getGoodSpents(this.form.value, this.params2.getValue())
      .subscribe({
        next: response => {
          this.data.load(response.data);
          this.totalItems2 = response.count;
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
    if (this.selectedRows.length > 0) {
      const today = format(new Date(), 'yyyy-MM-dd');
      const filename = `Gastos_${today}`;
      const data = this.selectedRows.map(row => this.transFormColums(row));
      this.excelService.export(data, { filename });
    } else {
      this.alert('warning', 'No Seleccionó Ningun Registro', '');
    }
  }

  exportAll() {
    this.loading = true;
    console.log(this.modelSave2);
    if (this.modelSave2 != null) {
      this.spentService.getChargeSpentsExcel(this.modelSave2).subscribe(
        res => {
          this.downloadDocument('TODO_GASTOS', 'excel', res.base64File);
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
        'Debe completar al menos un campo de búsqueda',
        ''
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
    this.alert('success', 'Reporte Excel', 'Descarga Finalizada');
    this.loading = false;
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

  private transFormColums(row: any) {
    return {
      'No. Bien': row.no_bien,
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

  //Limpiar Filtros
  cleanFilters() {
    this.form.reset();
    this.data.load([]);
    this.totalItems2 = 0;
    this.modelSave2 = null;
  }

  //Ejecutar consulta
  executeConsult() {
    this.loading = true;

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

    this.modelSave2 = model;

    if (Object.keys(model).length === 0) {
      this.alert(
        'warning',
        'Debe completar al menos un campo de búsqueda',
        ''
      );
      this.loading = false;
    } else {
      this.spentService.getChargeSpents(model).subscribe(
        res => {
          console.log(res);
          this.data.load(res.data);
          this.totalItems2 = res.count;
          this.loading = false;
        },
        err => {
          this.alert(
            'error',
            'Se presentó un error inesperado al obtener los Bienes',
            ''
          );
          console.log(err);
          this.data.load([]);
          this.totalItems2 = 0;
          this.loading = false;
        }
      );
    }
  }
}
