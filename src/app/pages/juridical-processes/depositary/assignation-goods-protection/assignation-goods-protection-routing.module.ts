/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { AssignationGoodsProtectionComponent } from './assignation-goods-protection/assignation-goods-protection.component';

const routes: Routes = [
  {
    path: '',
    component: AssignationGoodsProtectionComponent,
  },
  {
    path: ':id',
    component: AssignationGoodsProtectionComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignationGoodsProtectionRoutingModule {}
