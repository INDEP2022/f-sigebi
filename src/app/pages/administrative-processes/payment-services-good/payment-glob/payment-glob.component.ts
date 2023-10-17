import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { PaymentServicesService } from 'src/app/core/services/ms-paymentservices/payment-services.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';

@Component({
  selector: 'app-payment-glob',
  templateUrl: './payment-glob.component.html',
  styleUrls: ['./payment-glob.component.css'],
})
export class PaymentGlobComponent
  extends BasePageTableNotServerPagination
  implements OnInit
{
  form: FormGroup;
  ti_sum_global = 0;
  ti_fecha_global: Date = null;
  di_sum_avaluo = 0;
  constructor(
    private dataService: PaymentServicesService,
    private modalRef: BsModalRef,
    private fb: FormBuilder
  ) {
    super();
    this.prepareForm();
    this.haveInitialCharge = false;
  }

  override getData() {
    // let params = new FilterParams();
    // let params = this.getParams();
    // params.limit = 100000000;
    if (this.code.value) {
      this.dataService
        .inserGoodsReq({
          vcScreen: 'FACTADBPAGOSERVIC',
          service: this.code.value,
        })
        .pipe(take(1))
        .subscribe({
          next: response => {
            this.ti_sum_global = 0;
            this.di_sum_avaluo = 0;
            if (response && response.data && response.data.length > 0) {
              this.data = response.data.map((row: any) => {
                return { ...row };
              });
              this.data.forEach(x => {
                this.ti_sum_global += +x.amount;
                this.di_sum_avaluo += +x.amount2;
              });
              this.totalItems = this.data.length;
              this.dataTemp = [...this.data];
              this.getPaginated(this.params.value);
              this.loading = false;
            } else {
              this.notGetData();
            }
          },
          error: err => {
            this.notGetData();
          },
        });
    }
  }

  private prepareForm() {
    this.form = this.fb.group({
      code: [null, Validators.required],
    });
  }

  get code() {
    return this.form.get('code');
  }

  close() {
    this.modalRef.hide();
  }

  equivalent() {
    if (this.ti_sum_global === 0) {
      this.alert('warning', 'Debe capturar el importe a distribuir', '');
      return;
    }
    if (this.code.value === null) {
      this.alert('warning', 'Debe capturar el servicio', '');
      return;
    }
    if (this.data.length === 0) {
      this.alert('warning', 'Debe capturar al menos un bien', '');
      return;
    }
    let vn_parte = this.ti_sum_global / this.data.length;
    let vn_acum = 0;
    this.data.forEach((x, index) => {
      x.importe = vn_parte;
      vn_acum += vn_parte ? vn_parte : 0;
      if (index === this.data.length - 1) {
        if (this.ti_sum_global !== vn_acum) {
          x.importe = x.importe + this.ti_sum_global - vn_acum;
        }
      }
    });
    this.dataTemp = [...this.data];
    this.getPaginated(this.params.value);
  }

  proportional() {
    if (this.ti_sum_global === null) {
      this.alert('warning', 'Debe capturar el importe a distribuir', '');
      return;
    }
    if (this.code.value === null) {
      this.alert('warning', 'Debe capturar el servicio', '');
      return;
    }
    if (this.data.length === 0) {
      this.alert('warning', 'Debe capturar al menos un bien', '');
      return;
    }
    let vn_tot_aval = this.di_sum_avaluo;
    let vn_acum = 0;
    this.data.forEach((x, index) => {
      let vn_parte = x.di_valor_avaluo
        ? x.di_valor_avaluo
        : 0 + this.ti_sum_global / vn_tot_aval;
      x.importe = vn_parte;
      vn_acum += vn_parte ? vn_parte : 0;
      if (index === this.data.length - 1) {
        if (this.ti_sum_global !== vn_acum) {
          x.importe = x.importe + vn_acum - this.ti_sum_global;
        }
      }
    });
  }
}
