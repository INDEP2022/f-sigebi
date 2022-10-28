/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJBVAEGoodsProcessValidationExtdomRoutingModule } from './pj-bvae-m-goods-process-validation-extdom-routing.module';

/** COMPONENTS IMPORTS */
import { PJBVAEGoodsProcessValidationExtdomComponent } from './goods-process-validation-extdom/pj-bvae-c-goods-process-validation-extdom.component';

@NgModule({
  declarations: [PJBVAEGoodsProcessValidationExtdomComponent],
  imports: [
    CommonModule,
    PJBVAEGoodsProcessValidationExtdomRoutingModule,
    SharedModule,
  ],
})
export class PJBVAEGoodsProcessValidationExtdomModule {}
