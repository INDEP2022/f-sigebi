/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJReturnAbandonmentMonitorComponent } from './return-abandonment-monitor/pj-c-return-abandonment-monitor.component';

const routes: Routes = [
  {
    path: '',
    component: PJReturnAbandonmentMonitorComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJReturnAbandonmentMonitorRoutingModule {}
