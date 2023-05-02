import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SatSubjectsRegisterComponent } from './sat-subjects-register/sat-subjects-register.component';

const routes: Routes = [
  {
    path: '',
    component: SatSubjectsRegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SatSubjectsRegisterRoutingModule {}
