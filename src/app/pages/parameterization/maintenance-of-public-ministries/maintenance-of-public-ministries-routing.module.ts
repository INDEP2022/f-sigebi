import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceListComponent } from './maintenance-list/maintenance-list.component';

const routes: Routes = [
  {
    path: '',
    //component: MaintenanceOfPublicMinistriesComponent,
    component: MaintenanceListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceOfPublicMinistriesRoutingModule {}
