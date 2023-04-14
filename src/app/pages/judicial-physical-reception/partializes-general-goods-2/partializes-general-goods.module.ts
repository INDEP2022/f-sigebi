import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GoodsClasificationSharedComponent } from 'src/app/@standalone/shared-forms/goods-classification-shared/goods-classification-shared.component';
import { GoodsStatusSharedComponent } from 'src/app/@standalone/shared-forms/goods-status-shared/goods-status-shared.component';
import { SelectFormComponent } from 'src/app/@standalone/shared-forms/select-form/select-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodFormComponent } from './good-form/good-form.component';
import { PartializesGeneralGoodsRoutingModule } from './partializes-general-goods-routing.module';
import { PartializesGeneralGoodsComponent } from './partializes-general-goods.component';
import { PartializeGeneralGoodService } from './services/partialize-general-good.service';

@NgModule({
  declarations: [PartializesGeneralGoodsComponent, GoodFormComponent],
  imports: [
    CommonModule,
    PartializesGeneralGoodsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
    GoodsStatusSharedComponent,
    GoodsClasificationSharedComponent,
    SelectFormComponent,
  ],
  providers: [PartializeGeneralGoodService],
})
export class PartializesGeneralGoodsModule {}
