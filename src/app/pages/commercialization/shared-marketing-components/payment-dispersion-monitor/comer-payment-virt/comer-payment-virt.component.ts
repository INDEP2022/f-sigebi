import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { FilterParams, ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared';
import { COLUMN_COMER } from './columns-comer';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-comer-payment-virt',
  templateUrl: './comer-payment-virt.component.html',
  styleUrls: [],
})
export class ComerPaymentVirtComponent extends BasePage implements OnInit {
  formVirt: FormGroup;

  data = new LocalDataSource();

  dataModel: any;

  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  settings1 = {
    ...TABLE_SETTINGS,
    columns: COLUMN_COMER,
    noDataMessage: 'No se Encontraron Registros',
  };

  constructor(
    private fb: FormBuilder,
    private comerPaymentService: PaymentService,
    private bsModel: BsModalRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    console.log(this.dataModel);
    this.fillAndGetData()
  }

  fillAndGetData(){
    this.formVirt.get('rfc').setValue(this.dataModel.rfc);
    this.formVirt.get('client').setValue(this.dataModel.client);
    this.formVirt.get('reference').setValue(this.dataModel.reference);
    this.formVirt.get('deposit').setValue(this.dataModel.amount);

    const paramsF = new FilterParams()
    paramsF.addFilter('payId', this.dataModel.idPayment)
    this.comerPaymentService.getComerPagoRefVirt(paramsF.getParams()).subscribe(
        res => {
            console.log(res)
            this.data = res.Data
            this.totalItems = res.count
        },
        err => {
            console.log(err)
            this.alert('warning','No hay Pagos para Desagregar','')
        }
    )
  }

  private prepareForm() {
    this.formVirt = this.fb.group({
      rfc: [null],
      client: [null],
      reference: [null],
      deposit: [null],
      penalty: [null],
      diferenceDeposit: [null],
      totalAmount: [null],
      totalPenalty: [null],
    });
  }

  //Cerrar modal
  close() {
    this.bsModel.hide();
  }

  timesToDivide(){
    
  }


  //gets
  get rfc() {
    return this.formVirt.get('rfc');
  }

  get client() {
    return this.formVirt.get('client');
  }

  get reference() {
    return this.formVirt.get('reference');
  }

  get deposit() {
    return this.formVirt.get('deposit');
  }

  get penalty() {
    return this.formVirt.get('penalty');
  }
}
