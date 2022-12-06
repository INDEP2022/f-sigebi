/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { MsgRsbMRegisterRequestGoodsModule } from '../../../manage-similar-goods/register-request-goods/msg-rsb-m-register-request-goods.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { GDASDApproveReturnRequestRoutingModule } from './gd-asd-m-approve-return-request-routing.module';

/** COMPONENTS IMPORTS */
import { GDASDApproveReturnRequestComponent } from './approve-return-request/gd-asd-c-approve-return-request.component';

@NgModule({
  declarations: [GDASDApproveReturnRequestComponent],
  imports: [
    CommonModule,
    GDASDApproveReturnRequestRoutingModule,
    SharedModule,
    MsgRsbMRegisterRequestGoodsModule,
  ],
  providers: [],
})
export class GDASDApproveReturnRequestModule {}
