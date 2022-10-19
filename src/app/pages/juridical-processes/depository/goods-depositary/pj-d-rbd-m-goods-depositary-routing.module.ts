/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDRBDGoodsDepositaryComponent } from './goods-depositary/pj-d-rbd-c-goods-depositary.component';

const routes: Routes = [
  {
    path: '',
    component: PJDRBDGoodsDepositaryComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDRBDGoodsDepositaryRoutingModule {}
