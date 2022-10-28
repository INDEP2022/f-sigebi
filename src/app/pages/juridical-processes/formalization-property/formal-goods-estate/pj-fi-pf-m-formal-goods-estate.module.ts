/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { TabsModule } from 'ngx-bootstrap/tabs';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJFIPFFormalGoodsEstateRoutingModule } from './pj-fi-pf-m-formal-goods-estate-routing.module';

/** COMPONENTS IMPORTS */
import { PJFIPFFormalGoodsEstateComponent } from './formal-goods-estate/pj-fi-pf-c-formal-goods-estate.component';

@NgModule({
  declarations: [PJFIPFFormalGoodsEstateComponent],
  imports: [
    CommonModule,
    PJFIPFFormalGoodsEstateRoutingModule,
    SharedModule,
    TabsModule,
  ],
})
export class PJFIPFFormalGoodsEstateModule {}
