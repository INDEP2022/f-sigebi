/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { MsgRsbMRegisterRequestGoodsModule } from '../../../manage-similar-goods/register-request-goods/msg-rsb-m-register-request-goods.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { GDCBGoodsClassificationRoutingModule } from './gd-cb-m-goods-classification-routing.module';

/** COMPONENTS IMPORTS */
import { GDCBGoodsClassificationComponent } from './goods-classification/gd-cb-c-goods-classification.component';

@NgModule({
  declarations: [GDCBGoodsClassificationComponent],
  imports: [
    CommonModule,
    GDCBGoodsClassificationRoutingModule,
    SharedModule,
    MsgRsbMRegisterRequestGoodsModule,
  ],
  providers: [],
})
export class GDCBGoodsClassificationModule {}
