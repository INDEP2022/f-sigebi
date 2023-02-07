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
          './capture-formalizing-lawyers/capture-formalizing-lawyers.module'
        )
      ).CaptureFormalizingLawyersModule,
    data: { title: routesFormalizacionInmuebles[0].label, screen: 'FCOMER095' },
  },
  {
    path: routesFormalizacionInmuebles[1].link,
    loadChildren: async () =>
      (await import('./formal-goods-estate/formal-goods-estate.module'))
        .FormalGoodsEstateModule,
    data: { title: routesFormalizacionInmuebles[1].label, screen: 'FCOMER094' },
  },
];
console.log(routes);
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentDispersalProcessRoutingModule {}
