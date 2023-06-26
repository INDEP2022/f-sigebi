import { Injectable } from '@angular/core';
import { ReceptionGoodEndpoint } from 'src/app/common/constants/endpoints/ms-reception-good-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class ReceptionGoodService extends HttpService {
  private readonly receiptGuardRoute = ReceptionGoodEndpoint.ReceptionGuard;
  private readonly receiptGuardGoods = ReceptionGoodEndpoint.ReceptionGuardGood;
  private readonly receiptRoute = ReceptionGoodEndpoint.Receipt;
  private readonly ReceiptGood = ReceptionGoodEndpoint.ReceiptGood;
  private readonly ReceiptWitness = ReceptionGoodEndpoint.ReceiptWitness;
  constructor() {
    super();
    this.microservice = ReceptionGoodEndpoint.BasePath;
  }

  getReceptions(params: ListParams) {
    return this.get(this.receiptGuardRoute, params);
  }

  getReceipt(params: ListParams) {
    return this.get(this.receiptRoute, params);
  }

  deleteReceipt(formData: Object) {
    return this.delete(this.receiptRoute, formData);
  }

  getReceptionGoods(params: ListParams) {
    return this.get(this.receiptGuardGoods, params);
  }

  createReception(formData: Object) {
    return this.post(this.receiptGuardRoute, formData);
  }

  createReceiptGoodGuard(formData: Object) {
    return this.post(this.receiptGuardGoods, formData);
  }

  getReceiptGood(params: ListParams) {
    return this.get(this.ReceiptGood, params);
  }

  createReceiptGood(formData: Object) {
    return this.post(this.ReceiptGood, formData);
  }
  createReceptionGoods(formData: Object) {
    return this.post(this.receiptGuardGoods, formData);
  }

  createReceipt(formData: Object) {
    return this.post(this.receiptRoute, formData);
  }

  updateReceipt(formData: Object) {
    return this.put(this.receiptRoute, formData);
  }

  updateReceiptGuard(id: number, formData: FormData) {
    return this.put(`${this.receiptGuardRoute}/${id}`, formData);
  }

  getReceiptsWitness(params: ListParams) {
    return this.get(`${this.ReceiptWitness}`, params);
  }

  createReceiptWitness(formData: Object) {
    return this.post(`${this.ReceiptWitness}`, formData);
  }

  deleteReceiptWitness(formData: Object) {
    return this.delete(`${this.ReceiptWitness}`, formData);
  }
}
