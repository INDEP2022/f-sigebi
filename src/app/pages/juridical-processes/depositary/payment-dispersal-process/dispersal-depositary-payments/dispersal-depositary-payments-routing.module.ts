/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { DispersalDepositaryPaymentsComponent } from './dispersal-depositary-payments/dispersal-depositary-payments.component';

const routes: Routes = [
  {
    path: '',
    component: DispersalDepositaryPaymentsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DispersalDepositaryPaymentsRoutingModule {}
