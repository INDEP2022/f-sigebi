/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { GoodsDepositaryRoutingModule } from './goods-depositary-routing.module';

/** COMPONENTS IMPORTS */
import { GoodsDepositaryComponent } from './goods-depositary/goods-depositary.component';

@NgModule({
  declarations: [GoodsDepositaryComponent],
  imports: [
    CommonModule,
    GoodsDepositaryRoutingModule,
    DelegationSharedComponent,
    SharedModule,
  ],
})
export class GoodsDepositaryModule {}
