/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDSMDRequestLegalDestinationGoodsRoutingModule } from './pj-d-s-md-m-request-legal-destination-goods-routing.module';

/** COMPONENTS IMPORTS */
import { PJDSMDRequestLegalDestinationGoodsComponent } from './request-legal-destination-goods/pj-d-s-md-c-request-legal-destination-goods.component';

@NgModule({
  declarations: [
    PJDSMDRequestLegalDestinationGoodsComponent
  ],
  imports: [
    CommonModule,
    PJDSMDRequestLegalDestinationGoodsRoutingModule,
    SharedModule,
  ],
})
export class PJDSMDRequestLegalDestinationGoodsModule {}
