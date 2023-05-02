/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { RegisterRequestGoodsModule } from '../../../manage-similar-goods/register-request-goods/register-request-goods.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { ApproveReturnRequestRoutingModule } from './approve-return-request-routing.module';

/** COMPONENTS IMPORTS */
import { ApproveReturnRequestComponent } from './approve-return-request/approve-return-request.component';

@NgModule({
  declarations: [ApproveReturnRequestComponent],
  imports: [
    CommonModule,
    ApproveReturnRequestRoutingModule,
    SharedModule,
    RegisterRequestGoodsModule,
  ],
  providers: [],
})
export class ApproveReturnRequestModule {}
