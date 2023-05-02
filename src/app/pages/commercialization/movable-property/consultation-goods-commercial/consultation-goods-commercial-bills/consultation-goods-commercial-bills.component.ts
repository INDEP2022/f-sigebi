import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { format } from 'date-fns';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IGoodSpent } from 'src/app/core/models/ms-spent/good-spent.model';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodSpentService } from 'src/app/core/services/ms-spent/good-spent.service';
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
  params = new BehaviorSubject<ListParams>(new ListParams());
  transferents = new DefaultSelect();
  data: IGoodSpent[] = [];
  totalItems = 0;
  selectedRows: IGoodSpent[] = [];

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private goodSpentService: GoodSpentService,
    private transferentService: TransferenteService
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
          this.data = response.data;
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

  private transFormColums(row: IGoodSpent) {
    return {
      'No. SIAB': row.no_bien,
      Descripción: row.descripcion,
      Expediente: row.no_expediente,
      Estatus: row.estatus,
      Cantidad: row.cantidad,
      Mandato: row.cvman,
      'Clave Transferente': row.clave,
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
}
