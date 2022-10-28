/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routesFormalizacionInmuebles } from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  {
    path: routesFormalizacionInmuebles[0].link,
    loadChildren: async () =>
      (
        await import(
          './capture-formalizing-lawyers/pj-fi-af-m-capture-formalizing-lawyers.module'
        )
      ).PJFIAFCaptureFormalizingLawyersModule,
    data: { title: routesFormalizacionInmuebles[0].label },
  },
  {
    path: routesFormalizacionInmuebles[1].link,
    loadChildren: async () =>
      (
        await import(
          './formal-goods-estate/pj-fi-pf-m-formal-goods-estate.module'
        )
      ).PJFIPFFormalGoodsEstateModule,
    data: { title: routesFormalizacionInmuebles[1].label },
  },
];
console.log(routes);
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentDispersalProcessRoutingModule {}
