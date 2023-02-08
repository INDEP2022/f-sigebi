import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceptionStrategiesComponent } from './reception-strategies/reception-strategies.component';

const routes: Routes = [
  {
    path: '',
    component: ReceptionStrategiesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceptionStrategiesRoutingModule {}
