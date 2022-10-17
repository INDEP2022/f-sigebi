import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonitorUnavoidableAssetsComponent } from './monitor-unavoidable-assets/monitor-unavoidable-assets.component';

const routes: Routes = [
  {
    path: '',
    component: MonitorUnavoidableAssetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonitorUnavoidableAssetsRoutingModule {}
