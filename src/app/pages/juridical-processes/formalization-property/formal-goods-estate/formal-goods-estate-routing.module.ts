/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { FormalGoodsEstateComponent } from './formal-goods-estate/formal-goods-estate.component';

const routes: Routes = [
  {
    path: '',
    component: FormalGoodsEstateComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormalGoodsEstateRoutingModule {}
