/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDPDPQueryRelatedPaymentsDepositoriesComponent } from './query-related-payments-depositories/pj-d-pdp-c-query-related-payments-depositories.component';



const routes: Routes = [
    {
        path: '',
        component: PJDPDPQueryRelatedPaymentsDepositoriesComponent
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PJDPDPQueryRelatedPaymentsDepositoriesRoutingModule { }