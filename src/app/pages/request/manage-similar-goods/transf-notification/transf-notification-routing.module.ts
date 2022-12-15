import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransfNotificationComponent } from './transf-notification/transf-notification.component';

const routes: Routes = [
  {
    path: '',
    component: TransfNotificationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransfNotificationRoutingModule {}
