/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDAEHistoricalSituationGoodsComponent } from './historical-situation-goods/pj-d-ea-c-historical-situation-goods.component';

const routes: Routes = [
  {
    path: '',
    component: PJDAEHistoricalSituationGoodsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDAEHistoricalSituationGoodsRoutingModule {}
