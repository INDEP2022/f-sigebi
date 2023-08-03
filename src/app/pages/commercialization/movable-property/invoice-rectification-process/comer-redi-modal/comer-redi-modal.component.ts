import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ComerDirectInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-detinvoice.service';
import { ComerInvoiceService } from 'src/app/core/services/ms-invoice/ms-comer-invoice.service';
import { RectifitationFieldsService } from 'src/app/core/services/ms-parameterinvoice/rectification-fields.service';

import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
@Component({
  selector: 'app-comer-redi-modal',
  templateUrl: './comer-redi-modal.component.html',
  styles: [],
})
export class ComerRediModalComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  allotment: any;
  factura: any;
  title: string = 'Detalle Factura';
  edit: boolean = false;
  fields: DefaultSelect = new DefaultSelect();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private retificationService: RectifitationFieldsService,
    private comerDirectInovice: ComerDirectInvoiceService,
    private comerInvoiceService: ComerInvoiceService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      year: [this.factura.year],
      notJob: [this.factura.jobNot],
      row: [null],
      invoicefield: [null, Validators.required],
      columnId: [null],
      worthCurrent: [null, Validators.pattern(STRING_PATTERN)],
      worthNew: [null, Validators.pattern(STRING_PATTERN)],
      nbOrigin: [null],
    });
    if (this.allotment != null) {
      this.edit = true;
      this.form.patchValue(this.allotment);
      const params = new ListParams();
      params[
        'filter.columnId'
      ] = `${SearchFilter.EQ}:${this.allotment.columnId}`;
      this.getFields(params);
    }
  }

  close() {
    this.modalRef.hide();
  }

  async saveData() {
    this.loading = true;
    if (this.edit) {
      this.comerDirectInovice.update(this.form.value).subscribe({
        next: () => {
          this.loading = false;
          this.modalRef.hide();
          this.modalRef.content.callback(true);
          this.alert('success', 'Detalle Factura', 'Actualizado correctamente');
        },
        error: () => {
          this.loading = false;
          this.alert(
            'error',
            'Error',
            'Ha ocurrido un error al guardar el Renglon'
          );
        },
      });
    } else {
      this.comerDirectInovice.create(this.form.value).subscribe({
        next: () => {
          this.loading = false;
          this.modalRef.hide();
          this.modalRef.content.callback(true);
          this.alert('success', 'Detalle Factura', 'Creado correctamente');
        },
        error: () => {
          this.loading = false;
          this.alert(
            'error',
            'Error',
            'Ha ocurrido un error al guardar el Renglon'
          );
        },
      });
    }
  }

  getFields(params?: ListParams) {
    if (params.text) {
      params['filter.invoiceFieldId'] = `${SearchFilter.ILIKE}:${params.text}`;
    }
    this.retificationService.getAll(params).subscribe({
      next: resp => {
        this.fields = new DefaultSelect(resp.data, resp.count);
      },
      error: () => {
        this.fields = new DefaultSelect();
      },
    });
  }

  changeField(data: any) {
    console.log(data);
    this.comerInvoiceService
      .executeSQL({
        eventId: Number(this.factura.eventId),
        invoiceField: data.invoiceFieldId,
        invoiceId: Number(this.factura.Invoice),
        table: data.table,
      })
      .subscribe({
        next: resp => {
          this.form.get('worthCurrent').patchValue(resp.data);
        },
      });
    this.form.get('columnId').patchValue(data.columnId);
  }
}
