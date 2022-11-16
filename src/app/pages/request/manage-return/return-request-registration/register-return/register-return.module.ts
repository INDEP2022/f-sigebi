/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { MsgRsbMRegisterRequestGoodsModule } from '../../../manage-similar-goods/register-request-goods/msg-rsb-m-register-request-goods.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { GDRSDRegisterReturnRoutingModule } from './register-return-routing.module';

/** COMPONENTS IMPORTS */
import { GDRSDRegisterReturnComponent } from './register-return/gd-rsd-c-register-return.component';

@NgModule({
  declarations: [GDRSDRegisterReturnComponent],
  imports: [
    CommonModule,
    GDRSDRegisterReturnRoutingModule,
    SharedModule,
    MsgRsbMRegisterRequestGoodsModule,
  ],
  providers: [],
})
export class GDRSDRegisterReturnModule {}
