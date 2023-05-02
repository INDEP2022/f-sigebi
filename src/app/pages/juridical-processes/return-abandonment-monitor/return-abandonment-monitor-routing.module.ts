/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { ReturnAbandonmentMonitorComponent } from './return-abandonment-monitor/return-abandonment-monitor.component';

const routes: Routes = [
  {
    path: '',
    component: ReturnAbandonmentMonitorComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReturnAbandonmentMonitorRoutingModule {}
