import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecuteSchedulingDeliveriesComponent } from './execute-scheduling-deliveries/execute-scheduling-deliveries.component';
import { SchedulingDeliveriesFormComponent } from './scheduling-deliveries-form/scheduling-deliveries-form.component';

const routes: Routes = [
  {
    path: '',
    component: SchedulingDeliveriesFormComponent,
  },
  {
    path: 'execute-schelude-delivery',
    component: ExecuteSchedulingDeliveriesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SchedulingDeliveriesRoutigModule {}
