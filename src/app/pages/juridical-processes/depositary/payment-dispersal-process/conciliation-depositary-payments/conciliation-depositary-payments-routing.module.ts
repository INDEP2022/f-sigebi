/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { ConciliationDepositaryPaymentsComponent } from './conciliation-depositary-payments/conciliation-depositary-payments.component';

const routes: Routes = [
  {
    path: '',
    component: ConciliationDepositaryPaymentsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConciliationDepositaryPaymentsRoutingModule {}
