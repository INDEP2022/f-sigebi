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
  id_tipo_disp: any;
  address: any;
  restore: any;
  montoTolat: any;
  montoPena: any;
  eventTpId: any;
  restoreNumber = 0;
  deletedNumber = 0;
  dateWarrantyLiq: any;
  lote_publico: any;

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

  position: any = null;

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
    console.log(this.id_tipo_disp);
    console.log(this.eventTpId);
    console.log(this.address);
    console.log(this.lote_publico);
    console.log(this.dataModel);
    console.log(this.dateWarrantyLiq);
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
        actions: true,
        noDataMessage: 'No se Encontraron Registros',
      };
    } else {
      console.log(true);
      this.actionsBool = true;
      this.settings1 = {
        ...TABLE_SETTINGS,
        columns: COLUMN_COMER,
        actions: false,
        noDataMessage: 'No se Encontraron Registros',
      };
    }
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
        let amount = 0;
        let penalty = 0;
        for (let item of res.data) {
          amount += parseFloat(item.amount);
          penalty += parseFloat(item.amountGrief);
          console.log(amount);
          this.formVirt.get('totalAmount').setValue(amount);
          this.formVirt.get('totalPenalty').setValue(penalty);

          this.formVirt
            .get('diferenceDeposit')
            .setValue(
              this.dataModel.amount - this.formVirt.get('totalAmount').value
            );
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
        this.restoreFuntion();
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
  restoreFuntion() {
    console.log('----------------------', this.restoreNumber, this.restore);
    if (this.restoreNumber == 0) {
      this.restore = this.data['data'];
      this.restoreNumber++;
      console.log('----------------------', this.restoreNumber, this.restore);
    }
  }
  calcularMonto(amount: number) {
    console.log(this.data['data'].length);
    let monto = 0;
    let nuevoMonto = 0;
    for (let i = 0; i < this.data['data'].length; ++i) {
      monto += JSON.parse(this.data['data'][i].amount);
    }
    console.log(monto, this.data['data'].length, amount);
    monto += amount;
    nuevoMonto = monto / this.data['data'].length;
    console.log(nuevoMonto);
    for (let i = 0; i < this.data['data'].length; ++i) {
      this.data['data'][i].amount = JSON.stringify(nuevoMonto.toFixed(2));
    }
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
      console.log(paramsF.getParams());
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
    if (e.data.position) {
      this.position = e.data.position;
      this.actionsBool = true;
    } else {
      this.position = null;
      this.actionsBool = false;
    }
    this.dataPaymentVirt = e.data;
  }

  //Cerrar modal
  close() {
    this.bsModel.content.callback('Hola');
    this.bsModel.hide();
  }

  //Open Modal Dividir
  timesToDivide() {
    if (this.dataPaymentVirt != null) {
      let incomeData = this.dataPaymentVirt;
      let modalConfig = MODAL_CONFIG;
      modalConfig = {
        initialState: {
          incomeData,
          callback: (data: any) => {
            console.log(data);
            const newData = this.data['data'].map((e: any) => {
              console.log(e.batchId);
              console.log(data.id);
              if (e.batchId == data.id) {
                return {
                  ...e,
                  amount: data.n_mdiv.toFixed(2),
                  amountGrief: data.n_pdiv.toFixed(2),
                };
              } else {
                return e;
              }
            });
            this.data.load(newData.concat(data.data));
          },
        },
        class: 'modal-dialog-centered',
        ignoreBackdropClick: true,
      };

      this.modalService.show(CanTimesComponent, modalConfig);
      this.dataPaymentVirt = null;
    } else {
      this.alert('warning', 'Debe Seleccionar un Registro', '');
    }
  }

  //Open Modal New
  newPayment() {
    let incomeData = {
      eventId: this.dataModel.eventId,
      clientId: this.dataModel.customerBatch,
      position: this.position,
    };
    let modalConfig = MODAL_CONFIG;
    modalConfig = {
      initialState: {
        incomeData,
        callback: (data: any) => {
          console.log(data.data);
          const newData = this.data['data'].map((e: any) => {
            if (e.position && e.position == this.position) {
              return {
                ...e,
                batchId: data.data.idLot,
                description: data.data[0].description,
                publicBatch: data.data[0].lotPublic,
              };
            } else {
              return e;
            }
          });

          this.data.load(newData);
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
  deleteFn() {
    this.alertQuestion('warning', 'Se Eliminará la División del Pago', '').then(
      q => {
        if (q.isConfirmed) {
          if (this.dataPaymentVirt != null) {
            console.log('deleteFn', this.data['data']);
            console.log(
              'Selccionado',
              this.dataPaymentVirt.position,
              this.deletedNumber
            );
            for (let i = 0; i < this.data['data'].length; ++i) {
              //console.log(this.data['data'][i].position,this.dataPaymentVirt.position )
              if (this.data['data'].length == 1) {
                this.alert(
                  'warning',
                  'Lo Sentimos no se Puede Eliminar el Único pago',
                  ''
                );
                break;
              } else {
                if (this.dataPaymentVirt.position == undefined) {
                  console.log('que gono');
                  this.deletedNumber++;
                  console.log(
                    this.data['data'][i].position,
                    this.dataPaymentVirt.position,
                    this.data['data']
                  );
                  this.data['data'].splice(i, 1);
                  this.calcularMonto(JSON.parse(this.dataPaymentVirt.amount));
                  break;
                }

                if (
                  this.data['data'][i].position == this.dataPaymentVirt.position
                ) {
                  this.deletedNumber++;
                  console.log(
                    this.data['data'][i].position,
                    this.dataPaymentVirt.position,
                    this.data['data']
                  );
                  this.data['data'].splice(i, 1);
                  this.calcularMonto(JSON.parse(this.dataPaymentVirt.amount));
                  break;
                }
                console.log(
                  this.data['data'][i].position,
                  this.dataPaymentVirt.position
                );
              }
            }
            console.log(this.data);
            this.data.load(this.data['data']);
            // this.calcularMonto();
          } else {
            this.alert('warning', 'Debe Seleccionar un Registro', '');
          }
        }
        this.dataPaymentVirt = null;
      }
    );
  }
  async aplicar() {
    console.log(this.data['data']);
    let lote: number[] = [];
    let loteRepited = false;

    this.alertQuestion(
      'warning',
      'Se Aplicarán los cambios al Deposito?',
      ''
    ).then(async q => {
      if (q.isConfirmed) {
        for (let i = 0; i < this.data['data'].length; ++i) {
          console.log(this.data['data'][i].publicBatch);

          loteRepited = lote.includes(this.data['data'][i].batchId);
          console.log(lote, loteRepited);
          if (loteRepited) {
            this.alert(
              'warning',
              'Registros repetidos, favor de verificar.',
              ''
            );
            return;
          } else {
            lote.push(this.data['data'][i].batchId);
            if (
              this.data['data'][i].publicBatch == '' ||
              this.data['data'][i].publicBatch == null
            ) {
              this.alert(
                'warning',
                'Sin registros a aplicar, favor de verificar.',
                ''
              );
              return;
            }
          }
        }

        let desagregarPagos = await this.desagregarPagos();

        console.log('aplicar');
      }
    });
  }
  restaurar() {
    console.log(this.restore);
    //this.calcularMonto('1', 0,  this.restore);
    this.alertQuestion(
      'warning',
      '¿Se ejecuta la Restauración del Depósito?',
      ''
    ).then(q => {
      if (q.isConfirmed) {
        console.log(this.restore);
        this.data.load(this.restore);
        console.log('restaurar');
      }

      for (let i = 0; i < this.data['data'].length; ++i) {
        let body: any = {};
        let body2: any = {};

        body2['id_lote'] = JSON.parse(
          this.data['data'][i].comerPaymentRef.lotId
        );
        body2['monto'] = JSON.parse(this.data['data'][i].amount);
        body2['tipo_ref'] = 4; //JSON.parse(this.data['data'][i].comerPaymentRef.reference);
        body2['monto_pena'] = JSON.parse(this.data['data'][i].amountGrief);
        body2['lote_publico'] = this.data['data'][i].publicBatch;

        body['dataVirt'] = [body2];
        body['action'] = 2;
        body['eventId'] = 15050;
        body['payId'] = JSON.parse(this.data['data'][i].payId);
        body['lotId'] = JSON.parse(this.data['data'][i].comerPaymentRef.lotId);
        body['clientId'] = JSON.parse(
          this.data['data'][i].comerPaymentRef.clientId
        );
        body['amount'] = JSON.parse(this.data['data'][i].amount);
        body['typeDistId'] = JSON.parse(this.id_tipo_disp);
        body['ref'] = this.data['data'][i].comerPaymentRef.reference;
        body['address'] = this.address;
        body['idTpEvent'] = JSON.parse(this.eventTpId);

        console.log(JSON.stringify(body));

        this.comerPaymentService.desagregarPagos(body).subscribe({
          next: data => {
            console.log(data);
          },
          error: err => {
            console.log(err);
          },
        });
        /*if(body2.monto_pena == this.restore[i].amountGrief){
            this.alert('warning', 'Debe Seleccionar un Registro', '');
          
        }*/
      }
    });
  }
  async desagregarPagos() {
    /* console.log(this.data['data'])
    let lote = [];
    let loteRepited= false;
    for(let i = 0 ; i < this.data['data'].length;++i){
      loteRepited = lote.includes(this.data['data'][i].comerPaymentRef.lotId);
      console.log(lote, loteRepited);
      if (loteRepited){
            this.alert('warning', 'Registros repetidos, favor de verificar.', '');
            break;

      }else{
      lote.push(this.data['data'][i].comerPaymentRef.lotId);
      }

      if(this.data['data'][i].publicBatch =='' || this.data['data'][i].publicBatch == null){
            this.alert('warning', 'Sin registros a aplicar, favor de verificar.', '');
            break;
        }
    }*/

    for (let i = 0; i < this.data['data'].length; ++i) {
      let body: any = {};
      let body2: any = {};

      /* if(this.data['data'][i].batchId == undefined){
      body2['id_lote'] = 4;
      }else{
      body2['id_lote'] = JSON.parse(this.data['data'][i].comerPaymentRef.lotId);

      }*/
      body2['id_lote'] = JSON.parse(this.data['data'][i].comerPaymentRef.lotId);
      body2['monto'] = JSON.parse(this.data['data'][i].amount);
      body2['tipo_ref'] = JSON.parse(this.data['data'][i].typereference);
      body2['monto_pena'] = JSON.parse(this.data['data'][i].amountGrief);
      body2['lote_publico'] = this.data['data'][i].publicBatch;

      body['dataVirt'] = [body2];
      body['action'] = 1;
      body['eventId'] = 15050;
      body['payId'] = JSON.parse(this.data['data'][i].payId);
      body['lotId'] = JSON.parse(this.data['data'][i].comerPaymentRef.lotId);
      body['clientId'] = JSON.parse(
        this.data['data'][i].comerPaymentRef.clientId
      );
      body['amount'] = JSON.parse(this.data['data'][i].amount);
      body['typeDistId'] = JSON.parse(this.id_tipo_disp);
      body['ref'] = this.data['data'][i].comerPaymentRef.reference;
      body['address'] = this.address;
      body['idTpEvent'] = JSON.parse(this.eventTpId);
      console.log(JSON.stringify(body));

      /* if(body.amount == this.restore[i].amount){
            this.alert('warning', 'La Sumatoria del Monto del desglose no concuerda con el Depósito, favor de verificar.', '');
            break;
        } */

      this.comerPaymentService.desagregarPagos(body).subscribe({
        next: data => {
          console.log(data);
          console.log(this.data['data'].length, i);

          /* if(this.data['data'].length-1 == i){
      this.bsModel.hide();
      }*/
        },
        error: err => {
          console.log(err);
          if (err == '0: Lote inválido') {
            this.alert('warning', 'Lo Sentimos, Lote Invalido', '');
            return;
          }
          if (err == '0: Tipo inválido') {
            this.alert(
              'warning',
              'Lo Sentimos, Tipo de Referencia Invalido',
              ''
            );
            return;
          }
          if (err == '0: Monto inválido') {
            this.alert('warning', 'Lo Sentimos, Monto Invalido', '');
            return;
          }
        },
      });
    }
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
