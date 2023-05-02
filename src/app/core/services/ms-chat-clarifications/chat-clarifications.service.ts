import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatClarificationsEndpoints } from 'src/app/common/constants/endpoints/ms-chat-clarifications-endpoint';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IChatClarifications } from '../../models/ms-chat-clarifications/chat-clarifications-model';

@Injectable({
  providedIn: 'root',
})
export class ChatClarificationsService extends HttpService {
  constructor() {
    super();
    this.microservice = ChatClarificationsEndpoints.BasePath;
  }

  create(model: IChatClarifications): Observable<any> {
    return this.post(ChatClarificationsEndpoints.ChatClarifications, model);
  }

  update(id: string | number, model: IChatClarifications): Observable<any> {
    return this.put(
      `${ChatClarificationsEndpoints.ChatClarifications}/${id}`,
      model
    );
  }

  remove(id: string | number): Observable<any> {
    return this.delete(
      `${ChatClarificationsEndpoints.ChatClarifications}/${id}`
    );
  }

  getAllFilter(
    params?: ListParams | string
  ): Observable<IListResponse<IChatClarifications>> {
    return this.get(ChatClarificationsEndpoints.ChatClarifications, params);
  }

  getAll(
    params?: ListParams | string
  ): Observable<IListResponse<IChatClarifications>> {
    return this.get<IListResponse<IChatClarifications>>(
      ChatClarificationsEndpoints.ChatClarifications,
      params
    );
  }
}
