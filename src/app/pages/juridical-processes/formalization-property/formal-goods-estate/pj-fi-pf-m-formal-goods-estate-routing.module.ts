/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJFIPFFormalGoodsEstateComponent } from './formal-goods-estate/pj-fi-pf-c-formal-goods-estate.component';

const routes: Routes = [
  {
    path: '',
    component: PJFIPFFormalGoodsEstateComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJFIPFFormalGoodsEstateRoutingModule {}
