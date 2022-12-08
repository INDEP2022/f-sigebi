import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationAssociationComponent } from './notification-association/notification-association.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationAssociationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationAssociationRoutingModule {}
