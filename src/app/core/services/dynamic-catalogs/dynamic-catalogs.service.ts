import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Repository } from 'src/app/common/repository/repository';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IExpedient, IPerUser } from '../../models/expedient/expedient.model';

@Injectable({
  providedIn: 'root',
})
/**
 * @deprecated Cambiar a la nueva forma
 */
export class DynamicCatalogService extends HttpService {
  private readonly route: string = 'dynamiccatalog/dinamic-tables';
  constructor(private expedientRepository: Repository<IExpedient>) {
    super();
    this.microservice = 'dynamiccatalog';
  }
  getDynamicData(id: string | number, params: ListParams) {
    return this.expedientRepository.getAllPaginated(
      this.route + '/get-tvaltable1-by-name/' + id,
      params
    );
  }
  getCurrency(id: string | number, params: ListParams) {
    return this.expedientRepository.getAllPaginated(
      this.route + '/get-tvaltable5-by-table/' + id,
      params
    );
  }

  getTable1Table5(body: any, params: _Params) {
    return this.post('dinamic-tables/get-otkey-otvalue', body, params);
  }

  getIncapAndClave(no_expediente: string | number) {
    return this.get<
      IListResponse<{
        coaelesce: string;
        clave: string;
      }>
    >(`dinamic-tables/getIncapAndClave`, { no_expediente });
  }

  getPerUser(model: IPerUser) {
    return this.post('dinamic-tables/getOtvalue', model);
  }

  getDescEmisora(no_expediente: string | number) {
    return this.get<
      IListResponse<{
        desc_emisora: string;
      }>
    >(`dinamic-tables/getDescEmisora`, { no_expediente });
  }
  getClaveCTransparente(no_expediente: string | number) {
    return this.get<
      IListResponse<{
        clave: string;
      }>
    >(`dinamic-tables/getClaveCTransparente`, { no_expediente });
  }

  faEtapaind(dateEtapa: string) {
    return this.post('application/faEtapaind', { dateEtapa });
  }

  faEtapaindNumber(dateEtapa: string) {
    return this.post('application/faEtapaind', { dateEtapa });
  }
}
