/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { AssignationGoodsProtectionRoutingModule } from './assignation-goods-protection-routing.module';

/** COMPONENTS IMPORTS */
import { ExpedientSharedComponent } from 'src/app/@standalone/shared-forms/expedient-shared/expedient-shared.component';
import { AssignationGoodsProtectionComponent } from './assignation-goods-protection/assignation-goods-protection.component';

@NgModule({
  declarations: [AssignationGoodsProtectionComponent],
  imports: [
    CommonModule,
    AssignationGoodsProtectionRoutingModule,
    ExpedientSharedComponent,
    SharedModule,
  ],
})
export class AssignationGoodsProtectionModule {}
