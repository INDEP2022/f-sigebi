/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { HistoricalSituationGoodsComponent } from './historical-situation-goods/historical-situation-goods.component';

const routes: Routes = [
  {
    path: '',
    component: HistoricalSituationGoodsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoricalSituationGoodsRoutingModule {}
