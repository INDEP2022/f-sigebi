import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveillanceServiceComponent } from './surveillance-service/surveillance-service.component';

const routes: Routes = [
  {
    path: '',
    component: SurveillanceServiceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveillanceServiceRoutingModule {}
