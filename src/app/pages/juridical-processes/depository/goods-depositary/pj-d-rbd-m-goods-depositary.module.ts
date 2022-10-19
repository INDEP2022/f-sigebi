/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDRBDGoodsDepositaryRoutingModule } from './pj-d-rbd-m-goods-depositary-routing.module';

/** COMPONENTS IMPORTS */
import { PJDRBDGoodsDepositaryComponent } from './goods-depositary/pj-d-rbd-c-goods-depositary.component';

@NgModule({
  declarations: [PJDRBDGoodsDepositaryComponent],
  imports: [CommonModule, PJDRBDGoodsDepositaryRoutingModule, SharedModule],
})
export class PJDRBDGoodsDepositaryModule {}
