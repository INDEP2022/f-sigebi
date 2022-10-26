/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDRAAssignationGoodsProtectionRoutingModule } from './pj-d-ra-m-assignation-goods-protection-routing.module';

/** COMPONENTS IMPORTS */
import { PJDRAAssignationGoodsProtectionComponent } from './assignation-goods-protection/pj-d-ra-c-assignation-goods-protection.component';

@NgModule({
  declarations: [PJDRAAssignationGoodsProtectionComponent],
  imports: [
    CommonModule,
    PJDRAAssignationGoodsProtectionRoutingModule,
    SharedModule,
  ],
})
export class PJDRAAssignationGoodsProtectionModule {}
