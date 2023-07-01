import { formatDate } from '@angular/common';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IDetailGoodPossessionThirdParty,
  IGoodPossessionThirdParty,
} from 'src/app/core/models/ms-thirdparty-admon/third-party-admon.model';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';

export abstract class thirdpartiesPossessionValidationResponses extends BasePage {
  protected abstract goodPosessionThirdpartyService: GoodPosessionThirdpartyService;
  protected abstract parametersService: ParametersService;
  protected abstract userService: UsersService;

  getDetailGoodThirdParty(id: number | string, firstRecord = false) {
    return firstValueFrom(
      this.goodPosessionThirdpartyService
        .getAllDetailGoodPossessionThirdParty({ 'filter.goodNumber': id })
        .pipe(
          map(response => {
            if (firstRecord) {
              return response.data[0];
            } else {
              return response;
            }
          })
        )
    );
  }

  /**
   *
   * @param date Date
   * @return Promise<number>
   */
  getFaStageCreda(date: Date): Promise<number> {
    const _date = formatDate(date, 'yyyy/MM/dd', 'en-US');
    console.log(_date);
    return firstValueFrom(
      this.parametersService.getFaStageCreda(_date).pipe(
        map(response => {
          console.log(response);
          return response.stagecreated;
        })
      )
    );
  }

  updateGoodPossessionThirdParty(
    possessionNumber: string | number,
    params: Partial<IGoodPossessionThirdParty>
  ) {
    return firstValueFrom(
      this.goodPosessionThirdpartyService.updateThirdPartyAdmonOffice(
        possessionNumber,
        params
      )
      // .pipe(
      //   map(response => {
      //     return response;
      //   })
      // )
    );
  }

  postGoodPossessionThirdParty(params: IGoodPossessionThirdParty) {
    return firstValueFrom(
      this.goodPosessionThirdpartyService.postGoodPossessionThirdParty(params)
    );
  }

  getSequenceNoPositionNextVal() {
    return firstValueFrom(
      this.goodPosessionThirdpartyService.getSequenceNoPositionNextVal()
      // .pipe(
      //   map(response => {
      //     return response;
      //   })
      // )
    );
  }

  getUser(text: string): Observable<{ usuario: string; nombre: string }> {
    const params = new ListParams();
    params['asigUser'] = 'S';
    return this.userService.getAllUsersAsigne(params).pipe(
      map(response => {
        return response.data[0];
        // return { ...item, nameUser: `${item.usuario} - ${item.nombre}` };
      })
    );
  }

  postDetailGoodPossessionThirdParty(params?: IDetailGoodPossessionThirdParty) {
    return firstValueFrom(
      this.goodPosessionThirdpartyService.postDetailGoodPossessionThirdParty(
        params
      )
    );
  }

  deleteDetailGoodPossessionThirdParty(params: {
    possessionNumber: string | number;
    goodNumber?: string | number;
  }) {
    return firstValueFrom(
      this.goodPosessionThirdpartyService.deleteDetailGoodPossessionThirdParty(
        params
      )
    );
  }
}
