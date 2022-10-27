/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDRAAssignationGoodsProtectionComponent } from './assignation-goods-protection/pj-d-ra-c-assignation-goods-protection.component';

const routes: Routes = [
  {
    path: '',
    component: PJDRAAssignationGoodsProtectionComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDRAAssignationGoodsProtectionRoutingModule {}
