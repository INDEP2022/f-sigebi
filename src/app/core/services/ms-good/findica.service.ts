import { Injectable } from '@angular/core';
import { GoodProcessPoints } from 'src/app/common/constants/endpoints/ms-good-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService } from 'src/app/common/services/http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FIndicaService extends HttpService {
  constructor() {
    super();
    this.microservice = GoodProcessPoints.basepath;
  }

  pupGenerateWhere(body: Object) {
    return this.post('findica/pupGenerateWhere', body);
  }

  pupUpdate(
    processingArea: string,
    proceedings: string | number,
    actNumber: string | number
  ) {
    return this.post('findica/pupUpdate', {
      processingArea,
      proceedings,
      actNumber,
    });
  }

  generateExcel(data: { acta: number; type: string; crtSus: string | null }) {
    return this.httpClient.post<{ file: { name: string; base64: string } }>(
      `${environment.API_URL}goodprocess/api/v1/findica/getFile`,
      data
    );
  }
  postGetListGood(body: Object, params: ListParams) {
    return this.post('update-good-status/getListGood', body, params);
  }
}
