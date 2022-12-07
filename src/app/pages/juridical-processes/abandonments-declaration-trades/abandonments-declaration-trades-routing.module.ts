/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { AbandonmentsDeclarationTradesComponent } from './abandonments-declaration-trades/abandonments-declaration-trades.component';

const routes: Routes = [
  {
    path: '',
    component: AbandonmentsDeclarationTradesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbandonmentsDeclarationTradesRoutingModule {}
