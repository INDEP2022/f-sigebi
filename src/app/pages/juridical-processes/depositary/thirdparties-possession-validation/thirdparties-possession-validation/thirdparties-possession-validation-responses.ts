import { firstValueFrom, map } from 'rxjs';
import { GoodPosessionThirdpartyService } from 'src/app/core/services/ms-thirdparty-admon/good-possession-thirdparty.service';
import { BasePage } from 'src/app/core/shared/base-page';

export abstract class thirdpartiesPossessionValidationResponses extends BasePage {
  protected abstract goodPosessionThirdpartyService: GoodPosessionThirdpartyService;

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
}
