import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { _Params } from 'src/app/common/services/http.service';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MJobManagementService } from 'src/app/core/services/ms-office-management/m-job-management.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { CityService } from '../../../../core/services/catalogs/city.service';
import { DictationService } from '../../../../core/services/ms-dictation/dictation.service';
import { IJuridicalFileDataUpdateForm } from '../../file-data-update/interfaces/file-data-update-form';

@Injectable({
  providedIn: 'root',
})
export class AbandonmentsDeclarationTradesService {
  private _abandonmentsFlyerForm: Partial<IJuridicalFileDataUpdateForm> = null;

  constructor(
    private expedientService: ExpedientService,
    private goodService: GoodService,
    private jobManageService: MJobManagementService,
    private dictationService: DictationService,
    private userAreasService: SegAcessXAreasService,
    private cityService: CityService
  ) {}

  get abandonmentsFlyerForm() {
    if (this._abandonmentsFlyerForm === null) return null;
    return { ...this._abandonmentsFlyerForm };
  }

  set abandonmentsFlyerForm(form: Partial<IJuridicalFileDataUpdateForm>) {
    this._abandonmentsFlyerForm = form;
  }

  getExpedients(params: _Params) {
    return this.expedientService.getAllFilter(params);
  }

  getGoods(params: string) {
    this.goodService.getAllFilter(params);
  }

  getUsers(params: _Params) {
    return this.userAreasService.getAll(params).pipe(
      map(data => {
        return {
          ...data,
          data: data.data.map(u => {
            return { ...u, userAndName: `${u.user} - ${u.userDetail.name}` };
          }),
        };
      })
    );
  }

  getCities(params: string) {
    return this.cityService.getAllFiltered(params).pipe(
      map(data => {
        return {
          ...data,
          data: data.data.map(c => {
            return { ...c, nameAndId: `${c.idCity} - ${c.nameCity}` };
          }),
        };
      })
    );
  }
}
