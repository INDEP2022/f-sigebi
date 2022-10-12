import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrFlatFileNotificationsComponent } from './dr-flat-file-notifications/dr-flat-file-notifications.component';

const routes: Routes = [
  {
    path: '',
    component: DrFlatFileNotificationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrFlatFileNotificationsRoutingModule {}
