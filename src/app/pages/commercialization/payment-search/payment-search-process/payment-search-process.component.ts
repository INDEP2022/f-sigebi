import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-payment-search-process',
  templateUrl: './payment-search-process.component.html',
  styles: [],
})
export class PaymentSearchProcessComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  LV_DESC_BUSQUEDA: string;
  LV_MSG_PROCESO: string;
  LV_EST_PROCESO: number;
  LV_WHERE: string;
  data: any;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private msDepositaryService: MsDepositaryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    if (this.data != null) {
      console.log('this.data ', this.data);
    }
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      process: [null, [Validators.required]],
    });
  }

  close() {
    this.modalRef.hide();
  }

  paymentProcess(idSearch: number, newSearch: any) {
    this.msDepositaryService
      .getSearchPaymentProcess(idSearch, newSearch)
      .subscribe({
        next: resp => {
          if (resp != null && resp != undefined) {
            console.log('Resp PaymentProcess-> ', resp);
            this.LV_MSG_PROCESO = resp.msgProcess;
            this.LV_EST_PROCESO = resp.estProcess;
            console.log('LV_MSG_PROCESO->', resp.msgProcess);
            console.log('LV_EST_PROCESO->', resp.estProcess);
            this.alert('success', 'Cambiar Proceso', this.LV_MSG_PROCESO);
            this.modalRef.content.callback(newSearch);
            this.modalRef.hide();
          } else {
            this.alert(
              'warning',
              'Cambiar Proceso',
              'No se encontro data válida para realizar el cambio'
            );
          }
        },
        error: err => {
          this.LV_MSG_PROCESO = err.error.message;
          this.LV_EST_PROCESO = 0;
          this.alert('warning', 'Cambiar Proceso', this.LV_MSG_PROCESO);
        },
      });
  }

  execute() {
    if (!null) {
      console.log('this.data-> ', this.data);
      let process = this.form.get('process').value;
      if (process != null) {
        if (process == 0) {
          this.LV_DESC_BUSQUEDA = 'pagos realizados';
        } else if (process == 1) {
          this.LV_DESC_BUSQUEDA = 'pagos duplicados';
        } else if (process == 2) {
          this.LV_DESC_BUSQUEDA = 'pagos no referenciados';
        } else if (process == 3) {
          this.LV_DESC_BUSQUEDA = 'pagos en efectivo';
        } else if (process == 4) {
          this.LV_DESC_BUSQUEDA = 'pagos iconsistente';
        }
      } else {
        this.alert('warning', 'Error', 'Error');
      }
      this.alertQuestion(
        'question',
        'Cambiar Proceso',
        '¿Esta seguro de cambiar las referencias a ' +
          this.LV_DESC_BUSQUEDA +
          ' ?'
      ).then(async question => {
        if (question.isConfirmed) {
          this.paymentProcess(this.data, this.form.get('process').value);
        }
      });
    }
  }
}
