import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDPnPendingNotificationsComponent } from './jp-d-pn-pending-notifications/jp-d-pn-pending-notifications.component';

const routes: Routes = [
  {
    path: '',
    component: JpDPnPendingNotificationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMPendingNotificationsRoutingModule {}
