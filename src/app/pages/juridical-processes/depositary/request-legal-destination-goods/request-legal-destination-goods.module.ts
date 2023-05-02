/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { RequestLegalDestinationGoodsRoutingModule } from './request-legal-destination-goods-routing.module';

/** COMPONENTS IMPORTS */
import { RequestLegalDestinationGoodsComponent } from './request-legal-destination-goods/request-legal-destination-goods.component';

@NgModule({
  declarations: [RequestLegalDestinationGoodsComponent],
  imports: [
    CommonModule,
    RequestLegalDestinationGoodsRoutingModule,
    SharedModule,
  ],
})
export class RequestLegalDestinationGoodsModule {}
