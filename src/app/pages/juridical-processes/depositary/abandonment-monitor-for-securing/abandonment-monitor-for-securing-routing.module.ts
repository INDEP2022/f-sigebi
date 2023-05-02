import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbandonmentMonitorForSecuringComponent } from './abandonment-monitor-for-securing/abandonment-monitor-for-securing.component';

const routes: Routes = [
  {
    path: '',
    component: AbandonmentMonitorForSecuringComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbandonmentMonitorForSecuringRoutingModule {}
