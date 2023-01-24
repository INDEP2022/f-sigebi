/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../../shared-request/shared-request.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
// import { RegisterRequestGoodsModule } from '../../../manage-similar-goods/register-request-goods/register-request-goods.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { ReturnRequestRecordRoutingModule } from './return-request-record-routing.module';

/** COMPONENTS IMPORTS */
import { ReturnRequestRecordComponent } from './return-request-record/return-request-record.component';

@NgModule({
  declarations: [ReturnRequestRecordComponent],
  imports: [
    CommonModule,
    ReturnRequestRecordRoutingModule,
    SharedModule,
    // RegisterRequestGoodsModule,
    SharedRequestModule,
  ],
  providers: [],
})
export class ReturnRequestRecordModule {}
