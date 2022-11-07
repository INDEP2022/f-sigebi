/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routesSecurity } from 'src/app/common/constants/security/rutas-nombres-pantallas-security';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  {
    path: routesSecurity[0].link,
    loadChildren: async () =>
      (await import('./password-calendar/s-cc-m-password-calendar.module'))
        .SCCPasswordCalendarModule,
    data: { title: routesSecurity[0].label },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityRoutingModule {}
