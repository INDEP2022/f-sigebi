/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDNENotificationsFileComponent } from './notifications-file/pj-d-ne-c-notifications-file.component';

const routes: Routes = [
  {
    path: '',
    component: PJDNENotificationsFileComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDNENotificationsFileRoutingModule {}
