import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceOfPublicMinistriesComponent } from './maintenance-of-public-ministries/maintenance-of-public-ministries.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceOfPublicMinistriesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceOfPublicMinistriesRoutingModule {}
