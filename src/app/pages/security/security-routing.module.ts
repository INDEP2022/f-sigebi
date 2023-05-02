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
      (await import('./password-calendar/password-calendar.module'))
        .PasswordCalendarModule,
    data: { title: routesSecurity[0].label, screen: 'FACTSEGCALENDPASS' },
  },
  {
    path: routesSecurity[1].link,
    loadChildren: async () =>
      (await import('./system-access/system-access.module')).SystemAccessModule,
    data: { title: routesSecurity[1].label, screen: 'FACTSEGACCESOS' },
  },
  {
    path: routesSecurity[2].link,
    loadChildren: async () =>
      (await import('./change-password/change-password.module'))
        .ChangePasswordModule,
    data: { title: routesSecurity[2].label, screen: 'FACTSEGPASSWORD' },
  },
  {
    path: routesSecurity[3].link,
    loadChildren: async () =>
      (await import('./report-access-user/report-access-user.module'))
        .ReportAccessUserModule,
    data: { title: routesSecurity[3].label, screen: 'FGERSEGPANTALLUSU' },
  },
  {
    path: routesSecurity[4].link,
    loadChildren: async () =>
      (await import('./users/users.module')).UsersModule,
    data: { title: routesSecurity[4].label, screen: 'FCATSEGMANUSUARIO' },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityRoutingModule {}
