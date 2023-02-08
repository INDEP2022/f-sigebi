/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { RequestLegalDestinationGoodsComponent } from './request-legal-destination-goods/request-legal-destination-goods.component';

const routes: Routes = [
  {
    path: '',
    component: RequestLegalDestinationGoodsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestLegalDestinationGoodsRoutingModule {}
