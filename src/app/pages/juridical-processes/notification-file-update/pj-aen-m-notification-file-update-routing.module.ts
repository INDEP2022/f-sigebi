/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJAENNotificationFileUpdateComponent } from './notification-file-update/pj-aen-c-notification-file-update.component';

const routes: Routes = [
  {
    path: '',
    component: PJAENNotificationFileUpdateComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJAENNotificationFileUpdateRoutingModule {}
