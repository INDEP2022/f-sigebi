/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { GoodsDepositaryRoutingModule } from './goods-depositary-routing.module';

/** COMPONENTS IMPORTS */
import { GoodsDepositaryComponent } from './goods-depositary/goods-depositary.component';

@NgModule({
  declarations: [GoodsDepositaryComponent],
  imports: [CommonModule, GoodsDepositaryRoutingModule, SharedModule],
})
export class GoodsDepositaryModule {}
