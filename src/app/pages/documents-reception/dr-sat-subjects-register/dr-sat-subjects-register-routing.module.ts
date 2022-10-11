import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrSatSubjectsRegisterComponent } from './dr-sat-subjects-register/dr-sat-subjects-register.component';

const routes: Routes = [
  {
    path: '',
    component: DrSatSubjectsRegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrSatSubjectsRegisterRoutingModule {}
