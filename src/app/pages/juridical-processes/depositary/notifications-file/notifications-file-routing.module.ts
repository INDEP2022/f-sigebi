/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { NotificationsFileComponent } from './notifications-file/notifications-file.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationsFileComponent,
  },
  {
    path: ':id',
    component: NotificationsFileComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsFileRoutingModule {}
