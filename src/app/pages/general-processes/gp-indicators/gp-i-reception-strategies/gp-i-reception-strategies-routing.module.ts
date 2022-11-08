import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpIReceptionStrategiesComponent } from './gp-i-reception-strategies/gp-i-reception-strategies.component';

const routes: Routes = [
  {
    path: '',
    component: GpIReceptionStrategiesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpIReceptionStrategiesRoutingModule {}
