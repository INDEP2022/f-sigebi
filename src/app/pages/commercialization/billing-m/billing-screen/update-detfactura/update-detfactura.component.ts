import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BillingsService } from '../../services/services';

@Component({
  selector: 'app-update-detfactura',
  templateUrl: './update-detfactura.component.html',
  styles: [],
})
export class UpdateDetfacturaComponent extends BasePage implements OnInit {
  title = 'Actualizar Detalle de Factura';
  selectTabla1 = new DefaultSelect();
  selectTabla2 = new DefaultSelect();
  form: FormGroup;
  data: any;
  constructor(
    private billingsService: BillingsService,
    private modalRef: BsModalRef,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.form = this.fb.group({
      C_CLVPROSE: [null],
      C_UNIDMED: [null],
    });
    console.log('this.data', this.data);
    this.form.patchValue({
      C_CLVPROSE: this.data.prodservSatKey,
      C_UNIDMED: this.data.unitSatKey,
    });
  }

  close() {
    this.modalRef.hide();
  }

  async confirm() {
    console.log('this.form.value', this.form.value);
    this.data.prodservSatKey = this.form.value.C_CLVPROSE ?? null;
    this.data.unitSatKey = this.form.value.C_UNIDMED ?? null;
    // this.data['goodNumber'] = this.data.notGood;
    // this.data['Quantity'] = this.data.amount
    let obj = {
      billId: this.data.billId,
      eventId: this.data.eventId,
      detinvoiceId: this.data.detinvoiceId,
      prodservSatKey: this.form.value.C_CLVPROSE ?? null,
      unitSatKey: this.form.value.C_UNIDMED ?? null,
    };
    console.log(obj);
    const updateDateImp = await this.billingsService.updateDetBillings(obj);
    if (!updateDateImp)
      return this.alert(
        'error',
        'Ha ocurrido un error',
        'No se pudo actualizar el detalle de factura'
      );
    this.alert('success', 'Detalle de factura actualizada correctamente', '');
    this.modalRef.content.callback(true);
    this.close();
  }

  async getSelect1(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        params.addFilter('clave', lparams.text, SearchFilter.EQ);
      } else {
        params.addFilter('descripcion', lparams.text, SearchFilter.ILIKE);
      }
    const data: any = await this.billingsService.getKeyTable(
      params.getParams(),
      'C_CLVPROSE'
    );
    console.log('data1', data);
    if (!data) {
      this.selectTabla1 = new DefaultSelect();
    } else {
      this.selectTabla1 = new DefaultSelect(data.data, data.count);
    }
  }

  async getSelect2(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        params.addFilter('clave', lparams.text, SearchFilter.ILIKE);
      } else {
        params.addFilter('descripcion', lparams.text, SearchFilter.ILIKE);
      }
    const data: any = await this.billingsService.getKeyTable(
      params.getParams(),
      'C_UNIDMED'
    );
    console.log('data2', data);
    if (!data) {
      this.selectTabla2 = new DefaultSelect();
    } else {
      this.selectTabla2 = new DefaultSelect(data.data, data.count);
    }
  }
}
