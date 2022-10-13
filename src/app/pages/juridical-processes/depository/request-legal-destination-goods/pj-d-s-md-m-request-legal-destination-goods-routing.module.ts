/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDSMDRequestLegalDestinationGoodsComponent } from './request-legal-destination-goods/pj-d-s-md-c-request-legal-destination-goods.component';



const routes: Routes = [
    {
        path: '',
        component: PJDSMDRequestLegalDestinationGoodsComponent
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class PJDSMDRequestLegalDestinationGoodsRoutingModule { }