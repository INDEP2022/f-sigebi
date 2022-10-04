import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENDPOINT_LINKS } from '../../../common/constants/endpoints';
import { ICrudMethods } from '../../../common/repository/interfaces/crud-methods';
import { ListParams } from '../../../common/repository/interfaces/list-params';
import { Repository } from '../../../common/repository/repository';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IIndicatorReport } from '../../models/catalogs/indicator-report.model';
@Injectable({
  providedIn: 'root',
})
export class IndicatorReportService implements ICrudMethods<IIndicatorReport> {
  private readonly route: string = ENDPOINT_LINKS.IndicatorReport;
  constructor(
    private indicatorReportRepository: Repository<IIndicatorReport>
  ) {}

  getAll(params?: ListParams): Observable<IListResponse<IIndicatorReport>> {
    return this.indicatorReportRepository.getAllPaginated(this.route, params);
  }

  getById(id: string | number): Observable<IIndicatorReport> {
    return this.indicatorReportRepository.getById(this.route, id);
  }

  create(model: IIndicatorReport): Observable<IIndicatorReport> {
    return this.indicatorReportRepository.create(this.route, model);
  }

  update(id: string | number, model: IIndicatorReport): Observable<Object> {
    return this.indicatorReportRepository.update(this.route, id, model);
  }

  remove(id: string | number): Observable<Object> {
    return this.indicatorReportRepository.remove(this.route, id);
  }
}
