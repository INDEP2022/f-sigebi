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
  {
    path: routesSecurity[1].link,
    loadChildren: async () =>
      (await import('./system-access/s-m-system-access.module'))
        .SSystemAccessModule,
    data: { title: routesSecurity[1].label },
  },
  {
    path: routesSecurity[2].link,
    loadChildren: async () =>
      (await import('./change-password/s-cc-m-change-password.module'))
        .SCCChangePasswordModule,
    data: { title: routesSecurity[2].label },
  },
  {
    path: routesSecurity[3].link,
    loadChildren: async () =>
      (await import('./report-access-user/s-rau-m-report-access-user.module'))
        .SRAUReportAccessUserModule,
    data: { title: routesSecurity[3].label },
  },
  {
    path: routesSecurity[4].link,
    loadChildren: async () =>
      (await import('./users/s-m-users.module')).SUsersModule,
    data: { title: routesSecurity[4].label },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityRoutingModule {}
