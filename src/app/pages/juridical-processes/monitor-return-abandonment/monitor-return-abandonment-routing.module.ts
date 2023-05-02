/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { MonitorReturnAbandonmentComponent } from './monitor-return-abandonment/monitor-return-abandonment.component';

const routes: Routes = [
  {
    path: '',
    component: MonitorReturnAbandonmentComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonitorReturnAbandonmentRoutingModule {}
