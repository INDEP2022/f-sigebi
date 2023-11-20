import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DonationEndPoint } from 'src/app/common/constants/endpoints/ms-donation';
import { ICrudMethods } from 'src/app/common/repository/interfaces/crud-methods';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DonationRepository } from 'src/app/common/repository/repositories/ms-donation-repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import {
  IDetailDonation,
  IDonationGood,
  IExportDetail,
  IFilterDonation,
  IGoodDonation,
  ITempDonDetail,
} from '../../models/ms-donation/donation.model';
import {
  IDeleteGoodDon,
  IInventaryDelete,
  IInventaryRequest,
} from '../../models/sirsae-model/proposel-model/proposel-model';

const api: string = DonationEndPoint.donation;
const donationEvent = DonationEndPoint.eventComDonation;
const endpoint: string = DonationEndPoint.eventComDonation;
const route: string = DonationEndPoint.RequestGoodDon;
@Injectable({
  providedIn: 'root',
})
export class DonationService
  extends HttpService
  implements ICrudMethods<IDonationGood>
{
  constructor(private donationRepository: DonationRepository<IDonationGood>) {
    super();

    this.microservice = 'donationgood';
  }

  getAll(params?: ListParams): Observable<IListResponse<IDonationGood>> {
    return this.donationRepository.getAll(api, params);
  }

  getAllWidthFilters(
    parmas: _Params
  ): Observable<IListResponse<IDonationGood>> {
    return this.get(api, parmas);
  }

  createDonation(
    data: IFilterDonation
  ): Observable<IListResponse<IDonationGood>> {
    return this.donationRepository.create(api, data);
  }

  updateDonation(
    data: IFilterDonation,
    id: string
  ): Observable<IListResponse<IDonationGood>> {
    return this.donationRepository.update(api, id, data);
  }

  remove(id: string): Observable<any> {
    return this.donationRepository.remove(api, id);
  }

  getEventComDonation(params?: ListParams) {
    const route = `${DonationEndPoint.eventComDonation}`;
    return this.get(route, params);
  }

  getEventComDonationDetail(
    params?: ListParams
  ): Observable<IListResponse<any>> {
    return this.donationRepository.getAll(
      DonationEndPoint.DetailEventComDon,
      params
    );
  }

  getExcel(body: IExportDetail) {
    const route = `${DonationEndPoint.eventComDonationExcel}`;
    return this.post(route, body);
  }

  createAdmonDonation(model: any) {
    return this.post('admon-donation', model);
  }

  deleteAdmonDonation(id: number) {
    return this.delete(`admon-donation/${id}`);
  }
  createD(goodDon: IGoodDonation) {
    const route = `${endpoint}`;
    return this.post(route, goodDon);
  }
  getTempGood(params: ListParams) {
    return this.get(DonationEndPoint.TempDonationGood, params);
  }
  getTempDon(params: ListParams) {
    return this.get(DonationEndPoint.TempDonation, params);
  }
  createTempDon(don: ITempDonDetail) {
    return this.post(DonationEndPoint.TempDonation, don);
  }
  createApproveDonation(data: any) {
    return this.post(DonationEndPoint.ApproveDonation, data);
  }
  editApproveDonation(data: any) {
    return this.put(DonationEndPoint.ApproveDonation, data);
  }
  getDonationRequest(requestId: number) {
    return this.get(`/donac-request-good?filter.requestId.id=$eq:${requestId}`);
  }

  postUpdateStore(data: any) {
    return this.post(`application/update-store`, data);
  }

  postDeleteDetail(data: any) {
    return this.post(`application/pup-delete-detail`, data);
  }
  getEventGood(params: ListParams) {
    return this.get(DonationEndPoint.eventComDonation, params);
  }
  getApprove(params: ListParams) {
    return this.get(DonationEndPoint.ApproveDnation, params);
  }

  putEventComDonationDetail(body: Object) {
    return this.put(DonationEndPoint.DetailEventComDon, body);
  }
  createEventComDonationDetail(body: Object) {
    return this.post(DonationEndPoint.DetailEventComDon, body);
  }
  getByIdEvent(id: number) {
    return this.get(`/${DonationEndPoint.eventComDonation}/${id}`);
  }

  putEvent(goodDon: IGoodDonation, id: number) {
    const route = `${DonationEndPoint.eventComDonation}/${id}`;
    return this.put(route, goodDon);
  }
  deleteDetailDona(model: any) {
    return this.delete(DonationEndPoint.DetailEventComDon, model);
  }
  putDetailDona(model: any) {
    return this.put(DonationEndPoint.DetailEventComDon, model);
  }
  getGoodsDonation(params: ListParams) {
    return this.get(DonationEndPoint.GoodsForDonation, params);
  }
  getGoodRequest(params: ListParams) {
    return this.get(DonationEndPoint.RequestGoodDon, params);
  }
  createDetail(body: IDetailDonation) {
    return this.post(DonationEndPoint.DetailEventComDon, body);
  }
  deleteGoodDon(body: IDeleteGoodDon) {
    return this.delete(DonationEndPoint.DeleteGoodDon, body);
  }
  getInventaryGood(body: IInventaryRequest) {
    return this.post(DonationEndPoint.Inventary, body);
  }
  createInventary(body: IInventaryRequest) {
    return this.post(DonationEndPoint.CreateInventary, body);
  }
  deleteGoodReq(body: IInventaryDelete) {
    return this.delete(DonationEndPoint.CreateInventary, body);
  }
  getInventory(params: ListParams) {
    return this.get(DonationEndPoint.CreateInventary, params);
  }
  deleteApproveDonation(data: any) {
    return this.delete(DonationEndPoint.ApproveDonation, data);
  }
}
