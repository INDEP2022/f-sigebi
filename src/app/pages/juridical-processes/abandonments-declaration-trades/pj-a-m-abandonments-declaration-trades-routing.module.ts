/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJAAbandonmentsDeclarationTradesComponent } from './abandonments-declaration-trades/pj-a-c-abandonments-declaration-trades.component';

const routes: Routes = [
  {
    path: '',
    component: PJAAbandonmentsDeclarationTradesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJAAbandonmentsDeclarationTradesRoutingModule {}
