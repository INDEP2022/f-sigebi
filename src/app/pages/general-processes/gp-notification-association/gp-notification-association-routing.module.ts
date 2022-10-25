import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpNotificationAssociationComponent } from './gp-notification-association/gp-notification-association.component';

const routes: Routes = [
  {
    path: '',
    component: GpNotificationAssociationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpNotificationAssociationRoutingModule {}
