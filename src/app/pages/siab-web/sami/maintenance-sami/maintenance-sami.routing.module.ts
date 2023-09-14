import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceSamiComponent } from './maintenance-sami.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceSamiComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceSamiRoutingModule {}
