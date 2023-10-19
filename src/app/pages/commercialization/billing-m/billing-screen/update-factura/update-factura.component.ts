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
  selector: 'app-update-factura',
  templateUrl: './update-factura.component.html',
  styles: [],
})
export class UpdateFacturaComponent extends BasePage implements OnInit {
  title = 'Actualizar Factura';
  selectTabla1 = new DefaultSelect();
  selectTabla2 = new DefaultSelect();
  selectTabla3 = new DefaultSelect();
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
      RG_TIPO_REL: [null],
      RG_USO_COM: [null],
      RG_F_PAGO: [null],
    });
    console.log('this.data', this.data);
    this.form.patchValue({
      RG_TIPO_REL: this.data.relationshipSatType,
      RG_USO_COM: this.data.usecompSat,
      RG_F_PAGO: this.data.paymentformBsat,
    });
  }

  close() {
    this.modalRef.hide();
  }

  async confirm() {
    console.log('this.form.value', this.form.value);
    let obj = {
      billId: this.data.billId,
      eventId: this.data.eventId,
      relationshipSatType: this.form.value.RG_TIPO_REL ?? null,
      usecompSat: this.form.value.RG_USO_COM ?? null,
      paymentformBsat: this.form.value.RG_F_PAGO ?? null,
    };
    console.log(obj);
    const updateDateImp = await this.billingsService.updateBillings(obj);
    if (!updateDateImp)
      return this.alert(
        'error',
        'Ha ocurrido un error',
        'No se pudo actualizar la factura'
      );
    this.alert('success', 'Factura actualizada correctamente', '');
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
      'C_TIPO_REL'
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
      'C_USO_COM'
    );
    console.log('data2', data);
    if (!data) {
      this.selectTabla2 = new DefaultSelect();
    } else {
      this.selectTabla2 = new DefaultSelect(data.data, data.count);
    }
  }

  async getSelect3(lparams: ListParams) {
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
      'C_F_PAGO'
    );
    console.log('data3', data);
    if (!data) {
      this.selectTabla3 = new DefaultSelect();
    } else {
      this.selectTabla3 = new DefaultSelect(data.data, data.count);
    }
  }
}
