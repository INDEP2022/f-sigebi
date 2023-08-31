import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared';
import { CanTimesComponent } from '../can-times/can-times.component';
import { NewComerPaymentVirt } from '../new-comer-payment-virt/new-comer-payment-virt.component';
import { COLUMN_COMER } from './columns-comer';

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

  actionsBool: boolean;

  dataPaymentVirt: any;

  settings1 = {
    ...TABLE_SETTINGS,
    columns: COLUMN_COMER,
    actions: false,
    noDataMessage: 'No se Encontraron Registros',
  };

  constructor(
    private fb: FormBuilder,
    private comerPaymentService: PaymentService,
    private bsModel: BsModalRef,
    private comerLotsService: LotService,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
    console.log(this.dataModel);
    this.fillAndGetData();

    if (
      this.dataModel.incomeOrderId != null ||
      this.dataModel.date > this.dataModel.dateMaxPay
    ) {
      console.log(false);
      this.actionsBool = false;
      this.settings1 = {
        ...TABLE_SETTINGS,
        columns: COLUMN_COMER,
        actions: false,
        noDataMessage: 'No se Encontraron Registros',
      };
    } else {
      console.log(true);
      this.actionsBool = true;
      this.settings1 = {
        ...TABLE_SETTINGS,
        columns: COLUMN_COMER,
        actions: true,
        noDataMessage: 'No se Encontraron Registros',
      };
    }

    this.formVirt.get('diferenceDeposit').setValue(this.dataModel.amount - this.formVirt.get('totalAmount').value)
  }

  fillAndGetData() {
    this.formVirt.get('rfc').setValue(this.dataModel.rfc);
    this.formVirt.get('client').setValue(this.dataModel.client);
    this.formVirt.get('reference').setValue(this.dataModel.reference);
    this.formVirt.get('deposit').setValue(this.dataModel.amount);
    this.formVirt.get('penalty').setValue(this.dataModel.penaltyAmount);
    this.loading = true;

    const paramsF = new FilterParams();
    paramsF.addFilter('payId', this.dataModel.idPayment);
    this.comerPaymentService.getComerPagoRefVirt(paramsF.getParams()).subscribe(
      async res => {
        console.log(res);
        let amount = 0
        let penalty = 0
        for(let item of res.data){
          amount += parseFloat(item.amount)
          penalty += parseFloat(item.amountGrief)
          console.log(amount)
          this.formVirt.get('totalAmount').setValue(amount)
          this.formVirt.get('totalPenalty').setValue(penalty)
        } 


        const newData = await Promise.all(
          res.data.map(async (e: any) => {
            const resp = await this.fillExtraData(e.batchId);
            const respJson = JSON.parse(JSON.stringify(resp));
            return {
              ...e,
              publicBatch: respJson.publicBatch,
              description: respJson.description,
            };
          })
        );
        console.log(newData);
        this.data.load(newData);
        this.totalItems = res.count;
        this.loading = false;
      },
      err => {
        this.loading = false;
        console.log(err);
        this.data.load([]);
        this.totalItems = 0;
        this.alert('warning', 'No hay Pagos para Desagregar', '');
      }
    );
  }

  private prepareForm() {
    this.formVirt = this.fb.group({
      rfc: [null],
      client: [null],
      reference: [null],
      deposit: [null],
      penalty: [null],
      diferenceDeposit: [0],
      totalAmount: [0],
      totalPenalty: [0],
    });
  }

  //Agregar valores
  fillExtraData(idLote: any) {
    return new Promise((resolve, reject) => {
      const paramsF = new FilterParams();
      paramsF.addFilter('idLot', idLote);
      this.comerLotsService
        .getAllComerLotsFilter(paramsF.getParams())
        .subscribe(
          res => {
            console.log(res);
            console.log(res.data[0]);
            const data = res.data[0];
            resolve({
              description: data.description,
              publicBatch: data.lotPublic,
            });
          },
          err => {
            resolve({ description: 'NO ENCONTRADO', publicBatch: null });
          }
        );
    });
  }

  //SELECCIONAR FILA
  selectRow(e: any) {
    console.log(e.data);
    this.dataPaymentVirt = e.data;
  }

  //Cerrar modal
  close() {
    this.bsModel.content.callback('Hola');
    this.bsModel.hide();
  }

  //Open Modal Dividir
  timesToDivide() {
    if(this.dataPaymentVirt != null){
      let incomeData = this.dataPaymentVirt;
      let modalConfig = MODAL_CONFIG;
      modalConfig = {
        initialState: {
          incomeData,
          callback: (data: any) => {
            console.log(data);
            const newData = this.data['data'].concat(data);
            this.data.load(newData);
          },
        },
        class: 'modal-dialog-centered',
        ignoreBackdropClick: true,
      };
  
      this.modalService.show(CanTimesComponent, modalConfig);
    }else{
      this.alert('warning','Debe Seleccionar un Registro','')
    }
    
  }

  //Open Modal New
  newPayment() {
    let incomeData = {
      eventId: this.dataModel.eventId,
      clientId: this.dataModel.customerBatch,
    };
    let modalConfig = MODAL_CONFIG;
    modalConfig = {
      initialState: {
        incomeData,
        callback: (data: any) => {
          console.log(data);
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };

    this.modalService.show(NewComerPaymentVirt, modalConfig);
  }

  //Delete Payment
  deletePayment() {
    if (this.dataPaymentVirt != null) {
      if (this.dataModel.incomeOrderId == null) {
        if (this.dataPaymentVirt.payId != null) {
        } else {
          this.alert('warning', 'El Registro tiene un Id de Pago Nulo', '');
        }
      } else {
        this.alert('warning', 'El Registro tiene un Id de Orden de Ingreo', '');
      }
    } else {
      this.alert('warning', 'No se Seleccionaron Pagos', '');
    }
  }

  //Función de Eliminar
  deleteFn() {}

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
