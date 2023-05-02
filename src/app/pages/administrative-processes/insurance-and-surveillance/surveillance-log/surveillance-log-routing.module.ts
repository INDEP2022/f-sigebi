import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveillanceLogComponent } from './surveillance-log/surveillance-log.component';

const routes: Routes = [
  {
    path: '',
    component: SurveillanceLogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveillanceLogRoutingModule {}
