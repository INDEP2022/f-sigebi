import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GpGoodsCharacteristicsRoutingModule } from './gp-goods-characteristics-routing.module';
import { GpGoodsCharacteristicsComponent } from './gp-goods-characteristics/gp-goods-characteristics.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

@NgModule({
  declarations: [GpGoodsCharacteristicsComponent],
  imports: [
    CommonModule,
    GpGoodsCharacteristicsRoutingModule,
    SharedModule,
    TabsModule,
    GoodsTypesSharedComponent,
    DelegationSharedComponent,
  ],
})
export class GpGoodsCharacteristicsModule {}
