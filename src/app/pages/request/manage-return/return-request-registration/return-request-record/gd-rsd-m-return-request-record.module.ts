/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../../shared-request/shared-request.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
// import { MsgRsbMRegisterRequestGoodsModule } from '../../../manage-similar-goods/register-request-goods/msg-rsb-m-register-request-goods.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { GDRSDReturnRequestRecordRoutingModule } from './gd-rsd-m-return-request-record-routing.module';

/** COMPONENTS IMPORTS */
import { GDRSDReturnRequestRecordComponent } from './return-request-record/gd-rsd-c-return-request-record.component';

@NgModule({
  declarations: [GDRSDReturnRequestRecordComponent],
  imports: [
    CommonModule,
    GDRSDReturnRequestRecordRoutingModule,
    SharedModule,
    // MsgRsbMRegisterRequestGoodsModule,
    SharedRequestModule,
  ],
  providers: [],
})
export class GDRSDReturnRequestRecordModule {}
