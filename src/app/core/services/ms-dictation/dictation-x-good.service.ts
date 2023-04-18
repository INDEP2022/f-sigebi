import { Injectable } from '@angular/core';
import { DictationEndpoints } from 'src/app/common/constants/endpoints/ms-dictation-endpoint';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IDictationXGoodByFileNumber } from '../../models/ms-dictation/dictation-x-good.model';

@Injectable({
  providedIn: 'root',
})
export class DictationXGoodService extends HttpService {
  private readonly route = DictationEndpoints;
  constructor() {
    super();
    this.microservice = DictationEndpoints.BasePath;
  }

  getDictationXGoodByFileNummber(fileNumber: number) {
    return this.get<IListResponse<IDictationXGoodByFileNumber>>(
      this.route.DictationXGood + '/getByFileNumber/' + fileNumber
    );
  }
}
