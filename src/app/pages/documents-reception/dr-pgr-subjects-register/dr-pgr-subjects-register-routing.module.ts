import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrPgrSubjectsRegisterComponent } from './dr-pgr-subjects-register/dr-pgr-subjects-register.component';

const routes: Routes = [
  {
    path: '',
    component: DrPgrSubjectsRegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrPgrSubjectsRegisterRoutingModule {}
