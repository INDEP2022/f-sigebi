import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlatFileNotificationsComponent } from './flat-file-notifications/flat-file-notifications.component';

const routes: Routes = [
  {
    path: '',
    component: FlatFileNotificationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrFlatFileNotificationsRoutingModule {}
