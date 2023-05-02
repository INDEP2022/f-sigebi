/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { QueryRelatedPaymentsDepositoriesComponent } from './query-related-payments-depositories/query-related-payments-depositories.component';

const routes: Routes = [
  {
    path: '',
    component: QueryRelatedPaymentsDepositoriesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueryRelatedPaymentsDepositoriesRoutingModule {}
