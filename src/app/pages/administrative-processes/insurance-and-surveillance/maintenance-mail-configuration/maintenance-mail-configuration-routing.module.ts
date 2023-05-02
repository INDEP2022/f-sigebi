import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceMailConfigurationComponent } from './maintenance-mail-configuration/maintenance-mail-configuration.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceMailConfigurationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceMailConfigurationRoutingModule {}
