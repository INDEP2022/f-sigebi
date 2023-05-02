import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AceptProgrammingFormComponent } from './acept-programming-form/acept-programming-form.component';

const routes: Routes = [
  {
    path: '',
    component: AceptProgrammingFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AceptProgrammingRoutingModule {}
