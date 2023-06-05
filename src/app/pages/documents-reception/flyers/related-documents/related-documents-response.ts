import { type FormGroup } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGood } from 'src/app/core/models/good/good.model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodsJobManagementService } from 'src/app/core/services/ms-office-management/goods-job-management.service';
import { BasePage } from 'src/app/core/shared/base-page';

export abstract class RelateDocumentsResponse extends BasePage {
  protected abstract goodService: GoodService;
  protected abstract goodsJobManagementService: GoodsJobManagementService;
  abstract data1: IGood[];
  abstract managementForm: FormGroup;
  isLoadingGood: boolean;
  getGoods(params: ListParams) {
    const expedientNumber = this.managementForm?.get('noVolante').value;
    const queryString = `page=${params.page}&limit=${params.limit}&filter.fileNumber=${expedientNumber}`;

    this.isLoadingGood = true;
    this.goodService.getAllFilter(queryString).subscribe({
      next: async data => {
        const goods = data.data.map(async (item: any) => {
          // const isNotAvailable = await this.getGoodsOfficeManagementsExpAvailable();
        });
        //  const r = await data.data.map(async (item: any) => {
        //    let isNotAvailable = Boolean(
        //      this.dataTableBienesOficio.find(x => x.id == item.id)
        //    );
        //    console.log('isNotAvailable', isNotAvailable);
        //    if (item.status == 'ADM' && !isNotAvailable) {
        //      try {
        //        const result = await this.getDetailGoodThirdParty(
        //          item.id,
        //          true
        //        );
        //        isNotAvailable = true;
        //      } catch (e) {
        //        isNotAvailable = false;
        //      }
        //    }
        //    return {
        //      ...item,
        //      available:
        //        item.status != 'ADM' || isNotAvailable ? false : true,
        //    };
        //  });
        //  this.dataTableBienes = await Promise.all(r);
        //  this.totalItemsGood = data.count;
        this.isLoadingGood = false;
      },
      error: () => {
        this.isLoadingGood = false;
      },
    });
  }

  //   getGoodsOfficeManagementsExpAvailable(expGoodNumber: string | number, managementNumber: string | number, goodId: string | number) {
  //     const params = new ListParams();
  //     params.page = 1;
  //     params.limit = 1;
  //     params['expGoodNumber'] = expGoodNumber;
  //     params['managementNumber'] = managementNumber;
  //     params['goodId'] = goodId;
  //     return firstValueFrom(
  //         this.goodsJobManagementService.getGoodsOfficeManagementsExpAvailable(params)
  //         .pipe(map(x => x.data))
  //         );
  //   }
}
