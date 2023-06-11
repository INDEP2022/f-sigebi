import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsFilterSharedComponent } from '../../../@standalone/shared-forms/goods-shared/goods-filter-shared';
import { GoodsCharacteristicsRoutingModule } from './goods-characteristics-routing.module';
import { GoodCellValueComponent } from './goods-characteristics/good-table-vals/good-cell-value/good-cell-value.component';
import { GoodCharacteristicModalComponent } from './goods-characteristics/good-table-vals/good-characteristic-modal/good-characteristic-modal.component';
import { GoodSituationsModalComponent } from './goods-characteristics/good-table-vals/good-situations-modal/good-situations-modal.component';
import { GoodTableDetailButtonComponent } from './goods-characteristics/good-table-vals/good-table-detail-button/good-table-detail-button.component';
import { GoodValueEditWebCar } from './goods-characteristics/good-table-vals/good-table-detail-button/good-value-edit-web-car/good-value-edit-web-car.component';
import { GoodTableValsComponent } from './goods-characteristics/good-table-vals/good-table-vals.component';
import { GoodsCharacteristicsComponent } from './goods-characteristics/goods-characteristics.component';

@NgModule({
  declarations: [
    GoodsCharacteristicsComponent,
    GoodTableValsComponent,
    GoodTableDetailButtonComponent,
    GoodCellValueComponent,
    GoodCharacteristicModalComponent,
    GoodSituationsModalComponent,
    GoodValueEditWebCar,
  ],
  imports: [
    CommonModule,
    GoodsCharacteristicsRoutingModule,
    SharedModule,
    TabsModule,
    GoodsTypesSharedComponent,
    DelegationSharedComponent,
    GoodsFilterSharedComponent,
  ],
})
export class GoodsCharacteristicsModule {}
