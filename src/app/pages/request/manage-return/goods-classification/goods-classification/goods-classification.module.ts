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
import { GoodsClassificationRoutingModule } from './goods-classification-routing.module';

/** COMPONENTS IMPORTS */
import { GoodsClassificationComponent } from './goods-classification/goods-classification.component';

@NgModule({
  declarations: [GoodsClassificationComponent],
  imports: [
    CommonModule,
    GoodsClassificationRoutingModule,
    SharedModule,
    SharedRequestModule,
    // RegisterRequestGoodsModule,
  ],
  providers: [],
})
export class GoodsClassificationModule {}
