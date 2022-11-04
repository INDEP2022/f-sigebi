/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJMonitorReturnAbandonmentComponent } from './monitor-return-abandonment/pj-c-monitor-return-abandonment.component';

const routes: Routes = [
  {
    path: '',
    component: PJMonitorReturnAbandonmentComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJMonitorReturnAbandonmentRoutingModule {}
