import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPMaCMaintenanceOfAreasComponent } from './c-p-ma-c-maintenance-of-areas/c-p-ma-c-maintenance-of-areas.component';

const routes: Routes = [
  {
    path: '',
    component: CPMaCMaintenanceOfAreasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMMaintenanceOfAreasRoutingModule {}
