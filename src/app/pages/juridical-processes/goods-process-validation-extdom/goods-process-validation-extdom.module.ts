/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { GoodsProcessValidationExtdomRoutingModule } from './goods-process-validation-extdom-routing.module';

/** COMPONENTS IMPORTS */
import { GoodsProcessValidationExtdomComponent } from './goods-process-validation-extdom/goods-process-validation-extdom.component';

@NgModule({
  declarations: [GoodsProcessValidationExtdomComponent],
  imports: [
    CommonModule,
    GoodsProcessValidationExtdomRoutingModule,
    SharedModule,
  ],
})
export class GoodsProcessValidationExtdomModule {}
