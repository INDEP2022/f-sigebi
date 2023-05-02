import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceOfAreasComponent } from './maintenance-of-areas/maintenance-of-areas.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceOfAreasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceOfAreasRoutingModule {}
