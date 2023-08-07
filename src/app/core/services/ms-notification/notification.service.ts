import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { NotificationEndpoints } from 'src/app/common/constants/endpoints/ms-notification-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { NotificationRepository } from 'src/app/common/repository/repositories/ms-notification-repository';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from './../../interfaces/list-response.interface';

import {
  INotification,
  INotificationInquiry,
  INotificationTransferentIndiciadoCityGetData,
  INotificationUpdate,
  INotificationXProperty,
  ITransfActaEntrec,
  ItVolanteNotificacionesByNoExpedient,
} from '../../models/ms-notification/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends HttpService {
  private readonly route = NotificationEndpoints;
  private readonly endpoint: string = 'notification';
  constructor(
    private notificationRepository: NotificationRepository<INotification>,
    private notificationUpdateRepository: NotificationRepository<INotificationUpdate>,
    private notificationRepository2: Repository<INotification>
  ) {
    super();
    this.microservice = this.route.Notification;
  }

  //Trae los objetos de ciudad,delegación,departamento,instituciòn,subdelegacion y transferente
  getAllNotifications(
    params?: ListParams
  ): Observable<IListResponse<INotification>> {
    return this.notificationRepository.getAll(
      this.route.NotificationAll,
      params
    );
  }

  getAll(params?: ListParams): Observable<IListResponse<INotification>> {
    return this.notificationRepository.getAll(this.route.Notification, params);
  }

  getAllFilter(params: _Params): Observable<IListResponse<INotification>> {
    return this.get<IListResponse<INotification>>(
      `${this.route.Notification}?${params}`
    );
  }
  getAllListParams(
    params: ListParams
  ): Observable<IListResponse<INotification>> {
    return this.get<IListResponse<INotification>>(
      this.route.Notification,
      params
    );
  }

  getAllListParamsColumns(
    params: ListParams
  ): Observable<IListResponse<INotification>> {
    return this.get<IListResponse<INotification>>(
      this.route.Notification,
      params
    );
  }

  getAllFilterExpedient(params: any) {
    return this.get<IListResponse<any>>(`${this.route.Notification}`, params);
  }

  getAllFilterTmpNotification(
    params: _Params
  ): Observable<IListResponse<INotification>> {
    return this.get<IListResponse<INotification>>(
      `${this.route.TmpNotification}?${params}`
    );
  }

  create(body: INotification): Observable<INotification> {
    return this.post(this.route.Notification, body);
  }

  update(
    wheelNumber: number,
    notification: Partial<INotification>
  ): Observable<{ statusCode: number; message: string[] }> {
    return this.put(`${this.route.Notification}/${wheelNumber}`, notification);
  }

  // ! CORRECIÓN NUMERARIO 20/07/23 GENARO
  // getLastWheelNumber(): Observable<{ nextval: number }> {
  //   return this.get<{ max: string }>(this.route.LastFlyerId).pipe(
  //     map(resp => {
  //       return { nextval: Number(resp.max) };
  //     })
  //   );
  // }

  getLastWheelNumber(): Observable<{ nextval: number }> {
    return this.get<{ nextval: string }>(this.route.LastWheelNumber).pipe(
      map(resp => {
        return { nextval: Number(resp.nextval) };
      })
    );
  }

  getDailyConsecutive(
    delegation: number,
    subdelegation: number
  ): Observable<{ consecutivedaily: number }> {
    return this.get<{ consecutivedaily: string }>(
      `${this.route.Notification}/${this.route.DailyConsecutive}/delegation/${delegation}/subdelegation/${subdelegation}`
    ).pipe(
      map(resp => {
        return { consecutivedaily: Number(resp.consecutivedaily) };
      })
    );
  }

  findTransferentCity(body: {
    city: number;
    indiciado: number;
    transferent: string;
  }): Observable<IListResponse<INotification>> {
    return this.post(this.route.FindTransferentCity, body);
  }

  findCountByInquiry(
    body: INotificationInquiry
  ): Observable<IListResponse<INotification>> {
    return this.post(this.route.FindCountByInquiry, body);
  }

  getMaxFlyerByExpedient(
    expedient: number,
    type: 'MIN' | 'MAX'
  ): Observable<{ no_volante: number }> {
    return this.get(
      `${this.route.MaxFlyerNumber}/${expedient}/option/${type}`
    ).pipe(
      map((resp: { no_volante: string }) => {
        return { no_volante: Number(resp.no_volante) };
      })
    );
  }

  getByNotificationxProperty(
    params?: ListParams
  ): Observable<IListResponse<INotification>> {
    return this.notificationRepository.getAll(
      this.route.NotificationxProperty,
      params
    );
  }

  createNotificationxPropertyFilter(model: any): Observable<any> {
    return this.notificationRepository.create(
      this.route.NotificationxPropertyFilter,
      model
    );
  }

  updateNotificationxPropertyFilter(
    numberProperty: number | string,
    notificationDate: Date | string,
    formData: Object
  ): Observable<any> {
    return this.notificationRepository.updateNotification(
      this.route.NotificationxPropertyPut,
      numberProperty,
      notificationDate,
      formData
    );
  }

  updateupdateNotification(
    numberProperty: number | string,
    notificationDate: Date | string,
    formData: INotification
  ): Observable<Object> {
    return this.notificationRepository.updateNotification(
      this.route.NotificationxPropertyPut,
      numberProperty,
      notificationDate,
      formData
    );
  }

  getNotificacionesByTransferentIndiciadoCity(
    body: INotificationTransferentIndiciadoCityGetData | any
  ) {
    return this.notificationRepository.getNotificacionesByTransferentIndiciadoCity(
      'notification/notification/find-notification-by-transferent-or-city',
      body
    );
  }

  getVolanteNotificacionesByNoExpedient(id: string) {
    let expedient = encodeURI(id);
    return this.httpClient.get<
      IListResponse<ItVolanteNotificacionesByNoExpedient>
    >('notification/notification/find-count-by-expedient/' + expedient);
  }

  getNotificationxPropertyFilter(
    body: any
  ): Observable<IListResponse<INotificationXProperty>> {
    return this.post<IListResponse<INotificationXProperty>>(
      this.route.NotificationxPropertyFilter,
      body
    );
  }

  postNotificationxPropertyFilterDates(
    body: any
  ): Observable<IListResponse<INotificationXProperty>> {
    return this.post<IListResponse<INotificationXProperty>>(
      this.route.NotificationxPropertyFilterSort,
      body
    );
  }

  updateObservacion(
    bienNumber: number,
    notificationDate: string,
    observation: any
  ): Observable<{ statusCode: number; message: string[] }> {
    return this.put(
      `${this.route.NotificationxPropertyPut}/${bienNumber}/notification/${notificationDate}`,
      observation
    );
  }

  getByNotificationxProperty2(
    params: any
  ): Observable<IListResponse<INotification>> {
    return this.post(this.route.NotificationxPropertyFilter2, params);
  }

  updateNotiXProperty(
    numberProperty: number | string,
    notificationDate: Date | string,
    formData: any
  ): Observable<IListResponse<INotificationXProperty>> {
    const route = `${this.route.NotificationxProperty}/property/${numberProperty}/notification/${notificationDate}`;
    console.log('ROUT', route);
    return this.put(route, formData);
  }

  getAllWithFilter(
    params?: ListParams | string
  ): Observable<IListResponse<INotification>> {
    return this.notificationRepository2.getAllPaginatedFilter(
      this.endpoint,
      params
    );
  }

  updateWithBody(
    wheelNumber: number,
    body: any
  ): Observable<{ statusCode: number; message: string[] }> {
    return this.put(`${this.route.Notification}/${wheelNumber}`, body);
  }

  getTransferenteentrec(model: ITransfActaEntrec) {
    const route = 'application/get-fact-ref-acta-entrec';
    return this.post(route, model);
  }

  getTransferenteCancel(model: ITransfActaEntrec) {
    const route = 'application/get-fact-ref-cancelar';
    return this.post(route, model);
  }

  getVariableType(numberExp: number) {
    const route = `application/getVariablesVolType/${numberExp}`;
    return this.get(route);
  }

  getMaxFlyer(fileNumber: number) {
    return this.get(`notification/maxCFlyer/${fileNumber}`);
  }
  getCFlyer(fileNumber: number) {
    return this.get(`notification/cFlyer/${fileNumber}`);
  }

  applyAllGoddMaintenanceCoverage(body: any) {
    const route = 'application/updateUnitProgramAll';
    return this.post(route, body);
  }

  applySomeGoddMaintenanceCoverage(body: any) {
    const route = 'application/updateUnitProgram';
    return this.post(route, body);
  }

  validateGoodStatus(body: any) {
    return this.post(this.route.ValidateGoodStatus, body);
  }

  getDistinct(params: ListParams, body: Object) {
    /* const headers = new HttpHeaders().set(InterceptorSkipHeader, '');
    return this.httpClient.post(
      `${this.url}${this.microservice}/${this.prefix}notification/get-distinct`,
      body,
      { params, headers }
    ); */
    return this.post<IListResponse<any>>(
      'notification/get-distinct',
      body,
      params
    );
  }

  getByFileNumber(fileNumber: string | number) {
    const route = this.route.byFileNumber;
    return this.get(`notification/maxCFlyer/${fileNumber}`);
  }
}
